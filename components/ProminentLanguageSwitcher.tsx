"use client";

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, ChevronDown } from 'lucide-react';

const languageNames = {
  en: 'English',
  ne: 'नेपाली'
};

export function ProminentLanguageSwitcher() {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setIsOpen(false);
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-blue-600" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {t('selectLanguage')}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Choose your preferred language / आफ्नो मनपर्ने भाषा छान्नुहोस्
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button
                variant={locale === 'en' ? 'solid' : 'bordered'}
                size="lg"
                className={`px-6 py-3 text-base font-medium ${
                  locale === 'en' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                }`}
                onClick={() => handleLanguageChange('en')}
              >
                🇺🇸 English
              </Button>
              
              <Button
                variant={locale === 'ne' ? 'solid' : 'bordered'}
                size="lg"
                className={`px-6 py-3 text-base font-medium ${
                  locale === 'ne' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                }`}
                onClick={() => handleLanguageChange('ne')}
              >
                🇳🇵 नेपाली
              </Button>
            </div>
            
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Current: {languageNames[locale as keyof typeof languageNames]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 