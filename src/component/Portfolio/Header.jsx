import React, { useState } from 'react';
import { Home, User, Briefcase, Code, FileText, Mail, Moon, Sun, Menu, X } from 'lucide-react';

// Professional Logo SVG for "AR" (Anikur Rahaman)
const ARLogo = ({ darkMode }) => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="50%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
      <linearGradient id="borderGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#f472b6" />
      </linearGradient>
    </defs>
    {/* Hexagonal background */}
    <path
      d="M22 2 L38 11 L38 33 L22 42 L6 33 L6 11 Z"
      fill="url(#logoGrad)"
      opacity="0.15"
    />
    <path
      d="M22 2 L38 11 L38 33 L22 42 L6 33 L6 11 Z"
      stroke="url(#borderGrad)"
      strokeWidth="1.5"
      fill="none"
    />
    {/* "A" letter */}
    <text
      x="10"
      y="28"
      fontFamily="Georgia, serif"
      fontWeight="700"
      fontSize="16"
      fill="url(#logoGrad)"
    >AR</text>
  </svg>
);

const Header = ({ darkMode, toggleDarkMode, activeSection, scrollToSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'about', label: 'ABOUT', icon: User },
    { id: 'experience', label: 'EXPERIENCE', icon: Briefcase },
    { id: 'projects', label: 'PROJECTS', icon: Code },
    { id: 'publications', label: 'RESEARCH', icon: FileText },
    { id: 'contact', label: 'CONTACT', icon: Mail }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 backdrop-blur-xl transition-all duration-500 ${
          darkMode
            ? 'bg-black/20 border-b border-blue-500/20'
            : 'bg-white/10 border-b border-purple-200/30'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-3 group"
            >
              <ARLogo darkMode={darkMode} />
              <div className="flex flex-col leading-none">
                <span className="font-black text-base sm:text-lg bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wide">
                  ANIKUR
                </span>
                <span className={`text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  RAHAMAN
                </span>
              </div>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(({ id, label, icon: Icon }, index) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`relative px-3 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-1.5 overflow-hidden group ${
                    activeSection === id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} className="relative z-10" />
                  <span className="relative z-10">{label}</span>
                  {activeSection === id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className={`relative p-3 rounded-full transition-all duration-500 transform hover:scale-110 ${
                  darkMode
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/25'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-purple-500/25'
                }`}
              >
                {darkMode ? (
                  <Sun size={16} className="text-black animate-spin" style={{ animationDuration: '4s' }} />
                ) : (
                  <Moon size={16} className="text-white animate-pulse" />
                )}
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className={`md:hidden flex flex-col space-y-2 px-6 pb-4 ${darkMode ? 'bg-black/60' : 'bg-white/80'} backdrop-blur-xl`}>
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { scrollToSection(id); setMenuOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeSection === id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-white/10'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="h-20"></div>
    </>
  );
};

export default Header;