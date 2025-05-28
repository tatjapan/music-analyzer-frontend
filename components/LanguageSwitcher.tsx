'use client';

import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const currentLang = i18n.resolvedLanguage || i18n.language;

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div className="flex gap-2 p-4 justify-end">
            <button
                onClick={() => changeLanguage('ja')}
                className={`px-3 py-1 rounded ${currentLang === 'ja' ? 'bg-gray-300 font-bold' : 'text-gray-600'
                    }`}
            >
                日本語
            </button>
            <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 rounded ${currentLang === 'en' ? 'bg-gray-300 font-bold' : 'text-gray-600'
                    }`}
            >
                English
            </button>
        </div >
    );
}