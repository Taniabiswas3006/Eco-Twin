import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Shield, Edit3, ChevronRight, Settings, Bell, Lock, Check, X, Camera } from 'lucide-react';

export default function Profile({ user: initialUser }) {
  const [user, setUser] = useState(initialUser || { username: 'Tania', name: 'Tania Biswas', phone: '+91 98765 43210' });
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingPrefs, setIsEditingPrefs] = useState(false);
  const [editedData, setEditedData] = useState({ ...user });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!initialUser?.username) return;
      setIsLoading(true);
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/get-profile?username=${initialUser.username}`);
        if (resp.ok) {
          const data = await resp.json();
          const fullUser = { ...initialUser, ...data };
          setUser(fullUser);
          setEditedData(fullUser);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [initialUser]);

  const handleSaveBasic = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          name: editedData.name,
          phone: editedData.phone
        })
      });
      
      if (resp.ok) {
        const updated = { ...user, name: editedData.name, phone: editedData.phone };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        setIsEditingBasic(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const profileItems = [
    { key: 'name', label: 'Full Name', value: user?.name || 'Not provided', icon: <User size={18} /> },
    { key: 'email', label: 'Email Address', value: user?.email || 'Not provided', icon: <Mail size={18} />, readonly: true },
    { key: 'phone', label: 'Phone Number', value: user?.phone || 'Not provided', icon: <Phone size={18} /> },
  ];

  const settingsItems = [
    { label: 'Notifications', icon: <Bell size={18} />, desc: 'Manage alerts and updates' },
    { label: 'Privacy & Security', icon: <Lock size={18} />, desc: 'Password and data control' },
    { label: 'Account Settings', icon: <Settings size={18} />, desc: 'Preferences and language' },
  ];

  return (
    <div className="max-w-3xl mx-auto py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full bg-white border border-neutral-100 p-1.5 shadow-sm">
            <div className="w-full h-full rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 font-bold text-3xl overflow-hidden border border-neutral-100 uppercase">
              {user?.username?.charAt(0) || 'T'}
            </div>
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-white border border-neutral-100 rounded-full shadow-sm hover:bg-neutral-50 transition-colors">
            <Camera size={14} className="text-neutral-500" />
          </button>
        </div>
        
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{user?.username || 'Eco Enthusiast'}</h1>
        <p className="text-neutral-400 text-sm mt-1 mb-4">Silver Tier Member • Joined Mar 2026</p>
        
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-eco-50 text-eco-700 text-[11px] font-bold rounded-full uppercase tracking-widest border border-eco-100/50">
            Certified Eco-User
          </span>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-full uppercase tracking-widest border border-blue-100/50 flex items-center gap-1">
            <Shield size={10} /> Verified
          </span>
        </div>
      </div>

      <div className="space-y-12">
        {/* Profile Details Group */}
        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em]">Basic Information</h3>
            {!isEditingBasic ? (
              <button 
                onClick={() => setIsEditingBasic(true)}
                className="text-xs font-bold text-eco-600 hover:text-eco-700 flex items-center gap-1 transition-colors"
              >
                <Edit3 size={12} /> Edit
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditingBasic(false)}
                  className="text-xs font-bold text-neutral-400 hover:text-neutral-600 flex items-center gap-1 transition-colors"
                >
                  <X size={12} /> Cancel
                </button>
                <button 
                  onClick={handleSaveBasic}
                  disabled={isLoading}
                  className="text-xs font-bold text-eco-600 hover:text-eco-700 flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  {isLoading ? '...' : <><Check size={12} /> Save</>}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white border border-neutral-100 rounded-[24px] overflow-hidden shadow-sm">
            {profileItems.map((item, idx) => (
              <div key={idx} className={`flex items-center justify-between p-5 transition-colors ${idx !== profileItems.length - 1 ? 'border-b border-neutral-50' : ''}`}>
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-500 border border-neutral-100/50 text-sm">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-tighter mb-0.5">{item.label}</p>
                    {isEditingBasic && !item.readonly ? (
                      <input 
                        className="w-full text-sm font-semibold text-neutral-800 bg-neutral-50 border-b border-eco-500/30 focus:border-eco-500 outline-none rounded px-1 -mx-1"
                        value={editedData[item.key] || ''}
                        onChange={(e) => setEditedData({...editedData, [item.key]: e.target.value})}
                      />
                    ) : (
                      <p className="text-sm font-semibold text-neutral-800 truncate">{item.value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Settings Group */}
        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em]">Preferences</h3>
            {!isEditingPrefs ? (
              <button 
                onClick={() => setIsEditingPrefs(true)}
                className="text-xs font-bold text-eco-600 hover:text-eco-700 flex items-center gap-1 transition-colors"
              >
                <Edit3 size={12} /> Edit
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditingPrefs(false)}
                  className="text-xs font-bold text-neutral-400 hover:text-neutral-600 flex items-center gap-1 transition-colors"
                >
                  <X size={12} /> Cancel
                </button>
                <button 
                  onClick={() => setIsEditingPrefs(false)}
                  className="text-xs font-bold text-eco-600 hover:text-eco-700 flex items-center gap-1 transition-colors"
                >
                  <Check size={12} /> Save
                </button>
              </div>
            )}
          </div>

          <div className="bg-white border border-neutral-100 rounded-[24px] overflow-hidden shadow-sm">
            {settingsItems.map((item, idx) => (
              <div key={idx} className={`flex items-center justify-between p-5 hover:bg-neutral-50/50 transition-colors cursor-pointer group ${idx !== settingsItems.length - 1 ? 'border-b border-neutral-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:text-eco-600 transition-colors border border-neutral-100/50 text-sm">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{item.label}</p>
                    <p className="text-[11px] text-neutral-400 font-medium">{item.desc}</p>
                  </div>
                </div>
                {isEditingPrefs ? (
                   <input type="checkbox" className="w-5 h-5 accent-eco-600 rounded" defaultChecked />
                ) : (
                  <ChevronRight size={16} className="text-neutral-300 group-hover:text-neutral-900 translate-x-0 group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <div className="pt-4 flex justify-center">
          <button className="text-xs font-bold text-red-400 hover:text-red-500 transition-colors uppercase tracking-[0.1em] py-2 px-4 hover:bg-red-50 rounded-lg">
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  );
}
