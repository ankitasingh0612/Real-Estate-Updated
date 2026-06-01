import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import NavBar from './components/landingComponents/NavBar';

const NotFound = () => {
    // const navigate=useNavigate();
    useEffect(()=>{
    //   navigate('/login');
    },[])
  return (<>
    <NavBar/>
   <div className='row'>
    <div className='col-sm-3'></div>
    <div className='col-sm-7'>
        <div className=" pt-5 not-found"><h1>404</h1>
        <p >Not Found</p>
        </div>
    </div>

   </div>
   <div className='col-sm-2'></div>
    </>
  )
}

export default NotFound;