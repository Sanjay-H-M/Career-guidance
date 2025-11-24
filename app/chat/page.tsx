"use client";

import { useState, useEffect, useRef } from "react";
import { gemini } from "@/lib/gemini";
import { Send, Trash2, Bot, User } from "lucide-react";
import { ChatMessage } from "@/types";
import ReactMarkdown from "react-markdown";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Chat() {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState("English");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load chat history from localStorage
        const savedMessages = localStorage.getItem("cga_chat_history");
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        } else {
            // Initial welcome message
            const initialMessage: ChatMessage = {
                id: "init",
                role: "model",
                content: "Hello! I'm your career guide. How can I help you today? I can assist you in English, Kannada, Hindi, Tamil, and Telugu.",
                timestamp: Date.now()
            };
            setMessages([initialMessage]);
        }
    }, []);

    useEffect(() => {
        // Save chat history to localStorage
        if (messages.length > 0) {
            localStorage.setItem("cga_chat_history", JSON.stringify(messages));
        }
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            // Prepare history for Gemini
            const history = messages.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }]
            }));

            const responseText = await gemini.getChatResponse(input, history, language);

            const botMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "model",
                content: responseText,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            // Add error message
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: "model",
                content: "I'm sorry, I encountered an error. Please check your internet connection or API key and try again.",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        if (confirm("Are you sure you want to clear the chat history?")) {
            const initialMessage: ChatMessage = {
                id: Date.now().toString(),
                role: "model",
                content: `Chat cleared. How can I help you in ${language}?`,
                timestamp: Date.now()
            };
            setMessages([initialMessage]);
            localStorage.removeItem("cga_chat_history");
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex flex-col" style={{
            backgroundColor: theme.colors.background
        }}>
            {/* Chat Header */}
            <div className="shadow-sm p-4 flex justify-between items-center sticky top-0 z-10" style={{
                backgroundColor: theme.colors.cardBg,
                borderBottom: `1px solid ${theme.colors.border}`
            }}>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full" style={{
                        backgroundColor: `${theme.colors.primary}20`
                    }}>
                        <Bot style={{ color: theme.colors.primary }} size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold" style={{ color: theme.colors.primary }}>
                            {t('chat.title')}
                        </h1>
                        <p className="text-xs" style={{ color: theme.colors.muted }}>
                            {t('chat.subtitle')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2"
                        style={{
                            backgroundColor: theme.colors.inputBg,
                            borderColor: theme.colors.border,
                            color: theme.colors.foreground
                        }}
                    >
                        <option value="English">English</option>
                        <option value="Kannada">Kannada</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Telugu">Telugu</option>
                    </select>

                    <button
                        onClick={clearChat}
                        className="hover:bg-red-50 p-2 rounded-full transition-colors"
                        style={{ color: '#ef4444' }}
                        title="Clear Chat"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className="max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm"
                            style={msg.role === "user" ? {
                                backgroundColor: theme.colors.primary,
                                color: '#ffffff',
                                borderTopRightRadius: 0
                            } : {
                                backgroundColor: theme.colors.cardBg,
                                color: theme.colors.foreground,
                                borderTopLeftRadius: 0,
                                border: `1px solid ${theme.colors.border}`
                            }}
                        >
                            <div className="text-sm md:text-base leading-relaxed overflow-hidden">
                                <ReactMarkdown
                                    components={{
                                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                        ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                        h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-2" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            </div>
                            <p
                                className={`text-[10px] mt-2 text-right ${msg.role === "user" ? "text-blue-200" : "text-gray-400"
                                    }`}
                            >
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="rounded-2xl rounded-tl-none p-4 shadow-sm border" style={{
                            backgroundColor: theme.colors.cardBg,
                            borderColor: theme.colors.border
                        }}>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t sticky bottom-0" style={{
                backgroundColor: theme.colors.cardBg,
                borderTopColor: theme.colors.border
            }}>
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('chat.placeholder')}
                        className="flex-1 px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{
                            backgroundColor: theme.colors.inputBg,
                            borderColor: theme.colors.border,
                            color: theme.colors.foreground
                        }}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="p-3 rounded-full transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: theme.colors.primary,
                            color: '#ffffff'
                        }}
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
