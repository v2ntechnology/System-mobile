import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Box, 
  Truck,
  Fuel,
  Gauge,
  RotateCcw,
  Sparkles,
  Layers,
  Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onNavigate: (view: string) => void;
}

export const VehiclesView: React.FC<Props> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'trucks' | 'trailers'>('trucks');
  const [activeTruck, setActiveTruck] = useState('scania');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full bg-[#0B0F17] min-h-full font-sans flex flex-col relative overflow-hidden"
    >
      {/* Dark Header Area with Vehicle Preview */}
      <div className="px-4 pt-10 pb-16 relative">
        {/* Top bar */}
        <div className="flex justify-between items-center relative z-20">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <h1 className="text-white font-bold text-sm tracking-tight">Gestão de Frota & Veículos</h1>
            <p className="text-slate-400 text-[10px]">Telemetria OBD-II e Sensores Ativos</p>
          </div>
          <button className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-200">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Truck Showcase */}
        <div className="relative mt-6 mb-4 h-48 w-full flex justify-center items-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
          
          <img 
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800&h=400" 
            alt="Scania R 500"
            className="w-[105%] max-w-none ml-4 h-full object-contain mix-blend-lighten filter grayscale contrast-125 brightness-110 drop-shadow-2xl relative z-10"
          />

          {/* Floating Spec Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-1 right-2 z-20 text-right bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700"
          >
            <p className="text-white font-bold text-xs font-mono-num">Baú 13.60m</p>
            <p className="text-slate-400 text-[9px]">Implemento Atual</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-2 right-2 z-20 text-right bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700"
          >
            <p className="text-emerald-400 font-bold text-xs font-mono-num">74 Ton PBT</p>
            <p className="text-slate-400 text-[9px]">Capacidade Homologada</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute bottom-2 left-1 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700"
          >
            <p className="text-white font-bold text-xs">Scania R 500 6x4</p>
            <p className="text-slate-300 text-[10px] font-mono-num font-bold tracking-wider mt-0.5">Placa: BRA-2E19</p>
          </motion.div>
        </div>
      </div>

      {/* Main Drawer Container */}
      <div className="-mt-10 bg-[#F8FAFC] rounded-t-3xl flex-1 flex flex-col relative z-30 shadow-[0_-12px_40px_rgba(0,0,0,0.25)] pb-28">
        {/* Tab Switcher */}
        <div className="flex w-full border-b border-slate-200/80 bg-white rounded-t-3xl p-1.5">
          <button 
            onClick={() => setActiveTab('trucks')}
            className={`flex-1 py-3 text-xs font-bold rounded-2xl transition-all ${
              activeTab === 'trucks' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Cavalos Mecânicos (1 Ativo)
          </button>
          <button 
            onClick={() => setActiveTab('trailers')}
            className={`flex-1 py-3 text-xs font-bold rounded-2xl transition-all ${
              activeTab === 'trailers' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Implementos & Carretas (2)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 flex flex-col gap-3.5 overflow-y-auto no-scrollbar">
          
          <AnimatePresence mode="wait">
            {activeTab === 'trucks' ? (
              <motion.div 
                key="trucks"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex flex-col gap-3.5"
              >
                {/* Active Truck Telemetry Dashboard */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-slate-900 font-bold text-sm">Scania R 500 Super 6x4</h3>
                        <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-1.5 py-0.5 rounded border border-emerald-100">
                          EM OPERAÇÃO
                        </span>
                      </div>
                      <p className="text-slate-400 text-[10.5px] mt-0.5">Placa Mercosul: <strong className="text-slate-700 font-mono-num">BRA-2E19</strong> • Ano 2023</p>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                      <Truck className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Telemetry Real-time Gauges */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 text-[9px] font-bold uppercase block">Diesel S10</span>
                      <span className="text-slate-900 font-black text-xs font-mono-num mt-0.5 block">82% (410L)</span>
                      <span className="text-emerald-600 text-[9px] font-medium">Autonomia 1.160 km</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 text-[9px] font-bold uppercase block">Arla 32</span>
                      <span className="text-slate-900 font-black text-xs font-mono-num mt-0.5 block">94% (47L)</span>
                      <span className="text-blue-600 text-[9px] font-medium">Nível Normal</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 text-[9px] font-bold uppercase block">Pressão TPMS</span>
                      <span className="text-slate-900 font-black text-xs font-mono-num mt-0.5 block">115 PSI</span>
                      <span className="text-emerald-600 text-[9px] font-medium">Todos Calibrados</span>
                    </div>
                  </div>

                  {/* Maintenance & Inspections */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Wrench className="w-3.5 h-3.5 text-slate-500" />
                      <span>Próxima Troca de Óleo: <strong className="text-slate-900 font-mono-num">em 8.400 km</strong></span>
                    </div>
                    <span className="text-emerald-600 font-bold text-[10.5px]">Revisão em Dia</span>
                  </div>
                </div>

                {/* Secondary Inactive Truck (Backup) */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/60 opacity-70 hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-slate-900 font-bold text-xs">Volvo FH 540 Globetrotter 6x4</h3>
                      <p className="text-slate-400 text-[10px] mt-0.5">Placa: <span className="font-mono-num font-bold">SP-FHT8291</span> • Pátio Garagem</p>
                    </div>
                    <button className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors">
                      Alternar Veículo
                    </button>
                  </div>
                </div>

                {/* Documents & Licenses */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
                  <h4 className="text-slate-900 font-bold text-xs mb-3 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-700" />
                    Documentos Oficiais & Laudos Homologados
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900">CRLV-e 2024 / Licenciamento Digital</p>
                        <p className="text-slate-400 text-[10px]">Emitido Detran SP • IPVA Quitado</p>
                      </div>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                        Válido
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-900">Certificado Cronotacógrafo Inmetro</p>
                        <p className="text-slate-400 text-[10px]">Aferição Válida até Nov/2024</p>
                      </div>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                        Aprovado
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="trailers"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex flex-col gap-3.5"
              >
                {/* Trailer 1 */}
                <div className="bg-white rounded-2xl p-4 border border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                        ACOPLADO ATUALMENTE
                      </span>
                      <h3 className="text-slate-900 font-bold text-sm mt-1.5">Semirreboque Baú Carga Seca 13.60m</h3>
                      <p className="text-slate-400 text-[10.5px]">Randon 3 Eixos • Placa: <strong className="text-slate-700 font-mono-num">BAU-9921</strong></p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-900 font-bold text-xs font-mono-num">30 Ton</span>
                      <p className="text-slate-400 text-[9px]">Capacidade</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex gap-2 text-[10.5px] text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">28 Paletes PBR</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">Gabarito 4.40m</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded">Assoalho Ômega</span>
                  </div>
                </div>

                {/* Trailer 2 */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-slate-100 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded">
                        DISPONÍVEL NO PÁTIO
                      </span>
                      <h3 className="text-slate-900 font-bold text-sm mt-1.5">Bitrem Graneleiro 9 Eixos (Exportação)</h3>
                      <p className="text-slate-400 text-[10.5px]">Guerra 2022 • Placa: <strong className="text-slate-700 font-mono-num">GRN-4410</strong></p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-900 font-bold text-xs font-mono-num">54 Ton</span>
                      <p className="text-slate-400 text-[9px]">Capacidade Grãos</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </motion.div>
  );
};
