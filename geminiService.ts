import { GoogleGenAI } from '@google/genai';
import { 
  HomePlannerRequest, 
  HomePlannerResponse, 
  PartyPlannerRequest, 
  PartyPlannerResponse, 
  JewelryPlannerRequest, 
  JewelryPlannerResponse,
  RecommendedItem,
  BudgetSummary
} from '../../src/types/index';
import { MockCatalogService } from './mockCatalogService';

function calculateBudgetMetrics(budget: number, items: RecommendedItem[], currency: string = '₹'): BudgetSummary {
  const totalEstimatedSpent = items.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
  const remainingBalance = Math.round((budget - totalEstimatedSpent) * 100) / 100;
  const savingsPercentage = budget > 0 ? Math.max(0, Math.round(((budget - totalEstimatedSpent) / budget) * 100)) : 0;

  const platformBreakdown: Record<string, number> = {};
  const categoryBreakdown: Record<string, number> = {};

  items.forEach(item => {
    platformBreakdown[item.platform] = (platformBreakdown[item.platform] || 0) + item.totalPrice;
    categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + item.totalPrice;
  });

  return {
    totalAllocated: budget,
    totalEstimatedSpent,
    remainingBalance,
    savingsPercentage,
    currency,
    platformBreakdown,
    categoryBreakdown,
  };
}

export class GeminiService {
  private static getAIClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // 1. Generate Home Interior Recommendations
  static async generateHomePlan(req: HomePlannerRequest): Promise<HomePlannerResponse> {
    const ai = this.getAIClient();
    const currency = req.currency || '₹';

    if (!ai) {
      const mock = MockCatalogService.getHomeRecommendations(req);
      const budgetSummary = calculateBudgetMetrics(req.budget, mock.items, currency);
      return {
        success: true,
        plannerType: 'home',
        summary: mock.summary,
        budgetSummary,
        items: mock.items,
        aiStylingInsights: mock.tips,
        roomAllocationAdvice: `Smart budget distribution across ${req.roomTypes.join(', ')} prioritizing durable furniture and energy-saving lighting.`,
        generatedByAI: false,
      };
    }

    try {
      const prompt = `You are PocketSmart AI, an expert cross-platform interior designer and budget strategist.
The user wants to plan interior decor and fixtures across platforms like IKEA, Amazon, Flipkart, Pepperfry, and Urban Ladder.

User Parameters:
- Total Budget: ${currency}${req.budget}
- Room Types: ${req.roomTypes.join(', ')}
- Style Preference: ${req.style}
- Specific Quantities requested: ${JSON.stringify(req.quantities)}
- Additional Notes: ${req.customNotes || 'None'}

Goal:
1. Distribute the budget realistically across items (e.g. ceiling fans, pendant lights, dining table, sofa, curtains, storage).
2. The total sum of (unitPrice * quantity) for all items MUST be less than or equal to the total budget (${currency}${req.budget}).
3. Recommend specific, real, recognizable products from Amazon, IKEA, Flipkart, or Pepperfry.
4. Output valid JSON ONLY matching this structure:
{
  "summary": "Short 1-2 sentence overview of the design & budget allocation",
  "roomAllocationAdvice": "Strategic advice on where most budget was spent and where money was saved",
  "aiStylingInsights": ["Tip 1 regarding style/lighting", "Tip 2 regarding energy efficiency/materials", "Tip 3 regarding maintenance"],
  "items": [
    {
      "id": "item-1",
      "name": "Full Product Name with brand",
      "category": "e.g. Lighting / Furniture / Appliances / Soft Furnishings",
      "quantity": 1,
      "unitPrice": 5000,
      "totalPrice": 5000,
      "platform": "IKEA" | "Amazon" | "Flipkart" | "Pepperfry",
      "platformUrl": "https://www.ikea.com or search link",
      "imageUrl": "valid unsplash photo url appropriate for the item",
      "rating": 4.7,
      "specs": "Key dimensions, materials, or energy ratings",
      "reason": "Why this specific product was selected for this budget and style"
    }
  ]
}`;

      const contents: any[] = [];
      if (req.roomImageBase64) {
        const mimeType = req.roomImageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
        const cleanBase64 = req.roomImageBase64.replace(/^data:image\/\w+;base64,/, '');
        contents.push({
          inlineData: {
            mimeType,
            data: cleanBase64,
          }
        });
      }
      contents.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: contents },
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);

