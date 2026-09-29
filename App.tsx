/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePlannerForm } from './components/HomePlannerForm';
import { PartyPlannerForm } from './components/PartyPlannerForm';
import { JewelryPlannerForm } from './components/JewelryPlannerForm';
import { ResultsView } from './components/ResultsView';
import { ProjectWorkflowView } from './components/ProjectWorkflowView';
import { SavedPlansView } from './components/SavedPlansView';
import { 
  HomePlannerRequest, 
  HomePlannerResponse, 
  PartyPlannerRequest, 
  PartyPlannerResponse, 
  JewelryPlannerRequest, 
  JewelryPlannerResponse 
} from './types/index';
import { 
  Sparkles, 
  Home, 
  PartyPopper, 
  Gem, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Layers,
  HelpCircle,
  BarChart3
} from 'lucide-react';

interface SavedPlanItem {
  id: string;
  savedAt: string;
  currency: string;
  data: HomePlannerResponse | PartyPlannerResponse | JewelryPlannerResponse;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'party' | 'jewelry' | 'workflow' | 'saved'>('home');
  const [currency, setCurrency] = useState<string>('₹');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentResults, setCurrentResults] = useState<
    HomePlannerResponse | PartyPlannerResponse | JewelryPlannerResponse | null
  >(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlanItem[]>([]);
  const [apiStatus, setApiStatus] = useState<string>('checking');

  // Load saved plans and check API status on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pocketsmart_saved_plans');
      if (stored) {
        setSavedPlans(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not read saved plans from storage', e);
    }

    // Health check
    fetch('/api/health')
      .then(r => r.json())
      .then(d => {
        setApiStatus(d.hasGeminiApiKey ? 'gemini_ready' : 'mock_ready');
      })
      .catch(() => {
        setApiStatus('offline_mock');
      });
  }, []);

  const savePlansToStorage = (newPlans: SavedPlanItem[]) => {
    setSavedPlans(newPlans);
    try {
      localStorage.setItem('pocketsmart_saved_plans', JSON.stringify(newPlans));
    } catch (e) {
      console.warn('Could not save to storage', e);
    }
  };

  // 1. Home Interior Planner Submission
  const handleHomeSubmit = async (payload: HomePlannerRequest) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/generate-home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data: HomePlannerResponse = await res.json();
      setCurrentResults(data);
    } catch (err: any) {
      console.error('Home plan error:', err);
      setErrorMessage(err?.message || 'Failed to generate home recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Party Planner Submission
  const handlePartySubmit = async (payload: PartyPlannerRequest) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/generate-party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data: PartyPlannerResponse = await res.json();
      setCurrentResults(data);
    } catch (err: any) {
      console.error('Party plan error:', err);
      setErrorMessage(err?.message || 'Failed to generate party recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Jewelry Planner Submission (Multimodal)
  const handleJewelrySubmit = async (payload: JewelryPlannerRequest) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/generate-jewelry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data: JewelryPlannerResponse = await res.json();
      setCurrentResults(data);
    } catch (err: any) {
      console.error('Jewelry plan error:', err);
      setErrorMessage(err?.message || 'Failed to generate jewelry recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  // Save current plan
  const handleSaveCurrentPlan = () => {
    if (!currentResults) return;
    const newPlan: SavedPlanItem = {
      id: `plan-${Date.now()}`,
      savedAt: new Date().toISOString(),
      currency,
      data: currentResults,
    };
    const updated = [newPlan, ...savedPlans];
    savePlansToStorage(updated);
  };

  const handleDeletePlan = (id: string) => {
    const updated = savedPlans.filter(p => p.id !== id);
    savePlansToStorage(updated);
  };

  const handleSelectSavedPlan = (plan: SavedPlanItem) => {
    setCurrentResults(plan.data);
    setCurrency(plan.currency);
    setActiveTab(plan.data.plannerType);
  };

  const isCurrentPlanSaved = Boolean(
    currentResults && savedPlans.some(p => p.data.summary === currentResults.summary)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setErrorMessage(null);
        }}
        currency={currency}
        setCurrency={setCurrency}
        savedCount={savedPlans.length}
        apiStatus={apiStatus}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Hero header banner when not viewing workflow/saved and not viewing results */}
        {!currentResults && activeTab !== 'workflow' && activeTab !== 'saved' && (
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg border border-indigo-800/40">
            {/* Background glowing ambient circles */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                GenAI Cross-Platform Recommendation System
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
                PocketSmart AI
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                Managing budgets across home decor, party planning, and jewelry shopping can be overwhelming due to disparate catalogs and varying price tags. PocketSmart AI harnesses Gemini to deliver curated, budget-capped recommendations from <strong>Amazon, IKEA, Flipkart, Swiggy, Zomato, and OYO</strong>.
              </p>

              {/* 3 Scenario quick buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => { setActiveTab('home'); setCurrentResults(null); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'home'
                      ? 'bg-white text-indigo-950 shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  }`}
                >
                  <Home className="w-4 h-4 text-indigo-400" />
                  Scenario 1: Home Interior
                </button>

                <button
                  onClick={() => { setActiveTab('party'); setCurrentResults(null); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'party'
                      ? 'bg-white text-indigo-950 shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  }`}
                >
                  <PartyPopper className="w-4 h-4 text-pink-400" />
                  Scenario 2: Party Planner
                </button>

                <button
                  onClick={() => { setActiveTab('jewelry'); setCurrentResults(null); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === 'jewelry'
                      ? 'bg-white text-indigo-950 shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  }`}
                >
                  <Gem className="w-4 h-4 text-amber-400" />
                  Scenario 3: Jewelry &amp; Vision
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {currentResults ? (
          <ResultsView
            data={currentResults}
            currency={currency}
            onSavePlan={handleSaveCurrentPlan}
            onReset={() => setCurrentResults(null)}
            isSaved={isCurrentPlanSaved}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomePlannerForm
                onSubmit={handleHomeSubmit}
                isLoading={isLoading}
                currency={currency}
              />
            )}

            {activeTab === 'party' && (
              <PartyPlannerForm
                onSubmit={handlePartySubmit}
                isLoading={isLoading}
                currency={currency}
              />
            )}

            {activeTab === 'jewelry' && (
              <JewelryPlannerForm
                onSubmit={handleJewelrySubmit}
                isLoading={isLoading}
                currency={currency}
              />
            )}

            {activeTab === 'workflow' && (
              <ProjectWorkflowView
                currency={currency}
              />
            )}

            {activeTab === 'saved' && (
              <SavedPlansView
                plans={savedPlans}
                onSelectPlan={handleSelectSavedPlan}
                onDeletePlan={handleDeletePlan}
                currency={currency}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">PocketSmart AI</span>
            <span>&bull;</span>
            <span>SmartBridge &amp; SmartInternz GenAI Curriculum</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>&bull;</span>
            <span>Ecosystems: Amazon, Flipkart, IKEA, Zomato, Swiggy, OYO, CaratLane</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
