import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import "./App.css";
import Navbar from "./components/Navbar";
import AllUploads from "./components/AllUploads";

const App = () => {
 
  return (
    <Router>
      <div>
        <Navbar />
        <div className="container mt-4">
          <h4 className="display-4 text-center mb-2">
            <i className="fab fa-react" /> React File Upload
          </h4>
        </div>
        
          <div className="container" style={{width: '60%', marginTop: '0'}}>
        <Routes>

          <Route exact path="/" element={<FileUpload />} />
          <Route exact path="/uploads" element={<AllUploads />} />
        </Routes>
          </div>
    
      </div>
    </Router>
  );
};

export default App;
