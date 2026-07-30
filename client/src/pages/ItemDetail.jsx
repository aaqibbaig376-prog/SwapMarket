import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { FaMapMarkerAlt, FaTag, FaExchangeAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await API.get(`/items/${id}`);
        setItem(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchItem();
  }, [id]);

  useEffect(() => {
    if (user && showModal) {
      const fetchUserItems = async () => {
        try {
          const { data } = await API.get('/items/user/me');
          setUserItems(data.filter(i => i.status === 'available'));
        } catch (error) {
          console.error(error);
        }
      };
      fetchUserItems();
    }
  }, [user, showModal]);

  const handleSwapRequest = async () => {
    if (!selectedOffer) return alert('Please select an item to offer');
    try {
      await API.post('/swaps', {
        offeredItemId: selectedOffer,
        requestedItemId: item.id
      });
      alert('Swap request sent successfully!');
      setShowModal(false);
      navigate('/swaps');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to send request');
    }
  };

  if (!item) return <div className="text-center py-20">Loading...</div>;

  const images = Array.isArray(item.imageUrls) 
    ? item.imageUrls 
    : (typeof item.imageUrls === 'string' && item.imageUrls.startsWith('http') ? [item.imageUrls] : []);
  const hasImages = images.length > 0;

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-gray-100 min-h-[400px] relative group">
          {hasImages ? (
             <>
               <img 
                 src={images[currentImageIndex]} 
                 alt={item.title} 
                 className="w-full h-full object-cover absolute inset-0" 
                 onError={(e) => {
                   e.target.onerror = null;
                   e.target.src = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500';
                 }}
               />
               {images.length > 1 && (
                 <>
                   <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity shadow"><FaChevronLeft /></button>
                   <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity shadow"><FaChevronRight /></button>
                   <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                     {images.map((_, idx) => (
                       <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-primary' : 'bg-white/60'}`}></div>
                     ))}
                   </div>
                 </>
               )}
             </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl absolute inset-0">No Image Available</div>
          )}
        </div>
        <div className="md:w-1/2 p-8 flex flex-col">
          <div className="uppercase tracking-wide text-sm text-primary font-semibold mb-1">{item.type}</div>
          <h1 className="block mt-1 text-3xl leading-tight font-bold text-gray-900 mb-4">{item.title}</h1>
          <p className="mt-2 text-gray-600 mb-6">{item.description || 'No description provided.'}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-xs text-gray-500 uppercase font-bold">Brand</span>
              <p className="font-semibold text-gray-800">{item.brand || 'Unbranded'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-xs text-gray-500 uppercase font-bold">Size</span>
              <p className="font-semibold text-gray-800">{item.size}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-xs text-gray-500 uppercase font-bold">Condition</span>
              <p className="font-semibold text-gray-800">{item.condition}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-xs text-gray-500 uppercase font-bold">Est. Value</span>
              <p className="font-semibold text-primary">${item.estimatedValue}</p>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <FaMapMarkerAlt className="mr-2 text-red-400" />
            Listed in {item.location} by <Link to={`/user/${item.ownerId}`} className="font-bold ml-1 text-primary hover:underline">{item.owner?.name}</Link>
          </div>

          <div className="mt-auto">
            {user ? (
              user.id === item.ownerId ? (
                <button className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed">
                  This is your item
                </button>
              ) : (
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full btn-primary py-3 rounded-xl font-semibold flex items-center justify-center text-lg"
                >
                  <FaExchangeAlt className="mr-2" /> Propose Swap
                </button>
              )
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="w-full btn-secondary py-3 rounded-xl font-semibold text-lg"
              >
                Log in to Swap
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Swap Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Propose a Swap</h2>
            <p className="text-gray-600 mb-4">Select one of your available items to offer for <strong>{item.title}</strong>.</p>
            
            {userItems.length === 0 ? (
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-4">
                You don't have any available items to offer. Go to your dashboard to list an item first.
              </div>
            ) : (
              <div className="mb-6 space-y-2 max-h-60 overflow-y-auto">
                {userItems.map(ui => (
                  <label key={ui.id} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedOffer == ui.id ? 'border-primary bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="offerItem" 
                      value={ui.id} 
                      className="mr-3"
                      onChange={(e) => setSelectedOffer(e.target.value)}
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{ui.title}</div>
                      <div className="text-sm text-gray-500">Est. Value: ${ui.estimatedValue}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
            
            <div className="flex space-x-3">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">
                Cancel
              </button>
              <button 
                onClick={handleSwapRequest}
                disabled={!selectedOffer}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
