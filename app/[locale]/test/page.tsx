"use client";

import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

export default function TestPage() {
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
          <p className="text-lg">{locale}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Sample Translations:</h2>
          <p>Login: {t('login')}</p>
          <p>Logout: {t('logout')}</p>
          <p>Umbrellas: {t('umbrellas')}</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Instructions:</h2>
          <p>1. Look for the globe icon (🌐) in the navbar</p>
          <p>2. Click it to see language options</p>
          <p>3. Select English or Nepali</p>
          <p>4. Watch the text change!</p>
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