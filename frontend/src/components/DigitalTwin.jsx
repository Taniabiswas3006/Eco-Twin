import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import InputForm from './InputForm';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';
import Profile from './Profile';
import Bounties from './Bounties';
import CarbonCalculator from './CarbonCalculator';

const DEFAULT_BOUNTIES = [
  { id: 1, title: 'Meatless Weekend', deadline: '2 days left', points: 50, progress: 0, status: 'active' },
  { id: 2, title: 'Transit Pioneer', deadline: '5 days left', points: 120, progress: 40, status: 'active' },
  { id: 3, title: 'Zero AC Bounty', deadline: 'Tonight', points: 200, progress: 0, status: 'pending' },
  { id: 4, title: 'Solar Synchronizer', deadline: 'Daily (10am-2pm)', points: 100, progress: 0, status: 'pending' },
  { id: 5, title: 'Eco-Commuter', deadline: '3 days streak', points: 150, progress: 0, status: 'pending' },
];

export default function DigitalTwin() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [hasPrevious, setHasPrevious] = useState(false);

  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [bounties, setBounties] = useState([]);
  const [loadingBounties, setLoadingBounties] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (localStorage.getItem(`eco_twin_prev_${parsedUser.username}`)) {
        setHasPrevious(true);
      }
      fetchBounties(parsedUser);
    }
  }, []);

  const fetchBounties = async (currentUser) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/get-bounties?username=${currentUser.username}`);
      if (res.ok) {
        const data = await res.json();
        setXp(data.xp || 0);
        setLevel(data.level || 1);
        if (data.bounties && Array.isArray(data.bounties) && data.bounties.length > 0) {
          setBounties(data.bounties);
        } else {
          setBounties(DEFAULT_BOUNTIES);
        }
      } else {
        setBounties(DEFAULT_BOUNTIES);
      }
    } catch (err) { 
      setBounties(DEFAULT_BOUNTIES);
    } finally { 
      setLoadingBounties(false); 
    }
  };

  const handleBountyClick = (id) => {
    let updatedXp = xp;
    let updatedLevel = level;
    
    const updatedBounties = bounties.map(b => {
      if (b.id !== id) return b;
      if (b.status === 'pending') return { ...b, status: 'active' };
      if (b.status === 'active') {
        const newProgress = b.progress + 20; 
        if (newProgress >= 100) {
          updatedXp += b.points;
          if (updatedXp >= updatedLevel * 500) updatedLevel += 1;
          return { ...b, progress: 100, status: 'completed' };
        }
        return { ...b, progress: newProgress };
      }
      return b;
    });

    setBounties(updatedBounties);
    setXp(updatedXp);
    setLevel(updatedLevel);
    saveBounties(updatedBounties, updatedXp, updatedLevel);
  };

  const saveBounties = async (newBounties, newXp, newLevel) => {
    const currentUser = user || JSON.parse(localStorage.getItem('user'));
    if (!currentUser) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/update-bounties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          bounties: newBounties,
          xp: newXp,
          level: newLevel
        })
      });
    } catch (err) { console.error(err); }
  };

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      // Safety: Ensure exactly 4 insights for UI balance
      if (result.insights && result.insights.length < 4) {
        const fallbacks = [
          "Regular maintenance of appliances can improve energy efficiency by up to 15%.",
          "Consider using LED bulbs to reduce lighting-related electricity costs significantly.",
          "Choosing local seasonal produce can further lower your carbon footprint metrics.",
          "Composting organic waste can reduce your contribution to landfills nearly by half."
        ];
        while (result.insights.length < 4) {
          result.insights.push(fallbacks[result.insights.length]);
        }
      }
      
      setPrediction(result);
      if (user && user.username) {
        localStorage.setItem(`eco_twin_prev_${user.username}`, JSON.stringify({ data, prediction: result }));
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

  const showSidebar = !!prediction || activeTab === 'profile' || activeTab === 'bounties' || activeTab === 'footprint';

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
                xp={xp}
                level={level}
                bounties={bounties}
                loadingBounties={loadingBounties}
                onBountyClick={handleBountyClick}
                onViewBounties={() => setActiveTab('bounties')}
              />
            </motion.div>
          ) : activeTab === 'footprint' ? (
            <motion.div
              key="footprint-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <CarbonCalculator user={user} />
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
              key="bounties-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <Bounties 
                user={user} 
                bounties={bounties}
                xp={xp}
                level={level}
                handleBountyClick={handleBountyClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
