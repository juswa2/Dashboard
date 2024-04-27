import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBriefcase, faUsers, faPlusCircle, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import logo from './QLOGO.png';
import usericon from './prof.gif';
import './App.css';
import RetainerCaseModal from './RetainerCaseModal'
import UpdateRetainerStatus from './UpdateRetainerStatus';
import ConfirmDelete from './ConfirmDelete';

function RetainerInfo(props) {
  const [activeLink, setActiveLink] = useState('/retainers');
  const { id } = useParams();
  const [retainerInfo, setRetainerInfo] = useState({});
  const [retainerCases, setRetainerCases] = useState([]);
  const [deleteStatusId, setDeleteStatusId] = useState(null);
  const [isRetainerCase, setIsRetainerCase] = useState(false);
  const [isUpdateCase, setIsUpdateCase] = useState(false);
  const [updateCaseRetainerId, setUpdateCaseRetainerId] = useState(null);

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
                        setRetainerCases(prevCases => [...prevCases]); // Update state
                    })
                    .catch(err => console.log(err));
            });
        })
        .catch(err => console.log(err));
}, [id]);

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

  return (
    <div className="flex h-screen pagescreen">
      {/* Sidebar */}
      <div className="bg-gray-800 w-64 navbar">
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

      {/* Main content */}
      <div className="flex-1">
        <header className="p-5 flex justify-between items-center">
        <h1 className="retainername">{`${retainerInfo.first_name || ''} ${retainerInfo.middle_name ? retainerInfo.middle_name + ' ' : ''}${retainerInfo.last_name || ''}`}</h1>
          <div className="flex items-center">
            {/* User icon with dropdown */}
            <div className="relative">
              <img
                src={usericon}
                className="usericon text-white text-2xl mr-4 cursor-pointer"
                alt="User Icon"
              />
            </div>
          </div>
        </header>
        <div className="flex-1">
          <div className="p-1 mt-4 flex justify-end">
            <div className="ml-auto">
              <button onClick={openModal} className="bg-yellow-500 hover:bg-yellow-600 text-white ml-10 font-bold py-2 px-4 rounded">
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Case
              </button>
                <RetainerCaseModal isOpen={isRetainerCase} onClose={closeModal} retainerId={id} />
            </div>
            <input type="text" placeholder="Search..." className="searchbar px-6 py-1 border rounded ml-4 mr-10" />
          </div>
        </div>
        {retainerCases.map((retainerCase, index) => (
          <div className="divcase" key={index}>
            <div className="casebox">
              <div className="casetitle">
                <button className="addupdate text-black" onClick={() => openUpdateModal(retainerCase.id)}>
                  <FontAwesomeIcon icon={faPlusCircle} className="mr-1" />
                </button>
                <UpdateRetainerStatus isOpen={isUpdateCase} onClose={closeUpdateModal} retainerCaseId={updateCaseRetainerId} />
                <p className="casename">{retainerCase.case_title}</p>
                <div className="status-tracker relative" style={{ marginLeft: "10%" }}>
                <div className="status-item" style={{ fontSize: "18px", lineHeight: "3"}}>
  <div style={{ float: "left" }}>{retainerCase.retainer_status}</div>
  <div style={{ float: "right" }}>{formatDate(retainerCase.date)}</div>
  <br/>
  {retainerCase.retainer_file && (
    <div style={{ marginTop: "-30px", fontSize: "15px", float: "right" }}>
      <button onClick={() => handleFileDownload(retainerCase.retainer_file)} style={{ color: "#f59e0b" }} className='sf'>
        {retainerCase.retainer_file}
      </button>
    </div>
  )}
</div>
                  {retainerCase.statusData && retainerCase.statusData.map((status, statusIndex) => (
                    <div className="status-item" key={statusIndex} style={{ fontSize: "18px", lineHeight: "3" }}>
                      <div style={{ float: "left" }}>{status.status}</div>
                      <div style={{ float: "right", marginLeft: "30px" }}>{formatDate(status.date)} <button onClick={() => handleDelete(status.id)}>
                            <FontAwesomeIcon icon={faTrash} className="text-red-600 cursor-pointer"/>
                          </button> </div>
                      <br/>
                      {status.file && (
                        <div style={{ marginTop: "-25px", fontSize: "15px", float: "right" }}>
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
