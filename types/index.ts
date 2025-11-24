export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // In a real app, never store plain text passwords
}

export interface Education {
    level: string;
    stream: string;
    institution?: string;
    year?: string;
}

export interface Experience {
    role: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Internship {
    role: string;
    company: string;
    duration: string;
    description: string;
}

export interface Project {
    title: string;
    description: string;
    technologies: string[];
    link?: string;
}

export interface Certification {
    name: string;
    issuer: string;
    date: string;
}

export interface Course {
    name: string;
    institution: string;
    date: string;
}

export interface SocialProfile {
    platform: string;
    url: string;
}

export interface Profile {
    about: string;
    education: Education[];
    experience: Experience[];
    internships: Internship[];
    projects: Project[];
    technicalSkills: string[];
    skills: string[];
    socialProfiles: SocialProfile[];
    accomplishments: string[];
    contact: {
        phone: string;
        email: string;
        address: string;
    };
    languages: string[];
    personal: {
        dob: string;
        gender: string;
        fatherName: string;
        motherName: string;
    };
    certificates: Certification[];
    courses: Course[];
    extracurricular: string[];
    workshops: string[];
    conferences: string[];
    theme?: string;
    profilePhoto?: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    content: string;
    timestamp: number;
}

export interface CareerAssessment {
    educationLevel: string;
    stream: string;
    skills: string;
    interests: string;
    recommendations?: string;
}
