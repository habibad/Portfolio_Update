import React, { useState, useRef, useEffect } from 'react';
import { Zap, Mail, Code, Award, Layers, Download } from 'lucide-react';
import gsap from 'gsap';
import Modal from '../modal/Modal';
import profileImg from '../../assets/profile.png';

// Profile image imported through Vite asset handling

const Hero = ({ scrollToSection, darkMode }) => {
  const [showPdfModal, setShowPdfModal] = useState(false);

  const stats = [
    { label: "Projects", value: "25+", icon: Code },
    { label: "Research Papers", value: "5+", icon: Award },
    { label: "Technologies", value: "20+", icon: Layers },
    { label: "Coffee Cups", value: "∞", icon: Zap }
  ];

  const heroTexts = [
    "Hi, I am Anikur",
    "Hi, I am a Web Designer & Developer",
    "Hi, I am a Researcher",
    "Hi, I am an Innovator",
    "Hi, I am a Problem Solver"
  ];

  const [currentText, setCurrentText] = useState(0);
  const textRef = useRef();

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 40, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }
    );

    const interval = setInterval(() => {
      gsap.to(textRef.current, {
        opacity: 0,
        y: -40,
        scale: 0.8,
        duration: 0.6,
        ease: 'power3.in',
        onComplete: () => {
          setCurrentText((prev) => (prev + 1) % heroTexts.length);
          gsap.fromTo(
            textRef.current,
            { opacity: 0, y: 40, scale: 0.8 },
            { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }
          );
        }
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [currentText]);

  return (
    <>
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-pulse ${darkMode ? 'bg-blue-400' : 'bg-purple-500'}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Two-column layout: text left, image right */}
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">

            {/* LEFT: Text Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Animated Heading */}
              <div className="relative mb-6 h-[80px] sm:h-[90px] md:h-[110px] flex items-center justify-center lg:justify-start">
                <span
                  ref={textRef}
                  className="block text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight"
                >
                  {heroTexts[currentText].split('').map((ch, i) => (
                    <span key={i} className="char inline-block" aria-hidden={ch === ' ' ? 'true' : 'false'}>
                      {ch === ' ' ? '\u00A0' : ch}
                    </span>
                  ))}
                </span>
              </div>

              {/* Subtitle */}
              <div className="mb-8">
                <div className="inline-block text-base sm:text-lg md:text-xl font-light leading-relaxed">
                  <span className={`spiral-text ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ animationDelay: '0s' }}>
                    Full-Stack Wizard •
                  </span>
                  <span className="spiral-text bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent font-semibold" style={{ animationDelay: '0.2s' }}>
                    {' '}AI Researcher •
                  </span>
                  <span className={`spiral-text ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ animationDelay: '0.4s' }}>
                    {' '}Innovation Catalyst
                  </span>
                  <span className="animate-pulse text-blue-500 text-4xl">|</span>
                </div>
              </div>

              {/* Bio Snippet */}
              <p className={`text-sm sm:text-base mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Computer Science graduate from East West University, Dhaka. Passionate about building intelligent systems that bridge research and real-world impact.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="group relative px-8 py-3.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-base rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50"
                >
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    <Download className="group-hover:rotate-12 transition-transform duration-300" size={18} />
                    VIEW RESUME
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </button>

                <button
                  onClick={() => scrollToSection('contact')}
                  className={`group px-8 py-3.5 border-2 font-bold text-base rounded-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden ${
                    darkMode
                      ? 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black'
                      : 'border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    <Mail className="group-hover:rotate-12 transition-transform duration-300" size={18} />
                    LET'S CONNECT
                  </span>
                  <div className={`absolute inset-0 ${darkMode ? 'bg-blue-400' : 'bg-purple-500'} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                </button>
              </div>

              {/* Stats Row */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto lg:mx-0">
                {stats.map(({ label, value, icon: Icon }, index) => (
                  <div
                    key={label}
                    className={`p-4 rounded-2xl backdrop-blur-lg transition-all duration-300 hover:scale-105 border ${
                      darkMode
                        ? 'bg-white/5 border-white/10 hover:border-blue-400/50'
                        : 'bg-white/20 border-white/20 hover:border-purple-400/50'
                    }`}
                  >
                    <Icon className="mx-auto mb-1 text-blue-400" size={20} />
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      {value}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Profile Image */}
            <div className="flex-shrink-0 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative glow rings */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 blur-2xl opacity-30 scale-110 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-cyan-400 to-purple-600 blur-3xl opacity-20 scale-125"></div>

                {/* Rotating border ring */}
                <div
                  className="absolute inset-0 rounded-full border-4 border-transparent"
                  style={{
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #3b82f6, #a855f7, #ec4899, #3b82f6) border-box',
                    animation: 'spin 8s linear infinite'
                  }}
                ></div>

                {/* Second counter-rotating ring */}
                <div
                  className="absolute -inset-3 rounded-full border-2 border-dashed border-purple-400/40"
                  style={{ animation: 'spin 12s linear infinite reverse' }}
                ></div>

                {/* Profile image container */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                  <img
                    src={profileImg}
                    alt="Md Anikur Rahaman"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      // Fallback gradient avatar if image not found
                      e.target.style.display = 'none';
                      e.target.parentNode.style.background = 'linear-gradient(135deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%)';
                    }}
                  />
                  {/* Subtle overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-full"></div>
                </div>

                {/* Floating badge: Available for work */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold shadow-lg flex items-center gap-2 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  Available for Opportunities
                </div>

                {/* Floating skill chips */}
                <div className="absolute -left-6 top-1/4 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold shadow-lg animate-bounce-slow">
                  AI & ML
                </div>
                <div className="absolute -right-6 top-2/3 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold shadow-lg animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                  Full-Stack
                </div>
                <div className="absolute -right-2 top-1/4 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold shadow-lg animate-bounce-slow" style={{ animationDelay: '1s' }}>
                  Research
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Styles */}
      <style>{`
        .spiral-text {
          display: inline-block;
          opacity: 0;
          animation: spiral-in 1s cubic-bezier(0.68,-0.55,0.27,1.55) forwards;
        }
        @keyframes spiral-in {
          0% { opacity: 0; transform: translate(-60px, -60px) rotate(-360deg) scale(0.5); }
          60% { opacity: 1; transform: translate(10px, 10px) rotate(20deg) scale(1.1); }
          100% { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* PDF Modal */}
      <Modal showPdfModal={showPdfModal} setShowPdfModal={setShowPdfModal} darkMode={darkMode} />
    </>
  );
};

export default Hero;