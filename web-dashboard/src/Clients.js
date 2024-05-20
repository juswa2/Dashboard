import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBriefcase, faUsers, faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from './QLOGO.png';
import useravatar from './ava.gif';
import { Link, useNavigate } from 'react-router-dom';
import usericon from './prof.gif';
import useIsPhone from './useIsPhone';

function Clients() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeLink, setActiveLink] = useState('/clients');
  const isPhone = useIsPhone();

  useEffect(() => {
    axios.get('http://localhost:8081/')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleLinkClick = (link) => {
    setActiveLink(link);
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
      .catch(err => console.log(err));
  };

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

  const getInitials = (firstName, middleName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const middleInitial = middleName ? middleName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${middleInitial}${lastInitial}`;
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter(accounts => 
    accounts.account_type === 3 && 
    `${accounts.first_name} ${accounts.middle_name} ${accounts.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row h-screen pagescreen">
      <div className="bg-gray-800 w-full md:w-64 navbar md:flex flex-col hidden">
        <div className="flex items-center justify-center h-20 bg-black">
          <img src={logo} className="h-17 w-auto" alt="logo" />
        </div>
        <nav className="mt-10">
          <Link to='/dashboard' onClick={() => handleLinkClick('/dashboard')} className={`buttonnav1 flex items-center py-5 px-4 ${activeLink === '/' ? 'bg-white text-black' : 'hover:bg-gray-300 hover:text-black'}`}>
            <FontAwesomeIcon icon={faHome} className="mr-2 sidebaricon" />
            <span className="ml-2 sidebar-label">Dashboard</span>
          </Link>
          <Link to='/clients' onClick={() => handleLinkClick('/clients')} className={`buttonnav2 flex items-center py-5 px-4 ${activeLink === '/clients' ? 'bg-white text-black' : 'hover:bg-gray-400 hover:text-black'}`}>
            <FontAwesomeIcon icon={faUser} className="mr-2 sidebaricon" />
            <span className="ml-2 sidebar-label">Clients</span>
          </Link>
          <Link to='/retainers' onClick={() => handleLinkClick('/retainers')} className={`buttonnav3 flex items-center py-5 px-4 ${activeLink === '/retainers' ? 'bg-white text-black' : 'hover:bg-gray-300 hover:text-black'}`}>
            <FontAwesomeIcon icon={faBriefcase} className="mr-2 sidebaricon" />
            <span className="ml-2 sidebar-label">Retainers</span>
          </Link>
          <Link to='/accounts' onClick={() => handleLinkClick('/accounts')} className={`buttonnav4 flex items-center py-5 px-4 ${activeLink === '/accounts' ? 'bg-white text-black' : 'hover:bg-gray-300 hover:text-black'}`}>
            <FontAwesomeIcon icon={faUsers} className="mr-2 sidebaricon" />
            <span className="ml-2 sidebar-label">Accounts</span>
          </Link>
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
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-black bg-opacity-40">
          <header className="p-5 flex justify-between items-center">
            <div className="flex items-center">
              <div className="md:hidden">
                <img src={logo} className="h-10 w-[80%]" alt="logo" />
              </div>
              <p className="text-xl font-semibold hidden md:block">List of Clients</p>
            </div>
            <div className="flex items-center">
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
              {userData && (
                <p className="mr-5 font-semibold text-s hidden md:block">{userData.first_name} {userData.middle_name} {userData.last_name}</p>
              )}
              {userData && (
                <p className="mr-5 font-semibold text-s block md:hidden">{getInitials(userData.first_name, userData.middle_name, userData.last_name)}</p>
              )}
            </div>
          </header>
        </div>
        <br />
        <br />
        <div className="flex-1" style={{marginTop: isPhone ? '' : '-3%'}}>
          <div className={`p-1 mt-4 flex ${isPhone ? 'justify-center' : 'justify-start'} ml-${isPhone ? '0' : '[4%]'}`}>
            <input 
              type="text" 
              placeholder="Search..." 
              className="text-black searchbar px-10 py-2 border rounded" style={{marginLeft: isPhone ? '0' : '5%'}}
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="mt-[12%] flex flex-wrap justify-start" style={{ display: isPhone ? 'grid': '', gridTemplateColumns: isPhone ? 'repeat(2, 1fr)' : 'auto', marginBottom: isPhone ? '50px' : ''}}>
          {filteredData.map((accounts, index) => (
            <Link to={`/clientinfo/${accounts.id}`} key={index} className="clientLink">
              <div className="clientbox p-6 mr-1 mb-[40%] ml-20" style={{ width: isPhone ? '75%' : '300px', marginLeft: isPhone ? '13%' : '', height: isPhone ? '40%' : '', paddingBottom: isPhone ? '140px' : '', marginBottom: isPhone ? '-40px' : ''}}>
                <div className="mt-[-50%]">
                  {accounts.image ? (
                    <img src={`http://localhost:8081/uploads/${accounts.image}`} className="clientIcon fixed-size-image text-white text-2xl mr-4 cursor-pointer" style={{width: isPhone ? '100%' : 'auto', height: isPhone ? '120px' : '', marginLeft: isPhone ? '1px' : '10%'}} alt="User Icon"/>
                  ) : (
                    <img src={useravatar} className="clientIcon fixed-size-image text-white text-2xl mr-4 cursor-pointer" style={{width: isPhone ? '100%' : 'auto', height: isPhone ? '120px' : '', marginLeft: isPhone ? '1px' : '10%'}} alt="Default User Icon"/>
                  )}
                  <br/>
                  <p className="clientname mt-[-10px] text-black font-semibold" style={{fontSize: isPhone ? '15px' : 'auto', marginTop: isPhone ? '-10px' : ''}}>{`${accounts.first_name || ''} ${accounts.middle_name ? accounts.middle_name + ' ' : ''}${accounts.last_name || ''}`}</p>
                </div>
              </div>
            </Link>
          ))}
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

export default Clients;
