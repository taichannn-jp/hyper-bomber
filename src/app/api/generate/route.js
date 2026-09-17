// src/app/api/hyper-bomber/generate/route.js
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// フォールバック用の高品質プリセット問題集
const FALLBACK_QUESTIONS = [
  {
    question: "スタジオジブリが制作した劇場用アニメ映画 10個答えろ",
    category: "アニメ・映画",
    hint: "宮崎駿・高畑勲監督などの名作長編アニメ",
    answers: [
      { id: 1, text: "となりのトトロ", kana: "となりのととろ", aliases: ["トトロ"] },
      { id: 2, text: "千と千尋の神隠し", kana: "せんとちひろのかみかくし", aliases: ["千と千尋", "せんとちひろ"] },
      { id: 3, text: "もののけ姫", kana: "もののけひめ", aliases: ["もののけ"] },
      { id: 4, text: "天空の城ラピュタ", kana: "てんくうのしろらぴゅた", aliases: ["ラピュタ", "らぴゅた"] },
      { id: 5, text: "魔女の宅急便", kana: "まじょのたっきゅうびん", aliases: ["まじょたく", "魔女宅"] },
      { id: 6, text: "風の谷のナウシカ", kana: "かぜのたにのなうしか", aliases: ["ナウシカ", "なうしか"] },
      { id: 7, text: "ハウルの動く城", kana: "はうるのうごくしろ", aliases: ["ハウル", "はうる"] },
      { id: 8, text: "紅の豚", kana: "くれないのぶた", aliases: ["ポルコ"] },
      { id: 9, text: "崖の上のポニョ", kana: "がけのうえのぽにょ", aliases: ["ポニョ", "ぽにょ"] },
      { id: 10, text: "耳をすませば", kana: "みみをすませば", aliases: ["みみすま"] },
      { id: 11, text: "平成狸合戦ぽんぽこ", kana: "へいせいたぬきがっせんぽんぽこ", aliases: ["ぽんぽこ"] },
      { id: 12, text: "火垂るの墓", kana: "ほたるのはか", aliases: ["ほたる"] },
      { id: 13, text: "おもひでぽろぽろ", kana: "おもひでぽろぽろ", aliases: [] },
      { id: 14, text: "猫の恩返し", kana: "ねこのおんがえし", aliases: [] },
      { id: 15, text: "借りぐらしのアリエッティ", kana: "かりぐらしのありえってぃ", aliases: ["アリエッティ", "ありえってぃ"] },
      { id: 16, text: "風立ちぬ", kana: "かぜたちぬ", aliases: [] },
      { id: 17, text: "かぐや姫の物語", kana: "かぐやひめのものがたり", aliases: ["かぐや姫"] },
      { id: 18, text: "君たちはどう生きるか", kana: "きみたちはどういきるか", aliases: ["きみいき"] }
    ]
  },
  {
    question: "名前に「山」がつく日本の都道府県 10個答えろ",
    category: "地理",
    hint: "全国47都道府県の中から「山」が含まれる地域",
    answers: [
      { id: 1, text: "山形県", kana: "やまがたけん", aliases: ["山形", "やまがた"] },
      { id: 2, text: "福島県", kana: "ふくしまけん", aliases: ["福島", "ふくしま"] },
      { id: 3, text: "山梨県", kana: "やまなしけん", aliases: ["山梨", "やまなし"] },
      { id: 4, text: "富山県", kana: "とやまけん", aliases: ["富山", "とやま"] },
      { id: 5, text: "和歌山県", kana: "わかやまけん", aliases: ["和歌山", "わかやま"] },
      { id: 6, text: "岡山県", kana: "おかやまけん", aliases: ["岡山", "おかやま"] },
      { id: 7, text: "山口県", kana: "やまぐちけん", aliases: ["山口", "やまぐち"] },
      { id: 8, text: "徳島県", kana: "とくしまけん", aliases: ["徳島", "とくしま"] } // ※「山」が入る県は山形・山梨・富山・和歌山・岡山・山口の6つしかないため、実質難問
    ]
  },
  {
    question: "JR山手線の駅名 10個答えろ",
    category: "交通・地理",
    hint: "全30駅のうち10駅答えればクリア！",
    answers: [
      { id: 1, text: "東京", kana: "とうきょう", aliases: ["東京駅"] },
      { id: 2, text: "新宿", kana: "しんじゅく", aliases: ["新宿駅"] },
      { id: 3, text: "渋谷", kana: "しぶや", aliases: ["渋谷駅"] },
      { id: 4, text: "池袋", kana: "いけぶくろ", aliases: ["池袋駅"] },
      { id: 5, text: "品川", kana: "しながわ", aliases: ["品川駅"] },
      { id: 6, text: "上野", kana: "うえの", aliases: ["上野駅"] },
      { id: 7, text: "秋葉原", kana: "あきはばら", aliases: ["秋葉原駅", "アキバ"] },
      { id: 8, text: "新橋", kana: "しんばし", aliases: ["新橋駅"] },
      { id: 9, text: "恵比寿", kana: "えびす", aliases: ["恵比寿駅"] },
      { id: 10, text: "原宿", kana: "はらじゅく", aliases: ["原宿駅"] },
      { id: 11, text: "目黒", kana: "めぐろ", aliases: ["目黒駅"] },
      { id: 12, text: "大崎", kana: "おおさき", aliases: ["大崎駅"] },
      { id: 13, text: "五反田", kana: "ごたんだ", aliases: ["五反田駅"] },
      { id: 14, text: "高田馬場", kana: "たかだのばば", aliases: ["ばば", "高田馬場駅"] },
      { id: 15, text: "神田", kana: "かんだ", aliases: ["神田駅"] },
      { id: 16, text: "有楽町", kana: "ゆうらくちょう", aliases: ["有楽町駅"] },
      { id: 17, text: "浜松町", kana: "はままつちょう", aliases: ["浜松町駅"] },
      { id: 18, text: "田町", kana: "たまち", aliases: ["田町駅"] },
      { id: 19, text: "高輪ゲートウェイ", kana: "たかなわげーとうぇい", aliases: ["高輪ゲートウェイ駅", "たかなわ"] },
      { id: 20, text: "日暮里", kana: "にっぽり", aliases: ["日暮里駅"] },
      { id: 21, text: "西日暮里", kana: "にしにっぽり", aliases: ["西日暮里駅"] },
      { id: 22, text: "田端", kana: "たばた", aliases: ["田端駅"] },
      { id: 23, text: "駒込", kana: "こまごめ", aliases: ["駒込駅"] },
      { id: 24, text: "巣鴨", kana: "すがも", aliases: ["巣鴨駅"] },
      { id: 25, text: "大塚", kana: "おおつか", aliases: ["大塚駅"] },
      { id: 26, text: "目白", kana: "めじろ", aliases: ["目白駅"] },
      { id: 27, text: "新大久保", kana: "しんおおくぼ", aliases: ["新大久保駅"] },
      { id: 28, text: "代々木", kana: "よよぎ", aliases: ["代々木駅"] },
      { id: 29, text: "御徒町", kana: "おかちまち", aliases: ["御徒町駅"] },
      { id: 30, text: "鶯谷", kana: "うぐいすだに", aliases: ["鶯谷駅"] }
    ]
  },
  {
    question: "サッカーFIFAワールドカップで優勝経験のある国 答えろ",
    category: "スポーツ",
    hint: "これまでに世界王者になったことがある国（全8カ国）",
    answers: [
      { id: 1, text: "ブラジル", kana: "ぶらじる", aliases: [] },
      { id: 2, text: "ドイツ", kana: "どいつ", aliases: ["西ドイツ"] },
      { id: 3, text: "イタリア", kana: "いたりあ", aliases: [] },
      { id: 4, text: "アルゼンチン", kana: "あるぜんちん", aliases: [] },
      { id: 5, text: "フランス", kana: "ふらんす", aliases: [] },
      { id: 6, text: "ウルグアイ", kana: "うるぐあい", aliases: [] },
      { id: 7, text: "スペイン", kana: "すぺいん", aliases: [] },
      { id: 8, text: "イングランド", kana: "いんぐらんど", aliases: ["イギリス"] }
    ]
  },
  {
    question: "ことわざ「犬も歩けば棒に当たる」など いろはかるたの頭文字『あ〜こ』のことわざ 10個答えろ",
    category: "言葉・一般常識",
    hint: "犬・論・花・憎・骨・葦・旅・論・年・良など有名なことわざ",
    answers: [
      { id: 1, text: "犬も歩けば棒に当たる", kana: "いぬもあるけばぼうにあたる", aliases: ["いぬもあるけば"] },
      { id: 2, text: "論より証拠", kana: "ろんよりしょうこ", aliases: [] },
      { id: 3, text: "花より団子", kana: "はなよりだんご", aliases: ["はなよりだんご"] },
      { id: 4, text: "憎まれっ子世にはばかる", kana: "にくまれっこよにはばかる", aliases: ["にくまれっこ"] },
      { id: 5, text: "骨折り損のくたびれ儲け", kana: "ほねおりぞんのくたびれもうけ", aliases: ["ほねおりぞん"] },
      { id: 6, text: "屁をひって尻すぼめ", kana: "へをひってしりすぼめ", aliases: [] },
      { id: 7, text: "年寄りの冷や水", kana: "としよりのひやみず", aliases: [] },
      { id: 8, text: "ちりも積もれば山となる", kana: "ちりもつもればやまとなる", aliases: ["ちりつも"] },
      { id: 9, text: "律義者の子沢山", kana: "りちぎもののこだくさん", aliases: [] },
      { id: 10, text: "盗人の昼寝", kana: "ぬすびとのひるね", aliases: [] },
      { id: 11, text: "瑠璃も玻璃も照らせば光る", kana: "るりもはりもてらせばひかる", aliases: [] },
      { id: 12, text: "老いては子に従え", kana: "おいてはこにしたがえ", aliases: [] }
    ]
  }
];

