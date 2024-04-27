import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBriefcase, faUsers, faUserCircle, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from './QLOGO.png';
import useravatar from './ava.gif';
import { Link, useNavigate } from 'react-router-dom';
import usericon from './prof.gif';

function Clients() {

  const [data, setData] = useState([])
  const [confirmLogout, setConfirmLogout] = useState(false);

  const navigate = useNavigate();

  useEffect(()=> {
    axios.get('http://localhost:8081/')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, [])

  const [activeLink, setActiveLink] = useState('/clients');
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const [showDropdown, setShowDropdown] = useState(false);

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
      <div className="flex-1 overflow-auto">
      <div className="sticky top-0 z-10 bg-black bg-opacity-40">
        <header className="p-5 flex justify-between items-center">
          <p className="text-xl font-semibold">List of Clients</p>
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
        <br />
        <br />
        <div className="mt-20 flex flex-wrap justify-start">
          {data.filter(accounts => accounts.account_type === 3).map((accounts, index) => (
            <Link to={`/clientinfo/${accounts.id}`} key={index} className="clientLink">
              <div className="clientbox p-6 mr-1 mb-10 ml-20" style={{ marginBottom: '40%' }}>
                {accounts.image ? (
                  <img src={`http://localhost:8081/uploads/${accounts.image}`} className="clientIcon fixed-size-image text-white text-2xl mr-4 cursor-pointer" alt="User Icon"/>
                ) : (
                  <img src={useravatar} className="clientIcon fixed-size-image text-white text-2xl mr-4 cursor-pointer" alt="Default User Icon"/>
                )}
                <br/>
                <p className="clientname text-black">{`${accounts.first_name || ''} ${accounts.middle_name ? accounts.middle_name + ' ' : ''}${accounts.last_name || ''}`}</p>
              </div>
            </Link>
          ))}
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

export default Clients;
