"use client";

import { useTranslations } from "next-intl";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@/components/ui/button";

export default function DemoPage() {
  const t = useTranslations();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {t('language.selectLanguage')} Demo
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{t('common.login')}</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">{t('auth.email')}</p>
            <p className="text-gray-600">{t('auth.password')}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{t('umbrella.title')}</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">{t('umbrella.available')}</p>
            <p className="text-gray-600">{t('umbrella.rented')}</p>
            <p className="text-gray-600">{t('umbrella.maintenance')}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{t('admin.dashboard')}</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">{t('admin.users')}</p>
            <p className="text-gray-600">{t('admin.stations')}</p>
            <p className="text-gray-600">{t('admin.reports')}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{t('wallet.title')}</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">{t('wallet.balance')}</p>
            <p className="text-gray-600">{t('wallet.addFunds')}</p>
            <p className="text-gray-600">{t('wallet.withdraw')}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{t('profile.title')}</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">{t('profile.personalInfo')}</p>
            <p className="text-gray-600">{t('profile.accountSettings')}</p>
            <p className="text-gray-600">{t('profile.preferences')}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">{t('footer.help')}</h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">{t('footer.contact')}</p>
            <p className="text-gray-600">{t('footer.terms')}</p>
            <p className="text-gray-600">{t('footer.privacy')}</p>
          </CardBody>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <p className="text-lg mb-4">
          {t('language.selectLanguage')} - Use the language switcher in the navbar to switch between English and Nepali!
        </p>
        <Button color="primary" size="lg">
          {t('common.success')} - {t('language.languageChanged')}
        </Button>
      </div>
    </div>
  );
} 