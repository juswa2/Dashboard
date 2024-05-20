import React, { useState } from 'react';
import clientimg from './ava.gif';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import useIsPhone from './useIsPhone';


const ViewClientModal = ({ isOpen, onClose, account }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPhone = useIsPhone();

  if (!isOpen) return null;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-[-20%] flex justify-center items-center backdrop-blur-sm">
      <div className="w-full p-6 mx-auto mt-20">
        <div className="flex flex-wrap -mx-3">
          <div className="profilebox11 w-full px-3 lg-max:mt-6 xl:w-4/12">
            <div className="relative flex flex-col min-w-0 break-words border-0 rounded-2xl bg-clip-border">
              <div className="">
                <div className="flex flex-wrap">
                </div>
              </div>
              <div className="profilepic items-center">
              {account.image ? (
                  <img src={`http://localhost:8081/uploads/${account.image}`} className="clientIcon fixed-size-image text-white text-2xl cursor-pointer" alt="User Icon"/>
                ) : (
                  <img src={clientimg} className="clientIcon fixed-size-image text-white text-2xl mr-4 cursor-pointer" alt="Default User Icon"/>
                )}
              </div>
              <div className="namelabel">
                <h5 className="mb-0" style={{ fontWeight: 'bold', fontSize: '20px', marginTop: '10px' }}>{`${account.first_name || ''} ${account.middle_name ? account.middle_name + ' ' : ''}${account.last_name || ''} ${account.suffix || ''}`}</h5>
              </div>
            </div>
          </div>

          <div className="profilebox w-full px-3 lg-max:mt-6 xl:w-4/12">
            <div className="relative flex flex-col h-full min-w-0 break-words border-0 shadow-soft-xl rounded-2xl bg-clip-border">
              <div className="p-4 pb-0 mb-0 border-b-0 rounded-t-2xl">
                <div className="flex flex-wrap -mx-3">
                  <div className="flex items-center w-full max-w-full px-3 shrink-0 md:w-8/12 md:flex-none">
                    <h5 className="mb-0 text-white mt-3" style={{ fontWeight: 'bold', fontSize: '26px' }}>{account.account_type === 1 && 'Admin'}
                    {account.account_type === 2 && 'Staff'}
                    {account.account_type === 3 && 'Client'}
                    {account.account_type === 4 && 'Retainer'}'s Information</h5>
                  </div>
                </div>
              </div>
              <div className="flex-auto p-4">
                <ul className="flex flex-col pl-0 mb-3 mt-3 rounded-lg ml-4" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  <li className="relative block px-4 py-4 pt-0 pl-0 leading-normal border-0 rounded-t-lg text-sm text-inherit" style={{ fontSize: '18px', fontWeight: '500' }}><strong className="text-white">Email Address:</strong> &nbsp; &nbsp;<span className="text-white font-medium text-sm" style={{ fontSize: '18px', fontWeight: '600' }}>{account.email}</span></li>
                  <li className="relative block px-4 py-4 pt-0 pl-0 leading-normal border-0 rounded-t-lg text-sm text-inherit" style={{ fontSize: '18px', fontWeight: '500' }}><strong className="text-white">Phone Number:</strong> &nbsp; &nbsp;<span className="text-white font-medium text-sm" style={{ fontSize: '18px', fontWeight: '600' }}>{account.pnumber}</span></li>
                  <li className="relative block px-4 py-4 pt-0 pl-0 leading-normal border-0 rounded-t-lg text-sm text-inherit" style={{ fontSize: '18px', fontWeight: '500' }}><strong className="text-white">Facebook Account:</strong> &nbsp; &nbsp;<span className="text-white font-medium text-sm" style={{ fontSize: '18px', fontWeight: '600' }}>{account.fb}</span></li>
                  <li className="relative block px-4 py-4 pt-0 pl-0 leading-normal border-0 rounded-t-lg text-sm text-inherit" style={{ fontSize: '18px', fontWeight: '500' }}><strong className="text-white">Username:</strong> &nbsp; &nbsp;<span className="text-white font-medium text-sm" style={{ fontSize: '18px', fontWeight: '600' }}>{account.username}</span></li>
                  <li className="relative block px-4 py-4 pt-0 pl-0 leading-normal border-0 rounded-t-lg text-sm text-inherit" style={{ fontSize: '18px', fontWeight: '500' }}>
                    <strong className="text-white">Password:</strong> &nbsp; &nbsp;
                    <span className="text-white font-medium text-sm" style={{ fontSize: '18px', fontWeight: '600' }}>
                      {showPassword ? account.password : account.password.replace(/./g, '*')}
                    </span>
                    <button className="ml-2 text-white" onClick={togglePasswordVisibility}>
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </li>
                  <li className="relative block px-4 py-4 pt-0 pl-0 leading-normal border-0 rounded-t-lg text-sm text-inherit" style={{ fontSize: '18px', fontWeight: '500' }}><strong className="text-white">Account Type:</strong> &nbsp; &nbsp;<span className="text-white font-medium text-sm" style={{ fontSize: '18px', fontWeight: '600' }}>{account.account_type === 1 ? 'Admin' : account.account_type === 2 ? 'Staff' : account.account_type === 3 ? 'Client' : account.account_type === 4 ? 'Retainer' : ''}</span></li>
                </ul>
                <button className="closeprof absolute top-0 right-0 mt-4 mr-4 text-gray-300 hover:text-white" onClick={onClose}>
                  <svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.707 5.293a1 1 0 0 0-1.414 0L12 10.586 6.707 5.293a1 1 0 1 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 1 0 1.414-1.414L13.414 12l5.293-5.293a1 1 0 0 0 0-1.414z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewClientModal;
