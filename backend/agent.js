import { ChatGroq } from "@langchain/groq";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Define Search Tool
const searchTool = tool(
    async ({ query }) => {
        try {
            const response = await axios.post("https://api.tavily.com/search", {
                api_key: process.env.TAVILY_API_KEY,
                query: query,
                max_results: 3,
            });
            
            const results = response.data.results.map(r => 
                `Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`
            ).join("\n\n");

            return results || "No information found on the internet.";
        } catch (error) {
            console.error("Tavily API Error:", error.message);
            return "Failed to search the internet.";
        }
    },
    {
        name: "tavily_search",
        description: "Search the internet for real-time news, cricket scores, and facts.",
        schema: z.object({
            query: z.string().describe("The search query to look up"),
        }),
    }
);

export const getResponseFromAgent = async (query, allowSearch, systemPrompt) => {
    try {
        const llm = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: "openai/gpt-oss-120b", 
            temperature: 0, // Set to 0 to prevent tool hallucinations
        });

        // Only add the tool if allowSearch is true
        const tools = allowSearch ? [searchTool] : [];

        // We add a very strict instruction to the system prompt
        const finalSystemPrompt = `
            ${systemPrompt}
            
            STRICT RULES:
            - You have access to ONLY ONE tool: 'tavily_search'.
            - Do NOT try to call any other tools like 'open', 'read', 'browse', or 'click'.
            - If you need information, use 'tavily_search' and only provide the text response.
        `;

        const agent = createReactAgent({
            llm: llm,
            tools: tools,
        });

        const response = await agent.invoke({
            messages: [
                new SystemMessage(finalSystemPrompt),
                new HumanMessage(query)
            ],
        });

        const lastMessage = response.messages[response.messages.length - 1];
        return lastMessage.content;
    } catch (error) {
        console.error("AGENT_EXECUTION_ERROR:", error);
        
        // If gpt-oss-120b keeps failing, suggest a fallback model
        if (error.message.includes("tool")) {
            return "AI Error: The model tried to use an unsupported tool. Try a more stable model like 'llama-3.3-70b-versatile'.";
        }
        return `Error: ${error.message}`;
    }
};