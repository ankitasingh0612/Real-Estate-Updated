import React from 'react'
import NavBar from './NavBar'
const About = () => {
  return (<>
        <NavBar/>
     <div className="listing-container">
      <div className="left-column">
        <button className="about-us">About Us</button>
        <h1 className="title">Today Sells Properties</h1>
        <p className="description">
           Our team specializes in helping you find the perfect property, whether you’re buying your first home, upgrading to your dream residence, investing in income properties, or selling your current home for top value.
        </p>

        <ul className="features-list">
          <h5><b>Why Choose Us?</b></h5>
          <li>✅ Expert local agents with years of experience</li>
          <li>✅ Honest advice and personalized service</li>
          <li>✅ Honest advice and personalized service</li>
          <li>✅ Full-service support from start to finish</li>
        </ul>

        <div className="property-details">
          <div><strong>3</strong> 🛏 Bedrooms</div>
          <div><strong>2</strong> 🛁 Bathrooms</div>
          <div><strong>2</strong> 🚗 Car parking</div>
          <div><strong>3450</strong> 📏 square Ft</div>
        </div>

        <div className="image-row">
          <img src="/e.jpeg" alt="house 1" />
          <img src="/f.jpeg" alt="house 2" />
          <img src="/h.jpeg" alt="house 3" />
           <img src="/2.jpg" alt="house 4" />
            <img src="/1.jpg" alt="house 5" />
        </div>
      </div>

      <div className="right-column">
        <img src="/8.jpg" alt="main interior" className="main-image" />
        <div className="sub-images">
          <img src="/7.jpg" alt="interior 1" />
          <img src="/6.jpg" alt="house front" />
        </div>
      </div>
    </div>
    </>
  )};


export default About