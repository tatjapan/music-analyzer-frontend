import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationJa from './public/locales/ja/common.json'
import translationEn from './public/locales/en/common.json'

i18n.use(initReactI18next).init({
    resources: {
        ja: { translation: translationJa },
        en: { translation: translationEn },
    },
    fallbackLng: 'ja',
    interpolation: {
        escapeValue: false,
    }
});

export default i18n;