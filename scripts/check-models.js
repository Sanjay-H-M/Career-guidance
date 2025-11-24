const fs = require('fs');
const path = require('path');
const https = require('https');

const envPath = path.join(__dirname, '../.env.local');
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.*)/);
    const apiKey = match ? match[1].trim() : null;

    if (!apiKey) {
        console.error("API Key not found in .env.local");
        process.exit(1);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                if (json.error) {
                    console.error("Error:", json.error);
                } else {
                    console.log("Available Models:");
                    if (json.models) {
                        json.models.forEach(m => {
                            console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(', ')})`);
                        });
                    } else {
                        console.log("No models found in response:", json);
                    }
                }
            } catch (e) {
                console.error("Error parsing JSON:", e);
                console.log("Raw data:", data);
            }
        });
    }).on('error', (e) => {
        console.error("Request error:", e);
    });
} catch (err) {
    console.error("Error reading .env.local:", err);
}
