"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SimpleLanguageSwitcher } from "@/components/SimpleLanguageSwitcher";

export default function SimpleTestPage() {
  const pathname = usePathname();
  const currentLocale = pathname.startsWith('/ne') ? 'ne' : 'en';
  
  return (
    <div className="container mx-auto py-8">
      <SimpleLanguageSwitcher />
      
      <div className="max-w-md mx-auto mt-8 space-y-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Language Test Page
        </h1>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Current Language:</h2>
          <p className="text-lg font-mono">{currentLocale}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Sample Content:</h2>
          {currentLocale === 'en' ? (
            <>
              <p><strong>Login:</strong> Login</p>
              <p><strong>Logout:</strong> Logout</p>
              <p><strong>Umbrellas:</strong> Umbrellas</p>
              <p><strong>Hello:</strong> Hello, User</p>
            </>
          ) : (
            <>
              <p><strong>Login:</strong> लगइन</p>
              <p><strong>Logout:</strong> लगआउट</p>
              <p><strong>Umbrellas:</strong> छाता</p>
              <p><strong>Hello:</strong> नमस्ते, User</p>
            </>
          )}
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>Use the language switcher at the top</li>
            <li>Click "English" or "नेपाली"</li>
            <li>Watch the content change!</li>
          </ol>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Debug Info:</h2>
          <p><strong>Current URL:</strong> {pathname}</p>
          <p><strong>Available locales:</strong> en, ne</p>
        </div>
        
        <Button 
          onClick={() => window.location.href = '/en'}
          className="w-full"
        >
          Go to Homepage
        </Button>
      </div>
    </div>
  );
} 