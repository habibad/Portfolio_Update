import React from 'react';

const Experience = ({ darkMode, scrollY }) => {
  const experiences = [
    {
      role: "🚀 WordPress Plugin & Web Developer",
      company: "Sparktech Agency, bdCalling IT",
      period: "Jan 2025 – Present",
      type: "Current Role",
      achievements: [
        "🔥 Architected revolutionary WordPress plugins with 99.9% uptime",
        "⚡ Built lightning-fast websites with perfect PageSpeed scores",
        "💳 Integrated secure payment gateways handling $1M+ transactions",
        "🎨 Crafted responsive designs that convert 40% better",
        "🔧 Mastered Git workflows and CI/CD pipelines"
      ]
    },
    {
      role: "🧠 Research Assistant - AI Lab",
      company: "Machine Learning & AI Division, EWU",
      period: "June 2024 – Present",
      type: "Research Position",
      achievements: [
        "🏆 Published 3+ breakthrough papers in top-tier conferences",
        "🤖 Developed cutting-edge ML models with 95%+ accuracy",
        "📊 Automated data processing pipelines saving 200+ hours",
        "🔬 Led research in NLP and computer vision domains",
        "🌟 Collaborated with international research teams"
      ]
    }
  ];

  return (
    <section id="experience" className={`py-32 relative overflow-hidden ${darkMode ? 'bg-black' : 'bg-gradient-to-br from-gray-50 to-purple-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-6xl font-black mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            EXPERIENCE VAULT
          </h2>
          <div className="w-32 h-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto animate-pulse"></div>
        </div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl backdrop-blur-lg border transition-all duration-500 hover:scale-105 group ${
                darkMode ? 'bg-white/5 border-white/10 hover:border-green-400/50' : 'bg-white/30 border-white/30 hover:border-blue-400/50'
              }`}
              style={{
                transform: `translateY(${Math.sin(scrollY * 0.005 + index) * 15}px)`,
              }}
            >
              {/* Status Badge */}
              <div className={`absolute -top-4 left-8 px-4 py-1 rounded-full text-sm font-bold ${
                exp.type === 'Current Role' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
              }`}>
                {exp.type}
              </div>

              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    {exp.role}
                  </h3>
                  <p className={`text-lg font-semibold ${darkMode ? 'text-green-400' : 'text-blue-600'}`}>
                    {exp.company}
                  </p>
                </div>
                <span className={`text-sm px-4 py-2 rounded-full ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}>
                  {exp.period}
                </span>
              </div>

              <div className="grid gap-3">
                {exp.achievements.map((achievement, achIndex) => (
                  <div
                    key={achIndex}
                    className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                      darkMode ? 'hover:bg-white/5' : 'hover:bg-white/50'
                    }`}
                    style={{ animationDelay: `${achIndex * 0.1}s` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mt-3 animate-pulse"></div>
                    <span className="text-base leading-relaxed">{achievement}</span>
                  </div>
                ))}
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;