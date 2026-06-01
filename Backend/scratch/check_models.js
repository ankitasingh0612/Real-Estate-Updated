import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
    try {
        console.log("Checking API Key...");
        if (!process.env.GEMINI_API_KEY) {
            console.error("No API key found in .env");
            return;
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // We have to use a model to get the client, or use the direct API
        // The SDK doesn't have a direct listModels yet in all versions
        // Let's try to fetch a simple response with gemini-1.0-pro
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await model.generateContent("test");
        console.log("Response:", result.response.text());
    } catch (err) {
        console.error("Error details:", err);
    }
}

listModels();
