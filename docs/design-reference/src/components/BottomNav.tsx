import React from 'react';
import { LayoutDashboard, Compass, Truck, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  active: string;
  onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<Props> = ({ active, onNavigate }) => {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Cargas' },
    { id: 'map', icon: Compass, label: 'Rotas & Diesel' },
    { id: 'vehicles', icon: Truck, label: 'Veículo' },
    { id: 'rewards', icon: Award, label: 'Score & Bônus' },
  ];

  return (
    <nav aria-label="Navegação Principal" className="absolute bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-4 pt-2.5 pb-6 flex justify-around items-center z-50 shadow-[0_-8px_25px_rgba(15,23,42,0.06)] rounded-t-3xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button 
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-2xl transition-all relative ${
              isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            {isActive && (
              <motion.div 
                layoutId="navIndicatorPill" 
                className="absolute inset-0 bg-emerald-50 rounded-2xl -z-10 border border-emerald-100"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <div className="relative">
              <Icon 
                className={`w-5 h-5 transition-all duration-200 ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} 
              />
            </div>
            <span className={`text-[10.5px] mt-1 tracking-tight ${isActive ? 'font-bold text-emerald-700' : 'font-medium text-slate-500'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
