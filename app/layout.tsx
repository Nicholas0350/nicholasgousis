import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Nicholas Gousis | MVP agency and regulatory compliance partner for financial services.",
  description: "Our framework of MVP design combined with our regulatory compliance services across ASIC(Aus), FCA(UK), SFC(Hong Kong), SEC, CFTC(USA) speeds up your business success."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-tgv-dark-darker`}
      >
        {children}
      </body>
    </html>
  );
}
