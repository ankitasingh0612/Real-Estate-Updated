import React, { useEffect, useState } from 'react'
import NavBar from '../landingComponents/NavBar'
import axios from 'axios'
import ChatWidget from '../landingComponents/ChatWidget'

const UserVisits = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSupport, setShowSupport] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const userData = JSON.parse(localStorage.getItem('userInfo'))
    const response = await axios.post('http://localhost:9000/api/user-visits', { userId: userData?._id })
    if (response?.data?.code == 200) {
      setList(response?.data?.data)
    }
    setLoading(false)
  }

  const statusBadge = (status) => {
    const colors = {
      'Pending': { bg: '#FFF3CD', text: '#856404' },
      'Approved': { bg: '#D4EDDA', text: '#155724' },
      'Rejected': { bg: '#F8D7DA', text: '#721C24' }
    }
    const c = colors[status] || colors['Pending']
    return (
      <span style={{
        background: c.bg, color: c.text,
        padding: '4px 12px', borderRadius: '20px',
        fontSize: '12px', fontWeight: 600
      }}>{status}</span>
    )
  }

  return (
    <>
      <NavBar />
      <div className="row py-4">
        <div className="col-sm-1"></div>
        <div className="col-sm-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <div className="tagline">📅 My Visits</div>
              <h2 className="section-title">Scheduled Property Visits</h2>
            </div>
            <button 
              onClick={() => setShowSupport(true)}
              className="btn btn-primary rounded-pill px-4 shadow-sm"
            >
              💬 Chat with Admin
            </button>
          </div>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : list?.length === 0 ? (
            <div className="text-center py-5">
              <h4 style={{ color: '#999' }}>No visits scheduled yet.</h4>
              <p style={{ color: '#aaa' }}>Browse properties and click "📅 Visit" to book a tour!</p>
            </div>
          ) : (
            <table className="table">
              <thead className="table table-dark">
                <tr>
                  <th>Sr.No.</th>
                  <th>Property</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Message</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {list?.map((item, index) => (
                  <tr key={item?._id || index}>
                    <th scope="row">{index + 1}</th>
                    <td><b>{item?.propertyTitle}</b></td>
                    <td>{item?.visitDate}</td>
                    <td>{item?.visitTime}</td>
                    <td>{item?.message || '-'}</td>
                    <td>{statusBadge(item?.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="col-sm-1"></div>
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
    </>
  )
}

export default UserVisits
