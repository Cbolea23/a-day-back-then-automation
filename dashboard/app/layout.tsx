import "./globals.css";
import type {Viewport} from "next";

export const metadata = {
  title: "A Day Back Then — Content Operations Hub",
  description: "Operations dashboard for the A Day Back Then shorts pipeline",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent" as const,
    title: "DayBackThen Ops",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
