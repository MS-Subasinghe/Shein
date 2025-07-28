import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminClothesForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
    imageUrl: '',
    category: '',
    sizes: '',
    colors: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : [],
      colors: formData.colors ? formData.colors.split(',').map(c => c.trim()) : [],
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authorized, please login');

      await axios.post('http://localhost:5000/api/clothes', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Item added successfully!');
      setFormData({
        name: '',
        brand: '',
        price: '',
        description: '',
        imageUrl: '',
        category: '',
        sizes: '',
        colors: '',
      });
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
        err.message ||
        'Failed to add item. Please try again.'
      );
      console.error('Add item error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Clothing Item (Admin)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
            required
          />
          <input
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
            required
            min="0"
            step="0.01"
          />
          <input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
          <input
            name="sizes"
            placeholder="Sizes (comma separated)"
            value={formData.sizes}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
          <input
            name="colors"
            placeholder="Colors (comma separated)"
            value={formData.colors}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
          <input
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            className="md:col-span-2 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="md:col-span-2 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 resize-none"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-8 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold tracking-wide hover:bg-indigo-700 transition ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AdminClothesForm;
