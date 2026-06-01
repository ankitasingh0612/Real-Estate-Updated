import { API_BASE } from '../../config/api.js';
import React, { useEffect, useState } from 'react'
import NavBar from '../landingComponents/NavBar'
import axios from 'axios'
import Swal from 'sweetalert2'
import { FaTrash } from 'react-icons/fa'

const UserWishlist = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const userData = JSON.parse(localStorage.getItem('userInfo'));
    const response = await axios.post(API_BASE + '/api/user-wishlist', {
      userId: userData?._id
    })
    if (response?.data?.code == 200) {
      setList(response?.data?.data)
    }
    setLoading(false)
  }

  const handleRemove = async (propertyId) => {
    const userData = JSON.parse(localStorage.getItem('userInfo'));
    const response = await axios.post(API_BASE + '/api/wishlist-toggle', {
      userId: userData?._id,
      propertyId
    });
    if (response?.data?.code == 200) {
      Swal.fire({
        title: "Saved Properties",
        text: "Removed from Saved Properties.",
        icon: "success",
        timer: 1200,
        showConfirmButton: false
      })
      fetchData();
    }
  }

  return (
    <>
      <NavBar />
      <div className="row py-4">
        <div className="col-sm-1"></div>
        <div className="col-sm-10">
          <div className="text-center mb-4">
            <div className="tagline">❤️ Saved Properties</div>
            <h2 className="section-title">My Saved Properties</h2>
          </div>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : list?.length === 0 ? (
            <div className="text-center py-5">
              <h4 style={{ color: '#999' }}>No properties saved yet.</h4>
              <p style={{ color: '#aaa' }}>Browse properties and click the ❤️ icon on the image to save them here!</p>
            </div>
          ) : (
            <table className="table">
              <thead className="table table-dark">
                <tr>
                  <th scope="col">Sr.No.</th>
                  <th scope="col">Image</th>
                  <th scope="col">Title</th>
                  <th scope="col">Price</th>
                  <th scope="col">Area</th>
                  <th scope="col">Location</th>
                  <th scope="col">Description</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {list?.map((item, index) => {
                  return (
                    <React.Fragment key={item?._id || index}>
                      <tr>
                        <th scope="row">{index + 1}</th>
                        <td>
                          <img
                            height="60"
                            width="100"
                            src={`${API_BASE}/img/${item?.pic}`}
                            alt={item?.title}
                            style={{ borderRadius: '6px', objectFit: 'cover' }}
                          />
                        </td>
                        <td><b>{item?.title}</b></td>
                        <td>${item?.price}/Mo</td>
                        <td>{item?.area} sqft</td>
                        <td>{item?.location}</td>
                        <td>{item?.description?.slice(0, 40)}...</td>
                        <td>
                          <button
                            onClick={() => handleRemove(item?.propertyId)}
                            className="btn btn-outline-danger btn-sm"
                            title="Remove from Saved Properties"
                          >
                            <FaTrash /> Remove
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="col-sm-1"></div>
      </div>
    </>
  )
}

export default UserWishlist
