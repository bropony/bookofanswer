import type { Metadata, Viewport } from "next";
import { Noto_Serif, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif-sc",
  display: "swap",
});

const SITE_URL = "https://boa.mahanzhou.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "答案之书 | Book of Answers",
  description:
    "每个问题都有答案 — 融合佛、儒、道、玄学智慧的双语神谕。Every question has an answer — a bilingual oracle drawing from Buddhist, Confucian, Taoist, and mystical wisdom.",
  keywords: [
    "答案之书",
    "Book of Answers",
    "神谕",
    "oracle",
    "佛学",
    "Buddhist",
    "儒学",
    "Confucian",
    "道家",
    "Taoist",
    "玄学",
    "metaphysical",
    "占卜",
    "divination",
    "智慧",
    "wisdom",
    "东方哲学",
    "Eastern philosophy",
  ],
  authors: [{ name: "答案之书" }],
  creator: "答案之书",
  publisher: "答案之书",
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
    canonical: SITE_URL,
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "答案之书 | Book of Answers",
    description: "每个问题都有答案 — 融合东方智慧的双语神谕。A bilingual oracle drawing from Buddhist, Confucian, Taoist, and mystical wisdom.",
    url: SITE_URL,
    siteName: "答案之书",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/favicon.svg",
        width: 32,
        height: 32,
        alt: "答案之书 — 道",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "答案之书 | Book of Answers",
    description: "每个问题都有答案 — 融合东方智慧的双语神谕",
  },
  other: {
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "答案之书",
      alternateName: "Book of Answers",
      url: SITE_URL,
      description:
        "A bilingual oracle drawing from Buddhist, Confucian, Taoist, and mystical wisdom",
      applicationCategory: "Lifestyle",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      inLanguage: ["zh-CN", "en"],
      genre: "https://en.wikipedia.org/wiki/Divination",
    }),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#d4a849",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className={`${notoSerif.variable} ${notoSerifSC.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='10861949',s.src='https://nap5k.com/tag.min.js'})([document.documentElement,document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
