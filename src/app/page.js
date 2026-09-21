'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './page.module.css';
import { soundFX } from '@/lib/audio';
import { SpeechController, checkAnswer } from '@/lib/speech';
import { Volume2, VolumeX, Mic, MicOff, RotateCcw, Users, Music, Sparkles, CheckCircle2 } from 'lucide-react';

const GENRES = ['ランダム', 'アニメ・映画', '地理', 'スポーツ', '歴史・政治', '言葉・漢字', 'ゲーム・エンタメ', '日常・グルメ', 'ENGAWA', '画像・パネル'];

// シリンダーの色設定（1〜5枠）
const CYLINDER_COLORS = [
  styles.colorBlue,
  styles.colorGreen,
  styles.colorYellow,
  styles.colorOrange,
  styles.colorRed,
];

const DEFAULT_MEMBERS = ['名倉', '原田', '堀内', '泰造', 'ゲスト'];

export default function HyperBomberPage() {
  // ゲーム進行状態: 'setup' | 'loading' | 'playing' | 'exploding' | 'cleared' | 'result'
  const [gameState, setGameState] = useState('setup');

  // 参加メンバー設定（1〜5人）
  const [memberCount, setMemberCount] = useState(5);
  const [memberNames, setMemberNames] = useState(DEFAULT_MEMBERS);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [memberScores, setMemberScores] = useState([0, 0, 0, 0, 0]);

  // 設定
  const [category, setCategory] = useState('ランダム');
  const [customTheme, setCustomTheme] = useState('');
  const [timeLimit, setTimeLimit] = useState(60);
  const [customApiKey, setCustomApiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

  // クイズデータ＆ストック管理
  const [quiz, setQuiz] = useState(null);
  const [answeredItems, setAnsweredItems] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [usedQuestionIds, setUsedQuestionIds] = useState([]);
  const [totalStockCount, setTotalStockCount] = useState(20);
  const [isGeneratingGemini, setIsGeneratingGemini] = useState(false);
  const [geminiSuccessNotice, setGeminiSuccessNotice] = useState('');

  // 音声認識（本番用）
  const [speechActive, setSpeechActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [lastJudgedText, setLastJudgedText] = useState('');

  // マイクテスト専用
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [testTranscript, setTestTranscript] = useState('');
  const [testHistory, setTestHistory] = useState([]);

  // 参照
  const bgmAudioRef = useRef(null);
  const speechCtrlRef = useRef(null);
  const testSpeechCtrlRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // 初期ロード時に問題ストック数を取得
  useEffect(() => {
    fetch('/api/generate')
      .then(res => res.json())
      .then(data => {
        if (data.totalCount) setTotalStockCount(data.totalCount);
      })
      .catch(() => {});
  }, []);

  // 音量切り替え
  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFX.isMuted = next;
    if (bgmAudioRef.current) {
      bgmAudioRef.current.muted = next;
    }
  };

  // BGM切り替え
  const toggleBgm = () => {
    const next = !bgmEnabled;
    setBgmEnabled(next);
    if (bgmAudioRef.current) {
      if (next && gameState === 'playing') {
        bgmAudioRef.current.play().catch(() => {});
      } else {
        bgmAudioRef.current.pause();
      }
    }
  };

  // ゲームクリア処理
  const handleGameClear = useCallback(() => {
    setGameState('cleared');
    soundFX.playClear();
    if (bgmAudioRef.current) bgmAudioRef.current.pause();
    if (speechCtrlRef.current) speechCtrlRef.current.stop();
    clearInterval(timerIntervalRef.current);

    setTimeout(() => {
      setGameState('result');
    }, 3800);
  }, []);

  // タイムアップ爆破処理
  const handleExplode = useCallback(() => {
    setGameState('exploding');
    soundFX.playExplosion();
    if (bgmAudioRef.current) bgmAudioRef.current.pause();
    if (speechCtrlRef.current) speechCtrlRef.current.stop();
    clearInterval(timerIntervalRef.current);

    setTimeout(() => {
      setGameState('result');
    }, 2800);
  }, []);

  // 回答処理中のロック用Ref（多重判定・順番飛びバグ防止）
  const isProcessingAnswerRef = useRef(false);

  // クロージャの罠を防止するための最新Ref
  const quizRef = useRef(quiz);
  const gameStateRef = useRef(gameState);
  const answeredItemsRef = useRef(answeredItems);
  const memberScoresRef = useRef(memberScores);
  const currentTurnIndexRef = useRef(currentTurnIndex);
  const memberCountRef = useRef(memberCount);

  useEffect(() => { quizRef.current = quiz; }, [quiz]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { answeredItemsRef.current = answeredItems; }, [answeredItems]);
  useEffect(() => { memberScoresRef.current = memberScores; }, [memberScores]);
  useEffect(() => { currentTurnIndexRef.current = currentTurnIndex; }, [currentTurnIndex]);
  useEffect(() => { memberCountRef.current = memberCount; }, [memberCount]);

  // 解答判定＆メンバー交代（最新のRefを参照して確実に判定）
  const submitAnswer = useCallback((rawInput) => {
    const currentQuiz = quizRef.current;
    const currentGameState = gameStateRef.current;

    if (!currentQuiz || currentGameState !== 'playing') return;
    if (!rawInput || typeof rawInput !== 'string') return;
    if (isProcessingAnswerRef.current) return;

    const trimmed = rawInput.trim();
    if (!trimmed) return;

    const answeredIds = (answeredItemsRef.current || []).map(item => item.id);
    const matched = checkAnswer(trimmed, currentQuiz.answers, answeredIds);

    if (matched) {
      // 即座にロックをかけ、多重判定を完全防止
      isProcessingAnswerRef.current = true;
      setTranscript('');
      setTextInput('');
      setLastJudgedText(`⭕ 正解！ 「${matched.text}」`);

      soundFX.playCorrect();
      const nextAnswered = [...answeredItemsRef.current, matched];
      setAnsweredItems(nextAnswered);
      answeredItemsRef.current = nextAnswered;

      // 現在の回答者のスコアを1問加算
      const curIdx = currentTurnIndexRef.current;
      setMemberScores(prev => {
        const next = [...prev];
        next[curIdx] = (next[curIdx] || 0) + 1;
        return next;
      });

      const targetClearCount = quizRef.current?.answers ? Math.min(10, quizRef.current.answers.length) : 10;
      if (nextAnswered.length >= targetClearCount) {
        handleGameClear();
      } else {
        // 「OK! 次！」で確実に1人だけ次のメンバーへシリンダーを移行
        soundFX.playNextTurn();
        const nextIdx = (curIdx + 1) % memberCountRef.current;
        setCurrentTurnIndex(nextIdx);
        currentTurnIndexRef.current = nextIdx;
      }

      // 1.0秒間のクールダウン後に次の回答の受付を再開
      setTimeout(() => {
        isProcessingAnswerRef.current = false;
      }, 1000);
    } else {
      setLastJudgedText(`❌ 不正解 「${trimmed}」`);
      soundFX.playWrong();
    }
  }, [handleGameClear]);

  const submitAnswerRef = useRef(submitAnswer);
  useEffect(() => { submitAnswerRef.current = submitAnswer; }, [submitAnswer]);

  // パス処理（ペナルティ -5秒で次の人へ）
  const handlePass = () => {
    if (gameStateRef.current !== 'playing' || isProcessingAnswerRef.current) return;
    isProcessingAnswerRef.current = true;
    soundFX.playWrong();
    setTimeLeft(prev => Math.max(prev - 5, 1));
    soundFX.playNextTurn();
    const nextIdx = (currentTurnIndexRef.current + 1) % memberCountRef.current;
    setCurrentTurnIndex(nextIdx);
    currentTurnIndexRef.current = nextIdx;
    setTranscript('');
    setLastJudgedText('⚠️ パス (-5秒)');
    setTimeout(() => {
      isProcessingAnswerRef.current = false;
    }, 800);
  };

  // 本番用音声認識コントローラー（最新のRefを使って即時判定）
  useEffect(() => {
    const ctrl = new SpeechController({
      onResult: (text, isFinal) => {
        if (isProcessingAnswerRef.current) return;
        const currentQuiz = quizRef.current;
        const currentGameState = gameStateRef.current;

        setTranscript(text);

        if (!currentQuiz || currentGameState !== 'playing') return;

        // 中間結果・確定結果を問わず、正解にマッチしたら0.01秒で即判定！
        const answeredIds = (answeredItemsRef.current || []).map(item => item.id);
        const matched = checkAnswer(text, currentQuiz.answers, answeredIds);

        if (matched) {
          submitAnswerRef.current(text);
        } else if (isFinal && text.trim().length >= 2) {
          // 確定結果で不正解だった場合
          submitAnswerRef.current(text);
        }
      },
      onError: (msg) => {
        console.warn(msg);
      },
      onStatusChange: (listening) => {
        setSpeechActive(listening);
      }
    });

    speechCtrlRef.current = ctrl;
    return () => ctrl.stop();
  }, []);

  // マイクテストの開始・停止
  const toggleMicTest = () => {
    if (isTestingMic) {
      if (testSpeechCtrlRef.current) testSpeechCtrlRef.current.stop();
      setIsTestingMic(false);
      setTestTranscript('');
    } else {
      const testCtrl = new SpeechController({
        onResult: (text, isFinal) => {
          setTestTranscript(text);
          if (isFinal && text.trim()) {
            setTestHistory(prev => [text.trim(), ...prev].slice(0, 5));
          }
        },
        onError: (err) => {
          alert('マイクエラー: ' + err);
          setIsTestingMic(false);
        },
        onStatusChange: (listening) => {
          setIsTestingMic(listening);
        }
      });
      testSpeechCtrlRef.current = testCtrl;
      const started = testCtrl.start();
      if (started) {
        setIsTestingMic(true);
      }
    }
  };

  // ゲームスタート処理（ストックから即座にランダム出題 -> 待ち時間0秒！）
  const startGame = async () => {
    // マイクテストが動いていれば停止
    if (testSpeechCtrlRef.current) testSpeechCtrlRef.current.stop();
    setIsTestingMic(false);

    soundFX.init();
    setGameState('loading');
    setAnsweredItems([]);
    setTranscript('');
    setTextInput('');
    setLastJudgedText('');
    setCurrentTurnIndex(0);
    setMemberScores([0, 0, 0, 0, 0]);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          customTheme,
          apiKey: customApiKey,
          usedIds: usedQuestionIds,
          forceGemini: !!customTheme // カスタムテーマ時のみGemini動的生成
        })
      });

      const data = await res.json();
      if (!res.ok || !data.question) {
        throw new Error(data.error || '問題の取得に失敗しました');
      }

      setQuiz(data);
      if (data.id) {
        setUsedQuestionIds(prev => [...prev, data.id]);
      }
      if (data.totalStock) {
        setTotalStockCount(data.totalStock);
      }

      setTimeLeft(timeLimit);
      setGameState('playing');

      // BGM再生
      if (bgmAudioRef.current && bgmEnabled && !isMuted) {
        bgmAudioRef.current.currentTime = 0;
        bgmAudioRef.current.play().catch(e => console.warn('BGM auto-play prevented:', e));
      }

      // マイク音声認識開始
      if (speechCtrlRef.current) {
        speechCtrlRef.current.start();
      }
    } catch (err) {
      console.error('Quiz start error:', err);
      alert('問題の取得に失敗しました: ' + err.message);
      setGameState('setup');
    }
  };

  // Geminiで新しい問題を生成してアプリに記憶させる
  const generateNewQuestionWithGemini = async () => {
    setIsGeneratingGemini(true);
    setGeminiSuccessNotice('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          customTheme,
          apiKey: customApiKey,
          forceGemini: true
        })
      });
      const data = await res.json();
      if (data.question) {
        setTotalStockCount(prev => (data.totalStock || prev + 1));
        setGeminiSuccessNotice(`新問「${data.question}」を生成し、アプリに記憶しました！`);
        setTimeout(() => setGeminiSuccessNotice(''), 6000);
      } else {
        alert('生成に失敗しました: ' + (data.error || '不明なエラー'));
      }
    } catch (e) {
      alert('生成エラー: ' + e.message);
    } finally {
      setIsGeneratingGemini(false);
    }
  };

  // タイマーカウントダウン
  useEffect(() => {
    if (gameState !== 'playing') {
      clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          handleExplode();
          return 0;
        }
        const next = prev - 1;
        const isUrgent = next <= 15;
        soundFX.playTick(isUrgent);
        return next;
      });
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [gameState, handleExplode]);

  // リセット
  const resetGame = () => {
    if (bgmAudioRef.current) bgmAudioRef.current.pause();
    if (speechCtrlRef.current) speechCtrlRef.current.stop();
    clearInterval(timerIntervalRef.current);
    setGameState('setup');
    setQuiz(null);
    setAnsweredItems([]);
  };

  // メンバー名変更
  const updateMemberName = (index, name) => {
    setMemberNames(prev => {
      const next = [...prev];
      next[index] = name;
      return next;
    });
  };

  const energyPercent = Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100));
  const targetClearCount = quiz?.answers ? Math.min(10, quiz.answers.length) : 10;

  return (
    <div className={`${styles.container} ${gameState === 'exploding' ? styles.shaking : ''}`}>
      {/* BGM用オーディオ要素 */}
      <audio
        ref={bgmAudioRef}
        src="/videoplayback.mp4"
        loop
        preload="auto"
      />

      {/* 爆発エフェクト */}
      {gameState === 'exploding' && (
        <div className={styles.explosionOverlay}>
          <div className={styles.explosionFlash} />
          <div className={styles.explosionText}>💥 タイムアップ！大爆発！！ 💥</div>
          <p style={{ fontSize: '1.8rem', color: '#ffcc00', marginTop: '20px', fontWeight: 'bold' }}>
            クリアならず…！
          </p>
        </div>
      )}

      {/* 完全制覇エフェクト */}
      {gameState === 'cleared' && (
        <div className={styles.clearOverlay}>
          <div className={styles.clearText}>🏆 完全制覇達成!! 🏆</div>
          <p style={{ fontSize: '2.2rem', color: '#ffd700', marginTop: '16px', fontWeight: '900' }}>
            {targetClearCount}問正解！ステージクリア！！
          </p>
        </div>
      )}

      {/* スタジオ上部：番組風テロップバー */}
      <div className={styles.tvHeader}>
        <div className={styles.telopLeft}>
          <span className={styles.telopBadge}>
            {quiz?.category || (category === 'ランダム' ? '日常＆エンタメの常識' : category)}
          </span>
          <span className={styles.telopSub}>
            挑戦チーム: {memberNames.slice(0, memberCount).join('・')}
          </span>
        </div>

        <div className={styles.telopRight}>
          <div className={styles.targetBadge}>
            最終決戦 {targetClearCount}コ答えろ
          </div>

          <div className={styles.headerControls}>
            <button className={styles.controlBtn} onClick={toggleBgm}>
              <Music size={16} />
              {bgmEnabled ? 'BGM ON' : 'BGM OFF'}
            </button>
            <button className={styles.controlBtn} onClick={toggleSound}>
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {isMuted ? '消音中' : 'SE ON'}
            </button>
          </div>
        </div>
      </div>

      {/* 1. セットアップ画面（メンバー登録・ルール設定・マイクテスト） */}
      {gameState === 'setup' && (
        <div className={styles.memberSetupBox} style={{ maxWidth: '840px', width: '92%', margin: '20px auto' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#ffd700', textAlign: 'center', fontWeight: 900, marginBottom: '14px' }}>
            💥 ハイパーボンバー チームエントリー 💥
          </h2>

          {/* ① マイク音声認識テスト用パネル（ご要望第1点） */}
          <div style={{
            background: '#0a0d18',
            border: '2px dashed #3d4b7a',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mic size={20} color={isTestingMic ? '#ff0055' : '#888'} />
                <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.95rem' }}>
                  🎤 マイク音声認識テストパネル（文字起こし確認用）
                </span>
              </div>
              <button
                style={{
                  background: isTestingMic ? '#ff0055' : '#28355c',
                  border: '1px solid ' + (isTestingMic ? '#ff5588' : '#4d5f99'),
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
                onClick={toggleMicTest}
              >
                {isTestingMic ? '⏹️ テスト停止' : '🎙️ マイクテスト開始'}
              </button>
            </div>

            {isTestingMic ? (
              <div style={{ background: '#121626', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ff0055' }}>
                <div style={{ fontSize: '0.8rem', color: '#ff5588', fontWeight: 'bold', marginBottom: '4px' }}>
                  ● マイク認識中（マイクに向かって「東京」「トトロ」など声を出してみてください）:
                </div>
                <div style={{ fontSize: '1.2rem', color: '#00ffcc', fontWeight: 900 }}>
                  {testTranscript ? `「${testTranscript}」` : '（声を聞き取っています...）'}
                </div>
                {testHistory.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#8888aa' }}>
                    認識履歴: {testHistory.map((h, i) => <span key={i} style={{ marginRight: '8px', color: '#bbb' }}>✓ {h}</span>)}
                  </div>
                )}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#8888aa' }}>
                ※「マイクテスト開始」を押すと、あなたのマイクが正しく文字起こしできているかを本番前に確認できます。
              </p>
            )}
          </div>

          {/* 参加人数 */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', color: '#aaaacc', fontWeight: 'bold', marginBottom: '6px' }}>
              <Users size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
              参加人数（1〜5人）
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: memberCount === num ? '2px solid #ffcc00' : '1px solid #444',
                    background: memberCount === num ? 'linear-gradient(135deg, #ff0055, #ff5500)' : '#1e2238',
                    color: '#fff',
                    fontWeight: 900,
                    cursor: 'pointer'
                  }}
                  onClick={() => setMemberCount(num)}
                >
                  {num}人
                </button>
              ))}
            </div>
          </div>

          {/* メンバー名 */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', color: '#aaaacc', fontWeight: 'bold', marginBottom: '6px' }}>
              解答メンバーの名前（解答順）
            </label>
            <div className={styles.memberInputGrid}>
              {[...Array(memberCount)].map((_, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#ffd700', display: 'block', marginBottom: '4px' }}>
                    {idx + 1}枠
                  </span>
                  <input
                    type="text"
                    className={styles.memberSlotInput}
                    value={memberNames[idx] || ''}
                    placeholder={`メンバー${idx + 1}`}
                    onChange={(e) => updateMemberName(idx, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ジャンル選択 */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ color: '#aaaacc', fontWeight: 'bold' }}>
                問題ジャンル（ローカルストック全{totalStockCount}問からランダム即時出題！）
              </label>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffd700',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                disabled={isGeneratingGemini}
                onClick={generateNewQuestionWithGemini}
              >
                <Sparkles size={14} />
                {isGeneratingGemini ? 'Gemini生成中...' : '✨ 新問題をGeminiで生成・記憶'}
              </button>
            </div>

            {geminiSuccessNotice && (
              <div style={{ background: '#0a3d1c', border: '1px solid #00ff66', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '8px' }}>
                <CheckCircle2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px', color: '#00ff66' }} />
                {geminiSuccessNotice}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {GENRES.map((g) => {
                const isEngawa = g === 'ENGAWA';
                const isSelected = category === g;
                return (
                  <button
                    key={g}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      border: isSelected
                        ? '2px solid #E57730'
                        : (isEngawa ? '1px solid #4EC5D7' : '1px solid #014070'),
                      background: isSelected
                        ? 'linear-gradient(135deg, #E57730 0%, #014070 100%)'
                        : (isEngawa ? 'linear-gradient(135deg, #092540 0%, #071326 100%)' : '#071326'),
                      color: isEngawa && !isSelected ? '#4EC5D7' : '#fff',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      boxShadow: isSelected
                        ? '0 0 10px rgba(229, 119, 48, 0.6)'
                        : (isEngawa ? '0 0 6px rgba(78, 197, 215, 0.3)' : 'none')
                    }}
                    onClick={() => {
                      setCategory(g);
                      setCustomTheme('');
                    }}
                  >
                    {isEngawa ? '🌟 ENGAWA' : g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* カスタムテーマ */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', color: '#4EC5D7', fontWeight: 'bold', marginBottom: '6px' }}>
              またはカスタムテーマ（自由入力でGeminiが即時作成）
            </label>
            <input
              type="text"
              style={{ width: '100%', padding: '8px 12px', background: '#071326', border: '1px solid #4EC5D7', borderRadius: '6px', color: '#fff', fontSize: '0.9rem' }}
              placeholder="例: ポケモンの名前、ジブリ映画、歴代総理大臣、山手線駅名など（空欄ならストックから即時出題）"
              value={customTheme}
              onChange={(e) => setCustomTheme(e.target.value)}
            />
          </div>

          {/* 制限時間 */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', color: '#4EC5D7', fontWeight: 'bold', marginBottom: '6px' }}>
              制限時間（ネプリーグ公式標準: 60秒）
            </label>
            <select
              style={{ width: '100%', padding: '8px 10px', background: '#071326', border: '1px solid #4EC5D7', borderRadius: '6px', color: '#fff', fontSize: '0.9rem' }}
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
            >
              <option value={60}>60秒（★ネプリーグ公式基準）</option>
              <option value={45}>45秒（難関・プレッシャーモード）</option>
              <option value={90}>90秒（ゆったりプレイ）</option>
            </select>
          </div>

          <button
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(90deg, #E57730 0%, #ff8833 45%, #4EC5D7 100%)',
              border: '2px solid #4EC5D7',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '1.4rem',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(229, 119, 48, 0.5)'
            }}
            onClick={startGame}
          >
            🔥 ハイパーボンバー START!（待ち時間ゼロ） 🔥
          </button>
        </div>
      )}

      {/* 2. ローディング画面 */}
      {gameState === 'loading' && (
        <div style={{ textAlign: 'center', padding: '80px 20px', zIndex: 10 }}>
          <div style={{ fontSize: '3rem', animation: 'bounce 1s infinite alternate' }}>💣</div>
          <h2 style={{ fontSize: '1.8rem', color: '#ffd700', margin: '16px 0' }}>
            問題をロード中...
          </h2>
          <p style={{ color: '#aaaacc' }}>答えが10個以上あるクイズを準備しています。マイクを準備してください！</p>
        </div>
      )}

      {/* 3. プレイ画面（添付画像完全再現スタジオ） */}
      {(gameState === 'playing' || gameState === 'exploding' || gameState === 'cleared') && (
        <div className={styles.studioStage}>
          {/* 問題表示ボード */}
          <div className={styles.questionBoard}>
            <div className={styles.clearLampsRow}>
              {[...Array(targetClearCount)].map((_, idx) => (
                <div
                  key={idx}
                  className={`${styles.clearLamp} ${idx < answeredItems.length ? styles.clearLampOn : ''}`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>

            <h2 className={styles.questionTitle}>{quiz?.question}</h2>

            {/* 画像・パネル問題の場合の画像＆パネル回答進捗表示 */}
            {quiz?.image && (
              <div style={{ margin: '14px auto 6px', maxWidth: '680px', width: '100%', position: 'relative' }}>
                <img
                  src={quiz.image}
                  alt="クイズ問題画像"
                  style={{
                    width: '100%',
                    maxHeight: '340px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '3px solid #4EC5D7',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.8), 0 0 15px rgba(78, 197, 215, 0.4)',
                    background: '#000'
                  }}
                />

                {/* 各パネル（A〜I）のリアルタイム解答状況バッジ */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
                  {quiz.answers?.map((ans) => {
                    const isDone = answeredItems.some(item => item.id === ans.id || (ans.panel && item.text?.startsWith(ans.panel + ':')));
                    return (
                      <div
                        key={ans.id}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: 900,
                          background: isDone
                            ? 'linear-gradient(90deg, #E57730 0%, #ff4400 100%)'
                            : 'linear-gradient(135deg, #014070 0%, #071326 100%)',
                          border: isDone ? '2px solid #ffd700' : '1px solid #4EC5D7',
                          color: isDone ? '#ffffff' : '#4EC5D7',
                          boxShadow: isDone ? '0 0 12px #E57730' : 'none',
                          transform: isDone ? 'scale(1.05)' : 'scale(1)',
                          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                      >
                        {ans.panel ? `${ans.panel}: ` : ''}{isDone ? `済 ${ans.text.replace(/^[A-Z]:\s*/, '')}` : (ans.panel ? '未回答' : ans.text)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 中央タイマー表示 */}
          <div className={styles.centerTimerArea}>
            <div className={styles.officialTimer}>
              <div className={styles.officialTimerLabel}>REMAINING TIME</div>
              <div className={`${styles.officialTimerNumber} ${timeLeft <= 15 ? styles.officialTimerCritical : ''}`}>
                {String(timeLeft).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* 添付画像を完全再現した 5本の巨大発光シリンダー＆解答席 */}
          <div className={styles.cylindersContainer}>
            {[...Array(memberCount)].map((_, idx) => {
              const isActive = currentTurnIndex === idx;
              const memberName = memberNames[idx] || `席${idx + 1}`;
              const score = memberScores[idx] || 0;
              const colorClass = CYLINDER_COLORS[idx % CYLINDER_COLORS.length];

              return (
                <div
                  key={idx}
                  className={`${styles.cylinderUnit} ${isActive ? styles.cylinderUnitActive : styles.cylinderUnitInactive}`}
                >
                  {/* 解答中インジケーター（頭上点滅） */}
                  {isActive && (
                    <div className={styles.answeringIndicator}>
                      🔥 解答中!
                    </div>
                  )}

                  {/* メカニカル点火ヘッド */}
                  <div className={styles.cylinderHead}>
                    <div className={styles.cylinderHeadBolt} />
                  </div>

                  {/* ガラスシリンダー（液体エネルギーゲージ） */}
                  <div className={styles.glassTube}>
                    <div
                      className={`${styles.liquidLevel} ${colorClass}`}
                      style={{ height: `${energyPercent}%` }}
                    >
                      {/* 液面の火花・発光 */}
                      <div className={styles.liquidSurfaceGlow} />
                    </div>
                  </div>

                  {/* 解答席デスク（枠カラー #E57730, #4EC5D7, #014070 適用） */}
                  <div
                    className={`${styles.deskPodium} ${isActive ? styles.deskPodiumActive : ''}`}
                    style={{
                      borderColor: isActive ? '#E57730' : (idx % 2 === 0 ? '#4EC5D7' : '#E57730'),
                    }}
                  >
                    <div
                      className={styles.deskSlotBadge}
                      style={{
                        background: idx % 2 === 0
                          ? 'linear-gradient(90deg, #4EC5D7, #014070)'
                          : 'linear-gradient(90deg, #E57730, #140700)',
                        borderColor: idx % 2 === 0 ? '#4EC5D7' : '#E57730',
                      }}
                    >
                      {idx + 1}枠
                    </div>
                    <div className={styles.deskSlats} />
                    <div className={styles.deskMemberName}>{memberName}</div>
                    <div className={styles.deskScoreTag}>正解: {score}問</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 操作＆音声認識パネル */}
          <div className={styles.liveControlPanel}>
            <div className={styles.liveTranscriptRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#00ff66',
                  boxShadow: '0 0 10px #00ff66',
                  animation: 'pulse 1.5s infinite'
                }} />
                <Mic color="#00ff66" size={20} />
                <span style={{ fontSize: '0.85rem', color: '#00ffcc', fontWeight: 'bold' }}>
                  🎤 マイク常時認識中:
                </span>
                <span className={styles.liveTranscriptText}>
                  {transcript ? `「${transcript}」` : `（${memberNames[currentTurnIndex]}さん、声で叫んでください！）`}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className={styles.passButton} onClick={handlePass}>
                  パス（-5秒）
                </button>
              </div>
            </div>

            {/* キーボードフォールバック入力 */}
            <form
              className={styles.inputRow}
              onSubmit={(e) => {
                e.preventDefault();
                submitAnswer(textInput);
              }}
            >
              <input
                type="text"
                className={styles.keyboardInput}
                placeholder={`${memberNames[currentTurnIndex]}さんの回答を入力（Enterで送信）`}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              <button type="submit" className={styles.keyboardSubmit}>
                回答
              </button>
            </form>

            {lastJudgedText && (
              <div style={{ fontSize: '0.8rem', color: '#ffaa00', textAlign: 'right' }}>
                直前の判定: 「{lastJudgedText}」
              </div>
            )}
          </div>

          {/* ネプリーグ風メタリックロゴ */}
          <div className={styles.nepLogoArea}>
            <span className={styles.nepLogoText}>ネプリーグ</span>
          </div>
        </div>
      )}

      {/* 4. 結果画面 */}
      {gameState === 'result' && (
        <div className={styles.memberSetupBox} style={{ maxWidth: '820px', width: '92%', margin: '30px auto', textAlign: 'center' }}>
          {answeredItems.length >= targetClearCount ? (
            <>
              <h2 className={styles.clearText} style={{ fontSize: '2.8rem', marginBottom: '12px' }}>
                🎉 {targetClearCount}問完全制覇！ 🎉
              </h2>
              <p style={{ fontSize: '1.4rem', color: '#ffd700', fontWeight: 800 }}>
                残り時間: {timeLeft}秒 でステージクリア！！
              </p>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: '2.8rem', color: '#ff3333', fontWeight: 900, marginBottom: '12px' }}>
                💥 タイムアップ！大爆破！ 💥
              </h2>
              <p style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 800 }}>
                正解数: {answeredItems.length} / {targetClearCount}個
              </p>
            </>
          )}

          {/* 各メンバーの貢献度 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', margin: '20px 0' }}>
            {[...Array(memberCount)].map((_, idx) => (
              <div key={idx} style={{ background: '#101322', padding: '10px 16px', borderRadius: '8px', border: '1px solid #3d4466' }}>
                <div style={{ fontSize: '0.85rem', color: '#ffd700' }}>{idx + 1}枠: {memberNames[idx]}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#00ffcc' }}>{memberScores[idx] || 0}問</div>
              </div>
            ))}
          </div>

          {/* 正解一覧 */}
          <div style={{ textAlign: 'left', marginTop: '20px', background: '#0a0d1a', padding: '14px', borderRadius: '8px' }}>
            <h4 style={{ color: '#ffd700', marginBottom: '8px' }}>
              【問題】{quiz?.question}
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {quiz?.answers.map((ans) => {
                const isAnswered = answeredItems.some((item) => item.id === ans.id);
                return (
                  <span
                    key={ans.id}
                    style={{
                      background: isAnswered ? '#0f6630' : '#222538',
                      border: isAnswered ? '1px solid #00ff66' : '1px solid #444',
                      color: isAnswered ? '#fff' : '#8888aa',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: isAnswered ? 'bold' : 'normal'
                    }}
                  >
                    {isAnswered && '✓ '}
                    {ans.text} {ans.kana ? `(${ans.kana})` : ''}
                  </span>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
            <button
              style={{
                padding: '12px 28px',
                background: 'linear-gradient(90deg, #ff0055, #ff5500)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontWeight: 900,
                fontSize: '1.1rem',
                cursor: 'pointer'
              }}
              onClick={startGame}
            >
              <RotateCcw size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
              次の問題に挑戦
            </button>
            <button
              style={{
                padding: '12px 24px',
                background: '#22273d',
                border: '1px solid #48537d',
                borderRadius: '8px',
                color: '#fff',
                fontWeight: 800,
                fontSize: '1.1rem',
                cursor: 'pointer'
              }}
              onClick={resetGame}
            >
              設定に戻る
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
