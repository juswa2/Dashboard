import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import logo from './QLOGO.png';
import usericon from './prof.gif';
import './App.css';
import useIsPhone from './useIsPhone';

function RetainerPage(props) {
  const [retainerCases, setRetainerCases] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
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

  const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateFileName = (fileName) => {
    const extension = fileName.split('.').pop();
    const baseName = fileName.slice(0, -(extension.length + 1));
  
    const parts = baseName.split(/[-_.\s]/);
  
    const isNumeric = parts.every(part => /^\d+$/.test(part));
  
    if (isNumeric) {
      return `${parts[0].substring(0, 5)}.${extension}`;
    }
  
    const truncatedParts = parts.map(part => part.substring(0, 15));
    const maxWords = 3;
    const selectedParts = truncatedParts.slice(0, maxWords);
  
    return `${selectedParts.join('-')}.${extension}`;
  };
  
  console.log(truncateFileName("367737530_317130347505910_7808267920092437046_n.jpg"));
  console.log(truncateFileName("example-file-name-longer-than-allowed.txt")); 
  console.log(truncateFileName("this-is-a-really-long-file-name-that-needs-truncating.txt")); 
  console.log(truncateFileName("144153u31vve3-some_other_text-and_more.txt")); 
  

  const handleFileDownload = async (fileName) => {
    try {
      const response = await axios.get(`http://localhost:8081/files/${fileName}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
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
  };

  const handleCancelLogout = () => {
    setConfirmLogout(false);
  };

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:8081/session')
      .then(res => {
        if (res.data.valid) {
          setUserData(res.data.userData);
          if (res.data.userData.account_type !== 4) {
            navigate('/');
          }
          axios.get(`http://localhost:8081/retainercases/${res.data.userData.id}`)
            .then(res => {
              const promises = res.data.map(retainerCase => (
                axios.get(`http://localhost:8081/retainercasedata/${retainerCase.id}`)
              ));
              Promise.all(promises)
                .then(response => {
                  const combinedData = res.data.map((retainerCase, index) => ({
                    ...retainerCase,
                    statusData: response[index].data.statusData
                  }));
                  setRetainerCases(combinedData);
                })
                .catch(err => {
                  console.error('Error fetching retainer case info:', err);
                });
            })
            .catch(err => {
              console.error('Error fetching retainer cases:', err);
            });
        } else {
          console.log("Redirecting to login page");
          navigate('/');
        }
      })
      .catch(err => console.log(err));
  }, []);

  const filteredCases = retainerCases.filter(retainerCase =>
    retainerCase.case_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen pagescreen">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <header className="sticky top-0 bg-black bg-opacity-40 p-5 flex justify-between items-center">
          <img src={logo} className="w-64 h-17" alt="logo" />
          <div className="flex items-center">
            <div className="relative" ref={dropdownRef}>
              {userData && userData.image ? (
                <img
                  src={`http://localhost:8081/uploads/${userData.image}`}
                  className="usericon text-white text-2xl mr-4 cursor-pointer rounded-full border border-amber-500"
                  alt="User Icon"
                  onClick={toggleDropdown}
                />
              ) : (
                <img
                  src={usericon}
                  className="usericon text-white text-2xl mr-4 cursor-pointer rounded-full border border-amber-500"
                  alt="User Icon"
                  onClick={toggleDropdown}
                />
              )}
              {showDropdown && (
                <div className="absolute right-0 mt-4 w-30 bg-white border border-gray-300 rounded shadow">
                  <Link to='/profileretainer' className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200">
                    <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                    Profile
                  </Link>
                  <button className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={handleLogout}>
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
          </div>
        </header>
        <div className="flex-1">
          <div className={`p-1 mt-4 flex ${isPhone ? 'justify-center' : 'justify-start'} ml-${isPhone ? '0' : '[4%]'}`}>
            <input 
              type="text" 
              placeholder="Search..." 
              className="text-black searchbar px-10 py-2 border rounded" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{marginLeft: isPhone ? '' : '6%'}}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap justify-start -mx-4">
          {filteredCases.length > 0 ? (
            filteredCases.map((retainerCase, index) => (
              <div className="divcases w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 px-4 mb-4" id="style-1" key={index}>
                <div className="casebox bg-white rounded shadow-md ml-5 p-4">
                  <div className="casetitle">
                    <p className="casenames" style={{fontSize: isPhone ? '20px' : 'initial' }}>{retainerCase.case_title}</p>
                    <div className="status-tracker relative" style={{ marginLeft: "10%" }}>
                      <div className="status-item rounded" style={{ fontSize: "1.2vw", lineHeight: "2",  fontSize: isPhone ? '15px' : 'initial' }}>
                        <div style={{ float: "left" }}>{retainerCase.retainer_status}</div>
                        <div style={{ float: "right" }}>{formatDate(retainerCase.date)}</div>
                        <br />
                        {retainerCase.retainer_file && (
                          <div style={{ fontSize: "1.2vw", clear: "both", textAlign: "right", marginTop: "5px", fontSize: isPhone ? '15px' : 'initial' }}>
                            <button onClick={() => handleFileDownload(retainerCase.retainer_file)} style={{ color: "#f59e0b" }} className='sf'>
                              {truncateFileName(retainerCase.retainer_file)}
                            </button>
                          </div>
                        )}
                      </div>
                      {retainerCase.statusData && retainerCase.statusData.map((status, statusIndex) => (
                        <div className="status-item" key={statusIndex} style={{ fontSize: "1.2vw", lineHeight: "2", fontSize: isPhone ? '15px' : 'initial' }}>
                          <div style={{ float: "left" }}>{status.status}</div>
                          <div style={{ float: "right", marginLeft: "30px" }}>{formatDate(status.date)}</div>
                          <br />
                          {status.file && (
                            <div style={{ fontSize: "1.2vw", clear: "both", textAlign: "right", marginTop: "5px", fontSize: isPhone ? '15px' : 'initial' }}>
                              <button onClick={() => handleFileDownload(status.file)} style={{ color: "#f59e0b" }} className='sf'>
                                {truncateFileName(status.file)}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="divcase w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 px-4 mb-4" id="style-1">
              <div className="casebox bg-white rounded text-center text-[1.5vw] ml-8 pt-20 font-bold shadow-md p-4" style={{fontSize: isPhone ? '20px' : 'initial' }}>
                No Case Found
              </div>
            </div>
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

export default RetainerPage;
