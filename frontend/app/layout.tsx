import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GlobalStateProvider } from "./contexts/GlobalStateContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LLM Adventure",
  description: "Adventure Game by LLM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 将 GlobalStateProvider 和 ChatHistoryProvider 包裹在一起 */}
        <GlobalStateProvider>
            {children}
        </GlobalStateProvider>
      </body>
    </html>
  );
}
