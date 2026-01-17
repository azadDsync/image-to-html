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
  title: "Image to HTML Grid Pixel Converter | Transform Images into Pixel Grids",
  description: "Convert any image into a colorful HTML pixel grid. Free online tool to transform photos into customizable grid layouts with adjustable rows and columns. Download your pixel art creations instantly.",
  keywords: ["image to grid", "pixel art converter", "image to html", "grid pixel generator", "pixelate image", "photo to grid", "html grid converter", "pixel art maker"],
  authors: [{ name: "Image to Grid" }],
  creator: "Image to Grid",
  publisher: "Image to Grid",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://image-to-html-green.vercel.app",
    title: "Image to HTML Grid Pixel Converter",
    description: "Transform your images into colorful HTML pixel grids. Upload, customize, and download instantly.",
    siteName: "Image to Grid Converter",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Image to Grid Converter Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to HTML Grid Pixel Converter",
    description: "Transform images into customizable HTML pixel grids. Free online tool with instant preview and download.",
    images: ["/og-image.png"],
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  alternates: {
    canonical: "https://image-to-html-green.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
