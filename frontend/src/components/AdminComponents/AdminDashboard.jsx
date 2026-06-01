import { API_BASE } from '../../config/api.js';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../landingComponents/NavBar';
import { FaHome, FaUsers, FaCalendarCheck, FaShoppingCart, FaArrowRight, FaPlusCircle, FaRegBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ChatWidget from '../landingComponents/ChatWidget';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProperties: 0,
        totalUsers: 0,
        totalVisits: 0,
        totalBought: 0,
        unreadConversations: 0
    });
    const [user, setUser] = useState(null);
    const [recentVisits, setRecentVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSupport, setShowSupport] = useState(false);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
            fetchStats(userInfo._id, userInfo.userType);
        }
    }, []);

    const fetchStats = async (userId, type) => {
        try {
            setLoading(true);
            const url = type === 'admin' 
                ? API_BASE + '/api/dashboard-stats/admin' 
                : `${API_BASE}/api/dashboard-stats/${userId}`;
            
            const response = await axios.get(url);
            if (response.data.code === 200) {
                setStats(response.data.data);
            }

            const visitUrl = `${API_BASE}/api/admin-visits?userId=${userId}&userType=${type}`;
            const visitRes = await axios.get(visitUrl);
            if (visitRes.data.code === 200) {
                setRecentVisits(visitRes.data.data.slice(0, 5));
            }
        } catch (error) {
            console.error("Error fetching stats", error);
        } finally {
            setLoading(false);
        }
    };

    const cardStyle = {
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(12px)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'default'
    };

    const welcomeHeaderStyle = {
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        borderRadius: '30px',
        padding: '40px',
        color: 'white',
        marginBottom: '40px',
        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)'
    };

    const handleSendAnnouncement = async () => {
        try {
            const response = await axios.post(API_BASE + '/api/notifications/send-announcement');
            if (response.data.code === 200) {
                Swal.fire('Success', response.data.message, 'success');
            } else {
                Swal.fire('Info', response.data.message, 'info');
            }
        } catch (error) {
            console.error("Error sending announcement:", error);
            Swal.fire('Error', 'Could not send announcement', 'error');
        }
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <NavBar />
            <div className="container py-5">
                {/* Welcome Section */}
                <div style={welcomeHeaderStyle} data-aos="fade-down">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h1 className="display-5 fw-bold mb-2">Welcome Back, {user?.name || 'Admin'}! 👋</h1>
                            <p className="lead opacity-75 mb-4">Here's what's happening with your real estate portfolio today.</p>
                            <div className="d-flex gap-3">
                                {user?.userType === 'seller' ? (
                                    <Link to="/seller-add" className="btn btn-light btn-lg px-4 fw-bold text-primary rounded-pill shadow-sm">
                                        <FaPlusCircle className="me-2" /> List New Property
                                    </Link>
                                ) : (
                                    <Link to="/admin-list" className="btn btn-light btn-lg px-4 fw-bold text-primary rounded-pill shadow-sm">
                                        Manage Listings
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="col-md-4 d-none d-md-block text-center">
                            <div className="position-relative">
                                <img 
                                    src={user?.profile ? `${API_BASE}/img/${user.profile}` : "https://via.placeholder.com/150"} 
                                    alt="Profile" 
                                    className="rounded-circle shadow-lg border border-4 border-white"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                                <span className="position-absolute bottom-0 start-50 translate-middle-x badge rounded-pill bg-success px-3 py-2 shadow" style={{ marginBottom: '-10px' }}>
                                    Online
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="row g-4 mb-5">
                    {[
                        { label: user?.userType === 'seller' ? 'My Properties' : 'Total Properties', value: stats.totalProperties, icon: <FaHome />, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
                        { label: user?.userType === 'seller' ? 'Active Enquiries' : 'Total Visits', value: stats.totalVisits, icon: <FaCalendarCheck />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
                        { label: 'Platform Users', value: stats.totalUsers, icon: <FaUsers />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
                        { label: 'Units Sold', value: stats.totalBought, icon: <FaShoppingCart />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
                    ].map((item, index) => (
                        <div className="col-12 col-md-6 col-lg-3" key={index} data-aos="zoom-in" data-aos-delay={index * 100}>
                            <div className="card h-100 shadow-sm border-0 p-3" style={cardStyle}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="rounded-circle p-3 me-3" style={{ backgroundColor: item.bg, color: item.color, fontSize: '24px' }}>
                                            {item.icon}
                                        </div>
                                        <h6 className="text-muted fw-bold m-0" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>{item.label}</h6>
                                    </div>
                                    <div className="d-flex align-items-baseline">
                                        <h2 className="display-6 fw-bold mb-0">{item.value}</h2>
                                        <span className="ms-2 text-success fw-bold" style={{ fontSize: '14px' }}>+12%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row g-4">
                    {/* Recent Activity */}
                    <div className="col-lg-8" data-aos="fade-up">
                        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                            <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                                <h4 className="fw-bold m-0 text-dark">Recent Visit Requests</h4>
                                <Link to={user?.userType === 'seller' ? "/seller-visits" : "/admin-visits"} className="text-primary fw-bold text-decoration-none small">
                                    View All <FaArrowRight className="ms-1" />
                                </Link>
                            </div>
                            <div className="card-body p-0">
                                {loading ? (
                                    <div className="text-center p-5">
                                        <div className="spinner-border text-primary" role="status"></div>
                                    </div>
                                ) : recentVisits.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="bg-light text-muted small text-uppercase fw-bold">
                                                <tr>
                                                    <th className="ps-4 py-3 border-0">Property</th>
                                                    <th className="py-3 border-0">Client</th>
                                                    <th className="py-3 border-0">Schedule</th>
                                                    <th className="py-3 border-0">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentVisits.map((visit, idx) => (
                                                    <tr key={visit._id || idx}>
                                                        <td className="ps-4 py-3">
                                                            <div className="fw-bold text-dark">{visit.propertyTitle}</div>
                                                            <small className="text-muted">ID: {visit.propertyId?.substring(0,8)}...</small>
                                                        </td>
                                                        <td className="py-3">
                                                            <div className="fw-bold">{visit.userName}</div>
                                                            <small className="text-muted">{visit.userEmail}</small>
                                                        </td>
                                                        <td className="py-3">
                                                            <div className="small fw-bold">{visit.visitDate}</div>
                                                            <small className="text-muted">{visit.visitTime}</small>
                                                        </td>
                                                        <td className="py-3">
                                                            <span className={`badge rounded-pill px-3 py-2 ${
                                                                visit.status === 'Accepted' ? 'bg-success-subtle text-success' : 
                                                                visit.status === 'Rejected' ? 'bg-danger-subtle text-danger' : 
                                                                'bg-warning-subtle text-warning'
                                                            }`}>
                                                                {visit.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center p-5 text-muted">
                                        <FaCalendarCheck className="display-4 mb-3 opacity-25" />
                                        <h5>No pending visit requests.</h5>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions / Notifications */}
                    <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
                        <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '24px' }}>
                            <div className="card-header bg-white border-0 p-4">
                                <h4 className="fw-bold m-0">Quick Actions</h4>
                            </div>
                            <div className="card-body p-4 pt-0">
                                <div className="d-grid gap-3">
                                    <button 
                                        onClick={handleSendAnnouncement}
                                        className="btn btn-light p-3 text-start border-0 rounded-4 shadow-sm hover-elevate"
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="bg-primary-subtle text-primary p-2 rounded-3 me-3">
                                                <FaRegBell />
                                            </div>
                                            <div>
                                                <div className="fw-bold">Send Announcement</div>
                                                <small className="text-muted">Notify all users about updates</small>
                                            </div>
                                        </div>
                                    </button>
                                    <Link 
                                        to={user?.userType === 'admin' ? "/admin-chat" : "/seller-chat"}
                                        className="btn btn-light p-3 text-start border-0 rounded-4 shadow-sm hover-elevate w-100" 
                                        style={{ backgroundColor: '#ff6b3d', color: 'white', textDecoration: 'none' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="bg-white text-orange p-2 rounded-3 me-3">
                                                <FaUsers />
                                            </div>
                                            <div>
                                                <div className="fw-bold">Client Messages</div>
                                                <small className="opacity-75">{stats.unreadConversations || 0} unread conversations</small>
                                            </div>
                                        </div>
                                    </Link>
                                    
                                    {user?.userType === 'seller' && (
                                        <button 
                                            onClick={() => setShowSupport(true)}
                                            className="btn btn-light p-3 text-start border-0 rounded-4 shadow-sm hover-elevate w-100" 
                                            style={{ backgroundColor: '#4f46e5', color: 'white' }}
                                        >
                                            <div className="d-flex align-items-center">
                                                <div className="bg-white text-primary p-2 rounded-3 me-3">
                                                    <FaRegBell />
                                                </div>
                                                <div>
                                                    <div className="fw-bold">Support Chat</div>
                                                    <small className="opacity-75">Chat with Platform Admin</small>
                                                </div>
                                            </div>
                                        </button>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {showSupport && (
                <ChatWidget 
                    show={showSupport} 
                    onClose={() => setShowSupport(false)} 
                    propertyId="support"
                    sellerId="admin"
                    sellerName="Platform Admin"
                />
            )}
            
            <style>{`
                .hover-elevate:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
                }
                .bg-success-subtle { background-color: #dcfce7 !important; }
                .bg-danger-subtle { background-color: #fee2e2 !important; }
                .bg-warning-subtle { background-color: #fef9c3 !important; }
                .bg-primary-subtle { background-color: #e0e7ff !important; }
                .bg-info-subtle { background-color: #e0f2fe !important; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
