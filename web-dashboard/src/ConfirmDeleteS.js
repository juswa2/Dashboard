import React from 'react';

function ConfirmDeleteS({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <p className="text-black mb-4">{message}</p>
        <div className="flex justify-center">
          <button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-4">Confirm</button>
          <button onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteS;
