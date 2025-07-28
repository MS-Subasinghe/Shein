import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClothesList = () => {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // Fetch clothes from backend with auth token
  const fetchClothes = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');

      const res = await axios.get('http://localhost:5000/api/clothes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClothes(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load clothes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClothes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/clothes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClothes(clothes.filter(c => c._id !== id));
      toast.success('Item deleted successfully!');
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditData({
      name: item.name,
      brand: item.brand,
      price: item.price,
      imageUrl: item.imageUrl,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const submitEdit = async (id) => {
    try {
      const token = localStorage.getItem('token');

      // Prepare payload with updated data
      const payload = {
        ...editData,
        price: parseFloat(editData.price),
      };

      const res = await axios.put(`http://localhost:5000/api/clothes/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClothes(clothes.map(c => (c._id === id ? res.data : c)));
      setEditingId(null);
      setEditData({});
      toast.success('Item updated successfully!');
    } catch (err) {
      toast.error('Update failed: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <p className="text-center mt-8">Loading clothes...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="grid md:grid-cols-3 gap-8 p-6 pt-15">
        {clothes.map(item => (
          <div key={item._id} className="bg-white shadow-lg rounded-lg overflow-hidden p-6 flex flex-col">
            {editingId === item._id ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  className="mb-4 border border-gray-300 rounded-md p-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Name"
                />
                <input
                  type="text"
                  name="brand"
                  value={editData.brand}
                  onChange={handleEditChange}
                  className="mb-4 border border-gray-300 rounded-md p-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Brand"
                />
                <input
                  type="number"
                  name="price"
                  value={editData.price}
                  onChange={handleEditChange}
                  className="mb-4 border border-gray-300 rounded-md p-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Price"
                  min="0"
                  step="0.01"
                />
                <input
                  type="text"
                  name="imageUrl"
                  value={editData.imageUrl}
                  onChange={handleEditChange}
                  className="mb-6 border border-gray-300 rounded-md p-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Image URL"
                />

                <div className="flex space-x-4">
                  <button
                    onClick={() => submitEdit(item._id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="font-bold text-2xl mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-1">{item.brand}</p>
                <p className="text-indigo-600 font-semibold mb-4 text-lg">Rs. {item.price}</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => startEdit(item)}
                    className="flex-1 bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ClothesList;
