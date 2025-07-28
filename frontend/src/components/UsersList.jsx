import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Unauthorized');

        const res = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const roleBadgeColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-600 border-red-300';
      case 'moderator': return 'bg-yellow-100 text-yellow-600 border-yellow-300';
      default: return 'bg-green-100 text-green-600 border-green-300';
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">Registered Users</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 p-4 rounded-lg shadow border border-gray-200">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-4 text-indigo-700 text-center">👥 Users Management</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p>No users found for "<strong>{searchTerm}</strong>"</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full text-sm text-left bg-white">
            <thead className="bg-indigo-100 text-indigo-700 uppercase tracking-wide text-xs font-semibold">
              <tr>
                <th className="px-6 py-4 border-b">Name</th>
                <th className="px-6 py-4 border-b">Email</th>
                <th className="px-6 py-4 border-b">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-indigo-50 transition duration-200">
                  <td className="px-6 py-4 border-b font-medium">{u.name}</td>
                  <td className="px-6 py-4 border-b">{u.email}</td>
                  <td className="px-6 py-4 border-b">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${roleBadgeColor(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersList;
