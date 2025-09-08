import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '@/types';

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

export const languages: Language[] = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: languages[0], // Português como padrão
      setLanguage: (language) => set({ currentLanguage: language }),
    }),
    {
      name: 'language-storage',
    }
  )
);