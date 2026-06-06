import React, { useLayoutEffect, useRef } from 'react';
import { Calendar, Award, Brain, Globe, ExternalLink } from 'lucide-react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { publications } from './data.jsx';

gsap.registerPlugin(ScrollTrigger);

const Publications = ({ darkMode }) => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const q = gsap.utils.selector(containerRef);

  useLayoutEffect(() => {
    if (!sectionRef.current || !containerRef.current || publications.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = q('.publication_card');
      if (!cards || cards.length === 0) return;

      const prefersReduced =
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Only do the pinned stack animation on desktop (≥768px)
      const isMobile = window.innerWidth < 768;

      if (prefersReduced || isMobile) {
        // On mobile: just fade each card in on scroll, no pin
        gsap.set(cards, { yPercent: 0, opacity: 0, scale: 1 });
        cards.forEach((card) => {
          gsap.to(card, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          });
        });
        return;
      }

      // Desktop: stacked card pin animation
      gsap.set(cards, { yPercent: 100, opacity: 0, scale: 0.98, transformOrigin: 'center center' });
      gsap.set(cards[0], { yPercent: 0, opacity: 1, scale: 1 });

      const perCardDuration = 0.9;
      const totalDuration = cards.length * perCardDuration + 0.8;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${Math.round(totalDuration * window.innerHeight)}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        }
      });

      cards.forEach((card, index) => {
        const inner = card.querySelector('.publication_inner');
        const showLabel = `card-${index}`;
        tl.addLabel(showLabel);
        tl.to(card, {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          zIndex: cards.length + index,
          duration: perCardDuration,
          ease: 'power2.out'
        }, showLabel);
        tl.to(card, {
          yPercent: -index * 5,
          scale: 1 - index * 0.02,
          duration: 0.4,
          ease: 'power2.out',
          onStart: () => { inner && inner.classList.add('overlap'); },
          onReverseComplete: () => { inner && inner.classList.remove('overlap'); }
        }, `>${0.25}`);
      });

      tl.eventCallback("onComplete", () => {
        cards.forEach(card => {
          const inner = card.querySelector('.publication_inner');
          inner && inner.classList.remove('overlap');
        });
      });

      gsap.fromTo(q('.publications-title'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none reverse' }
        });

      return () => {
        cards.forEach(card => {
          const inner = card.querySelector('.publication_inner');
          inner && inner.classList.remove('overlap');
        });
        tl && tl.kill();
        ScrollTrigger.getAll().forEach(st => st.kill());
      };
    }, containerRef);

    return () => ctx.revert();
  }, [publications.length]);

  // ── Mobile layout: simple stacked cards, no pin ──────────────────────────
  const MobileCard = ({ pub, index, darkMode }) => (
    <div
      className={`publication_card w-full rounded-2xl border overflow-hidden transition-all duration-500 group ${
        darkMode
          ? 'bg-white/5 border-white/10 hover:border-emerald-400/50'
          : 'bg-white/60 border-white/40 hover:border-blue-400/50 shadow-sm'
      }`}
    >
      <div className="publication_inner p-5 sm:p-6">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            pub.status === 'Published'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              : pub.status === 'Accepted'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
          }`}>
            {pub.status}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            {pub.impact}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent leading-snug">
          {pub.title}
        </h3>

        {/* Authors */}
        <p className={`text-xs sm:text-sm mb-3 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {pub.authors}
        </p>

        {/* Conference + citation row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-blue-400 flex-shrink-0" />
            <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {pub.conference}
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-400">
            📊 {pub.citations} citations
          </span>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { icon: Award, label: 'Impact', value: 'High', color: 'text-yellow-500' },
            { icon: Brain, label: 'Innovation', value: 'Breakthrough', color: 'text-purple-500' },
            { icon: Globe, label: 'Reach', value: 'Global', color: 'text-blue-500' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className={`p-3 rounded-xl text-center ${darkMode ? 'bg-white/5' : 'bg-white/50'}`}>
              <Icon className={`mx-auto mb-1 ${color}`} size={16} />
              <div className={`text-[10px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
              <div className={`text-xs font-bold ${color}`}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── MOBILE view (< md): plain scrolling layout ── */}
      <section
        id="publications"
        className={`md:hidden py-16 px-4 ${
          darkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-blue-50 to-white'
        }`}
      >
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              RESEARCH IMPACT
            </h2>
            <div className="w-24 h-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full mx-auto animate-pulse"></div>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-5">
            {publications.map((pub, index) => (
              <MobileCard key={index} pub={pub} index={index} darkMode={darkMode} />
            ))}
          </div>
        </div>
      </section>

      {/* ── DESKTOP view (≥ md): pinned stacking animation ── */}
      <section
        ref={sectionRef}
        className={`hidden md:block relative w-full h-screen ${
          darkMode ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-blue-50 to-white'
        }`}
      >
        <div
          ref={containerRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col"
        >
          {/* Header */}
          <div className="text-center pt-36 pb-12">
            <h2 className="publications-title text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              RESEARCH IMPACT
            </h2>
            <div className="w-36 h-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full mx-auto animate-pulse"></div>
          </div>

          {/* Stacking Cards */}
          {publications.length > 0 && (
            <div className="flex-1 relative">
              {publications.map((pub, index) => (
                <div
                  key={index}
                  className="publication_card absolute inset-0 flex items-center justify-center px-4"
                >
                  <div
                    className={`publication_inner w-full max-w-5xl p-8 rounded-3xl backdrop-blur-lg border transition-all duration-500 group relative overflow-hidden shadow-2xl ${
                      darkMode
                        ? 'bg-white/5 border-white/10 hover:border-emerald-400/50'
                        : 'bg-white/30 border-white/30 hover:border-blue-400/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="space-y-3 flex-1 pr-4">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                            pub.status === 'Published'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                              : pub.status === 'Accepted'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          }`}>
                            {pub.status}
                          </span>
                          <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {pub.impact}
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                          {pub.title}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-4xl`}>
                          {pub.authors}
                        </p>
                      </div>
                      <div className="text-right space-y-2 flex-shrink-0">
                        <div className="flex items-center gap-2 justify-end">
                          <Calendar size={16} className="text-blue-400" />
                          <span className="text-sm font-medium">{pub.conference}</span>
                        </div>
                        <div className="text-sm font-bold text-emerald-400">📊 {pub.citations} citations</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                      {[
                        { icon: Award, label: 'Impact Factor', value: 'High', color: 'text-yellow-500' },
                        { icon: Brain, label: 'Innovation', value: 'Breakthrough', color: 'text-purple-500' },
                        { icon: Globe, label: 'Reach', value: 'Global', color: 'text-blue-500' },
                      ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className={`p-4 rounded-xl text-center ${darkMode ? 'bg-white/5' : 'bg-white/50'}`}>
                          <Icon className={`mx-auto mb-2 ${color}`} size={24} />
                          <div className="text-sm font-medium">{label}</div>
                          <div className={`text-lg font-bold ${color}`}>{value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="absolute bottom-4 right-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${darkMode ? 'bg-white/10 text-white/70' : 'bg-black/10 text-black/70'}`}>
                        {index + 1} / {publications.length}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {publications.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className={`text-center p-8 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-white/30'}`}>
                <h3 className="text-2xl font-bold mb-4 text-gray-400">No Publications Yet</h3>
                <p className="text-gray-500">Research publications will appear here soon.</p>
              </div>
            </div>
          )}

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className={`flex flex-col items-center space-y-2 ${darkMode ? 'text-white/70' : 'text-black/70'}`}>
              <span className="text-xs font-medium">Scroll to explore</span>
              <div className="w-px h-8 bg-gradient-to-b from-current to-transparent"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Publications;