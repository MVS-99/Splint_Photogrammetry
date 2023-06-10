import React, { useEffect, useState } from 'react';
import './Tutorial.css';
import isoexplanation from "../assets/explanation_iso.jpg";

function Tutorial() {
  const [iframeStyle, setIframeStyle] = useState({});

  useEffect(() => {
    const footerHeight = document.querySelector('.footer').offsetHeight;
    const tutorialHeight = footerHeight * 2; // height is 1.25 times footer height
    const tutorialWidth = tutorialHeight * (16 / 9); // maintain 16:9 aspect ratio

    setIframeStyle({
      width: `${tutorialWidth}px`,
      height: `${tutorialHeight}px`,
    });
  }, []);

  return (
    <div className="tutorial">
        <h2 className="tutorial__title">Información:</h2>
        <p className="tutorial__text">
            Antes de subir las imágenes a nuestra aplicación es importante que te asegures de la calidad de las fotos: ¡Recuerda que la calidad es fundamental! <br />
            <br />
            Asegurate de equilibar los objetivos y las limitaciones del proyecto, como el tamaño de la escena, las propiedades de los materiales, la calidad de las texturas,
            y las condiciones de iluminación. Intenta capturar imágenes claras y de alto contraste. <br />
            <br />
            En cuanto a la iluminación, busca distribuciones uniformes de luz, que suelen dar mejores resultados con respecto a zonas con sombras muy marcadas o zonas muy iluminadas.
            Intenta evitar fotografiar superficies demasiado reflectantes o que carezcan de suficiente textura. <br />
            <br />
            Finalmente, fijate bien en los ajustes de la cámara cuando tomas la foto. Evita el desenfoque por movimiento utilizando trípodes o una velocidad de obturación rápida.
            Para garantizar una gran profundida de campo, intenta reducir el diafragma (f alta) y reducir el ajuste iso para limitar el ruido <br />
        </p>
        <img className="tutorial__image" src={isoexplanation} alt="Description" style={iframeStyle} />
        <p className='tutorial__text'>
            Una vez tus imágenes estén listas, subelas y el software de Meshroom se encargará del resto, ofreciendo varias opciones y configuraciones
            dependiendo de la información que respondas en el cuestionario y la que sea directamente procesada de las imágenes.
        </p>
        <h2 className="tutorial__title">Tutoriales:</h2>
        <iframe 
            className="tutorial__video"
            src="https://www.youtube.com/embed/k4NTf0hMjtY?start=114" 
            title="YouTube video player" 
            style={iframeStyle}
            allowFullScreen>
        </iframe>
    </div>
  );
}

export default Tutorial;

