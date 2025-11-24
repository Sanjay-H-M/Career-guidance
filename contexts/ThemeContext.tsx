"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Theme, APP_THEMES, getTheme } from "@/lib/themes";

interface ThemeContextType {
    theme: Theme;
    setTheme: (themeId: string) => void;
    themeId: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeId, setThemeId] = useState<string>("light");
    const [theme, setThemeState] = useState<Theme>(APP_THEMES.light);

    useEffect(() => {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem("cga_app_theme");
        if (savedTheme && APP_THEMES[savedTheme]) {
            setThemeId(savedTheme);
            setThemeState(APP_THEMES[savedTheme]);
        }
    }, []);

    useEffect(() => {
        // Apply theme CSS variables
        const root = document.documentElement;
        const colors = theme.colors;

        root.style.setProperty("--color-background", colors.background);
        root.style.setProperty("--color-foreground", colors.foreground);
        root.style.setProperty("--color-primary", colors.primary);
        root.style.setProperty("--color-primary-hover", colors.primaryHover);
        root.style.setProperty("--color-secondary", colors.secondary);
        root.style.setProperty("--color-accent", colors.accent);
        root.style.setProperty("--color-border", colors.border);
        root.style.setProperty("--color-card-bg", colors.cardBg);
        root.style.setProperty("--color-input-bg", colors.inputBg);
        root.style.setProperty("--color-muted", colors.muted);
    }, [theme]);

    const setTheme = (newThemeId: string) => {
        const newTheme = getTheme(newThemeId);
        setThemeId(newThemeId);
        setThemeState(newTheme);
        localStorage.setItem("cga_app_theme", newThemeId);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themeId }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
