import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCog, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const PreferenceModal = ({ userId, isOpen, onClose }) => {
    const [prefs, setPrefs] = useState({
        location: '',
        minBudget: 0,
        maxBudget: 10000000,
        propertyType: 'All',
        emailNotifications: true
    });

    useEffect(() => {
        if (isOpen && userId) {
            axios.get(`http://localhost:9000/api/notifications/get-preferences/${userId}`)
                .then(res => {
                    if (res.data.data) setPrefs(res.data.data);
                })
                .catch(err => console.error("Error fetching prefs", err));
        }
    }, [isOpen, userId]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9000/api/notifications/save-preferences', {
                userId, ...prefs
            });
            if (response.data.code === 200) {
                Swal.fire({ icon: 'success', title: 'Preferences Saved!', showConfirmButton: false, timer: 1500 });
                onClose();
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Failed to save preferences' });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-backdrop-custom d-flex align-items-center justify-content-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white p-4 rounded-4 shadow-lg position-relative"
                        style={{ width: '450px', maxWidth: '95%' }}
                    >
                        <button className="btn btn-link position-absolute top-0 end-0 p-3 text-muted" onClick={onClose}>
                            <FaTimes />
                        </button>

                        <h4 className="fw-bold mb-4">Notification Settings</h4>
                        <p className="text-muted small mb-4">Get alerted when new properties match your criteria.</p>

                        <form onSubmit={handleSave}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Preferred Location</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Lucknow, Delhi"
                                    value={prefs.location}
                                    onChange={(e) => setPrefs({ ...prefs, location: e.target.value })}
                                />
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col">
                                    <label className="form-label small fw-bold">Min Budget (₹)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={prefs.minBudget}
                                        onChange={(e) => setPrefs({ ...prefs, minBudget: e.target.value })}
                                    />
                                </div>
                                <div className="col">
                                    <label className="form-label small fw-bold">Max Budget (₹)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={prefs.maxBudget}
                                        onChange={(e) => setPrefs({ ...prefs, maxBudget: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Property Interest</label>
                                <select
                                    className="form-select"
                                    value={prefs.propertyType}
                                    onChange={(e) => setPrefs({ ...prefs, propertyType: e.target.value })}
                                >
                                    <option value="All">All Types</option>
                                    <option value="Sale">For Sale</option>
                                    <option value="Rent">For Rent</option>
                                </select>
                            </div>

                            <div className="form-check form-switch mb-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="emailNotif"
                                    checked={prefs.emailNotifications}
                                    onChange={(e) => setPrefs({ ...prefs, emailNotifications: e.target.checked })}
                                />
                                <label className="form-check-label small" htmlFor="emailNotif">
                                    Send me email alerts
                                </label>
                            </div>

                            <button type="submit" className="btn btn-primary w-100 py-2 rounded-3">Save Preferences</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PreferenceModal;
