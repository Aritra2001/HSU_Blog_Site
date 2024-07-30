import axios from 'axios';
import React, { useState } from 'react';
import './Footer.css';

function Footer() {
  const [email, setEmail] = useState('');

  const handleSub = async () => {
    try {
      const response = await axios.post("https://hsu-blog-site.onrender.com/api/subscribe", { email });
      if (response.status === 200) {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="subscribe">
          <div className="footer-subscribe">
            <input
              type="email"
              placeholder="Enter your email"
              className="footer-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="footer-button" onClick={handleSub}>Subscribe</button>
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
            <a href="https://hexstaruniverse.com/all-classes/?keyword=&tutor-course-filter-category=19&course_filter=true&loop_content_only=false&column_per_row=3&course_per_page=12&show_pagination=false&current_page=1&action=tutor_course_filter_ajax" className="footer-link">Aerospace</a>
            <a href="https://hexstaruniverse.com/all-classes/" className="footer-link">AI/ ML</a>
            <a href="https://hexstaruniverse.com/all-classes/?loop_content_only=false&column_per_row=3&course_per_page=12&show_pagination=false&keyword=&tutor-course-filter-category=107&course_filter=true&loop_content_only=false&column_per_row=3&course_per_page=12&show_pagination=false&current_page=1&action=tutor_course_filter_ajax" className="footer-link">Astrobiology</a>
            <a href="https://hexstaruniverse.com/all-classes/" className="footer-link">Astronomy</a>
            <a href="https://hexstaruniverse.com/all-classes/?loop_content_only=false&column_per_row=3&course_per_page=12&show_pagination=false&keyword=&tutor-course-filter-category=106&course_filter=true&loop_content_only=false&column_per_row=3&course_per_page=12&show_pagination=false&current_page=1&action=tutor_course_filter_ajax" className="footer-link">Space Law</a>
          </div>
          <div className="footer-column">
            <h4 className="footer-label">Learners Club</h4>
            <a href="https://lu.ma/hsuworkshops" className="footer-link">Free Workshops</a>
            <a href="https://hexstaruniverse.com/blog/" className="footer-link">Blogs</a>
            <a href="#club3" className="footer-link">Resources</a>
            <a href="https://hexstaruniverse.com/course-category/aerospace-engineering/?loop_content_only=false&column_per_row=3&course_per_page=12&show_pagination=false&keyword=&tutor-course-filter-category=109&course_filter=true&loop_content_only=false&column_per_row=3&course_per_page=12&show_pagination=false&current_page=1&action=tutor_course_filter_ajax" className="footer-link">Training Programs</a>
          </div>
          <div className="footer-column">
            <h4 className="footer-label">Quick Links</h4>
            <a href="https://hexstaruniverse.com/sign-up/" className="footer-link">Apply as Mentor</a>
            <a href="https://hexstaruniverse.com/for-institutions/" className="footer-link">For Institutions</a>
            <a href="https://api.whatsapp.com/send?phone=918910123832&text=Hi%20I%20want%20know%20more%20about%20Hex-Star%20Universe." className="footer-link">Contact Us</a>
          </div>
          <div className="footer-column">
            <h4 className="footer-label">Company</h4>
            <a href="https://hexstaruniverse.com/about-us-2/" className="footer-link">About Us</a>
            <a href="https://hexstaruniverse.com/careers/" className="footer-link">Careers</a>
            <a href="" className="footer-link">Press</a>
          </div>
        </div>
      </div>
      <div className="footer-rights">
        &copy; {new Date().getFullYear()} Hexstar. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
