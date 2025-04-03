import { useEffect, useState } from "react";
import { getRequisites, updateRequisite, deleteRequisite, addRequisite } from "../api";

export default function Requisite({ contactId }) {
  const [requisites, setRequisites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newRequisite, setNewRequisite] = useState({ NAME: "", RQ_ACC_NUM: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ NAME: "", RQ_ACC_NUM: "" });

  useEffect(() => {
    const fetchRequisites = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getRequisites(contactId);
        setRequisites(response.data.result || []);
      } catch (err) {
        setError("Không thể tải thông tin ngân hàng. Vui lòng thử lại!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequisites();
  }, [contactId]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thông tin ngân hàng này?")) {
      setLoading(true);
      try {
        await deleteRequisite(id);
        setRequisites(requisites.filter((req) => req.ID !== id));
      } catch (err) {
        setError("Không thể xóa thông tin ngân hàng. Vui lòng thử lại!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (req) => {
    setEditingId(req.ID);
    setEditData({ NAME: req.NAME || "", RQ_ACC_NUM: req.RQ_ACC_NUM || "" });
  };

  const handleSaveEdit = async (id) => {
    setLoading(true);
    try {
      await updateRequisite(id, editData);
      setRequisites(
        requisites.map((req) =>
          req.ID === id ? { ...req, ...editData } : req
        )
      );
      setEditingId(null);
    } catch (err) {
      setError("Không thể cập nhật thông tin ngân hàng. Vui lòng thử lại!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newRequisite.NAME || !newRequisite.RQ_ACC_NUM) {
      setError("Vui lòng điền đầy đủ thông tin ngân hàng!");
      return;
    }
    setLoading(true);
    try {
      const response = await addRequisite({ ...newRequisite, CONTACT_ID: Number(contactId) });
      setRequisites([...requisites, { ID: response.data.result, ...newRequisite }]);
      setNewRequisite({ NAME: "", RQ_ACC_NUM: "" });
    } catch (err) {
      setError("Không thể thêm thông tin ngân hàng. Vui lòng thử lại!");
      console.error(err);
    

    } finally {
      setLoading(false);
    }
  };

  if (loading && requisites.length === 0) {
    return <div className="text-center text-gray-600">Đang tải thông tin ngân hàng...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="mt-4 p-4 bg-white rounded-md shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Thông tin ngân hàng</h3>
      {requisites.length === 0 && (
        <div className="text-center text-gray-600">Không có thông tin ngân hàng.</div>
      )}
      <ul className="space-y-4">
        {requisites.map((req) => (
          <li key={req.ID} className="flex items-center gap-4">
            {editingId === req.ID ? (
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={editData.NAME}
                  onChange={(e) => setEditData({ ...editData, NAME: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Tên ngân hàng"
                  disabled={loading}
                />
                <input
                  type="text"
                  value={editData.RQ_ACC_NUM}
                  onChange={(e) => setEditData({ ...editData, RQ_ACC_NUM: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  placeholder="Số tài khoản"
                  disabled={loading}
                />
                <button
                  onClick={() => handleSaveEdit(req.ID)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={loading}
                >
                  Lưu
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <span><strong>ID:</strong> {req.ID}</span>
                <span><strong>Tên ngân hàng:</strong> {req.NAME || "N/A"}</span>
                <span><strong>Số tài khoản:</strong> {req.RQ_ACC_NUM || "N/A"}</span>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(req)}
                className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                disabled={loading || editingId}
              >
                ✏
              </button>
              <button
                onClick={() => handleDelete(req.ID)}
                className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={loading || editingId}
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <h4 className="text-md font-medium text-gray-700 mb-2">Thêm ngân hàng mới</h4>
        <div className="space-y-2">
          <input
            type="text"
            value={newRequisite.NAME}
            onChange={(e) => setNewRequisite({ ...newRequisite, NAME: e.target.value })}
            className="w-full p-2 border rounded-md"
            placeholder="Tên ngân hàng"
            disabled={loading}
          />
          <input
            type="text"
            value={newRequisite.RQ_ACC_NUM}
            onChange={(e) => setNewRequisite({ ...newRequisite, RQ_ACC_NUM: e.target.value })}
            className="w-full p-2 border rounded-md"
            placeholder="Số tài khoản"
            disabled={loading}
          />
          <button
            onClick={handleAdd}
            className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center gap-2"
            disabled={loading}
          >
            ➕ Thêm ngân hàng
          </button>
        </div>
      </div>
    </div>
  );
}