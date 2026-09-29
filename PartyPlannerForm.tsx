import React, { useState } from 'react';
import { PartyPlannerRequest } from '../types/index';
import { 
  PartyPopper, 
  Users, 
  Sparkles, 
  MapPin, 
  UtensilsCrossed, 
  Music, 
  Zap, 
  Check,
  Calendar,
  Gift
} from 'lucide-react';

interface PartyPlannerFormProps {
  onSubmit: (data: PartyPlannerRequest) => void;
  isLoading: boolean;
  currency: string;
}

const EVENT_TYPES = [
  { id: 'Birthday Party', label: 'Birthday Bash', icon: '🎂' },
  { id: 'Anniversary Dinner', label: 'Anniversary Celebration', icon: '🥂' },
  { id: 'Housewarming Party', label: 'Housewarming', icon: '🏡' },
  { id: 'Cocktail & Mocktail Soiree', label: 'Cocktail Soiree', icon: '🍸' },
  { id: 'Festive Gathering', label: 'Festive Gathering', icon: '✨' },
  { id: 'Game Night & Reunion', label: 'Game Night / Reunion', icon: '🎮' }
];

const VENUE_OPTIONS = [
  { id: 'Living Room / Terrace at Home', label: 'Home Living / Terrace', desc: 'Zero venue rental, max budget for food & music' },
  { id: 'OYO Townhouse Party Suite', label: 'OYO Townhouse / Party Suite', desc: 'Private AC hall, soundproof, cleanup included' },
  { id: 'Rented Party Lawn / Clubhouse', label: 'Clubhouse / Open Lawn', desc: 'Spacious outdoor setting for larger gatherings' }
];

const FOOD_PREFERENCES = [
  { id: 'Zomato Pro Gourmet Catering Box', label: 'Zomato Gourmet Catering', desc: 'Hot multi-course buffet box with starters & mains' },
  { id: 'Swiggy Instamart DIY Mocktails & Finger Foods', label: 'Swiggy Mixology & Appetizers', desc: 'On-demand artisanal mixers, finger dips, dynamic restock' },
  { id: 'Live Barbecue & Street Food Counter', label: 'Live BBQ & Chaat Counter', desc: 'Interactive chef counter setup' }
];

const ENTERTAINMENT_OPTIONS = [
  { id: 'Themed Balloon Arch & Backdrops', label: 'Balloon Arch & Photo Backdrop (Amazon)' },
  { id: 'Bluetooth Party Speaker & Karaoke Mic', label: '20W Karaoke Bluetooth Speaker (Flipkart)' },
  { id: 'Fairy Canopy String Lights', label: 'Warm Fairy String Lights (Amazon)' },
  { id: 'Party Games & Fun Props', label: 'Photo Booth Props & Board Games' },
  { id: 'Curated Return Favors', label: 'Personalized Guest Return Gift Bags' }
];

