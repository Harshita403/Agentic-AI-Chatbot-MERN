import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getResponseFromAgent } from "./agent.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
    try {
        const { message, allowSearch, systemPrompt } = req.body;
        console.log(`Processing message: ${message}`);
        
        const aiResponse = await getResponseFromAgent(message, allowSearch, systemPrompt);
        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Server Route Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on: http://localhost:${PORT}`);
});