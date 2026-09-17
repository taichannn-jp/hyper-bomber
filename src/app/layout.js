import "./globals.css";

export const metadata = {
  title: "ネプリーグ ハイパーボンバー完全再現",
  description: "超リアル！スタジオUI＆音声認識搭載のハイパーボンバーシミュレーター",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
