import { useLanguageStore } from '@/store/language';
import { translations, TranslationKey } from '@/lib/translations';

export function useTranslation() {
  const { currentLanguage } = useLanguageStore();
  
  const t = (key: TranslationKey): string => {
    return translations[currentLanguage.code][key] || key;
  };

  return { t, currentLanguage };
}