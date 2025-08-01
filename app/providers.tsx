"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter, useSearchParams } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NextIntlClientProvider } from 'next-intl';
import { AuthProvider } from "@/components/AuthContext";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  popup: React.ReactNode;
  messages?: any;
  locale?: string;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps, popup, messages, locale }: ProvidersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>
          <AuthProvider>
            <>
              {children}
              {id ? popup : <></>}
            </>
          </AuthProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </NextIntlClientProvider>
  );
}
