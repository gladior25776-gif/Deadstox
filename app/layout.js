import { Anton, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata = {
  title: "DEADSTOX — Wear Your Mindset",
  description: "Premium heavyweight streetwear built for the unfiltered.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f0e6",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.preloader{display:none!important}.hero-line>span,.rise{transform:none!important;opacity:1!important}`}</style>
        </noscript>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
