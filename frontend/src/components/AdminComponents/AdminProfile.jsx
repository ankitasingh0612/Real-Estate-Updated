import { API_BASE } from '../../config/api.js';
import React, { useEffect } from 'react';
import { FaUser, FaEnvelope, FaKey } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
import { MdAddPhotoAlternate } from "react-icons/md";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import NavBar from '../landingComponents/NavBar';
import {FaLocationArrow } from 'react-icons/fa';


const schema = yup.object().shape({
  name: yup.string().required().min(2).max(20),
  email: yup.string().email().required().min(5).max(20),
  contact: yup.string().required(),
  password: yup.string().required().min(8).max(20),
  address: yup.string().required().min(2).max(20),
  profile: yup.mixed().required()
})

const AdminProfile = () => {
  useEffect(()=>{
   const userData=JSON.parse(localStorage.getItem('userInfo'));
   setValue('name',userData?.name);
   setValue('email',userData?.email);
   setValue('contact',userData?.contact);
   setValue('password',userData?.password);
   setValue('address',userData?.address);
  },[])
  
  const {register,handleSubmit,setValue,formState: { errors }} = useForm({
    resolver: yupResolver(schema),
  })
    const handleRegister = async (data) => {
      if(data?.profile?.length==0){
        Swal.fire({
          title:'File Upload Error',
          text:"Please Upload a Valid File.",
          icon:"error"
        })
        return
      }

    const userData=JSON.parse(localStorage.getItem('userInfo'))
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('contact', data.contact);
    formData.append('password', data.password);
    formData.append('address', data.address);
    formData.append('profile', data.profile[0]); 
    formData.append('userId',userData?._id)

    const response = await axios.put(API_BASE + '/api/user-update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    
if (response.data?.code == 200) {
      Swal.fire({
        title: "Profile updated",
        text: response?.data?.message,
        icon: "success"
      });
      localStorage.setItem('userInfo',JSON.stringify(response?.data?.data))
     
}else{
  
    Swal.fire({
       title: "Profile Updated",
        text: response?.data?.message,
        icon: "error"
})
    }  
  };
  return (
    <> 
      <NavBar/>
      <div className="container my-5">
        <h2 className="text-center">Admin Profile</h2>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="form-box">
              <form onSubmit={handleSubmit((d)=> handleRegister(d))}>
                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label">Your Name</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaUser /></span>
                      <input {...register('name')} type="text" className="form-control" placeholder="Enter your name" />
                    </div>
                    {errors?.name && <p className='text-danger'>{errors?.name?.message}</p>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Your Email</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaEnvelope /></span>
                      <input {...register('email')} type="email" className="form-control" placeholder="Enter your email" />
                    </div>
                    {errors?.email && <p className='text-danger'>{errors?.email?.message}</p>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text"><IoMdCall /></span>
                      <input {...register('contact')}  type="tel" className="form-control" placeholder="Enter phone number" />
                    </div>
                     {errors?.contact && <p className='text-danger'>{errors?.contact?.message}</p>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaKey /></span>
                      <input {...register('password')} type="password" className="form-control" placeholder="Password" />
                    </div>
                     {errors?.password && <p className='text-danger'>{errors?.password?.message}</p>}
                  </div>
                    <div className="col-md-6">
                    <label className="form-label">Address</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaLocationArrow /></span>
                      <input {...register('address')} type="text" className="form-control" placeholder="Enter your address" />
                    </div>
                     {errors?.address && <p className='text-danger'>{errors?.address?.message}</p>}
                  </div>


                  <div className="col-md-6">
                    <label className="form-label">Profile Picture</label>
                    <div className="input-group">
                      <span className="input-group-text"><MdAddPhotoAlternate /></span>
                      <input {...register('profile')}type="file" className="form-control" />
                    </div>
                    {errors?.profile && <p className='text-danger'>{errors?.profile?.message}</p>}
                  </div>

                  <div className="text-center mt-4">
                    <button type="submit" className="btn  px-5 btn-login">Update</button>
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

export default AdminProfile