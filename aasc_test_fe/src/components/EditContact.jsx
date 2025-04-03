import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getContacts, updateContact } from "../api";
import Requisite from "./Requisite";

export default function EditContact() {
  const location = useLocation();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    NAME: "",
    ADDRESS: "",
    EMAIL: [{ id: Date.now(), VALUE: "", VALUE_TYPE: "" }],
    PHONE: [{ id: Date.now(), VALUE: "", VALUE_TYPE: "" }],
    WEB: [{ id: Date.now(), VALUE: "", VALUE_TYPE: "" }],
  });
  const [showRequisites, setShowRequisites] = useState(false);

  const contactId = location.pathname.split("/").pop();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await getContacts();
        const contacts = response.data.result;
        const foundContact = contacts.find((c) => c.ID === contactId);
        if (foundContact) {
          setContact(foundContact);
          setFormData({
            NAME: foundContact.NAME || "",
            ADDRESS: foundContact.ADDRESS || "",
            EMAIL: foundContact.EMAIL?.length > 0
              ? foundContact.EMAIL.map((e, idx) => ({
                  id: Date.now() + idx,
                  VALUE: e.VALUE || "",
                  VALUE_TYPE: e.VALUE_TYPE || "",
                }))
              : [{ id: Date.now(), VALUE: "", VALUE_TYPE: "" }],
            PHONE: foundContact.PHONE?.length > 0
              ? foundContact.PHONE.map((p, idx) => ({
                  id: Date.now() + idx,
                  VALUE: p.VALUE || "",
                  VALUE_TYPE: p.VALUE_TYPE || "",
                }))
              : [{ id: Date.now(), VALUE: "", VALUE_TYPE: "" }],
            WEB: foundContact.WEB?.length > 0
              ? foundContact.WEB.map((w, idx) => ({
                  id: Date.now() + idx,
                  VALUE: w.VALUE || "",
                  VALUE_TYPE: w.VALUE_TYPE || "",
                }))
              : [{ id: Date.now(), VALUE: "", VALUE_TYPE: "" }],
          });
        } else {
          setError("Không tìm thấy liên hệ!");
        }
      } catch (err) {
        setError("Không thể tải thông tin liên hệ. Vui lòng thử lại!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [contactId]);

  const addField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], { id: Date.now(), VALUE: "", VALUE_TYPE: "" }],
    }));
  };

  const removeField = (field, id) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item.id !== id),
    }));
  };

  const handleChange = (e, id, field) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: field === "NAME" || field === "ADDRESS"
        ? { ...prev, [field]: value }
        : prev[field].map((item) =>
            item.id === id ? { ...item, [name]: value } : item
          ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const submitData = {
      NAME: formData.NAME,
      ADDRESS: formData.ADDRESS,
      EMAIL: formData.EMAIL
        .filter((e) => e.VALUE.trim() !== "")
        .map((e) => ({ VALUE: e.VALUE, VALUE_TYPE: e.VALUE_TYPE })),
      PHONE: formData.PHONE
        .filter((p) => p.VALUE.trim() !== "")
        .map((p) => ({ VALUE: p.VALUE, VALUE_TYPE: p.VALUE_TYPE })),
      WEB: formData.WEB
        .filter((w) => w.VALUE.trim() !== "")
        .map((w) => ({ VALUE: w.VALUE, VALUE_TYPE: w.VALUE_TYPE })),
    };

    try {
      await updateContact(contactId, submitData);
      navigate("/");
    } catch (err) {
      setError("Có lỗi xảy ra khi cập nhật liên hệ. Vui lòng thử lại!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="w-3/5 mx-auto p-5">
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">{error}</div>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="w-3/5 mx-auto p-5 border rounded-lg bg-gray-100 shadow-lg">
      <h1 className="text-center text-2xl font-bold text-gray-800 mb-5">
        ✏ Chỉnh sửa liên hệ
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên</label>
          <input
            type="text"
            name="NAME"
            value={formData.NAME}
            onChange={(e) => handleChange(e, null, "NAME")}
            className="w-full p-2 border rounded-md"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
          <input
            type="text"
            name="ADDRESS"
            value={formData.ADDRESS}
            onChange={(e) => handleChange(e, null, "ADDRESS")}
            className="w-full p-2 border rounded-md"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          {formData.EMAIL.map((email) => (
            <div key={email.id} className="flex items-center gap-2 mb-2">
              <input
                type="email"
                name="VALUE"
                value={email.VALUE}
                onChange={(e) => handleChange(e, email.id, "EMAIL")}
                className="flex-1 p-2 border rounded-md"
                placeholder="Nhập email"
                disabled={loading}
              />
              <input
                type="text"
                name="VALUE_TYPE"
                value={email.VALUE_TYPE}
                onChange={(e) => handleChange(e, email.id, "EMAIL")}
                className="flex-1 p-2 border rounded-md"
                placeholder="Loại (ví dụ: Công việc)"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => removeField("EMAIL", email.id)}
                className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={loading}
              >
                ❌
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("EMAIL")}
            className="mt-2 text-sm text-green-500 hover:text-green-700"
            disabled={loading}
          >
            ➕ Thêm Email
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          {formData.PHONE.map((phone) => (
            <div key={phone.id} className="flex items-center gap-2 mb-2">
              <input
                type="tel"
                name="VALUE"
                value={phone.VALUE}
                onChange={(e) => handleChange(e, phone.id, "PHONE")}
                className="flex-1 p-2 border rounded-md"
                placeholder="Nhập số điện thoại"
                disabled={loading}
              />
              <input
                type="text"
                name="VALUE_TYPE"
                value={phone.VALUE_TYPE}
                onChange={(e) => handleChange(e, phone.id, "PHONE")}
                className="flex-1 p-2 border rounded-md"
                placeholder="Loại (ví dụ: Cá nhân)"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => removeField("PHONE", phone.id)}
                className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={loading}
              >
                ❌
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("PHONE")}
            className="mt-2 text-sm text-green-500 hover:text-green-700"
            disabled={loading}
          >
            ➕ Thêm Số điện thoại
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Website</label>
          {formData.WEB.map((web) => (
            <div key={web.id} className="flex items-center gap-2 mb-2">
              <input
                type="url"
                name="VALUE"
                value={web.VALUE}
                onChange={(e) => handleChange(e, web.id, "WEB")}
                className="flex-1 p-2 border rounded-md"
                placeholder="Nhập URL"
                disabled={loading}
              />
              <input
                type="text"
                name="VALUE_TYPE"
                value={web.VALUE_TYPE}
                onChange={(e) => handleChange(e, web.id, "WEB")}
                className="flex-1 p-2 border rounded-md"
                placeholder="Loại (ví dụ: Khác)"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => removeField("WEB", web.id)}
                className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={loading}
              >
                ❌
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("WEB")}
            className="mt-2 text-sm text-green-500 hover:text-green-700"
            disabled={loading}
          >
            ➕ Thêm Website
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => setShowRequisites(!showRequisites)}
            className="w-full py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {showRequisites ? "Ẩn thông tin ngân hàng" : "Xem thông tin ngân hàng"}
            <span>{showRequisites ? "▲" : "▼"}</span>
          </button>
          {showRequisites && <Requisite contactId={contactId} />}
        </div>
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}