import React from 'react'
// import { FaSquareFull } from "react-icons/fa";
import CountUp from 'react-countup';


const Counter = () => {
  return (
    <>
   <div className="row ">
      <div className="col-8 mx-auto">
        <div className="row text-center py-5">
          <div className="col-6 col-sm-3  mb-4">
            <img src="/c11.png" className="counter-img" alt="img1" />
            <p className="counter-number"><CountUp start={0} duration={7} end={560} />+</p>
            <p className="counter-text">Total Area Sq</p>
          </div>
          <div className="col-6 col-sm-3 mb-4">
            <img src="/c2.png" className="counter-img" alt="img2" />
            <p className="counter-number"><CountUp start={0} duration={7} end={197} />+</p>
            <p className="counter-text">Apartments Sold</p>
          </div>
          <div className="col-6 col-sm-3 mb-4">
            <img src="/c3.png" className="counter-img" alt="img3" />
            <p className="counter-number"><CountUp start={0} duration={7} end={268} />+</p>
            <p className="counter-text">Total Constructions</p>
          </div>
          <div className="col-6 col-sm-3 mb-4">
            <img src="/c4.png" className="counter-img" alt="img4" />
            <p className="counter-number"><CountUp start={0} duration={7} end={340} />+</p>
            <p className="counter-text">Apartio Rooms</p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Counter