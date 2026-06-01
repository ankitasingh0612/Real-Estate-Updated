import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const aiRoute = express.Router();

const SYSTEM_PROMPT = `
You are the Quirex Assistant, a helpful and professional real estate expert for the "Quirex" platform. 
Your goal is to help users navigate the website and understand its features.

Website Name: Quirex
Platform Purpose: A modern real estate marketplace for buying, selling, and managing properties.

KEY FEATURES & TRAINING DATA:
1. User Roles: Buyer, Seller, Administrator.
2. Registration: Admin PIN is "admin9076".
3. Features: Property listings, Wishlist, Buying, Scheduling Visits, Real-time Chat, Dashboard Stats.
`;

aiRoute.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        
        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ GEMINI_API_KEY is missing!");
            return res.status(500).json({ code: 500, message: "API Key missing." });
        }

        // Initialize with v1beta version as it's the one that worked in diagnostics
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Use gemini-2.5-flash which is confirmed to be available in 2026
        const model = genAI.getGenerativeModel(
            { model: "gemini-2.5-flash" },
            { apiVersion: 'v1beta' }
        );

        console.log("🤖 Starting AI Chat with model: gemini-1.5-flash (v1beta)");

        const chatSession = model.startChat({
            history: [
                { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
                { role: "model", parts: [{ text: "Understood. I am your Quirex assistant." }] },
                ...(history || [])
            ],
        });

        const result = await chatSession.sendMessage(message);
        const text = result.response.text();

        console.log("✅ AI Response successful.");
        res.json({
            code: 200,
            message: "Success",
            reply: text
        });

    } catch (error) {
        console.error("❌ AI Chat Error details:", error.message);
        res.status(500).json({
            code: 500,
            message: "AI Service error: " + error.message,
            data: null
        });
    }
});

export default aiRoute;
