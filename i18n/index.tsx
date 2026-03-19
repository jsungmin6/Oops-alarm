import { createContext, ReactNode, useContext } from 'react'
import { getLocales, useLocales } from 'expo-localization'
import { I18n } from 'i18n-js'
import en from './translations/en'
import ko from './translations/ko'

type TranslateOptions = Record<string, string | number | boolean | null | undefined>

const i18n = new I18n({
  en,
  ko,
})

i18n.enableFallback = true
i18n.defaultLocale = 'en'

const resolveLanguage = () => {
  const languageCode = getLocales()[0]?.languageCode?.toLowerCase()
  return languageCode === 'ko' ? 'ko' : 'en'
}

const resolveLanguageTag = () => {
  const locale = getLocales()[0]
  return locale?.languageCode?.toLowerCase() === 'ko'
    ? locale?.languageTag || 'ko-KR'
    : locale?.languageTag || 'en-US'
}

const syncLocale = () => {
  const language = resolveLanguage()
  const languageTag = resolveLanguageTag()
  i18n.locale = language
  return { language, languageTag }
}

type LocalizationContextValue = {
  formatDate: (value: Date | number | string) => string
  language: string
  languageTag: string
  t: (key: string, options?: TranslateOptions) => string
}

const defaultLocale = syncLocale()

const LocalizationContext = createContext<LocalizationContextValue>({
  formatDate: (value) =>
    new Intl.DateTimeFormat(defaultLocale.languageTag, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(value)),
  language: defaultLocale.language,
  languageTag: defaultLocale.languageTag,
  t: (key, options) => i18n.t(key, options),
})

export const translate = (key: string, options?: TranslateOptions) => {
  syncLocale()
  return i18n.t(key, options)
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const locales = useLocales()
  const locale = locales[0]
  const language = locale?.languageCode?.toLowerCase() === 'ko' ? 'ko' : 'en'
  const languageTag =
    language === 'ko' ? locale?.languageTag || 'ko-KR' : locale?.languageTag || 'en-US'

  i18n.locale = language

  return (
    <LocalizationContext.Provider
      value={{
        formatDate: (value) =>
          new Intl.DateTimeFormat(languageTag, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }).format(new Date(value)),
        language,
        languageTag,
        t: (key, options) => i18n.t(key, options),
      }}
    >
      {children}
    </LocalizationContext.Provider>
  )
}

export const useLocalization = () => useContext(LocalizationContext)
