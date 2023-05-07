import React, { useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import Slideshow from "./components/Slideshow";
import "./App.css";

function App() {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length < 20) {
      alert("Please select 20 or more images.");
      return;
    }
    setSelectedFiles(files);
    const previewURLs = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviews(previewURLs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFiles) {
      alert("Please select images to upload.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setLoading(false);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setSelectedFiles(null);
          setPreviews([]);
        }, 60000);
      }
    } catch (error) {
      setLoading(false);
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
              <h2>Success!</h2>
              <p>Your 3D mesh has been generated successfully. It will be downloaded shortly.</p>
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
                <button type="submit" className="upload-button">
                  Upload
                </button>
              </form>
              {previews.length > 0 && <Slideshow images={previews} />}
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;