"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { gemini } from '@/lib/gemini';
import { GraduationCap, Briefcase, BookOpen, ExternalLink, Award, TrendingUp, Target, User as UserIcon, CheckCircle, ArrowRight, IndianRupee } from 'lucide-react';

interface RecommendationData {
    analysis: string;
    topCareers: {
        title: string;
        description: string;
        salary: string;
    }[];
    courses: string[];
    jobRoles: string[];
    skillsToImprove: string[];
}

export default function HomePage() {
    const { theme } = useTheme();
    const { t } = useLanguage();

    const [formData, setFormData] = useState({
        educationLevel: '',
        stream: '',
        skills: '',
        interests: ''
    });

    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await gemini.getCareerRecommendations(
                formData.educationLevel,
                formData.stream,
                formData.skills,
                formData.interests
            );
            setRecommendations(result);
        } catch (err: any) {
            setError(err.message || t('home.error'));
        } finally {
            setLoading(false);
        }
    };

    const resourceSections = [
        {
            title: "Higher Education",
            icon: <GraduationCap size={20} />,
            links: [
                { name: "IITs", url: "https://jeeadv.ac.in/" },
                { name: "NITs", url: "https://nitc.ac.in/" },
                { name: "UGC", url: "https://www.ugc.ac.in/" },
                { name: "AICTE Colleges", url: "https://www.aicte-india.org/" }
            ]
        },
        {
            title: "Crash Courses & Skills",
            icon: <BookOpen size={20} />,
            links: [
                { name: "YouTube Learning", url: "https://www.youtube.com/learning" },
                { name: "Udemy", url: "https://www.udemy.com/" },
                { name: "Coursera", url: "https://www.coursera.org/" },
                { name: "Infosys Springboard", url: "https://infyspringboard.onwingspan.com/" },
                { name: "NPTEL", url: "https://nptel.ac.in/" },
                { name: "Skill India", url: "https://www.skillindiadigital.gov.in/" }
            ]
        },
        {
            title: "Certifications",
            icon: <Award size={20} />,
            links: [
                { name: "Google Certifications", url: "https://grow.google/certificates/" },
                { name: "Microsoft Learn", url: "https://learn.microsoft.com/" },
                { name: "AWS Training", url: "https://aws.amazon.com/training/" },
                { name: "IBM Skills", url: "https://www.ibm.com/training/" }
            ]
        },
        {
            title: "Job Portals",
            icon: <Briefcase size={20} />,
            links: [
                { name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/" },
                { name: "Naukri.com", url: "https://www.naukri.com/" },
                { name: "Indeed India", url: "https://www.indeed.co.in/" },
                { name: "Freshersworld", url: "https://www.freshersworld.com/" },
                { name: "Internshala", url: "https://internshala.com/" }
            ]
        }
    ];

    return (
        <div className="min-h-screen" style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.foreground,
        }}>
            <div className="container mx-auto px-4 py-4 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">

                    {/* Left Panel */}
                    <div className="space-y-4">
                        <div className="rounded-lg p-4 sm:p-6" style={{
                            backgroundColor: theme.colors.cardBg,
                            borderColor: theme.colors.border,
                            borderWidth: '1px'
                        }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center" style={{
                                    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`
                                }}>
                                    <GraduationCap className="text-white" size={24} />
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold">{t('home.title')}</h1>
                            </div>

                            <p className="mb-4 sm:mb-6 text-sm sm:text-base" style={{ color: theme.colors.muted }}>
                                {t('home.subtitle')}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="block mb-2 font-medium text-sm sm:text-base">
                                        {t('home.educationLevel')} <span style={{ color: theme.colors.accent }}>*</span>
                                    </label>
                                    <select
                                        name="educationLevel"
                                        value={formData.educationLevel}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-2 sm:p-3 rounded-lg border text-sm sm:text-base"
                                        style={{
                                            backgroundColor: theme.colors.inputBg,
                                            borderColor: theme.colors.border,
                                            color: theme.colors.foreground
                                        }}
                                    >
                                        <option value="">{t('home.selectLevel')}</option>
                                        <option value="Below 10th">Below 10th Standard</option>
                                        <option value="10th Standard">10th Standard</option>
                                        <option value="11th Standard">11th Standard</option>
                                        <option value="12th Standard">12th Standard</option>
                                        <option value="ITI">ITI</option>
                                        <option value="Diploma">Diploma</option>
                                        <option value="Undergraduate - B.A.">UG - B.A.</option>
                                        <option value="Undergraduate - B.Sc.">UG - B.Sc.</option>
                                        <option value="Undergraduate - B.Com.">UG - B.Com.</option>
                                        <option value="Undergraduate - B.Tech/B.E.">UG - B.Tech/B.E.</option>
                                        <option value="Undergraduate - BCA">UG - BCA</option>
                                        <option value="Undergraduate - BBA">UG - BBA</option>
                                        <option value="Postgraduate - M.A.">PG - M.A.</option>
                                        <option value="Postgraduate - M.Sc.">PG - M.Sc.</option>
                                        <option value="Postgraduate - M.Com.">PG - M.Com.</option>
                                        <option value="Postgraduate - M.Tech/M.E.">PG - M.Tech/M.E.</option>
                                        <option value="Postgraduate - MBA">PG - MBA</option>
                                        <option value="Postgraduate - MCA">PG - MCA</option>
                                        <option value="Ph.D./Doctorate">Ph.D./Doctorate</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium text-sm sm:text-base">
                                        {t('home.stream')} <span style={{ color: theme.colors.accent }}>*</span>
                                    </label>
                                    <input
                                        name="stream"
                                        type="text"
                                        value={formData.stream}
                                        onChange={handleChange}
                                        required
                                        placeholder={t('home.streamPlaceholder')}
                                        className="w-full p-2 sm:p-3 rounded-lg border text-sm sm:text-base"
                                        style={{
                                            backgroundColor: theme.colors.inputBg,
                                            borderColor: theme.colors.border,
                                            color: theme.colors.foreground
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium text-sm sm:text-base">
                                        {t('home.skills')} <span style={{ color: theme.colors.accent }}>*</span>
                                    </label>
                                    <textarea
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        required
                                        rows={3}
                                        placeholder={t('home.skillsPlaceholder')}
                                        className="w-full p-2 sm:p-3 rounded-lg border resize-none text-sm sm:text-base"
                                        style={{
                                            backgroundColor: theme.colors.inputBg,
                                            borderColor: theme.colors.border,
                                            color: theme.colors.foreground
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium text-sm sm:text-base">
                                        {t('home.interests')} <span style={{ color: theme.colors.accent }}>*</span>
                                    </label>
                                    <textarea
                                        name="interests"
                                        value={formData.interests}
                                        onChange={handleChange}
                                        required
                                        rows={3}
                                        placeholder={t('home.interestsPlaceholder')}
                                        className="w-full p-2 sm:p-3 rounded-lg border resize-none text-sm sm:text-base"
                                        style={{
                                            backgroundColor: theme.colors.inputBg,
                                            borderColor: theme.colors.border,
                                            color: theme.colors.foreground
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-50 text-sm sm:text-base"
                                    style={{
                                        backgroundColor: theme.colors.primary,
                                        color: '#ffffff'
                                    }}
                                >
                                    {loading ? t('home.analyzing') : t('home.getRecommendations')}
                                </button>
                            </form>

                            {error && (
                                <div className="mt-4 p-3 rounded-lg text-sm" style={{
                                    backgroundColor: '#fee',
                                    borderColor: '#fcc',
                                    borderWidth: '1px',
                                    color: '#c00'
                                }}>
                                    <strong>{t('home.error')}:</strong> {error}
                                </div>
                            )}
                        </div>

                        {/* Info Cards - Always Visible */}
                        {!recommendations && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-4 rounded-lg" style={{
                                    backgroundColor: theme.colors.cardBg,
                                    borderColor: theme.colors.border,
                                    borderWidth: '1px'
                                }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp size={18} style={{ color: theme.colors.primary }} />
                                        <h3 className="font-semibold text-sm">AI-Powered</h3>
                                    </div>
                                    <p className="text-xs" style={{ color: theme.colors.muted }}>
                                        Personalized career recommendations
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg" style={{
                                    backgroundColor: theme.colors.cardBg,
                                    borderColor: theme.colors.border,
                                    borderWidth: '1px'
                                }}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Target size={18} style={{ color: theme.colors.primary }} />
                                        <h3 className="font-semibold text-sm">Tailored for You</h3>
                                    </div>
                                    <p className="text-xs" style={{ color: theme.colors.muted }}>
                                        Designed for rural students
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Show after recommendations */}
                        {recommendations && !loading && (
                            <div className="space-y-4">
                                <div className="rounded-lg p-4" style={{
                                    backgroundColor: theme.colors.cardBg,
                                    borderColor: theme.colors.border,
                                    borderWidth: '1px'
                                }}>
                                    <h3 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: theme.colors.primary }}>
                                        <UserIcon size={18} />
                                        Your Profile
                                    </h3>
                                    <div className="space-y-2 text-xs sm:text-sm">
                                        <div>
                                            <span className="font-semibold">Education: </span>
                                            <span style={{ color: theme.colors.muted }}>{formData.educationLevel}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Stream: </span>
                                            <span style={{ color: theme.colors.muted }}>{formData.stream}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Skills: </span>
                                            <span style={{ color: theme.colors.muted }}>{formData.skills}</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold">Interests: </span>
                                            <span style={{ color: theme.colors.muted }}>{formData.interests}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg p-4" style={{
                                    backgroundColor: theme.colors.cardBg,
                                    borderColor: theme.colors.border,
                                    borderWidth: '1px'
                                }}>
                                    <h3 className="font-bold text-base mb-3" style={{ color: theme.colors.primary }}>
                                        📋 Next Steps
                                    </h3>
                                    <ul className="space-y-2 text-xs sm:text-sm">
                                        <li className="flex gap-2">
                                            <span style={{ color: theme.colors.primary }}>1.</span>
                                            <span>Review career recommendations</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span style={{ color: theme.colors.primary }}>2.</span>
                                            <span>Explore helpful resources</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span style={{ color: theme.colors.primary }}>3.</span>
                                            <span>Visit Chat for guidance</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span style={{ color: theme.colors.primary }}>4.</span>
                                            <span>Update your Profile</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="rounded-lg p-4" style={{
                                    backgroundColor: theme.colors.cardBg,
                                    borderColor: theme.colors.border,
                                    borderWidth: '1px'
                                }}>
                                    <h3 className="font-bold text-base mb-3" style={{ color: theme.colors.primary }}>
                                        ⚡ Quick Actions
                                    </h3>
                                    <div className="space-y-2">
                                        <Link
                                            href="/chat"
                                            className="block w-full p-2 rounded text-center text-sm font-medium transition-opacity hover:opacity-80"
                                            style={{
                                                backgroundColor: theme.colors.primary,
                                                color: '#ffffff'
                                            }}
                                        >
                                            Ask More Questions
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="block w-full p-2 rounded text-center text-sm font-medium transition-opacity hover:opacity-80"
                                            style={{
                                                backgroundColor: theme.colors.secondary,
                                                color: theme.colors.foreground,
                                                border: `1px solid ${theme.colors.border}`
                                            }}
                                        >
                                            Build Your Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setRecommendations(null);
                                                setFormData({ educationLevel: '', stream: '', skills: '', interests: '' });
                                            }}
                                            className="block w-full p-2 rounded text-center text-sm font-medium transition-opacity hover:opacity-80"
                                            style={{
                                                backgroundColor: theme.colors.muted,
                                                color: '#ffffff'
                                            }}
                                        >
                                            Start Over
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel */}
                    <div>
                        <div className="rounded-lg p-4 sm:p-6" style={{
                            backgroundColor: theme.colors.cardBg,
                            borderColor: theme.colors.border,
                            borderWidth: '1px'
                        }}>
                            {!recommendations && !loading && (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🎯</div>
                                    <h2 className="text-2xl font-bold mb-2">{t('home.readyTitle')}</h2>
                                    <p className="text-sm" style={{ color: theme.colors.muted }}>
                                        {t('home.readySubtitle')}
                                    </p>
                                </div>
                            )}

                            {loading && (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{
                                        borderColor: theme.colors.primary
                                    }}></div>
                                    <h2 className="text-xl font-semibold">{t('home.analyzingProfile')}</h2>
                                    <p className="text-sm" style={{ color: theme.colors.muted }}>
                                        This may take a few moments...
                                    </p>
                                </div>
                            )}

                            {recommendations && !loading && (
                                <div className="space-y-6 animate-fadeIn">
                                    {/* Analysis Section */}
                                    <div className="p-4 rounded-lg border-l-4" style={{
                                        backgroundColor: `${theme.colors.primary}10`,
                                        borderColor: theme.colors.primary,
                                    }}>
                                        <h3 className="font-bold text-lg mb-2" style={{ color: theme.colors.primary }}>
                                            Career Analysis
                                        </h3>
                                        <p className="text-sm leading-relaxed">
                                            {recommendations.analysis}
                                        </p>
                                    </div>

                                    {/* Top Careers */}
                                    <div>
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: theme.colors.primary }}>
                                            <Briefcase size={20} />
                                            Top Career Paths
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {recommendations.topCareers.map((career, idx) => (
                                                <div key={idx} className="p-4 rounded-lg border transition-all hover:shadow-md" style={{
                                                    backgroundColor: theme.colors.cardBg,
                                                    borderColor: theme.colors.border,
                                                }}>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-lg" style={{ color: theme.colors.primary }}>
                                                            {career.title}
                                                        </h4>
                                                        <span className="text-xs px-2 py-1 rounded-full flex items-center gap-1" style={{
                                                            backgroundColor: `${theme.colors.accent}20`,
                                                            color: theme.colors.accent
                                                        }}>
                                                            <IndianRupee size={12} />
                                                            {career.salary}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        {career.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Skills & Courses Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Skills */}
                                        <div>
                                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: theme.colors.primary }}>
                                                <Target size={18} />
                                                Skills to Build
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {recommendations.skillsToImprove.map((skill, idx) => (
                                                    <span key={idx} className="text-xs px-3 py-1.5 rounded-full border" style={{
                                                        backgroundColor: theme.colors.inputBg,
                                                        borderColor: theme.colors.border,
                                                    }}>
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Courses */}
                                        <div>
                                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: theme.colors.primary }}>
                                                <BookOpen size={18} />
                                                Recommended Courses
                                            </h3>
                                            <ul className="space-y-2">
                                                {recommendations.courses.map((course, idx) => (
                                                    <li key={idx} className="text-sm flex items-start gap-2">
                                                        <CheckCircle size={16} className="mt-0.5 shrink-0" style={{ color: theme.colors.accent }} />
                                                        <span>{course}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Job Roles */}
                                    <div>
                                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: theme.colors.primary }}>
                                            <UserIcon size={18} />
                                            Target Job Roles
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {recommendations.jobRoles.map((role, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm p-2 rounded border" style={{
                                                    borderColor: theme.colors.border,
                                                    backgroundColor: theme.colors.inputBg
                                                }}>
                                                    <ArrowRight size={14} style={{ color: theme.colors.primary }} />
                                                    {role}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Resources Section */}
                                    <div className="mt-8 pt-6 border-t" style={{ borderColor: theme.colors.border }}>
                                        <h3 className="text-xl font-bold mb-4" style={{ color: theme.colors.primary }}>
                                            📚 Helpful Resources
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {resourceSections.map((section, idx) => (
                                                <div key={idx} className="p-3 rounded-lg" style={{
                                                    backgroundColor: `${theme.colors.primary}08`,
                                                    borderColor: theme.colors.border,
                                                    borderWidth: '1px'
                                                }}>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div style={{ color: theme.colors.primary }}>{section.icon}</div>
                                                        <h4 className="font-bold text-sm" style={{ color: theme.colors.primary }}>
                                                            {section.title}
                                                        </h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {section.links.map((link, linkIdx) => (
                                                            <a
                                                                key={linkIdx}
                                                                href={link.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center justify-between p-2 rounded hover:opacity-80 transition-all text-xs"
                                                                style={{
                                                                    backgroundColor: theme.colors.inputBg,
                                                                    color: theme.colors.foreground
                                                                }}
                                                            >
                                                                <span>{link.name}</span>
                                                                <ExternalLink size={12} style={{ color: theme.colors.accent }} />
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
