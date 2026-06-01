import { API_BASE } from '../../config/api.js';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBell } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'timeago.js';

const NotificationBell = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${API_BASE}/api/notifications/get-notifications/${userId}`);
            if (response.data.code === 200) {
                setNotifications(response.data.data);
                setUnreadCount(response.data.unreadCount);
            }
        } catch (err) {
            console.error("Error fetching notifications", err);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [userId]);

    const markAsRead = async (id = null) => {
        try {
            await axios.post(API_BASE + '/api/notifications/mark-as-read', {
                notificationId: id,
                userId: id ? null : userId
            });
            fetchNotifications();
        } catch (err) {
            console.error("Error marking as read", err);
        }
    };

    return (
        <div className="position-relative">
            <button
                className="btn btn-link p-0 text-dark position-relative"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen && unreadCount > 0) markAsRead();
                }}
                style={{ fontSize: '20px' }}
            >
                <FaBell className={unreadCount > 0 ? 'text-danger animate-bell' : ''} />
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="notification-overlay" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="notification-dropdown shadow-lg bg-white rounded-4 overflow-hidden border"
                            style={{
                                position: 'absolute',
                                top: '40px',
                                right: '-10px',
                                width: '320px',
                                zIndex: 1000
                            }}
                        >
                            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                                <h6 className="m-0 fw-bold">Notifications</h6>
                                <button className="btn btn-sm btn-link text-primary p-0" onClick={() => markAsRead()}>Mark all as read</button>
                            </div>

                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-muted">
                                        <p className="m-0">No new notifications</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif._id}
                                            className={`p-3 border-bottom notification-item ${!notif.isRead ? 'bg-aliceblue' : ''}`}
                                            onClick={() => markAsRead(notif._id)}
                                        >
                                            <div className="d-flex gap-2">
                                                <div className="flex-grow-1">
                                                    <p className="m-0 fw-bold small">{notif.title}</p>
                                                    <p className="m-0 text-muted extra-small">{notif.message}</p>
                                                    <span className="text-primary extra-small">{format(notif.createdAt)}</span>
                                                </div>
                                                {!notif.isRead && <div className="unread-dot" />}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
