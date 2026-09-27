import React from 'react';
import { motion } from 'framer-motion';
import { 
  HeartPulse, 
  ShoppingCart, 
  Briefcase, 
  Building2, 
  GraduationCap, 
  MessageSquare, 
  LayoutDashboard, 
  Landmark, 
  UtensilsCrossed, 
  Activity 
} from 'lucide-react';

export interface PromptSuggestion {
  id: string;
  title: string;
  category: string;
  prompt: string;
  iconName: string;
  tag: string;
}

export const QUICK_PROMPTS: PromptSuggestion[] = [
  {
    id: 'healthcare',
    title: 'Healthcare Website',
    category: 'Medical',
    prompt: 'Create a healthcare website with login and appointment booking.',
    iconName: 'HeartPulse',
    tag: 'Popular'
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Platform',
    category: 'Commerce',
    prompt: 'Build a full-featured modern e-commerce storefront with product catalog, cart, stripe checkout, and customer order history.',
    iconName: 'ShoppingCart',
    tag: 'Store'
  },
  {
    id: 'portfolio',
    title: 'Portfolio Website',
    category: 'Creative',
    prompt: 'Create a dark mode developer portfolio website with interactive project showcase, skill radar, client testimonials, and contact form.',
    iconName: 'Briefcase',
    tag: 'Showcase'
  },
  {
    id: 'hospital',
    title: 'Hospital Management',
    category: 'Enterprise',
    prompt: 'Develop a comprehensive hospital management system for patient admission, bed allocation, doctor schedules, and digital prescriptions.',
    iconName: 'Building2',
    tag: 'Health'
  },
  {
    id: 'campus',
    title: 'Smart Campus Platform',
    category: 'Education',
    prompt: 'Build a smart campus university platform with student portal, course enrollment, lecture timetables, and campus event feeds.',
    iconName: 'GraduationCap',
    tag: 'Edu'
  },
  {
    id: 'aichat',
    title: 'AI Chat Application',
    category: 'AI / LLM',
    prompt: 'Create an intelligent AI chat application with multi-model switching, streaming markdown responses, session memory, and voice input.',
    iconName: 'MessageSquare',
    tag: 'AI'
  },
  {
    id: 'crm',
    title: 'CRM Dashboard',
    category: 'SaaS',
    prompt: 'Generate an executive B2B CRM dashboard with deal pipelines, lead tracking, conversion charts, and automated team reminders.',
    iconName: 'LayoutDashboard',
    tag: 'SaaS'
  },
  {
    id: 'banking',
    title: 'Banking Application',
    category: 'Fintech',
    prompt: 'Design a secure fintech banking portal with multi-currency accounts, instant wire transfers, transaction analytics, and MFA verification.',
    iconName: 'Landmark',
    tag: 'Fintech'
  },
  {
    id: 'food',
    title: 'Food Delivery App',
    category: 'Delivery',
    prompt: 'Construct an on-demand food delivery app with restaurant menus, interactive cart, GPS order tracking, and rider dispatch logic.',
    iconName: 'UtensilsCrossed',
    tag: 'Delivery'
  },
  {
    id: 'fitness',
    title: 'Fitness Tracking App',
    category: 'Health & Wellness',
    prompt: 'Create a personal fitness tracking web app with workout routine planner, calorie logging, heart rate analytics, and streak trophies.',
    iconName: 'Activity',
    tag: 'Fitness'
  }
];

interface PromptSuggestionCardProps {
  suggestion: PromptSuggestion;
  isSelected: boolean;
  onSelect: (prompt: string) => void;
}

export const PromptSuggestionCard: React.FC<PromptSuggestionCardProps> = ({
  suggestion,
  isSelected,
  onSelect
}) => {
  const getIcon = () => {
    switch (suggestion.iconName) {
      case 'HeartPulse': return <HeartPulse className="w-4 h-4 text-rose-400" />;
      case 'ShoppingCart': return <ShoppingCart className="w-4 h-4 text-emerald-400" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4 text-purple-400" />;
      case 'Building2': return <Building2 className="w-4 h-4 text-blue-400" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-amber-400" />;
      case 'MessageSquare': return <MessageSquare className="w-4 h-4 text-cyan-400" />;
      case 'LayoutDashboard': return <LayoutDashboard className="w-4 h-4 text-indigo-400" />;
      case 'Landmark': return <Landmark className="w-4 h-4 text-green-400" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-4 h-4 text-orange-400" />;
      case 'Activity': return <Activity className="w-4 h-4 text-teal-400" />;
      default: return <HeartPulse className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(suggestion.prompt)}
      className={`text-left p-3 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
        isSelected
          ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-900/20'
          : 'bg-[#0F172A]/75 hover:bg-slate-800/80 border-white/5 hover:border-purple-500/30'
      }`}
    >
      <div className="flex items-center justify-between gap-2 w-full mb-1.5">
        <div className="p-1.5 rounded-xl bg-slate-900/90 border border-white/5 group-hover:border-purple-500/20 transition-colors">
          {getIcon()}
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900/80 border border-white/10 text-slate-400 group-hover:text-purple-300 transition-colors">
          {suggestion.tag}
        </span>
      </div>

      <div>
        <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
          {suggestion.title}
        </div>
        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-sans">
          {suggestion.category}
        </div>
      </div>
    </motion.button>
  );
};
