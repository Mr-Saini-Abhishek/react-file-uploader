import React, { useEffect, useState } from "react";
import axios from "axios";

const AllUploads = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/uploads"); // Replace "/api/uploads" with your backend endpoint
        setUploadedFiles(response.data); // Assuming the response.data is an array of objects containing file name and path
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);
  return (
    <>
        <h2  className='mt-4' style={{width: '100%', textAlign: 'center', marginBottom: '4rem'}}>Uploaded Files</h2>
      <div className="row">
      {uploadedFiles.map((file) => (
          <div key={file.fileName} className="col-md-4 mb-4">
          <div className="card" style={{border: '0.2px solid black'}}>
            <img
              src={`/uploads/${file.fileName}`} // Assuming this is the path to the image file
              className="card-img-top"
              alt={file.fileName} // Assuming this is the name of the image file
              />
            <div className="card-body">
              <h5 className="card-title">{file.fileName}</h5>
            </div>
          </div>
        </div>
      ))}
    </div>
      </>
  );
};

export default AllUploads;
