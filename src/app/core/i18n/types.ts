export interface TranslationDictionary {
  [key: string]: string;
}

/** Translations for one feature, one dictionary per language. */
export interface FeatureDictionary {
  en: TranslationDictionary;
  es: TranslationDictionary;
}
