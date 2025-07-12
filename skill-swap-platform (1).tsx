import React, { useState, useEffect } from 'react';
import { Search, Plus, X, User, MessageCircle, Star, Eye, EyeOff, Send, Check, Trash2, Edit3, Filter } from 'lucide-react';

// Type definitions
type Skill = {
  name: string;
  description: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  profilePic: string;
  isPublic: boolean;
  offeredSkills: Skill[];
  wantedSkills: Skill[];
};

type SwapRequest = {
  id: number;
  from: number;
  to: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
};

const SkillSwapPlatform = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkill, setNewSkill] = useState({ type: 'offer', name: '', description: '' });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [swapMessage, setSwapMessage] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Initialize demo data
  useEffect(() => {
    const demoUsers = [
      {
        id: 1,
        name: 'Alex Chen',
        email: 'alex@example.com',
        profilePic: '👨‍💻',
        isPublic: true,
        offeredSkills: [
          { name: 'React Development', description: 'Frontend React apps with modern hooks' },
          { name: 'UI/UX Design', description: 'Clean, modern interface design' }
        ],
        wantedSkills: [
          { name: 'Python', description: 'Backend development with Python' },
          { name: 'Photography', description: 'Portrait and landscape photography' }
        ]
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        profilePic: '👩‍🎨',
        isPublic: true,
        offeredSkills: [
          { name: 'Graphic Design', description: 'Logo design and branding' },
          { name: 'Photography', description: 'Event and product photography' }
        ],
        wantedSkills: [
          { name: 'Web Development', description: 'Building responsive websites' },
          { name: 'Video Editing', description: 'Professional video post-production' }
        ]
      },
      {
        id: 3,
        name: 'Mike Rodriguez',
        email: 'mike@example.com',
        profilePic: '👨‍🔬',
        isPublic: false,
        offeredSkills: [
          { name: 'Data Science', description: 'Machine learning and analytics' },
          { name: 'Python', description: 'Backend APIs and automation' }
        ],
        wantedSkills: [
          { name: 'Marketing', description: 'Digital marketing strategies' },
          { name: 'Public Speaking', description: 'Presentation skills' }
        ]
      }
    ];
    setUsers(demoUsers);
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setShowLogin(false);
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    
    if (!currentUser) return;
    if (!currentUser) return;
    if (!currentUser) return;
    if (!currentUser) return;
    if (!currentUser) return;
    if (!currentUser) return;
    const updatedUsers = users.map(user => {
      if (currentUser && user.id === currentUser.id) {
        const skillData = { name: newSkill.name, description: newSkill.description };
        const updated = { ...user };
        if (newSkill.type === 'offer') {
          updated.offeredSkills = [...user.offeredSkills, skillData];
        } else {
          updated.wantedSkills = [...user.wantedSkills, skillData];
        }
        setCurrentUser(updated);
        return updated;
      }
      return user;
    });
    
    setUsers(updatedUsers);
    setNewSkill({ type: 'offer', name: '', description: '' });
    setShowAddSkill(false);
  };

  const handleRemoveSkill = (skillName, skillType) => {
    const updatedUsers = users.map(user => {
      if (currentUser && user.id === currentUser.id) {
        const updated = { ...user };
        if (skillType === 'offer') {
          updated.offeredSkills = user.offeredSkills.filter(skill => skill.name !== skillName);
        } else {
          updated.wantedSkills = user.wantedSkills.filter(skill => skill.name !== skillName);
        }
        setCurrentUser(updated);
        return updated;
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const handleSendSwapRequest = () => {
    if (!currentUser || !selectedUser || !swapMessage.trim()) return;
    
    const newRequest: SwapRequest = {
      id: Date.now(),
      from: currentUser.id,
      to: selectedUser.id,
      message: swapMessage,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    setSwapRequests([...swapRequests, newRequest]);
    setSwapMessage('');
    setSelectedUser(null);
    alert('Swap request sent!');
  };

  const handleSwapResponse = (requestId, response) => {
    setSwapRequests(swapRequests.map(req => 
      req.id === requestId 
        ? { ...req, status: response }
        : req
    ));
  };

  const handleDeleteRequest = (requestId) => {
    setSwapRequests(swapRequests.filter(req => req.id !== requestId));
  };

  const toggleProfileVisibility = () => {
    const updatedUsers = users.map(user => {
      if (currentUser && user.id === currentUser.id) {
        const updated = { ...user, isPublic: !user.isPublic };
        setCurrentUser(updated);
        return updated;
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const filteredUsers = users.filter(user => {
    if (user.id === currentUser?.id) return false;
    if (!user.isPublic) return false;
    
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.offeredSkills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.wantedSkills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'offers') return matchesSearch && user.offeredSkills.length > 0;
    if (filterType === 'wants') return matchesSearch && user.wantedSkills.length > 0;
    
    return matchesSearch;
  });

  const myRequests = swapRequests.filter(req => req.from === currentUser?.id);
  const incomingRequests = swapRequests.filter(req => req.to === currentUser?.id);

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Skill Swap 🔁</h1>
            <p className="text-gray-600">Connect, swap, and learn together</p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose a Demo User:</h2>
            {users.map((user: User) => (
              <button
              key={user.id}
              onClick={() => handleLogin(user)}
              className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center space-x-3"
              >
              <span className="text-2xl">{user.profilePic}</span>
              <div className="text-left">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Skill Swap Platform 🔁</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {currentUser?.name}!</span>
              <button
                onClick={() => setShowLogin(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex space-x-1 p-2">
            {['browse', 'profile', 'requests'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab === 'browse' && '🔍 Browse Users'}
                {tab === 'profile' && '👤 My Profile'}
                {tab === 'requests' && '📩 Swap Requests'}
              </button>
            ))}
          </div>
        </nav>

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Users</option>
                  <option value="offers">Has Offers</option>
                  <option value="wants">Has Wants</option>
                </select>
              </div>
            </div>

            {/* User Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(user => (
                <div key={user.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">{user.profilePic}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-600 mb-2">🎯 Offers:</h4>
                      <div className="space-y-1">
                        {user.offeredSkills.map((skill, idx) => (
                          <div key={idx} className="bg-green-50 p-2 rounded-lg">
                            <p className="font-medium text-green-800">{skill.name}</p>
                            <p className="text-sm text-green-600">{skill.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-blue-600 mb-2">🔍 Wants:</h4>
                      <div className="space-y-1">
                        {user.wantedSkills.map((skill, idx) => (
                          <div key={idx} className="bg-blue-50 p-2 rounded-lg">
                            <p className="font-medium text-blue-800">{skill.name}</p>
                            <p className="text-sm text-blue-600">{skill.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedUser(user)}
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Swap Request</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">{currentUser?.profilePic}</span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{currentUser?.name}</h2>
                  <p className="text-gray-600">{currentUser?.email}</p>
                </div>
              </div>
              <button
                onClick={toggleProfileVisibility}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentUser?.isPublic 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {currentUser?.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span>{currentUser?.isPublic ? 'Public' : 'Private'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Offered Skills */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-600">🎯 Skills I Offer</h3>
                  <button
                    onClick={() => {
                      setNewSkill({ type: 'offer', name: '', description: '' });
                      setShowAddSkill(true);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {currentUser?.offeredSkills.map((skill, idx) => (
                    <div key={idx} className="bg-green-50 p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800">{skill.name}</p>
                        <p className="text-sm text-green-600">{skill.description}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveSkill(skill.name, 'offer')}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wanted Skills */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-600">🔍 Skills I Want</h3>
                  <button
                    onClick={() => {
                      setNewSkill({ type: 'want', name: '', description: '' });
                      setShowAddSkill(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {currentUser?.wantedSkills.map((skill, idx) => (
                    <div key={idx} className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-800">{skill.name}</p>
                        <p className="text-sm text-blue-600">{skill.description}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveSkill(skill.name, 'want')}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Sent Requests */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📤 Sent Requests</h3>
              <div className="space-y-3">
                {myRequests.map(request => {
                  const toUser = users.find(u => u.id === request.to);
                  return (
                    <div key={request.id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">To: {toUser?.name}</p>
                        <p className="text-sm text-gray-600">{request.message}</p>
                        <p className="text-xs text-gray-500">
                          Status: <span className={`font-medium ${
                            request.status === 'pending' ? 'text-yellow-600' :
                            request.status === 'accepted' ? 'text-green-600' :
                            'text-red-600'
                          }`}>{request.status}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteRequest(request.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
                {myRequests.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No sent requests yet</p>
                )}
              </div>
            </div>

            {/* Incoming Requests */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📥 Incoming Requests</h3>
              <div className="space-y-3">
                {incomingRequests.map(request => {
                  const fromUser = users.find(u => u.id === request.from);
                  return (
                    <div key={request.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-800">From: {fromUser?.name}</p>
                        <p className="text-xs text-gray-500">
                          Status: <span className={`font-medium ${
                            request.status === 'pending' ? 'text-yellow-600' :
                            request.status === 'accepted' ? 'text-green-600' :
                            'text-red-600'
                          }`}>{request.status}</span>
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{request.message}</p>
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSwapResponse(request.id, 'accepted')}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleSwapResponse(request.id, 'rejected')}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {incomingRequests.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No incoming requests yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Skill Modal */}
        {showAddSkill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Add {newSkill.type === 'offer' ? 'Offered' : 'Wanted'} Skill
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Web Development"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newSkill.description}
                    onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description of your skill level and what you can offer/want"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddSkill}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Add Skill
                </button>
                <button
                  onClick={() => setShowAddSkill(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Send Swap Request Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Send Swap Request to {selectedUser.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={swapMessage}
                    onChange={(e) => setSwapMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Hi! I'd like to swap skills with you. I can offer... and I'm looking for..."
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSendSwapRequest}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Send Request
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillSwapPlatform;