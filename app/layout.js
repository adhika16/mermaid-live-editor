import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bogle = localFont({
  src: "../public/fonts/BBHSansBogle-Regular.ttf",
  variable: "--font-bogle",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const metadata = {
  title: "Mermaid Live Editor - Create Beautiful Diagrams",
  description: "Create stunning visual diagrams with Mermaid. Real-time collaboration, beautiful designs, and instant rendering.",
};

export default function RootLayout({ children }) {
  return (
    <html data-theme="silk" lang="en">
      <body
        className={`${bogle.className} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
