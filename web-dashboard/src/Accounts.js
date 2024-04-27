import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBriefcase, faUsers, faPlus, faEdit, faTrash, faEye, faSortUp, faSortDown, faUserCircle, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from './QLOGO.png';
import './App.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddAccountModal from './AddAccountModal';
import ViewAccountModal from './ViewAccountModal';
import ConfirmDelete from './ConfirmDelete';
import usericon from './prof.gif';

function Accounts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [deleteAccountId, setDeleteAccountId] = useState(null);
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [activeLink, setActiveLink] = useState('/accounts');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    axios.get('http://localhost:8081/')
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openViewModal = (account) => {
    setActiveRow(data.findIndex(a => a.id === account.id));
    setSelectedAccount(account);
  };

  const closeViewModal = () => {
    setActiveRow(null);
    setSelectedAccount(null);
  };

  const handleLinkClick = (link) => setActiveLink(link);

  const handleDelete = (id) => setDeleteAccountId(id);
  const handleConfirmDelete = () => {
    axios.delete(`http://localhost:8081/delete/${deleteAccountId}`)
      .then(res => {
        setData(data.filter(account => account.id !== deleteAccountId));
        setDeleteAccountId(null);
        setIsDeleteSuccess(true);
        setTimeout(() => {
          setIsDeleteSuccess(false);
          window.location.reload();
        }, 2000);
      })
      .catch(err => console.log(err));
  };
  const handleCancelDelete = () => setDeleteAccountId(null);

  const handleSort = (columnKey) => {
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[columnKey] < b[columnKey]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[columnKey] > b[columnKey]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setData(sortedData);
  };

  const handleSearchInput = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredData = data.filter(account => {
    return (
      account.first_name.toLowerCase().includes(searchQuery) ||
      account.middle_name?.toLowerCase().includes(searchQuery) ||
      account.last_name.toLowerCase().includes(searchQuery) ||
      account.email.toLowerCase().includes(searchQuery) ||
      account.username.toLowerCase().includes(searchQuery) ||
      account.account_type.toString().toLowerCase().includes(searchQuery)
    );
  });

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

  const navigate = useNavigate();

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
        <div className="sticky top-0 z-10 bg-black bg-opacity-40" style={{ zIndex: "15" }}>
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
        <div className="p-8">
          <div className="mt-4 flex justify-end">
            <div className="mr-5" style={{ marginRight: 'auto' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInput}
                placeholder="🔍  Search..."
                className="px-10 py-2 border rounded text-black"
              />
            </div>
            <div>
              <button onClick={openModal} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Account
              </button>
              <AddAccountModal isOpen={isModalOpen} onClose={closeModal} />
            </div>
          </div>

          <div className="table-container mt-3">
            <table className="w-full">
              <thead>
                <tr>
                  <th onClick={() => handleSort('#')} className="sticky top-0 bg-gray-800 text-white px-4 py-2 cursor-pointer z-10">
                    #
                    {sortConfig.key === '#' ? (
                      sortConfig.direction === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />
                    ) : null}
                  </th>
                  <th onClick={() => handleSort('name')} className="sticky top-0 bg-gray-800 text-white px-4 py-2 cursor-pointer z-10">
                    Full Name
                    {sortConfig.key === 'name' ? (
                      sortConfig.direction === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />
                    ) : null}
                  </th>
                  <th onClick={() => handleSort('username')} className="sticky top-0 bg-gray-800 text-white px-4 py-2 cursor-pointer z-10">
                    Username
                    {sortConfig.key === 'username' ? (
                      sortConfig.direction === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />
                    ) : null}
                  </th>
                  <th onClick={() => handleSort('account_type')} className="sticky top-0 bg-gray-800 text-white px-4 py-2 cursor-pointer z-10">
                    Account Type
                    {sortConfig.key === 'account_type' ? (
                      sortConfig.direction === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />
                    ) : null}
                  </th>
                  <th className="sticky top-0 bg-gray-800 text-white px-4 py-2 z-10">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((account, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2 text-center">{index + 1}</td>
                    <td className="border px-4 py-2 text-center">{`${account.first_name || ''} ${account.middle_name ? account.middle_name + ' ' : ''}${account.last_name || ''}`}</td>
                    <td className="border px-4 py-2 text-center">{account.username}</td>
                    <td className="border px-4 py-2 text-center">
                      {account.account_type === 1 && 'Admin'}
                      {account.account_type === 2 && 'Staff'}
                      {account.account_type === 3 && 'Client'}
                      {account.account_type === 4 && 'Retainer'}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button onClick={() => openViewModal(account)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 mr-2 rounded hover:text-white">
                        <FontAwesomeIcon icon={faEye} />
                      </button>

                      {activeRow === index && selectedAccount && (
                        <ViewAccountModal account={selectedAccount} isOpen={true} onClose={closeViewModal} />
                      )}
                      <Link to={`/editaccount/${account.id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 mr-2 rounded hover:text-white">
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      <button onClick={() => handleDelete(account.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded hover:text-white">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
      {deleteAccountId && (
        <ConfirmDelete
          message="Are you sure you want to delete this account?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      {isDeleteSuccess && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded shadow-md" style={{ backgroundColor: '#f59e0b' }}>
          <p className="text-white text-center">Data successfully deleted</p>
        </div>
      )}
    </div>
  );
}

export default Accounts;
