import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { FaMapMarkerAlt, FaTag, FaHeart } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ location: '', type: '', search: '', condition: '', size: '' });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const { data } = await API.get('/items', { params: filter });
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const { data } = await API.get('/favorites/me');
      setFavorites(data.map(i => i.id));
    } catch (e) {}
  };

  useEffect(() => {
    fetchItems();
    fetchFavorites();
  }, [filter, user]);

  const toggleFavorite = async (e, itemId) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    try {
      const { data } = await API.post(`/favorites/${itemId}`);
      if (data.favorited) {
        setFavorites([...favorites, itemId]);
      } else {
        setFavorites(favorites.filter(id => id !== itemId));
      }
    } catch (err) {}
  };

  if (loading) return <div className="text-center py-20">Loading amazing finds...</div>;

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-emerald-800 text-white rounded-2xl p-10 mb-10 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Swap Your Style. Save the Planet.</h1>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
          Trade your unused clothing items for something fresh. No money involved, just sustainable fashion exchange.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Find the perfect item</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input 
            type="text" 
            placeholder="Search by keywords..." 
            className="input-field md:col-span-2"
            value={filter.search}
            onChange={(e) => setFilter({...filter, search: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Location (City)" 
            className="input-field"
            value={filter.location}
            onChange={(e) => setFilter({...filter, location: e.target.value})}
          />
          <select 
            className="input-field"
            value={filter.type}
            onChange={(e) => setFilter({...filter, type: e.target.value})}
          >
            <option value="">All Categories</option>
            <option value="Shirt">Shirts</option>
            <option value="Pants">Pants</option>
            <option value="Dress">Dresses</option>
            <option value="Jacket">Jackets</option>
            <option value="Accessories">Accessories</option>
          </select>
          <select 
            className="input-field"
            value={filter.condition}
            onChange={(e) => setFilter({...filter, condition: e.target.value})}
          >
            <option value="">Any Condition</option>
            <option value="New with tags">New with tags</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-lg">No items found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(item => {
            const isFav = favorites.includes(item.id);
            const imgs = Array.isArray(item.imageUrls) ? item.imageUrls : (typeof item.imageUrls === 'string' && item.imageUrls.startsWith('http') ? [item.imageUrls] : []);
            const img = imgs.length > 0 ? imgs[0] : null;
            return (
              <Link to={`/item/${item.id}`} key={item.id} className="card group relative">
                <button 
                  onClick={(e) => toggleFavorite(e, item.id)}
                  className="absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors"
                >
                  <FaHeart className={isFav ? 'text-red-500' : 'text-gray-300'} />
                </button>
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                  {img ? (
                    <img 
                      src={img} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-md text-xs font-bold text-primary shadow">
                    Est. ${item.estimatedValue}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{item.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FaTag className="mr-1" /> {item.brand || 'Unbranded'} • Size {item.size}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaMapMarkerAlt className="mr-1 text-red-400" /> {item.location}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
