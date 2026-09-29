import React from 'react';
import { Home, PartyPopper, Sparkles, ClipboardCheck, Bookmark, ShieldCheck, Cpu } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'party' | 'jewelry' | 'workflow' | 'saved';
  setActiveTab: (tab: 'home' | 'party' | 'jewelry' | 'workflow' | 'saved') => void;
  currency: string;
  setCurrency: (c: string) => void;
  savedCount: number;
  apiStatus: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  savedCount,
  apiStatus
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top SmartBridge & SmartInternz partnership notice bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SmartBridge &bull; SmartInternz Project
          </div>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">
            PocketSmart AI: GenAI Cross-Platform Recommendation System
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
            <Cpu className="w-3 h-3 text-indigo-400" />
            Gemini 3.8 Flash
          </span>
          <span className="hidden md:inline px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono">
            Activities 1.1–5.4 Implemented
          </span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-700 bg-clip-text text-transparent">
                  PocketSmart AI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Assistant
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Smart Budget Allocation & Cross-Platform Recommendations
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home Interior</span>
            </button>

            <button
              onClick={() => setActiveTab('party')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'party'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <PartyPopper className="w-4 h-4" />
              <span>Party Planner</span>
            </button>

            <button
              onClick={() => setActiveTab('jewelry')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'jewelry'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Jewelry & Outfit</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1 rounded">Vision</span>
            </button>

            <button
              onClick={() => setActiveTab('workflow')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'workflow'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Project Workflow</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === 'saved'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Plans</span>
              {savedCount > 0 && (
                <span className="w-4 h-4 text-[10px] rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Currency selector & Quick indicators */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setCurrency('₹')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currency === '₹' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Indian Rupee"
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency('$')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currency === '$' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="US Dollar"
              >
                $ USD
              </button>
              <button
                onClick={() => setCurrency('€')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currency === '€' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Euro"
              >
                € EUR
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Submenu */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-2 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
              activeTab === 'home' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Home className="w-3.5 h-3.5" /> Home
          </button>
          <button
            onClick={() => setActiveTab('party')}
            className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
              activeTab === 'party' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <PartyPopper className="w-3.5 h-3.5" /> Party
          </button>
          <button
            onClick={() => setActiveTab('jewelry')}
            className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
              activeTab === 'jewelry' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Jewelry & Vision
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
              activeTab === 'workflow' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" /> Workflow
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${
              activeTab === 'saved' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" /> Saved ({savedCount})
          </button>
        </div>
      </div>
    </header>
  );
};
