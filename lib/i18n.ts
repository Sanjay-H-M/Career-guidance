export const LANGUAGES = {
    en: { code: "en", name: "English", nativeName: "English" },
    hi: { code: "hi", name: "Hindi", nativeName: "हिंदी" },
    ta: { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    te: { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    kn: { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    ml: { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
    bn: { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    gu: { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
    mr: { code: "mr", name: "Marathi", nativeName: "मराठी" },
    pa: { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
    ur: { code: "ur", name: "Urdu", nativeName: "اردو" },
    as: { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
    or: { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
    ks: { code: "ks", name: "Kashmiri", nativeName: "कॉशुर" },
    brx: { code: "brx", name: "Bodo", nativeName: "बड़ो" },
    doi: { code: "doi", name: "Dogri", nativeName: "डोगरी" },
    kok: { code: "kok", name: "Konkani", nativeName: "कोंकणी" },
    mai: { code: "mai", name: "Maithili", nativeName: "मैथिली" },
    mni: { code: "mni", name: "Manipuri", nativeName: "মৈতৈলোন্" },
    ne: { code: "ne", name: "Nepali", nativeName: "नेपाली" },
    sa: { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्" },
    sat: { code: "sat", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ" },
    sd: { code: "sd", name: "Sindhi", nativeName: "سنڌي" },
};

let currentLanguage = "en";
let translations: Record<string, any> = {};

export async function loadTranslations(lang: string) {
    try {
        const response = await fetch(`/locales/${lang}.json`);
        if (!response.ok) {
            console.warn(`Translation file for ${lang} not found, falling back to English`);
            const fallback = await fetch(`/locales/en.json`);
            translations = await fallback.json();
            currentLanguage = "en";
            return;
        }
        translations = await response.json();
        currentLanguage = lang;
        localStorage.setItem("cga_language", lang);
    } catch (error) {
        console.error("Error loading translations:", error);
        // Fallback to English
        try {
            const fallback = await fetch(`/locales/en.json`);
            translations = await fallback.json();
            currentLanguage = "en";
        } catch (e) {
            console.error("Failed to load fallback translations", e);
        }
    }
}

export function t(key: string): string {
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
            value = value[k];
        } else {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
    }

    return typeof value === "string" ? value : key;
}

export function getCurrentLanguage() {
    return currentLanguage;
}

export function getSavedLanguage() {
    return localStorage.getItem("cga_language") || "en";
}

export function getLanguageInfo(code: string) {
    return LANGUAGES[code as keyof typeof LANGUAGES] || LANGUAGES.en;
}
