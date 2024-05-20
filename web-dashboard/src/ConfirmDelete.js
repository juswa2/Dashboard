import React from 'react';
import useIsPhone from './useIsPhone';


function ConfirmDelete({ message, onConfirm, onCancel }) {

  const isPhone = useIsPhone();

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-20 backdrop-blur-sm z-50">
      <div className="bg-white p-8 rounded-lg  bg-zinc-700 border border-amber-500 p-6 rounded shadow-md" style={{width: isPhone ? '60%' : 'auto', textAlign: isPhone ? 'center' : 'initial' }}>
        <p className="text-white mb-4">{message}</p>
        <div className="flex justify-center">
          <button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white px-[20px] py-2 mr-3 rounded">Confirm</button>
          <button onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-[25px] rounded">Cancel</button>
        </div>
      </div>
    </div>
    
  );
}

export default ConfirmDelete;
