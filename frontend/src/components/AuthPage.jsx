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

  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 5) strength += 1;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) strength += 1;
    return Math.max(1, Math.min(4, strength));
  };
  const pwStrength = getPasswordStrength(formData.password);
  const strengthColors = ['', 'bg-red-400', 'bg-orange-400', 'bg-eco-400', 'bg-eco-600'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin && formData.phone && formData.phone.length !== 10) {
      setError('Please enter exactly 10 digits for the phone number.');
      return;
    }

    setIsLoading(true);
    setError('');

    const url = isLogin ? `${import.meta.env.VITE_API_URL}/login` : `${import.meta.env.VITE_API_URL}/signup`;
    
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
    <div className="w-full max-w-md mx-auto mt-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-6 sm:p-10 pt-16 sm:pt-16 flex flex-col relative"
      >
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 text-neutral-400 hover:text-neutral-800 transition-colors text-sm font-medium bg-neutral-100/50 hover:bg-neutral-200 px-3 py-1.5 rounded-full"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            {isLogin ? 'Welcome Back' : 'Join EcoTwin'}
          </h2>
          <p className="text-neutral-500 text-sm">
            {isLogin ? 'Log in to continue building your twin.' : 'Create an account to track your lifestyle.'}
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
            <div className="w-12 h-12 border-4 border-eco-100 border-t-eco-600 rounded-full animate-spin mb-4" />
            <p className="text-neutral-500 font-medium text-sm animate-pulse">Syncing with EcoTwin...</p>
          </div>
        ) : (
          <>
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
                    onChange={e => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({...formData, phone: digits});
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500/50 focus:border-eco-500 transition-all placeholder:text-neutral-400"
                    placeholder="10-digit number"
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
            {!isLogin && formData.password && (
              <div className="mt-3 px-1">
                <div className="flex gap-1.5 mb-1.5">
                  {[1, 2, 3, 4].map(idx => (
                    <div key={idx} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${pwStrength >= idx ? strengthColors[pwStrength] : 'bg-neutral-200'}`} />
                  ))}
                </div>
                <div className={`text-xs text-right font-medium transition-colors ${pwStrength <= 2 ? 'text-orange-500' : 'text-eco-600'}`}>
                  {strengthLabels[pwStrength]}
                </div>
              </div>
            )}
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
        </>
        )}
      </motion.div>
    </div>
  );
}
