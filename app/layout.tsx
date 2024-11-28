import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Call AI Demo",
  description: "Call AI Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
