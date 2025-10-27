import dotenv from "dotenv"
import Groq from "groq-sdk";

dotenv.config({
    path: './.env'
})

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
    const chatCompletion = await groq.chat.completions.create({
        temperature: 1,
        // top_p: 0.2,
        // stop: "ga",
        // max_completion_tokens: 1000,
        // frequency_penalty: 1,
        // presence_penalty: 1,
        response_format: { type: "json_object" },
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `You are a interview grader assistant. Your task is to generate candidate evaluation score. 
                Output must be fdllowing JSON structure:
                {
                    "confidence": number (1-10 scale),
                    "accuracy": number (1-10 scale),
                    "pass" :boolean (true or false)
                }   
                The response must:
                    1. Include ALL fields shown above
                    2. Use only the exact field names shown
                    3. Follow the exact data types specified
                    4. Contain ONLY the JSON object and nothing else
                `
                // content: `You are Jarvis, a smart reviewer. your task is to analyse given review and the sentiment.
                // Classify the review as positive, neutral or negative. you must return the result in valid JSON structure
                // example: {"sentiment": "Negative"}`
            },
            {
                role: "user",
                content: `
                Q: what does == do in JavaScript?
                A: It checks strict equality-both value and type must match.

                Q: How do you create a promise that resolves after 1 second?
                A: const p = new Promise(r => setTimeout(r, 1000));

                Q: What is hoisting?
                A: JavaScript moves declarations (but not initializations) to the top of their scope before code runs.

                Q: Why use let instead of var?
                A: let is block-scoped, avoiding the function-scope quirks and re-declaration issues of var.
                `
                // content: `
                // Review: These headphones arrived quickly and look great, but the left earcup stopped working after a week
                // Sentiment: `
            }
        ],
    })

    console.log(JSON.parse(chatCompletion.choices[0]?.message.content));
}

main()

/*
Classify the review as positive, neutral or negative. Output must be a single word.
Classify the review as positive,
Review: These headphones
a week.

neutral or negative.
arrived quickly and
Output must be a single word.
look great, but the left earcup stopped working after
*/