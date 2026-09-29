import React, { useState } from 'react';
import { 
  RecommendedItem, 
  BudgetSummary, 
  HomePlannerResponse, 
  PartyPlannerResponse, 
  JewelryPlannerResponse,
  PlatformName 
} from '../types/index';
import { 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Star, 
  Bookmark, 
  Printer, 
  TrendingUp, 
  ShieldCheck, 
  ShoppingBag, 
  DollarSign, 
  RotateCcw, 
  Info,
  Clock,
  Palette,
  Layers,
  Building2,
  Trash2
} from 'lucide-react';

interface ResultsViewProps {
  data: HomePlannerResponse | PartyPlannerResponse | JewelryPlannerResponse;
  currency: string;
  onSavePlan: () => void;
  onReset: () => void;
  isSaved: boolean;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  data,
  currency,
  onSavePlan,
  onReset,
  isSaved
}) => {
  // Local editable items list so users can adjust quantities dynamically in real time!
  const [items, setItems] = useState<RecommendedItem[]>(data.items);

  // Recalculate dynamic budget metrics
  const totalAllocated = data.budgetSummary.totalAllocated;
  const currentSpent = items.reduce((acc, it) => acc + (it.unitPrice * it.quantity), 0);
  const remaining = totalAllocated - currentSpent;
  const percentUsed = Math.min(100, Math.round((currentSpent / (totalAllocated || 1)) * 100));
  const isOverBudget = remaining < 0;

  // Platform breakdown recalculation
  const platformBreakdown: Record<string, number> = {};
  items.forEach(it => {
    platformBreakdown[it.platform] = (platformBreakdown[it.platform] || 0) + (it.unitPrice * it.quantity);
  });

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return {
          ...item,
          quantity: newQty,
          totalPrice: newQty * item.unitPrice
        };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getPlatformBadge = (platform: PlatformName) => {
    switch (platform) {
      case 'IKEA':
        return <span className="bg-blue-600 text-yellow-300 font-extrabold px-2 py-0.5 rounded text-[11px] border border-blue-700 shadow-2xs">IKEA</span>;
      case 'Amazon':
        return <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[11px] border border-amber-600 shadow-2xs">Amazon</span>;
      case 'Flipkart':
        return <span className="bg-blue-500 text-white font-bold px-2 py-0.5 rounded text-[11px] border border-blue-600 shadow-2xs">Flipkart</span>;
      case 'Zomato':
        return <span className="bg-rose-600 text-white font-bold px-2 py-0.5 rounded text-[11px] border border-rose-700 shadow-2xs">Zomato</span>;
      case 'Swiggy':
        return <span className="bg-orange-500 text-white font-bold px-2 py-0.5 rounded text-[11px] border border-orange-600 shadow-2xs">Swiggy</span>;
      case 'OYO':
        return <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[11px] border border-red-700 shadow-2xs">OYO</span>;
      case 'CaratLane':
        return <span className="bg-purple-700 text-amber-200 font-bold px-2 py-0.5 rounded text-[11px] border border-purple-800 shadow-2xs">CaratLane</span>;
      case 'Tanishq':
        return <span className="bg-amber-900 text-amber-200 font-bold px-2 py-0.5 rounded text-[11px] border border-amber-950 shadow-2xs">Tanishq</span>;
      default:
        return <span className="bg-slate-800 text-white font-medium px-2 py-0.5 rounded text-[11px]">{platform}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Recommendations Generated
            </span>
            {data.generatedByAI ? (
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-medium">
                Gemini 3.8 Flash AI
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium">
                Verified Fallback Engine
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900">{data.summary}</h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time cross-platform budget breakdown. You can adjust item quantities below to see live updates.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onSavePlan}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isSaved
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            {isSaved ? 'Plan Saved!' : 'Save Plan'}
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>

          <button
            onClick={onReset}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            New Search
          </button>
        </div>
      </div>

      {/* Dynamic Budget Meter (Activity 4.2) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Allocated */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-medium text-slate-500 block">Total Allocated Budget</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {currency}{totalAllocated.toLocaleString()}
            </span>
          </div>

          {/* Spent */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <span className="text-xs font-medium text-indigo-700 block">Estimated Total Spent</span>
            <span className="text-2xl font-bold text-indigo-900 mt-1 block">
              {currency}{currentSpent.toLocaleString()}
            </span>
          </div>

          {/* Surplus or Deficit */}
          <div className={`p-4 rounded-xl border ${
            isOverBudget 
              ? 'bg-rose-50 border-rose-200 text-rose-900' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <span className="text-xs font-medium block">
              {isOverBudget ? 'Budget Exceeded Deficit' : 'Remaining Savings Surplus'}
            </span>
            <span className="text-2xl font-bold mt-1 block">
              {currency}{Math.abs(remaining).toLocaleString()}
            </span>
          </div>

          {/* Savings / Utilization Rate */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-medium text-slate-500 block">Budget Utilization</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-bold ${isOverBudget ? 'text-rose-600' : 'text-slate-900'}`}>
                {percentUsed}%
              </span>
              <span className="text-xs text-slate-500">
                ({items.length} items selected)
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-600">
            <span>Budget Allocation Progress</span>
            <span className={isOverBudget ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
              {currency}{currentSpent.toLocaleString()} of {currency}{totalAllocated.toLocaleString()}
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget
                  ? 'bg-rose-500'
                  : percentUsed > 90
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-emerald-500 to-indigo-600'
              }`}
              style={{ width: `${Math.min(100, percentUsed)}%` }}
            />
          </div>
        </div>

        {/* Platform Share Chips */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            Cross-Platform Spend:
          </span>
          {Object.entries(platformBreakdown).map(([platform, amount]) => (
            <div
              key={platform}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs"
            >
              <span className="font-semibold text-slate-800">{platform}:</span>
              <span className="font-bold text-indigo-700">{currency}{amount.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">
                ({Math.round((amount / (currentSpent || 1)) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Specific Scenario Insights */}
      {/* 1. Multimodal Outfit Analysis (If Jewelry Planner) */}
      {data.plannerType === 'jewelry' && (data as JewelryPlannerResponse).outfitAnalysis && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-2xl p-5 border border-amber-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-amber-600 text-white">
              <Palette className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-amber-950">
              Multimodal Outfit Vision & Color Harmony Analysis
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
              <span className="font-semibold text-amber-900 block mb-1">Color Palette</span>
              <span className="text-slate-700">
                {(data as JewelryPlannerResponse).outfitAnalysis?.detectedColors.join(', ')}
              </span>
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
              <span className="font-semibold text-amber-900 block mb-1">Detected Style</span>
              <span className="text-slate-700">
                {(data as JewelryPlannerResponse).outfitAnalysis?.detectedStyle}
              </span>
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
              <span className="font-semibold text-amber-900 block mb-1">Neckline Pairing</span>
              <span className="text-slate-700">
                {(data as JewelryPlannerResponse).outfitAnalysis?.necklineRecommendation}
              </span>
            </div>
            <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
              <span className="font-semibold text-amber-900 block mb-1">Metal Harmony</span>
              <span className="text-slate-700">
                {(data as JewelryPlannerResponse).outfitAnalysis?.metalHarmony}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Timeline (If Party Planner) */}
      {data.plannerType === 'party' && (data as PartyPlannerResponse).timelineSuggestion && (
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50/40 rounded-2xl p-5 border border-violet-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-violet-600 text-white">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-violet-950">
              Suggested Event Timeline & Service Schedule
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {(data as PartyPlannerResponse).timelineSuggestion.map((step, idx) => (
              <div key={idx} className="p-2.5 bg-white/80 rounded-xl border border-violet-100 text-xs">
                <span className="font-bold text-violet-700 block">{step.time}</span>
                <span className="text-slate-700 text-[11px] mt-0.5 block">{step.activity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Strategy & Styling Insights */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold">PocketSmart AI Strategic Guidance</h3>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(
            (data as HomePlannerResponse).aiStylingInsights ||
            (data as PartyPlannerResponse).aiPartyTips ||
            (data as JewelryPlannerResponse).aiJewelryStylingAdvice ||
            []
          ).map((tip, idx) => (
            <li
              key={idx}
              className="text-xs text-slate-300 p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-2"
            >
              <span className="text-amber-400 font-bold shrink-0">#{idx + 1}</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Itemized Recommendations Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            Itemized Cross-Platform Recommendations ({items.length})
          </h3>
          <span className="text-xs text-slate-500">
            Direct simulated store links &amp; quantity adjustments
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                {/* Platform badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  {getPlatformBadge(item.platform)}
                  <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-medium">
                    {item.category}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 text-[11px] font-bold text-slate-800 shadow-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {item.rating}
                  {item.reviewsCount && (
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({item.reviewsCount})
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-2 mb-1.5">
                    {item.name}
                  </h4>

                  {item.specs && (
                    <p className="text-[11px] text-slate-500 mb-2 line-clamp-2">
                      <span className="font-semibold text-slate-700">Specs: </span>
                      {item.specs}
                    </p>
                  )}

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-3">
                    <p className="text-[11px] text-slate-600 italic">
                      &ldquo;{item.reason}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Quantity modifier and Pricing */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Unit Price</span>
                    <span className="text-xs text-slate-600 font-semibold">
                      {currency}{item.unitPrice.toLocaleString()}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shadow-2xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded bg-white hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shadow-2xs"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Subtotal</span>
                    <span className="text-base font-extrabold text-indigo-700">
                      {currency}{(item.unitPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                  title="Remove this item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Remove</span>
                </button>

                <a
                  href={item.platformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs ml-auto"
                >
                  <span>Buy on {item.platform}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
