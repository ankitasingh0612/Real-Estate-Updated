import React from 'react'

const Testimonial = () => {
  return (
   
      <>

<div className="row py-5 background ">
  <div className="text-center ">
      <div className="tagline ">Our Testimonial</div>
      <h2 className="section-title">Clients Feedback</h2>
    </div>
     <div className="col-sm-10 mx-auto ">
        <div className="row py-3">
          <div className='col-12 col-md-4 mb-4'>
            <div className='card border-0 shadow-sm mx-auto rounded-3 p-3 h-100'>
              <span className='feedtop mb-3'><img src='/testimonial1.png' alt="quote"/></span>
              <p className='px-2 feedtext mb-4' style={{ fontSize: '14px' }}>Jacob was incredible from start to finish. He helped us find the perfect family home in just two weeks and negotiated a great deal.</p>
              <div className='row g-0 align-items-center mt-auto'>
                <div className='col-3'>
                  <img src='/3.jpg' className='img-fluid rounded-circle' alt="Jacob" />
                </div>
                <div className='col-9 ps-3'>
                  <b>Jacob William</b>
                  <p className='color1 m-0' style={{ fontSize: '11px' }}>SELLING AGENTS</p>
                </div>
              </div>
            </div>
          </div>
          <div className='col-sm-4 '>
            <div className='card border border-0 shadow-lg mx-auto rounded-3 p-3 feedcard w-76 pb-3'>
              <span className='feedtop'><img src='/testimonial1.png'/></span>
              <p className='px-3 feedtext'>Kelian made our relocation seamless. We were moving from out of state, and he went above and beyond to provide virtual tours and honest advice. He found us a beautiful property in a great neighborhood.</p>
              <div className='row g-0'>
                <div className='col-4'>
                  <img src='/4.jpg' className='img-fluid feedimg' />
                </div>
                <div className='col-8'>
                  <span>
                    <b>Kelian Anderson</b><br/>
                    <p className='color1'>SELLING AGENTS</p>
                  </span>
                </div>
              </div>
            </div>
          </div>
        <div className='col-sm-4 '>
            <div className='card border border-0 shadow-lg mx-auto rounded-3 p-3 feedcard w-76 pb-3'>
              <span className='feedtop'><img src='/testimonial1.png'/></span>
              <p className='px-3 feedtext'>Adam is an outstanding agent! He helped us sell our home above asking price and guided us through every step of the process. His marketing strategy and communication were spot-on.</p>
              <div className='row g-0'>
                <div className='col-4'>
                  <img src='/5.jpg' className='img-fluid feedimg' />
                </div>
                <div className='col-8'>
                  <span>
                    <b>Adam Joseph</b><br/>
                    <p className='color1'>SELLING AGENTS</p>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
</div>
 
  



    </>

  )
}

export default Testimonial