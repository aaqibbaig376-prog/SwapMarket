import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { FaPlus, FaTrash } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'Shirt', brand: '', size: 'M', condition: 'Good', estimatedValue: '', imageUrls: ''
  });

  const fetchMyItems = async () => {
    try {
      const { data } = await API.get('/items/user/me');
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const urls = formData.imageUrls.split(',').map(u => u.trim()).filter(u => u);
      await API.post('/items', { ...formData, imageUrls: urls, location: user.location });
      setShowAddModal(false);
      fetchMyItems();
      setFormData({ title: '', description: '', type: 'Shirt', brand: '', size: 'M', condition: 'Good', estimatedValue: '', imageUrls: '' });
    } catch (error) {
      alert('Failed to add item');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this item?')) {
      try {
        await API.delete(`/items/${id}`);
        fetchMyItems();
      } catch (error) {
        alert('Failed to delete item');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Wardrobe</h1>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center">
          <FaPlus className="mr-2" /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(item => {
          const imgs = Array.isArray(item.imageUrls) ? item.imageUrls : (typeof item.imageUrls === 'string' && item.imageUrls.startsWith('http') ? [item.imageUrls] : []);
          const img = imgs.length > 0 ? imgs[0] : null;
          return (
            <div key={item.id} className="card p-4 relative group">
              <div className="h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                {img ? (
                   <img src={img} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{item.type} • {item.condition}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${item.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {item.status.toUpperCase()}
                </span>
                <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaTrash />
                </button>
              </div>
            </div>
          )
        })}
        {items.length === 0 && (
          <div className="col-span-3 text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <h3 className="text-xl text-gray-500 mb-4">Your wardrobe is empty</h3>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">Add your first item</button>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">List New Item</h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div><label className="block text-sm mb-1">Title</label><input required type="text" name="title" className="input-field" onChange={handleChange} value={formData.title} /></div>
              <div><label className="block text-sm mb-1">Description</label><textarea name="description" className="input-field" onChange={handleChange} value={formData.description}></textarea></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Category</label>
                  <select name="type" className="input-field" onChange={handleChange} value={formData.type}>
                    <option>Shirt</option><option>Pants</option><option>Dress</option><option>Jacket</option><option>Accessories</option>
                  </select>
                </div>
                <div><label className="block text-sm mb-1">Brand</label><input type="text" name="brand" className="input-field" onChange={handleChange} value={formData.brand} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm mb-1">Size</label><input required type="text" name="size" className="input-field" onChange={handleChange} value={formData.size} /></div>
                <div>
                  <label className="block text-sm mb-1">Condition</label>
                  <select name="condition" className="input-field" onChange={handleChange} value={formData.condition}>
                    <option>New with tags</option><option>Like New</option><option>Good</option><option>Fair</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm mb-1">Estimated Value ($)</label><input required type="number" name="estimatedValue" className="input-field" onChange={handleChange} value={formData.estimatedValue} /></div>
                <div><label className="block text-sm mb-1">Image URLs (comma separated)</label><input type="text" name="imageUrls" className="input-field" onChange={handleChange} value={formData.imageUrls} placeholder="https://img1, https://img2" /></div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-2 rounded-lg">List Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
