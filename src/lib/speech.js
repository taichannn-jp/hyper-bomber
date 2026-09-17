// src/lib/hyper-bomber/speech.js
// 音声認識と解答判定ロジック

// カタカナをひらがなに変換
export function toHiragana(str = '') {
  return str.replace(/[\u30a1-\u30f6]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

// ひらがなをカタカナに変換
export function toKatakana(str = '') {
  return str.replace(/[\u3041-\u3096]/g, (match) => {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}

// 文字列の正規化（スペース、記号除去、小文字化、語尾の助詞・挨拶の除去）
export function normalizeText(text = '') {
  return text
    .trim()
    .toLowerCase()
    .replace(/[、。！？\s\-_・/]/g, '')
    .replace(/(です|ます|だよ|だね|でした|ですね|かな|かも)$/, '');
}

/**
 * ユーザーの発話と正解候補を照合（柔軟かつ確実な判定）
 * @param {string} input - ユーザーの発話テキスト
 * @param {Array} answers - 正解リスト [{ id, text, kana, aliases: [] }]
 * @param {Array} answeredIds - すでに正解済みのID配列
 * @returns {object|null} マッチした解答オブジェクト、またはnull
 */
export function checkAnswer(input, answers, answeredIds = []) {
  if (!input || !answers || !Array.isArray(answers)) return null;

  const rawNorm = normalizeText(input);
  if (!rawNorm) return null;

  const hiraNorm = toHiragana(rawNorm);
  const kataNorm = toKatakana(rawNorm);

  for (const item of answers) {
    // 既に回答済みならスキップ
    if (answeredIds.includes(item.id)) continue;

    const targetList = [
      item.text,
      item.kana,
      ...(item.aliases || [])
    ].filter(Boolean);

    for (const target of targetList) {
      const targetNorm = normalizeText(target);
      if (!targetNorm) continue;

      const targetHira = toHiragana(targetNorm);
      const targetKata = toKatakana(targetNorm);

      // 1. 完全一致
      if (
        rawNorm === targetNorm ||
        hiraNorm === targetHira ||
        kataNorm === targetKata
      ) {
        return item;
      }

      // 2. 相互包含（インクルード）判定
      // 例: ユーザー「ソフトバンクホークス」 ⇔ 正解候補「ソフトバンク」「ホークス」「福岡ソフトバンクホークス」
      // 例: ユーザー「トトロ」 ⇔ 正解候補「となりのトトロ」
      if (targetNorm.length >= 2 && rawNorm.length >= 2) {
        // ユーザー入力が正解候補を含んでいる
        if (
          rawNorm.includes(targetNorm) ||
          hiraNorm.includes(targetHira) ||
          kataNorm.includes(targetKata)
        ) {
          return item;
        }

        // 正解候補がユーザー入力をまるごと含んでいる（入力が正解の略称やコア部分になっている場合）
        if (
          targetNorm.includes(rawNorm) ||
          targetHira.includes(hiraNorm) ||
          targetKata.includes(kataNorm)
        ) {
          return item;
        }
      }

      // 3. サフィックス差分吸収（駅、県、都、府、山、川など）
      if (targetNorm.length >= 2 && rawNorm.length >= 2) {
        if (rawNorm.startsWith(targetNorm) || targetNorm.startsWith(rawNorm)) {
          const diff = rawNorm.replace(targetNorm, '') || targetNorm.replace(rawNorm, '');
          if (['都', '道', '府', '県', '市', '島', '寺', '山', '駅', '線', '川', '球団'].includes(diff)) {
            return item;
          }
        }
      }
    }
  }

  return null;
}

/**
 * 音声認識コントローラークラス（高耐久オートリスタート機能付き）
 */
export class SpeechController {
  constructor({ onResult, onError, onStatusChange }) {
    this.recognition = null;
    this.isListening = false;
    this.onResult = onResult;
    this.onError = onError;
    this.onStatusChange = onStatusChange;
    this.shouldRestart = false;
    this.restartTimer = null;
  }

  isSupported() {
    return typeof window !== 'undefined' && (
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    );
  }

  start() {
    if (!this.isSupported()) {
      if (this.onError) this.onError('お使いのブラウザは音声認識に対応していません。Google Chrome等を推奨します。');
      return false;
    }

    this.shouldRestart = true;
    this._initAndStart();
    return true;
  }

  _initAndStart() {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'ja-JP';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStatusChange) this.onStatusChange(true);
    };

    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        const isFinal = event.results[i].isFinal;
        if (this.onResult) {
          this.onResult(transcript, isFinal);
        }
      }
    };

    this.recognition.onerror = (event) => {
      if (event.error === 'no-speech') return;
      console.warn('SpeechRecognition error:', event.error);
      if (this.onError && event.error !== 'aborted') {
        this.onError(`音声認識: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onStatusChange) this.onStatusChange(false);

      // ゲーム中であれば自動で確実に再起動
      if (this.shouldRestart) {
        clearTimeout(this.restartTimer);
        this.restartTimer = setTimeout(() => {
          if (this.shouldRestart) {
            try {
              this.recognition.start();
            } catch (e) {
              this._initAndStart();
            }
          }
        }, 200);
      }
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Speech start warning:', e);
    }
  }

  stop() {
    this.shouldRestart = false;
    clearTimeout(this.restartTimer);
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.isListening = false;
    if (this.onStatusChange) this.onStatusChange(false);
  }
}
