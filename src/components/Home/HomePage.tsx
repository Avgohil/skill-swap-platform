import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Zap, Shield, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import FloatingSkills from '../3D/FloatingSkills';
import InteractiveOrbContainer from '../3D/InteractiveOrb';

const HomePage: React.FC = () => {
  const { state, dispatch } = useApp();
  const { isAuthenticated } = state;

  const popularSkills = [
    'React', 'Python', 'Design', 'Marketing', 'Photography', 'Writing'
  ];

  const features = [
    {
      icon: Users,
      title: 'Connect & Learn',
      description: 'Connect with skilled individuals and learn from each other through structured skill exchanges.'
    },
    {
      icon: Zap,
      title: 'Instant Matching',
      description: 'Our smart algorithm matches you with the perfect skill exchange partners based on your interests.'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'All users are verified and rated by the community for a safe and trustworthy experience.'
    },
    {
      icon: Star,
      title: 'Quality Assured',
      description: 'Rate and review your exchanges to maintain high-quality interactions within the community.'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+' },
    { label: 'Skills Exchanged', value: '50,000+' },
    { label: 'Success Rate', value: '95%' },
    { label: 'Countries', value: '120+' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50" />
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-40">
          <InteractiveOrbContainer orbCount={2} />
        </div>
        <div className="absolute inset-0 opacity-30">
          <FloatingSkills skills={popularSkills} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
            >
              Exchange Skills,{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Grow Together
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Connect with talented individuals worldwide. Share your expertise and learn new skills 
              through meaningful exchanges in our vibrant community.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {!isAuthenticated ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'register' })}
                    className="px-8 py-4 gradient-primary text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2"
                  >
                    <span>Start Exchanging</span>
                    <ArrowRight size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'browse' })}
                    className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl border-2 border-purple-200 transition-all"
                  >
                    Explore Skills
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'browse' })}
                    className="px-8 py-4 gradient-primary text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2"
                  >
                    <span>Browse Skills</span>
                    <ArrowRight size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'profile' })}
                    className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl border-2 border-purple-200 transition-all"
                  >
                    My Profile
                  </motion.button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose SkillSwap?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is designed to make skill exchange simple, safe, and rewarding for everyone.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Start Learning?
              </h2>
              <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                Join thousands of learners and experts sharing knowledge every day.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'register' })}
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Join SkillSwap Today
              </motion.button>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;