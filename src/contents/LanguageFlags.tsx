import { useCss } from '@common/hooks';
import { Css } from '@common/helpers';
import { Button, Div } from '@common/components';

const css: Css = {
  '&': {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    pointerEvents: 'auto',
  },
  '&Button': {
    fontSize: '20px',
    padding: '5px 8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    opacity: 0.6,
    transition: 'opacity 0.2s, backgroundColor 0.2s',
  },
  '&Button:hover': {
    opacity: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  '&Button.active': {
    opacity: 1,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    border: '1px solid rgba(0, 123, 255, 0.3)',
  },
};

interface LanguageEntry {
  language: string;
  url: string;
  title: string;
  startTime?: number; // Seconds since midnight
  endTime?: number; // Seconds since midnight
  duration?: number;
}

interface LanguageFlagsProps {
  languageEntries: LanguageEntry[];
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const getLanguageFlag = (language: string): string => {
  const flagMap: Record<string, string> = {
    'fr': '🇫🇷',
    'en': '🇬🇧',
    'es': '🇪🇸',
    'de': '🇩🇪',
    'it': '🇮🇹',
    'pt': '🇵🇹',
    'nl': '🇳🇱',
    'default': '🏳️'
  };
  return flagMap[language.toLowerCase()] || '🏳️';
};

export const LanguageFlags = ({ 
  languageEntries, 
  currentLanguage, 
  onLanguageChange 
}: LanguageFlagsProps) => {
  const c = useCss('LanguageFlags', css);
  
  if (languageEntries.length <= 1) {
    return null;
  }
  
  // Get unique languages
  const uniqueLanguages = [...new Set(languageEntries.map(entry => entry.language))];
  
  return (
    <Div cls={`${c}`}>
      {uniqueLanguages.map(language => (
        <Button
          key={language}
          cls={`${c}Button ${language === currentLanguage ? 'active' : ''}`}
          color={language === currentLanguage ? "primary" : "secondary"} 
          onClick={() => onLanguageChange(language)}
        >
          {getLanguageFlag(language)}
        </Button>
      ))}
    </Div>
  );
};