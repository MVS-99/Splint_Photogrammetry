import React from 'react';
import uc3mlogo from '../assets/logoUC3M.png';
import './Header.css';
import meshroomLogo from '../assets/logo_meshroom.png';

function Header() {
    return (
        <header className='Header'>
            <img src={uc3mlogo} alt = "UC3M Logo" className = "UC3MLogo"/>
            <div className="Separator"></div>
            <img src={meshroomLogo} alt="Meshroom Logo" className = "MeshroomLogo" />
            <h1 className='AppTitle'>UC3M Meshroom 3D Conversion</h1>
        </header>
    );
}

export default Header;
