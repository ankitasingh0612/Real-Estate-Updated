import { API_BASE } from '../../config/api.js';
import React from 'react';
import { FaEnvelope, FaKey } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from './NavBar';

const schema = yup.object().shape({
  email: yup.string().email('Valid email required').required('Email is required'),
  contact: yup.string().required('Phone number is required for verification'),
  newPassword: yup.string().required('New password is required').min(8, 'Must be at least 8 characters').max(20)
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const handleReset = async (data) => {
    try {
      const response = await axios.post(API_BASE + '/api/forgot-password', data);
      
      if (response?.data?.code === 200) {
        Swal.fire({
          title: "Success",
          text: response?.data?.message,
          icon: "success"
        });
        navigate('/login');
      } else {
        Swal.fire({
          title: "Verification Failed",
          text: response?.data?.message,
          icon: "error"
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong! Please try again later.",
        icon: "error"
      });
    }
  };

  return (
    <> 
      <NavBar/>
      <div className="container my-5">
        <h2 className="login-title text-center">Reset Password</h2>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="login-box bg-white p-4 shadow-sm border rounded">
              <p className="text-muted text-center mb-4">
                Please verify your account by entering the email and phone number you initially used to register.
              </p>
              <form onSubmit={handleSubmit((d) => handleReset(d))}>
                <div className="row g-3">

                  <div className="col-12">
                    <label className="form-label">Registered Email</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaEnvelope /></span>
                      <input {...register('email')} type="email" className="form-control" placeholder="Enter your email" />
                    </div>
                    {errors?.email && <p className='text-danger mb-0 mt-1' style={{fontSize: '13px'}}>{errors?.email?.message}</p>}
                  </div>

                  <div className="col-12">
                    <label className="form-label">Registered Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text"><IoMdCall /></span>
                      <input {...register('contact')} type="tel" className="form-control" placeholder="Enter phone number" />
                    </div>
                     {errors?.contact && <p className='text-danger mb-0 mt-1' style={{fontSize: '13px'}}>{errors?.contact?.message}</p>}
                  </div>

                  <div className="col-12">
                    <label className="form-label">New Password</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaKey /></span>
                      <input {...register('newPassword')} type="password" className="form-control" placeholder="Enter new password" />
                    </div>
                     {errors?.newPassword && <p className='text-danger mb-0 mt-1' style={{fontSize: '13px'}}>{errors?.newPassword?.message}</p>}
                  </div>

                  <div className="text-center mt-4">
                    <button type="submit" className="btn btn-danger px-5 py-2 w-100 fw-bold">Reset Password</button>
                  </div>
                  
                  <div className="text-center mt-3">
                    <Link to="/login" className="text-decoration-none">Back to Login</Link>
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

export default ForgotPassword;
