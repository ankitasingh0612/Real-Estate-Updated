import React from 'react'
import {  FaHome } from "react-icons/fa";
import Typewriter from "typewriter-effect";
import { Link } from 'react-router-dom';


const Slider = () => {
  return (
    <>
  <div className="row bg py-5" style={{ minHeight: "400px" }}>
      <div className="col-10 mx-auto">
        <div className="row d-flex align-items-center">
          {/* Text Content */}
          <div className="col-12 col-lg-6 mb-5 mb-lg-0 text-center text-lg-start">
            <p className="fs-5">
              <FaHome className="me-2 ic" />
              Real Estate Agency
            </p>
            <b className="typewriter">
              <Typewriter
                options={{
                  strings: [' Find the exciting Dream House.'],
                  autoStart: true,
                  loop: true,
                }}
              />
            </b>
            <p className='mt-3'>
              It is a comfortable feeling to know that you stand on your own ground. Land is about the only thing that can't fly away.
              Don't wait to buy real estate, buy real estate and wait...
            </p>
            <Link to="/ContactUs"><button className="btn btn1 px-5 py-3">Make An Enquiry</button></Link>
          </div>

          {/* Image Content */}
          <div className="col-12 col-lg-6 text-center">
            <img
              src="/slider.png"
              alt="Real Estate"
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "450px", width: "100%", objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Slider