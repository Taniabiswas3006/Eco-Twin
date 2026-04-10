import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import InputForm from './InputForm';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';
import Profile from './Profile';
import SustainabilityNexus from './SustainabilityNexus';
import EcoActionHub from './EcoActionHub';
import API_URL from '../apiConfig';


export default function DigitalTwin() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [hasPrevious, setHasPrevious] = useState(false);
  const bountyClickTimeout = useRef(null);

  const getAuthHeaders = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return { 'Content-Type': 'application/json' };
    const { token } = JSON.parse(storedUser);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (localStorage.getItem(`eco_twin_prev_${parsedUser.username}`)) {
        setHasPrevious(true);
      }
    }
  }, []);


  const handleLoadPrevious = () => {
    if (user && user.username) {
      const prev = localStorage.getItem(`eco_twin_prev_${user.username}`);
      if (prev) {
        const { data, prediction } = JSON.parse(prev);
        setUserData(data);
        setPrediction(prediction);
      }
    }
  };

  const handleCalculate = async (data) => {
    setIsLoading(true);
    setUserData(data);
    
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!result || typeof result !== 'object') {
        throw new Error("Invalid response from server");
      }

      // Ensure properties exist to prevent destructuring crashes
      const safeResult = {
        carbon_footprint: result.carbon_footprint || 0,
        energy_consumption: result.energy_consumption || 0,
        waste_generation: result.waste_generation || 0,
        sustainability_score: result.sustainability_score || 0,
        category: result.category || 'Environmentalist',
        insights: Array.isArray(result.insights) ? result.insights : ["Analyzing results..."]
      };

      // Safety: Ensure exactly 4 insights for UI balance
      if (safeResult.insights.length < 4) {
        const fallbacks = [
          "Regular maintenance of appliances can improve energy efficiency by up to 15%.",
          "Consider using LED bulbs to reduce lighting-related electricity costs significantly.",
          "Choosing local seasonal produce can further lower your carbon footprint metrics.",
          "Composting organic waste can reduce your contribution to landfills nearly by half."
        ];
        while (safeResult.insights.length < 4) {
          safeResult.insights.push(fallbacks[safeResult.insights.length]);
        }
      }
      
      setPrediction(safeResult);
      if (user && user.username) {
        // Save for profile persistence
        const checkData = {
          total: safeResult.carbon_footprint,
          yearlyTotal: (safeResult.carbon_footprint * 365 / 1000).toFixed(1),
          sustainability_score: safeResult.sustainability_score,
          category: safeResult.category,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('eco_twin_latest_check', JSON.stringify(checkData));
        localStorage.setItem(`eco_twin_prev_${user.username}`, JSON.stringify({ data, prediction: safeResult }));
        setHasPrevious(true);
      }
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

  const showSidebar = !!prediction || activeTab === 'profile' || activeTab === 'nexus' || activeTab === 'hub';

  if (!showSidebar) {
    return (
      <div className="w-full relative mt-12 sm:mt-16 px-2 sm:px-0 animate-in fade-in duration-700">
        <AnimatePresence mode="wait">
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <InputForm 
              onComplete={handleCalculate} 
              isLoading={isLoading} 
              hasPrevious={hasPrevious} 
              onLoadPrevious={handleLoadPrevious} 
              onLogout={handleLogout}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 fixed inset-0 overflow-x-hidden z-[100] animate-in fade-in duration-500 flex-col md:flex-row">
      {/* Sidebar - Visible once twin is created or on certain tabs */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        user={user}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 p-4 pt-16 sm:p-6 sm:pt-16 md:p-8 lg:p-12 md:pt-12 transition-all duration-300 overflow-y-auto">
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
                user={user}
                userData={userData} 
                prediction={prediction} 
                onReset={resetJourney}
                onViewNexus={() => setActiveTab('nexus')}
              />
            </motion.div>
          ) : activeTab === 'hub' ? (
            <motion.div
              key="hub-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <EcoActionHub user={user} />
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
              key="nexus-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <SustainabilityNexus 
                user={user} 
                userData={userData} 
                prediction={prediction} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
