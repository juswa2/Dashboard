import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBriefcase, faUsers, faPlusCircle, faPlus, faTrash, faUserCircle, faCog, faSignOutAlt, faCaretLeft, faLeftLong } from '@fortawesome/free-solid-svg-icons';
import logo from './QLOGO.png';
import usericon from './prof.gif';
import './App.css';
import AddCaseModal from './AddCaseModal';
import UpdateCaseModal from './UpdateCaseModal';
import ConfirmDeleteS from './ConfirmDeleteS';
import useIsPhone from './useIsPhone';

function ClientInfo(props) {
  const [activeLink, setActiveLink] = useState('/clients');
  const { id } = useParams();
  const [clientInfo, setClientInfo] = useState({});
  const [deleteStatusId, setDeleteStatusId] = useState(null);
  const [clientCases, setClientCases] = useState([]);
  const [isAddCase, setIsAddCase] = useState(false);
  const [isUpdateCase, setIsUpdateCase] = useState(false);
  const [updateCaseClientId, setUpdateCaseClientId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const dropdownRef = useRef(null);
  const isPhone = useIsPhone();
  const [searchQuery, setSearchQuery] = useState('');


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredClientCases = clientCases.filter((clientCase) =>
    clientCase.case_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const openModal = () => {
    setIsAddCase(true);
  };

  const closeModal = () => {
    setIsAddCase(false);
  };

  const openUpdateModal = (clientCaseId) => {
    setIsUpdateCase(true);
    setUpdateCaseClientId(clientCaseId);
  };

  const closeUpdateModal = () => {
    setIsUpdateCase(false);
  };

  useEffect(() => {
    axios.get(`http://localhost:8081/clientinfo/${id}`)
      .then(res => {
        setClientInfo(res.data);
      })
      .catch(err => console.log(err));

    axios.get(`http://localhost:8081/clientcase/${id}`)
      .then(res => {
        setClientCases(res.data);
      })
      .catch(err => console.log(err));
  }, [id]);

  useEffect(() => {
    axios.get(`http://localhost:8081/clientcase/${id}`)
      .then(res => {
        setClientCases(res.data);
        res.data.forEach(clientCase => {
          axios.get(`http://localhost:8081/clientstatuses/${clientCase.id}`)
            .then(statusRes => {
              clientCase.statusData = statusRes.data;
              setClientCases(prevCases => [...prevCases]);
            })
            .catch(err => console.log(err));
        });
      })
      .catch(err => console.log(err));
  }, [id]);

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
  };

  const handleCancelLogout = () => {
    setConfirmLogout(false);
  };

  const navigate = useNavigate();

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

  const handleDelete = (id) => setDeleteStatusId(id);

  const handleConfirmDelete = () => {
    axios.delete(`http://localhost:8081/Sdelete/${deleteStatusId}`)
      .then(res => window.location.reload())
      .catch(err => console.log(err));
  };

  const handleCancelDelete = () => setDeleteStatusId(null);

  const handleCancel = () => {
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
        <header className="sticky top-0 bg-black bg-opacity-40 p-5 flex justify-between items-center">
            {isPhone && (
              <Link
                to={'/clients'}
                onClick={handleCancel}
                className="px-2 py-[-12%] border border-amber-500 font-extrabold rounded"
                style={{marginRight: isPhone ? '-20%' : ''}}
              >
               <span className="font-black text-[20px]"> <FontAwesomeIcon icon={faLeftLong} className="" /></span>
              </Link>
            )}
          <h1 className="clientname">{`${clientInfo.first_name || ''} ${clientInfo.middle_name ? clientInfo.middle_name + ' ' : ''}${clientInfo.last_name || ''}`}</h1>
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
                  <Link
                    to="/profileadmin"
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-300 hover:pl-4 hover:pr-[21px]"
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                    Profile
                  </Link>
                  <button
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-300"
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
  {userData && (
  <div className="mr-5 font-semibold text-s" style={{marginRight: isPhone ? '-5%' : ''}}>
    {isPhone ? (
      <>
        {userData.first_name &&
          userData.first_name.charAt(0).toUpperCase()}
        {userData.middle_name &&
          userData.middle_name.charAt(0).toUpperCase()}
        {userData.last_name &&
          userData.last_name.charAt(0).toUpperCase()}
      </>
    ) : (
      <>
        {userData.first_name} {userData.middle_name} {userData.last_name}
      </>
    )}
  </div>
)}

</div>

        </header>
        <div className="flex-1">
          <div className="p-1 mt-4 flex">
                  {!isPhone && (
              <div>
                <Link to={'/clients'} onClick={handleCancel} className="ml-5 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded">
                  <FontAwesomeIcon icon={faLeftLong} className="mr-2 sidebaricon" style={{fontSize: '20px'}}/>Back
                </Link>
              </div>
            )}
            <div className="ml-auto">
              <button onClick={openModal} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Case
              </button>
              <AddCaseModal isOpen={isAddCase} onClose={closeModal} clientId={id} />
            </div>
            <input
        type="text"
        placeholder="Search..."
        className="searchbar px-6 py-1 border rounded ml-4 mr-[50px] text-black"
        style={{ marginRight: isPhone ? '7%' : '' }}
        value={searchQuery}
        onChange={handleSearch}
      />          </div>
        </div>
        
        <div className="flex flex-wrap justify-start" style={{marginBottom: isPhone ? '20%' : ''}}>
        {filteredClientCases.map((clientCase, index) => (
          <div className="divcase w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 mb-4" key={index} style={{marginBottom: isPhone ? '20px' : '', marginTop: isPhone ? '30px' : ''}}>
              <div className="casebox" style={{marginLeft: isPhone ? '8%' : ''}}>
                      <div className="casetitle">
                        <button className="addupdate text-black" onClick={() => openUpdateModal(clientCase.id)}>
                          <FontAwesomeIcon icon={faPlusCircle} className="mr-1" />
                        </button>
                        <UpdateCaseModal isOpen={isUpdateCase} onClose={closeUpdateModal} clientCaseId={updateCaseClientId} />
                        <p className="casename" style={{fontSize: isPhone ? '20px' : 'initial' }}>{clientCase.case_title}</p>
                        <div className="status-tracker relative" style={{ marginLeft: "10%" }}>
                          <div className="status-item" style={{ fontSize: "1.2vw", lineHeight: "2",  fontSize: isPhone ? '15px' : 'initial' }}>
                            <div style={{ float: "left" }}>{clientCase.client_status}</div>
                            <div style={{ float: "right" }}>{formatDate(clientCase.date)}</div>
                            <br/>
                            {clientCase.client_file && (
                              <div style={{ fontSize: "1.2vw", clear: "both", textAlign: "right", marginTop: "5px", fontSize: isPhone ? '15px' : 'initial' }}>
                                <button onClick={() => handleFileDownload(clientCase.client_file)} style={{ color: "#f59e0b" }} className='sf'>
                                {truncateFileName(clientCase.client_file)}
                                </button>
                              </div>
                            )}
                          </div>
                          {clientCase.statusData && clientCase.statusData.map((status, statusIndex) => (
                            <div className="status-item" key={statusIndex} style={{ fontSize: "1.2vw", lineHeight: "2", fontSize: isPhone ? '15px' : 'initial' }}>
                              <div style={{ float: "left" }}>{status.status}</div>
                              <div style={{ float: "right", marginLeft: "30px" }}>{formatDate(status.date)} <button onClick={() => handleDelete(status.id)}>
                                <FontAwesomeIcon icon={faTrash} className="text-red-600 cursor-pointer"/>
                              </button> </div>
                              <br/>
                              {status.file && (
                                <div style={{ fontSize: "1.2vw", clear: "both", textAlign: "right", marginTop: "5px", fontSize: isPhone ? '15px' : 'initial'}}>
                                  <button onClick={() => handleFileDownload(status.file)} style={{ color: "#f59e0b", whiteSpace: "normal", overflowY: "hidden" }} className='sf'>
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
      {deleteStatusId && (
        <ConfirmDeleteS
          message="Are you sure you want to delete this data?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default ClientInfo;
