import "./globals.css";
import localFont from "next/font/local";
import Providers from "./providers";

const callingCode = localFont({
  src: [
    {
      path: "../src/fonts/callingcode-regular-webfont.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../src/fonts/callingcode-bold-webfont.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../src/fonts/callingcode-italic-webfont.woff",
      weight: "400",
      style: "italic",
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full" lang="pt">
      <body className={`antialiased h-full ${callingCode.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
