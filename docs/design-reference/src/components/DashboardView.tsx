import React, { useState } from 'react';
import { 
  Bell, 
  Truck, 
  MapPin, 
  Clock, 
  Search, 
  Wallet, 
  User, 
  TrendingUp, 
  Calendar, 
  ChevronRight, 
  Award, 
  Navigation2, 
  Fuel, 
  ShieldCheck, 
  CheckCircle2, 
  SlidersHorizontal,
  ArrowUpRight,
  Package,
  Layers,
  Sparkles,
  Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onNavigate: (view: string) => void;
}

interface LoadOffer {
  id: string;
  title: string;
  contractor: string;
  contractCode: string;
  origin: string;
  originHub: string;
  pickupTime: string;
  destination: string;
  destinationHub: string;
  distance: string;
  estimatedTime: string;
  price: string;
  pricePerKm: string;
  cargoType: string;
  weight: string;
  trailerRequired: string;
  status: 'disponivel' | 'negociando' | 'concluido';
  tollIncluded: boolean;
  dieselEstimate: string;
}

export const DashboardView: React.FC<Props> = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState('Recomendadas');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['Recomendadas', 'Todas', 'Próximas', 'Graneleiro', 'Baú / Sider', 'Refrigerado'];

  const loads: LoadOffer[] = [
    {
      id: 'load-01',
      title: 'Módulos Solares Fotovoltaicos',
      contractor: 'Green Energy Logística Brasil',
      contractCode: '#BR-9482',
      origin: 'Campinas, SP',
      originHub: 'Hub Logístico Viracopos - Doca 14',
      pickupTime: 'Hoje, 14:00 - 18:00',
      destination: 'Curitiba, PR',
      destinationHub: 'CD Central CIC - Portaria 3',
      distance: '412 km',
      estimatedTime: '5h 30m',
      price: 'R$ 6.850',
      pricePerKm: 'R$ 16,62/km',
      cargoType: 'Carga Fechada • Frágil',
      weight: '22,4 Toneladas',
      trailerRequired: 'Baú 13.60m / Sider',
      status: 'disponivel',
      tollIncluded: true,
      dieselEstimate: '118 L Diesel S10'
    },
    {
      id: 'load-02',
      title: 'Peças e Componentes Automotivos',
      contractor: 'AutoTech Distribuição S/A',
      contractCode: '#BR-7712',
      origin: 'São Bernardo do Campo, SP',
      originHub: 'Planta Anchieta - Galpão 02',
      pickupTime: 'Amanhã, 08:00 - 11:30',
      destination: 'Resende, RJ',
      destinationHub: 'Polo Industrial Rod. Dutra',
      distance: '298 km',
      estimatedTime: '4h 10m',
      price: 'R$ 4.920',
      pricePerKm: 'R$ 16,51/km',
      cargoType: 'Paletizado • Carga Seca',
      weight: '18,5 Toneladas',
      trailerRequired: 'Carreta 3 Eixos',
      status: 'disponivel',
      tollIncluded: true,
      dieselEstimate: '85 L Diesel S10'
    },
    {
      id: 'load-03',
      title: 'Soja em Grãos a Granel (Exportação)',
      contractor: 'AgroSul Cooperativa de Grãos',
      contractCode: '#BR-3190',
      origin: 'Rondonópolis, MT',
      originHub: 'Terminal Ferroviário Rumo',
      pickupTime: '18/08, 07:00',
      destination: 'Porto de Santos, SP',
      destinationHub: 'Terminal de Grãos TEG - Cais',
      distance: '1.430 km',
      estimatedTime: '21h 00m',
      price: 'R$ 24.500',
      pricePerKm: 'R$ 17,13/km',
      cargoType: 'Grãos a Granel • A granel',
      weight: '37,0 Toneladas',
      trailerRequired: 'Bitrem Graneleiro 9 Eixos',
      status: 'disponivel',
      tollIncluded: true,
      dieselEstimate: '440 L Diesel S10'
    }
  ];

  const filteredLoads = loads.filter(load => {
    if (activeFilter === 'Graneleiro') return load.trailerRequired.includes('Graneleiro');
    if (activeFilter === 'Baú / Sider') return load.trailerRequired.includes('Baú') || load.trailerRequired.includes('Sider');
    if (activeFilter === 'Próximas') return parseInt(load.distance) < 350;
    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full bg-[#0B0F17] min-h-full font-sans flex flex-col relative"
    >
      {/* Dark Header Hero */}
      <div className="px-5 pt-10 pb-20 relative">
        {/* Top bar Profile & Notification */}
        <div className="flex justify-between items-center relative z-50">
          <div>
            <h1 className="text-white text-base font-bold tracking-tight">Painel de Cargas</h1>
            <p className="text-slate-400 text-xs mt-0.5">Segunda-feira, 15 de Agosto</p>
          </div>

          <div className="flex items-center gap-2.5 relative">
            {/* Pontos / Score */}
            <div 
              onClick={() => onNavigate('rewards')}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-slate-200 font-bold font-mono-num text-xs">8.450 pts</span>
            </div>

            {/* Notificações */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-9 h-9 rounded-xl border transition-all flex items-center justify-center text-slate-200 relative ${
                showNotifications ? 'bg-slate-800 border-slate-600' : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden origin-top-right z-50"
                >
                  <div className="p-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-slate-900 font-bold text-xs">Central de Alertas</h3>
                    <span className="text-emerald-600 text-[10px] font-bold hover:underline cursor-pointer">Marcar lidos</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    <div className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-900 text-xs font-bold">Novo Frete Compatível</span>
                        <span className="text-emerald-600 text-[9px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded">R$ 6.850</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1 leading-snug">Carga para Baú 13.60m saindo de Campinas com destino a Curitiba.</p>
                      <p className="text-slate-400 text-[9px] font-medium mt-1.5">Há 2 min</p>
                    </div>
                    <div className="p-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-900 text-xs font-bold">Alerta de Balança Rodoviária</span>
                        <span className="text-blue-600 text-[9px] font-bold bg-blue-50 px-1.5 py-0.5 rounded">KM 85</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1 leading-snug">Posto de pesagem na BR-116 em operação normal. Peso aferido liberado.</p>
                      <p className="text-slate-400 text-[9px] font-medium mt-1.5">Há 25 min</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Driver Profile Summary Card */}
        <div 
          onClick={() => onNavigate('profile')}
          className="mt-5 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800/80 rounded-2xl p-4 border border-slate-700/60 shadow-xl shadow-black/40 cursor-pointer hover:border-emerald-500/40 transition-all group"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=120&h=120"
                  alt="Carlos Henrique"
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/30"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-white font-bold text-sm">Carlos Henrique Silva</h2>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">RNTRC: <span className="font-mono-num text-slate-300 font-semibold">58493021-9</span> • CNH E</p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <span>Veículo Ativo: <strong className="text-slate-200 font-medium">Scania R 500 6x4</strong></span>
              <span>Jornada Hoje: <strong className="text-emerald-400 font-mono-num">2h 15m / 8h</strong></span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>

      {/* Main Content Area (Light Theme with Strict Contrast) */}
      <div className="-mt-14 bg-[#F8FAFC] rounded-t-3xl flex-1 flex flex-col relative z-20 px-4 pt-6 pb-28 shadow-[0_-12px_40px_rgba(0,0,0,0.25)]">
        
        {/* Weekly Metrics Dashboard */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Faturamento</span>
            <p className="text-slate-900 font-black text-base font-mono-num mt-1">R$ 14.820</p>
            <span className="text-emerald-600 text-[10px] font-bold mt-0.5 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12% esta semana
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Viagens Mês</span>
            <p className="text-slate-900 font-black text-base font-mono-num mt-1">6 Fretes</p>
            <span className="text-slate-500 text-[10px] font-medium mt-0.5">
              100% no prazo
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Média Diesel</span>
            <p className="text-slate-900 font-black text-base font-mono-num mt-1">2,85 km/L</p>
            <span className="text-emerald-600 text-[10px] font-bold mt-0.5">
              Condução Eco Ouro
            </span>
          </div>
        </div>

        {/* GPS Route & Fuel Optimizer Callout Card */}
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('map')}
          className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-4 mb-5 shadow-lg shadow-slate-900/10 flex items-center justify-between cursor-pointer group hover:border-emerald-500/50 transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center shrink-0">
              <Navigation2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold text-sm">Rotas Otimizadas para Caminhão</h3>
                <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded">
                  GPS PESADO
                </span>
              </div>
              <p className="text-slate-300 text-[11px] font-medium mt-0.5">
                Sem pontes baixas • Postos com diesel mais barato • Balanças ativas
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shrink-0">
            <ChevronRight className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Section Header & Filters */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-slate-900 font-bold text-base tracking-tight">Cargas Disponíveis</h2>
            <p className="text-slate-500 text-xs">Fretes verificados com pagamento garantido via CIOT</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            {filteredLoads.length} ofertas
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 mb-4">
          {filters.map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 border border-slate-900'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Loads List */}
        <div className="flex flex-col gap-3.5">
          {filteredLoads.map((load) => (
            <motion.div
              key={load.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('details')}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Header of Load Card */}
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100">
                      {load.cargoType}
                    </span>
                    <span className="text-slate-400 text-[10px] font-semibold">{load.contractCode}</span>
                  </div>
                  <h3 className="text-slate-900 font-bold text-sm mt-1.5">{load.title}</h3>
                  <p className="text-slate-500 text-[11px] font-medium">{load.contractor}</p>
                </div>
                
                <div className="text-right shrink-0">
                  <span className="text-slate-900 font-black text-lg font-mono-num">{load.price}</span>
                  <p className="text-emerald-600 text-[10px] font-bold font-mono-num">{load.pricePerKm}</p>
                </div>
              </div>

              {/* Route Timeline */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex gap-3">
                <div className="flex flex-col items-center mt-1">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-800 bg-white" />
                  <div className="w-[1.5px] h-9 bg-slate-200 my-0.5 rounded-full" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.2)]" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between text-xs gap-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{load.origin}</span>
                      <span className="text-slate-400 text-[10px]">{load.pickupTime}</span>
                    </div>
                    <p className="text-slate-400 text-[10px]">{load.originHub}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{load.destination}</span>
                      <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                        {load.distance} • {load.estimatedTime}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[10px]">{load.destinationHub}</p>
                  </div>
                </div>
              </div>

              {/* Load Specs Footer Badges */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[10.5px]">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold">
                    ⚖️ {load.weight}
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold truncate max-w-[140px]">
                    🚛 {load.trailerRequired}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs group-hover:translate-x-1 transition-transform">
                  <span>Ver Detalhes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </motion.div>
  );
};
