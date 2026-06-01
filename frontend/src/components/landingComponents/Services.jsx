//services
import React from "react";

import NavBar from "./NavBar";
import { useLocation } from "react-router-dom";
const Services = () => {
 const location=useLocation(); 
 
  return (
    <>
    {location?.pathname!="/" &&   <NavBar/>}
    <div  className="row py-5 bg servicesh">
      <div className="text-center ">
      <div className="tagline ">Our Services </div>
      <h2 className="section-title">Our Main Focus</h2>
    </div>
      <div className="col-sm-10 card1 mx-auto">
        <div   data-aos="fade-right"className="row py-3">
          <div className="col-12 col-md-4 mb-4">
            <div className="card mx-auto shadow-sm p-4 border-0 h-100" style={{ borderRadius: '15px' }}>
              <img src="/home.png" className="img-fluid w-50 mx-auto" alt="Buy home"/>
              <h3 className="text-center py-2"><b>Buy a home</b></h3>
              <p className="text-center">Buying a home is a significant financial and personal decision, involving careful planning and consideration. </p>
              <p className="text-center mt-auto"><span className=" btn btn-outline-danger w-100 rounded-pill">Find A Home &rarr;</span></p>
            </div>
          </div>
          <div data-aos="zoom-in" className="col-12 col-md-4 mb-4">
            <div className="card mx-auto shadow-sm p-4 border-0 h-100" style={{ borderRadius: '15px' }}>
              <img src="/22.png" className="img-fluid w-50 mx-auto" alt="Rent home"/>
              <h3 className="text-center py-2"><b>Rent a home</b></h3>
              <p className="text-center">Renting a home offers flexibility and lower upfront costs, while owning builds equity and provides stability.</p>
              <p className="text-center mt-auto"><span className=" btn btn-outline-danger w-100 rounded-pill">Find A Home &rarr;</span></p>
            </div>
          </div>
          <div data-aos="fade-left" className="col-12 col-md-4 mb-4">
            <div className="card mx-auto shadow-sm p-4 border-0 h-100" style={{ borderRadius: '15px' }}>
              <img src="/23.png" className="img-fluid w-50 mx-auto" alt="Sell home"/>
              <h3 className="text-center py-2"><b>Sell a home</b></h3>
              <p className="text-center">Selling a home involves several key steps including preparing the property and pricing it competitively.</p>
              <p className="text-center mt-auto"><span className=" btn btn-outline-danger w-100 rounded-pill">Find A Home &rarr;</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Services;