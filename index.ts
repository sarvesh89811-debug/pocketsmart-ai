export type PlatformName = 
  | 'Amazon'
  | 'IKEA'
  | 'Flipkart'
  | 'Zomato'
  | 'Swiggy'
  | 'OYO'
  | 'CaratLane'
  | 'Tanishq'
  | 'Pepperfry'
  | 'Nykaa Fashion';

export interface RecommendedItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  platform: PlatformName;
  platformUrl: string;
  imageUrl: string;
  rating: number;
  reviewsCount?: number;
  specs?: string;
  reason: string;
  inStock?: boolean;
}

export interface BudgetSummary {
  totalAllocated: number;
  totalEstimatedSpent: number;
  remainingBalance: number;
  savingsPercentage: number;
  currency: string;
  platformBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
}

// 1. Home Interior Planner Request & Response
export interface HomePlannerRequest {
  budget: number;
  currency?: string;
  roomTypes: string[];
  style: string;
  quantities: {
    ceilingFans?: number;
    lights?: number;
    diningTable?: number;
    sofas?: number;
    curtains?: number;
    storage?: number;
    wallDecor?: number;
    rugs?: number;
    [key: string]: number | undefined;
  };
  customNotes?: string;
  roomImageBase64?: string;
}

export interface HomePlannerResponse {
  success: boolean;
  plannerType: 'home';
  summary: string;
  budgetSummary: BudgetSummary;
  items: RecommendedItem[];
  aiStylingInsights: string[];
  roomAllocationAdvice: string;
  generatedByAI: boolean;
}

// 2. Party Planner Request & Response
export interface PartyPlannerRequest {
  budget: number;
  currency?: string;
  eventType: string;
  guestCount: number;
  venueType: string;
  foodPreference: string;
  entertainmentPreferences: string[];
  customNotes?: string;
}

export interface PartyPlannerResponse {
  success: boolean;
  plannerType: 'party';
  summary: string;
  perGuestCost: number;
  budgetSummary: BudgetSummary;
  items: RecommendedItem[];
  aiPartyTips: string[];
  timelineSuggestion: { time: string; activity: string }[];
  generatedByAI: boolean;
}

// 3. Jewelry Planner Request & Response
export interface JewelryPlannerRequest {
  budget: number;
  currency?: string;
  occasion: string;
  metalPreference: string;
  targetItems: string[];
  outfitDescription?: string;
  outfitImageBase64?: string; // Multimodal input
  outfitImageMimeType?: string;
}

export interface JewelryPlannerResponse {
  success: boolean;
  plannerType: 'jewelry';
  summary: string;
  budgetSummary: BudgetSummary;
  items: RecommendedItem[];
  outfitAnalysis?: {
    detectedColors: string[];
    detectedStyle: string;
    necklineRecommendation: string;
    metalHarmony: string;
  };
  aiJewelryStylingAdvice: string[];
  generatedByAI: boolean;
}

// Project Workflow Checklist for SmartBridge & SmartInternz review
export interface WorkflowActivity {
  id: string;
  phase: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'verified';
  details: string;
}
