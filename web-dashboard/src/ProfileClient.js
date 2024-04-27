import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBriefcase, faUsers, faSignOutAlt, faCog, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import logo from './QLOGO.png';
import './App.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useravatar from './ava.gif';
import usericon from './prof.gif';

function ProfileClient() {
  const [profilePicture, setProfilePicture] = useState(null);
  const [activeLink, setActiveLink] = useState('/accounts');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };
  const handleCancel = () => {
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { id } = useParams();
  const [values, setValues] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    user_id: '',
    email: '',
    password: '',
    account_type: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:8081/viewaccount/${id}`)
      .then(res => {
        console.log(res);
        setValues(res.data); 
        setProfilePicture(`http://localhost:8081/uploads/${res.data.image}`);
      })
      .catch(err => console.error(err));
  }, [id]);  
const renderProfilePicture = () => {
    if (profilePicture) {
      return (
        <div className="flex justify-center">
          <img src={profilePicture} alt="Profile" className="im" />
        </div>
      );
    } else {
      return (
        <div className="flex justify-center">
          <img src={useravatar} alt="Default Profile" className="im" />
        </div>
      );
    }
  };
  

  const handleUpdate = (event) => {
    event.preventDefault();
    console.log("Form values:", values);
    axios.put(`http://localhost:8081/updateaccount/${id}`, values)
      .then(res => {
        console.log(res.data);
        setSuccessMessage('Data Successfully Updated');
        setTimeout(() => {
          setSuccessMessage('');
          navigate('/accounts');
          window.location.reload();
        }, 2000);
      })
      .catch(err => console.log(err));
  };
  

  return (
    <div className="flex h-screen pagescreen">
      {/* Sidebar */}
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Edit form */}
        <div className="p-8">
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
          <header className="p-5 mt-[-10px] flex justify-between items-center">
      <img src={logo} className="w-64 h-17" alt="logo" /> 
      <h1 className="clientname">{/*{`${clientInfo.first_name || ''} ${clientInfo.middle_name ? clientInfo.middle_name + ' ' : ''}${clientInfo.last_name || ''}`}*/}</h1>
      <div className="flex items-center">
        {/* User icon with dropdown */}
        <div className="relative">
          <img
            src={usericon}
            className="usericon text-white text-2xl mr-4 cursor-pointer"
            alt="User Icon"
            onClick={toggleDropdown}
          />
          {showDropdown && (
                <div className="absolute right-0 mt-4 w-30 bg-white border border-gray-300 rounded shadow">
                  <Link to='/profileclient' className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200">
                    <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                    Profile
                  </Link>
                  <button className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Logout
                    </button>
                </div>
              )}
        </div>
        <p className="mr-5 font-semibold text-xl">{/*{loggedInUser ? loggedInUser.name : "Loading..."}*/}Client Name Sample</p>
      </div>
      
    </header>
          <form className="formedit" onSubmit={handleUpdate}>
            <div className="mb-4 ml-auto mr-auto">
              {/* Profile picture display */}
              {renderProfilePicture()}
              <label htmlFor="profilePicture" className="profilelbl block text-white font-semibold">Profile Picture</label>
              <input type="file" id="profilePicture" name="profilePicture" className="inputboxprofile mt-1 p-2 border rounded-lg" onChange={handleProfilePictureChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="first_name" className="block text-white font-semibold">First Name:</label>
                <input type="text" id="first_name" name="first_name" value={values.first_name} onChange={e => setValues({...values, first_name: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" />
              </div>
              <div className="mb-4">
                <label htmlFor="middleName" className="block text-white font-semibold">Middle Name:</label>
                <input type="text" id="middleName" name="middleName" value={values.middle_name} onChange={e => setValues({...values, middle_name: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" />
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-white font-semibold">Last Name:</label>
                <input type="text" id="lastName" name="lastName" value={values.last_name} onChange={e => setValues({...values, last_name: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" />
              </div>
              <div className="mb-4">
                <label htmlFor="suffix" className="block text-white font-semibold">Suffix:</label>
                <input type="text" id="suffix" name="suffix" value={values.suffix} onChange={e => setValues({...values, suffix: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-white font-semibold">Email:</label>
                <input type="text" id="email" name="email" value={values.email} onChange={e => setValues({...values, email: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" />
              </div>
              <div className="mb-4">
                <label htmlFor="contact" className="block text-white font-semibold">Contact Number:</label>
                <input type="number" id="contact" name="contact" value={values.contact} onChange={e => setValues({...values, contact: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" />
              </div>
              <div className="mb-4">
                <label htmlFor="username" className="block text-white font-semibold">Username:</label>
                <input type="text" id="username" name="username" value={values.user_id} onChange={e => setValues({...values, user_id: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-white font-semibold">Password:</label>
                <input type="password" id="password" name="password" value={values.password} onChange={e => setValues({...values, password: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" />
              </div>
            </div>
            <div className="buttonfunction flex justify-end">
              {/*<Link to={'/accounts'} onClick={handleCancel} className="mr-8 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded">Cancel</Link>*/}
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileClient;