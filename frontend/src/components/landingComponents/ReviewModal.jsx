import { API_BASE } from '../../config/api.js';
import React, { useEffect, useState } from 'react'
import { FaStar, FaRegStar, FaTimes, FaUser } from 'react-icons/fa'
import axios from 'axios'
import Swal from 'sweetalert2'

const ReviewModal = ({ show, onClose, propertyId, propertyTitle }) => {
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [myRating, setMyRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (show && propertyId) {
      fetchReviews()
    }
  }, [show, propertyId])

  const fetchReviews = async () => {
    const response = await axios.post(API_BASE + '/api/get-reviews', { propertyId })
    if (response?.data?.code == 200) {
      setReviews(response?.data?.data?.reviews || [])
      setAvgRating(response?.data?.data?.avgRating || 0)
      setTotalReviews(response?.data?.data?.totalReviews || 0)
    }
  }

  const handleSubmit = async () => {
    const userData = JSON.parse(localStorage.getItem('userInfo'))
    if (!userData?._id) {
      Swal.fire({ title: 'Login Required', text: 'Please login to submit a review.', icon: 'warning' })
      return
    }
    if (myRating === 0) {
      Swal.fire({ title: 'Rating Required', text: 'Please select a star rating.', icon: 'warning' })
      return
    }
    setLoading(true)
    const response = await axios.post(API_BASE + '/api/add-review', {
      userId: userData._id,
      propertyId,
      userName: userData.name,
      rating: myRating,
      comment
    })
    setLoading(false)
    if (response?.data?.code == 200) {
      Swal.fire({
        title: 'Thank you!',
        text: response?.data?.message,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
      setMyRating(0)
      setComment('')
      fetchReviews()
    }
  }

  const renderStars = (rating, size = '16px') => {
    return [1, 2, 3, 4, 5].map(star => (
      star <= rating
        ? <FaStar key={star} style={{ color: '#FFB800', fontSize: size }} />
        : <FaRegStar key={star} style={{ color: '#ddd', fontSize: size }} />
    ))
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.5)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: '16px', width: '90%', maxWidth: '600px',
        maxHeight: '85vh', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #FF5A3C, #ff8a6c)',
          padding: '20px 24px', color: '#fff',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h5 style={{ margin: 0, fontWeight: 700 }}>Reviews & Ratings</h5>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>{propertyTitle}</p>
          </div>
          <FaTimes onClick={onClose} style={{ cursor: 'pointer', fontSize: '20px' }} />
        </div>

        {/* Average Rating */}
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid #eee',
          display: 'flex', alignItems: 'center', gap: '16px'
        }}>
          <div style={{
            background: '#FFF8E1', borderRadius: '12px', padding: '12px 20px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#FF5A3C' }}>{avgRating}</div>
            <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
              {renderStars(Math.round(avgRating), '14px')}
            </div>
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '15px' }}>{totalReviews} Review{totalReviews !== 1 ? 's' : ''}</p>
            <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>Based on user ratings</p>
          </div>
        </div>

        <div style={{ maxHeight: '40vh', overflowY: 'auto', padding: '0 24px' }}>
          {/* Write Review */}
          <div style={{
            padding: '16px 0', borderBottom: '1px solid #eee'
          }}>
            <p style={{ fontWeight: 600, margin: '0 0 8px 0', fontSize: '14px' }}>Write a Review</p>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setMyRating(star)}
                  style={{ cursor: 'pointer', transition: 'transform 0.15s' }}
                >
                  {star <= (hoverRating || myRating)
                    ? <FaStar style={{ color: '#FFB800', fontSize: '24px' }} />
                    : <FaRegStar style={{ color: '#ddd', fontSize: '24px' }} />
                  }
                </span>
              ))}
              {myRating > 0 && <span style={{ marginLeft: '8px', color: '#888', fontSize: '13px' }}>{myRating}/5</span>}
            </div>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Write your review (optional)..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={{ borderRadius: '8px', fontSize: '14px', resize: 'none' }}
            />
            <button
              className="btn mt-2"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: '#FF5A3C', color: '#fff', borderRadius: '8px',
                padding: '8px 24px', fontWeight: 600, fontSize: '14px',
                border: 'none'
              }}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#aaa', padding: '24px 0' }}>
              No reviews yet. Be the first to review!
            </p>
          ) : (
            reviews.map((review, i) => (
              <div key={review._id || i} style={{
                padding: '14px 0',
                borderBottom: i < reviews.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: '#FF5A3C', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 700
                  }}>
                    {review.userName?.charAt(0)?.toUpperCase() || <FaUser />}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{review.userName}</span>
                    <span style={{ color: '#aaa', fontSize: '12px', marginLeft: '8px' }}>
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px' }}>
                    {renderStars(review.rating, '13px')}
                  </div>
                </div>
                {review.comment && (
                  <p style={{ margin: 0, color: '#555', fontSize: '13px', paddingLeft: '42px' }}>
                    {review.comment}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 24px', borderTop: '1px solid #eee', textAlign: 'right' }}>
          <button className="btn btn-outline-secondary" onClick={onClose} style={{ borderRadius: '8px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewModal
