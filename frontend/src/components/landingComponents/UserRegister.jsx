import { API_BASE } from '../../config/api.js';
import React from 'react';
import { FaUser, FaEnvelope, FaKey } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
import { MdAddPhotoAlternate } from "react-icons/md";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import NavBar from './NavBar';
import {FaLocationArrow } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const schema = yup.object().shape({
  name: yup.string().required().min(2).max(50),
  email: yup.string().email().required().min(5).max(50),
  contact: yup.string().required(),
  password: yup.string().required().min(8).max(50),
  address: yup.string().required().min(2).max(100),
  userType: yup.string().required("Please select an account type"),
  adminPin: yup.string().when('userType', {
    is: 'admin',
    then: (schema) => schema.required("Security PIN is required for Admin registration"),
    otherwise: (schema) => schema.notRequired()
  }),
  profile: yup.mixed().required()
})

const UserRegister = () => {
  const navigate = useNavigate();
  
  const {register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const selectedUserType = watch('userType');
  
    const handleRegister = async (data) => {
  try {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('contact', data.contact);
    formData.append('password', data.password);
    formData.append('address', data.address);
    formData.append('userType', data.userType);
    if (data.userType === 'admin') {
      formData.append('adminPin', data.adminPin);
    }
    formData.append('profile', data.profile[0]); 

    const response = await axios.post(API_BASE + '/api/user-register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    
    if (response?.data?.code === 200) {
      Swal.fire({
        title: "Registration Successful",
        text: response?.data?.message,
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

      // Auto-login: Store user info in localStorage
      const userData = response.data.data;
      localStorage.setItem('userInfo', JSON.stringify(userData));

      // Redirect based on userType (consistent with Login.jsx)
      setTimeout(() => {
        if (userData.userType === "seller") {
          navigate('/seller-dashboard');
        } else if (userData.userType === "user") {
          navigate('/user-property');
        } else if (userData.userType === "admin") {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      }, 1500);

    } else {
      Swal.fire({
        title: "Registration Failed",
        text: response?.data?.message || "Something went wrong!",
        icon: "error"
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    const errorMsg = error?.response?.data?.message || error.message || "Something went wrong!";
    Swal.fire({
       title: "Registration Failed",
        text: errorMsg,
        icon: "error"
    })
  }
}
  return (
    <> 
      <NavBar/>
      <div className="container my-5">
        <h2 className="text-center fw-bold mb-4">Create Your Account</h2>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="form-box p-4 shadow-lg" style={{ borderRadius: '20px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
              <form onSubmit={handleSubmit((d)=> handleRegister(d))}>
                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Your Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0"><FaUser className="text-primary" /></span>
                      <input {...register('name')} type="text" className="form-control border-start-0" placeholder="Enter your name" />
                    </div>
                    {errors?.name && <p className='text-danger small mt-1'>{errors?.name?.message}</p>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Your Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0"><FaEnvelope className="text-primary" /></span>
                      <input {...register('email')} type="email" className="form-control border-start-0" placeholder="Enter your email" />
                    </div>
                    {errors?.email && <p className='text-danger small mt-1'>{errors?.email?.message}</p>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0"><IoMdCall className="text-primary" /></span>
                      <input {...register('contact')}  type="tel" className="form-control border-start-0" placeholder="Enter phone number" />
                    </div>
                     {errors?.contact && <p className='text-danger small mt-1'>{errors?.contact?.message}</p>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0"><FaKey className="text-primary" /></span>
                      <input {...register('password')} type="password" className="form-control border-start-0" placeholder="Password" />
                    </div>
                     {errors?.password && <p className='text-danger small mt-1'>{errors?.password?.message}</p>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0"><FaLocationArrow className="text-primary" /></span>
                      <input {...register('address')} type="text" className="form-control border-start-0" placeholder="Enter your address" />
                    </div>
                     {errors?.address && <p className='text-danger small mt-1'>{errors?.address?.message}</p>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Account Type</label>
                    <div className="input-group">
                      <select {...register('userType')} className="form-select">
                        <option value="">Select Account Type...</option>
                        <option value="user">Buyer (Looking for properties)</option>
                        <option value="seller">Seller (Listing properties)</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                     {errors?.userType && <p className='text-danger small mt-1'>{errors?.userType?.message}</p>}
                  </div>

                  {selectedUserType === 'admin' && (
                    <div className="col-md-12 animate__animated animate__fadeIn">
                      <label className="form-label fw-semibold text-danger">Security PIN (Required for Admin)</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><FaKey className="text-danger" /></span>
                        <input {...register('adminPin')} type="password" password className="form-control border-start-0" placeholder="Enter Admin Registration PIN" />
                      </div>
                      {errors?.adminPin && <p className='text-danger small mt-1'>{errors?.adminPin?.message}</p>}
                    </div>
                  )}

                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Profile Picture</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0"><MdAddPhotoAlternate className="text-primary" /></span>
                      <input {...register('profile')}type="file" className="form-control border-start-0" />
                    </div>
                    {errors?.profile && <p className='text-danger small mt-1'>{errors?.profile?.message}</p>}
                  </div>

                  <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary px-5 py-2 fw-bold" style={{ borderRadius: '10px' }}>Register Now</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserRegister