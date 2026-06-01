import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ChatWidget = ({ show, onClose, propertyId, sellerId, sellerName }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        setUserInfo(user);
    }, []);

    useEffect(() => {
        let interval;
        if (show && userInfo && sellerId) {
            fetchMessages();
            // Poll for new messages
            interval = setInterval(fetchMessages, 3000);
        }
        return () => clearInterval(interval);
    }, [show, userInfo, sellerId, propertyId]);

    const fetchMessages = async () => {
        if (!userInfo || !sellerId) return;
        try {
            const response = await axios.post('http://localhost:9000/api/chat/chat-history', {
                userId: userInfo._id,
                otherId: sellerId,
                propertyId: propertyId
            });
            if (response.data.code === 200) {
                setMessages(response.data.data);
                scrollToBottom();
            }
        } catch (error) {
            console.error("Error fetching messages.");
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !userInfo) {
            if(!userInfo) {
                Swal.fire('Error', 'Please login to chat', 'error');
            }
            return;
        }

        try {
            const response = await axios.post('http://localhost:9000/api/chat/send-message', {
                senderId: userInfo._id,
                receiverId: sellerId,
                propertyId: propertyId,
                message: newMessage
            });
            if (response.data.code === 200) {
                setNewMessage('');
                fetchMessages();
            } else if (response.data.code === 403) {
                Swal.fire('Restricted', response.data.message, 'warning');
            } else {
                Swal.fire('Error', response.data.message || 'Could not send message', 'error');
            }
        } catch (error) {
            console.error("Error sending message.");
            Swal.fire('Error', 'Could not send message', 'error');
        }
    };

    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header bg-danger text-white">
                        <h5 className="modal-title m-0">💬 Chat with {sellerName || 'Seller'}</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    
                    <div className="modal-body bg-light" style={{ height: '400px', overflowY: 'auto' }}>
                        {!userInfo ? (
                            <div className="text-center mt-5 text-muted">
                                Please login as a user to chat.
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center mt-5 text-muted">
                                No messages yet. Say hi!
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-2 p-2">
                                {messages.map((msg, idx) => {
                                    const isMe = msg.senderId === userInfo._id;
                                    return (
                                        <div key={idx} className={`d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'}`}>
                                            <div className={`p-2 rounded-3 ${isMe ? 'bg-danger text-white' : 'bg-white border'}`} style={{ maxWidth: '80%' }}>
                                                {msg.message}
                                            </div>
                                            <small className="text-muted" style={{ fontSize: '10px' }}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </small>
                                        </div>
                                    )
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {userInfo && (
                        <div className="modal-footer bg-white">
                            <form onSubmit={handleSendMessage} className="w-100 d-flex gap-2 m-0 p-0">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="btn btn-danger">Send</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatWidget;
