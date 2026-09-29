import React, { useState } from 'react';
import { HomePlannerRequest } from '../types/index';
import { 
  Home, 
  Sparkles, 
  Wind, 
  Lightbulb, 
  Armchair, 
  Table, 
  Layers, 
  Upload, 
  Check, 
  Zap, 
  Image as ImageIcon,
  DollarSign
} from 'lucide-react';

interface HomePlannerFormProps {
  onSubmit: (data: HomePlannerRequest) => void;
  isLoading: boolean;
  currency: string;
}

const ROOM_OPTIONS = [
  { id: 'Living Room', label: 'Living Room', icon: '🛋️' },
  { id: 'Kitchen', label: 'Kitchen & Dining', icon: '🍳' },
  { id: 'Bedroom', label: 'Master Bedroom', icon: '🛏️' },
  { id: 'Home Office', label: 'Home Office / Study', icon: '💻' },
  { id: 'Balcony', label: 'Balcony & Patio', icon: '🪴' },
];

const STYLE_OPTIONS = [
  { id: 'Modern Minimalist', label: 'Modern Minimalist', desc: 'Clean lines, neutral tones, uncluttered focus' },
  { id: 'Scandinavian Warmth', label: 'Scandinavian', desc: 'Light woods, warm textiles, functional cozy feel' },
  { id: 'Bohemian Chic', label: 'Bohemian Eclectic', desc: 'Rattan, lively patterns, abundant greenery' },
  { id: 'Contemporary Indian', label: 'Contemporary Indian', desc: 'Teak accents, brass touches, rich fabrics' },
  { id: 'Industrial Loft', label: 'Industrial Loft', desc: 'Exposed metal frames, rustic finish, amber lighting' }
];

