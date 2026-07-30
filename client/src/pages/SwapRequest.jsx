import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { FaComments, FaInbox, FaPaperPlane } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const SwapRequest = () => {
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [ratingModal, setRatingModal] = useState({ show: false, request: null, score: 5, comment: '' });
  const { user } = useContext(AuthContext);

  const fetchRequests = async () => {
    try {
      const { data } = await API.get('/swaps');
      setRequests({
        incoming: data.receivedRequests || [],
        outgoing: data.sentRequests || []
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/swaps/${id}`, { status });
      fetchRequests();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleRate = async (e) => {
    e.preventDefault();
    try {
      const { request, score, comment } = ratingModal;
      const revieweeId = request.requesterId === user.id ? request.receiverId : request.requesterId;
      await API.post(`/users/${revieweeId}/rate`, { score, comment, swapRequestId: request.id });
      setRatingModal({ show: false, request: null, score: 5, comment: '' });
      alert('Rating submitted successfully!');
    } catch (error) {
      alert('Failed to submit rating');
    }
  };

  const renderRequestCard = (req, type) => {
    const isIncoming = type === 'incoming';
    const otherUser = isIncoming ? req.requester?.name : req.receiver?.name;
    const myItem = isIncoming ? req.requestedItem : req.offeredItem;
    const theirItem = isIncoming ? req.offeredItem : req.requestedItem;

    return (
      <div key={req.id} className="card p-6 mb-4 flex flex-col md:flex-row justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-6 w-full md:w-3/4">
          <div className="text-center w-32">
            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Your Item</div>
            <div className="font-semibold text-gray-800 truncate">{myItem?.title}</div>
            <div className="text-sm text-primary">${myItem?.estimatedValue}</div>
          </div>
          <div className="text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
          </div>
          <div className="text-center w-32">
            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Their Item</div>
            <div className="font-semibold text-gray-800 truncate">{theirItem?.title}</div>
            <div className="text-sm text-primary">${theirItem?.estimatedValue}</div>
          </div>
          <div className="border-l border-gray-200 pl-6 flex-1">
            <div className="text-sm text-gray-500">
              {isIncoming ? 'From' : 'Sent to'}: <span className="font-bold text-gray-700">{otherUser}</span>
            </div>
            <div className="mt-2 flex flex-col space-y-2">
              <span className={`px-2 py-1 text-xs rounded-full font-bold text-center w-20 ${
                req.status === 'accepted' ? 'bg-green-100 text-green-700' :
                req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                req.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {req.status.toUpperCase()}
              </span>
              {isIncoming && req.status === 'pending' && (
                <div className="flex space-x-2">
                  <button onClick={() => handleStatusUpdate(req.id, 'accepted')} className="btn-primary py-1 px-3 text-sm">Accept</button>
                  <button onClick={() => handleStatusUpdate(req.id, 'rejected')} className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-1 px-3 rounded-lg text-sm transition-colors">Reject</button>
                </div>
              )}
              {req.status === 'accepted' && (
                <button onClick={() => setRatingModal({ show: true, request: req, score: 5, comment: '' })} className="btn bg-yellow-500 hover:bg-yellow-600 text-white py-1 text-sm">Rate User</button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to={`/chat/${req.id}`} className="flex items-center text-gray-500 hover:text-primary">
            <FaComments className="mr-1" /> Chat
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Swap Requests</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaInbox className="mr-2 text-primary" /> Incoming Requests</h2>
          {requests.incoming.length === 0 ? <p className="text-gray-500 text-sm">No incoming requests.</p> : requests.incoming.map(req => renderRequestCard(req, 'incoming'))}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaPaperPlane className="mr-2 text-primary" /> Outgoing Offers</h2>
          {requests.outgoing.length === 0 ? <p className="text-gray-500 text-sm">No outgoing offers.</p> : requests.outgoing.map(req => renderRequestCard(req, 'outgoing'))}
        </div>
      </div>

      {ratingModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rate Your Swap Experience</h2>
            <form onSubmit={handleRate}>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Score (1-5)</label>
                <select className="w-full p-2 border rounded" value={ratingModal.score} onChange={e => setRatingModal({...ratingModal, score: parseInt(e.target.value)})}>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Comment</label>
                <textarea className="w-full p-2 border rounded min-h-[100px]" value={ratingModal.comment} onChange={e => setRatingModal({...ratingModal, comment: e.target.value})} placeholder="How was the communication?" required></textarea>
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setRatingModal({ show: false, request: null, score: 5, comment: '' })} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-300">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapRequest;
