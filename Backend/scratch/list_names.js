import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    try {
        const key = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data.models) {
            console.log("Available models:");
            data.models.forEach(m => console.log(`- ${m.name}`));
        } else {
            console.log("No models found or error:", data);
        }
    } catch (err) {
        console.error("Error:", err);
    }
}

listModels();
