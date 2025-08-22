import React, { useState } from "react";
import Particles from "./assets/Particles/Particles";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Response from "./components/response";
import axios from 'axios'; // <-- Import axios

// --- HOME COMPONENT ---
const Home = () => {
  // Store the actual file object, not just the name
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const navigate = useNavigate();

  // const iconStyle = { width: "18px", height: "18px", marginLeft: "8px" };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the entire file
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a resume file first!");
      return;
    }

    setIsLoading(true); // Start loading

    // Use FormData to send the file
    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      // Make the API call to your backend
      const response = await axios.post("https://slay-my-cv.onrender.com/roast-resume", formData);
      
      // On success, navigate to the response page with the roast data
      navigate("/response", { state: { roastData: response.data.roast } });

    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage = error.response?.data?.error || "An unknown error occurred. Is the server running?";
      // On failure, navigate to the response page with an error message
      navigate("/response", { state: { error: errorMessage } });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="w-full h-screen relative text-white">
      {/* Background Particles */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-black">
        <Particles /* Your Particle props */ />
      </div>

      {/* Content */}
      <div className="hero w-full flex flex-col items-center justify-center h-screen gap-4 md:gap-8 px-4">
        {/* Navbar */}
        <div className="navbar fixed top-4 md:top-10 text-center left-0 right-0 p-2 md:p-4">
          <h1 className="logo font-extrabold text-3xl md:text-5xl border border-gray-50 rounded-2xl md:rounded-4xl p-2 w-11/12 md:w-2/3 mx-auto backdrop-blur-sm">
            SLAY MY CV
          </h1>
        </div>

        {/* Enhanced File Input */}
        <div className="file-upload-container relative">
          <label className="file-upload-label group cursor-pointer">
            <div className="file-upload-box">
              <div className="upload-icon-container">
                {selectedFile ? (
                  <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="upload-text">
                <h3 className="text-xl font-bold mb-2 text-white">
                  {selectedFile ? "File Selected!" : "Drop your CV here"}
                </h3>
                <p className="text-gray-300 mb-2">
                  {selectedFile ? selectedFile.name : "or click to browse"}
                </p>
                <p className="text-sm text-gray-400">
                  Supports PDF & DOCX files
                </p>
              </div>
              {!selectedFile && (
                <div className="upload-animation absolute inset-0 rounded-2xl border-2 border-dashed border-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.docx"
            />
          </label>
        </div>

        {/* Enhanced Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !selectedFile}
          className={`submit-button group relative overflow-hidden ${
            isLoading || !selectedFile
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 cursor-pointer transform hover:scale-105"
          } transition-all duration-300 px-4 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-white text-base md:text-lg shadow-lg mx-4 md:mx-0`}
        >
          <div className="flex items-center justify-center space-x-2">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Slaying your CV...</span>
              </>
            ) : (
              <>
                <span>🔥</span>
                <span>SLAY MY CV</span>
                <span>⚔️</span>
              </>
            )}
          </div>
          {!isLoading && selectedFile && (
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          )}
        </button>
      </div>
    </div>
  );
};


// --- APP ROUTER (No changes needed here) ---
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/response" element={<Response />} />
      </Routes>
    </Router>
  );
};

export default App;