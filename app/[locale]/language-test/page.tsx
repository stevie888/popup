"use client";

import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

export default function LanguageTestPage() {
  const t = useTranslations('common');
  const locale = useLocale();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Language Test Page
      </h1>
      
      <div className="max-w-md mx-auto space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Current Language:</h2>
          <p className="text-lg font-mono">{locale}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Sample Translations:</h2>
          <p><strong>Login:</strong> {t('login')}</p>
          <p><strong>Logout:</strong> {t('logout')}</p>
          <p><strong>Umbrellas:</strong> {t('umbrellas')}</p>
          <p><strong>Hello:</strong> {t('hello', { name: 'User' })}</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>Look for the globe icon (🌐) in the navbar</li>
            <li>Click it to see language options</li>
            <li>Select "English" or "नेपाली"</li>
            <li>Watch the text change!</li>
          </ol>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Debug Info:</h2>
          <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.pathname : 'Loading...'}</p>
          <p><strong>Available locales:</strong> en, ne</p>
        </div>
        
        <Button 
          onClick={() => window.location.href = '/en/demo'}
          className="w-full"
        >
          Go to Demo Page
        </Button>
      </div>
    </div>
  );
} 