const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Routes
app.post('/generate-email', async (req, res) => {
    try {
        const { topic, style, cta, ctaLink, emailType } = req.body;
        
        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        // Build the prompt based on user inputs
        let prompt = `Write an email about "${topic}"`;
        
        if (style) {
            prompt += ` in a ${style} writing style`;
        }
        
        let lengthInstruction = '';
        switch (emailType) {
            case 'long':
                lengthInstruction = 'Make it long and entertaining with engaging storytelling.';
                break;
            case 'medium':
                lengthInstruction = 'Make it medium length with a focus on selling/promoting.';
                break;
            case 'short':
                lengthInstruction = 'Make it short, direct and to the point with a selling focus.';
                break;
            default:
                lengthInstruction = 'Make it medium length.';
        }
        
        prompt += `. ${lengthInstruction}`;
        
        if (cta) {
            prompt += ` Include a call to action for "${cta}"`;
            if (ctaLink) {
                prompt += ` with the link: ${ctaLink}`;
            }
        }
        
        prompt += ` Also create:
1. A compelling subject line derived from the topic (max 60 characters)
2. A preview text snippet that will encourage opens (max 120 characters)

Format your response as JSON with the following structure:
{
  "subject": "Your generated subject line",
  "preview": "Your generated preview text",
  "body": "Your generated email body with HTML formatting"
}`;

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1500,
            temperature: 0.7,
        });

        // Parse the response
        let responseText = completion.choices[0].message.content.trim();
        
        // Log the response for debugging
        console.log('OpenAI API Response:', responseText);
        
        // Handle case where response might not be properly formatted JSON
        let jsonResponse;
        try {
            // Try to parse the entire response as JSON
            jsonResponse = JSON.parse(responseText);
            console.log('Successfully parsed JSON:', jsonResponse);
        } catch (e) {
            console.error('JSON parse error:', e.message);
            // If that fails, try to extract JSON portion
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    jsonResponse = JSON.parse(jsonMatch[0]);
                } catch (e2) {
                    // If JSON extraction fails, create a structured response manually
                    const lines = responseText.split('\n');
                    let subject = '', preview = '', body = '';
                    
                    for (const line of lines) {
                        if (line.toLowerCase().includes('subject:')) {
                            subject = line.split('subject:')[1].trim();
                        } else if (line.toLowerCase().includes('preview:')) {
                            preview = line.split('preview:')[1].trim();
                        } else {
                            body += line + '\n';
                        }
                    }
                    
                    jsonResponse = { subject, preview, body };
                }
            } else {
                // Last resort: create basic structure
                jsonResponse = {
                    subject: "Email about " + topic,
                    preview: "Check out this information about " + topic,
                    body: responseText
                };
            }
        }

        res.json(jsonResponse);
    } catch (error) {
        console.error('Error generating email:', error);
        
        // Provide more specific error messages
        if (error.code === 'insufficient_quota') {
            res.status(429).json({ 
                error: 'OpenAI API quota exceeded. Please check your API key billing details.',
                details: 'The API key has reached its usage limit or has insufficient credits.'
            });
        } else {
            res.status(500).json({ 
                error: 'Failed to generate email',
                details: error.message || 'Unknown error occurred'
            });
        }
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});