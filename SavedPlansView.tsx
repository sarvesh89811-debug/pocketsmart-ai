import React from 'react';
import { HomePlannerResponse, PartyPlannerResponse, JewelryPlannerResponse } from '../types/index';
import { Bookmark, Trash2, ArrowRight, Eye, Calendar, Sparkles } from 'lucide-react';

interface SavedPlanItem {
  id: string;
  savedAt: string;
  currency: string;
  data: HomePlannerResponse | PartyPlannerResponse | JewelryPlannerResponse;
}

interface SavedPlansViewProps {
  plans: SavedPlanItem[];
  onSelectPlan: (plan: SavedPlanItem) => void;
  onDeletePlan: (id: string) => void;
  currency: string;
}

export const SavedPlansView: React.FC<SavedPlansViewProps> = ({
  plans,
  onSelectPlan,
  onDeletePlan,
  currency
}) => {
  if (plans.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Bookmark className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No Saved Plans Yet</h3>
        <p className="text-xs text-slate-500 mb-6">
          When you generate a Home, Party, or Jewelry budget recommendation, click &ldquo;Save Plan&rdquo; to store it here for future reference or printing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Your Saved Budget Plans</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Locally stored budget allocations across Home, Party, and Jewelry planners.
          </p>
        </div>
        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
          {plans.length} Saved {plans.length === 1 ? 'Plan' : 'Plans'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {plans.map(plan => {
          const budgetSummary = plan.data.budgetSummary;
          const plannerTypeLabel = 
            plan.data.plannerType === 'home' ? 'Home Interior' :
            plan.data.plannerType === 'party' ? 'Party & Event' : 'Jewelry & Outfit';

          return (
            <div
              key={plan.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {plannerTypeLabel}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(plan.savedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 line-clamp-2 mb-2">
                  {plan.data.summary}
                </h3>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Allocated Budget:</span>
                    <span className="font-semibold text-slate-800">
                      {plan.currency}{budgetSummary.totalAllocated.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Spent:</span>
                    <span className="font-bold text-indigo-700">
                      {plan.currency}{budgetSummary.totalEstimatedSpent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Surplus / Savings:</span>
                    <span className="font-semibold text-emerald-600">
                      {plan.currency}{budgetSummary.remainingBalance.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 mb-3">
                  <span className="font-semibold">{plan.data.items.length} items</span> across{' '}
                  {Object.keys(budgetSummary.platformBreakdown).join(', ')}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onDeletePlan(plan.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Delete saved plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onSelectPlan(plan)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
