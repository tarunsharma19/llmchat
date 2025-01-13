import { RootLayout } from "@/components/layout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WelcomeMessage } from "@/components/welcome-message";
import {
  PreferenceProvider,
  ReactQueryProvider,
  SessionsProvider,
} from "@/libs/context";
import { AuthProvider } from "@/libs/context/auth";
import { RootProvider } from "@/libs/context/root";
import { cn } from "@/libs/utils/clsx";
import { GeistSans } from "geist/font/sans";
import type { Viewport } from "next";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ryuki App - Democratizing AI Inference for Everyone",
  description: "The first decentralized marketplace that transforms idle AI API credits into a liquid, tradable asset class.",
  keywords:
    "AI chat, LLM, language models, privacy, minimal UI, ryuki, chatgpt",
  authors: [{ name: "Ryuki", url: "https://ryuki.io" }],
  creator: "Ryuki",
  publisher: "Ryuki",
  openGraph: {
    title: "Ryuki App - Democratizing AI Inference for Everyone",
    siteName: "app.ryuki.io",
    description: "The first decentralized marketplace that transforms idle AI API credits into a liquid, tradable asset class.",
    url: "https://ryuki.io",
    type: "website",
    locale: "en_US",
    // images: [
    //   {
    //     url: "https://ryuki.io/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "LLMChat Preview",
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ryuki App - Democratizing AI Inference for Everyone",
    site: "app.ryuki.io",
    creator: "@ryukiHQ",
    description: "decentralized marketplace that transforms idle AI API credits into a liquid, tradable asset class.",
    // images: ["https://ryuki.io/twitter-image.jpg"],
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
  alternates: {
    canonical: "https://ryuki.io",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function ParentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(GeistSans.className, "antialiased", "light")}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          defer
          data-domain="ryuki.io"
          src="https://plausible.io/js/script.tagged-events.js"
        ></script>
      </head>
      <body>
        <RootProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <ReactQueryProvider>
                <AuthProvider>
                  <PreferenceProvider>
                    <SessionsProvider>
                      <RootLayout>{children}</RootLayout>
                    </SessionsProvider>
                  </PreferenceProvider>
                </AuthProvider>
              </ReactQueryProvider>
              <WelcomeMessage />
            </TooltipProvider>
          </ThemeProvider>
        </RootProvider>
      </body>
    </html>
  );
}
