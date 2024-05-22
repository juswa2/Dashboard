import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import logo from './QLOGO.png';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useravatar from './ava.gif';
import usericon from './prof.gif';
import useIsPhone from './useIsPhone';

function ProfileAdmin() {
  const [profilePicture, setProfilePicture] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [id, setId] = useState(null);
  const dropdownRef = useRef(null);
  const isPhone = useIsPhone();


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

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('accountId', id);
      if (event.target.profilePicture.files[0]) {
        formData.append('image', event.target.profilePicture.files[0]);
      }

      if (event.target.profilePicture.files.length > 0) {
        await updateProfilePicture(formData);
      }

      const updatedUserData = {
        first_name: values.first_name,
        middle_name: values.middle_name,
        last_name: values.last_name,
        suffix: values.suffix,
        username: values.username,
        pnumber: values.pnumber,
        fb: values.fb,
        email: values.email,
        password: values.password,
        account_type: values.account_type
      };

      const response = await axios.put(`http://localhost:8081/upclientprof/${id}`, updatedUserData);
      console.log(response.data);

      setSuccessMessage('Data Successfully Updated');
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/');
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const updateProfilePicture = async (formData) => {
    try {
      const response = await axios.post(`http://localhost:8081/userphotoupdate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Profile picture updated:", response.data);
      setSuccessMessage('Profile picture updated successfully');
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

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
  const [values, setValues] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    username: '',
    fb: '',
    pnumber: '',
    email: '',
    password: '',
    account_type: ''
  });

  useEffect(() => {
    axios.get('http://localhost:8081/session')
      .then(res => {
        if (res.data.valid) {
          console.log("User data from response:", res.data.userData);
          setUserData(res.data.userData);
          if (res.data.userData.account_type !== 1) {
            navigate('/');
          }
          setId(res.data.userData.id);
          setValues({
            first_name: res.data.userData.first_name,
            middle_name: res.data.userData.middle_name,
            last_name: res.data.userData.last_name,
            suffix: res.data.userData.suffix,
            username: res.data.userData.username,
            pnumber: res.data.userData.pnumber,
            fb: res.data.userData.fb,
            email: res.data.userData.email,
            password: res.data.userData.password,
            account_type: res.data.userData.account_type,
            image: res.data.userData.image
          });
          if (res.data.userData.image) {
            setProfilePicture(`http://localhost:8081/uploads/${res.data.userData.image}`);
          }
        } else {
          console.log("Redirecting to login page");
          navigate('/');
        }
      })
      .catch(err => console.log(err));
  }, []);
  

  const handleCancel = () => {
    navigate('/dashboard');
  };
  
  const renderProfilePicture = () => {
    if (profilePicture) {
      return (
        <div className="flex justify-center" style={{marginLeft: isPhone ? '12%' : ''}}>
          <img src={profilePicture} alt="Profile" className="im" />
        </div>
      );
    } else if (userData && userData.image) {
      return (
        <div className="flex justify-center" style={{marginLeft: isPhone ? '12%' : ''}}>
          <img src={`http://localhost:8081/uploads/${userData.image}`} alt="User Profile" className="im"/>
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

  const handleChange = (e) => {
    const inputValue = e.target.value.replace(/\D/g, '');
    const truncatedValue = inputValue.slice(0, 11);
    setValues(prevState => ({ ...prevState, pnumber: truncatedValue }));
  };

  return (
    <div className="flex h-screen pagescreen">
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          <header className="bg-black bg-opacity-40 p-5 flex justify-between items-center" style={{marginTop: isPhone ? '-10%' : '-2%', marginLeft: isPhone ? '-10%' : '-2%', marginRight: isPhone ? '-10%' : '-2%' }}>
        <img src={logo} className="w-64 h-17" alt="logo" style={{marginRight: isPhone ? '10%' : 'auto' }} title={`Developed by:\nCHMSU Interns 2024\nJoshua Maquimot\nReggie Macariola\nJhelyn Joy Alo\nKriza Maeville Ejurango`}/>
        <div className="relative" ref={dropdownRef}>
                {userData && userData.image ? (
                  <img
                    src={`http://localhost:8081/uploads/${userData.image}`}
                    className="usericon text-white text-2xl mr-4 cursor-pointer border border-amber-500 rounded-full"
                    alt="User Icon"
                    onClick={toggleDropdown}
                  />
                ) : (
                  <img
                    src={usericon}
                    className="usericon text-white text-2xl mr-4 cursor-pointer border border-amber-500 rounded-full"
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
        {!isPhone && userData && (
          <p className="mr-5 font-semibold text-s">
            {userData.first_name} {userData.middle_name} {userData.last_name}
          </p>
        )}
      </header>
          {userData && (
            <form className="formedit" onSubmit={handleUpdate}>
            <div className="mb-4 pb1">
              {renderProfilePicture()}
              <label htmlFor="profilePicture" className="profilelbl block text-white font-semibold" style={{marginRight: isPhone ? '10%' : 'auto', marginLeft: isPhone ? '20%' : 'auto' }}>Profile Picture</label>
              <input type="file" id="profilePicture" name="profilePicture" className="inputboxprofile mt-1 p-2 border rounded-lg" onChange={handleProfilePictureChange} style={{width: isPhone ? '50%' : 'auto', marginRight: isPhone ? '10%' : '', marginLeft: isPhone ? '30%' : '39%' }} />
            </div>
            <div className={isPhone ? "flex flex-col mb-4" : "grid grid-cols-2 gap-4"}>
              <div className="mb-4">
                <label htmlFor="first_name" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>First Name:</label>
                <input type="text" id="first_name" name="first_name" value={values.first_name} onChange={e => setValues({...values, first_name: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="middle_name" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Middle Name:</label>
                <input type="text" id="middle_name" name="middle_name" value={values.middle_name} onChange={e => setValues({...values, middle_name: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="last_name" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Last Name:</label>
                <input type="text" id="last_name" name="last_name" value={values.last_name} onChange={e => setValues({...values, last_name: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="suffix" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Suffix:</label>
                <input type="text" id="suffix" name="suffix" value={values.suffix} onChange={e => setValues({...values, suffix: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Email:</label>
                <input type="text" id="email" name="email" value={values.email} onChange={e => setValues({...values, email: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="pnumber" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Phone Number:</label>
                <input type="telephone" id="pnumber" name="pnumber" value={values.pnumber} onChange={handleChange} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="fb" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Facebook Account:</label>
                <input type="text" id="fb" name="fb" value={values.fb} onChange={e => setValues({...values, fb: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="username" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Username:</label>
                <input type="text" id="username" name="username" value={values.username} onChange={e => setValues({...values, username: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-white font-semibold" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Password:</label>
                <input type="password" id="password" name="password" value={values.password} onChange={e => setValues({...values, password: e.target.value})} className="inputboxedit mt-1 p-2 border rounded-md w-full text-black" style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-white font-semibold mb-1" style={{marginLeft: isPhone ? '-20%' : 'auto' }}>Account Type:</label>
                <select id="accountType" className="accntype selectField shadow appearance-none border rounded w-[75%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={values.account_type} onChange={e => setValues({...values, account_type: e.target.value})}  style={{width: isPhone ? '100%' : '75%', marginLeft: isPhone ? '-20%' : ''}} >
                  <option value="" disabled>Select Type</option>
                  <option value="1">Admin</option>
                  {/*<option value="2">Staff</option>*/}
                  <option value="3">Client</option>
                  <option value="4">Retainers</option>
                </select>
              </div>
            </div>
            <div className={isPhone ? "buttonfunction ml-[-25%] flex justify-center" : "buttonfunction flex justify-end"}>
              <button onClick={handleCancel} className="mr-8 px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded">Back</button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded">Update</button>
            </div>

          </form>
          
          )}
        </div>
        {confirmLogout && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-700 border border-amber-500 p-6 rounded shadow-md" style={{width: isPhone ? '60%' : 'auto', textAlign: isPhone ? 'center' : 'initial' }}>
          <p className="text-white mb-4">Are you sure you want to log out?</p>
          <div className="flex justify-center">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 w-[50%] mr-3 rounded" onClick={handleConfirmLogout}>Yes</button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 w-[50%] rounded" onClick={handleCancelLogout}>No</button>
          </div>
        </div> 
        )}
      </div>
    </div>
  );
}

export default ProfileAdmin;
