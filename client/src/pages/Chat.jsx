import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { FaPaperPlane } from 'react-icons/fa';

const Chat = () => {
  const { swapId } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const { data } = await API.get(`/messages/${swapId}`);
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Simple polling every 3 seconds
    return () => clearInterval(interval);
  }, [swapId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await API.post(`/messages/${swapId}`, { content: newMessage });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto card flex flex-col h-[70vh]">
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-800">Negotiation Chat</h2>
        <p className="text-sm text-gray-500">Discuss swap details, arrange shipping or a meetup!</p>
      </div>

      <div className="flex-grow p-4 overflow-y-auto bg-white space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">No messages yet. Say hello!</div>
        ) : (
          messages.map(msg => {
            const isMe = msg.senderId === user.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                  {!isMe && <div className="text-xs text-gray-500 mb-1 font-semibold">{msg.sender?.name}</div>}
                  <div className="text-sm">{msg.content}</div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input 
            type="text" 
            className="input-field flex-grow rounded-full px-6" 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="bg-primary hover:bg-emerald-600 text-white rounded-full p-3 transition-colors shadow-md flex items-center justify-center">
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
