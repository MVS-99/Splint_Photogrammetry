import React from 'react'
import Icon from '../assets/logoUC3M.png'
import './LoadingScreen.css'

function LoadingScreen(){
    return(
        <div className='LoadingScreen'>
            <Icon />
            <h2> Processing images...</h2>
            <p>Please be patient, this may take a few minutes.</p>
            <div className='LoadingCircle'></div>
        </div>
    );
}

export default LoadingScreen;
