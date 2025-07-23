import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kura kani",
  description: "Kura kani is a simple chat bot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  );
}
