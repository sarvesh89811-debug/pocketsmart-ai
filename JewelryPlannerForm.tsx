import React, { useState } from 'react';
import { JewelryPlannerRequest } from '../types/index';
import { 
  Sparkles, 
  Gem, 
  Upload, 
  Check, 
  Zap, 
  Eye, 
  Palette, 
  ShieldCheck,
  Camera,
  Trash2
} from 'lucide-react';

interface JewelryPlannerFormProps {
  onSubmit: (data: JewelryPlannerRequest) => void;
  isLoading: boolean;
  currency: string;
}

const OCCASIONS = [
  { id: 'Wedding & Reception', label: 'Wedding & Reception', icon: '💍', desc: 'Heavy heirloom & bridal sparkle' },
  { id: 'Festive / Diwali / Eid', label: 'Festive / Diwali / Eid', icon: '🪔', desc: 'Traditional Kundan, Gold & Polki' },
  { id: 'Cocktail / Evening Gala', label: 'Cocktail Gala', icon: '🍸', desc: 'Contemporary Diamonds & Rose Gold' },
  { id: 'Everyday Office Wear', label: 'Daily Office Chic', icon: '💼', desc: 'Minimalist 925 Silver & Solitaires' },
  { id: 'Casual Day Out', label: 'Casual Bohemian', icon: '🌸', desc: 'Layered Oxidized Silver & beads' }
];

const METALS = [
  { id: '22K Traditional Yellow Gold', label: '22K Yellow Gold', purity: '91.6% Pure BIS Hallmarked' },
  { id: '18K Modern Rose Gold & Diamonds', label: '18K Rose Gold & Diamonds', purity: 'Contemporary Luxury IGI Certified' },
  { id: '925 Sterling Silver & Moissanite', label: '925 Sterling Silver', purity: 'Anti-tarnish Rhodium Plated' },
  { id: 'Heritage Kundan & Jadau Polki', label: 'Kundan & Jadau Polki', purity: 'Royal Bridal Glass & 24K Foiling' },
  { id: 'Tribal Oxidized Silver', label: 'Oxidized Silver', purity: 'Vintage Textured Artisan Craft' }
];

const JEWELRY_PIECES = [
  { id: 'Necklace & Chokers', label: 'Necklace / Choker Set' },
  { id: 'Earrings & Jhumkas', label: 'Earrings / Jhumkas' },
  { id: 'Bracelets & Bangles', label: 'Bangles / Tennis Bracelet' },
  { id: 'Rings', label: 'Cocktail / Solitaire Ring' },
  { id: 'Maang Tikka', label: 'Maang Tikka / Mathapatti' }
];

// 4 Sample Outfit Presets for instant Multimodal testing
const SAMPLE_OUTFITS = [
  {
    name: 'Emerald Silk Kanjeevaram Saree',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    description: 'Deep emerald green pure silk saree with intricate golden zari border and deep round neckline.',
    occasion: 'Festive / Diwali / Eid',
    metal: '22K Traditional Yellow Gold',
    budget: 45000
  },
  {
    name: 'Crimson Red Royal Bridal Lehenga',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    description: 'Crimson red velvet lehenga embroidered with antique gold thread work and sweetheart neckline blouse.',
    occasion: 'Wedding & Reception',
    metal: 'Heritage Kundan & Jadau Polki',
    budget: 85000
  },
  {
    name: 'Midnight Navy Velvet Cocktail Gown',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    description: 'Midnight navy off-shoulder satin cocktail dress with clean silhouette.',
    occasion: 'Cocktail / Evening Gala',
    metal: '18K Modern Rose Gold & Diamonds',
    budget: 35000
  },
  {
    name: 'Ivory Pastel Chanderi Anarkali',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    description: 'Subtle ivory and peach pastel georgette Anarkali suit with delicate silver sequin work and V-neckline.',
    occasion: 'Everyday Office Wear',
    metal: '925 Sterling Silver & Moissanite',
    budget: 20000
  }
];

