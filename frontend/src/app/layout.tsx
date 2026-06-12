import type { Metadata } from "next";
import { Noto_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Varasat - AI-Powered Family Inheritance Recovery Platform",
  description: "Helping Indian families discover, verify, and mathematically apportion deceased members' assets across Banks, LIC, and Mutual Funds with 3-Layer Security.",
  keywords: ["inheritance", "varasat", "rbi unclaimed deposits", "lic claim", "mutual funds recovery", "succession certificate"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${notoSans.variable} h-full antialiased`}>
      <body className="font-sans min-h-screen bg-warm-white text-primary flex flex-col">
        {children}
      </body>
    </html>
  );
}
