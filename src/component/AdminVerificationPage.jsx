import React  from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Eye } from "lucide-react";

export default function AdminVerificationPage() {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const token = localStorage.getItem("token"); // Admin token (JWT)

  // ✅ Fetch all verifications
  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://golden-4.onrender.com/api/verification", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVerifications(res.data.verifications);
    } catch (err) {
      console.error("Error fetching verifications:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  // ✅ Delete a verification
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this submission?"))
      return;
    try {
      await axios.delete(`https://golden-4.onrender.com/api/verification/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Verification deleted successfully");
      setVerifications((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white bg-gray-900">
        <h3>Loading verifications...</h3>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 bg-gray-900">
        <h3>{error}</h3>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400">
        📋 Verification Submissions
      </h1>

      {verifications.length === 0 ? (
        <p className="text-center text-gray-400">
          No verification records found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-700 rounded-lg text-sm">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="p-3 border border-gray-700">#</th>
                <th className="p-3 border border-gray-700">Name</th>
                <th className="p-3 border border-gray-700">Email</th>
                <th className="p-3 border border-gray-700">Phone</th>
                <th className="p-3 border border-gray-700">Country</th>
                <th className="p-3 border border-gray-700">Photo</th>
                <th className="p-3 border border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifications.map((v, index) => (
                <tr
                  key={v._id}
                  className="hover:bg-gray-800 transition-all text-gray-200"
                >
                  <td className="p-3 border border-gray-700 text-center">
                    {index + 1}
                  </td>
                  <td className="p-3 border border-gray-700">{v.name}</td>
                  <td className="p-3 border border-gray-700">{v.email}</td>
                  <td className="p-3 border border-gray-700">{v.phone}</td>
                  <td className="p-3 border border-gray-700">{v.country}</td>
                  <td className="p-3 border border-gray-700 text-center">
                    {v.photo ? (
                      <img
                        src={v.photo}
                        alt="photo"
                        className="w-12 h-12 object-cover rounded-md mx-auto cursor-pointer"
                        onClick={() => setSelected(v)}
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-3 border border-gray-700 text-center">
                    <button
                      onClick={() => setSelected(v)}
                      className="text-blue-400 hover:text-blue-300 mr-3"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="text-red-500 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔍 View Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white text-black rounded-lg shadow-lg p-6 w-[400px] relative">
            <button
              className="absolute top-2 right-3 text-red-500 font-bold"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-center mb-3">
              Verification Details
            </h3>
            <img
              src={selected.photo}
              alt="User"
              className="w-32 h-32 rounded-md object-cover mx-auto mb-3 shadow"
            />
            <ul className="text-sm space-y-1">
              <li><b>Name:</b> {selected.name}</li>
              <li><b>Email:</b> {selected.email}</li>
              <li><b>Phone:</b> {selected.phone}</li>
              <li><b>Country:</b> {selected.country}</li>
              <li><b>State:</b> {selected.state}</li>
              <li><b>District:</b> {selected.district}</li>
              <li><b>Pin Code:</b> {selected.pincode}</li>
              <li><b>Address:</b> {selected.address}</li>
            </ul>
            <button
              className="bg-red-500 text-white mt-4 w-full py-2 rounded hover:bg-red-600"
              onClick={() => handleDelete(selected._id)}
            >
              Delete Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
