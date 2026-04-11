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

export const metadata: Metadata = {
  title: "答案之书 | Book of Answers",
  description:
    "每个问题都有答案 — 融合佛、儒、道、玄学智慧的双语神谕。Every question has an answer — a bilingual oracle drawing from Buddhist, Confucian, Taoist, and mystical wisdom.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "答案之书 | Book of Answers",
    description: "每个问题都有答案 — 融合东方智慧的双语神谕",
    url: "https://key2life.vercel.app",
    siteName: "答案之书",
    locale: "zh_CN",
    type: "website",
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
      description:
        "A bilingual oracle drawing from Buddhist, Confucian, Taoist, and mystical wisdom",
      applicationCategory: "Lifestyle",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    }),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
