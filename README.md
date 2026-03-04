# 🤖 Agentic AI Chatbot (MERN Stack)

An advanced, reasoning-based AI assistant built with the **MERN stack** and **LangChain.js**. Unlike standard LLM chatbots, this system acts as an **AI Agent** that can autonomously browse the web using the **Tavily Search API** to provide accurate, real-time information.



---

### ✨ Key Features
* **Agentic Reasoning**: Uses the **ReAct (Reason + Action)** pattern via **LangGraph** to solve complex queries.
* **Real-time Web Search**: Integrated with **Tavily Search API** to fetch live data (e.g., cricket scores, latest news).
* **System Prompt Control**: Dynamic UI to adjust the AI's personality and strict instruction sets.
* **Lightning Fast Inference**: Powered by **Groq Cloud** using high-performance models like **Llama 3.3**.
* **Responsive UI**: A modern, dark-themed chat interface built with **React** and **Lucide-React** icons.

---

### 🛠 Tech Stack
- **Frontend**: React.js (Vite), Axios, Lucide-React
- **Backend**: Node.js, Express.js
- **AI Orchestration**: LangChain.js & LangGraph
- **LLM Provider**: Groq Cloud
- **Search Tool**: Tavily Search API

---

### 🧠 System Architecture

1. **User Interaction**: User sends a message via the React frontend.
2. **API Communication**: Node.js receives the request and triggers the LangChain Agent.
3. **Reasoning Loop**: The Agent decides if it needs the internet to answer the query.
4. **Tool Execution**: If needed, it calls the Tavily Search tool and observes the results.
5. **Final Output**: The agent synthesizes a grounded response and sends it back to the UI.



---

### 🚀 Getting Started

#### 1. Prerequisites
- Node.js (v18 or higher)
- Groq API Key
- Tavily API Key

#### 2. Installation
```bash
# Clone the repository
git clone [https://github.com/your-username/Agentic-AI-Chatbot-MERN.git](https://github.com/your-username/Agentic-AI-Chatbot-MERN.git)
cd Agentic-AI-Chatbot-MERN

# Setup Backend
cd backend
npm install
