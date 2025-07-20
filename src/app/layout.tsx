import type { Metadata } from "next";
import { Inter, Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Provider from "@/components/provider";
import { Navigation } from "@/components/layout/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "ReelsPro - Create and Share Short Videos",
  description:
    "A modern platform for creating and sharing short-form videos. Upload, discover, and engage with amazing content from creators worldwide.",
  keywords: [
    "reels",
    "short videos",
    "social media",
    "video sharing",
    "content creation",
  ],
  authors: [{ name: "ReelsPro Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} ${playfair.variable} font-poppins antialiased`}
      >
        <Provider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="md:ml-64 pb-16 md:pb-0">{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