      const items: RecommendedItem[] = (parsed.items || []).map((it: any, idx: number) => ({
        id: it.id || `home-item-${idx + 1}`,
        name: it.name || 'Recommended Home Item',
        category: it.category || 'Home Decor',
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice) || Math.round(req.budget * 0.1),
        totalPrice: (Number(it.unitPrice) || Math.round(req.budget * 0.1)) * (Number(it.quantity) || 1),
        platform: (['Amazon', 'IKEA', 'Flipkart', 'Pepperfry'].includes(it.platform) ? it.platform : 'Amazon') as any,
        platformUrl: it.platformUrl || `https://www.google.com/search?q=${encodeURIComponent(it.name || 'home furniture')}`,
        imageUrl: it.imageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
        rating: Number(it.rating) || 4.6,
        specs: it.specs || 'Standard modern specifications',
        reason: it.reason || 'Cost-effective match for specified room dimensions and aesthetic.',
        inStock: true,
      }));

      const budgetSummary = calculateBudgetMetrics(req.budget, items, currency);

      return {
        success: true,
        plannerType: 'home',
        summary: parsed.summary || `Smart budget allocation for ${req.roomTypes.join(' & ')}`,
        budgetSummary,
        items,
        aiStylingInsights: parsed.aiStylingInsights || [
          'Unified color palette blends wooden textures with modern minimalist accents.',
          'Energy-efficient lighting setup minimizes ongoing utility expenses.'
        ],
        roomAllocationAdvice: parsed.roomAllocationAdvice || 'Budget balanced with 50% for core living furniture and 50% for appliances and lighting.',
        generatedByAI: true,
      };
    } catch (err: any) {
      console.warn('Gemini home generation fallback:', err?.message);
      const mock = MockCatalogService.getHomeRecommendations(req);
      const budgetSummary = calculateBudgetMetrics(req.budget, mock.items, currency);
      return {
        success: true,
        plannerType: 'home',
        summary: mock.summary,
        budgetSummary,
        items: mock.items,
        aiStylingInsights: mock.tips,
        roomAllocationAdvice: `Curated recommendation fallback ensuring zero budget overruns.`,
        generatedByAI: false,
      };
    }
  }

  // 2. Generate Party Recommendations
  static async generatePartyPlan(req: PartyPlannerRequest): Promise<PartyPlannerResponse> {
    const ai = this.getAIClient();
    const currency = req.currency || '₹';
    const guests = Math.max(req.guestCount || 20, 1);

    if (!ai) {
      const mock = MockCatalogService.getPartyRecommendations(req);
      const budgetSummary = calculateBudgetMetrics(req.budget, mock.items, currency);
      return {
        success: true,
        plannerType: 'party',
        summary: mock.summary,
        perGuestCost: mock.perGuest,
        budgetSummary,
        items: mock.items,
        aiPartyTips: mock.tips,
        timelineSuggestion: [
          { time: '6:30 PM', activity: 'Venue check, ambient LED lights and playlist setup' },
          { time: '7:30 PM', activity: 'Guest arrival & welcome mocktails via Swiggy Instamart' },
          { time: '8:30 PM', activity: 'Live starters & appetizers from Zomato Gourmet catering' },
          { time: '9:30 PM', activity: 'Karaoke & music with Bluetooth party speaker' },
          { time: '10:30 PM', activity: 'Desserts & party favor distribution' },
        ],
        generatedByAI: false,
      };
    }

    try {
      const prompt = `You are PocketSmart AI, an event planner and budget optimization assistant.
The user wants to plan a party across platforms like Zomato, Swiggy, OYO, Amazon, and Flipkart.

User Parameters:
- Event Type: ${req.eventType}
- Total Budget: ${currency}${req.budget}
- Guest Count: ${guests} people
- Venue Preference: ${req.venueType}
- Food & Catering: ${req.foodPreference}
- Entertainment/Decor Preferences: ${req.entertainmentPreferences.join(', ')}

Goal:
1. Divide budget between Catering/Food (Zomato/Swiggy), Venue (OYO/Townhouse/Lawn), Decor & Lighting (Amazon/Flipkart), and Entertainment (Flipkart/Amazon).
2. Total estimated cost must strictly stay within ${currency}${req.budget}.
3. Provide realistic items with perGuestCost calculation.
4. Output valid JSON ONLY matching:
{
  "summary": "1-2 sentence party concept and budget breakdown",
  "perGuestCost": 850,
  "aiPartyTips": ["Tip 1 regarding food ordering", "Tip 2 regarding venue setup", "Tip 3 regarding playlist/drinks"],
  "timelineSuggestion": [
    { "time": "7:00 PM", "activity": "Guests arrival & welcome drinks" },
    { "time": "8:30 PM", "activity": "Main meal & toasts" }
  ],
  "items": [
    {
      "id": "party-1",
      "name": "Full package/item name",
      "category": "Food & Catering" | "Venue" | "Beverages" | "Decor & Lighting" | "Entertainment",
      "quantity": 1,
      "unitPrice": 12000,
      "totalPrice": 12000,
      "platform": "Zomato" | "Swiggy" | "OYO" | "Amazon" | "Flipkart",
      "platformUrl": "valid platform url",
      "imageUrl": "valid unsplash party/food photo url",
      "rating": 4.8,
      "specs": "Included items/pax details",
      "reason": "Why this represents the best value for this guest count"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const items: RecommendedItem[] = (parsed.items || []).map((it: any, idx: number) => ({
        id: it.id || `party-item-${idx + 1}`,
        name: it.name || 'Party Essential',
        category: it.category || 'Party Supplies',
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice) || Math.round(req.budget * 0.2),
        totalPrice: (Number(it.unitPrice) || Math.round(req.budget * 0.2)) * (Number(it.quantity) || 1),
        platform: (['Zomato', 'Swiggy', 'OYO', 'Amazon', 'Flipkart'].includes(it.platform) ? it.platform : 'Zomato') as any,
        platformUrl: it.platformUrl || 'https://www.zomato.com',
        imageUrl: it.imageUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
        rating: Number(it.rating) || 4.7,
        specs: it.specs || 'Party standard specifications',
        reason: it.reason || 'Optimized for event crowd and seamless delivery.',
        inStock: true,
      }));

      const budgetSummary = calculateBudgetMetrics(req.budget, items, currency);
      const perGuestCost = parsed.perGuestCost || Math.round((budgetSummary.totalEstimatedSpent / guests) * 100) / 100;

      return {
        success: true,
        plannerType: 'party',
        summary: parsed.summary || `${req.eventType} organized for ${guests} guests within budget.`,
        perGuestCost,
        budgetSummary,
        items,
        aiPartyTips: parsed.aiPartyTips || [
          'Pre-order catering 48 hours early on Zomato Pro for discounted volume rates.',
          'Stock extra ice and mocktail syrups via Swiggy Instamart for instant on-demand replenishment.'
        ],
        timelineSuggestion: parsed.timelineSuggestion || [
          { time: '7:00 PM', activity: 'Guest arrival & welcome drink stations' },
          { time: '8:30 PM', activity: 'Dinner & appetizers buffet' },
          { time: '10:00 PM', activity: 'Cake cutting and party games' }
        ],
        generatedByAI: true,
      };
    } catch (err: any) {
      console.warn('Gemini party generation fallback:', err?.message);
      const mock = MockCatalogService.getPartyRecommendations(req);
      const budgetSummary = calculateBudgetMetrics(req.budget, mock.items, currency);
      return {
        success: true,
        plannerType: 'party',
        summary: mock.summary,
        perGuestCost: mock.perGuest,
        budgetSummary,
        items: mock.items,
        aiPartyTips: mock.tips,
        timelineSuggestion: [
          { time: '7:00 PM', activity: 'Welcome & cocktails' },
          { time: '8:30 PM', activity: 'Catering dinner' }
        ],
        generatedByAI: false,
      };
    }
  }

  // 3. Generate Jewelry Recommendations with Multimodal Outfit Image Matching
  static async generateJewelryPlan(req: JewelryPlannerRequest): Promise<JewelryPlannerResponse> {
    const ai = this.getAIClient();
    const currency = req.currency || '₹';

    if (!ai) {
      const mock = MockCatalogService.getJewelryRecommendations(req);
      const budgetSummary = calculateBudgetMetrics(req.budget, mock.items, currency);
      return {
        success: true,
        plannerType: 'jewelry',
        summary: mock.summary,
        budgetSummary,
        items: mock.items,
        outfitAnalysis: mock.outfitAnalysis,
        aiJewelryStylingAdvice: mock.tips,
        generatedByAI: false,
      };
    }

    try {
      const prompt = `You are PocketSmart AI, an expert jewelry stylist and certified gemologist.
The user wants to find matching jewelry sets across platforms like CaratLane, Tanishq, Mia by Tanishq, Amazon Fashion, and Nykaa Fashion.

User Parameters:
- Occasion: ${req.occasion}
- Total Budget: ${currency}${req.budget}
- Preferred Metal/Material: ${req.metalPreference}
- Target Item Categories: ${req.targetItems.join(', ')}
- Outfit Description: ${req.outfitDescription || 'Not specified'}
${req.outfitImageBase64 ? 'Note: An outfit photo has been attached! Carefully analyze the outfit colors, fabric texture, embroidery, neckline, and aesthetic to recommend coordinating jewelry.' : ''}

Goal:
1. Recommend certified, tasteful jewelry items that coordinate with the outfit and occasion without exceeding ${currency}${req.budget}.
2. Output valid JSON ONLY matching:
{
  "summary": "1-2 sentence jewelry pairing description",
  "outfitAnalysis": {
    "detectedColors": ["Color 1", "Accent Color 2"],
    "detectedStyle": "Style classification (e.g. Royal Traditional, Contemporary Indo-Western, Cocktail Glam)",
    "necklineRecommendation": "Matching necklace silhouette advice based on outfit neckline",
    "metalHarmony": "Why this metal complements the outfit tones"
  },
  "aiJewelryStylingAdvice": ["Styling tip 1", "Styling tip 2 regarding balance (e.g., heavy earrings vs light necklace)", "Certification & care tip 3"],
  "items": [
    {
      "id": "jewel-1",
      "name": "Full Jewelry Name including Karat/Metal",
      "category": "Necklace & Chokers" | "Earrings & Jhumkas" | "Bracelets & Bangles" | "Rings" | "Maang Tikka",
      "quantity": 1,
      "unitPrice": 18000,
      "totalPrice": 18000,
      "platform": "CaratLane" | "Tanishq" | "Amazon" | "Nykaa Fashion" | "Flipkart",
      "platformUrl": "https://www.caratlane.com or relevant platform url",
      "imageUrl": "valid unsplash jewelry photo url",
      "rating": 4.9,
      "specs": "Metal purity (e.g. 14K / 18K / 22K or 925 Silver), Stone type, Hallmarking",
      "reason": "Why this piece harmonizes with the outfit neckline and occasion"
    }
  ]
}`;

      const contents: any[] = [];
      if (req.outfitImageBase64) {
        const mimeType = req.outfitImageMimeType || (req.outfitImageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg');
        const cleanBase64 = req.outfitImageBase64.replace(/^data:image\/\w+;base64,/, '');
        contents.push({
          inlineData: {
            mimeType,
            data: cleanBase64,
          }
        });
      }
      contents.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: contents },
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const items: RecommendedItem[] = (parsed.items || []).map((it: any, idx: number) => ({
        id: it.id || `jewel-item-${idx + 1}`,
        name: it.name || 'Jewelry Piece',
        category: it.category || 'Jewelry',
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice) || Math.round(req.budget * 0.25),
        totalPrice: (Number(it.unitPrice) || Math.round(req.budget * 0.25)) * (Number(it.quantity) || 1),
        platform: (['CaratLane', 'Tanishq', 'Amazon', 'Nykaa Fashion', 'Flipkart'].includes(it.platform) ? it.platform : 'CaratLane') as any,
        platformUrl: it.platformUrl || 'https://www.caratlane.com',
        imageUrl: it.imageUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        rating: Number(it.rating) || 4.8,
        specs: it.specs || 'BIS Hallmarked & Certified Authentic',
        reason: it.reason || 'Complements outfit neckline and matches occasion dress code.',
        inStock: true,
      }));

      const budgetSummary = calculateBudgetMetrics(req.budget, items, currency);

      return {
        success: true,
        plannerType: 'jewelry',
        summary: parsed.summary || `Coordinated jewelry collection for ${req.occasion}.`,
        budgetSummary,
        items,
        outfitAnalysis: parsed.outfitAnalysis || {
          detectedColors: ['Harmonious Tones'],
          detectedStyle: `${req.occasion} Style`,
          necklineRecommendation: 'Balanced neckline with layered pendant and matching drop earrings.',
          metalHarmony: `${req.metalPreference} accents the outfit elegance.`
        },
        aiJewelryStylingAdvice: parsed.aiJewelryStylingAdvice || [
          'Choose one focal statement piece (e.g. choker or chandelier earrings) to avoid visual overcrowding.',
          'Verify BIS hallmark stamp on gold or 925 mark on sterling silver for long-term purity.'
        ],
        generatedByAI: true,
      };
    } catch (err: any) {
      console.warn('Gemini jewelry generation fallback:', err?.message);
      const mock = MockCatalogService.getJewelryRecommendations(req);
      const budgetSummary = calculateBudgetMetrics(req.budget, mock.items, currency);
      return {
        success: true,
        plannerType: 'jewelry',
        summary: mock.summary,
        budgetSummary,
        items: mock.items,
        outfitAnalysis: mock.outfitAnalysis,
        aiJewelryStylingAdvice: mock.tips,
        generatedByAI: false,
      };
    }
  }
}
