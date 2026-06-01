import React from 'react';
import { LuPhoneCall } from "react-icons/lu";
import { BsEnvelope } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <footer className="footer-section">
        <div className="container">
          <div className="row gy-4">
            {/* Left Section: Logo & Info */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-logo mb-3">
                <img src="/favicon.png" alt="Logo" className="me-2" style={{ height: '32px' }} />
                <span className="brand-name">Quirex</span>
              </div>
              <p className="footer-desc">
                Leading the way in modern real estate solutions with premium properties and seamless management.
              </p>
              <div className="footer-contact mt-3">
                <p className="mb-2"><BsEnvelope className="me-2 accent-color" /> support@quirex.com</p>
                <p className="mb-2"><LuPhoneCall className="me-2 accent-color" /> +91 98765 43210</p>
                <p className="mb-0"><CiLocationOn className="me-2 accent-color" /> Lucknow, India</p>
              </div>
            </div>

            {/* Middle Section: Quick Links */}
            <div className="col-lg-4 col-md-6 text-lg-center">
              <h5 className="footer-title">Quick Links</h5>
              <ul className="footer-links list-unstyled">
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Right Section: User Account */}
            <div className="col-lg-4 col-md-6 text-lg-end">
              <h5 className="footer-title">User Account</h5>
              <ul className="footer-links list-unstyled">
                <li><Link to="/login">Login / My Account</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0">© {new Date().getFullYear()} Quirex. All Rights Reserved.</p>
            </div>
            <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
              <Link to="/privacy-policy" className="bottom-link">Privacy Policy</Link>
              <span className="separator mx-2">|</span>
              <Link to="/terms" className="bottom-link">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;