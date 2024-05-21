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
      <div className="w-full p-6 mx-auto mt-20" style={{ paddingBottom: isPhone ? '-20%' : '' }}>
        <div className="flex flex-wrap -mx-3" style={{marginTop: isPhone ? '-100px' : '80px'}}>
          <div className="profilebox11 w-full px-3 lg:w-4/12 lg:mt-6" style={{ width: isPhone ? '70%' : '', paddingBottom: isPhone ? '60%' : '23.1%', marginTop: isPhone ? '10%' : '', marginLeft: isPhone ? '15%' : '', height: isPhone ? '150px' : '300px' }}>
            <div className="relative flex flex-col min-w-0 break-words border-0 rounded-2xl bg-clip-border">
            {isPhone && (
                <button className="absolute top-0 right-0 mt-[-0.5px] mr-[-12px] text-gray-300 bg-red-500 px-1 py-1 rounded-tr-xl hover:text-white" onClick={onClose}>
                  <svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M18.707 5.293a1 1 0 0 0-1.414 0L12 10.586 6.707 5.293a1 1 0 1 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 1 0 1.414-1.414L13.414 12l5.293-5.293a1 1 0 0 0 0-1.414z" />
                  </svg>
                </button>
                )}
              <div className="profilepic items-center">
                {account.image ? (
                  <img src={`http://localhost:8081/uploads/${account.image}`} className="clientIcon fixed-size-image text-white text-2xl cursor-pointer" alt="User Icon" style={{ width: isPhone ? '50%' : '', height: isPhone ? '130px' : '', marginTop: isPhone ? '10%' : '15%' }} />
                ) : (
                  <img src={clientimg} className="clientIcon fixed-size-image text-white text-2xl mr-4 cursor-pointer" alt="Default User Icon" style={{ width: isPhone ? '50%' : '', height: isPhone ? '130px' : '', marginTop: isPhone ? '20%' : '' }} />
                )}
              </div>
              <div className="namelabel">
                <h5 className="mb-0 font-bold text-2xl mt-2" style={{ fontSize: isPhone ? '20px' : '', marginTop: isPhone ? '10%' : '10%', marginBottom: isPhone ? '-20%' : '' }}>{`${account.first_name || ''} ${account.middle_name ? account.middle_name + ' ' : ''}${account.last_name || ''} ${account.suffix || ''}`}</h5>
              </div>
            </div>
          </div>

          <div className="profilebox w-full px-3 lg:w-8/12 lg:mt-6" style={{ height: isPhone ? '-20%' : '', width: isPhone ? '70%' : '', paddingBottom: isPhone ? '75%' : '', marginTop: isPhone ? '5%' : '', marginLeft: isPhone ? '15%' : '', marginBottom: isPhone ? '10%' : '10%' }}>
            <div className="relative flex flex-col h-full min-w-0 break-words border-0 shadow-soft-xl rounded-2xl bg-clip-border" style={{marginBottom: isPhone ? '-200%' : ''}}>
              <div className="p-4 pb-0 mb-0 border-b-0 rounded-t-2xl">
                <div className="flex flex-wrap -mx-3">
                  <div className="flex items-center w-full max-w-full px-3 shrink-0 md:w-8/12 md:flex-none">
                    <h5 className="mb-0 text-white mt-3 font-bold text-3xl" style={{ fontSize: isPhone ? '230%' : '' }}>
                      {account.account_type === 1 && 'Admin'}
                      {account.account_type === 2 && 'Staff'}
                      {account.account_type === 3 && 'Client'}
                      {account.account_type === 4 && 'Retainer'}'s Information
                    </h5>
                  </div>
                </div>
              </div>
              <div className="flex-auto p-4">
                <table className="table-auto w-full text-white">
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-semibold">Email Address:</td>
                      <td className="px-4 py-2">{account.email}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-semibold">Phone Number:</td>
                      <td className="px-4 py-2">{account.pnumber}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-semibold">Facebook Account:</td>
                      <td className="px-4 py-2">{account.fb}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-semibold">Username:</td>
                      <td className="px-4 py-2">{account.username}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-2 font-semibold">Password:</td>
                      <td className="px-4 py-2">
                        {showPassword ? account.password : account.password.replace(/./g, '*')}
                        <button className="ml-2 text-white" onClick={togglePasswordVisibility}>
                          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">Account Type:</td>
                      <td className="px-4 py-2">
                        {account.account_type === 1 ? 'Admin' : account.account_type === 2 ? 'Staff' : account.account_type === 3 ? 'Client' : account.account_type === 4 ? 'Retainer' : ''}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {!isPhone && (
                <div className="">
                <button className="absolute top-0 right-0 hover:bg-red-500 mt-[-0.2px] mr-[-12px] px-1 py-1 text-gray-300 hover:text-white rounded-tr-xl" onClick={onClose}>
                  <svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M18.707 5.293a1 1 0 0 0-1.414 0L12 10.586 6.707 5.293a1 1 0 1 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 1 0 1.414-1.414L13.414 12l5.293-5.293a1 1 0 0 0 0-1.414z" />
                  </svg>
                </button>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewClientModal;
