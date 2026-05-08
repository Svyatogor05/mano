import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mano — Маркетплейс курсов",
  description: "Учись у лучших. Продавай знания.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ru">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}