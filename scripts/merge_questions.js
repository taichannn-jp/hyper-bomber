const fs = require('fs');
const path = require('path');

const questionsPath = path.join(__dirname, '../src/data/hyper_bomber_questions.json');
const existingQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// 1. 画像問題 15問
const newImageQuestions = [
  {
    id: "panel_beaf",
    type: "image_panel",
    image: "/images/panel_quiz/beaf25107d.png",
    question: "画像を見てA〜Iの銘柄牛が生産される都道府県を答えろ！",
    category: "画像・パネル",
    hint: "画像A〜Iのブランド牛が有名な都道府県をお答えください",
    answers: [
      { id: 1, panel: "A", text: "A: 松阪牛 → 三重県", kana: "みえけん", aliases: ["三重", "三重県", "みえ", "みえけん", "A", "Aの三重", "松阪牛"] },
      { id: 2, panel: "B", text: "B: 近江牛 → 滋賀県", kana: "しがけん", aliases: ["滋賀", "滋賀県", "しが", "しがけん", "B", "Bの滋賀", "近江牛"] },
      { id: 3, panel: "C", text: "C: 仙台牛 → 宮城県", kana: "みやぎけん", aliases: ["宮城", "宮城県", "みやぎ", "みやぎけん", "C", "Cの宮城", "仙台牛"] },
      { id: 4, panel: "D", text: "D: 飛騨牛 → 岐阜県", kana: "ぎふけん", aliases: ["岐阜", "岐阜県", "ぎふ", "ぎふけん", "D", "Dの岐阜", "飛騨牛"] },
      { id: 5, panel: "E", text: "E: 石垣牛 → 沖縄県", kana: "おきなわけん", aliases: ["沖縄", "沖縄県", "おきなわ", "おきなわけん", "E", "Eの沖縄", "石垣牛"] },
      { id: 6, panel: "F", text: "F: 十勝和牛 → 北海道", kana: "ほっかいどう", aliases: ["北海道", "ほっかいどう", "F", "Fの北海道", "十勝和牛"] },
      { id: 7, panel: "G", text: "G: 米沢牛 → 山形県", kana: "やまがたけん", aliases: ["山形", "山形県", "やまがた", "やまがたけん", "G", "Gの山形", "米沢牛"] },
      { id: 8, panel: "H", text: "H: 前沢牛 → 岩手県", kana: "いわてけん", aliases: ["岩手", "岩手県", "いわて", "いわてけん", "H", "Hの岩手", "前沢牛"] },
      { id: 9, panel: "I", text: "I: 常陸牛 → 茨城県", kana: "いばらきけん", aliases: ["茨城", "茨城県", "いばらき", "いばらきけん", "いばらぎ", "I", "Iの茨城", "常陸牛"] }
    ]
  },
  {
    id: "panel_book_and",
    type: "image_panel",
    image: "/images/panel_quiz/book251214.jpg",
    question: "画像を見て文学作品タイトル「〜と〜」の？に入る言葉を答えろ！",
    category: "画像・パネル",
    hint: "画像A〜Iの赤い四角（？）に入る言葉をお答えください",
    answers: [
      { id: 1, panel: "A", text: "A: ロミオとジュリエット", kana: "じゅりえっと", aliases: ["ジュリエット", "じゅりえっと", "A", "Aのジュリエット"] },
      { id: 2, panel: "B", text: "B: アリとキリギリス", kana: "きりぎりす", aliases: ["キリギリス", "きりぎりす", "B", "Bのキリギリス"] },
      { id: 3, panel: "C", text: "C: 戦争と平和", kana: "へいわ", aliases: ["平和", "へいわ", "C", "Cの平和"] },
      { id: 4, panel: "D", text: "D: 天使と悪魔", kana: "あくま", aliases: ["悪魔", "あくま", "D", "Dの悪魔"] },
      { id: 5, panel: "E", text: "E: 乳と卵", kana: "たまご", aliases: ["卵", "たまご", "らん", "乳と卵", "E", "Eの卵"] },
      { id: 6, panel: "F", text: "F: 点と線", kana: "せん", aliases: ["線", "せん", "F", "Fの線"] },
      { id: 7, panel: "G", text: "G: 蜜蜂と遠雷", kana: "えんらい", aliases: ["遠雷", "えんらい", "G", "Gの遠雷"] },
      { id: 8, panel: "H", text: "H: 老人と海", kana: "うみ", aliases: ["海", "うみ", "H", "Hの海"] },
      { id: 9, panel: "I", text: "I: 罪と罰", kana: "ばつ", aliases: ["罰", "ばつ", "I", "Iの罰"] }
    ]
  },
  {
    id: "panel_jukugo_read",
    type: "image_panel",
    image: "/images/panel_quiz/jukugo250915.jpg",
    question: "画像を見て漢字の別の読み方（？に入るひらがな）を答えろ！",
    category: "画像・パネル",
    hint: "画像A〜Iの？に入るひらがな、またはその読み方をお答えください",
    answers: [
      { id: 1, panel: "A", text: "A: 昨日 → さくじつ", kana: "さくじつ", aliases: ["さくじつ", "くじつ", "A", "Aのさくじつ"] },
      { id: 2, panel: "B", text: "B: 後々 → のちのち", kana: "のちのち", aliases: ["のちのち", "ちのち", "B", "Bののちのち"] },
      { id: 3, panel: "C", text: "C: 流行 → はやり", kana: "はやり", aliases: ["はやり", "やり", "C", "Cのはやり"] },
      { id: 4, panel: "D", text: "D: 気質 → かたぎ", kana: "かたぎ", aliases: ["かたぎ", "たぎ", "D", "Dのかたぎ"] },
      { id: 5, panel: "E", text: "E: 足跡 → そくせき", kana: "そくせき", aliases: ["そくせき", "くせき", "E", "Eのそくせき"] },
      { id: 6, panel: "F", text: "F: 金色 → こんじき", kana: "こんじき", aliases: ["こんじき", "んじき", "F", "Fのこんじき"] },
      { id: 7, panel: "G", text: "G: 微風 → そよかぜ", kana: "そよかぜ", aliases: ["そよかぜ", "よかぜ", "G", "Gのそよかぜ"] },
      { id: 8, panel: "H", text: "H: 銀杏 → いちょう", kana: "いちょう", aliases: ["いちょう", "ちょう", "H", "Hのいちょう"] },
      { id: 9, panel: "I", text: "I: 一寸 → ちょっと", kana: "ちょっと", aliases: ["ちょっと", "ょっと", "I", "Iのちょっと"] }
    ]
  },
  {
    id: "panel_kanyoku_hand",
    type: "image_panel",
    image: "/images/panel_quiz/kanyoku251027-2.jpg",
    question: "画像を見て「手」を使った慣用句の？に入る言葉を答えろ！",
    category: "画像・パネル",
    hint: "画像A〜Iの？に入る言葉をお答えください",
    answers: [
      { id: 1, panel: "A", text: "A: かゆい所に手が届く", kana: "かゆい", aliases: ["かゆい", "痒い", "A", "Aのかゆい"] },
      { id: 2, panel: "B", text: "B: 手に汗を握る", kana: "あせ", aliases: ["汗", "あせ", "B", "Bの汗"] },
      { id: 3, panel: "C", text: "C: 手も足も出ない", kana: "あし", aliases: ["足", "あし", "C", "Cの足"] },
      { id: 4, panel: "D", text: "D: 喉から手が出る", kana: "のど", aliases: ["喉", "のど", "D", "Dの喉"] },
      { id: 5, panel: "E", text: "E: 合いの手を入れる", kana: "あいのて", aliases: ["合いの手", "あい", "あいのて", "E", "Eの合いの手"] },
      { id: 6, panel: "F", text: "F: 手を替え品を替え", kana: "しな", aliases: ["品", "しな", "F", "Fの品"] },
      { id: 7, panel: "G", text: "G: 手玉に取る", kana: "てだま", aliases: ["玉", "手玉", "だま", "てだま", "G", "Gの手玉"] },
      { id: 8, panel: "H", text: "H: 濡れ手で粟", kana: "あわ", aliases: ["粟", "あわ", "H", "Hの粟"] },
      { id: 9, panel: "I", text: "I: 手の付けようがない", kana: "つけ", aliases: ["つけ", "付け", "施し", "ほどこし", "I", "Iのつけ"] }
    ]
  },
  {
    id: "panel_kanyouku_food",
    type: "image_panel",
    image: "/images/panel_quiz/kanyouku250907.jpg",
    question: "画像を見て食べ物が入る慣用句の？に入る言葉を答えろ！",
    category: "画像・パネル",
    hint: "画像A〜Iの？に入る食べ物をお答えください",
    answers: [
      { id: 1, panel: "A", text: "A: 胡麻を擂る（ごま）", kana: "ごま", aliases: ["胡麻", "ごま", "ゴマ", "A", "Aの胡麻"] },
      { id: 2, panel: "B", text: "B: 鯖を読む（さば）", kana: "さば", aliases: ["鯖", "さば", "サバ", "B", "Bの鯖"] },
      { id: 3, panel: "C", text: "C: 飴と鞭（あめ）", kana: "あめ", aliases: ["飴", "あめ", "アメ", "C", "Cの飴"] },
      { id: 4, panel: "D", text: "D: 鴨が葱を背負って来る（ねぎ）", kana: "ねぎ", aliases: ["葱", "ねぎ", "ネギ", "D", "Dの葱"] },
      { id: 5, panel: "E", text: "E: 絵に描いた餅（もち）", kana: "もち", aliases: ["餅", "もち", "モチ", "E", "Eの餅"] },
      { id: 6, panel: "F", text: "F: 梨の礫（なし）", kana: "なし", aliases: ["梨", "なし", "ナシ", "F", "Fの梨"] },
      { id: 7, panel: "G", text: "G: 火中の栗を拾う（くり）", kana: "くり", aliases: ["栗", "くり", "クリ", "G", "Gの栗"] },
      { id: 8, panel: "H", text: "H: 味噌を付ける（みそ）", kana: "みそ", aliases: ["味噌", "みそ", "ミソ", "H", "Hの味噌"] },
      { id: 9, panel: "I", text: "I: 濡れ手で粟（あわ）", kana: "あわ", aliases: ["粟", "あわ", "アワ", "I", "Iの粟"] }
    ]
  },
  {
    id: "panel_kanyouku_four",
    type: "image_panel",
    image: "/images/panel_quiz/kanyouku250915.jpg",
    question: "画像を見て慣用句・四字熟語の真ん中に入る言葉を答えろ！",
    category: "画像・パネル",
    hint: "画像A〜Iの赤い枠に入る言葉をお答えください",
    answers: [
      { id: 1, panel: "A", text: "A: 長蛇の列（だの）", kana: "だの", aliases: ["蛇の", "だの", "長蛇の列", "ちょうだのれつ", "A", "Aの蛇の"] },
      { id: 2, panel: "B", text: "B: 蚊帳の外（ちょうの）", kana: "ちょうの", aliases: ["帳の", "ちょうの", "やの", "蚊帳の外", "かやのそと", "B", "Bの帳の"] },
      { id: 3, panel: "C", text: "C: 台風の目（ふうの）", kana: "ふうの", aliases: ["風の", "ふうの", "台風の目", "たいふうのめ", "C", "Cの風の"] },
      { id: 4, panel: "D", text: "D: 高嶺の花（ねの）", kana: "ねの", aliases: ["嶺の", "ねの", "高嶺の花", "たかねのはな", "D", "Dの嶺の"] },
      { id: 5, panel: "E", text: "E: 草葉の陰（ばの）", kana: "ばの", aliases: ["葉の", "ばの", "草葉の陰", "くさばのかげ", "E", "Eの葉の"] },
      { id: 6, panel: "F", text: "F: 終の棲家（のすみ）", kana: "のすみ", aliases: ["の棲", "のすみ", "終の棲家", "ついのすみか", "F", "Fのの棲"] },
      { id: 7, panel: "G", text: "G: 至難の業（なんの）", kana: "なんの", aliases: ["難の", "なんの", "至難の業", "しなんのわざ", "G", "Gの難の"] },
      { id: 8, panel: "H", text: "H: 悪の温床（のおん）", kana: "のおん", aliases: ["の温", "のおん", "悪の温床", "あくのおんしょう", "H", "Hのの温"] },
      { id: 9, panel: "I", text: "I: 百も承知（もしょう）", kana: "もしょう", aliases: ["も承", "もしょう", "百も承知", "ひゃくもしょうち", "I", "Iのも承"] }
    ]
  },
  {
    id: "panel_kanyouku_start_a",
    type: "image_panel",
    image: "/images/panel_quiz/kanyouku251201-1.jpg",
    question: "画像を見て「あ」から始まる慣用句の？に入る言葉を答えろ！",
    category: "画像・パネル",
    hint: "画像A〜Iの？に入る「あ」から始まる言葉をお答えください",
    answers: [
      { id: 1, panel: "A", text: "A: 相槌を打つ", kana: "あいづち", aliases: ["相槌", "あいづち", "あいづちをうつ", "A", "Aの相槌"] },
      { id: 2, panel: "B", text: "B: 頭が上がらない", kana: "あたま", aliases: ["頭", "あたま", "あたまがあがらない", "B", "Bの頭"] },
      { id: 3, panel: "C", text: "C: 足並みを揃える", kana: "あしなみ", aliases: ["足並み", "あしなみ", "あしなみをそろえる", "C", "Cの足並み"] },
      { id: 4, panel: "D", text: "D: 暗礁に乗り上げる", kana: "あんしょう", aliases: ["暗礁", "あんしょう", "あんしょうにのりあげる", "D", "Dの暗礁"] },
      { id: 5, panel: "E", text: "E: 呆気に取られる", kana: "あっけ", aliases: ["呆気", "あっけ", "あっけにとられる", "E", "Eの呆気"] },
      { id: 6, panel: "F", text: "F: 愛嬌を振りまく", kana: "あいきょう", aliases: ["愛嬌", "あいきょう", "あいきょうをふりまく", "F", "Fの愛嬌"] },
      { id: 7, panel: "G", text: "G: 愛想が尽きる", kana: "あいそ", aliases: ["愛想", "あいそ", "あいそがつきる", "G", "Gの愛想"] },
      { id: 8, panel: "H", text: "H: 青写真を描く", kana: "あおしゃしん", aliases: ["青写真", "あおしゃしん", "あおしゃしんをえがく", "H", "Hの青写真"] },
      { id: 9, panel: "I", text: "I: 網の目をくぐる", kana: "あみ", aliases: ["網", "あみ", "あみのめをくぐる", "I", "Iの網"] }
    ]
  },
  {
    id: "panel_kotowaza_end_zu",
    type: "image_panel",
    image: "/images/panel_quiz/kotowaza251110.jpg",
    question: "画像を見て「〜ず」で終わることわざの上の句を答えろ！",
    category: "画像・パネル",
    hint: "画像A〜Iのことわざの前半または全文をお答えください",
    answers: [
      { id: 1, panel: "A", text: "A: 親の心子知らず", kana: "おやのこころこしらず", aliases: ["親の心子", "おやのこころこ", "親の心子知らず", "おやのこころこしらず", "A"] },
      { id: 2, panel: "B", text: "B: 立つ鳥跡を濁さず", kana: "たつとりあとをにごさず", aliases: ["立つ鳥跡を", "たつとりあとを", "立つ鳥跡を濁さず", "たつとりあとをにごさず", "B"] },
      { id: 3, panel: "C", text: "C: 虎穴に入らずんば虎子を得ず", kana: "こけつにいらずんばこじをえず", aliases: ["虎穴に入らずんば", "こけつにいらずんば", "虎穴に入らずんば虎子を得ず", "こじをえず", "C"] },
      { id: 4, panel: "D", text: "D: 覆水盆に返らず", kana: "ふくすいぼんにかえらず", aliases: ["覆水盆に", "ふくすいぼんに", "覆水盆に返らず", "ふくすいぼんにかえらず", "D"] },
      { id: 5, panel: "E", text: "E: 付かず離れず", kana: "つかずはなれず", aliases: ["離れず", "はなれず", "付かず離れず", "つかずはなれず", "E"] },
      { id: 6, panel: "F", text: "F: 虻蜂取らず", kana: "あぶはちとらず", aliases: ["虻蜂", "あぶはち", "虻蜂取らず", "あぶはちとらず", "F"] },
      { id: 7, panel: "G", text: "G: 罪を憎んで人を憎まず", kana: "つみをにくんでひとをにくまず", aliases: ["罪を憎んで人を", "つみをにくんでひとを", "罪を憎んで人を憎まず", "G"] },
      { id: 8, panel: "H", text: "H: 天は二物を与えず", kana: "てんはにぶつをあたえず", aliases: ["天は二物を", "てんはにぶつを", "天は二物を与えず", "H"] },
      { id: 9, panel: "I", text: "I: 春眠暁を覚えず", kana: "しゅんみんあかつきをおぼえず", aliases: ["春眠暁を", "しゅんみんあかつきを", "春眠暁を覚えず", "I"] }
    ]
  },
  {
    id: "panel_ramen_pref",
    type: "image_panel",
    image: "/images/panel_quiz/ramen251126d.jpg",
    question: "画像を見てA〜Iのご当地麺が有名な都道府県を答えろ！",
    category: "画像・パネル",
    hint: "画像A〜Iのご当地麺が生まれた都道府県をお答えください",
    answers: [
      { id: 1, panel: "A", text: "A: 博多ラーメン → 福岡県", kana: "ふくおかけん", aliases: ["福岡", "福岡県", "ふくおか", "ふくおかけん", "A", "博多ラーメン"] },
      { id: 2, panel: "B", text: "B: 盛岡冷麺 → 岩手県", kana: "いわてけん", aliases: ["岩手", "岩手県", "いわて", "いわてけん", "B", "盛岡冷麺"] },
      { id: 3, panel: "C", text: "C: 喜多方ラーメン → 福島県", kana: "ふくしまけん", aliases: ["福島", "福島県", "ふくしま", "ふくしまけん", "C", "喜多方ラーメン"] },
      { id: 4, panel: "D", text: "D: 荻窪ラーメン → 東京都", kana: "とうきょうと", aliases: ["東京", "東京都", "とうきょう", "とうきょうと", "D", "荻窪ラーメン"] },
      { id: 5, panel: "E", text: "E: 勝浦タンタンメン → 千葉県", kana: "ちばけん", aliases: ["千葉", "千葉県", "ちば", "ちばけん", "E", "勝浦タンタンメン"] },
      { id: 6, panel: "F", text: "F: 尾道ラーメン → 広島県", kana: "ひろしまけん", aliases: ["広島", "広島県", "ひろしま", "ひろしまけん", "F", "尾道ラーメン"] },
      { id: 7, panel: "G", text: "G: 津軽中華そば → 青森県", kana: "あおもりけん", aliases: ["青森", "青森県", "あおもり", "あおもりけん", "G", "津軽中華そば"] },
      { id: 8, panel: "H", text: "H: 富士つけナポリタン → 静岡県", kana: "しずおかけん", aliases: ["静岡", "静岡県", "しずおか", "しずおかけん", "H", "富士つけナポリタン"] },
      { id: 9, panel: "I", text: "I: 佐野ラーメン → 栃木県", kana: "とちぎけん", aliases: ["栃木", "栃木県", "とちぎ", "とちぎけん", "I", "佐野ラーメン"] }
    ]
  },
  {
    id: "panel_ryakugo",
    type: "image_panel",
    image: "/images/panel_quiz/ryakugo250915-1.jpg",
    question: "画像を見てA〜Iの略語の正式名称を答えろ！",
    category: "画像・パネル",
    hint: "画像A〜Iの略語の正式名称をお答えください",
    answers: [
      { id: 1, panel: "A", text: "A: 国連 → 国際連合", kana: "こくさいれんごう", aliases: ["国際連合", "こくさいれんごう", "A", "Aの国際連合"] },
      { id: 2, panel: "B", text: "B: 育休 → 育児休業", kana: "いくじきゅうぎょう", aliases: ["育児休業", "いくじきゅうぎょう", "育児休暇", "いくじきゅうか", "B", "Bの育児休業"] },
      { id: 3, panel: "C", text: "C: 模試 → 模擬試験", kana: "もぎしけん", aliases: ["模擬試験", "もぎしけん", "C", "Cの模擬試験"] },
      { id: 4, panel: "D", text: "D: 取説 → 取扱説明書", kana: "とりあつかいせつめいしょ", aliases: ["取扱説明書", "とりあつかいせつめいしょ", "取説", "D", "Dの取扱説明書"] },
      { id: 5, panel: "E", text: "E: 落研 → 落語研究会", kana: "らくごけんきゅうかい", aliases: ["落語研究会", "らくごけんきゅうかい", "落語研究部", "E", "Eの落語研究会"] },
      { id: 6, panel: "F", text: "F: 万博 → 万国博覧会", kana: "ばんこくはくらんかい", aliases: ["万国博覧会", "ばんこくはくらんかい", "国際博覧会", "F", "Fの万国博覧会"] },
      { id: 7, panel: "G", text: "G: 農協 → 農業協同組合", kana: "のうぎょうきょうどうくみあい", aliases: ["農業協同組合", "のうぎょうきょうどうくみあい", "JA", "G", "Gの農業協同組合"] },
      { id: 8, panel: "H", text: "H: 原付 → 原動機付自転車", kana: "げんどうきつきじてんしゃ", aliases: ["原動機付自転車", "げんどうきつきじてんしゃ", "H", "Hの原動機付自転車"] },
      { id: 9, panel: "I", text: "I: 外為 → 外国為替", kana: "がいこくかわせ", aliases: ["外国為替", "がいこくかわせ", "外為", "I", "Iの外国為替"] }
    ]
  },
  {
    id: "panel_taigigo",
    type: "image_panel",
    image: "/images/panel_quiz/taigigo25107d.png",
    question: "画像を見てカタカナ語の対義語を答えろ！",
    category: "画像・パネル",
    hint: "画像A〜Iの言葉の対義語をお答えください",
    answers: [
      { id: 1, panel: "A", text: "A: ラッキー ↕ アンラッキー", kana: "あんらっきー", aliases: ["アンラッキー", "あんらっきー", "バッド", "A", "Aのアンラッキー"] },
      { id: 2, panel: "B", text: "B: オフェンス ↕ ディフェンス", kana: "でぃふぇんす", aliases: ["ディフェンス", "でぃふぇんす", "デフェンス", "B", "Bのディフェンス"] },
      { id: 3, panel: "C", text: "C: ポジティブ ↕ ネガティブ", kana: "ねがてぃぶ", aliases: ["ネガティブ", "ねがてぃぶ", "C", "Cのネガティブ"] },
      { id: 4, panel: "D", text: "D: インナー ↕ アウター", kana: "あうたー", aliases: ["アウター", "あうたー", "D", "Dのアウター"] },
      { id: 5, panel: "E", text: "E: フィクション ↕ ノンフィクション", kana: "のんふぃくしょん", aliases: ["ノンフィクション", "のんふぃくしょん", "E", "Eのノンフィクション"] },
      { id: 6, panel: "F", text: "F: アナログ ↕ デジタル", kana: "でじたる", aliases: ["デジタル", "でじたる", "F", "Fのデジタル"] },
      { id: 7, panel: "G", text: "G: ログイン ↕ ログアウト", kana: "ろぐあうと", aliases: ["ログアウト", "ろぐあうと", "ログオフ", "G", "Gのログアウト"] },
      { id: 8, panel: "H", text: "H: クーリングダウン ↕ ウォーミングアップ", kana: "うぉーみんぐあっぷ", aliases: ["ウォーミングアップ", "うぉーみんぐあっぷ", "ウォームアップ", "H", "Hのウォーミングアップ"] },
      { id: 9, panel: "I", text: "I: プロローグ ↕ エピローグ", kana: "えぴろーぐ", aliases: ["エピローグ", "えぴろーぐ", "I", "Iのエピローグ"] }
    ]
  },
  {
    id: "panel_tv_first",
    type: "image_panel",
    image: "/images/panel_quiz/tv250907.jpg",
    question: "画像を見て初回の新聞テレビ欄から番組名を答えろ！",
    category: "画像・パネル",
    hint: "画像A〜Eのテレビ欄の？に入る名作テレビ番組名をお答えください",
    answers: [
      { id: 1, panel: "A", text: "A: 伊東家の食卓", kana: "いとうけのしょくたく", aliases: ["伊東家の食卓", "いとうけのしょくたく", "いとうけ", "A"] },
      { id: 2, panel: "B", text: "B: 銭形金太郎", kana: "ぜにがたきんたろう", aliases: ["銭形金太郎", "ぜにがたきんたろう", "ぜにきん", "B"] },
      { id: 3, panel: "C", text: "C: 8時だョ!全員集合", kana: "はちじだよぜんいんしゅうごう", aliases: ["8時だョ全員集合", "８時だョ！全員集合", "全員集合", "ぜんいんしゅうごう", "はちじだよぜんいんしゅうごう", "C"] },
      { id: 4, panel: "D", text: "D: スターどっきり（秘）報告", kana: "すたーどっきりまるひほうこく", aliases: ["スターどっきり秘報告", "スターどっきり", "スターどっきり報告", "すたーどっきり", "D"] },
      { id: 5, panel: "E", text: "E: トリビアの泉", kana: "とりびあのいずみ", aliases: ["トリビアの泉", "とりびあのいずみ", "トリビア", "E"] },
      { id: 6, panel: "F", text: "F: （ボーナス）", kana: "ぼーなす", aliases: ["ボーナス", "パス"] }
    ]
  },
  {
    id: "panel_internet_word",
    type: "image_panel",
    image: "/images/panel_quiz/word250824.jpg",
    question: "画像を見てインターネット・SNS用語の空欄に入る言葉を答えろ！",
    category: "画像・パネル",
    hint: "画像A〜Iの赤い枠に入るカタカナ用語をお答えください",
    answers: [
      { id: 1, panel: "A", text: "A: ダウンロード（ダウン）", kana: "だうん", aliases: ["ダウン", "だうん", "ダウンロード", "だうんろーど", "A"] },
      { id: 2, panel: "B", text: "B: タイムライン（ライン）", kana: "らいん", aliases: ["ライン", "らいん", "タイムライン", "たいむらいん", "B"] },
      { id: 3, panel: "C", text: "C: ストーリーズ（ストーリー）", kana: "すとーりー", aliases: ["ストーリー", "すとーりー", "ストーリーズ", "すとーりーず", "C"] },
      { id: 4, panel: "D", text: "D: ハッシュタグ（ハッシュ）", kana: "はっしゅ", aliases: ["ハッシュ", "はっしゅ", "ハッシュタグ", "はっしゅたぐ", "D"] },
      { id: 5, panel: "E", text: "E: クラウド（ラウ）", kana: "らう", aliases: ["ラウ", "らう", "クラウド", "くらうど", "E"] },
      { id: 6, panel: "F", text: "F: フェイクニュース（フェイク）", kana: "ふぇいく", aliases: ["フェイク", "ふぇいく", "フェイクニュース", "ふぇいくにゅーす", "F"] },
      { id: 7, panel: "G", text: "G: ファイアウォール（ファイア）", kana: "ふぁいあ", aliases: ["ファイア", "ふぁいあ", "ファイヤー", "ファイアウォール", "G"] },
      { id: 8, panel: "H", text: "H: ドメイン（メイ）", kana: "めい", aliases: ["メイ", "めい", "ドメイン", "どめいん", "H"] },
      { id: 9, panel: "I", text: "I: クッキー（Cookie）", kana: "くっきー", aliases: ["Cookie", "cookie", "クッキー", "くっきー", "オキ", "おき", "I"] }
    ]
  },
  {
    id: "panel_katakana_common",
    type: "image_panel",
    image: "/images/panel_quiz/word250907.jpg",
    question: "画像を見て前後に共通して入るカタカナ言葉を答えろ！",
    category: "画像・パネル",
    hint: "画像A〜Iの2つの言葉の？に共通して入るカタカナをお答えください",
    answers: [
      { id: 1, panel: "A", text: "A: オン（オンデマンド / アコーディオン）", kana: "おん", aliases: ["オン", "おん", "A", "Aのオン"] },
      { id: 2, panel: "B", text: "B: スター（スターダスト / オペラスター）", kana: "すたー", aliases: ["スター", "すたー", "B", "Bのスター"] },
      { id: 3, panel: "C", text: "C: クリーム（クリームソーダ / シュークリーム）", kana: "くりーむ", aliases: ["クリーム", "くりーむ", "C", "Cのクリーム"] },
      { id: 4, panel: "D", text: "D: ボトル（ボトルネック / ペットボトル）", kana: "ぼとる", aliases: ["ボトル", "ぼとる", "D", "Dのボトル"] },
      { id: 5, panel: "E", text: "E: レス（レスポンス / キャッシュレス）", kana: "れす", aliases: ["レス", "れす", "E", "Eのレス"] },
      { id: 6, panel: "F", text: "F: バス（バスタオル / コントラバス）", kana: "ばす", aliases: ["バス", "ばす", "F", "Fのバス"] },
      { id: 7, panel: "G", text: "G: ニック（ニックネーム / オーガニック）", kana: "にっく", aliases: ["ニック", "にっく", "G", "Gのニック"] },
      { id: 8, panel: "H", text: "H: アウト（アウトドア / カミングアウト）", kana: "あうと", aliases: ["アウト", "あうと", "H", "Hのアウト"] },
      { id: 9, panel: "I", text: "I: プレス（プレスリリース / ベンチプレス）", kana: "ぷれす", aliases: ["プレス", "ぷれす", "I", "Iのプレス"] }
    ]
  },
  {
    id: "panel_yasai_winter",
    type: "image_panel",
    image: "/images/panel_quiz/yasai251126.jpg",
    question: "画像を見てA〜Iの冬が旬の野菜の名前を答えろ！",
    category: "画像・パネル",
    hint: "画像A〜Iの野菜の名前をお答えください",
    answers: [
      { id: 1, panel: "A", text: "A: カリフラワー", kana: "かりふらわー", aliases: ["カリフラワー", "かりふらわー", "A", "Aのカリフラワー"] },
      { id: 2, panel: "B", text: "B: ふきのとう（蕗の薹）", kana: "ふきのとう", aliases: ["ふきのとう", "フキノトウ", "蕗の薹", "B", "Bのふきのとう"] },
      { id: 3, panel: "C", text: "C: チンゲンサイ（青梗菜）", kana: "ちんげんさい", aliases: ["チンゲンサイ", "ちんげんさい", "青梗菜", "チンゲン菜", "C", "Cのチンゲンサイ"] },
      { id: 4, panel: "D", text: "D: くわい（慈姑）", kana: "くわい", aliases: ["くわい", "クワイ", "慈姑", "D", "Dのくわい"] },
      { id: 5, panel: "E", text: "E: さといも（里芋）", kana: "さといも", aliases: ["さといも", "サトイモ", "里芋", "E", "Eのさといも"] },
      { id: 6, panel: "F", text: "F: れんこん（蓮根）", kana: "れんこん", aliases: ["れんこん", "レンコン", "蓮根", "F", "Fのれんこん"] },
      { id: 7, panel: "G", text: "G: かぶ（蕪）", kana: "かぶ", aliases: ["かぶ", "カブ", "蕪", "G", "Gのかぶ"] },
      { id: 8, panel: "H", text: "H: セロリ", kana: "せろり", aliases: ["セロリ", "せろり", "セルリー", "H", "Hのセロリ"] },
      { id: 9, panel: "I", text: "I: ゆりね（百合根）", kana: "ゆりね", aliases: ["ゆりね", "ユリネ", "百合根", "I", "Iのゆりね"] }
    ]
  }
];

