"use client"
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <html className="h-full" lang="en">
      <body
        className={`antialiased h-full`}
      >
        <QueryClientProvider client={queryClient}>
        {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
