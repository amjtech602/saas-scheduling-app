"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { translations as enTranslations } from "./translations/en"
import { translations as ptBRTranslations } from "./translations/pt-BR"

type Language = "en" | "pt-BR"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translationsMap = {
  en: enTranslations,
  "pt-BR": ptBRTranslations,
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

interface I18nProviderProps {
  children: React.ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguage] = useState<Language>("pt-BR")

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "pt-BR")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    const translations = translationsMap[language]
    console.log("[v0] Translating key:", key, "with language:", language)

    const keys = key.split(".")
    let value: any = translations

    for (const k of keys) {
      console.log("[v0] Looking for key:", k, "in value:", value)
      value = value?.[k]
    }

    console.log("[v0] Final translation value:", value)

    if (typeof value !== "string") {
      console.warn(`[v0] Translation key "${key}" not found for language "${language}"`)
      return key
    }

    if (params) {
      return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
        return str.replace(new RegExp(`{{${paramKey}}}`, "g"), String(paramValue))
      }, value)
    }

    return value
  }

  return <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>{children}</I18nContext.Provider>
}
