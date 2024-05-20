import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faUser, 
  faBriefcase, 
  faUsers, 
  faPlusCircle, 
  faPlus, 
  faTrash, 
  faSignOutAlt, 
  faUserCircle, 
  faCog,
  faLeftLong
} from '@fortawesome/free-solid-svg-icons';
import logo from './QLOGO.png';
import usericon from './prof.gif';
import './App.css';
import RetainerCaseModal from './RetainerCaseModal';
import UpdateRetainerStatus from './UpdateRetainerStatus';
import ConfirmDelete from './ConfirmDelete';
import useIsPhone from './useIsPhone';


function RetainerInfo(props) {
  const [activeLink, setActiveLink] = useState('/retainers');
  const { id } = useParams();
  const [retainerInfo, setRetainerInfo] = useState({});
  const [retainerCases, setRetainerCases] = useState([]);
  const [deleteStatusId, setDeleteStatusId] = useState(null);
  const [isRetainerCase, setIsRetainerCase] = useState(false);
  const [isUpdateCase, setIsUpdateCase] = useState(false);
  const [updateCaseRetainerId, setUpdateCaseRetainerId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const dropdownRef = useRef(null);
  const isPhone = useIsPhone();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredClientCases = retainerCases.filter((retainerCase) =>
    retainerCase.case_title.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const openModal = () => {
    setIsRetainerCase(true);
  };
  
  const closeModal = () => {
    setIsRetainerCase(false);
  };
  
  const openUpdateModal = (retainerCaseId) => {
    setIsUpdateCase(true);
    setUpdateCaseRetainerId(retainerCaseId);
  };
  
  const closeUpdateModal = () => {
    setIsUpdateCase(false);
  };

  useEffect(() => {
    axios.get(`http://localhost:8081/retainerinfo/${id}`)
      .then(res => {
        setRetainerInfo(res.data);
      })
      .catch(err => console.log(err));

    axios.get(`http://localhost:8081/retainercase/${id}`)
      .then(res => {
        setRetainerCases(res.data);
      })
      .catch(err => console.log(err));
  }, [id]);

  useEffect(() => {
    axios.get(`http://localhost:8081/retainercase/${id}`)
      .then(res => {
        setRetainerCases(res.data);
        res.data.forEach(retainerCase => {
          axios.get(`http://localhost:8081/retainerstatuses/${retainerCase.id}`)
            .then(statusRes => {
              retainerCase.statusData = statusRes.data;
              setRetainerCases(prevCases => [...prevCases]);
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
    axios.delete(`http://localhost:8081/Rdelete/${deleteStatusId}`)
      .then(res => window.location.reload())
      .catch(err => console.log(err));
  };

  const handleCancelDelete = () => setDeleteStatusId(null);

  const handleCancel = () => {};

  return (
    <div className="flex flex-col md:flex-row h-screen pagescreen">
      <div className="bg-gray-800 w-full md:w-64 navbar md:flex flex-col hidden">
        <div className="flex items-center justify-center h-20 bg-black">
          <img src={logo} className="h-17 w-auto" alt="logo" />
        </div>
        <nav className="mt-10">
          <Link to='/dashboard' onClick={() => handleLinkClick('/dashboard')} className={`buttonnav1 flex items-center py-5 px-4 ${activeLink === '/dashboard' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}>
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
                to={'/retainers'}
                onClick={handleCancel}
                className="px-2 py-[-12%] border border-amber-500 font-extrabold rounded"
                style={{marginRight: isPhone ? '-20%' : ''}}
              >
               <span className="font-black text-[20px]"> <FontAwesomeIcon icon={faLeftLong} className="" /></span>
              </Link>
            )}
          <h1 className="clientname">{`${retainerInfo.first_name || ''} ${retainerInfo.middle_name ? retainerInfo.middle_name + ' ' : ''}${retainerInfo.last_name || ''}`}</h1>
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
                <Link to={'/retainers'} onClick={handleCancel} className="ml-5 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded">
                  Back
                </Link>
              </div>
            )}
            <div className="ml-auto">
              <button onClick={openModal} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Case
              </button>
              <RetainerCaseModal isOpen={isRetainerCase} onClose={closeModal} retainerId={id} />
            </div>
            <input type="text"
        placeholder="Search..."
        className="searchbar px-6 py-1 border rounded ml-4 mr-[50px] text-black"
        style={{ marginRight: isPhone ? '7%' : '' }}
        value={searchQuery}
        onChange={handleSearch}/>
          </div>
        </div>
        <div className="flex flex-wrap justify-start" style={{marginBottom: isPhone ? '20%' : ''}}>
        {filteredClientCases.map((retainerCase, index) => (
          <div className="divcase w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 mb-4" key={index} style={{marginBottom: isPhone ? '20px' : '', marginTop: isPhone ? '30px' : ''}}>
            <div className="casebox" style={{marginLeft: isPhone ? '8%' : ''}}>
              <div className="casetitle">
                <button className="addupdate text-black" onClick={() => openUpdateModal(retainerCase.id)}>
                  <FontAwesomeIcon icon={faPlusCircle} className="mr-1" />
                </button>
                <UpdateRetainerStatus isOpen={isUpdateCase} onClose={closeUpdateModal} retainerCaseId={updateCaseRetainerId} />
                <p className="casename" style={{fontSize: isPhone ? '20px' : 'initial' }}>{retainerCase.case_title}</p>
                <div className="status-tracker relative" style={{ marginLeft: "10%" }}>
                  <div className="status-item" style={{ fontSize: "1.2vw", lineHeight: "2",  fontSize: isPhone ? '15px' : 'initial' }}>
                    <div style={{ float: "left" }}>{retainerCase.retainer_status}</div>
                    <div style={{ float: "right" }}>{formatDate(retainerCase.date)}</div>
                    <br/>
                    {retainerCase.retainer_file && (
                       <div style={{ fontSize: "1.2vw", clear: "both", textAlign: "right", marginTop: "5px", fontSize: isPhone ? '15px' : 'initial' }}>
                         <button onClick={() => handleFileDownload(retainerCase.retainer_file)} style={{ color: "#f59e0b" }} className='sf'>
                          {retainerCase.retainer_file}
                        </button>
                      </div>
                    )}
                  </div>
                  {retainerCase.statusData && retainerCase.statusData.map((status, statusIndex) => (
                    <div className="status-item" key={statusIndex} style={{ fontSize: "1.2vw", lineHeight: "2", fontSize: isPhone ? '15px' : 'initial' }}>
                      <div style={{ float: "left" }}>{status.status}</div>
                      <div style={{ float: "right", marginLeft: "30px" }}>{formatDate(status.date)} <button onClick={() => handleDelete(status.id)}>
                        <FontAwesomeIcon icon={faTrash} className="text-red-600 cursor-pointer"/>
                      </button> </div>
                      <br/>
                      {status.file && (
                        <div style={{ fontSize: "1.2vw", clear: "both", textAlign: "right", marginTop: "5px", fontSize: isPhone ? '15px' : 'initial'}}>
                          <button onClick={() => handleFileDownload(status.file)} style={{ color: "#f59e0b" }} className='sf'>
                            {status.file}
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
        <ConfirmDelete
          message="Are you sure you want to delete this data?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default RetainerInfo;
