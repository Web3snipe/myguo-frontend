"use client";

import { LayoutDashboard, Compass, Bot, Briefcase, Settings, HelpCircle, MessageSquare, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter, usePathname } from 'next/navigation';

export default function LeftSidebar() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const { logout } = usePrivy();
  const router = useRouter();
  const pathname = usePathname();

  // Update active item based on current route
  useEffect(() => {
    if (pathname === '/') setActiveItem('dashboard');
    else if (pathname === '/discovery') setActiveItem('discovery');
    else if (pathname === '/agent') setActiveItem('agents');
    else if (pathname === '/portfolio') setActiveItem('portfolio');
  }, [pathname]);

  const mainMenuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { id: 'portfolio', icon: Briefcase, label: 'Portfolio', href: '/portfolio' },
    { id: 'agents', icon: Bot, label: 'Agents', href: '/agent' },
    { id: 'discovery', icon: Compass, label: 'Discovery', href: '/discovery' },
  ];

  const bottomMenuItems = [
    { id: 'setting', icon: Settings, label: 'Setting' },
    { id: 'help', icon: HelpCircle, label: 'Help' },
    { id: 'feedback', icon: MessageSquare, label: 'Feedback' },
    { id: 'logout', icon: LogOut, label: 'Log out' },
  ];

  return (
    <aside className="w-64 bg-[#0F0F0F] border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <img 
            src="/myguo-logo.png" 
            alt="MyGuo Logo" 
            className="h-10 w-auto"
            onError={(e) => {
              // Fallback to text if image not found
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">myguo</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#E879F9]/20 text-[#E879F9]">Beta</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {mainMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.id);
                if (item.href) {
                  router.push(item.href);
                }
              }}
              className={`w-full ${
                isActive 
                  ? 'sidebar-item sidebar-item-active' 
                  : 'sidebar-item'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <nav className="p-4 border-t border-gray-800 space-y-1">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={async () => {
                if (item.id === 'logout') {
                  // Clear local storage
                  localStorage.clear();
                  // Logout from Privy
                  await logout();
                  // Redirect to home
                  router.push('/');
                } else {
                  setActiveItem(item.id);
                }
              }}
              className={`w-full ${
                isActive 
                  ? 'sidebar-item sidebar-item-active' 
                  : 'sidebar-item'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

