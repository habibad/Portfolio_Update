import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, ArrowUp, Heart } from 'lucide-react';

const Footer = ({ darkMode }) => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Experience', id: 'experience' },
    { label: 'Projects', id: 'projects' },
    { label: 'Research', id: 'publications' },
    { label: 'Contact', id: 'contact' },
  ];

  const contactItems = [
    { icon: Mail, label: 'rahamananikmd@gmail.com', href: 'mailto:rahamananikmd@gmail.com' },
    { icon: Phone, label: '+880 1774 225 956', href: 'tel:+8801774225956' },
    { icon: MapPin, label: 'Dhaka, Bangladesh 🇧🇩', href: null },
  ];

  const socials = [
    { icon: Github, href: 'https://github.com/habibad', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: 'mailto:rahamananikmd@gmail.com', label: 'Email' },
  ];

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer
      className={`relative overflow-hidden border-t ${
        darkMode
          ? 'bg-black border-white/10'
          : 'bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200'
      }`}
    >
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60" />

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        {/* ── Top Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            {/* Logo mark */}
            <div className="flex items-center gap-3 mb-4">
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="fLogoGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <path d="M22 2 L38 11 L38 33 L22 42 L6 33 L6 11 Z" fill="url(#fLogoGrad)" opacity="0.15" />
                <path d="M22 2 L38 11 L38 33 L22 42 L6 33 L6 11 Z" stroke="url(#fLogoGrad)" strokeWidth="1.5" fill="none" />
                <text x="10" y="28" fontFamily="Georgia, serif" fontWeight="700" fontSize="16" fill="url(#fLogoGrad)">AR</text>
              </svg>
              <div className="flex flex-col leading-none">
                <span className="font-black text-base bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wide">
                  ANIKUR
                </span>
                <span className={`text-[10px] font-semibold tracking-[0.2em] uppercase ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  RAHAMAN
                </span>
              </div>
            </div>

            <p className={`text-sm leading-relaxed mb-5 max-w-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Full-Stack Developer &amp; AI Researcher from Dhaka. Turning complex problems into elegant, impactful solutions — one commit at a time.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`p-2.5 rounded-xl border transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
                    darkMode
                      ? 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-purple-400/60 hover:bg-purple-500/10'
                      : 'border-gray-200 bg-white text-gray-500 hover:text-purple-600 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-xs font-black tracking-[0.15em] uppercase mb-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map(({ label, id }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className={`text-sm transition-all duration-200 flex items-center gap-2 group ${
                      darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 rounded-full" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={`text-xs font-black tracking-[0.15em] uppercase mb-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Get In Touch
            </h4>
            <ul className="space-y-3">
              {contactItems.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      className={`flex items-start gap-3 text-sm group transition-all duration-200 ${
                        darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-purple-600'
                      }`}
                    >
                      <Icon size={15} className={`mt-0.5 flex-shrink-0 transition-colors duration-200 ${
                        darkMode ? 'text-purple-400 group-hover:text-blue-400' : 'text-purple-500 group-hover:text-blue-500'
                      }`} />
                      <span className="break-all">{label}</span>
                    </a>
                  ) : (
                    <span className={`flex items-start gap-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Icon size={15} className={`mt-0.5 flex-shrink-0 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                      {label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Highlights / Fun Facts */}
          <div>
            <h4 className={`text-xs font-black tracking-[0.15em] uppercase mb-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Highlights
            </h4>
            <div className="space-y-2.5">
              {[
                { emoji: '🏆', text: 'Best Paper — RAICON 2024' },
                { emoji: '📄', text: '5+ Published Papers' },
                { emoji: '🌐', text: '25+ Projects Delivered' },
                { emoji: '🎓', text: 'B.Sc. CSE — East West Univ.' },
                { emoji: '📍', text: 'Open to Remote & On-site' },
              ].map(({ emoji, text }) => (
                <div
                  key={text}
                  className={`flex items-center gap-2.5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  <span className="text-base leading-none">{emoji}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className={`w-full h-px mb-7 ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

        {/* ── Bottom Bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className={`text-xs text-center sm:text-left ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            © {new Date().getFullYear()} Md Anikur Rahaman{' '}
            <Heart size={11} className="inline text-pink-500 fill-pink-500 mx-0.5" />
          </p>

          <div className="flex items-center gap-4">
            <span className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              Dhaka, Bangladesh 🇧🇩
            </span>

            {/* Back to top */}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className={`p-2.5 rounded-xl border transition-all duration-300 hover:scale-110 hover:-translate-y-1 group ${
                darkMode
                  ? 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-blue-400/60 hover:bg-blue-500/10'
                  : 'border-gray-200 bg-white text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <ArrowUp size={15} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;