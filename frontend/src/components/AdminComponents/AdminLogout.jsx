import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const AdminLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      title: "Logout",
      text: "You have been logged out successfully.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false
    });
    localStorage.removeItem('userInfo');
    navigate('/login');
  }, []);

  return null;
}

export default AdminLogout