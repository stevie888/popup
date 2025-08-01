# Internationalization (i18n) Implementation

This project now supports multiple languages using Next.js 13+ App Router with `next-intl`.

## Supported Languages

- **English (en)** - Default language
- **Nepali (ne)** - नेपाली

## Features

### 1. Language Switcher
- Located in the navbar (globe icon)
- Allows users to switch between supported languages
- Maintains current page when switching languages
- Shows current language name

### 2. URL Structure
- All pages are now under locale-specific routes
- Example: `/en/demo`, `/ne/demo`
- Root path `/` redirects to `/en`

### 3. Translation Files
- Located in `messages/` directory
- JSON format for easy editing
- Organized by language sections (common, auth, umbrella, admin, etc.)

## How to Use

### 1. Using Translations in Components

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('common');
  
  return (
    <div>
      <h1>{t('login')}</h1>
      <p>{t('hello', { name: 'John' })}</p>
    </div>
  );
}
```

### 2. Adding New Translations

1. Add the translation key to all language files in `messages/`
2. Use the translation in your component

### 3. Adding a New Language

1. Create a new file `messages/[locale].json`
2. Add the locale to the `locales` array in `i18n.ts`
3. Update the middleware matcher in `middleware.ts`

## File Structure

```
├── i18n.ts                    # i18n configuration
├── middleware.ts              # Locale routing middleware
├── messages/                  # Translation files
│   ├── en.json              # English translations
│   └── ne.json              # Nepali translations
├── app/
│   ├── [locale]/            # Locale-specific pages
│   │   ├── layout.tsx       # Locale layout
│   │   ├── page.tsx         # Home page
│   │   └── demo/            # Demo page
│   └── page.tsx             # Root redirect
└── components/
    └── LanguageSwitcher.tsx # Language switcher component
```

## Translation Categories

### Common
- Basic UI elements (login, logout, save, cancel, etc.)

### Navigation
- Menu items and navigation elements

### Auth
- Authentication-related text (email, password, signup, etc.)

### Umbrella
- Umbrella rental specific terms

### Admin
- Administrative interface text

### Wallet
- Payment and wallet functionality

### Profile
- User profile and settings

### Footer
- Footer links and copyright

### Errors
- Error messages and notifications

### Language
- Language selection and feedback

## Demo Page

Visit `/en/demo` or `/ne/demo` to see all translations in action.

## Configuration

### Next.js Config
The `next.config.js` has been updated to include the `next-intl` plugin.

### Middleware
The middleware handles locale detection and routing.

### Layout
The locale-specific layout validates the locale parameter and provides translations to all child components.

## Best Practices

1. **Always use translation keys** instead of hardcoded text
2. **Group related translations** in the same section
3. **Use descriptive keys** that make sense in context
4. **Test all languages** when adding new features
5. **Keep translations consistent** across the application

## Adding New Content

When adding new text to the application:

1. Add the translation key to all language files
2. Use `useTranslations()` hook in your component
3. Test the translation in all supported languages

Example:
```tsx
// In your component
const t = useTranslations('umbrella');
return <h1>{t('newFeature')}</h1>;

// In messages/en.json
{
  "umbrella": {
    "newFeature": "New Feature"
  }
}

// In messages/ne.json
{
  "umbrella": {
    "newFeature": "नयाँ विशेषता"
  }
}
```

## Troubleshooting

### Common Issues

1. **Translation not found**: Make sure the key exists in all language files
2. **Locale not working**: Check that the locale is added to the `locales` array
3. **Routing issues**: Verify the middleware configuration

### Development

To test the internationalization:

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000` (redirects to `/en`)
3. Use the language switcher in the navbar to switch between English and Nepali
4. Visit `/en/demo` or `/ne/demo` to see all translations

## Future Enhancements

- Add more languages
- Implement RTL support for Arabic/Hebrew
- Add date/time formatting
- Add number formatting
- Add pluralization rules 