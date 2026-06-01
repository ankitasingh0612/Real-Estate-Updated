import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import PreferenceModal from './PreferenceModal';
import { FaCog } from 'react-icons/fa';

const NavBar = () => {
  const navigate = useNavigate()
  const [useData, setUserData] = useState(null)
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'light')
  const [isPrefOpen, setIsPrefOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    setUserData(user)
    document.documentElement.setAttribute('data-bs-theme', theme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('app-theme', newTheme)
    document.documentElement.setAttribute('data-bs-theme', newTheme)
  }

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login')
  }

  if (useData?.userType == "admin") {
    return (<>
      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top">
        <div className="container">
          <div className="navbar-brand text-danger fw-bold d-flex align-items-center" >
            <img src="/favicon.png" alt="Logo" /> &nbsp;<b className='font text-center'>QUIREX</b>
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-sm-0">
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/admin-dashboard">Dashboard</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/admin-list">List</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/admin-sold">Sold</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/admin-user">User</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/admin-visits">📅 Visits</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/admin-profile">Profile</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/admin-contact">Contact</Link></li>
            </ul>
            <div className="d-flex align-items-center gap-3">
              <NotificationBell userId={useData?._id} />
              <button onClick={() => setIsPrefOpen(true)} className="btn btn-link p-0 text-dark"><FaCog /></button>
              <button onClick={toggleTheme} className="btn btn-sm btn-outline-secondary" style={{ borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <Link to='/admin-logout'> <button className=" btn1  px-4 py-2 ">LogOut</button></Link>
            </div>
          </div>
        </div>
      </nav>
      <PreferenceModal userId={useData?._id} isOpen={isPrefOpen} onClose={() => setIsPrefOpen(false)} />
    </>)
  } else if (useData?.userType == "user") {
    return (<>
      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top">
        <div className="container">
          <div className="navbar-brand text-danger fw-bold d-flex align-items-center" >
            <img src="/favicon.png" alt="Logo" /> &nbsp;<b className='font text-center'>QUIREX</b>
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-sm-0">
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/user-property">Property</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/user-bought">Bought</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/user-wishlist">❤️ Saved Properties</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/user-visits">📅 Visits</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/user-profile">Profile</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/ContactUs">Contact</Link></li>
            </ul>
            <div className="d-flex align-items-center gap-3">
              <NotificationBell userId={useData?._id} />
              <button onClick={() => setIsPrefOpen(true)} className="btn btn-link p-0 text-dark"><FaCog /></button>
              <button onClick={toggleTheme} className="btn btn-sm btn-outline-secondary" style={{ borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <Link to='/user-logout'> <button className=" btn1  px-4 py-2 ">LogOut</button></Link>
            </div>
          </div>
        </div>
      </nav>
      <PreferenceModal userId={useData?._id} isOpen={isPrefOpen} onClose={() => setIsPrefOpen(false)} />
    </>)
  } else if (useData?.userType == "seller") {
    return (<>
      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top">
        <div className="container">
          <div className="navbar-brand text-danger fw-bold d-flex align-items-center" >
            <img src="/favicon.png" alt="Logo" /> &nbsp;<b className='font text-center'>QUIREX</b>
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-sm-0">
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/seller-dashboard">Dashboard</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/seller-add">Add Property</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/seller-list">My Properties</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/seller-chat">💬 Inbox</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/seller-profile">Profile</Link></li>
            </ul>
            <div className="d-flex align-items-center gap-3">
              <NotificationBell userId={useData?._id} />
              <button onClick={() => setIsPrefOpen(true)} className="btn btn-link p-0 text-dark"><FaCog /></button>
              <button onClick={toggleTheme} className="btn btn-sm btn-outline-secondary" style={{ borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <Link to='/seller-logout'> <button className=" btn1  px-4 py-2 ">LogOut</button></Link>
            </div>
          </div>
        </div>
      </nav>
      <PreferenceModal userId={useData?._id} isOpen={isPrefOpen} onClose={() => setIsPrefOpen(false)} />
    </>)
  } else {
    return (
      <>
        <nav className="navbar navbar-expand-sm bg-white border-bottom shadow-sm sticky-top">
          <div className="container">
            <div className="navbar-brand text-danger fw-bold d-flex align-items-center" >
              <img src="/favicon.png" alt="Logo" /> &nbsp;<b className='font text-center'>QUIREX</b>
            </div>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="mx-5 collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto mb-2 mb-sm-0">
                <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/">Home</Link></li>
                <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/about">About</Link></li>
                <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/services">Services</Link></li>
                <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/property">Property</Link></li>
                <li className="nav-item"><Link className="nav-link text-dark fw-bold" to="/contact">Contact</Link></li>
              </ul>
              <div className="d-flex align-items-center gap-3">
                <button onClick={toggleTheme} className="btn btn-sm btn-outline-secondary" style={{ borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <Link to='/register'>  <button className=" btn1 px-4 py-2  ">Registration</button></Link>
                <Link to='/login'> <button className=" btn1  px-4 py-2 ">Login</button></Link>
              </div>
            </div>
          </div>
        </nav>
        <PreferenceModal userId={useData?._id} isOpen={isPrefOpen} onClose={() => setIsPrefOpen(false)} />
      </>
    )
  }
}

export default NavBar