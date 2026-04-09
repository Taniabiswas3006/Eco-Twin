import { useState, useEffect } from 'react';
import { LayoutDashboard, User, Trophy, LogOut, Leaf, Menu, X, Calculator } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout, user }) {
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route/tab change (mobile UX)
  useEffect(() => {
    setIsOpen(false);
  }, [activeTab]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'footprint', label: 'Carbon Footprint', icon: <Calculator size={20} /> },
    { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
    { id: 'bounties', label: 'Impact Bounties', icon: <Trophy size={20} /> },
  ];

  const sidebarContent = (
    <>
      <div className="p-5 md:p-6 border-b border-neutral-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-eco-500 text-white flex items-center justify-center font-bold shadow-lg shadow-eco-500/20 text-sm">
            E
          </div>
          <div>
            <h2 className="font-bold text-neutral-900 tracking-tight text-sm md:text-base">EcoTwin</h2>
            <p className="text-[9px] md:text-[10px] text-eco-600 font-bold uppercase tracking-widest mt-0.5">Lifestyle Model</p>
          </div>
        </div>
        {/* Close button - mobile only */}
        <button 
          onClick={() => setIsOpen(false)} 
          className="md:hidden p-2 -mr-2 rounded-xl text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
          aria-label="Close navigation menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-3 md:p-4 flex flex-col gap-1 md:gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 md:py-3 rounded-xl transition-all duration-200 group ${
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

      <div className="p-3 md:p-4 border-t border-neutral-50">
        <div className="bg-neutral-50 rounded-2xl p-3.5 md:p-4 mb-3 md:mb-4 flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 font-bold border-2 border-white shadow-sm overflow-hidden text-sm flex-shrink-0">
            {user?.username?.charAt(0).toUpperCase() || <User size={18} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900 truncate">{user?.username || 'Guest User'}</p>
            <p className="text-[11px] text-neutral-500 font-medium">Standard Member</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 md:py-3 rounded-xl text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[200] p-2.5 bg-white/90 backdrop-blur-md border border-neutral-200/50 rounded-xl shadow-lg hover:bg-neutral-50 transition-all active:scale-95"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
      >
        <Menu size={20} className="text-neutral-700" />
      </button>

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[150] transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <div 
        className={`
          bg-white border-r border-neutral-100 flex flex-col h-screen z-[200]
          fixed left-0 top-0
          w-[280px] md:w-64
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {sidebarContent}
      </div>
    </>
  );
}
