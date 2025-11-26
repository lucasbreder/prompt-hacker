"use client";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import localFont from "next/font/local";

const callingCode = localFont({
  src: "../src/fonts/callingcode-regular-webfont.woff",
});

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