export const PartyPlannerForm: React.FC<PartyPlannerFormProps> = ({ onSubmit, isLoading, currency }) => {
  const isUSD = currency === '$';
  const defaultBudget = isUSD ? 400 : 25000;

  const [budget, setBudget] = useState<number>(defaultBudget);
  const [eventType, setEventType] = useState<string>('Birthday Party');
  const [guestCount, setGuestCount] = useState<number>(20);
  const [venueType, setVenueType] = useState<string>('OYO Townhouse Party Suite');
  const [foodPreference, setFoodPreference] = useState<string>('Zomato Pro Gourmet Catering Box');
  const [selectedEntertainment, setSelectedEntertainment] = useState<string[]>([
    'Themed Balloon Arch & Backdrops',
    'Bluetooth Party Speaker & Karaoke Mic',
    'Fairy Canopy String Lights'
  ]);
  const [customNotes, setCustomNotes] = useState<string>('');

  const perGuest = Math.round((budget / Math.max(guestCount, 1)) * 10) / 10;

  const toggleEntertainment = (item: string) => {
    if (selectedEntertainment.includes(item)) {
      if (selectedEntertainment.length > 1) {
        setSelectedEntertainment(selectedEntertainment.filter(i => i !== item));
      }
    } else {
      setSelectedEntertainment([...selectedEntertainment, item]);
    }
  };

  const applyPreset = (type: 'birthday' | 'intimate') => {
    if (type === 'birthday') {
      setBudget(isUSD ? 450 : 30000);
      setEventType('Birthday Party');
      setGuestCount(25);
      setVenueType('OYO Townhouse Party Suite');
      setFoodPreference('Zomato Pro Gourmet Catering Box');
      setSelectedEntertainment([
        'Themed Balloon Arch & Backdrops',
        'Bluetooth Party Speaker & Karaoke Mic',
        'Fairy Canopy String Lights'
      ]);
      setCustomNotes('Evening birthday party from 7 PM to 11 PM with upbeat playlist.');
    } else {
      setBudget(isUSD ? 250 : 15000);
      setEventType('Anniversary Dinner');
      setGuestCount(12);
      setVenueType('Living Room / Terrace at Home');
      setFoodPreference('Swiggy Instamart DIY Mocktails & Finger Foods');
      setSelectedEntertainment([
        'Fairy Canopy String Lights',
        'Curated Return Favors'
      ]);
      setCustomNotes('Cozy candlelight rooftop anniversary dinner for close friends and family.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      budget,
      currency,
      eventType,
      guestCount,
      venueType,
      foodPreference,
      entertainmentPreferences: selectedEntertainment,
      customNotes
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Banner */}
      <div className="p-6 bg-gradient-to-r from-violet-900 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-400/30">
              <PartyPopper className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-pink-300">
              Scenario 2 &bull; Zomato, Swiggy, OYO & Amazon
            </span>
          </div>
          <h2 className="text-2xl font-bold">Party & Event Planner</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Scale catering per guest, lock budget-friendly venues, and grab celebration gear seamlessly without unexpected bills.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('birthday')}
            className="px-3 py-1 text-xs rounded-md bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-all flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-pink-400" />
            25-Pax Birthday
          </button>
          <button
            type="button"
            onClick={() => applyPreset('intimate')}
            className="px-3 py-1 text-xs rounded-md bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-all flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            12-Pax Dinner
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        {/* Step 1: Event Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            1. Select Event Occasion
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {EVENT_TYPES.map(ev => {
              const isSelected = eventType === ev.id;
              return (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => setEventType(ev.id)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600 text-indigo-950 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span className="text-2xl mb-1">{ev.icon}</span>
                  <span className="text-xs">{ev.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Budget & Guest Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              2. Total Party Budget
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold">
                {currency}
              </span>
              <input
                type="number"
                min={50}
                max={5000000}
                step={isUSD ? 25 : 1000}
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                required
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg font-bold text-slate-900"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              {(isUSD ? [200, 400, 800, 1500] : [15000, 25000, 50000, 100000]).map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setBudget(val)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${
                    budget === val ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  {currency}{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Guest Count with dynamic live per-guest calculator */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              3. Expected Number of Guests
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.max(5, guestCount - 5))}
                  className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-lg"
                >
                  -
                </button>
                <div className="px-5 text-center">
                  <span className="text-xl font-bold text-slate-900">{guestCount}</span>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Guests</span>
                </div>
                <button
                  type="button"
                  onClick={() => setGuestCount(guestCount + 5)}
                  className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-lg"
                >
                  +
                </button>
              </div>

              {/* Dynamic Live Badge */}
              <div className="flex-1 p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Estimated Per Guest</div>
                  <div className="text-base font-bold text-indigo-900">
                    {currency}{perGuest.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ person</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Venue Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            4. Preferred Venue Option (OYO / Home / Hall)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {VENUE_OPTIONS.map(v => {
              const isSelected = venueType === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => setVenueType(v.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{v.label}</span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border ${
                        isSelected ? 'border-4 border-indigo-600 bg-white' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 4: Food & Catering Preference */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            5. Catering & Food Ecosystem (Zomato / Swiggy)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {FOOD_PREFERENCES.map(f => {
              const isSelected = foodPreference === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => setFoodPreference(f.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{f.label}</span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border ${
                        isSelected ? 'border-4 border-indigo-600 bg-white' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 5: Decor & Entertainment Multi-selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            6. Decor, Music & Party Essentials (Amazon & Flipkart)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {ENTERTAINMENT_OPTIONS.map(item => {
              const isSelected = selectedEntertainment.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleEntertainment(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600 text-indigo-950 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="text-xs">{item.label}</span>
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center border text-[10px] shrink-0 ml-2 ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-3" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 6: Custom Notes */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-1">
            Additional Dietary Notes or Theme Requests
          </label>
          <textarea
            rows={3}
            value={customNotes}
            onChange={e => setCustomNotes(e.target.value)}
            placeholder="e.g. 50% vegetarian guests, need mocktail ice bucket delivered at 8 PM, retro 90s theme decor..."
            className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-violet-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>PocketSmart AI is Calculating Zomato, Swiggy & OYO Plans...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Smart Party & Event Budget Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
