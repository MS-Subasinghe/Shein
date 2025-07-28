import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    address: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);

      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (res.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/home');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-700 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-10">Create Account</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6 text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400 transition"
            onChange={handleChange}
            value={formData.name}
            required
            disabled={loading}
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400 transition"
            onChange={handleChange}
            value={formData.username}
            required
            disabled={loading}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400 transition"
            onChange={handleChange}
            value={formData.email}
            required
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400 transition"
            onChange={handleChange}
            value={formData.password}
            required
            disabled={loading}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400 transition"
            onChange={handleChange}
            value={formData.address}
            disabled={loading}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400 transition"
            onChange={handleChange}
            value={formData.phone}
            disabled={loading}
          />

          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
              disabled={loading}
            >
              Register
            </button>
          )}
        </form>

        <p className="mt-8 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
