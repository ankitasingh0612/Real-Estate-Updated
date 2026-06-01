import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import NavBar from '../landingComponents/NavBar';
import Swal from 'sweetalert2';

const SellerChatInbox = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConvo, setSelectedConvo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        if (user) {
            setUserInfo(user);
            fetchConversations(user._id);
        }
    }, []);

    useEffect(() => {
        let interval;
        if (selectedConvo && userInfo) {
            fetchMessages();
            // Poll for new messages 
            interval = setInterval(fetchMessages, 3000);
        }
        return () => clearInterval(interval);
    }, [selectedConvo, userInfo]);

    const fetchConversations = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:9000/api/chat/my-conversations/${userId}`);
            if (response.data.code === 200) {
                setConversations(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching conversations", error);
        }
    };

    const fetchMessages = async () => {
        if (!userInfo || !selectedConvo) return;
        try {
            const response = await axios.post('http://localhost:9000/api/chat/chat-history', {
                userId: userInfo._id,
                otherId: selectedConvo.partnerId,
                propertyId: selectedConvo.propertyId
            });
            if (response.data.code === 200) {
                setMessages(response.data.data);
                scrollToBottom();

                // Mark read if there are unread
                if (selectedConvo.unreadCount > 0) {
                    await axios.post('http://localhost:9000/api/chat/mark-read', {
                        senderId: selectedConvo.partnerId,
                        receiverId: userInfo._id,
                        propertyId: selectedConvo.propertyId
                    });
                    fetchConversations(userInfo._id); // Update badge
                }
            }
        } catch (error) {
            console.error("Error fetching messages.");
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !userInfo || !selectedConvo) return;

        try {
            const response = await axios.post('http://localhost:9000/api/chat/send-message', {
                senderId: userInfo.userType === 'admin' ? 'admin' : userInfo._id,
                receiverId: selectedConvo.partnerId,
                propertyId: selectedConvo.propertyId,
                message: newMessage
            });
            if (response.data.code === 200) {
                setNewMessage('');
                fetchMessages();
                fetchConversations(userInfo._id); // Updates last message in sidebar
            }
        } catch (error) {
            console.error("Error sending message.");
            Swal.fire('Error', 'Could not send message', 'error');
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <NavBar />
            <div className="container-fluid mt-4">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card shadow-sm border-0">
                            <div className="row g-0" style={{ height: '70vh' }}>
                                
                                {/* Sidebar: Conversations List */}
                                <div className="col-md-4 border-end bg-light">
                                    <div className="p-3 border-bottom bg-white">
                                        <h5 className="m-0 fw-bold">Inbox</h5>
                                    </div>
                                    <div className="list-group list-group-flush" style={{ overflowY: 'auto', height: 'calc(70vh - 55px)' }}>
                                        {conversations.length === 0 ? (
                                            <div className="p-4 text-center text-muted">No conversations yet.</div>
                                        ) : (
                                            conversations.map((convo, idx) => {
                                                const isSelected = selectedConvo?.partnerId === convo.partnerId && selectedConvo?.propertyId === convo.propertyId;
                                                return (
                                                    <button 
                                                        key={idx} 
                                                        onClick={() => setSelectedConvo(convo)}
                                                        className={`list-group-item list-group-item-action p-3 ${isSelected ? 'active bg-danger text-white border-danger' : ''}`}
                                                    >
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <strong className="text-truncate" style={{maxWidth: '70%'}}>{convo.partnerName}</strong>
                                                            <small className={isSelected ? 'text-white-50' : 'text-muted'} style={{fontSize: '0.75rem'}}>
                                                                {new Date(convo.timestamp).toLocaleDateString()}
                                                            </small>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <small className={`text-truncate ${isSelected ? '' : 'text-muted'}`} style={{maxWidth: '80%'}}>
                                                                <span className="badge bg-secondary me-1" style={{fontSize: '0.6rem'}}>{convo.partnerRole}</span>
                                                                {convo.lastMessage}
                                                            </small>
                                                            {convo.unreadCount > 0 && (
                                                                <span className="badge bg-warning rounded-pill">{convo.unreadCount}</span>
                                                            )}
                                                        </div>
                                                    </button>
                                                )
                                            })
                                        )}
                                    </div>
                                </div>

                                {/* Main Chat Area */}
                                <div className="col-md-8 d-flex flex-column bg-white">
                                    {selectedConvo ? (
                                        <>
                                            <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                                                <h6 className="m-0 fw-bold">Chat with {selectedConvo.partnerName} ({selectedConvo.partnerRole})</h6>
                                                <small className="text-muted">Property ID: {selectedConvo.propertyId.substring(0,8)}...</small>
                                            </div>
                                            <div className="flex-grow-1 p-4" style={{ overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                                                {messages.length === 0 ? (
                                                    <div className="text-center text-muted mt-5">Loading messages...</div>
                                                ) : (
                                                    <div className="d-flex flex-column gap-3">
                                                        {messages.map((msg, idx) => {
                                                            const isMe = msg.senderId === userInfo._id || (userInfo.userType === 'admin' && msg.senderId === 'admin');
                                                            return (
                                                                <div key={idx} className={`d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'}`}>
                                                                    <div className={`p-3 rounded-4 shadow-sm ${isMe ? 'bg-danger text-white' : 'bg-white border'}`} style={{ maxWidth: '75%' }}>
                                                                        {msg.message}
                                                                    </div>
                                                                    <small className="text-muted mt-1 px-1" style={{ fontSize: '11px' }}>
                                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </small>
                                                                </div>
                                                            )
                                                        })}
                                                        <div ref={messagesEndRef} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3 border-top bg-light">
                                                <form onSubmit={handleSendMessage} className="d-flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        placeholder="Type a message..." 
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                    />
                                                    <button type="submit" className="btn btn-danger px-4">Send</button>
                                                </form>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                                            <div style={{fontSize: '50px', marginBottom: '10px'}}>💬</div>
                                            <h5>Select a conversation</h5>
                                            <p>Choose a chat from the sidebar to start messaging.</p>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SellerChatInbox;
