import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  RotateCw, 
  ShieldCheck, 
  ExternalLink, 
  Heart, 
  Calendar, 
  Clock, 
  User, 
  Check, 
  Search, 
  ChevronRight,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Box,
  ShoppingCart,
  Plus,
  Trash2,
  CreditCard,
  Send,
  Bot,
  Building2,
  DollarSign,
  TrendingUp,
  Award,
  Flame,
  UtensilsCrossed,
  MapPin,
  GraduationCap,
  Briefcase,
  Star,
  Tag
} from 'lucide-react';
import { DeviceMode } from './DevicePreviewToggle';

interface BrowserPreviewProps {
  device: DeviceMode;
  project: any;
  isGenerating: boolean;
  hasGenerated: boolean;
  onOpenWorkspace?: () => void;
  onSelectFile?: (path: string) => void;
}

export const BrowserPreview: React.FC<BrowserPreviewProps> = ({
  device,
  project,
  isGenerating,
  hasGenerated,
  onOpenWorkspace,
  onSelectFile
}) => {
  const getContainerWidth = () => {
    switch (device) {
      case 'mobile': return 'max-w-[380px]';
      case 'tablet': return 'max-w-[768px]';
      case 'desktop': return 'w-full';
    }
  };

  const projectName = project?.name || project?.projectName || 'HealthCareConnect';
  const projectDesc = project?.description || project?.summary || 'Production full-stack web application synthesized from natural language specification.';
  const promptText = (project?.prompt || '').toLowerCase();

  // Detect domain type
  const domain = useMemo(() => {
    const p = promptText;
    const name = projectName.toLowerCase();
    if (p.includes('food') || p.includes('delivery') || p.includes('restaurant') || p.includes('dish') || name.includes('bite') || name.includes('eats')) return 'food';
    if (p.includes('fitness') || p.includes('workout') || p.includes('gym') || p.includes('calorie') || name.includes('fit') || name.includes('pulse')) return 'fitness';
    if (p.includes('chat') || p.includes('ai app') || p.includes('llm') || p.includes('bot') || name.includes('ai') || name.includes('chat')) return 'aichat';
    if (p.includes('crm') || p.includes('deal') || p.includes('pipeline') || p.includes('lead') || name.includes('crm') || name.includes('vanguard')) return 'crm';
    if (p.includes('portfolio') || p.includes('showcase') || p.includes('developer portfolio') || name.includes('folio')) return 'portfolio';
    if (p.includes('shop') || p.includes('store') || p.includes('cart') || p.includes('product') || p.includes('commerce') || name.includes('store') || name.includes('apex')) return 'ecommerce';
    if (p.includes('bank') || p.includes('finance') || p.includes('wallet') || p.includes('crypto') || name.includes('vault') || name.includes('ledger') || name.includes('bank')) return 'banking';
    if (p.includes('course') || p.includes('student') || p.includes('campus') || p.includes('education') || name.includes('edu') || name.includes('campus')) return 'education';
    if (p.includes('hospital') || p.includes('ward') || p.includes('admission') || name.includes('hospital')) return 'hospital';
    // Default to healthcare
    return 'healthcare';
  }, [promptText, projectName]);

  // Interactive states for different domain previews
  // Healthcare state
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Sarah Chen, MD');
  const [bookingDate, setBookingDate] = useState('2026-10-15');
  const [bookingTime, setBookingTime] = useState('10:30 AM');
  const [bookedSuccess, setBookedSuccess] = useState(false);

  // E-commerce state
  const [cart, setCart] = useState<Array<{ name: string; price: number; qty: number }>>([
    { name: 'Ergonomic Developer Chair', price: 299, qty: 1 }
  ]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Food delivery state
  const [foodCart, setFoodCart] = useState<Array<{ name: string; price: number }>>([
    { name: 'Truffle Mushroom Burger', price: 16.50 }
  ]);
  const [foodOrdered, setFoodOrdered] = useState(false);

  // Fitness state
  const [workoutLog, setWorkoutLog] = useState([
    { type: 'Morning HIIT Routine', duration: '45 mins', calories: 420 },
    { type: 'Heavy Bench & Core', duration: '60 mins', calories: 510 }
  ]);
  const [newWorkoutType, setNewWorkoutType] = useState('Cycling Sprint');

  // AI Chat state
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your AI assistant. How can I accelerate your development today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // CRM state
  const [deals, setDeals] = useState([
    { company: 'Acme Cloud Corp', value: '$45,000', stage: 'Proposal Sent' },
    { company: 'Starlight Tech', value: '$120,000', stage: 'Negotiation' },
    { company: 'Horizon Media', value: '$28,000', stage: 'Closed Won' }
  ]);

  // Banking state
  const [balance, setBalance] = useState(24850.00);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [transferAmount, setTransferAmount] = useState('500');

  if (!hasGenerated && !isGenerating) {
    return (
      <div className="h-full min-h-[480px] flex flex-col items-center justify-center p-8 text-center bg-slate-950/40 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          animate={{
            y: [0, -12, 0],
            rotateX: [0, 15, 0],
            rotateY: [0, 25, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-[0_0_40px_rgba(139,92,246,0.4)]">
            <div className="w-full h-full rounded-[22px] bg-[#0B1120] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent" />
              <Box className="w-12 h-12 text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
            </div>
          </div>
        </motion.div>

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Your project will appear here.
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          Describe what you want to build in the AI chat and watch Patles.ai generate your full application in real time.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-500">
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-white/5">
            React 19 + Tailwind
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-white/5">
            Express 5 API
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-white/5">
            PostgreSQL DDL
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`mx-auto ${getContainerWidth()} transition-all duration-300 h-full flex flex-col`}>
      {/* Mini Browser Address Bar */}
      <div className="p-3 bg-[#0B1120] border-b border-white/10 rounded-t-2xl flex items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
        </div>

        <div className="flex-1 max-w-md mx-auto flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-white/10 text-slate-300 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">https://localhost:3000/app</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <button
            onClick={() => {
              setBookedSuccess(false);
              setOrderPlaced(false);
              setFoodOrdered(false);
              setTransferSuccess(false);
            }}
            className="p-1 rounded hover:bg-slate-800 hover:text-white"
            title="Refresh preview"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Rendered Live Website Preview */}
      <div className="flex-1 bg-slate-950 rounded-b-2xl border-x border-b border-white/10 overflow-y-auto text-slate-100 font-sans shadow-2xl">
        
        {/* ======================================================== */}
        {/* DOMAIN 1: FOOD DELIVERY APP */}
        {/* ======================================================== */}
        {domain === 'food' && (
          <div>
            <header className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white tracking-tight">{projectName}</div>
                  <div className="text-[10px] text-orange-400 font-mono">Live Food Delivery</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="px-3 py-1 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{foodCart.length} Items</span>
                </div>
              </div>
            </header>

            <section className="p-6 bg-gradient-to-b from-orange-950/30 via-slate-950 to-slate-950 border-b border-slate-800 space-y-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Craving Delicious Food? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                  Delivered in 25 Minutes.
                </span>
              </h1>
              <p className="text-xs text-slate-400 max-w-xl">{projectDesc}</p>
            </section>

            <section className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                Trending Dishes Near You
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Truffle Mushroom Burger', price: 16.50, time: '20-25m', rating: '4.9' },
                  { name: 'Spicy Dragon Roll Sushi', price: 19.00, time: '15-20m', rating: '4.8' },
                  { name: 'Crispy Woodfired Margherita', price: 14.00, time: '25-30m', rating: '4.9' }
                ].map((dish, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
                          <Star className="w-3 h-3 fill-current" /> {dish.rating}
                        </span>
                        <span className="font-mono text-[11px]">{dish.time}</span>
                      </div>
                      <div className="text-xs font-bold text-white">{dish.name}</div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-xs font-bold text-emerald-400 font-mono">${dish.price.toFixed(2)}</span>
                      <button
                        onClick={() => setFoodCart(prev => [...prev, { name: dish.name, price: dish.price }])}
                        className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-mono flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Card */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-orange-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Cart Total: ${foodCart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</div>
                  <div className="text-[11px] text-slate-400">{foodCart.length} dishes in cart</div>
                </div>
                {foodOrdered ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4" /> Order Dispatched to Courier!
                  </span>
                ) : (
                  <button
                    onClick={() => setFoodOrdered(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs font-mono"
                  >
                    Place Live Order
                  </button>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* DOMAIN 2: FITNESS TRACKING APP */}
        {/* ======================================================== */}
        {domain === 'fitness' && (
          <div>
            <header className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white tracking-tight">{projectName}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">Fitness & Health Engine</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-300">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>14 Days Streak</span>
              </div>
            </header>

            <section className="p-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono">Calories Burned</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono mt-1">1,840 kcal</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono">Active Time</div>
                  <div className="text-lg font-bold text-cyan-400 font-mono mt-1">65 mins</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono">Steps Taken</div>
                  <div className="text-lg font-bold text-purple-400 font-mono mt-1">10,480</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono">Heart Rate</div>
                  <div className="text-lg font-bold text-rose-400 font-mono mt-1">74 bpm</div>
                </div>
              </div>

              {/* Log new workout */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-3">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono uppercase">
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  Log Completed Workout
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newWorkoutType}
                    onChange={(e) => setNewWorkoutType(e.target.value)}
                    placeholder="Workout description (e.g. 5K Run)"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      if (!newWorkoutType) return;
                      setWorkoutLog(prev => [{ type: newWorkoutType, duration: '35 mins', calories: 340 }, ...prev]);
                      setNewWorkoutType('');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold"
                  >
                    Log Activity
                  </button>
                </div>
              </div>

              {/* Workout List */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400">Recent Activity Logs</div>
                {workoutLog.map((w, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{w.type}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{w.duration} • Cardio Zone</div>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold">+{w.calories} kcal</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* DOMAIN 3: AI CHAT APPLICATION */}
        {/* ======================================================== */}
        {domain === 'aichat' && (
          <div className="h-[520px] flex flex-col">
            <header className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{projectName}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">Multi-Model AI Chat</div>
                </div>
              </div>
              <div className="flex gap-1.5 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-purple-600/30 border border-purple-500/40 text-purple-300">
                  IBM Granite 3.0
                </span>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                    msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-xs' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!chatInput.trim()) return;
                const userQ = chatInput;
                setChatMessages(prev => [...prev, { role: 'user', text: userQ }]);
                setChatInput('');
                setTimeout(() => {
                  setChatMessages(prev => [...prev, {
                    role: 'assistant',
                    text: `Response for "${userQ}": The full-stack pipeline synthesized your request with authenticated controllers and SQL DDL.`
                  }]);
                }, 500);
              }}
              className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask AI anything..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <button type="submit" className="p-2 rounded-xl bg-cyan-600 text-slate-950 font-bold">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* DOMAIN 4: E-COMMERCE STORE */}
        {/* ======================================================== */}
        {domain === 'ecommerce' && (
          <div>
            <header className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{projectName}</div>
                  <div className="text-[10px] text-purple-400 font-mono">Modern Storefront</div>
                </div>
              </div>
              <div className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{cart.length} items (${cart.reduce((s, c) => s + c.price * c.qty, 0)})</span>
              </div>
            </header>

            <section className="p-6 bg-gradient-to-b from-purple-950/20 via-slate-950 to-slate-950 border-b border-slate-800 space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Premium Electronics & Gear</h1>
              <p className="text-xs text-slate-400">{projectDesc}</p>
            </section>

            <section className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: '4K Ultra-Wide Studio Monitor', price: 649, category: 'Hardware' },
                  { name: 'Mechanical Keyboard (Linear Red)', price: 149, category: 'Accessories' },
                  { name: 'Wireless Active Noise Buds', price: 189, category: 'Audio' }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-purple-400">{item.category}</span>
                      <div className="text-xs font-bold text-white mt-1">{item.name}</div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-xs font-bold text-emerald-400 font-mono">${item.price}</span>
                      <button
                        onClick={() => setCart(prev => [...prev, { name: item.name, price: item.price, qty: 1 }])}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout bar */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Cart Total: ${cart.reduce((s, c) => s + c.price * c.qty, 0)}</div>
                  <div className="text-[11px] text-slate-400">Ready for Stripe Checkout</div>
                </div>
                {orderPlaced ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-4 h-4" /> Order #{Math.floor(Math.random() * 89999 + 10000)} Placed!
                  </span>
                ) : (
                  <button
                    onClick={() => setOrderPlaced(true)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold"
                  >
                    Complete Checkout
                  </button>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* DOMAIN 5: CRM / SAAS DASHBOARD */}
        {/* ======================================================== */}
        {domain === 'crm' && (
          <div>
            <header className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{projectName}</div>
                  <div className="text-[10px] text-blue-400 font-mono">Executive B2B CRM</div>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Quarterly Target: 114%
              </span>
            </header>

            <section className="p-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono">Active Pipeline</div>
                  <div className="text-lg font-bold text-blue-400 font-mono mt-1">$1.42M</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono">Closed Won</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono mt-1">$684K</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono">Win Rate</div>
                  <div className="text-lg font-bold text-purple-400 font-mono mt-1">68.4%</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono">Active Leads</div>
                  <div className="text-lg font-bold text-amber-400 font-mono mt-1">142</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400">High-Value Deal Pipeline</div>
                <div className="space-y-2">
                  {deals.map((d, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{d.company}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{d.stage}</div>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* DOMAIN 6: HEALTHCARE / DEFAULT CLINICAL PORTAL */}
        {/* ======================================================== */}
        {(domain === 'healthcare' || domain === 'hospital' || domain === 'banking' || domain === 'education' || domain === 'portfolio') && (
          <div>
            <header className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  +
                </div>
                <div>
                  <div className="text-sm font-bold text-white tracking-tight">{projectName}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">Live Generated Portal</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onSelectFile) onSelectFile('src/pages/Login.jsx');
                  }}
                  className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors flex items-center gap-1 shadow-sm"
                >
                  <User className="w-3 h-3" />
                  <span>Login</span>
                </button>
              </div>
            </header>

            <section className="relative p-6 sm:p-10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cloud Production Specification</span>
                </div>
                
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {projectName} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                    Engineered from Prompt.
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {projectDesc}
                </p>
              </div>
            </section>

            {/* Feature Cards Grid */}
            <section className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(project?.features || [
                  'Secure Role-based Authentication',
                  'REST Controller Architecture',
                  'PostgreSQL Relational Schema'
                ]).slice(0, 3).map((feat: string, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-white">{feat}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Synthesized and verified with automated test assertions and database constraints.
                    </p>
                  </div>
                ))}
              </div>

              {/* Interactive Booking Form */}
              <div id="booking-section" className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/30 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      Live Form Interaction
                    </h3>
                    <p className="text-[11px] text-slate-400">Connected to POST /api/appointments</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    PostgreSQL Ready
                  </span>
                </div>

                {bookedSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs font-mono space-y-2 text-center"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <div className="font-bold text-sm text-white">Record Confirmed!</div>
                    <p className="text-slate-300 font-sans text-xs">
                      Recorded in database on {bookingDate} at {bookingTime}.
                    </p>
                    <button
                      onClick={() => setBookedSuccess(false)}
                      className="mt-2 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono"
                    >
                      Book Another Slot
                    </button>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setBookedSuccess(true);
                    }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  >
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Specialist / Doctor</label>
                      <select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Dr. Sarah Chen, MD">Dr. Sarah Chen, MD (Cardiology)</option>
                        <option value="Dr. Marcus Vance, DO">Dr. Marcus Vance, DO (Neurology)</option>
                        <option value="Dr. Elena Rostova, MD">Dr. Elena Rostova, MD (Pediatrics)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Date</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Time</label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:30 AM">10:30 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3 flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs font-mono shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4 text-cyan-200" />
                        <span>Confirm Action</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Footer */}
        <footer className="p-6 bg-slate-950 border-t border-slate-900 text-center text-[11px] text-slate-500 font-mono">
          © 2026 {projectName}. Built with Patles.ai Code & Architecture Generator.
        </footer>
      </div>
    </div>
  );
};
