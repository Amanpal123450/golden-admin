import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, X, Save, Gift, Image, Upload, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function RewardsManagement() {
  const [rewards, setRewards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);
  const [formData, setFormData] = useState({
    reward_number: '',
    media_id: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const BASE_URL = "https://golden-3.onrender.com"; // ✅ Your backend base URL
  const token = localStorage.getItem("token");

  // Fetch rewards
  const fetchRewards = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/rewards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRewards(res.data);
    } catch (err) {
      setError("Failed to fetch rewards");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  // ✅ Upload Image
 

  // ✅ Create reward
const handleCreate = async () => {
  if (!formData.reward_number || !imageFile) {
    setError("Please fill all fields");
    return;
  }

  const data = new FormData();
  data.append("reward_number", formData.reward_number);
  data.append("image", imageFile); // backend expects req.files.image

  setLoading(true);
  setError("");

  try {
    const res = await axios.post(`${BASE_URL}/api/rewards`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Reward created:", res.data);

    await fetchRewards();
    resetForm();
    setShowModal(false);
  } catch (err) {
    console.error("Create error:", err.response?.data || err);
    setError("Failed to create reward");
  } finally {
    setLoading(false);
  }
};



  // ✅ Update reward
 const handleUpdate = async () => {
  if (!formData.reward_number) {
    setError("Please enter reward number");
    return;
  }

  setLoading(true);
  setError("");

  try {
    const data = new FormData();
    data.append("reward_number", formData.reward_number);

    // 👇 Only append new image if user selects one
    if (imageFile) {
      data.append("image", imageFile);
    }

    const res = await axios.put(
      `${BASE_URL}/api/rewards/${currentReward._id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Reward updated:", res.data);

    await fetchRewards();
    resetForm();
    setShowModal(false);
  } catch (err) {
    console.error("Update error:", err.response?.data || err);
    setError("Failed to update reward");
  } finally {
    setLoading(false);
  }
};


  // ✅ Delete reward
  const handleDelete = async (id) => {
  try {
    const confirmDelete = window.confirm("Are you sure you want to delete this reward?");
    if (!confirmDelete) return;

    setLoading(true);
    setError("");

    const res = await axios.delete(`${BASE_URL}/api/rewards/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data?.success) {
      console.log("Reward deleted:", res.data.message);
    } else {
      console.warn("Unexpected delete response:", res.data);
    }

    await fetchRewards(); // ✅ Refresh list
  } catch (err) {
    console.error("Delete error:", err.response?.data || err);
    setError(err.response?.data?.message || "Failed to delete reward");
  } finally {
    setLoading(false);
  }
};


  // ✅ Open modal
  const openCreateModal = () => {
    resetForm();
    setEditMode(false);
    setShowModal(true);
  };

  const openEditModal = (reward) => {
    setCurrentReward(reward);
    setFormData({
      reward_number: reward.reward_number,
      media_id: reward.media?._id || "",
    });
    setEditMode(true);
    setShowModal(true);
  };

  // ✅ Reset form
  const resetForm = () => {
    setFormData({ reward_number: "", media_id: "" });
    setImageFile(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-3 rounded-lg">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Rewards Management</h1>
              <p className="text-gray-600">Manage your rewards and upload media</p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Reward
          </button>
        </div>

        {/* Rewards Grid */}
        {loading && rewards.length === 0 ? (
          <p className="text-center text-gray-600">Loading rewards...</p>
        ) : rewards.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p>No rewards yet. Create one now!</p>
            <button
              onClick={openCreateModal}
              className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Create Reward
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((r) => (
             <div key={r._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
  {r.media ? (
    <img
      src={r.media} // ✅ direct URL aa raha hai string me
      alt="Reward"
      className="w-full h-48 object-cover"
    />
  ) : (
    <div className="h-48 flex items-center justify-center bg-gray-100">
      <Image className="w-16 h-16 text-gray-400" />
    </div>
  )}

  <div className="p-4">
    <h3 className="font-bold text-purple-600 text-xl mb-2">
      Reward #{r.reward_number}
    </h3>
    <div className="flex gap-2">
      <button
        onClick={() => openEditModal(r)}
        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(r._id)}
        className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  </div>
</div>

            ))}
          </div>
        )}

        {/* ✅ Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editMode ? "Edit Reward" : "Create New Reward"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reward Number *
                  </label>
                  <input
                    type="text"
                    value={formData.reward_number}
                    onChange={(e) =>
                      setFormData({ ...formData, reward_number: e.target.value })
                    }
                    placeholder="Enter reward number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none"
                  />
                </div>

                {/* ✅ Image Upload instead of select */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Image *
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-purple-50 hover:bg-purple-100 border-purple-300 transition-all duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-2" />
                      ) : (
                        <Upload className="w-8 h-8 text-purple-500 mb-2" />
                      )}
                      <p className="text-sm text-gray-600">
                        {imageFile ? imageFile.name : "Click to upload image"}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setImageFile(file);
                        }
                      }}
                    />
                  </label>

                  {/* Preview */}
                  {formData.media_id && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      ✅ Uploaded (media_id: {formData.media_id})
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={editMode ? handleUpdate : handleCreate}
                  disabled={loading || uploading}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {loading ? "Saving..." : editMode ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
