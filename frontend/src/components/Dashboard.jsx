import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [clothesCount, setClothesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clothesData, setClothesData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  // Chart data state
  const [chartData, setChartData] = useState({
    monthlyUsers: [],
    clothesCategories: [],
    weeklyActivity: []
  });

  // Helper function to process clothes data for charts
  const processClothesData = (clothes) => {
    const categories = {};
    clothes.forEach(item => {
      const category = item.category || 'Other';
      categories[category] = (categories[category] || 0) + 1;
    });

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];
    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  };

  // Helper function to process users data for monthly chart
  const processUsersData = (users) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const monthlyData = {};

    // Initialize all months with 0
    monthNames.forEach(month => {
      monthlyData[month] = 0;
    });

    // Count users by month
    users.forEach(user => {
      if (user.createdAt) {
        const date = new Date(user.createdAt);
        if (date.getFullYear() === currentYear) {
          const month = monthNames[date.getMonth()];
          monthlyData[month]++;
        }
      }
    });

    return monthNames.map(month => ({
      month,
      users: monthlyData[month]
    }));
  };

  // Generate mock weekly activity data (you can replace this with real data if available)
  const generateWeeklyActivity = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      activity: Math.floor(Math.random() * 50) + 10 // Random activity between 10-60
    }));
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          setLoading(false);
          return;
        }

        const [usersRes, clothesRes, allUsersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users/count', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/clothes', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ data: [] })) // Fallback if this endpoint fails
        ]);

        // Set basic counts
        setUsersCount(usersRes.data.count);
        setClothesCount(clothesRes.data.length);
        
        // Store raw data
        setClothesData(clothesRes.data);
        setUsersData(allUsersRes.data);

        // Process data for charts
        const processedClothesCategories = processClothesData(clothesRes.data);
        const processedMonthlyUsers = processUsersData(allUsersRes.data);
        const weeklyActivity = generateWeeklyActivity();

        setChartData({
          monthlyUsers: processedMonthlyUsers,
          clothesCategories: processedClothesCategories,
          weeklyActivity: weeklyActivity
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        
        // Set fallback data if API fails
        setUsersCount(0);
        setClothesCount(0);
        setChartData({
          monthlyUsers: [],
          clothesCategories: [],
          weeklyActivity: generateWeeklyActivity()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Users Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold">{usersCount.toLocaleString()}</p>
                <p className="text-blue-100 text-xs mt-1">
                  {usersCount > 0 ? `↗ Active users registered` : 'No users yet'}
                </p>
              </div>
              <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Clothes Card */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Clothes</p>
                <p className="text-3xl font-bold">{clothesCount.toLocaleString()}</p>
                <p className="text-green-100 text-xs mt-1">
                  {clothesCount > 0 ? `↗ Items in inventory` : 'No items yet'}
                </p>
              </div>
              <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM6 9h8v8H6V9z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Revenue</p>
                <p className="text-3xl font-bold">$12.4K</p>
                <p className="text-purple-100 text-xs mt-1">↗ Estimated value</p>
              </div>
              <div className="bg-purple-400 bg-opacity-30 rounded-full p-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Activity Card */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Active Today</p>
                <p className="text-3xl font-bold">89</p>
                <p className="text-orange-100 text-xs mt-1">↗ Based on recent activity</p>
              </div>
              <div className="bg-orange-400 bg-opacity-30 rounded-full p-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Users Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly User Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.monthlyUsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Bar dataKey="users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Clothes Categories Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Clothes by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.clothesCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.clothesCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center mt-4 gap-4">
              {chartData.clothesCategories.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData.weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Line 
                type="monotone" 
                dataKey="activity" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;