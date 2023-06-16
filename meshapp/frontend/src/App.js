import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import Slideshow from "./components/Slideshow";
import "./App.css";
import Tutorial from "./components/Tutorial";
import WebFont from "webfontloader";
import {saveAs} from 'file-saver'


function App() {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lightingGrade, setLightingGrade] = useState(2);
  const [imagesUploaded, setImagesUploaded] = useState(false);
  const [photoRange, setPhotoRange] = useState(0);
  const [orientationChange, setOrientationChange] = useState(false);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Merriweather:400,700', 'serif']
      }
    })
  })

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length < 20) {
      alert("Please select 20 or more images.");
      return;
    }
    setSelectedFiles(files);
    const previewURLs = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviews(previewURLs);
    setImagesUploaded(true);

    if (files.length >= 20 && files.length <= 40) {
      setPhotoRange(0);
    } else if (files.length > 40 && files.length <= 60) {
      setPhotoRange(1);
    } else{
      setPhotoRange(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFiles) {
      alert("Please select images to upload.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file, index) => {
      formData.append(`file${index}`, file);
      formData.append("lightingGrade", lightingGrade);
      formData.append("orientationChange", orientationChange);
      formData.append("photoRange", photoRange);
    });

    try {
      const response = await axios.post("http://localhost:5000", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: 'blob',
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], {type: 'application/zip'});
        saveAs(blob, 'mesh.zip');

        setLoading(false);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setSelectedFiles(null);
          setPreviews([]);
          setImagesUploaded(false);
        }, 60000);
      }
    } catch (error) {
      setLoading(false);
      console.error(error)
      alert("An error occurred while processing the images. Please try again.");
    }
  };

  return (
    <div className="App">
      <Header />
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="content">
          {showSuccess ? (
            <div className="success-message">
              <h2>¡Se ha finalizado con exito!</h2>
              <p> Tú modelo tridimensional se ha generado con exito. Recuerda que para optimos resultados deberás utilizar herramientas de retopología<br></br></p>
            </div>
          ) : (
            <div className="upload-form-container">
              <form onSubmit={handleSubmit} className="upload-form">
                <input
                  type="file"
                  name="files"
                  id="files"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <label htmlFor="files" className="upload-label">
                  Choose Images
                </label>
                {selectedFiles && (
                  <div>
                    <p>¿Cómo calificarías la iluminación de las fotos?</p>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <input
                        type="range"
                        min="0"
                        max="4"
                        value={lightingGrade}
                        onChange={(e) => setLightingGrade(e.target.value)}
                        list="lighting-grades"
                      />
                      <datalist id="lighting-grades">
                        <option value="0" label="Muy oscuras"/>
                        <option value="1" />
                        <option value="2" />
                        <option value="3" />
                        <option value="4" label="Muy iluminadas"/>
                      </datalist>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Muy oscuras</span>
                        <span>Muy iluminadas</span>
                      </div>
                    </div>
                    <p><br></br>Rango de fotos:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        value={photoRange}
                        disabled
                        list="photo-ranges"
                      />
                      <datalist id="photo-ranges">
                        <option value="0" label="20-40"/>
                        <option value="1" label="40-60"/>
                        <option value="2" label="60+"/>
                      </datalist>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>20-40</span>
                        <span>40-60</span>
                        <span>60+</span>
                      </div>
                    </div>
                    <label>
                      <input
                        type="checkbox"
                        checked={orientationChange}
                        onChange={() => setOrientationChange(!orientationChange)}
                      />
                      ¿El data-set contienen fotos con distinta orientación?
                    </label>
                  </div>
                )}
                <button type="submit" className="upload-button">
                  Upload
                </button>
              </form>
              {previews.length > 0 && <Slideshow images={previews} />}
            </div>
          )}
        </div>
      )}
      {!imagesUploaded && <Tutorial />}
      <Footer />
    </div>
  );
}

export default App;