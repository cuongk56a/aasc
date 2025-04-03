import React from "react";

const DeleteModal = ({ isOpen, onClose, onConfirm, contactName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-500 opacity-50" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 z-10">
        <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
        <p className="mb-1">
          Bạn có chắc chắn muốn xóa liên hệ 
        </p>
        <strong className="mb-5">{contactName}</strong> 
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;