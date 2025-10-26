import type { Metadata } from "next";
import "./globals.css";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
  metadataBase: new URL("https://potato-attack.vercel.app/"),
  title: "ゆかりの日記",
  description: "ゆかりの日記",
  openGraph: {
    title: "ゆかりの日記",
    description: "ゆかりの日記",
    images: ["/ogp.png"],
  },
  icons: "/favicon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-[#e6e8f2] mx-auto p-4 w-full max-w-[80ch] leading-relaxed text-[#333333]" style={{ fontFamily: 'sans-serif' }}>
        <Navigation></Navigation>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
