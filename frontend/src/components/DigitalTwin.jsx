import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import InputForm from './InputForm';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';
import Profile from './Profile';
import Settings from './Settings';

export default function DigitalTwin() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleCalculate = async (data) => {
    setIsLoading(true);
    setUserData(data);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      setPrediction(result);
    } catch (error) {
      console.error("Error predicting:", error);
      setPrediction({
        carbon_footprint: 320.5,
        energy_consumption: 140.2,
        waste_generation: 6.5,
        sustainability_score: 72.4,
        category: 'Eco-conscious',
        insights: ["You consume more energy than efficient users. Consider reducing AC usage."]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetJourney = () => {
    setUserData(null);
    setPrediction(null);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const showSidebar = !!prediction || activeTab === 'profile' || activeTab === 'settings';

  if (!showSidebar) {
    return (
      <div className="w-full relative mt-16 animate-in fade-in duration-700">
        <button 
          onClick={handleLogout}
          className="absolute -top-12 left-0 z-50 flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors font-medium text-sm bg-white/50 px-3 py-1.5 rounded-full border border-neutral-200 shadow-sm backdrop-blur-sm"
        >
          <ArrowLeft size={16} /> Log Out
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <InputForm onComplete={handleCalculate} isLoading={isLoading} />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 fixed inset-0 overflow-x-hidden z-[100] animate-in fade-in duration-500">
      {/* Sidebar - Visible once twin is created or on certain tabs */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        user={user}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-12 transition-all duration-300 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <Dashboard 
                userData={userData} 
                prediction={prediction} 
                onReset={resetJourney} 
              />
            </motion.div>
          ) : activeTab === 'profile' ? (
            <motion.div
              key="profile-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <Profile user={user} />
            </motion.div>
          ) : (
            <motion.div
              key="settings-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <Settings />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