export const JewelryPlannerForm: React.FC<JewelryPlannerFormProps> = ({ onSubmit, isLoading, currency }) => {
  const isUSD = currency === '$';
  const defaultBudget = isUSD ? 600 : 40000;

  const [budget, setBudget] = useState<number>(defaultBudget);
  const [occasion, setOccasion] = useState<string>('Wedding & Reception');
  const [metalPreference, setMetalPreference] = useState<string>('18K Modern Rose Gold & Diamonds');
  const [targetItems, setTargetItems] = useState<string[]>([
    'Necklace & Chokers',
    'Earrings & Jhumkas',
    'Bracelets & Bangles'
  ]);
  const [outfitDescription, setOutfitDescription] = useState<string>('Royal emerald green silk with golden zari border.');
  const [outfitImage, setOutfitImage] = useState<string | null>(SAMPLE_OUTFITS[0].image);
  const [outfitImageMime, setOutfitImageMime] = useState<string>('image/jpeg');

  const toggleItem = (item: string) => {
    if (targetItems.includes(item)) {
      if (targetItems.length > 1) {
        setTargetItems(targetItems.filter(i => i !== item));
      }
    } else {
      setTargetItems([...targetItems, item]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOutfitImageMime(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onloadend = () => {
        setOutfitImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const applySampleOutfit = (preset: typeof SAMPLE_OUTFITS[0]) => {
    setOutfitImage(preset.image);
    setOutfitDescription(preset.description);
    setOccasion(preset.occasion);
    setMetalPreference(preset.metal);
    setBudget(isUSD ? Math.round(preset.budget * 0.012) : preset.budget);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      budget,
      currency,
      occasion,
      metalPreference,
      targetItems,
      outfitDescription,
      outfitImageBase64: outfitImage || undefined,
      outfitImageMimeType: outfitImageMime
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Banner */}
      <div className="p-6 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Gem className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              Multimodal Visual AI &bull; CaratLane, Tanishq & Mia
            </span>
          </div>
          <h2 className="text-2xl font-bold">Jewelry & Outfit Matching Planner</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Upload your outfit photo or pick a sample preset. Gemini extracts the color palette, neckline cut, and fabric to suggest perfectly harmonized jewelry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-semibold">
            <Eye className="w-3.5 h-3.5" />
            Gemini Multimodal Active
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        {/* Step 1: Multimodal Outfit Photo Upload with 1-Click Samples */}
        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <label className="text-sm font-bold text-amber-950 flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-600" />
                1. Outfit Photo & Visual Matching (Multimodal Input)
              </label>
              <p className="text-xs text-amber-800">
                AI analyzes fabric luster, colors, and neckline to coordinate matching metals and stones.
              </p>
            </div>
            <span className="text-xs font-medium text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300">
              Activity 1.2 & 2.3
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Image Preview & Upload Zone */}
            <div className="lg:col-span-5">
              <div className="relative border-2 border-dashed border-amber-300 bg-white rounded-xl p-3 text-center overflow-hidden">
                {outfitImage ? (
                  <div className="relative group">
                    <img
                      src={outfitImage}
                      alt="Outfit Preview"
                      className="w-full h-44 object-cover rounded-lg shadow-inner"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <label className="px-3 py-1.5 rounded-md bg-white text-slate-800 text-xs font-semibold cursor-pointer shadow-md">
                        Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setOutfitImage(null)}
                        className="p-1.5 rounded-md bg-rose-600 text-white shadow-md"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer py-6 block">
                    <Camera className="w-8 h-8 mx-auto text-amber-500 mb-1" />
                    <span className="text-xs font-bold text-amber-800 block">
                      Click to upload outfit image
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      JPG, PNG, or WEBP (up to 15MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Instant Sample Presets to test Multimodal immediately */}
            <div className="lg:col-span-7">
              <div className="text-xs font-semibold text-amber-900 mb-2">
                Or test instantly with curated outfit presets:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_OUTFITS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applySampleOutfit(preset)}
                    className="p-2 rounded-xl border border-amber-200/80 bg-white hover:bg-amber-100/50 text-left transition-all flex items-center gap-2.5 shadow-xs"
                  >
                    <img
                      src={preset.image}
                      alt={preset.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-amber-800">
                        {preset.occasion} &bull; {currency}{preset.budget.toLocaleString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Text Description */}
              <div className="mt-3">
                <input
                  type="text"
                  value={outfitDescription}
                  onChange={e => setOutfitDescription(e.target.value)}
                  placeholder="Outfit notes: e.g. Royal emerald silk, sweetheart neckline, gold zari embroidery..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-amber-200 bg-white focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Budget */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            2. Total Jewelry Budget
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold">
                {currency}
              </span>
              <input
                type="number"
                min={50}
                max={5000000}
                step={isUSD ? 50 : 1000}
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                required
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg font-bold text-slate-900"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(isUSD ? [300, 600, 1200, 2500] : [20000, 40000, 85000, 150000]).map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setBudget(val)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap ${
                    budget === val
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {currency}{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Occasion Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            3. Select Occasion
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {OCCASIONS.map(oc => {
              const isSelected = occasion === oc.id;
              return (
                <div
                  key={oc.id}
                  onClick={() => setOccasion(oc.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xl mb-1">{oc.icon}</div>
                  <div className="text-xs font-bold text-slate-900">{oc.label}</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{oc.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 4: Metal & Material Preference */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            4. Preferred Metal & Gemstone Purity
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {METALS.map(m => {
              const isSelected = metalPreference === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setMetalPreference(m.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{m.label}</span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border ${
                        isSelected ? 'border-4 border-amber-600 bg-white' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{m.purity}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 5: Jewelry Categories */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            5. Target Jewelry Pieces to Include in Set
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {JEWELRY_PIECES.map(item => {
              const isSelected = targetItems.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/70 ring-1 ring-amber-600 text-amber-950 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span className="text-xs mb-1.5">{item.label}</span>
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center border text-[10px] ${
                      isSelected
                        ? 'bg-amber-600 border-amber-600 text-white'
                        : 'border-slate-300 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-3" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-bold text-base shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>PocketSmart AI Multimodal is Analyzing Outfit & Gemstones...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Multimodal Jewelry Recommendations</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
