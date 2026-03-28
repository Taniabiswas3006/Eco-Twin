import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, ArrowLeft, Phone, BadgeInfo } from 'lucide-react';

export default function AuthPage({ mode = 'login' }) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    username: '', password: '', name: '', phone: '', gender: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const url = isLogin ? 'http://localhost:5000/login' : 'http://localhost:5000/signup';
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Success
        localStorage.setItem('user', JSON.stringify({ username: data.username, token: data.token }));
        navigate('/app');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative mt-16">
      <button 
        onClick={() => navigate(-1)}
        className="absolute -top-12 left-0 flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors font-medium text-sm bg-white/50 px-3 py-1.5 rounded-full border border-neutral-200 shadow-sm backdrop-blur-sm"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-10 flex flex-col"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            {isLogin ? 'Welcome Back' : 'Join EcoTwin'}
          </h2>
          <p className="text-neutral-500 text-sm">
            {isLogin ? 'Log in to continue building your twin.' : 'Create an account to track your lifestyle.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <BadgeInfo size={18} />
                  </div>
                  <input 
                    type="text" 
                    required={!isLogin}
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500/50 focus:border-eco-500 transition-all placeholder:text-neutral-400"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5 ml-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Phone size={18} />
                  </div>
                  <input 
                    type="tel" 
                    required={!isLogin}
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500/50 focus:border-eco-500 transition-all placeholder:text-neutral-400"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5 ml-1">Gender</label>
                <select 
                  required={!isLogin}
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500/50 focus:border-eco-500 transition-all text-neutral-700"
                >
                  <option value="" disabled>Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5 ml-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <User size={18} />
              </div>
              <input 
                type="text" 
                required
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500/50 focus:border-eco-500 transition-all placeholder:text-neutral-400"
                placeholder="Enter your username"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500/50 focus:border-eco-500 transition-all placeholder:text-neutral-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="mt-4 bg-eco-600 hover:bg-eco-700 text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 shadow-md shadow-eco-600/20"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isLogin ? (
              <>Sign In <ArrowRight size={18} /></>
            ) : (
              <>Create Account <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link 
            to={isLogin ? '/signup' : '/login'} 
            className="font-medium text-eco-600 hover:text-eco-800 transition-colors"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
