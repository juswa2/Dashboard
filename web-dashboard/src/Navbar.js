import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import usericon from './prof.gif';

function Navbar() {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
      };


  return (
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
                  <button className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
            <p className="mr-5 font-semibold text-xl">Administrator</p>
          </div>
        </header>
    </div>
  )
}

export default Navbar