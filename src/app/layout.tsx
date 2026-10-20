import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Interval",
  description:
    "Interval is a temporary band for the days after cardiac care, childbirth, or surgery, until the follow-up visit. It watches heart rate, oxygen, temperature, breathing, activity, and sleep, and asks a clinician to look when the pattern changes. It does not diagnose.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-ink text-paper">{children}</body>
    </html>
  );
}
