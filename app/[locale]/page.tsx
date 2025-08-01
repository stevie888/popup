"use client";
import { EyeIcon, RouteIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { BasicLanguageSwitcher } from "@/components/BasicLanguageSwitcher";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('en');
  
  useEffect(() => {
    setMounted(true);
    setCurrentLocale(pathname.startsWith('/ne') ? 'ne' : 'en');
  }, [pathname]);
  
  const items = [
    {
      id: 1,
      name: currentLocale === 'en' ? "Station 1" : "स्टेशन १",
      distance: "14 km",
      available: 5,
      occupied: 4,
    },
    {
      id: 2,
      name: currentLocale === 'en' ? "Station 2" : "स्टेशन २",
      distance: "1 km",
      available: 2,
      occupied: 4,
    },
    {
      id: 3,
      name: currentLocale === 'en' ? "Station 3" : "स्टेशन ३",
      distance: "2 km",
      available: 2,
      occupied: 4,
    },
    {
      id: 4,
      name: currentLocale === 'en' ? "Station 4" : "स्टेशन ४",
      distance: "1 km",
      available: 5,
      occupied: 4,
    },
  ];

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </section>
    );
  }

  return (
    <>
      <BasicLanguageSwitcher />
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className="text-3xl font-bold text-center mb-6">
          {currentLocale === 'en' ? 'Umbrella Rental System' : 'छाता भाडा प्रणाली'}
        </h1>
        {items.map((el) => (
        <Card
          key={el.name}
          bodyRender={
            <>
              {/* <Image
              alt="Card background"
              className="object-cover rounded-xl w-full"
              src="https://heroui.com/images/hero-card-complete.jpeg"
            /> */}
            </>
          }
          fullWidth={true}
          titleRender={
            <div className=" flex justify-between mt-4 w-full">
              <div className="">
                <p className="text-tiny uppercase font-bold">{el.name}</p>
                <div className="gap-4 flex">
                  <small className="text-default-500">
                    {currentLocale === 'en' ? 'Available' : 'उपलब्ध'}: {el.available}
                  </small>
                  <small className="text-default-500">
                    {currentLocale === 'en' ? 'Rented' : 'भाडामा लिइएको'}: {el.occupied}
                  </small>
                </div>
                <h4 className="font-bold text-large">
                  {currentLocale === 'en' ? 'Distance' : 'दूरी'}: <span>{el.distance}</span>
                </h4>
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="ghost">
                  <RouteIcon />
                  {currentLocale === 'en' ? 'Get Direction' : 'दिशा लिनुहोस्'}
                </Button>
                <Button onPress={() => router.push(`/?id=${el.id}`)}>
                  {currentLocale === 'en' ? 'View' : 'हेर्नुहोस्'}
                  <EyeIcon />
                </Button>
              </div>
            </div>
          }
        />
      ))}
      </section>
    </>
  );
} 