"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { loadTranslations, t as translate, getCurrentLanguage, getSavedLanguage, LANGUAGES } from "@/lib/i18n";

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => Promise<void>;
    t: (key: string) => string;
    languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<string>("en");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load saved language on mount
        const savedLang = getSavedLanguage();
        loadTranslations(savedLang).then(() => {
            setLanguageState(savedLang);
            setIsLoaded(true);
        });
    }, []);

    const setLanguage = async (lang: string) => {
        await loadTranslations(lang);
        setLanguageState(lang);
    };

    if (!isLoaded) {
        return null; // or a loading spinner
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translate, languages: LANGUAGES }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
