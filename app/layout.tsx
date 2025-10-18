import type { Metadata } from "next";
import { Albert_Sans, Amiri, Anonymous_Pro } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  weight: "variable",
});
const amiri = Amiri({
  variable: "--font-amiri",
  weight: "400",
});

const anonymousPro = Anonymous_Pro({
  variable: "--font-anonymous-pro",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Zapply",
  description: "CV and Cover Letter AI Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
        ${albertSans.variable}
        ${amiri.variable}
        ${anonymousPro.variable}
        max-w-dvw antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
