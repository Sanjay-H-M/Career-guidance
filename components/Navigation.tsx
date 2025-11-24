"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import { User } from "@/types";
import { LogOut, User as UserIcon, MessageSquare, Home, Globe, Palette, ChevronDown, Menu, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { APP_THEMES } from "@/lib/themes";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navigation() {
    const [user, setUser] = useState<User | null>(null);
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { theme, setTheme, themeId } = useTheme();
    const { language, setLanguage, t, languages } = useLanguage();

    const languageDropdownRef = useRef<HTMLDivElement>(null);
    const themeDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentUser = auth.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        } else if (!pathname.includes("/auth")) {
            router.push("/auth/signin");
        }
    }, [pathname, router]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
                setLanguageDropdownOpen(false);
            }
            if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
                setThemeDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        auth.logout();
        setMobileMenuOpen(false);
    };

    const handleLanguageSelect = (langCode: string) => {
        setLanguage(langCode);
        setLanguageDropdownOpen(false);
    };

    const handleThemeSelect = (themeIdValue: string) => {
        setTheme(themeIdValue);
        setThemeDropdownOpen(false);
    };

    if (pathname.includes("/auth")) return null;

    return (
        <nav style={{ backgroundColor: theme.colors.primary }} className="text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/home" className="text-xl sm:text-2xl font-bold tracking-tight">
                            Career Guidance
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
                        {/* Language Selector */}
                        <div className="relative" ref={languageDropdownRef}>
                            <button
                                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                                className="flex items-center space-x-1 hover:text-gray-300 focus:outline-none border border-gray-500 rounded px-2 lg:px-3 py-1 text-sm"
                            >
                                <Globe size={14} />
                                <span className="hidden lg:inline">{languages[language as keyof typeof languages]?.nativeName || "English"}</span>
                                <ChevronDown size={12} className={`transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {languageDropdownOpen && (
                                <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg py-1 z-20 text-gray-800 max-h-96 overflow-y-auto">
                                    {Object.values(languages).map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => handleLanguageSelect(lang.code)}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${language === lang.code ? 'bg-gray-100 font-semibold' : ''}`}
                                        >
                                            {lang.nativeName} ({lang.name})
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Theme Selector */}
                        <div className="relative" ref={themeDropdownRef}>
                            <button
                                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                                className="flex items-center space-x-1 hover:text-gray-300 focus:outline-none border border-gray-500 rounded px-2 lg:px-3 py-1 text-sm"
                            >
                                <Palette size={14} />
                                <span className="hidden lg:inline">{theme.name}</span>
                                <ChevronDown size={12} className={`transition-transform ${themeDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {themeDropdownOpen && (
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-20 text-gray-800">
                                    {Object.values(APP_THEMES).map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => handleThemeSelect(t.id)}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${themeId === t.id ? 'bg-gray-100 font-semibold' : ''}`}
                                        >
                                            <div
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{ backgroundColor: t.colors.primary }}
                                            />
                                            {t.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {user && (
                            <>
                                <span className="text-sm font-medium hidden lg:inline">{user.name}</span>

                                <Link href="/home" className={`flex items-center space-x-1 hover:text-gray-300 text-sm ${pathname === '/home' ? 'text-blue-200' : ''}`}>
                                    <Home size={16} />
                                    <span className="hidden lg:inline">Home</span>
                                </Link>

                                <Link href="/chat" className={`flex items-center space-x-1 hover:text-gray-300 text-sm ${pathname === '/chat' ? 'text-blue-200' : ''}`}>
                                    <MessageSquare size={16} />
                                    <span className="hidden lg:inline">Chat</span>
                                </Link>

                                <Link href="/profile" className={`flex items-center space-x-1 hover:text-gray-300 text-sm ${pathname === '/profile' ? 'text-blue-200' : ''}`}>
                                    <UserIcon size={16} />
                                    <span className="hidden lg:inline">Profile</span>
                                </Link>

                                <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-gray-300 text-sm">
                                    <LogOut size={16} />
                                    <span className="hidden lg:inline">Logout</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md hover:bg-white/10 focus:outline-none"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-white/20">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        {user && (
                            <>
                                <div className="py-2 px-3 text-sm font-medium border-b border-white/20 mb-2">
                                    {user.name}
                                </div>

                                <Link
                                    href="/home"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${pathname === '/home' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                                >
                                    <Home size={18} />
                                    <span>Home</span>
                                </Link>

                                <Link
                                    href="/chat"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${pathname === '/chat' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                                >
                                    <MessageSquare size={18} />
                                    <span>Chat</span>
                                </Link>

                                <Link
                                    href="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${pathname === '/profile' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                                >
                                    <UserIcon size={18} />
                                    <span>Profile</span>
                                </Link>

                                <div className="border-t border-white/20 my-2"></div>

                                <button
                                    onClick={() => {
                                        setLanguageDropdownOpen(!languageDropdownOpen);
                                        setThemeDropdownOpen(false);
                                    }}
                                    className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm hover:bg-white/10"
                                >
                                    <div className="flex items-center space-x-2">
                                        <Globe size={18} />
                                        <span>Language</span>
                                    </div>
                                    <ChevronDown size={14} className={`transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {languageDropdownOpen && (
                                    <div className="pl-8 pr-3 py-2 space-y-1 max-h-60 overflow-y-auto">
                                        {Object.values(languages).map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    handleLanguageSelect(lang.code);
                                                    setMobileMenuOpen(false);
                                                }}
                                                className={`block w-full text-left px-3 py-2 rounded text-xs ${language === lang.code ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'}`}
                                            >
                                                {lang.nativeName}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={() => {
                                        setThemeDropdownOpen(!themeDropdownOpen);
                                        setLanguageDropdownOpen(false);
                                    }}
                                    className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm hover:bg-white/10"
                                >
                                    <div className="flex items-center space-x-2">
                                        <Palette size={18} />
                                        <span>Theme</span>
                                    </div>
                                    <ChevronDown size={14} className={`transition-transform ${themeDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {themeDropdownOpen && (
                                    <div className="pl-8 pr-3 py-2 space-y-1">
                                        {Object.values(APP_THEMES).map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => {
                                                    handleThemeSelect(t.id);
                                                    setMobileMenuOpen(false);
                                                }}
                                                className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded text-xs ${themeId === t.id ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'}`}
                                            >
                                                <div
                                                    className="w-3 h-3 rounded-full border border-white/30"
                                                    style={{ backgroundColor: t.colors.primary }}
                                                />
                                                {t.name}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="border-t border-white/20 my-2"></div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-sm hover:bg-white/10"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
