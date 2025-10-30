import dotenv from "dotenv"
import Groq from "groq-sdk";
import { tavily } from "@tavily/core"
import readline from "node:readline/promises"


dotenv.config({
    path: './.env'
})

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


async function webSearch({ query }) {
    console.log("calling web search");

    const response = await tvly.search(query);

    const finalResult = response.results.map(result => result.content).join('\n\n')

    return finalResult
}

async function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

    const message = [
        {
            role: "system",
            content: `You are a smart personal assistant who answers the asked questions.
            You have access to following tools:
            1. webSearch({query}: {query:string}) // Search the latest information and realtime data on the internet.
            current date and time: ${new Date().toUTCString()}
            `
        },
    ]

    while (true) {
        const question = await rl.question("you: ")

        if (question === 'bye') {
            break;
        }


        message.push(
            {
                role: "user",
                content: question
            }
        )


        while (true) {
            const chatCompletion = await groq.chat.completions.create({
                temperature: 0,
                model: "llama-3.3-70b-versatile",
                messages: message,
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "webSearch",
                            description: "Search the latest information and realtime data on the internet.",
                            parameters: {
                                type: "object",
                                properties: {
                                    query: {
                                        type: "string",
                                        description: "The search query"
                                    },
                                },
                                required: ["query"],
                            },
                        },
                    },
                ],
                tool_choice: "auto"
            })

            message.push(chatCompletion.choices[0]?.message)
            const toolCalls = chatCompletion.choices[0]?.message.tool_calls

            if (!toolCalls) {
                console.log(`assistant: ${chatCompletion.choices[0]?.message.content}`);
                break;
            }

            for (const tool of toolCalls) {
                const functionName = tool.function.name
                const functionParams = tool.function.arguments

                if (functionName === "webSearch") {
                    const toolresult = await webSearch(JSON.parse(functionParams))

                    message.push({
                        role: "tool",
                        tool_call_id: tool.id,
                        name: functionName,
                        content: toolresult
                    })
                }
            }
        }
    }

    rl.close()
}

main()
