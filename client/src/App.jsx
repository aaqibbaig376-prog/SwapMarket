import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ItemDetail from './pages/ItemDetail';
import SwapRequest from './pages/SwapRequest';
import Chat from './pages/Chat';
import AdminPanel from './pages/AdminPanel';
import UserProfile from './pages/UserProfile';
import Favorites from './pages/Favorites';
import { AuthContext } from './context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 transition-colors duration-200">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/item/:id" element={<ItemDetail />} />
            <Route path="/user/:id" element={<UserProfile />} />
            
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/swaps" element={<PrivateRoute><SwapRequest /></PrivateRoute>} />
            <Route path="/chat/:swapId" element={<PrivateRoute><Chat /></PrivateRoute>} />
            <Route path="/wishlist" element={<PrivateRoute><Favorites /></PrivateRoute>} />
            
            <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminPanel /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
