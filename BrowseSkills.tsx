import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, User, Star, MessageCircle, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AnimatedBackground from '../3D/AnimatedBackground';

const BrowseSkills: React.FC = () => {
  const { state, dispatch } = useApp();
  const { users, user: currentUser, searchQuery } = state;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [requestData, setRequestData] = useState({
    skillOffered: '',
    skillWanted: '',
    message: ''
  });

  // Get all unique skills from all users
  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    users.forEach(user => {
      user.skillsOffered.forEach(skill => skills.add(skill));
    });
    return Array.from(skills).sort();
  }, [users]);

  // Filter users based on search and category
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (user.id === currentUser?.id) return false;
      if (!user.isPublic) return false;
      
      const matchesSearch = !searchQuery || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skillsOffered.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
        user.skillsOffered.some(skill => skill.toLowerCase() === selectedCategory.toLowerCase());
      
      return matchesSearch && matchesCategory;
    });
  }, [users, currentUser, searchQuery, selectedCategory]);

  const handleRequestSwap = (targetUser: any) => {
    setSelectedUser(targetUser);
    setRequestData({
      skillOffered: '',
      skillWanted: '',
      message: `Hi ${targetUser.name}! I'd love to exchange skills with you.`
    });
    setShowRequestModal(true);
  };

  const submitSwapRequest = () => {
    if (!currentUser || !selectedUser) return;

    const newRequest = {
      id: Date.now().toString(),
      fromUserId: currentUser.id,
      toUserId: selectedUser.id,
      fromUserName: currentUser.name,
      toUserName: selectedUser.name,
      skillOffered: requestData.skillOffered,
      skillWanted: requestData.skillWanted,
      status: 'pending' as const,
      message: requestData.message,
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_SWAP_REQUEST', payload: newRequest });
    setShowRequestModal(false);
    setSelectedUser(null);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const categories = ['all', ...allSkills.slice(0, 8)];

  // Add a results counter
  const resultCount = filteredUsers.length;
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <AnimatedBackground intensity="low" />
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing Skills
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with talented individuals and start your skill exchange journey
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
              placeholder="Search for skills or people..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'gradient-primary text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category === 'all' ? 'All Skills' : category}
              </motion.button>
            ))}
          </div>

          {/* Results Counter */}
          <div className="text-center">
            <p className="text-gray-600">
              {resultCount} {resultCount === 1 ? 'person' : 'people'} found
              {selectedCategory !== 'all' && ` for "${selectedCategory}"`}
            </p>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="skill-card"
              >
                {/* User Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      {user.location && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MapPin size={12} />
                          <span>{user.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(user.rating)}
                    <span className="text-sm text-gray-500 ml-1">({user.totalSwaps})</span>
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{user.bio}</p>
                )}

                {/* Skills Offered */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Offers:</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsOffered.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {user.skillsOffered.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        +{user.skillsOffered.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Skills Wanted */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Wants to learn:</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsWanted.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {user.skillsWanted.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        +{user.skillsWanted.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRequestSwap(user)}
                  className="w-full gradient-primary text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
                >
                  <MessageCircle size={18} />
                  <span>Request Swap</span>
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>

      {/* Swap Request Modal */}
      <AnimatePresence>
        {showRequestModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRequestModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Request Swap with {selectedUser.name}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill you'll offer:
                  </label>
                  <select
                    value={requestData.skillOffered}
                    onChange={(e) => setRequestData(prev => ({ ...prev, skillOffered: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a skill</option>
                    {currentUser?.skillsOffered.map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill you want to learn:
                  </label>
                  <select
                    value={requestData.skillWanted}
                    onChange={(e) => setRequestData(prev => ({ ...prev, skillWanted: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a skill</option>
                    {selectedUser.skillsOffered.map((skill: string) => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message:
                  </label>
                  <textarea
                    value={requestData.message}
                    onChange={(e) => setRequestData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={submitSwapRequest}
                  disabled={!requestData.skillOffered || !requestData.skillWanted}
                  className="flex-1 px-4 py-2 gradient-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Request
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrowseSkills;