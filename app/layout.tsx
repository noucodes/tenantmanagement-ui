import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Property Pro",
  description: "Property Management Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
