import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Clock, CheckCircle, X, Star, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const SwapsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const { swapRequests, user } = state;
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  if (!user) return null;

  const receivedRequests = swapRequests.filter(req => req.toUserId === user.id);
  const sentRequests = swapRequests.filter(req => req.fromUserId === user.id);

  const handleAcceptRequest = (requestId: string) => {
    dispatch({
      type: 'UPDATE_SWAP_REQUEST',
      payload: { id: requestId, updates: { status: 'accepted' } }
    });
  };

  const handleRejectRequest = (requestId: string) => {
    dispatch({
      type: 'UPDATE_SWAP_REQUEST',
      payload: { id: requestId, updates: { status: 'rejected' } }
    });
  };

  const handleCompleteSwap = (request: any) => {
    setSelectedRequest(request);
    setShowRatingModal(true);
  };

  const submitRating = () => {
    if (selectedRequest) {
      dispatch({
        type: 'UPDATE_SWAP_REQUEST',
        payload: {
          id: selectedRequest.id,
          updates: { status: 'completed', rating, feedback }
        }
      });
      setShowRatingModal(false);
      setSelectedRequest(null);
      setRating(0);
      setFeedback('');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'accepted':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'rejected':
        return <X className="text-red-500" size={20} />;
      case 'completed':
        return <Star className="text-purple-500" size={20} />;
      default:
        return <MessageCircle className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStars = (currentRating: number, isInteractive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={`${
          i < currentRating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        } ${isInteractive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
        onClick={isInteractive ? () => setRating(i + 1) : undefined}
      />
    ));
  };

  const RequestCard: React.FC<{ request: any; isReceived: boolean }> = ({ request, isReceived }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="skill-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">
            {isReceived ? request.fromUserName : request.toUserName}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(request.status)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-600">
              {isReceived ? 'They offer:' : 'You offered:'}
            </span>
            <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium inline-block ml-2">
              {request.skillOffered}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-600">
              {isReceived ? 'They want:' : 'You want:'}
            </span>
            <div className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium inline-block ml-2">
              {request.skillWanted}
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 p-3 bg-gray-50 rounded-lg">
        {request.message}
      </p>

      {request.status === 'completed' && request.rating && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-700">Rating:</span>
            {renderStars(request.rating)}
          </div>
          {request.feedback && (
            <p className="text-sm text-gray-600 italic">"{request.feedback}"</p>
          )}
        </div>
      )}

      <div className="flex space-x-2">
        {isReceived && request.status === 'pending' && (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAcceptRequest(request.id)}
              className="flex-1 px-4 py-2 gradient-primary text-white rounded-lg font-medium flex items-center justify-center space-x-2"
            >
              <CheckCircle size={18} />
              <span>Accept</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRejectRequest(request.id)}
              className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
            >
              <X size={18} />
              <span>Reject</span>
            </motion.button>
          </>
        )}

        {request.status === 'accepted' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCompleteSwap(request)}
            className="w-full px-4 py-2 gradient-secondary text-white rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            <Star size={18} />
            <span>Mark as Completed</span>
          </motion.button>
        )}

        {request.status === 'pending' && !isReceived && (
          <div className="w-full px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-center text-sm">
            Waiting for response...
          </div>
        )}

        {request.status === 'rejected' && (
          <div className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-lg text-center text-sm">
            Request was declined
          </div>
        )}

        {request.status === 'completed' && (
          <div className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg text-center text-sm font-medium">
            ✓ Swap completed successfully
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Skill Swaps</h1>
          <p className="text-xl text-gray-600">Manage your skill exchange requests</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8"
        >
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'received'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Received ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === 'sent'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sent ({sentRequests.length})
          </button>
        </motion.div>

        {/* Requests */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'received' ? (
              <motion.div key="received" className="space-y-4">
                {receivedRequests.length > 0 ? (
                  receivedRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      isReceived={true}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests received</h3>
                    <p className="text-gray-600">When someone wants to swap skills with you, they'll appear here.</p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div key="sent" className="space-y-4">
                {sentRequests.length > 0 ? (
                  sentRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      isReceived={false}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Send size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests sent</h3>
                    <p className="text-gray-600 mb-4">
                      Start by browsing skills and requesting swaps with other users.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => dispatch({ type: 'SET_VIEW', payload: 'browse' })}
                      className="px-6 py-3 gradient-primary text-white rounded-lg font-medium"
                    >
                      Browse Skills
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRatingModal && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRatingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Rate Your Experience
              </h3>
              
              <p className="text-gray-600 mb-6">
                How was your skill swap with {selectedRequest.fromUserName || selectedRequest.toUserName}?
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating:
                  </label>
                  <div className="flex space-x-1">
                    {renderStars(rating, true)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback (optional):
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Share your experience..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={submitRating}
                  disabled={rating === 0}
                  className="flex-1 px-4 py-2 gradient-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Rating
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SwapsPage;