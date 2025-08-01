import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "../providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Footer";
import { getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function LocaleLayout({
  children,
  popup,
  params
}: {
  children: React.ReactNode;
  popup: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params for Next.js 15
  const { locale } = await params;
  
  // Get messages for the current locale - wrap in try-catch to handle potential issues
  let messages;
  try {
    messages = await getMessages({ locale });
  } catch (error) {
    console.warn('Failed to load messages:', error);
    messages = {};
  }

  return (
    <Providers
      popup={popup}
      themeProps={{ attribute: "class", defaultTheme: "light" }}
      messages={messages}
      locale={locale}
    >
      <div className="relative flex flex-col h-screen">
        <Navbar />
        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </Providers>
  );
} 
