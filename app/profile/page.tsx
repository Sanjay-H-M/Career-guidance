"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/auth";
import { generateResume, THEMES } from "@/lib/resume";
import { Profile, User, ChatMessage } from "@/types";
import { User as UserIcon, FileText, Save, Download, Clock, Trash2, Camera } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProfilePage() {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<"info" | "resume">("info");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    const [profile, setProfile] = useState<Profile>({
        about: "",
        education: [],
        experience: [],
        internships: [],
        projects: [],
        technicalSkills: [],
        skills: [],
        socialProfiles: [],
        accomplishments: [],
        contact: { phone: "", email: "", address: "" },
        languages: [],
        personal: { dob: "", gender: "", fatherName: "", motherName: "" },
        certificates: [],
        courses: [],
        extracurricular: [],
        workshops: [],
        conferences: []
    });

    // Helper for array inputs
    const handleArrayInput = (
        field: keyof Profile,
        value: string
    ) => {
        setProfile(prev => ({
            ...prev,
            [field]: value.split(",").map(s => s.trim())
        }));
    };

    // Theme-aware input styles
    const inputStyle = {
        backgroundColor: theme.colors.inputBg,
        borderColor: theme.colors.border,
        color: theme.colors.foreground
    };

    const disabledInputStyle = {
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.border,
        color: theme.colors.muted
    };

    const labelStyle = {
        color: theme.colors.foreground
    };

    // Handle photo upload
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            // Validate file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size should be less than 2MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({
                    ...prev,
                    profilePhoto: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove photo
    const handleRemovePhoto = () => {
        setProfile(prev => ({
            ...prev,
            profilePhoto: undefined
        }));
    };

    useEffect(() => {
        const currentUser = auth.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            setProfile(prev => ({
                ...prev,
                contact: { ...prev.contact, email: currentUser.email }
            }));

            // Load saved profile
            const savedProfile = localStorage.getItem(`cga_profile_${currentUser.email}`);
            if (savedProfile) {
                setProfile(JSON.parse(savedProfile));
            }
        }

        // Load chat history
        const history = localStorage.getItem("cga_chat_history");
        if (history) {
            const parsed = JSON.parse(history);
            // Get last 3 messages
            setChatHistory(parsed.slice(-3).reverse());
        }
    }, []);

    const handleSave = () => {
        if (user) {
            localStorage.setItem(`cga_profile_${user.email}`, JSON.stringify(profile));
            alert("Profile saved successfully!");
        }
    };

    const handleDownloadResume = () => {
        if (user) {
            generateResume(profile, user.name);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-[calc(100vh-64px)] p-4 md:p-8" style={{
            backgroundColor: theme.colors.background
        }}>
            <div className="max-w-7xl mx-auto">
                <div className="rounded-lg shadow-md overflow-hidden mb-8" style={{
                    backgroundColor: theme.colors.cardBg
                }}>
                    <div className="p-8 text-white" style={{
                        backgroundColor: theme.colors.primary
                    }}>
                        <h1 className="text-3xl font-bold">{t('profile.title')}</h1>
                        <p className="opacity-80 mt-2">{t('profile.subtitle')}</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex" style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                        <button
                            onClick={() => setActiveTab("info")}
                            className="flex-1 py-4 text-center font-medium transition-colors"
                            style={activeTab === "info" ? {
                                color: theme.colors.primary,
                                borderBottom: `2px solid ${theme.colors.primary}`,
                                backgroundColor: `${theme.colors.primary}10`
                            } : {
                                color: theme.colors.muted
                            }}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <UserIcon size={20} />
                                {t('profile.profileTab')}
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("resume")}
                            className="flex-1 py-4 text-center font-medium transition-colors"
                            style={activeTab === "resume" ? {
                                color: theme.colors.primary,
                                borderBottom: `2px solid ${theme.colors.primary}`,
                                backgroundColor: `${theme.colors.primary}10`
                            } : {
                                color: theme.colors.muted
                            }}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <FileText size={20} />
                                {t('profile.resumeTab')}
                            </div>
                        </button>
                    </div>

                    <div className="p-6 md:p-8">
                        {activeTab === "info" ? (
                            <div className="space-y-8">
                                {/* Personal Details */}
                                <section>
                                    <h3 className="text-lg font-bold mb-4 pb-2" style={{
                                        color: theme.colors.primary,
                                        borderBottom: `1px solid ${theme.colors.border}`
                                    }}>{t('profile.personalDetails')}</h3>

                                    {/* Profile Photo Upload */}
                                    <div className="mb-6 p-4 rounded-lg" style={{
                                        backgroundColor: `${theme.colors.primary}10`,
                                        border: `1px solid ${theme.colors.border}`
                                    }}>
                                        <label className="block text-sm font-medium mb-3" style={{ color: theme.colors.foreground }}>
                                            {t('profile.profilePhoto')}
                                        </label>
                                        <div className="flex items-center gap-4">
                                            {/* Photo Preview */}
                                            <div className="relative">
                                                {profile.profilePhoto ? (
                                                    <div className="relative">
                                                        <img
                                                            src={profile.profilePhoto}
                                                            alt="Profile"
                                                            className="w-24 h-24 rounded-full object-cover border-4 shadow-md"
                                                            style={{ borderColor: theme.colors.cardBg }}
                                                        />
                                                        <button
                                                            onClick={handleRemovePhoto}
                                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                            title="Remove photo"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-md" style={{
                                                        backgroundColor: theme.colors.secondary,
                                                        borderColor: theme.colors.cardBg
                                                    }}>
                                                        <Camera size={32} style={{ color: theme.colors.muted }} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Upload Button */}
                                            <div className="flex-1">
                                                <label className="cursor-pointer">
                                                    <div className="py-2 px-4 rounded-md transition-colors inline-flex items-center gap-2" style={{
                                                        backgroundColor: theme.colors.primary,
                                                        color: '#ffffff'
                                                    }}>
                                                        <Camera size={18} />
                                                        {profile.profilePhoto ? t('profile.changePhoto') : t('profile.uploadPhoto')}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handlePhotoUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                                <p className="text-xs mt-2" style={{ color: theme.colors.muted }}>
                                                    {t('profile.photoRecommendation')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1" style={labelStyle}>
                                                {t('profile.fullName')}
                                            </label>
                                            <input
                                                type="text"
                                                value={user.name}
                                                disabled
                                                className="w-full px-3 py-2 border rounded-md"
                                                style={disabledInputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1" style={labelStyle}>
                                                {t('profile.email')}
                                            </label>
                                            <input
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className="w-full px-3 py-2 border rounded-md"
                                                style={disabledInputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1" style={labelStyle}>
                                                {t('profile.phone')}
                                            </label>
                                            <input
                                                type="tel"
                                                value={profile.contact.phone}
                                                onChange={(e) => setProfile({ ...profile, contact: { ...profile.contact, phone: e.target.value } })}
                                                className="w-full px-3 py-2 border rounded-md focus:ring-2 outline-none"
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                            <input
                                                type="date"
                                                value={profile.personal.dob}
                                                onChange={(e) => setProfile({ ...profile, personal: { ...profile.personal, dob: e.target.value } })}
                                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#003366] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                            <select
                                                value={profile.personal.gender}
                                                onChange={(e) => setProfile({ ...profile, personal: { ...profile.personal, gender: e.target.value } })}
                                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#003366] outline-none"
                                            >
                                                <option value="">Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                                            <input
                                                type="text"
                                                value={profile.personal.fatherName}
                                                onChange={(e) => setProfile({ ...profile, personal: { ...profile.personal, fatherName: e.target.value } })}
                                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#003366] outline-none"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Social Profiles */}
                                <section>
                                    <h3 className="text-lg font-bold text-[#003366] mb-4 border-b pb-2">Social Profiles</h3>
                                    {profile.socialProfiles.map((social, index) => (
                                        <div key={index} className="flex gap-4 mb-2">
                                            <div className="w-1/3">
                                                <select
                                                    value={social.platform}
                                                    onChange={(e) => {
                                                        const newSocial = [...profile.socialProfiles];
                                                        newSocial[index].platform = e.target.value;
                                                        setProfile({ ...profile, socialProfiles: newSocial });
                                                    }}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                >
                                                    <option value="">Select Platform</option>
                                                    <option value="LinkedIn">LinkedIn</option>
                                                    <option value="GitHub">GitHub</option>
                                                    <option value="LeetCode">LeetCode</option>
                                                    <option value="X (Twitter)">X (Twitter)</option>
                                                    <option value="Instagram">Instagram</option>
                                                    <option value="Facebook">Facebook</option>
                                                    <option value="WhatsApp">WhatsApp</option>
                                                    <option value="Portfolio">Portfolio</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    placeholder="URL / Handle"
                                                    value={social.url}
                                                    onChange={(e) => {
                                                        const newSocial = [...profile.socialProfiles];
                                                        newSocial[index].url = e.target.value;
                                                        setProfile({ ...profile, socialProfiles: newSocial });
                                                    }}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const newSocial = profile.socialProfiles.filter((_, i) => i !== index);
                                                    setProfile({ ...profile, socialProfiles: newSocial });
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setProfile({
                                            ...profile,
                                            socialProfiles: [...profile.socialProfiles, { platform: "", url: "" }]
                                        })}
                                        className="text-[#003366] text-sm font-medium hover:underline"
                                    >
                                        + Add Social Profile
                                    </button>
                                </section>

                                {/* Professional Summary */}
                                <section>
                                    <h3 className="text-lg font-bold text-[#003366] mb-4 border-b pb-2">About</h3>
                                    <textarea
                                        rows={4}
                                        value={profile.about}
                                        onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#003366] outline-none"
                                        placeholder="Write a brief professional summary..."
                                    />
                                </section>

                                {/* Professional Experience */}
                                <section>
                                    <h3 className="text-lg font-bold text-[#003366] mb-4 border-b pb-2">Professional Experience</h3>
                                    {profile.experience.map((exp, index) => (
                                        <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md border">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                                <input
                                                    placeholder="Role"
                                                    value={exp.role}
                                                    onChange={(e) => {
                                                        const newExp = [...profile.experience];
                                                        newExp[index].role = e.target.value;
                                                        setProfile({ ...profile, experience: newExp });
                                                    }}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                />
                                                <input
                                                    placeholder="Company"
                                                    value={exp.company}
                                                    onChange={(e) => {
                                                        const newExp = [...profile.experience];
                                                        newExp[index].company = e.target.value;
                                                        setProfile({ ...profile, experience: newExp });
                                                    }}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                />
                                                <input
                                                    type="date"
                                                    placeholder="Start Date"
                                                    value={exp.startDate}
                                                    onChange={(e) => {
                                                        const newExp = [...profile.experience];
                                                        newExp[index].startDate = e.target.value;
                                                        setProfile({ ...profile, experience: newExp });
                                                    }}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                />
                                                <input
                                                    type="date"
                                                    placeholder="End Date"
                                                    value={exp.endDate}
                                                    onChange={(e) => {
                                                        const newExp = [...profile.experience];
                                                        newExp[index].endDate = e.target.value;
                                                        setProfile({ ...profile, experience: newExp });
                                                    }}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Description"
                                                value={exp.description}
                                                onChange={(e) => {
                                                    const newExp = [...profile.experience];
                                                    newExp[index].description = e.target.value;
                                                    setProfile({ ...profile, experience: newExp });
                                                }}
                                                className="w-full px-3 py-2 border rounded-md"
                                                rows={2}
                                            />
                                            <button
                                                onClick={() => {
                                                    const newExp = profile.experience.filter((_, i) => i !== index);
                                                    setProfile({ ...profile, experience: newExp });
                                                }}
                                                className="text-red-500 text-sm mt-2 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setProfile({
                                            ...profile,
                                            experience: [...profile.experience, { role: "", company: "", startDate: "", endDate: "", description: "" }]
                                        })}
                                        className="text-[#003366] text-sm font-medium hover:underline"
                                    >
                                        + Add Experience
                                    </button>
                                </section>

                                {/* Internships */}
                                <section>
                                    <h3 className="text-lg font-bold text-[#003366] mb-4 border-b pb-2">Internships</h3>
                                    {profile.internships.map((intern, index) => (
                                        <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md border">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                                <input
                                                    placeholder="Role"
                                                    value={intern.role}
                                                    onChange={(e) => {
                                                        const newIntern = [...profile.internships];
                                                        newIntern[index].role = e.target.value;
                                                        setProfile({ ...profile, internships: newIntern });
                                                    }}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                />
                                                <input
                                                    placeholder="Company"
                                                    value={intern.company}
                                                    onChange={(e) => {
                                                        const newIntern = [...profile.internships];
                                                        newIntern[index].company = e.target.value;
                                                        setProfile({ ...profile, internships: newIntern });
                                                    }}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                />
                                                <input
                                                    placeholder="Duration"
                                                    value={intern.duration}
                                                    onChange={(e) => {
                                                        const newIntern = [...profile.internships];
                                                        newIntern[index].duration = e.target.value;
                                                        setProfile({ ...profile, internships: newIntern });
                                                    }}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Description"
                                                value={intern.description}
                                                onChange={(e) => {
                                                    const newIntern = [...profile.internships];
                                                    newIntern[index].description = e.target.value;
                                                    setProfile({ ...profile, internships: newIntern });
                                                }}
                                                className="w-full px-3 py-2 border rounded-md"
                                                rows={2}
                                            />
                                            <button
                                                onClick={() => {
                                                    const newIntern = profile.internships.filter((_, i) => i !== index);
                                                    setProfile({ ...profile, internships: newIntern });
                                                }}
                                                className="text-red-500 text-sm mt-2 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setProfile({
                                            ...profile,
                                            internships: [...profile.internships, { role: "", company: "", duration: "", description: "" }]
                                        })}
                                        className="text-[#003366] text-sm font-medium hover:underline"
                                    >
                                        + Add Internship
                                    </button>
                                </section>

                                {/* Projects */}
                                <section>
                                    <h3 className="text-lg font-bold text-[#003366] mb-4 border-b pb-2">Projects</h3>
                                    {profile.projects.map((proj, index) => (
                                        <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md border">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                                <input
                                                    placeholder="Title"
                                                    value={proj.title}
                                                    onChange={(e) => {
                                                        const newProj = [...profile.projects];
                                                        newProj[index].title = e.target.value;
                                                        setProfile({ ...profile, projects: newProj });
                                                    }}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                />
                                                <input
                                                    placeholder="Technologies (comma separated)"
                                                    value={proj.technologies.join(", ")}
                                                    onChange={(e) => {
                                                        const newProj = [...profile.projects];
                                                        newProj[index].technologies = e.target.value.split(",").map(s => s.trim());
                                                        setProfile({ ...profile, projects: newProj });
                                                    }}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                />
                                                <input
                                                    placeholder="Link (Optional)"
                                                    value={proj.link || ""}
                                                    onChange={(e) => {
                                                        const newProj = [...profile.projects];
                                                        newProj[index].link = e.target.value;
                                                        setProfile({ ...profile, projects: newProj });
                                                    }}
                                                    className="w-full px-3 py-2 border rounded-md"
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Description"
                                                value={proj.description}
                                                onChange={(e) => {
                                                    const newProj = [...profile.projects];
                                                    newProj[index].description = e.target.value;
                                                    setProfile({ ...profile, projects: newProj });
                                                }}
                                                className="w-full px-3 py-2 border rounded-md"
                                                rows={2}
                                            />
                                            <button
                                                onClick={() => {
                                                    const newProj = profile.projects.filter((_, i) => i !== index);
                                                    setProfile({ ...profile, projects: newProj });
                                                }}
                                                className="text-red-500 text-sm mt-2 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setProfile({
                                            ...profile,
                                            projects: [...profile.projects, { title: "", description: "", technologies: [] }]
                                        })}
                                        className="text-[#003366] text-sm font-medium hover:underline"
                                    >
                                        + Add Project
                                    </button>
                                </section>

                                {/* Certifications & Courses */}
                                <section>
                                    <h3 className="text-lg font-bold text-[#003366] mb-4 border-b pb-2">Certifications & Courses</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-semibold mb-2">Certifications</h4>
                                            {profile.certificates.map((cert, index) => (
                                                <div key={index} className="mb-2 p-2 bg-gray-50 border rounded-md">
                                                    <input
                                                        placeholder="Name"
                                                        value={cert.name}
                                                        onChange={(e) => {
                                                            const newCerts = [...profile.certificates];
                                                            newCerts[index].name = e.target.value;
                                                            setProfile({ ...profile, certificates: newCerts });
                                                        }}
                                                        className="w-full mb-1 px-2 py-1 border rounded"
                                                    />
                                                    <input
                                                        placeholder="Issuer"
                                                        value={cert.issuer}
                                                        onChange={(e) => {
                                                            const newCerts = [...profile.certificates];
                                                            newCerts[index].issuer = e.target.value;
                                                            setProfile({ ...profile, certificates: newCerts });
                                                        }}
                                                        className="w-full mb-1 px-2 py-1 border rounded"
                                                    />
                                                    <input
                                                        type="date"
                                                        value={cert.date}
                                                        onChange={(e) => {
                                                            const newCerts = [...profile.certificates];
                                                            newCerts[index].date = e.target.value;
                                                            setProfile({ ...profile, certificates: newCerts });
                                                        }}
                                                        className="w-full mb-1 px-2 py-1 border rounded"
                                                    />
                                                    <button onClick={() => {
                                                        const newCerts = profile.certificates.filter((_, i) => i !== index);
                                                        setProfile({ ...profile, certificates: newCerts });
                                                    }} className="text-red-500 text-xs">Remove</button>
                                                </div>
                                            ))}
                                            <button onClick={() => setProfile({ ...profile, certificates: [...profile.certificates, { name: "", issuer: "", date: "" }] })} className="text-[#003366] text-sm hover:underline">+ Add Certification</button>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2">Courses</h4>
                                            {profile.courses.map((course, index) => (
                                                <div key={index} className="mb-2 p-2 bg-gray-50 border rounded-md">
                                                    <input
                                                        placeholder="Name"
                                                        value={course.name}
                                                        onChange={(e) => {
                                                            const newCourses = [...profile.courses];
                                                            newCourses[index].name = e.target.value;
                                                            setProfile({ ...profile, courses: newCourses });
                                                        }}
                                                        className="w-full mb-1 px-2 py-1 border rounded"
                                                    />
                                                    <input
                                                        placeholder="Institution"
                                                        value={course.institution}
                                                        onChange={(e) => {
                                                            const newCourses = [...profile.courses];
                                                            newCourses[index].institution = e.target.value;
                                                            setProfile({ ...profile, courses: newCourses });
                                                        }}
                                                        className="w-full mb-1 px-2 py-1 border rounded"
                                                    />
                                                    <input
                                                        type="date"
                                                        value={course.date}
                                                        onChange={(e) => {
                                                            const newCourses = [...profile.courses];
                                                            newCourses[index].date = e.target.value;
                                                            setProfile({ ...profile, courses: newCourses });
                                                        }}
                                                        className="w-full mb-1 px-2 py-1 border rounded"
                                                    />
                                                    <button onClick={() => {
                                                        const newCourses = profile.courses.filter((_, i) => i !== index);
                                                        setProfile({ ...profile, courses: newCourses });
                                                    }} className="text-red-500 text-xs">Remove</button>
                                                </div>
                                            ))}
                                            <button onClick={() => setProfile({ ...profile, courses: [...profile.courses, { name: "", institution: "", date: "" }] })} className="text-[#003366] text-sm hover:underline">+ Add Course</button>
                                        </div>
                                    </div>
                                </section>

                                {/* Skills & Others */}
                                <section>
                                    <h3 className="text-lg font-bold text-[#003366] mb-4 border-b pb-2">Skills & Others</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Technical Skills (comma separated)</label>
                                            <textarea
                                                rows={3}
                                                value={profile.technicalSkills.join(", ")}
                                                onChange={(e) => handleArrayInput("technicalSkills", e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#003366] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Soft Skills (comma separated)</label>
                                            <textarea
                                                rows={3}
                                                value={profile.skills.join(", ")}
                                                onChange={(e) => handleArrayInput("skills", e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#003366] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Languages (comma separated)</label>
                                            <textarea
                                                rows={3}
                                                value={profile.languages.join(", ")}
                                                onChange={(e) => handleArrayInput("languages", e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#003366] outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Extracurricular Activities (comma separated)</label>
                                            <textarea
                                                rows={3}
                                                value={profile.extracurricular.join(", ")}
                                                onChange={(e) => handleArrayInput("extracurricular", e.target.value)}
                                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#003366] outline-none"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={handleSave}
                                        className="py-2 px-6 rounded-md transition-colors flex items-center gap-2"
                                        style={{
                                            backgroundColor: theme.colors.primary,
                                            color: '#ffffff'
                                        }}
                                    >
                                        <Save size={18} />
                                        {t('profile.saveProfile')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#003366]">Resume Generator</h3>
                                        <p className="text-gray-500">Create, edit, and download your resume</p>
                                    </div>
                                    <button
                                        onClick={handleDownloadResume}
                                        className="bg-[#003366] text-white py-2 px-6 rounded-md hover:bg-[#002244] transition-colors flex items-center gap-2"
                                    >
                                        <Download size={18} />
                                        Download PDF
                                    </button>
                                </div>

                                {/* Theme Selector */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Resume Theme
                                    </label>
                                    <select
                                        value={profile.theme || "Classic Blue"}
                                        onChange={(e) => setProfile({ ...profile, theme: e.target.value })}
                                        className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#003366] outline-none"
                                    >
                                        {Object.keys(THEMES).map((themeName) => (
                                            <option key={themeName} value={themeName}>
                                                {themeName}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Choose a color theme for your resume. The preview and PDF will update accordingly.
                                    </p>
                                </div>

                                <div className="bg-gray-100 p-8 rounded-lg border border-gray-200 min-h-[600px] font-serif">
                                    {/* Resume Preview */}
                                    <div className="bg-white shadow-lg p-8 max-w-[21cm] mx-auto min-h-[29.7cm]">
                                        <div className="text-center border-b-2 pb-4 mb-6 relative" style={{ borderColor: `rgb(${THEMES[profile.theme || "Classic Blue"].primary.join(',')})` }}>
                                            {/* Profile Photo */}
                                            {profile.profilePhoto && (
                                                <div className="absolute top-0 right-0">
                                                    <img
                                                        src={profile.profilePhoto}
                                                        alt="Profile"
                                                        className="w-20 h-20 rounded-full object-cover border-2 shadow-md"
                                                        style={{ borderColor: `rgb(${THEMES[profile.theme || "Classic Blue"].primary.join(',')})` }}
                                                    />
                                                </div>
                                            )}
                                            <h1 className="text-2xl font-bold uppercase" style={{ color: `rgb(${THEMES[profile.theme || "Classic Blue"].primary.join(',')})` }}>{user.name}</h1>
                                            <p className="text-sm text-gray-600 mt-2">
                                                {profile.contact.email} | {profile.contact.phone} | {profile.contact.address}
                                            </p>
                                            {profile.socialProfiles.length > 0 && (
                                                <div className="flex flex-wrap justify-center gap-3 mt-2 text-sm" style={{ color: `rgb(${THEMES[profile.theme || "Classic Blue"].primary.join(',')})` }}>
                                                    {profile.socialProfiles.map((social, index) => (
                                                        <span key={index}>
                                                            <span className="font-bold">{social.platform}:</span> {social.url}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {profile.about && (
                                            <div className="mb-6">
                                                <h2 className="text-sm font-bold border-b border-gray-300 mb-2 uppercase" style={{ color: `rgb(${THEMES[profile.theme || "Classic Blue"].primary.join(',')})` }}>Professional Summary</h2>
                                                <p className="text-sm text-gray-700 leading-relaxed">{profile.about}</p>
                                            </div>
                                        )}

                                        {(profile.education.length > 0) && (
                                            <div className="mb-6">
                                                <h2 className="text-sm font-bold border-b border-gray-300 mb-2 uppercase" style={{ color: `rgb(${THEMES[profile.theme || "Classic Blue"].primary.join(',')})` }}>Education</h2>
                                                {profile.education.map((edu, i) => (
                                                    <div key={i} className="mb-2">
                                                        <p className="text-sm font-bold">{edu.level} - {edu.stream}</p>
                                                        <p className="text-sm text-gray-600">{edu.institution} | {edu.year}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {(profile.experience.length > 0) && (
                                            <div className="mb-6">
                                                <h2 className="text-sm font-bold border-b border-gray-300 mb-2 uppercase" style={{ color: `rgb(${THEMES[profile.theme || "Classic Blue"].primary.join(',')})` }}>Professional Experience</h2>
                                                {profile.experience.map((exp, i) => (
                                                    <div key={i} className="mb-3">
                                                        <div className="flex justify-between">
                                                            <p className="text-sm font-bold">{exp.role}</p>
                                                            <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-700">{exp.company}</p>
                                                        <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {(profile.internships.length > 0) && (
                                            <div className="mb-6">
                                                <h2 className="text-sm font-bold border-b border-gray-300 mb-2 uppercase" style={{ color: `rgb(${THEMES[profile.theme || "Classic Blue"].primary.join(',')})` }}>Internships</h2>
                                                {profile.internships.map((intern, i) => (
                                                    <div key={i} className="mb-3">
                                                        <div className="flex justify-between">
                                                            <p className="text-sm font-bold">{intern.role}</p>
                                                            <p className="text-sm text-gray-600">{intern.duration}</p>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-700">{intern.company}</p>
                                                        <p className="text-sm text-gray-600 mt-1">{intern.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {(profile.projects.length > 0) && (
                                            <div className="mb-6">
                                                <h2 className="text-sm font-bold border-b border-gray-300 mb-2 uppercase" style={{ color: `rgb(${THEMES[profile.theme || "Classic Blue"].primary.join(',')})` }}>Projects</h2>
                                                {profile.projects.map((proj, i) => (
                                                    <div key={i} className="mb-3">
                                                        <p className="text-sm font-bold">{proj.title} {proj.link && <a href={proj.link} target="_blank" className="text-blue-500 text-xs font-normal ml-1">(Link)</a>}</p>
                                                        <p className="text-xs text-gray-500 mb-1">Tech: {proj.technologies.join(", ")}</p>
                                                        <p className="text-sm text-gray-600">{proj.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {(profile.certificates.length > 0 || profile.courses.length > 0) && (
                                            <div className="mb-6">
                                                <h2 className="text-sm font-bold border-b border-gray-300 mb-2 uppercase" style={{ color: `rgb(${THEMES[profile.theme || "Classic Blue"].primary.join(',')})` }}>Certifications & Courses</h2>
                                                {profile.certificates.map((cert, i) => (
                                                    <p key={`cert-${i}`} className="text-sm text-gray-700 mb-1">
                                                        <span className="font-bold">{cert.name}</span> - {cert.issuer} ({cert.date})
                                                    </p>
                                                ))}
                                                {profile.courses.map((course, i) => (
                                                    <p key={`course-${i}`} className="text-sm text-gray-700 mb-1">
                                                        <span className="font-bold">{course.name}</span> - {course.institution} ({course.date})
                                                    </p>
                                                ))}
                                            </div>
                                        )}

                                        {(profile.technicalSkills.length > 0 || profile.skills.length > 0 || profile.languages.length > 0) && (
                                            <div className="mb-6">
                                                <h2 className="text-sm font-bold border-b border-gray-300 mb-2 uppercase" style={{ color: `rgb(${THEMES[profile.theme || "Classic Blue"].primary.join(',')})` }}>Skills & Languages</h2>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {profile.technicalSkills.length > 0 && (
                                                        <p className="text-sm"><span className="font-bold">Technical:</span> {profile.technicalSkills.join(", ")}</p>
                                                    )}
                                                    {profile.skills.length > 0 && (
                                                        <p className="text-sm"><span className="font-bold">Soft Skills:</span> {profile.skills.join(", ")}</p>
                                                    )}
                                                    {profile.languages.length > 0 && (
                                                        <p className="text-sm"><span className="font-bold">Languages:</span> {profile.languages.join(", ")}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {(profile.extracurricular.length > 0) && (
                                            <div className="mb-6">
                                                <h2 className="text-sm font-bold border-b border-gray-300 mb-2 uppercase" style={{ color: `rgb(${THEMES[profile.theme || "Classic Blue"].primary.join(',')})` }}>Extracurricular Activities</h2>
                                                <p className="text-sm text-gray-700">{profile.extracurricular.join(", ")}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chat History Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-[#003366] mb-4 flex items-center gap-2">
                    <Clock size={20} />
                    Recent Chat Interactions
                </h3>

                {chatHistory.length > 0 ? (
                    <div className="space-y-4">
                        {chatHistory.map((msg) => (
                            <div key={msg.id} className="border-b pb-3 last:border-0">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span className="capitalize font-medium">{msg.role}</span>
                                    <span>{new Date(msg.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-700 line-clamp-2">{msg.content}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm italic">No recent chat history found.</p>
                )}
            </div>
        </div>
    );
}
