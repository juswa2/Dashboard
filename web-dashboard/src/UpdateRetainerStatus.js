import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './AddCaseModal.css'; // Assuming you have a separate CSS file for this component
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import useIsPhone from './useIsPhone'; // Assuming you have this hook

const UpdateRetainerStatus = ({ isOpen, onClose, retainerCaseId }) => {
  const [file, setFile] = useState(null);
  const [values, setValues] = useState({
    status: '',
    date: new Date().toISOString().split('T')[0],
  });

  const isPhone = useIsPhone(); // Assuming you have this hook

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const [successMessage, setSuccessMessage] = useState('');

  const capitalizeWords = (string) => {
    return string.replace(/\b\w/g, char => char.toUpperCase());
  };

  const capitalizedValues = {
    ...values,
    status: capitalizeWords(values.status)
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('status', capitalizedValues.status);
    formData.append('date', values.date);
    formData.append('retainer_case_id', retainerCaseId);
    formData.append('file', file);

    axios.post('http://localhost:8081/addretainerstatus', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        if (res.data.status === "Success") {
          setSuccessMessage('Status/File Successfully Added');
          setTimeout(() => {
            setSuccessMessage('');
            window.location.reload();
          }, 2000);
        } else {
          console.log("Failed to add case");
        }
      })
      .catch(err => console.log(err));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-[-20%] backdrop-blur-sm" style={{ zIndex: "1" }}>
      <div className="pagedesign bg-white p-8 rounded-lg relative" style={{ width: isPhone ? '80%' : '', height: isPhone ? '60%' : '' }}>
        <FontAwesomeIcon
          icon={faTimes}
          className="closeicon absolute top-0 right-0 m-4 text-white cursor-pointer"
          onClick={onClose}
        />
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <h2 className="addlabel text-xl font-semibold mb-4">Case Title</h2>
        <form onSubmit={handleSubmit}>
          <div className="formbox">
            <div className="flex flex-wrap justify-between">
              <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                <label className="labelinput block text-white text-sm font-bold mb-2">Status:</label>
                <input type="text" onChange={e => setValues({ ...values, status: e.target.value })} className="txtbox capitalize shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" required />
              </div>
            </div>
            <div className="flex flex-wrap justify-between">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="labelinput block text-white text-sm font-bold mb-2" style={{marginTop: isPhone ? '-20px' : ''}}>File:</label>
                <input type="file" onChange={handleFileChange} className="filebox capitalize shadow appearance-none border rounded w-full py-2 px-3 bg-white text-black leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
              <label className="labelinput block text-white text-sm font-bold mb-2" style={{marginTop: isPhone ? '-10px' : ''}}>Date:</label>
                <input type="date" value={values.date} onChange={e => setValues({ ...values, date: e.target.value })} className="datebox shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 mb-7 mr-8">
            <button type="submit" className="savebutton bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRetainerStatus;
