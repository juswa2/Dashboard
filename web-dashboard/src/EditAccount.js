import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBriefcase, faUsers, faUserCircle, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from './QLOGO.png';
import './App.css';
import usericon from './prof.gif';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useravatar from './ava.gif';
import useIsPhone from './useIsPhone';

function EditAccount() {
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [activeLink, setActiveLink] = useState('/accounts');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const isPhone = useIsPhone();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handlephotoupdate = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        setProfilePictureFile(file);
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
        <div className="flex justify-center" style={{marginLeft: isPhone ? '12%' : ''}}>
          <img src={profilePicture} alt="Profile" className="im" />
        </div>
      );
    } else {
      return (
        <div className="flex justify-center" style={{marginLeft: isPhone ? '12%' : ''}}>
          <img src={useravatar} alt="Default Profile" className="im" />
        </div>
      );
    }
  };

const handleUpdate = async (event) => {
  event.preventDefault();
  console.log("Form values:", values);

  try {
    if (profilePictureFile) {
      const formData = new FormData();
      formData.append('accountId', id);
      formData.append('image', profilePictureFile);
      const uploadResponse = await axios.post(`http://localhost:8081/photoupdate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      values.image = uploadResponse.data.image;
    }
    const response = await axios.put(`http://localhost:8081/updateaccount/${id}`, values);
    console.log(response.data);
    setSuccessMessage('Data Successfully Updated');
    setTimeout(() => {
      setSuccessMessage('');
      navigate('/accounts');
      window.location.reload();
    }, 2000);
  } catch (error) {
    console.error("Error updating account:", error);
  }
};

  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setShowDropdown(false);
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
          if (res.data.userData.account_type !== 1) {
            navigate('/');
          }
        } else {
          console.log("Redirecting to login page");
          navigate('/');
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, '');
    const truncatedValue = inputValue.slice(0, 11);
    setValues(prevState => ({ ...prevState, pnumber: truncatedValue }));
  };

  const handleCancel = () => {
  };

  const getInitials = (firstName, middleName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const middleInitial = middleName ? middleName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${middleInitial}${lastInitial}`;
  };

  const yearToday = new Date().getFullYear();

  return (
    <div className="flex flex-col md:flex-row h-screen pagescreen">
      <div className="bg-gray-800 w-full md:w-64 navbar md:flex flex-col hidden">
        <div className="flex items-center justify-center h-20 bg-black">
          <img src={logo} className="h-17 w-auto" alt="logo" title={`Developed by:\nCHMSU Interns 2024\nJoshua Maquimot\nReggie Macariola\nJhelyn Joy Alo\nKriza Maeville Ejurango`}/>
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
          {!isPhone && (
          <footer className="px-1 py-1 text-center mt-[20vw]" style={{ fontSize: '12px', fontWeight: '100' }} title={`Developed by:\nCHMSU Interns 2024\nJoshua Maquimot\nReggie Macariola\nJhelyn Joy Alo\nKriza Maeville Ejurango`}>
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="10" 
              height="10" 
              fill="white" 
              viewBox="0 0 512 512"
            >
              <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM199.4 312.6c-31.2-31.2-31.2-81.9 0-113.1s81.9-31.2 113.1 0c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9c-50-50-131-50-181 0s-50 131 0 181s131 50 181 0c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0c-31.2 31.2-81.9 31.2-113.1 0z"/>
            </svg>
            {yearToday} Copyright: Quilaton Law Office
          </p>
        </footer>
          )}
        </nav>
      </div>
      <div className="md:hidden bg-gray-800 w-full fixed bottom-0 left-0 z-20 flex items-center justify-between">
        <Link to='/dashboard' onClick={() => handleLinkClick('/dashboard')} className={`flex flex-col items-center py-5 px-10 ${activeLink === '/dashboard' ? 'bg-gray-700' : ''}`}>
          <FontAwesomeIcon icon={faHome} className="text-white" />
          <span className="text-white text-xs hidden">Dashboard</span>
        </Link>
        <Link to='/clients' onClick={() => handleLinkClick('/clients')} className={`flex flex-col items-center py-5 px-10 ${activeLink === '/clients' ? 'bg-gray-700' : ''}`}>
          <FontAwesomeIcon icon={faUser} className="text-white" />
          <span className="text-white text-xs hidden">Clients</span>
        </Link>
        <Link to='/retainers' onClick={() => handleLinkClick('/retainers')} className={`flex flex-col items-center py-5 px-10 ${activeLink === '/retainers' ? 'bg-gray-700' : ''}`}>
          <FontAwesomeIcon icon={faBriefcase} className="text-white" />
          <span className="text-white text-xs hidden">Retainers</span>
        </Link>
        <Link to='/accounts' onClick={() => handleLinkClick('/accounts')} className={`flex flex-col items-center py-5 px-10 ${activeLink === '/accounts' ? 'bg-gray-700' : ''}`}>
          <FontAwesomeIcon icon={faUsers} className="text-white" />
          <span className="text-white text-xs hidden">Accounts</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-black bg-opacity-40" style={{zIndex: "15" }}>
          <header className="p-5 flex justify-between items-center" style={{marginBottom: isPhone ? '-5%' : ''}}>
            <p className="text-xl font-semibold">Edit Account</p>
            <div className="flex items-center">
              <div className="relative" ref={dropdownRef}>
              {userData && userData.image ? (
                  <img
                    src={`http://localhost:8081/uploads/${userData.image}`}
                    className="usericon text-white text-2xl mr-4 cursor-pointer rounded-full"
                    alt="User Icon"
                    onClick={toggleDropdown}
                  />
                ) : (
                  <img
                    src={usericon}
                    className="usericon text-white text-2xl mr-4 cursor-pointer rounded-full"
                    alt="User Icon"
                    onClick={toggleDropdown}
                  />
                )}
                {showDropdown && (
                  <div className="absolute right-0 mt-4 w-30 bg-white border border-gray-300 rounded shadow">
                  <Link to='/profileadmin' className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-300 hover:pl-4 hover:pr-[21px]">
                    <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                    Profile
                  </Link>
                  <button className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-300" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </div>
                )}
              </div>
              {userData && (
                <p className="mr-5 font-semibold text-s hidden md:block">{userData.first_name} {userData.middle_name} {userData.last_name}</p>
              )}
              {userData && (
                <p className="mr-5 font-semibold text-s block md:hidden">{getInitials(userData.first_name, userData.middle_name, userData.last_name)}</p>
              )}
            </div>
          </header>
        </div>
        <div className="p-8">
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          <form className="formedit" onSubmit={handleUpdate}>
            <div className="mb-4 pb1">
              {renderProfilePicture()}
              <label htmlFor="profilePicture" className="profilelbl block text-white font-semibold" style={{marginRight: isPhone ? '10%' : 'auto', marginLeft: isPhone ? '20%' : 'auto' }}>Profile Picture</label>
              <input type="file" id="profilePicture" name="profile_picture" className="inputboxprofile mt-1 p-2 bg-white text-black border rounded-md" onChange={handlephotoupdate} style={{width: isPhone ? '50%' : 'auto', marginRight: isPhone ? '10%' : '', marginLeft: isPhone ? '30%' : '39%' }}/>
            </div>
            <div className={isPhone ? "flex flex-col mb-4" : "grid grid-cols-2 gap-4"}>
              <div className="mb-4">
                <label htmlFor="first_name" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>First Name:</label>
                <input type="text" id="first_name" name="first_name" value={values.first_name} onChange={e => setValues({...values, first_name: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black"  style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="middleName" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Middle Name:</label>
                <input type="text" id="middleName" name="middleName" value={values.middle_name} onChange={e => setValues({...values, middle_name: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black"  style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Last Name:</label>
                <input type="text" id="lastName" name="lastName" value={values.last_name} onChange={e => setValues({...values, last_name: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black"  style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="suffix" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Suffix:</label>
                <input type="text" id="suffix" name="suffix" value={values.suffix} onChange={e => setValues({...values, suffix: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black"  style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="username" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Username:</label>
                <input type="text" id="username" name="username" value={values.username} onChange={e => setValues({...values, username: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black"  style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Email:</label>
                <input type="text" id="email" name="email" value={values.email} onChange={e => setValues({...values, email: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black"  style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="pnumber" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Phone Number:</label>
                <input type="telephone" id="pnumber" name="pnumber" value={values.pnumber} onChange={handleChange} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black"  style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="fb" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Facebook Account:</label>
                <input type="text" id="fb" name="fb" value={values.fb} onChange={e => setValues({...values, fb: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black"  style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Password:</label>
                <input type="password" id="password" name="password" value={values.password} onChange={e => setValues({...values, password: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black"  style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-white font-semibold mb-1" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Account Type:</label>
                <select id="accountType" className="accntype selectField shadow appearance-none border rounded w-[75%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={e => setValues(prevValues => ({ ...prevValues, account_type: e.target.value }))} value={values.account_type}  style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} >
                  <option value="" disabled>Select Type</option>
                  <option value="1">Admin</option>
                  {/*<option value="2">Staff</option>*/}
                  <option value="3">Client</option>
                  <option value="4">Retainers</option>
                </select>
              </div>
            </div>
            <div className={isPhone ? "buttonfunction ml-[-25%] flex justify-center" : "buttonfunction flex justify-end"} style={{marginBottom: isPhone ? '20%' : ''}}>
              <Link to={'/accounts'} onClick={handleCancel} className="mr-8 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded">Cancel</Link>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded">Update</button>
            </div>
          </form>
        </div>
        {confirmLogout && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-700 border border-amber-500 p-6 rounded shadow-md">
          <p className="text-white mb-4">Are you sure you want to log out?</p>
          <div className="flex justify-center">
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 w-[50%] mr-3 rounded" onClick={handleConfirmLogout}>Yes</button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 w-[50%] rounded" onClick={handleCancelLogout}>No</button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default EditAccount;
