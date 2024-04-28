import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import logo from './QLOGO.png';
import usericon from './prof.gif';
import './App.css';

function RetainerPage(props) {
  const { id } = useParams();
  const [retainerCases, setRetainerCases] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

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

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:8081/session')
        .then(res => {
            if (res.data.valid) {
              setUserData(res.data.userData);
                axios.get(`http://localhost:8081/retainercases/${res.data.userData.id}`)
                    .then(res => {
                        // Fetch status data for each client case
                        const promises = res.data.map(retainerCase => (
                          axios.get(`http://localhost:8081/retainercasedata/${retainerCase.id}`)
                        ));
                        Promise.all(promises)
                          .then(response => {
                            // Combine client case data with their respective status data
                            const combinedData = res.data.map((retainerCase, index) => ({
                              ...retainerCase,
                              statusData: response[index].data.statusData
                            }));
                            setRetainerCases(combinedData);
                          })
                          .catch(err => {
                            console.error('Error fetching client case info:', err);
                          });
                    })
                    .catch(err => {
                        console.error('Error fetching client cases:', err);
                    });
            } else {
                console.log("Redirecting to login page");
                navigate('/');
            }
        })
        .catch(err => console.log(err));
}, []);

  return (
    <div className="flex h-screen pagescreen">

      {/* Main content */}
      <div className="flex-1">
        <header className="p-5 flex justify-between items-center">
          <img src={logo} className="w-64 h-17" alt="logo" />
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
            {userData && <p className="mr-5 font-semibold text-s">{userData.first_name} {userData.middle_name} {userData.last_name}</p>}
          </div>
        </header>
        <div className="flex-1">
          <div className="p-1 ml-[4%] mt-4 flex justify-start">
            <input type="text" placeholder="Search..." className="text-black searchbar px-10 py-2 border rounded" />
          </div>
        </div>

        {retainerCases.length > 0 ? (
          retainerCases.map((retainerCase, index) => (
            <div className="divcase" key={index}>
              <div className="casebox">
                <div className="casetitle">
                  <p className="casename">{retainerCase.case_title}</p>
                  <div className="status-tracker relative" style={{ marginLeft: "10%" }}>
                    <div className="status-item" style={{ fontSize: "18px", lineHeight: "3" }}>
                      <div style={{ float: "left" }}>{retainerCase.retainer_status}</div>
                      <div style={{ float: "right" }}>{formatDate(retainerCase.date)}</div>
                      <br />
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
                        <div style={{ float: "right", marginLeft: "30px" }}>{formatDate(status.date)} </div>
                        <br />
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
          ))
        ) : (
          <div className="divcase">
            <div className="casebox">
              No cases found.
            </div>
          </div>
        )}
      </div>
      {confirmLogout && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-md">
          <p className="text-black mb-4">Are you sure you want to log out?</p>
          <div className="flex justify-center">
            <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={handleConfirmLogout}>Yes</button>
            <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={handleCancelLogout}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RetainerPage;
