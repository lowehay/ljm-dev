import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { site } from "./site";
import SiteBackground from "./components/SiteBackground";
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
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

// Applies a saved light theme before first paint so there's no dark flash
const themeScript = `try{if(localStorage.getItem("theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body 
        suppressHydrationWarning={true}
        className="min-h-full flex flex-col bg-canvas text-fg overflow-x-clip"
      >
        <SiteBackground />
        {/* Content sits above the fixed pixel background */}
        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}