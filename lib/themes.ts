export interface ThemeColors {
    background: string;
    foreground: string;
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    border: string;
    cardBg: string;
    inputBg: string;
    muted: string;
}

export interface Theme {
    id: string;
    name: string;
    colors: ThemeColors;
}

export const APP_THEMES: Record<string, Theme> = {
    light: {
        id: "light",
        name: "Light",
        colors: {
            background: "#ffffff",
            foreground: "#000000",
            primary: "#003366",
            primaryHover: "#002244",
            secondary: "#f3f4f6",
            accent: "#60a5fa",
            border: "#e5e7eb",
            cardBg: "#ffffff",
            inputBg: "#ffffff",
            muted: "#6b7280",
        },
    },
    dark: {
        id: "dark",
        name: "Dark",
        colors: {
            background: "#1a1a1a",
            foreground: "#ffffff",
            primary: "#60a5fa",
            primaryHover: "#3b82f6",
            secondary: "#2d2d2d",
            accent: "#93c5fd",
            border: "#404040",
            cardBg: "#262626",
            inputBg: "#2d2d2d",
            muted: "#9ca3af",
        },
    },
    nature: {
        id: "nature",
        name: "Nature Green",
        colors: {
            background: "#f0fdf4",
            foreground: "#14532d",
            primary: "#059669",
            primaryHover: "#047857",
            secondary: "#dcfce7",
            accent: "#10b981",
            border: "#bbf7d0",
            cardBg: "#ffffff",
            inputBg: "#ffffff",
            muted: "#6b7280",
        },
    },
    sunset: {
        id: "sunset",
        name: "Sunset Orange",
        colors: {
            background: "#fff7ed",
            foreground: "#7c2d12",
            primary: "#ea580c",
            primaryHover: "#c2410c",
            secondary: "#ffedd5",
            accent: "#f97316",
            border: "#fed7aa",
            cardBg: "#ffffff",
            inputBg: "#ffffff",
            muted: "#6b7280",
        },
    },
    royal: {
        id: "royal",
        name: "Royal Purple",
        colors: {
            background: "#faf5ff",
            foreground: "#581c87",
            primary: "#7c3aed",
            primaryHover: "#6d28d9",
            secondary: "#f3e8ff",
            accent: "#a78bfa",
            border: "#e9d5ff",
            cardBg: "#ffffff",
            inputBg: "#ffffff",
            muted: "#6b7280",
        },
    },
    ocean: {
        id: "ocean",
        name: "Ocean Blue",
        colors: {
            background: "#f0f9ff",
            foreground: "#0c4a6e",
            primary: "#0284c7",
            primaryHover: "#0369a1",
            secondary: "#e0f2fe",
            accent: "#38bdf8",
            border: "#bae6fd",
            cardBg: "#ffffff",
            inputBg: "#ffffff",
            muted: "#6b7280",
        },
    },
};

export const getTheme = (themeId: string): Theme => {
    return APP_THEMES[themeId] || APP_THEMES.light;
};
