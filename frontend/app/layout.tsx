import React from "react";
import "./globals.css";

export const metadata = {
  title: "Delivery Decision Intelligence",
  description: "Delivery partner performance and regional decision intelligence",
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