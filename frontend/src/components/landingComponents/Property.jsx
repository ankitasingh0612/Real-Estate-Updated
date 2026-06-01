import { API_BASE } from '../../config/api.js';
import React, { useEffect, useState, useMemo } from 'react'
import { IoBedOutline } from "react-icons/io5";
import { LiaBathSolid } from "react-icons/lia";
import { FaHeart, FaRegHeart, FaSearch, FaFilter, FaTimes, FaStar, FaRegStar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import ReviewModal from './ReviewModal';
import ScheduleVisitModal from './ScheduleVisitModal';
import ChatWidget from './ChatWidget';
import axios from 'axios';
import Swal from 'sweetalert2';
import NavBar from './NavBar';

const Property = () => {
  const [listData, setListData] = useState([])
  const [wishlistIds, setWishlistIds] = useState([])
  const [ratingsMap, setRatingsMap] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [reviewModal, setReviewModal] = useState({ show: false, propertyId: '', propertyTitle: '' })
  const [visitModal, setVisitModal] = useState({ show: false, propertyId: '', propertyTitle: '' })
  const [chatWidget, setChatWidget] = useState({ show: false, propertyId: '', sellerId: '', sellerName: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const location = useLocation();
  const navigate = useNavigate();

  // Filter states
  const [searchText, setSearchText] = useState('')
  const [filterBHK, setFilterBHK] = useState('')
  const [filterPriceRange, setFilterPriceRange] = useState('')
  const [filterLocation, setFilterLocation] = useState('')

  useEffect(() => {
    fetchData()
    fetchWishlistIds()
    fetchAllRatings()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(API_BASE + '/api/property-list');
      if (response?.data?.code == 200) {
        setListData(response?.data?.data || [])
      } else {
        setError(response?.data?.message || 'Failed to fetch properties')
      }
    } catch(err) { 
      console.error("fetchData failed", err)
      setError("Unable to connect to the server. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  const fetchWishlistIds = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userInfo'));
      if (!userData?._id) return;
      const response = await axios.post(API_BASE + '/api/user-wishlist-ids', { userId: userData._id });
      if (response?.data?.code == 200) {
        setWishlistIds(response?.data?.data || [])
      }
    } catch(err) { console.error("fetchWishlist failed", err) }
  }

  const fetchAllRatings = async () => {
    try {
      const response = await axios.get(API_BASE + '/api/get-all-ratings');
      if (response?.data?.code == 200) {
        setRatingsMap(response?.data?.data || {})
      }
    } catch(err) { console.error("fetchRatings failed", err) }
  }

  // Get unique locations from data
  const locations = useMemo(() => {
    const locs = [...new Set((listData || []).map(item => item?.location).filter(Boolean))];
    return locs.sort();
  }, [listData])

  // Filtered data
  const filteredData = useMemo(() => {
    return (listData || []).filter(item => {
      if (searchText) {
        const search = searchText.toLowerCase();
        const matchesSearch =
          item?.title?.toLowerCase().includes(search) ||
          item?.description?.toLowerCase().includes(search) ||
          item?.location?.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }
      if (filterBHK && item?.bhk !== filterBHK) return false;
      if (filterPriceRange) {
        const price = parseInt(item?.price) || 0;
        switch (filterPriceRange) {
          case '0-10000': if (price > 10000) return false; break;
          case '10000-20000': if (price < 10000 || price > 20000) return false; break;
          case '20000-35000': if (price < 20000 || price > 35000) return false; break;
          case '35000+': if (price < 35000) return false; break;
        }
      }
      if (filterLocation && item?.location !== filterLocation) return false;
      return true;
    })
  }, [listData, searchText, filterBHK, filterPriceRange, filterLocation])

  const activeFilterCount = [filterBHK, filterPriceRange, filterLocation].filter(Boolean).length;

  const clearFilters = () => {
    setSearchText('')
    setFilterBHK('')
    setFilterPriceRange('')
    setFilterLocation('')
  }

  const handleWishlistToggle = async (propertyId) => {
    const userData = JSON.parse(localStorage.getItem('userInfo'));
    if (!userData?._id) { navigate('/login'); return }
    const response = await axios.post(API_BASE + '/api/wishlist-toggle', {
      userId: userData._id, propertyId
    });
    if (response?.data?.code == 200) {
      if (response?.data?.data?.wishlisted) {
        setWishlistIds(prev => [...prev, propertyId])
      } else {
        setWishlistIds(prev => prev.filter(id => id !== propertyId))
      }
      Swal.fire({ title: "Wishlist", text: response?.data?.message, icon: 'success', timer: 1200, showConfirmButton: false })
    }
  }

  const handleBuy = async (propertyId) => {
    const userData = JSON.parse(localStorage.getItem('userInfo'));
    if (!userData?._id) { navigate('/login'); return }
    const response = await axios.post(API_BASE + '/api/buy', { userId: userData?._id, propertyId });
    if (response?.data?.code == 200) {
      Swal.fire({ title: "Buy Property", text: response?.data?.message, icon: 'success' })
    } else {
      Swal.fire({ title: "Buy Property", text: response?.data?.message, icon: 'error' })
    }
  }

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map(star => (
      star <= Math.round(rating)
        ? <FaStar key={star} style={{ color: '#FFB800', fontSize: '12px' }} />
        : <FaRegStar key={star} style={{ color: '#ddd', fontSize: '12px' }} />
    ))
  }

  return (
    <>
      {location?.pathname != "/" && <NavBar />}
      <div className='row property py-5'>
        <div className="text-center ">
          <div className="tagline ">Properties </div>
          <h2 className="section-title">Featured Listings</h2>
        </div>

        {/* Search & Filter Bar */}
        <div className='col-12 col-lg-10 mx-auto mb-4 px-3 px-md-0'>
          <div style={{
            background: '#fff', borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '16px 24px', border: '1px solid #eee'
          }}>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <div className="input-group flex-grow-1" style={{ maxWidth: '100%', width: '100%' }}>
                <span className="input-group-text" style={{ background: '#fff', border: '1px solid #ddd' }}>
                  <FaSearch style={{ color: '#FF5A3C' }} />
                </span>
                <input
                  type="text" className="form-control"
                  placeholder="Search by title, location..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ border: '1px solid #ddd', borderLeft: 'none' }}
                />
              </div>
              <button
                className={`btn d-flex align-items-center gap-2 ${showFilters ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={() => setShowFilters(!showFilters)}
                style={{ borderRadius: '8px', padding: '8px 16px' }}
              >
                <FaFilter /> Filters
                {activeFilterCount > 0 && (
                  <span className="badge bg-white text-danger" style={{ fontSize: '11px' }}>{activeFilterCount}</span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button className="btn btn-outline-secondary d-flex align-items-center gap-1"
                  onClick={clearFilters} style={{ borderRadius: '8px', padding: '8px 16px' }}>
                  <FaTimes /> Clear All
                </button>
              )}
              <span className="ms-auto text-muted" style={{ fontSize: '14px' }}>
                <b>{filteredData.length}</b> of {listData.length} properties
              </span>
            </div>

            {showFilters && (
              <div className="row mt-3 pt-3" style={{ borderTop: '1px solid #eee' }}>
                <div className="col-md-4 mb-2">
                  <label className="form-label fw-bold" style={{ fontSize: '13px', color: '#555' }}>
                    <IoBedOutline style={{ marginRight: '4px' }} /> BHK Type
                  </label>
                  <select className="form-select" value={filterBHK}
                    onChange={(e) => setFilterBHK(e.target.value)} style={{ borderRadius: '8px' }}>
                    <option value="">All BHK</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>
                <div className="col-md-4 mb-2">
                  <label className="form-label fw-bold" style={{ fontSize: '13px', color: '#555' }}>💰 Price Range</label>
                  <select className="form-select" value={filterPriceRange}
                    onChange={(e) => setFilterPriceRange(e.target.value)} style={{ borderRadius: '8px' }}>
                    <option value="">All Prices</option>
                    <option value="0-10000">Under $10,000</option>
                    <option value="10000-20000">$10,000 - $20,000</option>
                    <option value="20000-35000">$20,000 - $35,000</option>
                    <option value="35000+">$35,000+</option>
                  </select>
                </div>
                <div className="col-md-4 mb-2">
                  <label className="form-label fw-bold" style={{ fontSize: '13px', color: '#555' }}>
                    <MdLocationOn style={{ marginRight: '4px' }} /> Location
                  </label>
                  <select className="form-select" value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)} style={{ borderRadius: '8px' }}>
                    <option value="">All Locations</option>
                    {locations.map((loc, i) => <option key={i} value={loc}>{loc}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Property Cards */}
        <div className='col-12 col-lg-10 mx-auto'>
          <div className='row g-4 py-3'>
            {filteredData?.map((item, index) => {
              const isWishlisted = wishlistIds.includes(item?._id);
              const rating = ratingsMap[item?._id];
              return (<React.Fragment key={item?._id || index}>
                <div className='col-12 col-md-6 col-xl-4 px-3'>
                  <div className="card  mx-auto shadow-lg border border-0" style={{ position: 'relative' }}>
                    {/* Wishlist Heart */}
                    <div className="wishlist-heart" onClick={() => handleWishlistToggle(item?._id)}
                      style={{
                        position: 'absolute', top: '10px', right: '10px', zIndex: 2,
                        cursor: 'pointer', background: 'rgba(255,255,255,0.85)',
                        borderRadius: '50%', width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)', transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      title={isWishlisted ? "Remove from Saved Properties" : "Save Property"}>
                      {isWishlisted
                        ? <FaHeart style={{ color: '#FF5A3C', fontSize: '18px' }} />
                        : <FaRegHeart style={{ color: '#FF5A3C', fontSize: '18px' }} />}
                    </div>
                    {/* BHK Badge */}
                    {item?.bhk && (
                      <div style={{
                        position: 'absolute', top: '10px', left: '10px', zIndex: 2,
                        background: '#FF5A3C', color: '#fff', borderRadius: '6px',
                        padding: '2px 10px', fontSize: '12px', fontWeight: 'bold',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                      }}>{item.bhk} BHK</div>
                    )}
                    <img src={`${API_BASE}/img/${item?.pic}`} className="card-img-top img-fluid featuredimg" alt="..." />
                    <div className="card-body">
                      <p className='mycolor1'><b>${item?.price}</b>/Month</p>
                      <h5 className="card-title"><b className='mycolor2'>{item?.title}</b></h5>

                      {/* Star Rating Display */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', gap: '1px' }}>
                          {renderStars(rating?.avg || 0)}
                        </div>
                        <span style={{ fontSize: '12px', color: '#888' }}>
                          {rating ? `${rating.avg} (${rating.count})` : 'No ratings'}
                        </span>
                      </div>

                      <p className="card-text featuredp ">{item?.description}</p>
                      <div className='row'>
                        <div className='col-4 featureddiv featuredp'>
                          <p className='m-0 ps-2'>{item?.area}sqft</p>
                          <span className='ps-2'><IoBedOutline />Bed</span>
                          <span className='ps-2'><LiaBathSolid />Baths</span>
                        </div>
                        <div className="d-flex gap-2 mt-2">
                          {location?.pathname !== '/property' && (
                            <button onClick={() => handleBuy(item?._id)} className='btn btn-outline-danger btn-sm'>Buy</button>
                          )}
                          <button
                            onClick={() => setReviewModal({ show: true, propertyId: item?._id, propertyTitle: item?.title })}
                            className='btn btn-outline-warning btn-sm'
                            style={{ fontSize: '12px' }}
                          >
                            ⭐ Reviews
                          </button>
                          <button
                            onClick={() => setVisitModal({ show: true, propertyId: item?._id, propertyTitle: item?.title })}
                            className='btn btn-outline-success btn-sm'
                            style={{ fontSize: '12px' }}
                          >
                            📅 Visit
                          </button>
                          <button
                            onClick={() => setChatWidget({ show: true, propertyId: item?._id, sellerId: item?.sellerId || 'admin', sellerName: item?.sellerName || 'Admin' })}
                            className='btn btn-outline-info btn-sm'
                            style={{ fontSize: '12px' }}
                          >
                            💬 Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>)
            })}
            {filteredData?.length == 0 && !loading && !error && (
              <div className="text-center py-5">
                <h4 style={{ color: '#999' }}>No properties match your filters</h4>
                <p style={{ color: '#aaa' }}>Try adjusting your search criteria or <span style={{ color: '#FF5A3C', cursor: 'pointer' }} onClick={clearFilters}>clear all filters</span></p>
              </div>
            )}
            
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Fetching property details...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-5 mx-auto" style={{ maxWidth: '500px' }}>
                <div className="alert alert-danger shadow-sm py-4">
                  <h5 className="alert-heading">⚠️ Data Loading Issue</h5>
                  <p className="mb-3">{error}</p>
                  <button className="btn btn-danger px-4" onClick={fetchData}>
                    Retry Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReviewModal
        show={reviewModal.show}
        onClose={() => { setReviewModal({ show: false, propertyId: '', propertyTitle: '' }); fetchAllRatings(); }}
        propertyId={reviewModal.propertyId}
        propertyTitle={reviewModal.propertyTitle}
      />
      <ScheduleVisitModal
        show={visitModal.show}
        onClose={() => setVisitModal({ show: false, propertyId: '', propertyTitle: '' })}
        propertyId={visitModal.propertyId}
        propertyTitle={visitModal.propertyTitle}
      />
      <ChatWidget
        show={chatWidget.show}
        onClose={() => setChatWidget({ show: false, propertyId: '', sellerId: '', sellerName: '' })}
        propertyId={chatWidget.propertyId}
        sellerId={chatWidget.sellerId}
        sellerName={chatWidget.sellerName}
      />
    </>
  )
}

export default Property