export const HomePlannerForm: React.FC<HomePlannerFormProps> = ({ onSubmit, isLoading, currency }) => {
  const isUSD = currency === '$';
  const defaultBudget = isUSD ? 1000 : 65000;

  const [budget, setBudget] = useState<number>(defaultBudget);
  const [selectedRooms, setSelectedRooms] = useState<string[]>(['Living Room', 'Bedroom']);
  const [style, setStyle] = useState<string>('Modern Minimalist');
  const [quantities, setQuantities] = useState({
    ceilingFans: 2,
    lights: 4,
    diningTable: 1,
    sofas: 1,
    curtains: 2,
    storage: 1
  });
  const [customNotes, setCustomNotes] = useState<string>('');
  const [roomImage, setRoomImage] = useState<string | null>(null);

  const toggleRoom = (room: string) => {
    if (selectedRooms.includes(room)) {
      if (selectedRooms.length > 1) {
        setSelectedRooms(selectedRooms.filter(r => r !== room));
      }
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  const updateQuantity = (key: keyof typeof quantities, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRoomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyPreset = (presetName: string) => {
    if (presetName === '1bhk') {
      setBudget(isUSD ? 750 : 50000);
      setSelectedRooms(['Living Room']);
      setStyle('Scandinavian Warmth');
      setQuantities({
        ceilingFans: 1,
        lights: 3,
        diningTable: 1,
        sofas: 1,
        curtains: 2,
        storage: 1
      });
      setCustomNotes('Compact 1BHK living area needing space-saving furniture.');
    } else if (presetName === '2bhk') {
      setBudget(isUSD ? 1500 : 120000);
      setSelectedRooms(['Living Room', 'Bedroom', 'Kitchen']);
      setStyle('Modern Minimalist');
      setQuantities({
        ceilingFans: 3,
        lights: 6,
        diningTable: 1,
        sofas: 2,
        curtains: 4,
        storage: 2
      });
      setCustomNotes('2BHK apartment overhaul balancing IKEA fixtures with durable Amazon appliances.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      budget,
      currency,
      roomTypes: selectedRooms,
      style,
      quantities,
      customNotes,
      roomImageBase64: roomImage || undefined
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Home className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Scenario 1 &bull; SmartBridge Task
            </span>
          </div>
          <h2 className="text-2xl font-bold">Home Interior Planner</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Input your budget, rooms, and item counts. Gemini optimizes allocations across IKEA, Amazon, and Flipkart with zero overruns.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Quick Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('1bhk')}
            className="px-3 py-1 text-xs rounded-md bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-all flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            1BHK Starter
          </button>
          <button
            type="button"
            onClick={() => applyPreset('2bhk')}
            className="px-3 py-1 text-xs rounded-md bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-all flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-emerald-400" />
            2BHK Complete
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
        {/* Step 1: Budget Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            1. Total Interior Budget
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold">
                {currency}
              </span>
              <input
                type="number"
                min={100}
                max={10000000}
                step={isUSD ? 50 : 1000}
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                required
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg font-bold text-slate-900"
                placeholder="Enter your budget amount"
              />
            </div>

            {/* Quick chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(isUSD ? [500, 1000, 2000, 4000] : [35000, 65000, 120000, 250000]).map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setBudget(val)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap ${
                    budget === val
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {currency}{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Room Types Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            2. Select Room Types to Decorate
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {ROOM_OPTIONS.map(room => {
              const isSelected = selectedRooms.includes(room.id);
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => toggleRoom(room.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{room.icon}</span>
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center border text-[10px] ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-3" />
                    </span>
                  </div>
                  <span className={`text-xs font-medium ${isSelected ? 'text-indigo-900 font-bold' : 'text-slate-700'}`}>
                    {room.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Specific Quantities requested */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-slate-900">
              3. Item Quantities (Lights, Fans, Tables, etc.)
            </label>
            <span className="text-xs text-slate-500">From SmartBridge Scenario 1 specifications</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Ceiling Fans */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
                  <Wind className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Ceiling Fans</h4>
                  <p className="text-[11px] text-slate-500">BLDC energy-efficient</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity('ceilingFans', -1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-sm text-slate-800">
                  {quantities.ceilingFans}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity('ceilingFans', 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Ambient / Pendant Lights */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-amber-100 text-amber-700">
                  <Lightbulb className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Pendant / Ambient Lights</h4>
                  <p className="text-[11px] text-slate-500">IKEA & Amazon fixtures</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity('lights', -1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-sm text-slate-800">
                  {quantities.lights}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity('lights', 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dining Table Set */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <Table className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Dining Table Set</h4>
                  <p className="text-[11px] text-slate-500">4-seater pine / wood</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity('diningTable', -1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-sm text-slate-800">
                  {quantities.diningTable}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity('diningTable', 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Sofa Seating */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-purple-100 text-purple-700">
                  <Armchair className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Sofa / Couches</h4>
                  <p className="text-[11px] text-slate-500">Fabric high-density foam</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity('sofas', -1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-sm text-slate-800">
                  {quantities.sofas}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity('sofas', 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Curtains / Drapes */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Curtain Pairs</h4>
                  <p className="text-[11px] text-slate-500">Thermal blackout</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity('curtains', -1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-sm text-slate-800">
                  {quantities.curtains}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity('curtains', 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* TV Entertainment / Storage */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-rose-100 text-rose-700">
                  <Home className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Storage / Media Unit</h4>
                  <p className="text-[11px] text-slate-500">Engineered wood TV console</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity('storage', -1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-sm text-slate-800">
                  {quantities.storage}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity('storage', 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Interior Style Preference */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            4. Preferred Aesthetic Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STYLE_OPTIONS.map(st => {
              const isSelected = style === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setStyle(st.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{st.label}</span>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border ${
                        isSelected ? 'border-4 border-indigo-600 bg-white' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 5: Optional Room Photo Upload & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">
              5. Optional Room Photo (Multimodal Analysis)
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Upload a picture of your empty room or blueprint to assist layout suggestions.
            </p>
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-indigo-500 transition-colors bg-slate-50/50">
              {roomImage ? (
                <div className="relative">
                  <img
                    src={roomImage}
                    alt="Room Preview"
                    className="max-h-36 mx-auto rounded-lg object-cover shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setRoomImage(null)}
                    className="mt-2 text-xs text-rose-600 font-semibold hover:underline"
                  >
                    Remove photo
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload className="w-7 h-7 mx-auto text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-indigo-600 hover:underline">
                    Click to browse room image
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">PNG, JPG up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">
              Custom Requirements or Spatial Constraints
            </label>
            <textarea
              rows={4}
              value={customNotes}
              onChange={e => setCustomNotes(e.target.value)}
              placeholder="e.g. Wall color is off-white, need child-friendly rounded coffee table, prioritize warm 3000K lighting over cool white..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-base shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>PocketSmart AI is Calculating Cross-Platform Allocations...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Smart Home Budget & Recommendations</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
