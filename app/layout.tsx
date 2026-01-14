"use client";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import localFont from "next/font/local";

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
  ]
}
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <html className="h-full" lang="pt">
      <body className={`antialiased h-full ${callingCode.className}`}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
