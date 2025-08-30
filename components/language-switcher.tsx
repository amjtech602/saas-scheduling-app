"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n()

  const languages = [
    { code: "en" as const, name: t("language.english"), flag: "🇺🇸" },
    { code: "pt-BR" as const, name: t("language.portuguese"), flag: "🇧🇷" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t("language.selectLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center space-x-2"
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
            {language === lang.code && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
