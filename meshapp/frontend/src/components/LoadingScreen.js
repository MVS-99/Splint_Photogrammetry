import React from 'react'
import './LoadingScreen.css'

function LoadingScreen(){
    return(
        <div className='LoadingScreen'>
            <uc3mlogo />
            <h2> Procesando las imágenes...</h2>
            <p>Porfavor, se paciente, el proceso de computación puede tardar algunos minutos.<br/></p>
            <div className='spinner-container'>
                <div className='spinner'></div>
            </div>
            <div className='retopology-videos'>
                <p>Mientras esperas, puedes ver estos videos sobre retopología:</p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/-dc4KN2bdrw" title="Retopology Video 1" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/L_SdlR57NtU" title="Retopology Video 2" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
        </div>
    );
}

export default LoadingScreen;
