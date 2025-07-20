import type { Metadata } from "next";
import { Inter, Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Provider from "@/components/provider";
import { Navigation } from "@/components/layout/navigation";
import { Toaster } from "sonner";

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
    "Share your moments, tell your story, and connect with creators worldwide on ReelsPro.",
  keywords: "videos, reels, short videos, social media, creators, content",
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
            <main className="relative">{children}</main>
          </div>
          <Toaster position="top-right" richColors />
        </Provider>
      </body>
    </html>
  );
}