const QUESTIONS_FILE = path.join(process.cwd(), 'src/data/hyper_bomber_questions.json');

// 保存されている問題集を取得
function getStoredQuestions() {
  try {
    if (fs.existsSync(QUESTIONS_FILE)) {
      const data = fs.readFileSync(QUESTIONS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to read questions file:', e);
  }
  return FALLBACK_QUESTIONS;
}

// 新規生成された問題をJSONファイルに追記・記憶
function saveQuestionToStore(newQuestion) {
  try {
    const list = getStoredQuestions();
    // 既存の問題と重複していなければ保存
    if (!list.some(q => q.question === newQuestion.question)) {
      const updated = [newQuestion, ...list];
      fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(updated, null, 2), 'utf8');
      console.log('Saved new question to persistent store. Total:', updated.length);
    }
  } catch (e) {
    console.warn('Failed to persist new question:', e);
  }
}

export async function GET() {
  const list = getStoredQuestions();
  return NextResponse.json({
    totalCount: list.length,
    questions: list
  });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { category = "ランダム", customTheme = "", apiKey = "", forceGemini = false, usedIds = [] } = body;

    const storedQuestions = getStoredQuestions();

    // 1. forceGemini でない場合、かつ customTheme がない場合は、ストックから即座にランダム出題（待ち時間0秒！）
    if (!forceGemini && !customTheme) {
      let filtered = storedQuestions;
      if (category && category !== 'ランダム') {
        filtered = storedQuestions.filter(q => q.category.includes(category) || category.includes(q.category));
      }
      // 未使用のものを優先
      const available = filtered.filter(q => !usedIds.includes(q.id));
      const pool = available.length > 0 ? available : (filtered.length > 0 ? filtered : storedQuestions);

      if (pool.length > 0) {
        const picked = pool[Math.floor(Math.random() * pool.length)];
        return NextResponse.json({
          ...picked,
          source: 'local_stock',
          totalStock: storedQuestions.length
        });
      }
    }

    // 2. forceGemini またはカスタムテーマ指定、またはストックが尽きた場合はGeminiで新規生成
    const keysToTry = [
      apiKey,
      process.env.GEMINI_API_KEY,
      process.env.HYPER_BOMBER_GEMINI_KEY,
      process.env.NEXT_PUBLIC_GEMINI_API_KEY
    ].filter(Boolean);

    const themeInstruction = customTheme
      ? `テーマ「${customTheme}」に関するクイズにしてください。`
      : category && category !== "ランダム"
      ? `ジャンル「${category}」に関するクイズにしてください。`
      : `誰もが一度は聞いたことがある一般常識やエンタメ、地理、歴史、アニメなどの幅広いジャンルから出題してください。既存の定番問題と被らない新鮮で面白い問題をお願いします。`;

    const prompt = `
あなたはフジテレビの伝説的クイズ番組『ネプリーグ』の最終ステージ「ハイパーボンバー」のクイズ作家です。

チーム5人（または1人）が連続で正解していき、合計10個正解すれば完全制覇となる、臨場感あふれる「答えが10個以上（できれば15〜30個以上）存在する問題」を作成してください。

${themeInstruction}

【条件】
1. 問題文は「〜を10個答えろ！」のようなネプリーグのハイパーボンバー特有の煽り口調・命令形にしてください。
2. 正解候補は最低12個以上、できれば15〜25個ほど挙げてください。
3. プレイヤーが声で答える（音声認識する）ため、漢字表記だけでなく、「ひらがな読み（kana）」や、ありがちな別称・略称・通称（aliases）を必ず含めてください。
4. 必ず以下のJSONフォーマットのみを出力してください。Markdownのバッククォート(\`\`\`jsonなど)や解説文は一切出力せず、純粋なJSONオブジェクトのみを返してください。

{
  "question": "問題文（例: スタジオジブリのアニメ映画 10個答えろ！）",
  "category": "ジャンル名",
  "hint": "問題に関する補足やヒント（1行）",
  "answers": [
    {
      "id": 1,
      "text": "正解の正式名称（例: となりのトトロ）",
      "kana": "ひらがな読み（例: となりのととろ）",
      "aliases": ["別称1", "別称2", "略称"]
    }
  ]
}
`;

    const modelsToTry = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-3-flash-preview'];
    let lastError = null;
    let generatedData = null;

    for (const currentKey of keysToTry) {
      const ai = new GoogleGenAI({ apiKey: currentKey });
      for (const currentModel of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: currentModel,
            contents: prompt,
          });

          let rawText = response.text || '';
          rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(rawText);

          if (parsed.question && Array.isArray(parsed.answers) && parsed.answers.length >= 5) {
            const newId = `gemini_${Date.now()}`;
            generatedData = {
              id: newId,
              question: parsed.question,
              category: parsed.category || category || '一般',
              hint: parsed.hint || '',
              source: `gemini (${currentModel})`,
              answers: parsed.answers.map((a, idx) => ({
                id: idx + 1,
                text: a.text || '',
                kana: a.kana || a.text || '',
                aliases: Array.isArray(a.aliases) ? a.aliases : []
              }))
            };

            // アプリ内に永続保存・記憶！
            saveQuestionToStore(generatedData);
            break;
          }
        } catch (mErr) {
          lastError = mErr;
          console.warn(`Model ${currentModel} failed:`, mErr.message);
        }
      }
      if (generatedData) break;
    }

    if (generatedData) {
      return NextResponse.json({
        ...generatedData,
        totalStock: storedQuestions.length + 1
      });
    }

    // すべて失敗した場合はローカルストックまたはフォールバックから選定
    const randomPick = storedQuestions[Math.floor(Math.random() * storedQuestions.length)];
    return NextResponse.json({
      ...randomPick,
      source: 'local_stock (gemini fallback)',
      apiError: lastError ? lastError.message : 'Unknown error'
    });

  } catch (err) {
    console.error('Server error in hyper-bomber generate:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
