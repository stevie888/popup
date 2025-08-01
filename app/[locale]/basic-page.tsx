"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BasicLanguageSwitcher } from "@/components/BasicLanguageSwitcher";

export default function BasicPage() {
  const pathname = usePathname();
  const currentLocale = pathname.startsWith('/ne') ? 'ne' : 'en';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <BasicLanguageSwitcher />
      
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            {currentLocale === 'en' ? 'Umbrella Rental System' : 'छाता भाडा प्रणाली'}
          </h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Station Cards */}
            {[
              { name: currentLocale === 'en' ? 'Station 1' : 'स्टेशन १', available: 5, rented: 4, distance: '14 km' },
              { name: currentLocale === 'en' ? 'Station 2' : 'स्टेशन २', available: 2, rented: 4, distance: '1 km' },
              { name: currentLocale === 'en' ? 'Station 3' : 'स्टेशन ३', available: 2, rented: 4, distance: '2 km' },
              { name: currentLocale === 'en' ? 'Station 4' : 'स्टेशन ४', available: 5, rented: 4, distance: '1 km' },
            ].map((station, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{station.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>{currentLocale === 'en' ? 'Available' : 'उपलब्ध'}:</strong> {station.available}</p>
                  <p><strong>{currentLocale === 'en' ? 'Rented' : 'भाडामा लिइएको'}:</strong> {station.rented}</p>
                  <p><strong>{currentLocale === 'en' ? 'Distance' : 'दूरी'}:</strong> {station.distance}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="bordered" size="sm" className="flex-1">
                    {currentLocale === 'en' ? 'Get Direction' : 'दिशा लिनुहोस्'}
                  </Button>
                  <Button variant="solid" size="sm" className="flex-1">
                    {currentLocale === 'en' ? 'View' : 'हेर्नुहोस्'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">
                {currentLocale === 'en' ? 'Language Switcher Working!' : 'भाषा स्विचर काम गर्दै छ!'}
              </h2>
              <p className="text-gray-600">
                {currentLocale === 'en' 
                  ? 'You can switch between English and Nepali using the buttons above.' 
                  : 'तपाईंले माथिको बटनहरू प्रयोग गरेर अंग्रेजी र नेपाली बीच स्विच गर्न सक्नुहुन्छ।'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 