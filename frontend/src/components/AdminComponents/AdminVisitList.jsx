import React, { useEffect, useState } from 'react'
import NavBar from '../landingComponents/NavBar'
import axios from 'axios'
import Swal from 'sweetalert2'

const AdminVisitList = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const response = await axios.get('http://localhost:9000/api/admin-visits')
    if (response?.data?.code == 200) {
      setList(response?.data?.data)
    }
    setLoading(false)
  }

  const handleStatus = async (id, status) => {
    const response = await axios.post('http://localhost:9000/api/update-visit-status', { _id: id, status })
    if (response?.data?.code == 200) {
      Swal.fire({
        title: 'Updated!',
        text: response?.data?.message,
        icon: 'success',
        timer: 1200,
        showConfirmButton: false
      })
      fetchData()
    }
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
          <h3 className="text-center mb-4">📅 Visit Requests</h3>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : list?.length === 0 ? (
            <div className="text-center py-5">
              <h4 style={{ color: '#999' }}>No visit requests yet.</h4>
            </div>
          ) : (
            <table className="table">
              <thead className="table table-dark">
                <tr>
                  <th>Sr.</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Property</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list?.map((item, index) => (
                  <tr key={item?._id || index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item?.userName}</td>
                    <td>{item?.userEmail}</td>
                    <td>{item?.userPhone}</td>
                    <td><b>{item?.propertyTitle}</b></td>
                    <td>{item?.visitDate}</td>
                    <td>{item?.visitTime}</td>
                    <td>{item?.message || '-'}</td>
                    <td>{statusBadge(item?.status)}</td>
                    <td>
                      {item?.status === 'Pending' ? (
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleStatus(item?._id, 'Approved')}
                          >✓</button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleStatus(item?._id, 'Rejected')}
                          >✗</button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#888' }}>Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="col-sm-1"></div>
      </div>
    </>
  )
}

export default AdminVisitList