// 2. 通常問題 20問
const newNormalQuestions = [
  {
    id: "q_yojijukugo_animal",
    question: "動物の名前（漢字）が含まれる四字熟語を10個答えろ！",
    category: "言葉・漢字",
    hint: "馬、鳥、犬、猿、虎、竜、牛、猫、魚などの漢字が入る四字熟語をお答えください",
    answers: [
      { id: 1, text: "馬耳東風", kana: "ばじとうふう", aliases: ["馬耳東風", "ばじとうふう"] },
      { id: 2, text: "一石二鳥", kana: "いっせきにちょう", aliases: ["一石二鳥", "いっせきにちょう"] },
      { id: 3, text: "弱肉強食", kana: "じゃくにくきょうしょく", aliases: ["弱肉強食", "じゃくにくきょうしょく"] },
      { id: 4, text: "虎視眈々", kana: "こしたんたん", aliases: ["虎視眈々", "こしたんたん"] },
      { id: 5, text: "犬猿の仲", kana: "けんえんのなか", aliases: ["犬猿の仲", "けんえんのなか"] },
      { id: 6, text: "烏合の衆", kana: "うごうのしゅう", aliases: ["烏合の衆", "うごうのしゅう"] },
      { id: 7, text: "猪突猛進", kana: "ちょとつもうしん", aliases: ["猪突猛進", "ちょとつもうしん"] },
      { id: 8, text: "画竜点睛", kana: "がりょうてんせい", aliases: ["画竜点睛", "がりょうてんせい"] },
      { id: 9, text: "竜頭蛇尾", kana: "りゅうとうだび", aliases: ["竜頭蛇尾", "りゅうとうだび"] },
      { id: 10, text: "牛飲馬食", kana: "ぎゅういんばしょく", aliases: ["牛飲馬食", "ぎゅういんばしょく"] },
      { id: 11, text: "羊頭狗肉", kana: "ようとうくにく", aliases: ["羊頭狗肉", "ようとうくにく"] },
      { id: 12, text: "鶴首苦慮", kana: "かくしゅくりょ", aliases: ["鶴首苦慮", "鶴寿千歳"] },
      { id: 13, text: "獅子奮迅", kana: "ししふんじん", aliases: ["獅子奮迅", "ししふんじん"] }
    ]
  },
  {
    id: "q_kihen_kanji",
    question: "「木偏（きへん）」の漢字を10個答えろ！（読みでも可）",
    category: "言葉・漢字",
    hint: "松、杉、桜、梅、机、校、林、森、材、村、板、枝、枚、根、柱など",
    answers: [
      { id: 1, text: "松（まつ）", kana: "まつ", aliases: ["松", "まつ", "しょう"] },
      { id: 2, text: "杉（すぎ）", kana: "すぎ", aliases: ["杉", "すぎ", "さん"] },
      { id: 3, text: "桜（さくら）", kana: "さくら", aliases: ["桜", "さくら", "おう"] },
      { id: 4, text: "梅（うめ）", kana: "うめ", aliases: ["梅", "うめ", "ばい"] },
      { id: 5, text: "机（つくえ）", kana: "つくえ", aliases: ["机", "つくえ", "き"] },
      { id: 6, text: "村（むら）", kana: "むら", aliases: ["村", "むら", "そん"] },
      { id: 7, text: "根（ね）", kana: "ね", aliases: ["根", "ね", "こん"] },
      { id: 8, text: "板（いた）", kana: "いた", aliases: ["板", "いた", "はん"] },
      { id: 9, text: "林（はやし）", kana: "はやし", aliases: ["林", "はやし", "りん"] },
      { id: 10, text: "森（もり）", kana: "もり", aliases: ["森", "もり", "しん"] },
      { id: 11, text: "枝（えだ）", kana: "えだ", aliases: ["枝", "えだ", "し"] },
      { id: 12, text: "柱（はしら）", kana: "はしら", aliases: ["柱", "はしら", "ちゅう"] },
      { id: 13, text: "橋（はし）", kana: "はし", aliases: ["橋", "はし", "きょう"] }
    ]
  },
  {
    id: "q_body_kotowaza",
    question: "体の一部（目・耳・口・手・足・鼻・腹・首・頭など）が入ることわざ・慣用句を10個答えろ！",
    category: "言葉・漢字",
    hint: "目から鱗、耳に蛸、口は災いの元、喉から手が出る、足が出る、首が回らないなど",
    answers: [
      { id: 1, text: "目から鱗（が落ちる）", kana: "めからうろこ", aliases: ["目から鱗", "めからうろこ"] },
      { id: 2, text: "口は災いの元", kana: "くちはわざわいのもと", aliases: ["口は災いの元", "くちはわざわいのもと"] },
      { id: 3, text: "耳に蛸ができる", kana: "みみにたこ", aliases: ["耳に蛸", "みみにたこ"] },
      { id: 4, text: "喉から手が出る", kana: "のどからてがでる", aliases: ["喉から手が出る", "のどからてがでる"] },
      { id: 5, text: "手も足も出ない", kana: "てもあしもでない", aliases: ["手も足も出ない", "てもあしもでない"] },
      { id: 6, text: "首を長くする", kana: "くびをながくする", aliases: ["首を長くする", "くびをながくする"] },
      { id: 7, text: "腹を割って話す", kana: "はらをわって", aliases: ["腹を割る", "はらをわる", "腹を割って"] },
      { id: 8, text: "鼻が高い", kana: "はながたかい", aliases: ["鼻が高い", "はながたかい"] },
      { id: 9, text: "頭が上がらない", kana: "あたまがあがらない", aliases: ["頭が上がらない", "あたまがあがらない"] },
      { id: 10, text: "眉をひそめる", kana: "まゆをひそめる", aliases: ["眉をひそめる", "まゆをひそめる"] },
      { id: 11, text: "足を引っ張る", kana: "あしをひっぱる", aliases: ["足を引っ張る", "あしをひっぱる"] },
      { id: 12, text: "尻に火がつく", kana: "しりにひがつく", aliases: ["尻に火がつく", "しりにひがつく"] }
    ]
  },
  {
    id: "q_shinkansen_nozomi",
    question: "東海道・山陽新幹線「のぞみ」の定期停車駅を10駅答えろ！",
    category: "地理",
    hint: "東京から博多までの「のぞみ」が停車する主要駅",
    answers: [
      { id: 1, text: "東京", kana: "とうきょう", aliases: ["東京", "とうきょう", "東京駅"] },
      { id: 2, text: "品川", kana: "しながわ", aliases: ["品川", "しながわ", "品川駅"] },
      { id: 3, text: "新横浜", kana: "しんよこはま", aliases: ["新横浜", "しんよこはま"] },
      { id: 4, text: "名古屋", kana: "なごや", aliases: ["名古屋", "なごや", "名古屋駅"] },
      { id: 5, text: "京都", kana: "きょうと", aliases: ["京都", "きょうと", "京都駅"] },
      { id: 6, text: "新大阪", kana: "しんおおさか", aliases: ["新大阪", "しんおおさか"] },
      { id: 7, text: "新神戸", kana: "しんこうべ", aliases: ["新神戸", "しんこうべ"] },
      { id: 8, text: "岡山", kana: "おかやま", aliases: ["岡山", "おかやま", "岡山駅"] },
      { id: 9, text: "広島", kana: "ひろしま", aliases: ["広島", "ひろしま", "広島駅"] },
      { id: 10, text: "小倉", kana: "こくら", aliases: ["小倉", "こくら", "小倉駅"] },
      { id: 11, text: "博多", kana: "はかた", aliases: ["博多", "はかた", "博多駅"] },
      { id: 12, text: "福山", kana: "ふくやま", aliases: ["福山", "ふくやま", "福山駅"] },
      { id: 13, text: "山口（新山口）", kana: "しんやまぐち", aliases: ["新山口", "しんやまぐち"] }
    ]
  },
  {
    id: "q_seirei_shitei",
    question: "日本の「政令指定都市」を10都市答えろ！",
    category: "地理",
    hint: "人口50万人以上で区がある都市（全国に20市存在）",
    answers: [
      { id: 1, text: "横浜市", kana: "よこはまし", aliases: ["横浜", "よこはま", "横浜市"] },
      { id: 2, text: "大阪市", kana: "おおさかし", aliases: ["大阪", "おおさか", "大阪市"] },
      { id: 3, text: "名古屋市", kana: "なごやし", aliases: ["名古屋", "なごや", "名古屋市"] },
      { id: 4, text: "札幌市", kana: "さっぽろし", aliases: ["札幌", "さっぽろ", "札幌市"] },
      { id: 5, text: "福岡市", kana: "ふくおかし", aliases: ["福岡", "ふくおか", "福岡市"] },
      { id: 6, text: "神戸市", kana: "こうべし", aliases: ["神戸", "こうべ", "神戸市"] },
      { id: 7, text: "京都市", kana: "きょうとし", aliases: ["京都", "きょうと", "京都市"] },
      { id: 8, text: "さいたま市", kana: "さいたまし", aliases: ["さいたま", "さいたまし"] },
      { id: 9, text: "広島市", kana: "ひろしまし", aliases: ["広島", "ひろしま", "広島市"] },
      { id: 10, text: "仙台市", kana: "せんだいし", aliases: ["仙台", "せんだい", "仙台市"] },
      { id: 11, text: "北九州市", kana: "きたきゅうしゅうし", aliases: ["北九州", "きたきゅうしゅう", "北九州市"] },
      { id: 12, text: "川崎市", kana: "かわさきし", aliases: ["川崎", "かわさき", "川崎市"] },
      { id: 13, text: "千葉市", kana: "ちばし", aliases: ["千葉", "ちば", "千葉市"] },
      { id: 14, text: "熊本市", kana: "くまもとし", aliases: ["熊本", "くまもと", "熊本市"] }
    ]
  },
  {
    id: "q_nihon_islands",
    question: "日本の島（本州・北海道・九州・四国を除く）で面積の大きい島を10個答えろ！",
    category: "地理",
    hint: "沖縄本島、佐渡島、奄美大島、対馬、淡路島、天草下島、屋久島、種子島、福江島など",
    answers: [
      { id: 1, text: "沖縄本島（沖縄島）", kana: "おきなわほんとう", aliases: ["沖縄本島", "沖縄島", "おきなわ", "おきなわほんとう"] },
      { id: 2, text: "佐渡島", kana: "さどがしま", aliases: ["佐渡島", "さど", "さどがしま", "さどしま"] },
      { id: 3, text: "奄美大島", kana: "あまみおおしま", aliases: ["奄美大島", "あまみ", "あまみおおしま"] },
      { id: 4, text: "対馬", kana: "つしま", aliases: ["対馬", "つしま"] },
      { id: 5, text: "淡路島", kana: "あわじしま", aliases: ["淡路島", "あわじ", "あわじしま"] },
      { id: 6, text: "天草下島", kana: "あまくさしもしま", aliases: ["天草下島", "天草", "あまくさ"] },
      { id: 7, text: "屋久島", kana: "やくしま", aliases: ["屋久島", "やくしま"] },
      { id: 8, text: "種子島", kana: "たねがしま", aliases: ["種子島", "たねがしま"] },
      { id: 9, text: "福江島（五島列島）", kana: "ふくえじま", aliases: ["福江島", "ふくえじま", "五島列島"] },
      { id: 10, text: "西表島", kana: "いりおもてじま", aliases: ["西表島", "いりおもて", "いりおもてじま"] },
      { id: 11, text: "石垣島", kana: "いしがきじま", aliases: ["石垣島", "いしがき", "いしがきじま"] },
      { id: 12, text: "利尻島", kana: "りしりとう", aliases: ["利尻島", "りしり", "りしりとう"] }
    ]
  },
  {
    id: "q_tokugawa_shogun",
    question: "江戸幕府の「徳川15代将軍」の名前（下の名前）を10人答えろ！",
    category: "歴史・政治",
    hint: "家康、秀忠、家光、家綱、綱吉、吉宗、慶喜など",
    answers: [
      { id: 1, text: "家康（初代）", kana: "いえやす", aliases: ["家康", "いえやす", "徳川家康"] },
      { id: 2, text: "秀忠（2代）", kana: "ひでただ", aliases: ["秀忠", "ひでただ", "徳川秀忠"] },
      { id: 3, text: "家光（3代）", kana: "いえみつ", aliases: ["家光", "いえみつ", "徳川家光"] },
      { id: 4, text: "家綱（4代）", kana: "いえつな", aliases: ["家綱", "いえつな", "徳川家綱"] },
      { id: 5, text: "綱吉（5代）", kana: "つなよし", aliases: ["綱吉", "つなよし", "徳川綱吉"] },
      { id: 6, text: "家宣（6代）", kana: "いえのぶ", aliases: ["家宣", "いえのぶ", "徳川家宣"] },
      { id: 7, text: "吉宗（8代）", kana: "よしむね", aliases: ["吉宗", "よしむね", "徳川吉宗"] },
      { id: 8, text: "家斉（11代）", kana: "いえなり", aliases: ["家斉", "いえなり", "徳川家斉"] },
      { id: 9, text: "家茂（14代）", kana: "いえもち", aliases: ["家茂", "いえもち", "徳川家茂"] },
      { id: 10, text: "慶喜（15代）", kana: "よしのぶ", aliases: ["慶喜", "よしのぶ", "徳川慶喜"] },
      { id: 11, text: "家重（9代）", kana: "いえしげ", aliases: ["家重", "いえしげ"] },
      { id: 12, text: "家定（13代）", kana: "いえさだ", aliases: ["家定", "いえさだ"] }
    ]
  },
  {
    id: "q_rekidai_pm",
    question: "日本の歴代内閣総理大臣の名字を10人答えろ！",
    category: "歴史・政治",
    hint: "伊藤、伊藤博文、岸田、安倍、菅、小泉、吉田、田中、中曽根、福田など",
    answers: [
      { id: 1, text: "伊藤（伊藤博文）", kana: "いとう", aliases: ["伊藤", "伊藤博文", "いとう", "いとうひろぶみ"] },
      { id: 2, text: "安倍（安倍晋三）", kana: "あべ", aliases: ["安倍", "安倍晋三", "あべ", "あべしんぞう"] },
      { id: 3, text: "岸田（岸田文雄）", kana: "きしだ", aliases: ["岸田", "岸田文雄", "きしだ", "きしだふみお"] },
      { id: 4, text: "小泉（小泉純一郎）", kana: "こいずみ", aliases: ["小泉", "小泉純一郎", "こいずみ", "こいずみじゅんいちろう"] },
      { id: 5, text: "菅（菅義偉・菅直人）", kana: "すが", aliases: ["菅", "すが", "菅義偉", "かん", "菅直人"] },
      { id: 6, text: "田中（田中角栄）", kana: "たなか", aliases: ["田中", "田中角栄", "たなか", "たなかかくえい"] },
      { id: 7, text: "吉田（吉田茂）", kana: "よしだ", aliases: ["吉田", "吉田茂", "よしだ", "よしだしげる"] },
      { id: 8, text: "中曽根（中曽根康弘）", kana: "なかそね", aliases: ["中曽根", "中曽根康弘", "なかそね"] },
      { id: 9, text: "麻生（麻生太郎）", kana: "あそう", aliases: ["麻生", "麻生太郎", "あそう", "あそうたろう"] },
      { id: 10, text: "野田（野田佳彦）", kana: "のだ", aliases: ["野田", "野田佳彦", "のだ", "のだよしひこ"] },
      { id: 11, text: "福田（福田赳夫・福田康夫）", kana: "ふくだ", aliases: ["福田", "ふくだ", "福田康夫"] },
      { id: 12, text: "佐藤（佐藤栄作）", kana: "さとう", aliases: ["佐藤", "佐藤栄作", "さとう", "さとうえいさく"] }
    ]
  },
  {
    id: "q_ghibli_movies",
    question: "スタジオジブリの長編アニメーション映画のタイトルを10作品答えろ！",
    category: "アニメ・映画",
    hint: "トトロ、ラピュタ、千と千尋、もののけ姫、魔女の宅急便、ハウルなど",
    answers: [
      { id: 1, text: "となりのトトロ", kana: "となりのととろ", aliases: ["となりのトトロ", "トトロ", "ととろ"] },
      { id: 2, text: "天空の城ラピュタ", kana: "てんくうのしろらぴゅた", aliases: ["天空の城ラピュタ", "ラピュタ", "らぴゅた"] },
      { id: 3, text: "千と千尋の神隠し", kana: "せんとちひろのかみかくし", aliases: ["千と千尋の神隠し", "千と千尋", "せんとちひろ"] },
      { id: 4, text: "もののけ姫", kana: "もののけひめ", aliases: ["もののけ姫", "もののけひめ", "もののけ"] },
      { id: 5, text: "魔女の宅急便", kana: "まじょのたっきゅうびん", aliases: ["魔女の宅急便", "まじょのたっきゅうびん"] },
      { id: 6, text: "風の谷のナウシカ", kana: "かぜのたにのなうしか", aliases: ["風の谷のナウシカ", "ナウシカ", "なうしか"] },
      { id: 7, text: "ハウルの動く城", kana: "はうるのうごくしろ", aliases: ["ハウルの動く城", "ハウル", "はうる"] },
      { id: 8, text: "紅の豚", kana: "くれないのぶた", aliases: ["紅の豚", "くれないのぶた"] },
      { id: 9, text: "崖の上のポニョ", kana: "がけのうえのぽにょ", aliases: ["崖の上のポニョ", "ポニョ", "ぽにょ"] },
      { id: 10, text: "君たちはどう生きるか", kana: "きみたちはどういきるか", aliases: ["君たちはどう生きるか", "きみたちはどういきるか"] },
      { id: 11, text: "耳をすませば", kana: "みみをすませば", aliases: ["耳をすませば", "みみをすませば"] },
      { id: 12, text: "平成狸合戦ぽんぽこ", kana: "へいせいたぬきがっせんぽんぽこ", aliases: ["ぽんぽこ", "平成狸合戦ぽんぽこ"] }
    ]
  },
  {
    id: "q_pixar_movies",
    question: "ディズニー＆ピクサーの長編アニメ映画のタイトルを10作品答えろ！",
    category: "アニメ・映画",
    hint: "トイ・ストーリー、モンスターズ・インク、カーズ、リメンバー・ミーなど",
    answers: [
      { id: 1, text: "トイ・ストーリー", kana: "といすとーりー", aliases: ["トイ・ストーリー", "トイストーリー", "といすとーりー"] },
      { id: 2, text: "モンスターズ・インク", kana: "もんすたーずいんく", aliases: ["モンスターズ・インク", "モンスターズインク", "もんすたーずいんく"] },
      { id: 3, text: "ファインディング・ニモ", kana: "ふぁいんでぃんぐにも", aliases: ["ファインディング・ニモ", "ニモ", "ふぁいんでぃんぐにも"] },
      { id: 4, text: "Mr.インクレディブル", kana: "みすたーいんくれでぃぶる", aliases: ["Mr.インクレディブル", "インクレディブル", "みすたーいんくれでぃぶる"] },
      { id: 5, text: "カーズ", kana: "かーず", aliases: ["カーズ", "かーず"] },
      { id: 6, text: "レミーのおいしいレストラン", kana: "れみーのおいしいれすとらん", aliases: ["レミーのおいしいレストラン", "レミー", "れみー"] },
      { id: 7, text: "カールじいさんの空飛ぶ家", kana: "かーるじいさんのそらとぶいえ", aliases: ["カールじいさんの空飛ぶ家", "カールじいさん", "かーるじいさん"] },
      { id: 8, text: "インサイド・ヘッド", kana: "いんさいどへっど", aliases: ["インサイド・ヘッド", "インサイドヘッド", "いんさいどへっど"] },
      { id: 9, text: "リメンバー・ミー", kana: "りめんばーみー", aliases: ["リメンバー・ミー", "リメンバーミー", "りめんばーみー"] },
      { id: 10, text: "ウォーリー", kana: "うぉーりー", aliases: ["ウォーリー", "WALL-E", "うぉーりー"] },
      { id: 11, text: "ソウルフル・ワールド", kana: "そうるふるわーるど", aliases: ["ソウルフル・ワールド", "そうるふるわーるど"] },
      { id: 12, text: "バグズ・ライフ", kana: "ばぐずらいふ", aliases: ["バグズ・ライフ", "バグズライフ", "ばぐずらいふ"] }
    ]
  },
  {
    id: "q_jump_anime",
    question: "「週刊少年ジャンプ」原作の歴代テレビアニメ作品を10作品答えろ！",
    category: "アニメ・映画",
    hint: "ONE PIECE、NARUTO、ドラゴンボール、鬼滅の刃、呪術廻戦、HUNTER×HUNTERなど",
    answers: [
      { id: 1, text: "ONE PIECE（ワンピース）", kana: "わんぴーす", aliases: ["ONE PIECE", "ワンピース", "わんぴーす"] },
      { id: 2, text: "DRAGON BALL（ドラゴンボール）", kana: "どらごんぼーる", aliases: ["ドラゴンボール", "どらごんぼーる"] },
      { id: 3, text: "NARUTO -ナルト-", kana: "なると", aliases: ["NARUTO", "ナルト", "なると"] },
      { id: 4, text: "鬼滅の刃", kana: "きめつのやいば", aliases: ["鬼滅の刃", "きめつのやいば", "鬼滅"] },
      { id: 5, text: "呪術廻戦", kana: "じゅじゅつかいせん", aliases: ["呪術廻戦", "じゅじゅつかいせん", "呪術"] },
      { id: 6, text: "HUNTER×HUNTER", kana: "はんたーはんたー", aliases: ["HUNTER×HUNTER", "ハンターハンター", "はんたーはんたー"] },
      { id: 7, text: "僕のヒーローアカデミア", kana: "ぼくのひーろーあかでみあ", aliases: ["僕のヒーローアカデミア", "ヒロアカ", "ひろあか"] },
      { id: 8, text: "SLAM DUNK（スラムダンク）", kana: "すらむだんく", aliases: ["SLAM DUNK", "スラムダンク", "すらむだんく"] },
      { id: 9, text: "BLEACH（ブリーチ）", kana: "ぶりーち", aliases: ["BLEACH", "ブリーチ", "ぶりーち"] },
      { id: 10, text: "銀魂", kana: "ぎんたま", aliases: ["銀魂", "ぎんたま"] },
      { id: 11, text: "ハイキュー!!", kana: "はいきゅー", aliases: ["ハイキュー", "はいきゅー", "ハイキュー!!"] },
      { id: 12, text: "こちら葛飾区亀有公園前派出所", kana: "こちかめ", aliases: ["こち亀", "こちかめ", "こちら葛飾区亀有公園前派出所"] }
    ]
  },
  {
    id: "q_family_restaurant",
    question: "日本で全国展開する大手「ファミリーレストラン」チェーンを10個答えろ！",
    category: "日常・グルメ",
    hint: "ガスト、サイゼリヤ、ロイヤルホスト、デニーズ、ココス、ジョイフルなど",
    answers: [
      { id: 1, text: "ガスト", kana: "がすと", aliases: ["ガスト", "がすと"] },
      { id: 2, text: "サイゼリヤ", kana: "さいぜりや", aliases: ["サイゼリヤ", "サイゼ", "さいぜりや", "さいぜ"] },
      { id: 3, text: "ロイヤルホスト", kana: "ろいやるほすと", aliases: ["ロイヤルホスト", "ロイホ", "ろいやるほすと", "ろいほ"] },
      { id: 4, text: "デニーズ", kana: "でにーず", aliases: ["デニーズ", "でにーず"] },
      { id: 5, text: "ココス", kana: "ここす", aliases: ["ココス", "ここす"] },
      { id: 6, text: "ジョイフル", kana: "じょいふる", aliases: ["ジョイフル", "じょいふる"] },
      { id: 7, text: "バーミヤン", kana: "ばーみやん", aliases: ["バーミヤン", "ばーみやん"] },
      { id: 8, text: "びっくりドンキー", kana: "びっくりどんきー", aliases: ["びっくりドンキー", "びくドン", "びっくりどんきー"] },
      { id: 9, text: "ジョリーパスタ", kana: "じょりーぱすた", aliases: ["ジョリーパスタ", "じょりーぱすた"] },
      { id: 10, text: "大戸屋", kana: "おおとや", aliases: ["大戸屋", "おおとや"] },
      { id: 11, text: "やよい軒", kana: "やよいけん", aliases: ["やよい軒", "やよいけん"] },
      { id: 12, text: "夢庵", kana: "ゆめあん", aliases: ["夢庵", "ゆめあん"] }
    ]
  },
  {
    id: "q_sushi_neta",
    question: "回転寿司や寿司屋の定番「寿司ネタ」を10種類答えろ！",
    category: "日常・グルメ",
    hint: "まぐろ、サーモン、えび、いか、たこ、いくら、たまご、ほたてなど",
    answers: [
      { id: 1, text: "マグロ（鮪）", kana: "まぐろ", aliases: ["マグロ", "まぐろ", "鮪", "トロ", "中トロ"] },
      { id: 2, text: "サーモン（鮭）", kana: "さーもん", aliases: ["サーモン", "さーもん", "鮭"] },
      { id: 3, text: "エビ（海老）", kana: "えび", aliases: ["エビ", "えび", "海老", "甘エビ"] },
      { id: 4, text: "イカ（烏賊）", kana: "いか", aliases: ["イカ", "いか", "烏賊"] },
      { id: 5, text: "タコ（蛸）", kana: "たこ", aliases: ["タコ", "たこ", "蛸"] },
      { id: 6, text: "イクラ", kana: "いくら", aliases: ["イクラ", "いくら"] },
      { id: 7, text: "ウニ（海胆）", kana: "うに", aliases: ["ウニ", "うに", "海胆"] },
      { id: 8, text: "玉子（たまご）", kana: "たまご", aliases: ["玉子", "たまご", "卵"] },
      { id: 9, text: "ホタテ（帆立）", kana: "ほたて", aliases: ["ホタテ", "ほたて", "帆立"] },
      { id: 10, text: "アナゴ（穴子）", kana: "あなご", aliases: ["アナゴ", "あなご", "穴子"] },
      { id: 11, text: "アジ（鯵）", kana: "あじ", aliases: ["アジ", "あじ", "鯵"] },
      { id: 12, text: "タイ（鯛）", kana: "たい", aliases: ["タイ", "たい", "鯛"] }
    ]
  },
  {
    id: "q_oden_ingredients",
    question: "「おでん」の定番具材を10個答えろ！",
    category: "日常・グルメ",
    hint: "大根、たまご、こんにゃく、ちくわ、はんぺん、牛すじ、厚揚げなど",
    answers: [
      { id: 1, text: "大根", kana: "だいこん", aliases: ["大根", "だいこん"] },
      { id: 2, text: "たまご（ゆで卵）", kana: "たまご", aliases: ["たまご", "卵", "玉子"] },
      { id: 3, text: "こんにゃく", kana: "こんにゃく", aliases: ["こんにゃく", "蒟蒻"] },
      { id: 4, text: "しらたき（糸こんにゃく）", kana: "しらたき", aliases: ["しらたき", "白滝", "糸こんにゃく"] },
      { id: 5, text: "ちくわ", kana: "ちくわ", aliases: ["ちくわ", "竹輪"] },
      { id: 6, text: "はんぺん", kana: "はんぺん", aliases: ["はんぺん", "半平"] },
      { id: 7, text: "牛すじ", kana: "ぎゅうすじ", aliases: ["牛すじ", "ぎゅうすじ", "牛筋"] },
      { id: 8, text: "厚揚げ", kana: "あつあげ", aliases: ["厚揚げ", "あつあげ"] },
      { id: 9, text: "餅巾着（もちきんちゃく）", kana: "もちきんちゃく", aliases: ["餅巾着", "もちきんちゃく", "巾着"] },
      { id: 10, text: "さつま揚げ", kana: "さつまあげ", aliases: ["さつま揚げ", "さつまあげ"] },
      { id: 11, text: "がんもどき", kana: "がんもどき", aliases: ["がんもどき", "がんも"] },
      { id: 12, text: "ちくわぶ", kana: "ちくわぶ", aliases: ["ちくわぶ"] }
    ]
  },
  {
    id: "q_smash_bros_fighters",
    question: "大乱闘スマッシュブラザーズ（初代）の初期登場キャラクターを10人答えろ！",
    category: "ゲーム・エンタメ",
    hint: "マリオ、ドンキーコング、リンク、サムス、ヨッシー、カービィ、フォックス、ピカチュウ、ルイージ、キャプテン・ファルコン、ネス、プリン",
    answers: [
      { id: 1, text: "マリオ", kana: "まりお", aliases: ["マリオ", "まりお"] },
      { id: 2, text: "ドンキーコング", kana: "どんきーこんぐ", aliases: ["ドンキーコング", "ドンキー", "どんきーこんぐ"] },
      { id: 3, text: "リンク", kana: "りんく", aliases: ["リンク", "りんく"] },
      { id: 4, text: "サムス", kana: "さむす", aliases: ["サムス", "さむす"] },
      { id: 5, text: "ヨッシー", kana: "よっしー", aliases: ["ヨッシー", "よっしー"] },
      { id: 6, text: "カービィ", kana: "かーびぃ", aliases: ["カービィ", "かーびぃ"] },
      { id: 7, text: "フォックス", kana: "ふぉっくす", aliases: ["フォックス", "ふぉっくす"] },
      { id: 8, text: "ピカチュウ", kana: "ぴかちゅう", aliases: ["ピカチュウ", "ぴかちゅう"] },
      { id: 9, text: "ルイージ", kana: "るいーじ", aliases: ["ルイージ", "るいーじ"] },
      { id: 10, text: "キャプテン・ファルコン", kana: "ふぁるこん", aliases: ["キャプテン・ファルコン", "ファルコン", "ふぁるこん"] },
      { id: 11, text: "ネス", kana: "ねす", aliases: ["ネス", "ねす"] },
      { id: 12, text: "プリン", kana: "ぷりん", aliases: ["プリン", "ぷりん"] }
    ]
  },
  {
    id: "q_pokemon_kanto_starters",
    question: "『ポケットモンスター 赤・緑』（初代）で最初に選べるポケモンとその進化形を答えろ！",
    category: "ゲーム・エンタメ",
    hint: "フシギダネ、フシギソウ、フシギバナ、ヒトカゲ、リザード、リザードン、ゼニガメ、カメール、カメックス、ピカチュウ",
    answers: [
      { id: 1, text: "フシギダネ", kana: "ふしぎだね", aliases: ["フシギダネ", "ふしぎだね"] },
      { id: 2, text: "フシギソウ", kana: "ふしぎそう", aliases: ["フシギソウ", "ふしぎそう"] },
      { id: 3, text: "フシギバナ", kana: "ふしぎばな", aliases: ["フシギバナ", "ふしぎばな"] },
      { id: 4, text: "ヒトカゲ", kana: "ひとかげ", aliases: ["ヒトカゲ", "ひとかげ"] },
      { id: 5, text: "リザード", kana: "りざーど", aliases: ["リザード", "りざーど"] },
      { id: 6, text: "リザードン", kana: "りざーどん", aliases: ["リザードン", "りざーどん"] },
      { id: 7, text: "ゼニガメ", kana: "ぜにがめ", aliases: ["ゼニガメ", "ぜにがめ"] },
      { id: 8, text: "カメール", kana: "かめーる", aliases: ["カメール", "かめーる"] },
      { id: 9, text: "カメックス", kana: "かめっくす", aliases: ["カメックス", "かめっくす"] },
      { id: 10, text: "ピカチュウ", kana: "ぴかちゅう", aliases: ["ピカチュウ", "ぴかちゅう"] },
      { id: 11, text: "ライチュウ", kana: "らいちゅう", aliases: ["ライチュウ", "らいちゅう"] },
      { id: 12, text: "イーブイ", kana: "いーぶい", aliases: ["イーブイ", "いーぶい"] }
    ]
  },
  {
    id: "q_npb_teams",
    question: "日本のプロ野球（NPB）に所属する全12球団（球団名または愛称）を10個答えろ！",
    category: "スポーツ",
    hint: "巨人、阪神、中日、DeNA、広島、ヤクルト、ソフトバンク、ロッテ、オリックス、日本ハム、楽天、西武",
    answers: [
      { id: 1, text: "読売ジャイアンツ（巨人）", kana: "きょじん", aliases: ["読売ジャイアンツ", "ジャイアンツ", "巨人", "きょじん"] },
      { id: 2, text: "阪神タイガース", kana: "はんしん", aliases: ["阪神タイガース", "タイガース", "阪神", "はんしん"] },
      { id: 3, text: "中日ドラゴンズ", kana: "ちゅうにち", aliases: ["中日ドラゴンズ", "ドラゴンズ", "中日", "ちゅうにち"] },
      { id: 4, text: "横浜DeNAベイスターズ", kana: "べいすたーず", aliases: ["横浜DeNAベイスターズ", "ベイスターズ", "DeNA", "でぃーえぬえー"] },
      { id: 5, text: "広島東洋カープ", kana: "かーぷ", aliases: ["広島東洋カープ", "カープ", "広島", "ひろしま"] },
      { id: 6, text: "東京ヤクルトスワローズ", kana: "やくると", aliases: ["東京ヤクルトスワローズ", "スワローズ", "ヤクルト", "やくると"] },
      { id: 7, text: "福岡ソフトバンクホークス", kana: "そふとばんく", aliases: ["福岡ソフトバンクホークス", "ホークス", "ソフトバンク", "そふとばんく"] },
      { id: 8, text: "千葉ロッテマリーンズ", kana: "ろって", aliases: ["千葉ロッテマリーンズ", "マリーンズ", "ロッテ", "ろって"] },
      { id: 9, text: "オリックス・バファローズ", kana: "おりっくす", aliases: ["オリックス・バファローズ", "バファローズ", "オリックス", "おりっくす"] },
      { id: 10, text: "北海道日本ハムファイターズ", kana: "にほんはむ", aliases: ["北海道日本ハムファイターズ", "ファイターズ", "日本ハム", "日ハム", "にほんはむ"] },
      { id: 11, text: "東北楽天ゴールデンイーグルス", kana: "らくてん", aliases: ["東北楽天ゴールデンイーグルス", "イーグルス", "楽天", "らくてん"] },
      { id: 12, text: "埼玉西武ライオンズ", kana: "せいぶ", aliases: ["埼玉西武ライオンズ", "ライオンズ", "西武", "せいぶ"] }
    ]
  },
  {
    id: "q_summer_olympics_sports",
    question: "夏季オリンピックの正式競技を10個答えろ！",
    category: "スポーツ",
    hint: "陸上、水泳、柔道、体操、卓球、バドミントン、スケートボード、レスリング、サッカーなど",
    answers: [
      { id: 1, text: "陸上競技", kana: "りくじょう", aliases: ["陸上競技", "陸上", "りくじょう"] },
      { id: 2, text: "競泳・水泳", kana: "すいえい", aliases: ["競泳", "水泳", "すいえい"] },
      { id: 3, text: "柔道", kana: "じゅうどう", aliases: ["柔道", "じゅうどう"] },
      { id: 4, text: "体操競技", kana: "たいそう", aliases: ["体操競技", "体操", "たいそう"] },
      { id: 5, text: "卓球", kana: "たっきゅう", aliases: ["卓球", "たっきゅう", "ピンポン"] },
      { id: 6, text: "バドミントン", kana: "ばどみんとん", aliases: ["バドミントン", "ばどみんとん"] },
      { id: 7, text: "スケートボード", kana: "すけーとぼーど", aliases: ["スケートボード", "スケボー", "すけーとぼーど"] },
      { id: 8, text: "レスリング", kana: "れすりんぐ", aliases: ["レスリング", "れすりんぐ"] },
      { id: 9, text: "サッカー", kana: "さっかー", aliases: ["サッカー", "さっかー", "フットボール"] },
      { id: 10, text: "バスケットボール", kana: "ばすけっとぼーる", aliases: ["バスケットボール", "バスケ", "ばすけ"] },
      { id: 11, text: "フェンシング", kana: "ふぇんしんぐ", aliases: ["フェンシング", "ふぇんしんぐ"] },
      { id: 12, text: "ボクシング", kana: "ぼくしんぐ", aliases: ["ボクシング", "ぼくしんぐ"] }
    ]
  },
  {
    id: "q_g20_countries",
    question: "G20（主要20カ国・地域）に加盟している国を10カ国答えろ！（日本を除く）",
    category: "地理",
    hint: "アメリカ、イギリス、フランス、ドイツ、イタリア、カナダ、中国、韓国、インド、オーストラリアなど",
    answers: [
      { id: 1, text: "アメリカ合衆国", kana: "あめりか", aliases: ["アメリカ", "米国", "あめりか", "アメリカ合衆国"] },
      { id: 2, text: "イギリス", kana: "いぎりす", aliases: ["イギリス", "英国", "いぎりす"] },
      { id: 3, text: "フランス", kana: "ふらんす", aliases: ["フランス", "仏国", "ふらんす"] },
      { id: 4, text: "ドイツ", kana: "どいつ", aliases: ["ドイツ", "独国", "どいつ"] },
      { id: 5, text: "イタリア", kana: "いたりあ", aliases: ["イタリア", "伊国", "いたりあ"] },
      { id: 6, text: "カナダ", kana: "かなだ", aliases: ["カナダ", "加奈陀", "かなだ"] },
      { id: 7, text: "中国（中華人民共和国）", kana: "ちゅうごく", aliases: ["中国", "ちゅうごく", "チャイナ"] },
      { id: 8, text: "韓国（大韓民国）", kana: "かんこく", aliases: ["韓国", "かんこく"] },
      { id: 9, text: "インド", kana: "いんど", aliases: ["インド", "いんど"] },
      { id: 10, text: "オーストラリア", kana: "おーすとらりあ", aliases: ["オーストラリア", "豪州", "おーすとらりあ"] },
      { id: 11, text: "ブラジル", kana: "ぶらじる", aliases: ["ブラジル", "ぶらじる"] },
      { id: 12, text: "サウジアラビア", kana: "さうじあらびあ", aliases: ["サウジアラビア", "サウジ", "さうじあらびあ"] }
    ]
  },
  {
    id: "q_world_heritage_japan",
    question: "日本の「世界文化遺産」または「世界自然遺産」を10個答えろ！",
    category: "地理",
    hint: "富士山、屋久島、白神山地、知床、法隆寺、姫路城、原爆ドーム、厳島神社、古都京都、日光の社寺など",
    answers: [
      { id: 1, text: "富士山（信仰の対象と芸術の源泉）", kana: "ふじさん", aliases: ["富士山", "ふじさん"] },
      { id: 2, text: "屋久島", kana: "やくしま", aliases: ["屋久島", "やくしま"] },
      { id: 3, text: "白神山地", kana: "しらかみさんち", aliases: ["白神山地", "しらかみさんち"] },
      { id: 4, text: "知床", kana: "しれとこ", aliases: ["知床", "しれとこ"] },
      { id: 5, text: "姫路城", kana: "ひめじじょう", aliases: ["姫路城", "ひめじじょう", "白鷺城"] },
      { id: 6, text: "法隆寺地域の仏教建造物", kana: "ほうりゅうじ", aliases: ["法隆寺", "ほうりゅうじ"] },
      { id: 7, text: "古都京都の文化財", kana: "きょうと", aliases: ["京都", "古都京都の文化財", "きょうと"] },
      { id: 8, text: "原爆ドーム", kana: "げんばくどーむ", aliases: ["原爆ドーム", "げんばくどーむ"] },
      { id: 9, text: "厳島神社", kana: "いつくしまじんじゃ", aliases: ["厳島神社", "いつくしまじんじゃ", "宮島"] },
      { id: 10, text: "日光の社寺", kana: "にっこうのしゃじ", aliases: ["日光の社寺", "日光東照宮", "日光", "にっこう"] },
      { id: 11, text: "小笠原諸島", kana: "おがさわらしょとう", aliases: ["小笠原諸島", "小笠原", "おがさわら"] },
      { id: 12, text: "琉球王国のグスク及び関連遺産群", kana: "しゅりじょう", aliases: ["首里城", "琉球王国のグスク", "しゅりじょう"] }
    ]
  }
];

// 重複チェックしてマージ
const combined = [...existingQuestions];
const existingIds = new Set(existingQuestions.map(q => q.id));

let addedImageCount = 0;
for (const q of newImageQuestions) {
  if (!existingIds.has(q.id)) {
    combined.push(q);
    existingIds.add(q.id);
    addedImageCount++;
  }
}

let addedNormalCount = 0;
for (const q of newNormalQuestions) {
  if (!existingIds.has(q.id)) {
    combined.push(q);
    existingIds.add(q.id);
    addedNormalCount++;
  }
}

fs.writeFileSync(questionsPath, JSON.stringify(combined, null, 2), 'utf8');
console.log(`Successfully updated! Added ${addedImageCount} image questions and ${addedNormalCount} normal questions. Total questions now: ${combined.length}`);
