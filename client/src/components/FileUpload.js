import React, { Fragment, useState } from 'react';
import axios from 'axios';
import Message from './Message';
import Progress from './Progress';
const { z } = require("zod");



const FileUpload = (props) => {
  // <<<<<<<<<<<= States =>>>>>>>>>
  const [file, setFile] = useState('')
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [filePreview, setFilePreview] = useState(null); // State to store file preview URL

  // <<<<<<<<<<<= Functions =>>>>>>>>>
  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);

    generateFilePreview(e.target.files[0]);
  };

  const fileExtensionSchema = z.enum(["jpg", "jpeg", "png", "gif", "zip", 'exe']); // Add supported file extensions here

  const validateFileExtension = (fileName) => {
    const fileExtension = fileName.split('.').pop().toLowerCase(); // Extract file extension
    try {
      fileExtensionSchema.parse(fileExtension); 
      return true; 
    } catch (error) {
      return false; 
    }
  };

  const generateFilePreview = (file) => {
    const reader = new FileReader();

    reader.onload = () => {
      setFilePreview(reader.result); // Set file preview URL
    };

    if (file) {
      reader.readAsDataURL(file); // Read file as data URL for image previews
    }
  };

  const checkFileExists = async (fileName) => {
    try {
      const res = await axios.get(`http://localhost:5000/checkFileExists/${fileName}`);
      return res.data.exists; // Assuming the server returns an object with a boolean property 'exists'
    } catch (err) {
      console.error('Error checking file existence:', err);
      return false; // Assume file doesn't exist if there's an error
    }
  };

  // <<<<<<<<<<<= upload Function =>>>>>>>>>

  const onSubmit = async e => {
    e.preventDefault();

    // Check if a file is selected
    if (!file) {
      showAlert('Please select a file.', 'danger');
      return;
    }

    // Check if the file extension is valid
    if (!validateFileExtension(file.name)) {
      showAlert('Invalid file format. Supported formats are JPG, JPEG, PNG, GIF, and ZIP.', 'danger');
      return;
    }

    // Check if file already exists on the server
    const fileExists = await checkFileExists(file.name);
    if (fileExists) {
      showAlert('File already exists on the Uploads.', 'danger');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)))
        }
      });
      
      setTimeout(() => setUploadPercentage(0), 5000);
      // Clear percentage
      
      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
      showAlert('File Uploaded', 'info');
    } catch (err) {
      if (err.response && err.response.status === 500) {
        showAlert('There was a problem with the server', 'danger');
      } else {
        showAlert('There is no File for Upload. Please select a file.', 'danger');
        console.error(err); // Log the error for debugging purposes
      }
    }
  };

  
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
  };

  return (
    <Fragment>
      <Message alert={alert} />
      <form id='filediv' onSubmit={onSubmit}>
        <div className='custom-file mt-4 mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>
        <Progress className='mt-4' percentage={uploadPercentage} />

        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>
      {/* Render file preview only if file is uploaded */}
      {uploadedFile.fileName && (
        <div className="row mt-5">
          <div className="col-md-6 m-auto"> 
            <h3 className="text-center">{uploadedFile.fileName}</h3>
            <img src={uploadedFile.filePath} style={{ width: '100%' }} alt="" />
          </div>
        </div>
      )}
      {/* Render file preview based on filePreview state */}
      {filePreview && !uploadedFile.fileName && (
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h3 className="text-center">File Preview</h3>
            {/* Render file preview */}
            {filePreview.startsWith("data:image/") ? (
              <img src={filePreview} style={{ width: '100%' }} alt="" />
            ) : (
              <img style={{ width: '50%' }}  src={'./preview.png'} alt='' />
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default FileUpload;
