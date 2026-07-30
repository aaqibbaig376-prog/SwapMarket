import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaRecycle, FaUser, FaSignOutAlt, FaBell, FaHeart, FaSun, FaMoon } from 'react-icons/fa';
import API from '../api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    if (user) {
      const fetchNotifs = async () => {
        try {
          const { data } = await API.get('/notifications');
          setNotifications(data);
        } catch (e) {}
      };
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(n => n.map(x => ({...x, isRead: true})));
    } catch (e) {}
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="bg-white dark:bg-gray-800 dark:border-b dark:border-gray-700 shadow-md sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center text-primary text-2xl font-bold">
          <FaRecycle className="mr-2" />
          SwapMarket
        </Link>
        <div className="flex items-center space-x-5">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full text-gray-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl text-gray-600" />}
          </button>

          <Link to="/" className="text-gray-600 dark:text-gray-200 hover:text-primary transition-colors">Browse</Link>
          
          {user ? (
            <>
              <Link to="/swaps" className="text-gray-600 dark:text-gray-200 hover:text-primary transition-colors">Swaps</Link>
              <Link to="/wishlist" className="text-gray-600 dark:text-gray-200 hover:text-primary transition-colors"><FaHeart className="inline mb-1" /></Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-600 dark:text-gray-200 hover:text-primary transition-colors">Admin</Link>
              )}
              
              <div className="relative">
                <button 
                  onClick={() => { setShowNotifs(!showNotifs); if(unreadCount > 0) markRead(); }} 
                  className="text-gray-600 dark:text-gray-200 hover:text-primary transition-colors relative"
                >
                  <FaBell className="text-xl mt-1" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                    <div className="p-3 border-b dark:border-gray-700 font-bold text-gray-700 dark:text-gray-200">Notifications</div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">No new notifications</div>
                    ) : (
                      notifications.map(n => (
                        <Link 
                          key={n.id} 
                          to={n.linkUrl || '#'} 
                          className={`block p-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-b-0 ${n.isRead ? 'text-gray-600 dark:text-gray-300' : 'text-gray-900 dark:text-white bg-emerald-50 dark:bg-emerald-950 font-semibold'}`}
                          onClick={() => setShowNotifs(false)}
                        >
                          {n.message}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="relative group">
                <button className="flex items-center text-gray-600 dark:text-gray-200 hover:text-primary transition-colors">
                  <FaUser className="mr-1" /> {user.name}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">Dashboard</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center">
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-x-4 flex items-center">
              <Link to="/login" className="text-gray-600 dark:text-gray-200 hover:text-primary transition-colors">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
