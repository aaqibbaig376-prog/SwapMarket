import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { FaHeart, FaMapMarkerAlt, FaTag } from 'react-icons/fa';

const Favorites = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const { data } = await API.get('/favorites/me');
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleUnfavorite = async (e, id) => {
    e.preventDefault();
    try {
      await API.post(`/favorites/${id}`);
      fetchFavorites();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-center py-20">Loading wishlist...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <FaHeart className="text-red-500 mr-3" /> My Wishlist
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
          You haven't saved any items yet. <Link to="/" className="text-primary hover:underline">Browse the market</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(item => {
            const imgs = Array.isArray(item.imageUrls) ? item.imageUrls : (typeof item.imageUrls === 'string' && item.imageUrls.startsWith('http') ? [item.imageUrls] : []);
            const img = imgs.length > 0 ? imgs[0] : null;
            return (
              <Link to={`/item/${item.id}`} key={item.id} className="card group relative">
                <button 
                  onClick={(e) => handleUnfavorite(e, item.id)}
                  className="absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100 text-red-500 transition-colors"
                >
                  <FaHeart />
                </button>
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                  {img ? (
                    <img src={img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favorites;
