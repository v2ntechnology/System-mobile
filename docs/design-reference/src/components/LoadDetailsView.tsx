import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MoreVertical, 
  MapPin, 
  Truck, 
  Box, 
  Package, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  FileCheck,
  Fuel,
  Scale,
  DollarSign,
  AlertCircle,
  Building2,
  PhoneCall,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onNavigate: (view: string) => void;
}

export const LoadDetailsView: React.FC<Props> = ({ onNavigate }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleAccept = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      setIsAccepted(true);
      setTimeout(() => {
        onNavigate('map');
      }, 1600);
    }, 1000);
  };

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
            <h1 className="text-white font-bold text-sm tracking-tight">Detalhes do Frete</h1>
            <p className="text-emerald-400 text-[10.5px] font-mono-num font-semibold">Contrato CIOT #BR-9482</p>
          </div>
          <button className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-200">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative h-60 w-full bg-[#111827] z-10 -mt-2 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
          alt="Mapa do Frete"
          className="w-full h-full object-cover opacity-25 mix-blend-luminosity filter contrast-125"
        />
        {/* Animated Vector Route Line */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 400 240" preserveAspectRatio="none">
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              d="M70,180 Q180,90 330,60" 
              fill="none" 
              stroke="#10B981" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeDasharray="6 6"
              className="drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]"
            />
            <circle cx="70" cy="180" r="6" fill="#0B0F17" stroke="#10B981" strokeWidth="3" />
            <circle cx="330" cy="60" r="7" fill="#10B981" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        <div className="absolute bottom-3 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-[10px] text-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Seguro RCTR-C Tokio Marine Ativo (R$ 450.000)</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="-mt-6 bg-[#F8FAFC] rounded-t-3xl flex-1 flex flex-col relative z-30 px-4 pt-5 pb-28 shadow-[0_-12px_40px_rgba(0,0,0,0.25)] gap-3.5 overflow-y-auto no-scrollbar">
        
        {/* Load Main Offer Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                  Carga Fechada • Frágil
                </span>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100">
                  Pedágio Sem Parar Incluso
                </span>
              </div>
              <h2 className="text-slate-900 font-bold text-base mt-2">Módulos Solares Fotovoltaicos</h2>
              <p className="text-slate-500 text-xs font-medium">Green Energy Logística Brasil S/A</p>
            </div>
            
            <div className="text-right">
              <span className="text-slate-900 font-black text-xl font-mono-num">R$ 6.850</span>
              <p className="text-emerald-600 text-[10.5px] font-bold font-mono-num">R$ 16,62/km Líquido</p>
            </div>
          </div>

          {/* Route Milestones */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex gap-3">
            <div className="flex flex-col items-center mt-1">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-800 bg-white" />
              <div className="w-[1.5px] h-12 bg-slate-200 my-0.5 rounded-full" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.2)]" />
            </div>
            
            <div className="flex-1 flex flex-col justify-between text-xs gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Origem: Campinas, SP</span>
                  <span className="text-slate-500 text-[10px]">Hoje, 14:00 - 18:00</span>
                </div>
                <p className="text-slate-400 text-[10.5px]">Hub Logístico Viracopos • Doca 14 (Acesso Rod. Santos Dumont)</p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Destino: Curitiba, PR</span>
                  <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                    412 km • 5h 30m
                  </span>
                </div>
                <p className="text-slate-400 text-[10.5px]">CD Central CIC • Portaria 3 (Av. Juscelino K. de Oliveira)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Load Specifications Grid */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
          <h3 className="text-slate-900 font-bold text-xs mb-3 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-slate-700" />
            Especificações Técnicas da Carga
          </h3>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[9.5px] font-bold uppercase block">Implemento Exigido</span>
              <span className="text-slate-900 font-bold text-xs mt-0.5 block">Baú 13.60m ou Sider</span>
              <span className="text-emerald-600 text-[10px]">Compatível com seu veículo</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[9.5px] font-bold uppercase block">Peso Líquido / PBT</span>
              <span className="text-slate-900 font-bold text-xs mt-0.5 block font-mono-num">22,4 Toneladas</span>
              <span className="text-slate-500 text-[10px]">Dentro do limite do eixo</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[9.5px] font-bold uppercase block">Volume / Paletes</span>
              <span className="text-slate-900 font-bold text-xs mt-0.5 block font-mono-num">28 Paletes Padrão PBR</span>
              <span className="text-slate-500 text-[10px]">Carregamento lateral/traseiro</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[9.5px] font-bold uppercase block">Pedágios & Diesel</span>
              <span className="text-slate-900 font-bold text-xs mt-0.5 block font-mono-num">R$ 88,40 • 118L</span>
              <span className="text-emerald-600 text-[10px]">Tag Vale-Pedágio ANTT</span>
            </div>
          </div>
        </div>

        {/* Financial Breakdown Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
          <h3 className="text-slate-900 font-bold text-xs mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Condições de Pagamento e Adiantamento
            </span>
            <span className="text-emerald-600 font-bold text-[10.5px]">Garantia Bancária</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Adiantamento (70% na confirmação de carga)</span>
              <span className="text-slate-900 font-bold font-mono-num">R$ 4.795,00</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Saldo Final (30% após canhota digital)</span>
              <span className="text-slate-900 font-bold font-mono-num">R$ 2.055,00</span>
            </div>
            <div className="flex justify-between py-1.5 font-bold text-slate-900">
              <span>Total Bruto do Contrato</span>
              <span className="text-emerald-600 font-mono-num text-sm">R$ 6.850,00</span>
            </div>
          </div>
        </div>

        {/* Bottom Accept Action */}
        <div className="pt-2">
          {isAccepted ? (
            <div className="bg-emerald-500 text-slate-950 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-black text-sm shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" /> Frete Aceito! Gerando CIOT e Rota GPS...
            </div>
          ) : (
            <button
              onClick={handleAccept}
              disabled={isConfirming}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-xl shadow-slate-900/20 transition-all cursor-pointer"
            >
              {isConfirming ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Emitindo Contrato Digital...</span>
                </div>
              ) : (
                <>
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Aceitar Frete & Emitir CIOT Garantido</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </motion.div>
  );
};
