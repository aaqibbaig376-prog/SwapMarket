import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', location: '', contactDetails: ''
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 card p-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Join SwapStyle</h2>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" name="name" required className="input-field" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" required className="input-field" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" name="password" required className="input-field" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location (City)</label>
          <input type="text" name="location" className="input-field" onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Details (Optional)</label>
          <input type="text" name="contactDetails" className="input-field" onChange={handleChange} />
        </div>
        <button type="submit" className="w-full btn-primary py-3 text-lg font-semibold mt-4">
          Create Account
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
