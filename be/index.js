// index.js (Final version with advanced formatting prompt)

// 1. Import necessary packages
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

// 2. Initialize Express app and middleware
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// 3. Define the API endpoint
app.post('/roast-resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No resume file uploaded.' });
        }

        let resumeText = '';
        
        // File type detection logic
        if (req.file.mimetype === 'application/pdf') {
            const pdfData = await pdfParse(req.file.buffer);
            resumeText = pdfData.text;
        } 
        else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const docxData = await mammoth.extractRawText({ buffer: req.file.buffer });
            resumeText = docxData.value;
        } 
        else {
            return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or DOCX file.' });
        }

        if (!resumeText) {
            return res.status(500).json({ error: 'Could not extract text from the document.' });
        }

        // --- NEW ADVANCED FORMATTING PROMPT ---
        const roastPrompt = `
           You are a witty, sarcastic career coach with an Indian flair, tasked with roasting a resume in a humorous yet constructive way. Your tone should be spicy, relatable, and infused with Indian cultural references (e.g., chai, Bollywood, Mumbai locals, JEE). Roast the resume by pointing out clichés (e.g., “team player,” “dynamic”), overused buzzwords, vague descriptions, and formatting errors. Avoid being genuinely mean—keep it fun and engaging. For each roast, subtly embed actionable feedback to help the user improve. Analyze the provided resume content for:
1. **Header/Objective**: Mock vague or generic statements and suggest specific, tailored alternatives.
2. **Education**: Call out irrelevant details (e.g., 10th/12th marks for non-freshers) and recommend focusing on relevant achievements.
3. **Skills**: Poke fun at laundry lists or unrelated skills, advising a curated, job-specific list.
4. **Experience**: Roast vague or unimpressive descriptions, suggesting action verbs and quantified results.
5. **Projects**: Mock stereotypical projects (e.g., library management system) and recommend showcasing impact or innovation.
6. **Achievements**: Laugh at filler achievements (e.g., “participated in fest”) and suggest impactful, relevant ones.
7. **Formatting**: Highlight font, length, or layout issues, recommending a clean, professional structure.
End with a humorous closing burn that ties it all together. Provide the roast in a conversational, desi tone, using phrases like “bro,” “acha,” or “bas karo.” If no resume content is provided, roast a typical Indian B.Tech resume with common clichés. Always include hidden constructive tips for improvement.

            **Resume Content to Roast:**
            ---
            ${resumeText}
            ---
        `;

        // --- Call the Gemini API ---
        const result = await model.generateContent(roastPrompt);
        const response = result.response;
        const roastResult = response.text();
        
        // --- Send the result back to the client ---
        res.status(200).json({ roast: roastResult.trim() });

    } catch (error) {
        console.error('Error processing resume:', error);
        res.status(500).json({ error: 'Failed to roast the resume. Please try again later.' });
    }
});

// 4. Start the server
app.listen(PORT, () => {
    console.log(`🔥 Resume Roaster server is now running on http://localhost:${PORT}`);
});