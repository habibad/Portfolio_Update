import React from 'react';
import { Mail, Phone, MapPin, Github, Code, Award, Layers, Zap, Calendar } from 'lucide-react';

const Contact = ({ darkMode }) => {
  const contactInfo = [
    { icon: Mail, label: "Email", value: "rahamananikmd@gmail.com", color: "from-red-400 to-pink-500", link: "mailto: rahamananikmd@gmail.com"},
    { icon: Phone, label: "Phone", value: "+880 1774 225 956", color: "from-green-400 to-emerald-500", link: "tel:+8801774225956" },
    { icon: MapPin, label: "Location", value: "Dhaka, Bangladesh 🇧🇩", color: "from-blue-400 to-cyan-500" },
    { icon: Github, label: "GitHub", value: "github.com/habibad", color: "from-purple-400 to-indigo-500", link: "https://github.com/habibad" }
  ];

  const stats = [
    { label: "Epic Projects", value: "25+", icon: Code, color: "from-blue-500 to-purple-500" },
    { label: "Research Papers", value: "5+", icon: Award, color: "from-green-500 to-emerald-500" },
    { label: "Technologies", value: "25+", icon: Layers, color: "from-purple-500 to-pink-500" },
    { label: "Coffee Consumed", value: "∞", icon: Zap, color: "from-orange-500 to-red-500" }
  ];

  return (
    <section id="contact" className={`py-32 relative overflow-hidden ${darkMode ? 'bg-black' : 'bg-gradient-to-br from-purple-50 to-pink-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-6xl font-black mb-6 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            LET'S CREATE MAGIC
          </h2>
          <div className="w-28 h-2 bg-gradient-to-r from-pink-500 to-blue-600 rounded-full mx-auto animate-pulse"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Contact Info */}
          <div className="space-y-8">
            <div className={`p-8 rounded-3xl backdrop-blur-lg border ${
              darkMode ? 'bg-white/5 border-white/10' : 'bg-white/30 border-white/30'
            }`}>
              <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Ready to Collaborate? 🚀
              </h3>
              <p className={`text-lg mb-8 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Whether you're looking to build the next unicorn startup, need cutting-edge AI solutions, 
                or want to discuss the future of technology - I'm your guy! Let's turn your wildest 
                ideas into digital reality.
              </p>

              <div className="space-y-6">
                {contactInfo.map(({ icon: Icon, label, value, color, link }, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                      darkMode ? 'hover:bg-white/5' : 'hover:bg-white/50'
                    }`}
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
                      <Icon className="text-white" size={20} />
                    </div>
                    <div>
                      <a href={link}>
                      <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {label}
                      </div>
                      <div className="text-lg font-semibold">{value}</div>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Stats & CTA */}
          <div className="space-y-8">
            {/* Achievement Stats */}
            <div className={`p-8 rounded-3xl backdrop-blur-lg border ${
              darkMode ? 'bg-white/5 border-white/10' : 'bg-white/30 border-white/30'
            }`}>
              <h3 className="text-2xl font-bold mb-8 text-center">🏆 Achievement Unlocked</h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map(({ label, value, icon: Icon, color }, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl text-center transition-all duration-300 hover:scale-110 bg-gradient-to-r ${color}`}
                    style={{
                      transform: `translateY(${Math.sin(Date.now() / 1000 + index) * 3}px)`
                    }}
                  >
                    <Icon className="mx-auto mb-3 text-white" size={28} />
                    <div className="text-3xl font-black text-white mb-1">{value}</div>
                    <div className="text-sm text-white/80 font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className={`p-8 rounded-3xl backdrop-blur-lg border text-center ${
              darkMode ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30' : 'bg-gradient-to-br from-purple-100/50 to-pink-100/50 border-purple-200/50'
            }`}>
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Ready to Start Something Amazing?
              </h3>
              <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Let's build the future together, one line of code at a time! 🚀
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 flex items-center gap-2 justify-center">
                  <Mail size={20} />
                  Send Message
                </button>
                <button className="px-8 py-4 border-2 border-purple-500 text-purple-500 font-bold text-lg rounded-2xl transform hover:scale-110 transition-all duration-300 hover:bg-purple-500 hover:text-white flex items-center gap-2 justify-center">
                  <Calendar size={20} />
                  Schedule Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;