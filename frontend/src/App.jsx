import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js'; 
import './App.css'
import { useLocation, Routes, Route } from 'react-router-dom';
import Navbar from './components/landingComponents/NavBar';
import Home from './components/landingComponents/Home';
import About from './components/landingComponents/About';
import Services from './components/landingComponents/Services';
import Property from './components/landingComponents/Property';
import UserRegister from './components/landingComponents/UserRegister';
import Footer from './components/landingComponents/Footer'
import Login from './components/landingComponents/Login';
import AddProperty from './components/AdminComponents/AddProperty';
import AdminPropertyList from './components/AdminComponents/AdminPropertyList';
import AdminSoldProperty from './components/AdminComponents/AdminSoldProperty';
import UserList from './components/AdminComponents/UserList';
import AdminProfile from './components/AdminComponents/AdminProfile';
import AdminContactUsList from './components/AdminComponents/AdminContactUsList';
import AdminLogout from './components/AdminComponents/AdminLogout';
import AdminDashboard from './components/AdminComponents/AdminDashboard';
import AdminVisitList from './components/AdminComponents/AdminVisitList';
import UserBoughtList from './components/userComponents/UserBoughtList';
import UserProfile from './components/userComponents/UserProfile';
import UserLogOut from './components/userComponents/UserLogOut';
import SellerChatInbox from './components/SellerComponents/SellerChatInbox';
import UserWishlist from './components/userComponents/UserWishlist';
import UserVisits from './components/userComponents/UserVisits';
import ContactUs from './components/landingComponents/ContactUs';
import ForgotPassword from './components/landingComponents/ForgotPassword';
import AIChatbot from './components/landingComponents/AIChatbot';
import FAQ from './components/landingComponents/FAQ';
import NotFound from './NotFound';
import 'aos/dist/aos.css'
import AOS from 'aos';
import { useEffect, useState } from 'react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const location =useLocation()
  const [userData ,setUserData]=useState(null);
    // Role base authentication
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    setUserData(user);
  }, [location]);
  
  useEffect(()=>{
          AOS.init({
      offset: 200,
      duration: 600,
      easing: 'ease-in-sine',
      delay: 100,
    });

  },[])

  return (
    <>
      <ScrollToTop />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: '1 0 auto' }}>
          <Routes>
              {/* landing page router */}
              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/services' element={<Services />} />
              <Route path='/property' element={<Property />} />
              <Route path='/contact' element={<ContactUs />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
             
              <Route path='/register' element={<UserRegister />} />
              <Route path='/login' element={<Login />} />
              {/* admin Section  */}
              {userData?.userType=="admin" && <>
              <Route path='/admin-dashboard' element={<AdminDashboard />} />
              <Route path='/admin-list' element={<AdminPropertyList />} />
              <Route path='/admin-sold' element={<AdminSoldProperty />} />
              <Route path='/admin-user' element={<UserList />} />
              <Route path='/admin-profile' element={<AdminProfile />} />
              <Route path='/admin-contact' element={<AdminContactUsList />} /> 
              <Route path='/admin-visits' element={<AdminVisitList />} />
              <Route path='/admin-chat' element={<SellerChatInbox />} />
              <Route path='/admin-logout' element={<AdminLogout />} />
              
              </>}
              {/* User Route */}
              {userData?.userType=="user" && <>
              <Route path='/user-property' element={<Property />} />
              <Route path='/user-bought' element={<UserBoughtList/>} />
              <Route path='/user-wishlist' element={<UserWishlist/>} />
              <Route path='/user-visits' element={<UserVisits/>} />
              <Route path='/user-profile' element={<UserProfile/>} /> 
              <Route path='/ContactUs' element={<ContactUs />} />
              <Route path='/user-logout' element={<UserLogOut />} />
              
              </>}
              {/* Seller Route */}
              {userData?.userType=="seller" && <>
              <Route path='/seller-dashboard' element={<AdminDashboard />} />
              <Route path='/seller-add' element={<AddProperty />} />
              <Route path='/seller-list' element={<AdminPropertyList />} />
              <Route path='/seller-profile' element={<UserProfile/>} /> 
              <Route path='/seller-chat' element={<SellerChatInbox />} />
              <Route path='/seller-logout' element={<UserLogOut />} />
              </>}
              <Route path='*' element={< NotFound />}/>
            </Routes>
        </div>
        
        <AIChatbot />
        <Footer/>
      </div>
    </>
  )
}
// Trigger HMR after fixing UserWishlist syntax

export default App