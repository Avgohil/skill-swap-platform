import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  rating: number;
  totalSwaps: number;
  isAdmin: boolean;
  isPublic: boolean;
  bio?: string;
}

interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  skillOffered: string;
  skillWanted: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message: string;
  createdAt: string;
  rating?: number;
  feedback?: string;
}

interface AppState {
  user: User | null;
  users: User[];
  swapRequests: SwapRequest[];
  isAuthenticated: boolean;
  currentView: string;
  searchQuery: string;
  selectedSkill: string | null;
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'SET_VIEW'; payload: string }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_SELECTED_SKILL'; payload: string | null }
  | { type: 'ADD_SWAP_REQUEST'; payload: SwapRequest }
  | { type: 'UPDATE_SWAP_REQUEST'; payload: { id: string; updates: Partial<SwapRequest> } }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: { id: string; updates: Partial<User> } }
  | { type: 'DELETE_USER'; payload: string };

const initialState: AppState = {
  user: null,
  users: [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      skillsOffered: ['React', 'TypeScript', 'UI/UX Design'],
      skillsWanted: ['Python', 'Machine Learning', 'DevOps'],
      rating: 4.8,
      totalSwaps: 12,
      isAdmin: false,
      isPublic: true,
      bio: 'Frontend developer passionate about creating beautiful user experiences.',
      location: 'San Francisco, CA'
    },
    {
      id: '2',
      name: 'Admin User',
      email: 'admin@skillswap.com',
      skillsOffered: ['Platform Management', 'Community Building'],
      skillsWanted: ['Feedback', 'User Insights'],
      rating: 5.0,
      totalSwaps: 0,
      isAdmin: true,
      isPublic: false,
      bio: 'Platform administrator focused on building an amazing community.'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      skillsOffered: ['Python', 'Data Science', 'Machine Learning'],
      skillsWanted: ['React', 'Mobile Development', 'Design'],
      rating: 4.9,
      totalSwaps: 8,
      isAdmin: false,
      isPublic: true,
      bio: 'Data scientist who loves turning complex problems into simple solutions.',
      location: 'New York, NY'
    }
  ],
  swapRequests: [
    {
      id: '1',
      fromUserId: '1',
      toUserId: '3',
      fromUserName: 'Sarah Johnson',
      toUserName: 'Mike Chen',
      skillOffered: 'React',
      skillWanted: 'Python',
      status: 'pending',
      message: 'Hi Mike! I\'d love to learn Python from you in exchange for React knowledge.',
      createdAt: '2024-01-15T10:00:00Z'
    }
  ],
  isAuthenticated: false,
  currentView: 'home',
  searchQuery: '',
  selectedSkill: null
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, currentView: 'home' };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
        users: state.users.map(user =>
          user.id === state.user?.id ? { ...user, ...action.payload } : user
        )
      };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_SKILL':
      return { ...state, selectedSkill: action.payload };
    case 'ADD_SWAP_REQUEST':
      return { ...state, swapRequests: [...state.swapRequests, action.payload] };
    case 'UPDATE_SWAP_REQUEST':
      return {
        ...state,
        swapRequests: state.swapRequests.map(request =>
          request.id === action.payload.id
            ? { ...request, ...action.payload.updates }
            : request
        )
      };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? { ...user, ...action.payload.updates } : user
        )
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};