import { useState } from "react";
import { addContact } from "../api";

export default function AddContactModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [emails, setEmails] = useState([{ id: Date.now(), value: "", valueType: "" }]);
  const [phones, setPhones] = useState([{ id: Date.now(), value: "", valueType: "" }]);
  const [websites, setWebsites] = useState([{ id: Date.now(), value: "", valueType: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({ emails: {}, phones: {}, websites: {} });

  const addField = (setFunc) => {
    setFunc((prev) => [...prev, { id: Date.now(), value: "", valueType: "" }]);
  };

  const removeField = (setFunc, id, fieldType) => {
    setFunc((prev) => prev.filter((item) => item.id !== id));
    setFieldErrors((prev) => {
      const newErrors = { ...prev[fieldType] };
      delete newErrors[id];
      return { ...prev, [fieldType]: newErrors };
    });
  };

  const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return value.trim() === "" || emailRegex.test(value);
  };

  const validatePhone = (value) => {
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    return value.trim() === "" || phoneRegex.test(value);
  };

  const validateWebsite = (value) => {
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    return value.trim() === "" || urlRegex.test(value);
  };

  const updateField = (setFunc, id, field, value, fieldType) => {
    setFunc((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );

    if (field === "value") {
      let isValid = true;
      let errorMessage = "";

      if (fieldType === "emails") {
        isValid = validateEmail(value);
        errorMessage = isValid ? "" : "Email không hợp lệ (không chứa dấu, phải đúng định dạng)";
      } else if (fieldType === "phones") {
        isValid = validatePhone(value);
        errorMessage = isValid ? "" : "Số điện thoại không hợp lệ (chỉ chứa số, 7-15 ký tự)";
      } else if (fieldType === "websites") {
        isValid = validateWebsite(value);
        errorMessage = isValid ? "" : "Website không hợp lệ (phải là URL hợp lệ)";
      }

      setFieldErrors((prev) => ({
        ...prev,
        [fieldType]: {
          ...prev[fieldType],
          [id]: errorMessage,
        },
      }));
    }
  };

  const handleSave = async () => {
    const newErrors = { emails: {}, phones: {}, websites: {} };

    emails.forEach((email) => {
      if (email.value.trim() !== "" && !validateEmail(email.value)) {
        newErrors.emails[email.id] = "Email không hợp lệ (không chứa dấu, phải đúng định dạng)";
      }
    });

    phones.forEach((phone) => {
      if (phone.value.trim() !== "" && !validatePhone(phone.value)) {
        newErrors.phones[phone.id] = "Số điện thoại không hợp lệ (chỉ chứa số, 7-15 ký tự)";
      }
    });

    websites.forEach((web) => {
      if (web.value.trim() !== "" && !validateWebsite(web.value)) {
        newErrors.websites[web.id] = "Website không hợp lệ (phải là URL hợp lệ)";
      }
    });

    setFieldErrors(newErrors);

    if (
      Object.keys(newErrors.emails).length > 0 ||
      Object.keys(newErrors.phones).length > 0 ||
      Object.keys(newErrors.websites).length > 0
    ) {
      setError("Vui lòng sửa các trường không hợp lệ trước khi lưu!");
      return;
    }

    setLoading(true);
    setError(null);

    const newContact = {
      NAME: name,
      ADDRESS: address,
      EMAIL: emails
        .filter((e) => e.value.trim() !== "")
        .map((e) => ({ VALUE: e.value, VALUE_TYPE: e.valueType })),
      PHONE: phones
        .filter((p) => p.value.trim() !== "")
        .map((p) => ({ VALUE: p.value, VALUE_TYPE: p.valueType })),
      WEBSITE: websites
        .filter((w) => w.value.trim() !== "")
        .map((w) => ({ VALUE: w.value, VALUE_TYPE: w.valueType })),
    };

    try {
      await addContact(newContact);
      onSave(newContact);
      onClose();
    } catch (err) {
      setError("Có lỗi xảy ra khi thêm liên hệ. Vui lòng thử lại!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Thêm liên hệ</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Địa chỉ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        />

        <div className="mb-4">
          <strong className="text-gray-700">📧 Email:</strong>
          {emails.map((email) => (
            <div key={email.id} className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Email"
                  value={email.value}
                  onChange={(e) => updateField(setEmails, email.id, "value", e.target.value, "emails")}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Loại Email (e.g., Work, Personal)"
                  value={email.valueType}
                  onChange={(e) => updateField(setEmails, email.id, "valueType", e.target.value, "emails")}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={loading}
                />
                <button
                  onClick={() => removeField(setEmails, email.id, "emails")}
                  className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  disabled={loading}
                >
                  ❌
                </button>
              </div>
              {fieldErrors.emails[email.id] && (
                <span className="text-red-600 text-sm">{fieldErrors.emails[email.id]}</span>
              )}
            </div>
          ))}
          <button
            onClick={() => addField(setEmails)}
            className="mt-2 text-sm text-green-500 hover:text-green-700"
            disabled={loading}
          >
            ➕ Thêm Email
          </button>
        </div>

        <div className="mb-4">
          <strong className="text-gray-700">📞 Phone:</strong>
          {phones.map((phone) => (
            <div key={phone.id} className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={phone.value}
                  onChange={(e) => updateField(setPhones, phone.id, "value", e.target.value, "phones")}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Loại Phone (e.g., Mobile, Home)"
                  value={phone.valueType}
                  onChange={(e) => updateField(setPhones, phone.id, "valueType", e.target.value, "phones")}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={loading}
                />
                <button
                  onClick={() => removeField(setPhones, phone.id, "phones")}
                  className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  disabled={loading}
                >
                  ❌
                </button>
              </div>
              {fieldErrors.phones[phone.id] && (
                <span className="text-red-600 text-sm">{fieldErrors.phones[phone.id]}</span>
              )}
            </div>
          ))}
          <button
            onClick={() => addField(setPhones)}
            className="mt-2 text-sm text-green-500 hover:text-green-700"
            disabled={loading}
          >
            ➕ Thêm Số
          </button>
        </div>

        <div className="mb-4">
          <strong className="text-gray-700">🌐 Website:</strong>
          {websites.map((web) => (
            <div key={web.id} className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Website"
                  value={web.value}
                  onChange={(e) => updateField(setWebsites, web.id, "value", e.target.value, "websites")}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Loại Website (e.g., Blog, Portfolio)"
                  value={web.valueType}
                  onChange={(e) => updateField(setWebsites, web.id, "valueType", e.target.value, "websites")}
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={loading}
                />
                <button
                  onClick={() => removeField(setWebsites, web.id, "websites")}
                  className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  disabled={loading}
                >
                  ❌
                </button>
              </div>
              {fieldErrors.websites[web.id] && (
                <span className="text-red-600 text-sm">{fieldErrors.websites[web.id]}</span>
              )}
            </div>
          ))}
          <button
            onClick={() => addField(setWebsites)}
            className="mt-2 text-sm text-green-500 hover:text-green-700"
            disabled={loading}
          >
            ➕ Thêm Website
          </button>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            disabled={loading}
          >
            ❌ Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  ></path>
                </svg>
                Đang lưu...
              </>
            ) : (
              "💾 Lưu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}