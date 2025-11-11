import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { ErrorBoundaryWrapper } from "@/components/ErrorBoundaryWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LearnFlow - AI-Powered Learning Resource Discovery",
    template: "%s | LearnFlow",
  },
  description: "Discover personalized learning resources from YouTube, Spotify, and articles powered by AI",
  keywords: ["learning", "education", "AI", "YouTube", "Spotify", "articles", "resources", "curated"],
  authors: [{ name: "LearnFlow Team" }],
  creator: "LearnFlow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://learnflow.app",
    siteName: "LearnFlow",
    title: "LearnFlow - AI-Powered Learning Resource Discovery",
    description: "Discover personalized learning resources from YouTube, Spotify, and articles powered by AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnFlow - AI-Powered Learning Resource Discovery",
    description: "Discover personalized learning resources from YouTube, Spotify, and articles powered by AI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundaryWrapper>
          <Header />
          {children}
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
