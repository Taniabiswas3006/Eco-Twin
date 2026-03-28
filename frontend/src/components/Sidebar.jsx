import { LayoutDashboard, User, Settings, LogOut, Leaf } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout, user }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-neutral-100 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-neutral-50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-eco-500 text-white flex items-center justify-center font-bold shadow-lg shadow-eco-500/20">
          E
        </div>
        <div>
          <h2 className="font-bold text-neutral-900 tracking-tight">EcoTwin</h2>
          <p className="text-[10px] text-eco-600 font-bold uppercase tracking-widest mt-0.5">Lifestyle Model</p>
        </div>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-eco-50 text-eco-700 font-semibold shadow-sm shadow-eco-500/5' 
                : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
            }`}
          >
            <div className={`${activeTab === item.id ? 'text-eco-600' : 'text-neutral-400 group-hover:text-neutral-600'} transition-colors`}>
              {item.icon}
            </div>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-50">
        <div className="bg-neutral-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 font-bold border-2 border-white shadow-sm overflow-hidden">
            {user?.username?.charAt(0).toUpperCase() || <User size={20} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900 truncate">{user?.username || 'Guest User'}</p>
            <p className="text-[11px] text-neutral-500 font-medium">Standard Member</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
