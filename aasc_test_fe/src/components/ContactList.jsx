import { useEffect, useState } from "react";
import { getContacts, deleteContact } from "../api";
import { Link } from "react-router-dom";
import AddContactModal from "./AddContactModal";
import DeleteModal from "./DeleteModal";


export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  useEffect(() => {
    setLoading(true);
    getContacts()
      .then((response) => {
        setContacts(response.data.result);
      })
      .catch((err) => {
        setError("Không thể tải danh sách liên hệ. Vui lòng thử lại!");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteClick = (contact) => {
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setIsDeleteModalOpen(false);

    try {
      await deleteContact(contactToDelete.ID);
      setContacts(contacts.filter((c) => c.ID !== contactToDelete.ID));
      setSuccessMessage("Xóa liên hệ thành công!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Có lỗi xảy ra khi xóa liên hệ. Vui lòng thử lại!");
      console.error(err);
    } finally {
      setLoading(false);
      setContactToDelete(null);
    }
  };

  const handleSaveContact = (newContact) => {
    setContacts([...contacts, { ...newContact, ID: Date.now() }]);
    setIsModalOpen(false);
  };

  return (
    <div className="w-3/5 mx-auto p-5 border rounded-lg bg-gray-100 shadow-lg">
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-5">
        📋 Danh sách liên hệ
      </h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="block w-full py-2 bg-green-500 text-white rounded-md mb-4"
        disabled={loading}
      >
        ➕ Thêm liên hệ
      </button>

      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-600">Đang tải...</div>
      ) : (
        <ul className="space-y-4">
          {contacts.map((contact) => (
            <li
              key={contact.ID}
              className="bg-white p-4 rounded-md shadow flex justify-between items-center"
            >
              <div>
                <strong className="text-lg">{contact?.NAME}</strong> - 🏠{" "}
                {contact?.ADDRESS}
                <div className="text-sm text-gray-600">
                  📧 Email:{" "}
                  {contact.EMAIL?.map((email) =>
                    `${email.VALUE || email.value} (${email.VALUE_TYPE || email.valueType || "N/A"})`
                  ).join(", ")}
                </div>
                <div className="text-sm text-gray-600">
                  📞 Phone:{" "}
                  {contact.PHONE?.map((phone) =>
                    `${phone.VALUE || phone.value} (${phone.VALUE_TYPE || phone.valueType || "N/A"})`
                  ).join(", ")}
                </div>
                <div className="text-sm text-gray-600">
                  🌐 Web:{" "}
                  {contact.WEB?.map((web) =>
                    `${web.VALUE || web.value} (${web.VALUE_TYPE || web.valueType || "N/A"})`
                  ).join(", ")}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/edit/${contact.ID}`}
                  className="px-3 py-1 bg-yellow-400 text-black rounded"
                >
                  ✏ Sửa
                </Link>
                <button
                  onClick={() => handleDeleteClick(contact)}
                  className="px-3 py-1 bg-red-500 text-white rounded flex items-center gap-2"
                  disabled={loading}
                >
                  ❌ Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && (
        <AddContactModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveContact}
        />
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setContactToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        contactName={contactToDelete?.NAME || ""}
      />
    </div>
  );
}