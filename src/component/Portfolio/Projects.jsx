import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronRightIcon, ExternalLink, Github, Link } from 'lucide-react';


const Projects = ({ darkMode, scrollY, projects }) => {

  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);


  const nextProject = () => {
    setIsAutoRotating(false);
    setCurrentProjectIndex((prev) => (prev + 1) % projects.length);

    setTimeout(() => setIsAutoRotating(true), 10000);
  };
  const prevProject = () => {
    console.log('prev clicked');
    setIsAutoRotating(false);
    setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);

    setTimeout(() => setIsAutoRotating(true), 10000);
  };

  const goToProject = (index) => {
    setIsAutoRotating(false);
    setCurrentProjectIndex(index);

    setTimeout(() => setIsAutoRotating(true), 10000);
  };
  return (
    <section id="projects" className={`py-32 relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-blue-50 to-purple-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            PROJECT SHOWCASE
          </h2>
          <div className="w-40 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto animate-pulse"></div>
          <p className={`mt-6 text-xl ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Innovation meets artistry in these groundbreaking digital experiences
          </p>
        </div>

        {/* 3D Project Card */}
        <div className="relative perspective-1000">
          <div
            className={`relative p-10 rounded-[2rem] backdrop-blur-lg border-2 transition-all duration-700 hover:scale-105 group overflow-hidden ${darkMode ? 'bg-white/5 border-white/10 hover:border-purple-400/50' : 'bg-white/30 border-white/30 hover:border-purple-400/50'
              }`}
            style={{
              transform: `rotateX(${Math.sin(scrollY * 0.001) * 2}deg) rotateY(${Math.cos(scrollY * 0.001) * 2}deg)`,
              boxShadow: `0 25px 50px -12px ${darkMode ? 'rgba(168, 85, 247, 0.25)' : 'rgba(147, 51, 234, 0.25)'}`
            }}
          >
            {/* Animated Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${projects[currentProjectIndex].gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500 rounded-[2rem] pointer-events-none`}></div>

            {/* Floating Project Icon */}
            <div className="absolute top-8 right-8">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${projects[currentProjectIndex].gradient} shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-500`}>
                {React.createElement(projects[currentProjectIndex].icon, {
                  size: 32,
                  className: "text-white drop-shadow-lg"
                })}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              {/* Left: Project Info */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${projects[currentProjectIndex].gradient} animate-pulse`}></div>
                    <span className={`text-sm font-bold tracking-wider uppercase ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      {projects[currentProjectIndex].subtitle}
                    </span>
                  </div>
                  <h3 className="text-4xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {projects[currentProjectIndex].title}
                  </h3>
                  <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {projects[currentProjectIndex].description}
                  </p>
                </div>

                {/* Features List */}
                <div>
                  <h4 className="text-xl font-bold mb-4 text-white">✨ Key Features</h4>
                  <div className="space-y-1">
                    {projects[currentProjectIndex].features.map((feature, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 hover:scale-105 ${darkMode ? 'hover:bg-white/5' : 'hover:bg-white/20'
                          }`}
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          transform: `translateX(${Math.sin(Date.now() / 1000 + index * 0.5) * 3}px)`
                        }}
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${projects[currentProjectIndex].gradient} mt-3`}></div>
                        <span className="text-base">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <a href={projects[currentProjectIndex].live_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${projects[currentProjectIndex].gradient} transform hover:scale-110 transition-all duration-300 shadow-lg flex items-center gap-2 pointer-events-auto`}
                  >
                    <ExternalLink size={18} />
                    Live Demo
                  </a>
                  <a href={projects[currentProjectIndex].github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${projects[currentProjectIndex].gradient} transform hover:scale-110 transition-all duration-300 shadow-lg flex items-center gap-2 pointer-events-auto`}
                  >
                    <Github size={18} />
                    Source
                  </a>
                </div>
              </div>

              {/* Right: Tech Stack Visualization */}
              <div className="space-y-6">
                <h4 className="text-2xl font-bold text-center mb-8">🛠️ Tech Arsenal</h4>
                <div className="grid grid-cols-3 gap-4">
                  {projects[currentProjectIndex].technologies.map((tech, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl backdrop-blur-lg border text-center transition-all duration-500 hover:scale-110 group cursor-pointer ${darkMode ? 'bg-white/5 border-white/10 hover:border-purple-400/50' : 'bg-white/20 border-white/30 hover:border-purple-400/50'
                        }`}
                      style={{
                        animationDelay: `${index * 0.05}s`,
                        transform: `translateY(${Math.sin(Date.now() / 800 + index) * 5}px) rotate(${Math.sin(Date.now() / 1200 + index) * 2}deg)`
                      }}
                    >
                      <div className={`text-sm font-bold bg-gradient-to-r ${projects[currentProjectIndex].gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                        {tech}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Performance Metrics */}
                <div className={`p-6 rounded-2xl backdrop-blur-lg border mt-8 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white/20 border-white/30'
                  }`}>
                  <h5 className="text-lg font-bold mb-4 text-center">📊 Performance Stats</h5>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className={`text-2xl font-black bg-gradient-to-r ${projects[currentProjectIndex].gradient} bg-clip-text text-transparent`}>
                        99.9%
                      </div>
                      <div className="text-xs opacity-80">Uptime</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-black bg-gradient-to-r ${projects[currentProjectIndex].gradient} bg-clip-text text-transparent`}>
                        &lt;100ms
                      </div>
                      <div className="text-xs opacity-80">Response</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Carousel Controls */}
            <div className="flex items-center justify-center mt-12 gap-8">
              <button type="button" onClick={prevProject}
                className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-blue-500/25 pointer-events-auto`}
              >
                <ChevronLeft size={28} />
              </button>

              {/* Project Indicators */}
              <div className="flex gap-3">
                {projects.map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => goToProject(index)}
                    className={`transition-all duration-300 rounded-full ${index === currentProjectIndex
                        ? `w-12 h-4 bg-gradient-to-r ${projects[index].gradient}`
                        : 'w-4 h-4 bg-gray-400 hover:bg-gray-300'
                      }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextProject}
                className={`p-4 rounded-2xl transition-all duration-300 hover:scale-110 bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-purple-500/25 pointer-events-auto`}
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Project Counter */}
            <div className="text-center mt-6">
              <span className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Project {currentProjectIndex + 1} of {projects.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;