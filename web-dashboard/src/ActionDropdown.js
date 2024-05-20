import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ActionDropdown = ({ account, openViewModal, handleDelete }) => {
  return (
    <div className="dropdown">
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 mr-2 rounded hover:text-white dropdown-toggle">
        Actions
      </button>
      <div className="dropdown-menu">
        <button onClick={() => openViewModal(account)} className="dropdown-item">
          <FontAwesomeIcon icon={faEye} /> View
        </button>
        <Link to={`/editaccount/${account.id}`} className="dropdown-item">
          <FontAwesomeIcon icon={faEdit} /> Edit
        </Link>
        <button onClick={() => handleDelete(account.id)} className="dropdown-item">
          <FontAwesomeIcon icon={faTrash} /> Delete
        </button>
      </div>
    </div>
  );
};

export default ActionDropdown;
