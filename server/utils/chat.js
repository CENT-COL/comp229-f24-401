const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

// Model and API configuration
const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyBCLVu5xEmV1Qs_OiHa_u1eDQWlrJav4gM"; // Use environment variable for API key

const GENERATION_CONFIG = {
    temperature: 0.5,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};

const SAFETY_SETTINGS = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

let isRateLimited = false;

// Rate-limited safeStartChat function
async function safeStartChat(config) {
    if (isRateLimited) {
        console.warn('Rate limit active. Please try again later.');
        throw new Error('Rate limit active.');
    }

    try {
        return await model.startChat(config);
    } catch (error) {
        if (error.status === 429) {
            console.error('Rate limit exceeded. Enabling cooldown...');
            isRateLimited = true;

            // Enable cooldown for 1 minute
            setTimeout(() => {
                isRateLimited = false;
                console.log('Cooldown expired. Resuming API usage.');
            }, 60000);
        }
        throw error;
    }
}

// Initialize chat instance
async function initializeChat() {
    try {
        const chat = await safeStartChat({
            generationConfig: GENERATION_CONFIG,
            safetySettings: SAFETY_SETTINGS,
            history: [],
        });
        console.log('Chat instance initialized.');
        return chat;
    } catch (error) {
        console.error('Error initializing chat:', error);
        throw error;
    }
}

module.exports = initializeChat;