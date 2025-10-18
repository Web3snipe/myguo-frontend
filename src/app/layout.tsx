import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyGuo - AI Portfolio Manager",
  description: "AI-powered onchain discovery and portfolio intelligence with multi-wallet aggregation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// Optimization 1
