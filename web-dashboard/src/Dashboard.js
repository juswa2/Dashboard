import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBriefcase, faUsers, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import logo from './QLOGO.png';
import usericon from './prof.gif';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useIsPhone from './useIsPhone';


function Dashboard() {
  const [activeLink, setActiveLink] = useState('/dashboard');
  const [dateTime, setDateTime] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [totalClients, setTotalClients] = useState(0);
  const [totalRetainers, setTotalRetainers] = useState(0);
  const [totalCases, setTotalCases] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const dropdownRef = useRef(null);
  const isPhone = useIsPhone();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLinkClick = (link) => {
    setActiveLink(link);
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

  const formatDate = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);
    const day = formattedDate.split(',')[0];
    const remainingDate = formattedDate.split(',')[1].trim();
    return (
      <div className="text-2xl">
        <p className="text-5xl">{day.toUpperCase()}</p>
        <p className="">{remainingDate}, {date.getFullYear()}</p>
      </div>
    );
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return (
      <div className="text-4xl font-mono">
        <p>{hours}:{minutes} {ampm}</p>
      </div>
    );
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

  useEffect(() => {
    axios.get('http://localhost:8081/totalclients')
      .then(res => {
        setTotalClients(res.data.totalClients);
      })
      .catch(err => console.error("Error fetching total clients:", err));

    axios.get('http://localhost:8081/totalretainers')
      .then(res => {
        setTotalRetainers(res.data.totalRetainers);
      })
      .catch(err => console.error("Error fetching total retainers:", err));

    axios.get('http://localhost:8081/totalcases')
      .then(res => {
        setTotalCases(res.data.totalCases);
      })
      .catch(err => console.error("Error fetching total cases:", err));

    axios.get('http://localhost:8081/totalusers')
      .then(res => {
        setTotalUsers(res.data.totalUsers);
      })
      .catch(err => console.error("Error fetching total users:", err));
  }, []);

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
          <img src={logo} className="h-17 w-auto md:h-17 md:w-auto" alt="logo" title={`Developed by:\nCHMSU Interns 2024\nJoshua Maquimot\nReggie Macariola\nJhelyn Joy Alo\nKriza Maeville Ejurango`}/>
        </div>
        <nav className="mt-10">
          <Link to='/dashboard' onClick={() => handleLinkClick('/dashboard')} className={`buttonnav1 flex items-center py-5 px-4 ${activeLink === '/dashboard' ? 'bg-white text-black' : 'hover:bg-gray-400 hover:text-black'}`}>
            <FontAwesomeIcon icon={faHome} className="mr-2 sidebaricon" />
            <span className="ml-2 sidebar-label">Dashboard</span>
          </Link>
          <Link to='/clients' onClick={() => handleLinkClick('/clients')} className={`buttonnav2 flex items-center py-5 px-4 ${activeLink === '/clients' ? 'bg-white text-black' : 'hover:bg-gray-300 hover:text-black'}`}>
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
      <div className="flex-1">
        <div className="sticky top-0 z-10 bg-black bg-opacity-40">
          <header className="p-5 flex justify-between items-center">
            <div className="flex items-center">
              <div className="md:hidden">
                <img src={logo} className="h-10 w-[80%]" alt="logo" />
              </div>
              <p className="text-xl font-semibold hidden md:block">Dashboard</p>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8" id='dashboardpage1'>
          <div className="boxdash w-full py-10 p-6 mb-4 rounded-lg">
            <p className="text-[20px] font-semibold mt-[-15px] border-b-[3px] border-white pb-2 text-center" style={{fontSize: isPhone ? '17px' : '20px' }}>Total Clients</p>
            <p className="dashnumber text-center text-[40px] mt-5 font-bold" style={{fontSize: isPhone ? '35px' : '40px' }}>{totalClients}</p>
          </div>
          <div className="boxdash w-full py-10 p-6 mb-4 rounded-lg">
            <p className="text-[20px] font-semibold mt-[-15px] border-b-[3px] border-white pb-2 text-center" style={{fontSize: isPhone ? '17px' : '20px' }}>Total Retainers</p>
            <p className="dashnumber text-center text-[40px] mt-5 font-bold" style={{fontSize: isPhone ? '35px' : '40px' }}>{totalRetainers}</p>
          </div>
          <div className="boxdash w-full py-10 p-6 mb-4 rounded-lg">
            <p className="text-[20px] font-semibold mt-[-15px] border-b-[3px] border-white pb-2 text-center" style={{fontSize: isPhone ? '17px' : '20px' }}>Total Cases</p>
            <p className="dashnumber text-center text-[40px] mt-5 font-bold" style={{fontSize: isPhone ? '35px' : '40px' }}>{totalCases}</p>
          </div>
          <div className="boxdash w-full py-10 p-6 mb-4 rounded-lg">
            <p className="text-[20px] font-semibold mt-[-15px] border-b-[3px] border-white pb-2 text-center" style={{fontSize: isPhone ? '17px' : '20px' }}>Total Users</p>
            <p className="dashnumber text-center text-[40px] mt-5 font-bold" style={{fontSize: isPhone ? '35px' : '40px' }}>{totalUsers}</p>
          </div>
        </div>

        <div className="text-center mt-10 sm:block hidden">
          <div className="date-time-box">
            {formatDate(dateTime)}
            {formatTime(dateTime)}
            <p className="font-bold border-t-[2px] border-black text-[20px]">PHILIPPINES</p>
          </div>
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

export default Dashboard;
