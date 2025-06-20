import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WWTD GBM Mock Service",
  description: "Thread-based messaging API mock service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}