import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Settings, Globe, Menu, X, Sparkles } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [allowSearch, setAllowSearch] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful AI Assistant.");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: input,
        allowSearch: allowSearch,
        systemPrompt: systemPrompt
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Error: Server is not responding." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      width: '100vw',    // Force full width
      height: '100vh',   // Force full height
      backgroundColor: '#0b0d11', 
      color: '#e0e0e0', 
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      
      {/* Sidebar - Settings */}
      <div style={{ 
        width: isSidebarOpen ? '300px' : '0px', 
        backgroundColor: '#16191f', 
        transition: '0.3s ease', 
        borderRight: '1px solid #2d333b',
        display: 'flex',
        flexDirection: 'column',
        visibility: isSidebarOpen ? 'visible' : 'hidden'
      }}>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0 }}> <Settings size={18}/> Agent Config</h2>
            <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsSidebarOpen(false)} />
          </div>

          <label style={{ fontSize: '0.8rem', color: '#8b949e' }}>SYSTEM PROMPT</label>
          <textarea 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0d1117', border: '1px solid #30363d', color: 'white', marginTop: '10px', height: '100px', resize: 'none' }}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
          />

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', backgroundColor: '#0d1117', borderRadius: '8px', border: '1px solid #30363d' }}>
            <span style={{ fontSize: '0.9rem' }}><Globe size={16} style={{marginRight: '8px'}}/> Search Tool</span>
            <input 
              type="checkbox" 
              checked={allowSearch} 
              onChange={() => setAllowSearch(!allowSearch)} 
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Header */}
        <div style={{ padding: '15px 20px', borderBottom: '1px solid #2d333b', display: 'flex', alignItems: 'center', gap: '15px' }}>
          {!isSidebarOpen && <Menu size={24} style={{ cursor: 'pointer' }} onClick={() => setIsSidebarOpen(true)} />}
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>MERN AI Agent</div>
        </div>

        {/* Chat History */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 10%', scrollBehavior: 'smooth' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '15vh', opacity: 0.4 }}>
              <Sparkles size={50} />
              <p>Type something to start the agentic flow...</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              gap: '15px', 
              marginBottom: '25px', 
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' 
            }}>
              <div style={{ 
                width: '35px', height: '35px', borderRadius: '8px', 
                backgroundColor: msg.role === 'user' ? '#007bff' : '#2d333b',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div style={{ 
                maxWidth: '75%', 
                padding: '12px 18px', 
                borderRadius: '12px', 
                backgroundColor: msg.role === 'user' ? '#1f2937' : 'transparent',
                border: msg.role === 'user' ? 'none' : '1px solid transparent',
                lineHeight: '1.6'
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div style={{ color: '#8b949e', marginLeft: '50px' }}>Agent is thinking...</div>}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '20px 10% 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#16191f', padding: '10px 20px', borderRadius: '15px', border: '1px solid #30363d' }}>
            <input 
              style={{ flex: 1, background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '1rem' }}
              placeholder="Message your AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage} disabled={loading}
              style={{ backgroundColor: input.trim() ? '#007bff' : '#2d333b', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 15px', cursor: 'pointer' }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;