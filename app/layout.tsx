import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WWTD GBM Mock Service",
  description: "Thread-based messaging API mock service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}