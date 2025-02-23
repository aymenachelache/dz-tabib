import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from 'react-i18next';

import fr from "./locales/fr.json";
import ar from "./locales/ar.json";
import en from "./locales/en.json";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      fr: {
        translation: fr,
      },
      ar: {
        translation: ar,
      },
      en: {
        translation: en,
      },
    },
    // lng: "en", // if you're using a language detector, do not define the lng option
    fallbackLng: "en",
    detection: {
      order: [
        "cookie",
        "htmlTag",
        "querystring",
        "localStorage",
        "sessionStorage",
        "navigator",
        "path",
        "subdomain",
      ],
      caches: ["cookie"],
    },

    interpolation: {
      escapeValue: false,
    },
  });
