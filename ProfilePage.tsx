import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Star, Plus, X, Edit, Save, Globe, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import InteractiveOrbContainer from '../3D/InteractiveOrb';

const ProfilePage: React.FC = () => {
  const { state, dispatch } = useApp();
  const { user } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    isPublic: user?.isPublic || true
  });
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  if (!user) return null;

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: editData
    });
    setIsEditing(false);
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim()) {
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: {
          skillsOffered: [...(user.skillsOffered || []), newSkillOffered.trim()]
        }
      });
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim()) {
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: {
          skillsWanted: [...(user.skillsWanted || []), newSkillWanted.trim()]
        }
      });
      setNewSkillWanted('');
    }
  };

  const removeSkillOffered = (skill: string) => {
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        skillsOffered: user.skillsOffered.filter(s => s !== skill)
      }
    });
  };

  const removeSkillWanted = (skill: string) => {
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        skillsWanted: user.skillsWanted.filter(s => s !== skill)
      }
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed top-20 left-0 w-1/4 h-1/2 opacity-20 pointer-events-none">
        <InteractiveOrbContainer orbCount={1} />
      </div>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="gradient-primary p-8 text-white relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User size={40} className="text-white" />
                </div>
                <div>
                  {isEditing ? (
                    <input
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="text-3xl font-bold bg-white/20 rounded-lg px-3 py-1 text-white placeholder-white/70"
                      placeholder="Your name"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                  )}
                  <div className="flex items-center space-x-4 mt-2">
                    {isEditing ? (
                      <input
                        value={editData.location}
                        onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-white/20 rounded-lg px-3 py-1 text-white placeholder-white/70"
                        placeholder="Your location"
                      />
                    ) : (
                      user.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin size={16} />
                          <span>{user.location}</span>
                        </div>
                      )
                    )}
                    <div className="flex items-center space-x-1">
                      {renderStars(user.rating)}
                      <span className="text-sm ml-1">({user.totalSwaps} swaps)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (isEditing) {
                      dispatch({
                        type: 'UPDATE_PROFILE',
                        payload: { isPublic: !editData.isPublic }
                      });
                      setEditData(prev => ({ ...prev, isPublic: !prev.isPublic }));
                    }
                  }}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  title={editData.isPublic ? 'Public Profile' : 'Private Profile'}
                >
                  {editData.isPublic ? <Globe size={20} /> : <Lock size={20} />}
                </button>
                {isEditing ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 rounded-lg font-medium"
                  >
                    <Save size={18} />
                    <span>Save</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <Edit size={18} />
                    <span>Edit</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Bio */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
              {isEditing ? (
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Tell others about yourself and your expertise..."
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {user.bio || 'No bio added yet. Click edit to add one!'}
                </p>
              )}
            </div>

            {/* Skills Offered */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills I Offer</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                {user.skillsOffered.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2 px-4 py-2 gradient-primary text-white rounded-full"
                  >
                    <span>{skill}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeSkillOffered(skill)}
                        className="hover:bg-white/20 rounded-full p-1 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
              {isEditing && (
                <div className="flex space-x-2">
                  <input
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Add a skill you can teach"
                    onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addSkillOffered}
                    className="px-4 py-2 gradient-primary text-white rounded-lg font-medium flex items-center space-x-1"
                  >
                    <Plus size={18} />
                    <span>Add</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* Skills Wanted */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills I Want to Learn</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                {user.skillsWanted.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2 px-4 py-2 gradient-secondary text-white rounded-full"
                  >
                    <span>{skill}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeSkillWanted(skill)}
                        className="hover:bg-white/20 rounded-full p-1 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
              {isEditing && (
                <div className="flex space-x-2">
                  <input
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Add a skill you want to learn"
                    onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addSkillWanted}
                    className="px-4 py-2 gradient-secondary text-white rounded-lg font-medium flex items-center space-x-1"
                  >
                    <Plus size={18} />
                    <span>Add</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;