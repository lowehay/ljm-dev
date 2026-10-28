import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Louie Jae Maravillosa — Full-Stack Developer",
  description: "Portfolio of Louie Jae Maravillosa, Full-Stack Software Developer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body 
        suppressHydrationWarning={true}
        className="min-h-full flex flex-col bg-[#0a0a0a] text-neutral-100 overflow-x-hidden selection:bg-neutral-800 selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}