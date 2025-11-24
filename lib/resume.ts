import jsPDF from "jspdf";
import { Profile } from "@/types";

export const THEMES: Record<string, { primary: [number, number, number], text: [number, number, number], name: string }> = {
    "Classic Blue": { primary: [0, 51, 102], text: [0, 0, 0], name: "Classic Blue" },
    "Modern Black": { primary: [0, 0, 0], text: [30, 30, 30], name: "Modern Black" },
    "Emerald Green": { primary: [5, 150, 105], text: [0, 0, 0], name: "Emerald Green" },
    "Royal Purple": { primary: [124, 58, 237], text: [0, 0, 0], name: "Royal Purple" },
    "Crimson Red": { primary: [220, 38, 38], text: [0, 0, 0], name: "Crimson Red" },
    "Slate Gray": { primary: [71, 85, 105], text: [0, 0, 0], name: "Slate Gray" },
    "Ocean Teal": { primary: [13, 148, 136], text: [0, 0, 0], name: "Ocean Teal" },
    "Sunset Orange": { primary: [234, 88, 12], text: [0, 0, 0], name: "Sunset Orange" },
    "Midnight Indigo": { primary: [49, 46, 129], text: [0, 0, 0], name: "Midnight Indigo" },
    "Chocolate Brown": { primary: [120, 53, 15], text: [0, 0, 0], name: "Chocolate Brown" },
};

