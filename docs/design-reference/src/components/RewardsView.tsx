import React from 'react';
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Gift, 
  ChevronRight, 
  Crown, 
  Medal,
  ArrowLeft,
  Fuel,
  Sparkles,
  Award,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onNavigate: (view: string) => void;
}

export const RewardsView: React.FC<Props> = ({ onNavigate }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full bg-[#0B0F17] min-h-full font-sans flex flex-col relative overflow-hidden"
    >
      {/* Dark Header Area */}
      <div className="px-4 pt-10 pb-4 relative z-20">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <h1 className="text-white font-bold text-sm tracking-tight">Score & Clube de Benefícios</h1>
            <p className="text-slate-400 text-[10px]">Pontuação por Condução Econômica & Segura</p>
          </div>
          <div className="w-9 h-9" />
        </div>

        {/* Big Score Card */}
        <div className="mt-4 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-5 relative z-10 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-amber-400/10 text-amber-400 border border-amber-400/25 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" /> NÍVEL OURO (TOP 5% BRASIL)
            </span>
            <span className="text-slate-400 text-[10px] font-bold">Ciclo Agosto</span>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle cx="56" cy="56" r="50" stroke="#1E293B" strokeWidth="7" fill="none" />
                <motion.circle 
                  initial={{ strokeDasharray: "0 350" }}
                  animate={{ strokeDasharray: "280 350" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="56" cy="56" r="50" stroke="#F59E0B" strokeWidth="7" fill="none" strokeLinecap="round" 
                  className="drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-white text-2xl font-black font-mono-num">8.450</span>
                <span className="text-amber-400 text-[9px] font-bold uppercase tracking-wider">Pontos</span>
              </div>
            </div>
            
            <p className="text-slate-300 text-xs mt-3 font-medium text-center">
              Faltam apenas <strong className="text-emerald-400 font-mono-num">1.550 pts</strong> para alcançar o Nível Diamante
            </p>
          </div>
        </div>

        {/* Key Driving Telemetry Factors */}
        <div className="grid grid-cols-2 gap-2.5 mt-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Eficiência Eco-Drive</span>
            </div>
            <p className="text-white font-black text-base font-mono-num mt-1">98,2%</p>
            <span className="text-emerald-400 text-[9.5px] font-bold">Faixa Verde Scania</span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Pontualidade Doca</span>
            </div>
            <p className="text-white font-black text-base font-mono-num mt-1">100%</p>
            <span className="text-blue-400 text-[9.5px] font-bold">Zero Atrasos em 2024</span>
          </div>
        </div>
      </div>

      {/* Main Drawer Container */}
      <div className="bg-[#F8FAFC] rounded-t-3xl flex-1 flex flex-col relative z-30 px-4 pt-5 pb-28 shadow-[0_-12px_40px_rgba(0,0,0,0.25)] gap-3.5 overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center">
          <h2 className="text-slate-900 font-bold text-sm">Resgatar Vouchers e Benefícios</h2>
          <span className="text-emerald-600 text-xs font-bold">Saldo: 8.450 pts</span>
        </div>

        {/* Reward 1 */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-emerald-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold text-xs shrink-0">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-xs">Voucher R$ 250 em Diesel S10</h3>
              <p className="text-slate-400 text-[10.5px]">Válido em qualquer Posto Graal ou Ipiranga</p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs shrink-0 hover:bg-slate-800 transition-colors font-mono-num">
            5.000 pts
          </button>
        </div>

        {/* Reward 2 */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-emerald-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-xs shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-xs">Lavagem Completa de Carreta</h3>
              <p className="text-slate-400 text-[10.5px]">Lavador de chassi e cabine com cera</p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs shrink-0 hover:bg-slate-800 transition-colors font-mono-num">
            3.200 pts
          </button>
        </div>

        {/* Reward 3 */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-emerald-300 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-xs shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-xs">Voucher Refeição + Almoço Completo</h3>
              <p className="text-slate-400 text-[10.5px]">Churrascaria ou Restaurante em postos parceiros</p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs shrink-0 hover:bg-slate-800 transition-colors font-mono-num">
            1.500 pts
          </button>
        </div>
      </div>
    </motion.div>
  );
};
