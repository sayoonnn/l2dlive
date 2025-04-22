import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "ER.vrm",
  description: "이터널리턴 MMD를 이용한 채팅 사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko-KR" suppressHydrationWarning>
      <head></head>
      <body>{children}</body>
    </html>
  );
}
