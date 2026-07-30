import React, { useEffect, useState } from 'react';
import API from '../api';
import { FaUsers, FaTshirt, FaExchangeAlt, FaTrash } from 'react-icons/fa';

const AdminPanel = () => {
  const [stats, setStats] = useState({ users: 0, items: 0, swaps: 0 });
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, itemsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/admin/items')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setItems(itemsRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if(window.confirm('Delete this user and all their items/swaps?')) {
      try {
        await API.delete(`/admin/users/${id}`);
        fetchData();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteItem = async (id) => {
    if(window.confirm('Delete this listing?')) {
      try {
        await API.delete(`/admin/items/${id}`);
        fetchData();
      } catch (error) {
        alert('Failed to delete item');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card p-6 flex items-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <div className="p-4 bg-white bg-opacity-20 rounded-full mr-4"><FaUsers className="w-8 h-8" /></div>
          <div>
            <div className="text-sm uppercase font-semibold opacity-80">Total Users</div>
            <div className="text-3xl font-bold">{stats.users}</div>
          </div>
        </div>
        <div className="card p-6 flex items-center bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <div className="p-4 bg-white bg-opacity-20 rounded-full mr-4"><FaTshirt className="w-8 h-8" /></div>
          <div>
            <div className="text-sm uppercase font-semibold opacity-80">Total Items</div>
            <div className="text-3xl font-bold">{stats.items}</div>
          </div>
        </div>
        <div className="card p-6 flex items-center bg-gradient-to-br from-orange-500 to-red-600 text-white">
          <div className="p-4 bg-white bg-opacity-20 rounded-full mr-4"><FaExchangeAlt className="w-8 h-8" /></div>
          <div>
            <div className="text-sm uppercase font-semibold opacity-80">Swap Requests</div>
            <div className="text-3xl font-bold">{stats.swaps}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Users Directory</h2>
          <div className="overflow-y-auto max-h-96">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-2 font-medium">{u.name}</td>
                    <td className="p-2 text-gray-500">{u.email}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-2">
                      {u.role !== 'admin' && (
                        <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700">
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">All Listings</h2>
          <div className="overflow-y-auto max-h-96">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-2">Title</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Value</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-2 font-medium truncate max-w-[150px]">{item.title}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-2">₹{item.estimatedValue}</td>
                    <td className="p-2">
                      <button onClick={() => handleDeleteItem(item.id)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
