import React, { createContext, useContext, useState } from 'react';
import { translations, Language } from '../translations';
import { format as fnsFormat } from 'date-fns';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  formatDate: (date: Date, formatStr: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('de');

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const formatDate = (date: Date, formatStr: string) => {
    // Basic overrides for German locale since we might not have the full locale object loaded
    if (language === 'de') {
      if (formatStr.includes('MMMM')) {
        const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
        const m = monthNames[date.getMonth()];
        // Replace MMMM with German month name
        let res = formatStr.replace('MMMM', m);
        
        // Handle yyyy
        if (res.includes('yyyy')) {
            res = res.replace('yyyy', date.getFullYear().toString());
        }
        return res;
      }
      
      if (formatStr.includes('MMM')) {
         const shortMonths = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
         const m = shortMonths[date.getMonth()];
         let res = formatStr.replace('MMM', m);
         res = res.replace('yyyy', date.getFullYear().toString());
         res = res.replace('d', date.getDate().toString());
         return res;
      }

      if (formatStr === 'EEE') {
        const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
        return days[date.getDay()];
      }
    }
    
    // Fallback to date-fns default (English)
    return fnsFormat(date, formatStr);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatDate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};