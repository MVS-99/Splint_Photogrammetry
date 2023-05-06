import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <p>© Manuel Vallejo Sabadell</p>
      <p>Powered by <span className="trademark">React™</span>, <span className="trademark">Meshroom™</span>, and <span className="trademark">Flask™</span></p>
      <p>MIT License</p>
    </div>
  );
};

export default Footer;

