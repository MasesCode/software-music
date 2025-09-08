import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguageStore, languages } from '@/store/language';

interface LanguageSelectorProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
  className?: string;
}

export function LanguageSelector({ 
  variant = 'ghost', 
  size = 'default', 
  showText = true,
  className 
}: LanguageSelectorProps) {
  const { currentLanguage, setLanguage } = useLanguageStore();

  const handleLanguageChange = (langCode: string) => {
    const language = languages.find(lang => lang.code === langCode);
    if (language) {
      setLanguage(language);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <span className="text-lg mr-2">{currentLanguage.flag}</span>
          {showText && (
            <>
              <Globe className="h-4 w-4 mr-2" />
              {currentLanguage.name}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center gap-2"
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
            {currentLanguage.code === lang.code && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
