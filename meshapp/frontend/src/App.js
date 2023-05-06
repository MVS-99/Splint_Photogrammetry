import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import Footer from './components/Footer';

function App() {
    // Crear variables de estado para los siguientes procesos:
    // Obtener/Manipular las imágenes
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([])

    // Estados correspondientes a carga, procesado y finalización satisfactoria
    // Previsiblemente, el usuario va a estar esperando en un ratio inversamente proporcional
    // al poder de computación del servidor cloud. Por lo que he decidido
    // crear diversas etapas para amenizar el proceso, visualmente.
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Función -> Manejar la selección de archivos
    const handleFileInputChange = (e) => {
        const files = e.target.files;

        if (files.length < 10) {
            alert('Please select at least 10 images');
            return;
        }

        setSelectedFiles(files)
        
        setPreviews(Array.from(files).map((file) => URL.createObjectURL(file)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsProcessing(true);

        const formData = new FormData();

        for (const file of selectedFiles) {
          formData.append('files', file);
        }

        try {
          await axios.post('http://localhost:5000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            setIsProcessing(false);
          }, 60000);
        } catch (error) {
          console.error('Error uploading files:', error);
          setIsProcessing(false);
          alert('An error occurred while processing the images. Please try again.');
        }
    };
    return (
        <div className="App">
            <Header />
            <h1 className="App-title">UC3M Meshroom 3D Conversion</h1>
            <input
                type="file"
                name="file"
                id="file"
                multiple
                onChange={handleFileInputChange}
            />
            <button onClick={handleSubmit} disabled={isProcessing || selectedFiles.length === 0}>
                {isProcessing ? 'Processing...' : 'Upload Images'}
            </button>
        <div className="image-previews">
            {previews.map((preview, index) => (
                <img key={index} src={preview} alt={`Preview ${index + 1}`} className="image-preview" />
            ))}
        </div>
        {isSuccess && (
            <div className="success-message">
                <p>Success! Your 3D mesh has been generated and downloaded.</p>
                <p>You will be redirected to the initial screen in a moment.</p>
            </div>
        )}
        {isProcessing && <LoadingScreen />}
        <Footer />
        </div>
    );
}

export default App;