export const generateResume = (profile: Profile, userName: string) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    const themeName = profile.theme || "Classic Blue";
    const theme = THEMES[themeName] || THEMES["Classic Blue"];
    const primaryColor = theme.primary;

    // Helper to add text and advance Y position
    const addText = (text: string, size: number, style: string = "normal", align: "left" | "center" | "right" = "left", color: [number, number, number] = [0, 0, 0]) => {
        doc.setFontSize(size);
        doc.setFont("helvetica", style);
        doc.setTextColor(color[0], color[1], color[2]);

        if (align === "center") {
            doc.text(text, pageWidth / 2, yPos, { align: "center" });
        } else if (align === "right") {
            doc.text(text, pageWidth - margin, yPos, { align: "right" });
        } else {
            doc.text(text, margin, yPos);
        }
        // Reset color to black
        doc.setTextColor(0, 0, 0);
        yPos += size / 2 + 2;
    };

    // Helper to add section header
    const addSection = (title: string) => {
        yPos += 5;
        // Check for page break
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }

        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setLineWidth(0.5);

        addText(title.toUpperCase(), 12, "bold", "left", primaryColor);
        yPos -= 1; // Adjust for line
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 6;
    };

    // Header
    addText(userName.toUpperCase(), 22, "bold", "center", primaryColor);
    yPos += 2;

    // Add profile photo if available
    if (profile.profilePhoto) {
        try {
            const imgWidth = 25;
            const imgHeight = 25;
            const xPos = pageWidth - margin - imgWidth;
            const yPosImg = 15;

            doc.addImage(profile.profilePhoto, 'JPEG', xPos, yPosImg, imgWidth, imgHeight, undefined, 'FAST');
        } catch (error) {
            console.error('Error adding profile photo to PDF:', error);
        }
    }

    // Contact Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const contactText = `${profile.contact.email} | ${profile.contact.phone} | ${profile.contact.address}`;
    doc.text(contactText, pageWidth / 2, yPos, { align: "center" });
    yPos += 6;

    // Social Profiles
    if (profile.socialProfiles && profile.socialProfiles.length > 0) {
        const socialText = profile.socialProfiles.map(s => `${s.platform}: ${s.url}`).join(" | ");
        // Split if too long
        const splitSocial = doc.splitTextToSize(socialText, pageWidth - 2 * margin);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(splitSocial, pageWidth / 2, yPos, { align: "center" });
        doc.setTextColor(0, 0, 0);
        yPos += splitSocial.length * 5 + 5;
    } else {
        yPos += 5;
    }

    // Professional Summary
    if (profile.about) {
        addSection("Professional Summary");
        const splitAbout = doc.splitTextToSize(profile.about, pageWidth - 2 * margin);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(splitAbout, margin, yPos);
        yPos += splitAbout.length * 5 + 5;
    }

    // Education
    if (profile.education && profile.education.length > 0) {
        addSection("Education");
        profile.education.forEach((edu) => {
            if (yPos > 270) { doc.addPage(); yPos = 20; }

            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(`${edu.level} - ${edu.stream}`, margin, yPos);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`${edu.institution} | ${edu.year}`, margin, yPos + 5);

            yPos += 12;
        });
    }

    // Professional Experience
    if (profile.experience && profile.experience.length > 0) {
        addSection("Professional Experience");
        profile.experience.forEach((exp) => {
            if (yPos > 260) { doc.addPage(); yPos = 20; }

            // Role and Dates
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(exp.role, margin, yPos);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`${exp.startDate} - ${exp.endDate}`, pageWidth - margin, yPos, { align: "right" });

            yPos += 5;

            // Company
            doc.setFont("helvetica", "bold"); // Medium weight approximation
            doc.setTextColor(80, 80, 80);
            doc.text(exp.company, margin, yPos);
            doc.setTextColor(0, 0, 0);

            yPos += 5;

            // Description
            if (exp.description) {
                doc.setFont("helvetica", "normal");
                const splitDesc = doc.splitTextToSize(exp.description, pageWidth - 2 * margin);
                doc.text(splitDesc, margin, yPos);
                yPos += splitDesc.length * 5;
            }

            yPos += 4;
        });
    }

    // Internships
    if (profile.internships && profile.internships.length > 0) {
        addSection("Internships");
        profile.internships.forEach((intern) => {
            if (yPos > 260) { doc.addPage(); yPos = 20; }

            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(intern.role, margin, yPos);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(intern.duration, pageWidth - margin, yPos, { align: "right" });

            yPos += 5;

            doc.setFont("helvetica", "bold");
            doc.setTextColor(80, 80, 80);
            doc.text(intern.company, margin, yPos);
            doc.setTextColor(0, 0, 0);

            yPos += 5;

            if (intern.description) {
                doc.setFont("helvetica", "normal");
                const splitDesc = doc.splitTextToSize(intern.description, pageWidth - 2 * margin);
                doc.text(splitDesc, margin, yPos);
                yPos += splitDesc.length * 5;
            }

            yPos += 4;
        });
    }

    // Projects
    if (profile.projects && profile.projects.length > 0) {
        addSection("Projects");
        profile.projects.forEach((proj) => {
            if (yPos > 260) { doc.addPage(); yPos = 20; }

            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            let title = proj.title;
            if (proj.link) title += ` (${proj.link})`;
            doc.text(title, margin, yPos);

            yPos += 5;

            if (proj.technologies && proj.technologies.length > 0) {
                doc.setFontSize(9);
                doc.setFont("helvetica", "italic");
                doc.setTextColor(100, 100, 100);
                doc.text(`Tech: ${proj.technologies.join(", ")}`, margin, yPos);
                doc.setTextColor(0, 0, 0);
                yPos += 5;
            }

            if (proj.description) {
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                const splitDesc = doc.splitTextToSize(proj.description, pageWidth - 2 * margin);
                doc.text(splitDesc, margin, yPos);
                yPos += splitDesc.length * 5;
            }

            yPos += 3;
        });
    }

    // Certifications & Courses
    if ((profile.certificates && profile.certificates.length > 0) || (profile.courses && profile.courses.length > 0)) {
        addSection("Certifications & Courses");

        if (profile.certificates) {
            profile.certificates.forEach((cert) => {
                if (yPos > 270) { doc.addPage(); yPos = 20; }
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                const text = `${cert.name} - ${cert.issuer} (${cert.date})`;
                doc.text(`• ${text}`, margin, yPos);
                yPos += 5;
            });
        }

        if (profile.courses) {
            profile.courses.forEach((course) => {
                if (yPos > 270) { doc.addPage(); yPos = 20; }
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                const text = `${course.name} - ${course.institution} (${course.date})`;
                doc.text(`• ${text}`, margin, yPos);
                yPos += 5;
            });
        }
    }

    // Skills & Languages
    if ((profile.technicalSkills && profile.technicalSkills.length > 0) ||
        (profile.skills && profile.skills.length > 0) ||
        (profile.languages && profile.languages.length > 0)) {

        addSection("Skills & Languages");

        if (profile.technicalSkills && profile.technicalSkills.length > 0) {
            if (yPos > 270) { doc.addPage(); yPos = 20; }
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("Technical:", margin, yPos);
            doc.setFont("helvetica", "normal");
            const splitTech = doc.splitTextToSize(profile.technicalSkills.join(", "), pageWidth - margin - 40);
            doc.text(splitTech, margin + 25, yPos);
            yPos += splitTech.length * 5 + 2;
        }

        if (profile.skills && profile.skills.length > 0) {
            if (yPos > 270) { doc.addPage(); yPos = 20; }
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("Soft Skills:", margin, yPos);
            doc.setFont("helvetica", "normal");
            const splitSoft = doc.splitTextToSize(profile.skills.join(", "), pageWidth - margin - 40);
            doc.text(splitSoft, margin + 25, yPos);
            yPos += splitSoft.length * 5 + 2;
        }

        if (profile.languages && profile.languages.length > 0) {
            if (yPos > 270) { doc.addPage(); yPos = 20; }
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("Languages:", margin, yPos);
            doc.setFont("helvetica", "normal");
            const splitLang = doc.splitTextToSize(profile.languages.join(", "), pageWidth - margin - 40);
            doc.text(splitLang, margin + 25, yPos);
            yPos += splitLang.length * 5 + 2;
        }
    }

    // Extracurricular
    if (profile.extracurricular && profile.extracurricular.length > 0) {
        addSection("Extracurricular Activities");
        const splitExtra = doc.splitTextToSize(profile.extracurricular.join(", "), pageWidth - 2 * margin);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(splitExtra, margin, yPos);
        yPos += splitExtra.length * 5 + 5;
    }

    // Save
    doc.save(`${userName.replace(/\s+/g, '_')}_Resume.pdf`);
};
