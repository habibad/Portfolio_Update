import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun, Mail, Phone, MapPin, Github, ExternalLink, Calendar, Award, Code, Database, Globe, Smartphone, BookOpen, User, Briefcase, FileText, Home, Zap, Brain, Cpu, Layers, Terminal } from 'lucide-react';
import Header from './Header';
import Hero from './Hero';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';
import Publications from './Publications';
import Contact from './Contact';
import Footer from './Footer';
import ParticleBackground from './ParticleBackground';
import CustomCursor from './CustomCursor';
import { projects, publications, skills } from './data';

const Portfolio = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const sections = ['home', 'about', 'experience', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 overflow-x-hidden ${darkMode ? 'dark bg-black text-white' : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900'}`}>
      <CustomCursor mousePosition={mousePosition} darkMode={darkMode} />
      <ParticleBackground darkMode={darkMode} />
      
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        activeSection={activeSection} 
        scrollToSection={scrollToSection} 
      />
      
      <Hero scrollToSection={scrollToSection} darkMode={darkMode} />
      
      <About darkMode={darkMode} scrollY={scrollY} skills={skills} />
      
      <Experience darkMode={darkMode} scrollY={scrollY} />
      
      <Projects 
        darkMode={darkMode} 
        scrollY={scrollY} 
        projects={projects} 
      />
      
      <Publications darkMode={darkMode} />
      
      <Contact darkMode={darkMode} />
      
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Portfolio;