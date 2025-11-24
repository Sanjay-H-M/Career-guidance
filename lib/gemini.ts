import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const gemini = {
    getCareerRecommendations: async (
        educationLevel: string,
        stream: string,
        skills: string,
        interests: string
    ) => {
        if (!API_KEY) {
            throw new Error("Gemini API Key is missing");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
      Act as an expert career counselor for rural students in India. 
      Based on the following profile, provide personalized career recommendations.
      
      Profile:
      - Education Level: ${educationLevel}
      - Stream/Field: ${stream}
      - Skills: ${skills}
      - Interests: ${interests}
      
      Output Format:
      Provide the response in STRICT JSON format with the following structure:
      {
        "analysis": "Brief analysis of the student's profile (2-3 sentences)",
        "topCareers": [
          {
            "title": "Career Title",
            "description": "Brief description of why this fits",
            "salary": "Expected starting salary range in INR"
          }
        ],
        "courses": ["List of 3-4 recommended courses/certifications"],
        "jobRoles": ["List of 3-4 specific job roles to target"],
        "skillsToImprove": ["List of 3-4 key skills to develop"]
      }
      
      IMPORTANT: Return ONLY the JSON. Do not include markdown formatting like \`\`\`json.
    `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();

            // Clean up markdown code blocks if present
            text = text.replace(/```json/g, "").replace(/```/g, "").trim();

            return JSON.parse(text);
        } catch (error) {
            console.error("Error generating career recommendations:", error);
            throw new Error("Failed to generate recommendations. Please try again.");
        }
    },

    getChatResponse: async (
        message: string,
        history: { role: string; parts: { text: string }[] }[],
        language: string
    ) => {
        if (!API_KEY) {
            throw new Error("Gemini API Key is missing");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const systemPrompt = `
      You are a helpful and empathetic career guidance counselor for students in India.
      Your goal is to help students navigate their career paths, education choices, and skill development.
      
      Current Language Context: ${language}
      Please respond in ${language}. If the user asks in a different language, adapt to that language but try to keep the conversation in ${language} if requested.
      
      Guidelines:
      - Be encouraging and positive.
      - Provide specific, actionable advice.
      - Keep answers concise but informative.
      - If you don't know something, admit it and suggest where to find the info.
      - Focus on career, education, and skills.
    `;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: `Understood. I will act as a career counselor and respond in ${language}.` }],
                },
                ...history
            ],
        });

        try {
            const result = await chat.sendMessage(message);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Error in chat:", error);
            throw new Error("Failed to get response. Please try again.");
        }
    }
};
