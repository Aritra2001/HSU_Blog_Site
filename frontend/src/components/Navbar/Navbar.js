import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
      <div className="nav">
        
        <img src={logo} alt="" srcset="" className='logo'/>
        
        <div className={`menu ${isOpen ? 'open' : ''}`}>
          <a href="#all-programs">All Programs</a>
          <a href="#institutions">Institutions</a>
          <a href="#about">About</a>
        </div>
        </div>
        <div className="instructor-button">
          <button>Become an Instructor</button>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;