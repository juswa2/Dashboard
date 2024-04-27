import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './AddAccountModal.css';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const AddAccountModal = ({ isOpen, onClose }) => {
  const [photo, setPhoto] = useState();
  const [values, setValues] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    username: '',
    pnumber: '',
    fb: '',
    email: '',
    password: '',
    account_type: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handlePhoto = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/accounts', values)
      .then(res => {
        console.log(res);
        if (res.data.status === "Success") {
          handlePhotoUpload(res.data.id);
          setSuccessMessage('Account Successfully Added');
          setTimeout(() => {
            setSuccessMessage('');
            window.location.reload();
          }, 2000);
        } else {
          console.log("Failed to add account");
        }
      })
      .catch(err => console.log(err));
  };

  const handlePhotoUpload = (accountId) => {
    const formdata = new FormData();
    formdata.append('image', photo);
    formdata.append('accountId', accountId);
    axios.post('http://localhost:8081/photoupload', formdata)
      .then(res => {
        if (res.data.status === "Success") {
          console.log("Data Successfully Added");
        } else {
          console.log("Failed");
        }
      })
      .catch(err => console.log(err));
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50" style={{zIndex: "15"  }}>
      <div className="pagedesign bg-white p-7 rounded-lg relative">
        <FontAwesomeIcon
          icon={faTimes}
          className="closeicon absolute top-0 right-0 m-4 text-white cursor-pointer"
          onClick={onClose}
        />
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <h2 className="addlabel text-xl font-semibold mb-4">Add Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-3 -mb-1">
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label htmlFor="first_name" className="labelinput block text-white text-sm font-bold mb-2">First Name:</label>
              <input id="firstName" type="text" onChange={e => setValues({ ...values, first_name: e.target.value })} className="capitalize shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label htmlFor="middle_name" className="labelinput block text-white text-sm font-bold mb-2">Middle Name:</label>
              <input id="middleName" type="text" onChange={e => setValues({ ...values, middle_name: e.target.value })} className="capitalize shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-1">
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label htmlFor="last_name" className="labelinput block text-white text-sm font-bold mb-2">Last Name:</label>
              <input id="lastName" type="text" onChange={e => setValues({ ...values, last_name: e.target.value })} className="capitalize shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6">
              <label htmlFor="suffix" className="labelinput block text-white text-sm font-bold mb-2">Suffix:</label>
              <input id="suffix" type="text" onChange={e => setValues({ ...values, suffix: e.target.value })} className="capitalize shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-1">
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label htmlFor="email" className="labelinput block text-white text-sm font-bold mb-2">Email:</label>
              <input id="email" type="email" onChange={e => setValues({ ...values, email: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label htmlFor="pnumber" className="labelinput block text-white text-sm font-bold mb-2">Phone #:</label>
              <input id="pnumber" type="telephone" onChange={e => setValues({ ...values, pnumber: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label htmlFor="fb" className="labelinput block text-white text-sm font-bold mb-2">FB Account:</label>
              <input id="fb" type="text" onChange={e => setValues({ ...values, fb: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-1">
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label htmlFor="username" className="labelinput block text-white text-sm font-bold mb-2">Username:</label>
              <input id="username" type="text" onChange={e => setValues({ ...values, username: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label htmlFor="password" className="labelinput block text-white text-sm font-bold mb-2">Password:</label>
              <input id="password" type="password" onChange={e => setValues({ ...values, password: e.target.value })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
          </div>
          
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label htmlFor="accountType" className="labelinput block text-white text-sm font-bold mb-2">Account Type:</label>
              <select
  id="accountType"
  className="accntype shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  onChange={e => setValues({ ...values, account_type: e.target.value })}
  value={values.account_type}
>
  <option value="" disabled>Select Type</option>
  <option value="1">Admin</option>
  <option value="2">Staff</option>
  <option value="3">Client</option>
  <option value="4">Retainer</option>
</select>

            </div>
            <div className="w-full md:w-1/2 px-3 mb-6">
            <label className="labelinput block text-white text-sm font-bold mb-2">Profile Picture:</label>
            <input type="file" onChange={handlePhoto} className=""/>
            </div>
          </div>
          
          {/* Add more input fields for other details */}
          <button type="submit" onClick={handlePhotoUpload} className="savebutton bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded float-right">
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;
