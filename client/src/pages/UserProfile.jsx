import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { FaStar, FaMapMarkerAlt, FaTshirt } from 'react-icons/fa';

const UserProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get(`/users/${id}`);
        setProfile(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [id]);

  if (!profile) return <div className="text-center py-20">Loading profile...</div>;

  const { user, items, ratings } = profile;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="card p-8 flex flex-col md:flex-row items-center md:items-start gap-6 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-4xl font-bold uppercase shadow-lg">
          {user.name.charAt(0)}
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
          <div className="flex items-center justify-center md:justify-start text-gray-500 mt-2 space-x-4">
            <span className="flex items-center"><FaMapMarkerAlt className="mr-1 text-red-400" /> {user.location || 'Unknown location'}</span>
            <span className="flex items-center text-yellow-500">
              <FaStar className="mr-1" /> {user.averageRating ? user.averageRating.toFixed(1) : 'No ratings yet'} ({user.ratingCount})
            </span>
          </div>
          <p className="mt-4 text-gray-600 text-sm">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Listings */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center border-b pb-2">
            <FaTshirt className="mr-2 text-primary" /> Active Listings ({items.length})
          </h2>
          {items.length === 0 ? (
            <p className="text-gray-500 italic">This user has no active listings.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map(item => {
                const imgs = Array.isArray(item.imageUrls) ? item.imageUrls : (typeof item.imageUrls === 'string' && item.imageUrls.startsWith('http') ? [item.imageUrls] : []);
                const img = imgs.length > 0 ? imgs[0] : null;
                return (
                  <a href={`/item/${item.id}`} key={item.id} className="card group block">
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      {img ? (
                        <img src={img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 truncate">{item.title}</h3>
                      <p className="text-primary text-sm font-bold mt-1">₹{item.estimatedValue}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Reviews</h2>
          {ratings.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No reviews yet.</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {ratings.map(rating => (
                <div key={rating.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center mb-2 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < rating.score ? '' : 'text-gray-300'} />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mb-2">"{rating.comment}"</p>
                  <p className="text-xs text-gray-400">- {rating.reviewer?.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
