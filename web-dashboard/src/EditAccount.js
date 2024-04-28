import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBriefcase, faUsers, faUserCircle, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from './QLOGO.png';
import './App.css';
import usericon from './prof.gif';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useravatar from './ava.gif';

function EditAccount() {
  const [profilePicture, setProfilePicture] = useState(null);
  const [activeLink, setActiveLink] = useState('/accounts');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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
    username: '',
    email: '',
    pnumber: '',
    fb: '',
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

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    setConfirmLogout(true);
  };

  const handleConfirmLogout = () => {
    axios.get('http://localhost:8081/logout')
    .then(res => {
      window.location.reload();
    })
    .catch(err => console.log(err))
  }

  const handleCancelLogout = () => {
    setConfirmLogout(false);
  };

  const [userData, setUserData] = useState(null);
    
      axios.defaults.withCredentials = true;
      
      useEffect(() => {
        axios.get('http://localhost:8081/session')
          .then(res => {
            if (res.data.valid) {
              console.log("User data from response:", res.data.userData);
              setUserData(res.data.userData);
            } else {
              console.log("Redirecting to login page");
              navigate('/');
            }
          })
          .catch(err => console.log(err));
      }, []);
  

  return (
    <div className="flex h-screen pagescreen">
      {/* Sidebar */}
      <div className="bg-gray-800 w-64 navbar">
        <div className="flex items-center justify-center h-20 bg-black">
          <img src={logo} className="h-17 w-auto" alt="logo" />
        </div>
        <nav className="mt-10">
          <Link to='/dashboard' onClick={() => handleLinkClick('/dashboard')} className={`buttonnav1 flex items-center py-5 px-4 ${activeLink === '/' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}>
            <FontAwesomeIcon icon={faHome} className="mr-2 sidebaricon" />
            <span className="ml-2 sidebar-label">Dashboard</span>
          </Link>
          <Link to='/clients' onClick={() => handleLinkClick('/clients')} className={`buttonnav2 flex items-center py-5 px-4 ${activeLink === '/clients' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}>
            <FontAwesomeIcon icon={faUser} className="mr-2 sidebaricon" />
            <span className="ml-2 sidebar-label">Clients</span>
          </Link>
          <Link to='/retainers' onClick={() => handleLinkClick('/retainers')} className={`buttonnav3 flex items-center py-5 px-4 ${activeLink === '/retainers' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}>
            <FontAwesomeIcon icon={faBriefcase} className="mr-2 sidebaricon" />
            <span className="ml-2 sidebar-label">Retainers</span>
          </Link>
          <Link to='/accounts' onClick={() => handleLinkClick('/accounts')} className={`buttonnav4 flex items-center py-5 px-4 ${activeLink === '/accounts' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}>
            <FontAwesomeIcon icon={faUsers} className="mr-2 sidebaricon" />
            <span className="ml-2 sidebar-label">Accounts</span>
          </Link>
        </nav>
      </div>
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-black bg-opacity-40" style={{zIndex: "15" }}>
        <header className="p-5 flex justify-between items-center">
          <p className="text-xl font-semibold">List of Accounts</p>
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
                  <button className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200">
                    <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                    Profile
                  </button>
                  <button className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faCog} className="mr-2" />
                    Settings
                  </button>
                  <button className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Logout
                    </button>
                </div>
              )}
            </div>
            {userData && <p className="mr-5 font-semibold text-s">{userData.first_name} {userData.middle_name} {userData.last_name}</p>}
          </div>
        </header>
    </div>
        {/* Edit form */}
        <div className="p-8">
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
          <h2 className="text-xl font-semibold mb-4">Edit Account</h2>
          <form className="formedit" onSubmit={handleUpdate}>
            <div className="mb-4 pb1">
              {/* Profile picture display */}
              {renderProfilePicture()}
              <label htmlFor="profilePicture" className="profilelbl block text-white font-semibold">Profile Picture</label>
              <input type="file" id="profilePicture" name="profilePicture" className="inputboxprofile mt-1 p-2 border rounded-md" onChange={handleProfilePictureChange} />
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
                <label htmlFor="username" className="block text-white font-semibold">Username:</label>
                <input type="text" id="username" name="username" value={values.username} onChange={e => setValues({...values, username: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-white font-semibold">Email:</label>
                <input type="text" id="email" name="email" value={values.email} onChange={e => setValues({...values, email: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" />
              </div>
              <div className="mb-4">
                <label htmlFor="pnumber" className="block text-white font-semibold">Phone #:</label>
                <input type="telephone" id="pnumber" name="pnumber" value={values.pnumber} onChange={e => setValues({...values, pnumber: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" />
              </div>
              <div className="mb-4">
                <label htmlFor="fb" className="block text-white font-semibold">FB Account:</label>
                <input type="text" id="fb" name="fb" value={values.fb} onChange={e => setValues({...values, fb: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-white font-semibold">Password:</label>
                <input type="password" id="password" name="password" value={values.password} onChange={e => setValues({...values, password: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" />
              </div>
              <select
  id="accountType"
  className="accntype selectField shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  onChange={e =>
    setValues(prevValues => ({
      ...prevValues,
      account_type: e.target.value
    }))
  }
  value={values.account_type}
>
  <option value="" disabled>Select Type</option>
  <option value="1">Admin</option>
  <option value="2">Staff</option>
  <option value="3">Client</option>
  <option value="4">Retainers</option>
</select>

            </div>
            <div className="buttonfunction flex justify-end">
              <Link to={'/accounts'} onClick={handleCancel} className="mr-8 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded">Cancel</Link>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded">Update</button>
            </div>
          </form>
        </div>
        {confirmLogout && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-md">
            <p className="text-black mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-center">
              <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={handleConfirmLogout}>Yes</button>
              <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={handleCancelLogout}>No</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditAccount;