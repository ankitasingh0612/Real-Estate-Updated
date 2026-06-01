import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaRobot, FaTimes, FaPaperPlane, FaMinus, FaQuestionCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Hi! I am your Quirex Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setLoading(true);

        try {
            console.log("📤 Sending message to AI:", userMessage);
            // Prepare history for the backend (excluding the very first greeting)
            const history = messages.slice(1).map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            const response = await axios.post('http://localhost:9000/api/ai/chat', {
                message: userMessage,
                history: history
            });

            if (response.data.code === 200) {
                console.log("📥 Received AI Response:", response.data.reply);
                setMessages(prev => [...prev, { role: 'model', text: response.data.reply }]);
            }
        } catch (error) {
            console.error("❌ Chat error:", error.response?.data || error.message);
            setMessages(prev => [...prev, { role: 'model', text: `Sorry, I'm having trouble connecting right now. (${error.message})` }]);
        } finally {
            setLoading(false);
        }
    };

    const suggestedQueries = [
        "How to register as admin?",
        "What can a seller do?",
        "How to schedule a visit?",
    ];

    return (
        <div className="chatbot-wrapper" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
            {/* Chat Bubble */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.5)',
                    border: '2px solid white'
                }}
            >
                {isOpen ? <FaTimes /> : <FaRobot />}
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        style={{
                            position: 'absolute',
                            bottom: '80px',
                            right: '0',
                            width: '350px',
                            height: '500px',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '24px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.3)'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '20px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div className="d-flex align-items-center">
                                <div className="bg-white rounded-circle p-2 me-3" style={{ color: '#6366f1' }}>
                                    <FaRobot />
                                </div>
                                <div>
                                    <h6 className="m-0 fw-bold">Quirex AI</h6>
                                    <small className="opacity-75">Online & Ready to Help</small>
                                </div>
                            </div>
                            <FaMinus style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
                        </div>

                        {/* Messages Area */}
                        <div style={{
                            flex: 1,
                            padding: '20px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}>
                            {messages.map((msg, idx) => (
                                <div key={idx} style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    padding: '12px 16px',
                                    borderRadius: msg.role === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                                    backgroundColor: msg.role === 'user' ? '#6366f1' : '#f1f5f9',
                                    color: msg.role === 'user' ? 'white' : '#1e293b',
                                    fontSize: '14px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                            {loading && (
                                <div style={{ alignSelf: 'flex-start', backgroundColor: '#f1f5f9', padding: '12px 16px', borderRadius: '18px 18px 18px 0' }}>
                                    <div className="spinner-grow spinner-grow-sm text-primary me-1"></div>
                                    <div className="spinner-grow spinner-grow-sm text-primary me-1" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="spinner-grow spinner-grow-sm text-primary" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Suggestions */}
                        {messages.length === 1 && (
                            <div style={{ padding: '0 20px 10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {suggestedQueries.map((q, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => { setInput(q); }}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            border: '1px solid #e2e8f0',
                                            backgroundColor: 'white',
                                            fontSize: '12px',
                                            color: '#6366f1',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <FaQuestionCircle className="me-1" /> {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input Area */}
                        <form onSubmit={handleSend} style={{
                            padding: '15px 20px',
                            borderTop: '1px solid #f1f5f9',
                            display: 'flex',
                            gap: '10px'
                        }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    backgroundColor: '#f1f5f9',
                                    padding: '10px 15px',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                    color: 'white',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <FaPaperPlane />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIChatbot;
