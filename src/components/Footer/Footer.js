import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="subscribe">
        <div className="footer-subscribe">
          <input type="email" placeholder="Enter your email" className="footer-input" />
          <button className="footer-button">Subscribe</button>
          </div>
          <div className="footer-social-media">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <i className="fab fa-linkedin-in"></i>
          </a>
          </div>
          </div>
       
        
        <div className="footer-links">
          <div className="footer-column">
            <h4 className="footer-label">Domain</h4>
            <a href="#domain1" className="footer-link">Aerospace</a>
            <a href="#domain2" className="footer-link">AI/ ML</a>
            <a href="#domain3" className="footer-link">Astrobiology</a>
            <a href="#domain4" className="footer-link">Astronomy</a>
            <a href="#domain5" className="footer-link">Space Law</a>
          </div>
          <div className="footer-column">
            <h4 className="footer-label">Learners Club</h4>
            <a href="#club1" className="footer-link">Free Workshops</a>
            <a href="#club2" className="footer-link">Blogs</a>
            <a href="#club3" className="footer-link">Resources</a>
            <a href="#club4" className="footer-link">Training Programs</a>
          </div>
          <div className="footer-column">
            <h4 className="footer-label">Quick Links</h4>
            <a href="#quick1" className="footer-link">Apply as Mentor</a>
            <a href="#quick2" className="footer-link">For Institutions</a>
            <a href="#quick3" className="footer-link">Contact Us</a>
          </div>
          <div className="footer-column">
            <h4 className="footer-label">Company</h4>
            <a href="#company1" className="footer-link">About Us</a>
            <a href="#company2" className="footer-link">Careers</a>
            <a href="#company3" className="footer-link">Press</a>
          </div>
        </div>
      </div>
      <div className="footer-rights">
        &copy; {new Date().getFullYear()} Hextar. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
