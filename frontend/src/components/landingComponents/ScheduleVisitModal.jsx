import { API_BASE } from '../../config/api.js';
import React, { useState } from 'react'
import { FaTimes, FaCalendarAlt, FaClock } from 'react-icons/fa'
import axios from 'axios'
import Swal from 'sweetalert2'

const ScheduleVisitModal = ({ show, onClose, propertyId, propertyTitle }) => {
  const [visitDate, setVisitDate] = useState('')
  const [visitTime, setVisitTime] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const userData = JSON.parse(localStorage.getItem('userInfo'))
    if (!userData?._id) {
      Swal.fire({ title: 'Login Required', text: 'Please login to schedule a visit.', icon: 'warning' })
      return
    }
    if (!visitDate || !visitTime) {
      Swal.fire({ title: 'Required', text: 'Please select date and time.', icon: 'warning' })
      return
    }
    setLoading(true)
    const response = await axios.post(API_BASE + '/api/schedule-visit', {
      userId: userData._id,
      propertyId,
      propertyTitle,
      userName: userData.name,
      userEmail: userData.email,
      userPhone: userData.contact,
      visitDate,
      visitTime,
      message
    })
    setLoading(false)
    if (response?.data?.code == 200) {
      Swal.fire({
        title: '✅ Visit Scheduled!',
        text: `Your visit to "${propertyTitle}" is booked for ${visitDate} at ${visitTime}`,
        icon: 'success'
      })
      setVisitDate('')
      setVisitTime('')
      setMessage('')
      onClose()
    } else {
      Swal.fire({ title: 'Error', text: response?.data?.message, icon: 'error' })
    }
  }

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0]

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: '16px', width: '90%', maxWidth: '500px',
        overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2d6a4f, #40916c)',
          padding: '20px 24px', color: '#fff',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h5 style={{ margin: 0, fontWeight: 700 }}>📅 Schedule a Visit</h5>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>{propertyTitle}</p>
          </div>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer', fontSize: '20px' }} />
        </div>

        {/* Form */}
        <div style={{ padding: '24px' }}>
          <div className="row g-3">
            <div className="col-6">
              <label className="form-label fw-bold" style={{ fontSize: '13px' }}>
                <FaCalendarAlt style={{ marginRight: '6px', color: '#2d6a4f' }} /> Visit Date
              </label>
              <input
                type="date"
                className="form-control"
                value={visitDate}
                min={today}
                onChange={e => setVisitDate(e.target.value)}
                style={{ borderRadius: '8px' }}
              />
            </div>
            <div className="col-6">
              <label className="form-label fw-bold" style={{ fontSize: '13px' }}>
                <FaClock style={{ marginRight: '6px', color: '#2d6a4f' }} /> Visit Time
              </label>
              <select
                className="form-select"
                value={visitTime}
                onChange={e => setVisitTime(e.target.value)}
                style={{ borderRadius: '8px' }}
              >
                <option value="">Select time</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label fw-bold" style={{ fontSize: '13px' }}>
                💬 Message (optional)
              </label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Any specific requirements or questions..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                style={{ borderRadius: '8px', resize: 'none' }}
              />
            </div>
          </div>

          <div style={{
            background: '#f0fdf4', borderRadius: '8px', padding: '12px',
            marginTop: '16px', fontSize: '13px', color: '#2d6a4f'
          }}>
            <b>ℹ️ Note:</b> Our team will confirm your visit via email/phone within 24 hours.
          </div>

          <div className="d-flex gap-2 mt-3">
            <button
              className="btn flex-grow-1"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: '#2d6a4f', color: '#fff', borderRadius: '8px',
                padding: '10px', fontWeight: 600, border: 'none'
              }}
            >
              {loading ? 'Scheduling...' : '📅 Confirm Visit'}
            </button>
            <button className="btn btn-outline-secondary" onClick={onClose}
              style={{ borderRadius: '8px' }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScheduleVisitModal
