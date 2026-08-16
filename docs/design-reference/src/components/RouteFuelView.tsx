import React, { useState } from 'react';
import { 
  Fuel, 
  Coffee, 
  ShieldCheck, 
  Navigation2, 
  Search, 
  Crosshair, 
  Truck, 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  MapPin, 
  ChevronRight, 
  SlidersHorizontal,
  Zap,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  TrendingDown,
  Scale,
  Compass,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onNavigate: (view: string) => void;
}

interface TruckRoute {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  badgeBorder: string;
  distance: string;
  duration: string;
  fuelEstimated: string;
  savings: string;
  tollCost: string;
  clearance: string;
  weighStations: string;
  topography: string;
  bestFuelStation: {
    name: string;
    price: string;
    distance: string;
    amenities: string[];
  };
  highlights: string[];
}

export const RouteFuelView: React.FC<Props> = ({ onNavigate }) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('eco');
  const [isNavigating, setIsNavigating] = useState(false);
  const [mapLayer, setMapLayer] = useState<'hybrid' | 'traffic' | 'clearance'>('traffic');

  const truckRoutes: TruckRoute[] = [
    {
      id: 'eco',
      name: 'Rota Eco Diesel (BR-116 Régis Otimizada)',
      badge: 'Menor Custo Total',
      badgeColor: 'bg-emerald-50 text-emerald-700',
      badgeBorder: 'border-emerald-200',
      distance: '342 km',
      duration: '4h 25m',
      fuelEstimated: '98 L Diesel S10',
      savings: 'Economia de R$ 340 em Diesel',
      tollCost: 'R$ 88,40 (Tag Automática)',
      clearance: '4.80m Livre (Sem restrições)',
      weighStations: '1 Balança Aberta (KM 142)',
      topography: 'Aclive moderado na serra',
      bestFuelStation: {
        name: 'Mega Posto Graal 500 & Truck Center',
        price: 'R$ 5,79/L',
        distance: 'KM 85 • 45 min à frente',
        amenities: ['Pátio 9 Eixos', 'Chuveiro Grátis', 'Arla 32 a Granel', 'Restaurante 24h']
      },
      highlights: ['Pista Dupla e Asfalto Recapeado', 'Área de Escape no KM 218', 'Postos com Desconto de Frota']
    },
    {
      id: 'express',
      name: 'Via Expressa Bandeirantes & Rodoanel',
      badge: 'Mais Rápida (-40 min)',
      badgeColor: 'bg-blue-50 text-blue-700',
      badgeBorder: 'border-blue-200',
      distance: '318 km',
      duration: '3h 45m',
      fuelEstimated: '106 L Diesel S10',
      savings: 'Ganho de 40 min de viagem',
      tollCost: 'R$ 142,60 (Tag Automática)',
      clearance: '5.20m Livre',
      weighStations: '2 Balanças na Rodovia',
      topography: 'Relevo Plano / Retas',
      bestFuelStation: {
        name: 'Rede Ipiranga RodoRede Express',
        price: 'R$ 5,94/L',
        distance: 'KM 140 • 1h 30m',
        amenities: ['Diesel Alta Vazão', 'Borracharia 24h', 'Lanchonete']
      },
      highlights: ['Pedágio 100% Free Flow', 'Sem Semáforos', 'Menor Tráfego Urbano']
    },
    {
      id: 'heavy',
      name: 'Corredor Bitrem & Rodotrem 9 Eixos',
      badge: 'Sem Restrição de AET',
      badgeColor: 'bg-amber-50 text-amber-800',
      badgeBorder: 'border-amber-200',
      distance: '365 km',
      duration: '4h 50m',
      fuelEstimated: '114 L Diesel S10',
      savings: 'Autorizado 74 Toneladas',
      tollCost: 'R$ 96,20',
      clearance: '5.50m Livre (Viadutos Altos)',
      weighStations: '2 Balanças Dinâmicas',
      topography: 'Raio de Curva Suave',
      bestFuelStation: {
        name: 'Posto Petrobras Décio Rodotrem',
        price: 'R$ 5,82/L',
        distance: 'KM 190 • 2h 15m',
        amenities: ['Vagas Especiais Bitrem', 'Oficina Mecânica Pesada', 'Restaurante']
      },
      highlights: ['Sem restrição de rodagem noturna', 'Pátios com Segurança Armada', 'Faixas Adicionais']
    }
  ];

  const currentRoute = truckRoutes.find(r => r.id === selectedRouteId) || truckRoutes[0];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full bg-[#0B0F17] min-h-full font-sans flex flex-col relative overflow-hidden"
    >
      {/* Top Floating Truck Navigation Header */}
      <div className="absolute top-0 w-full z-30 px-4 pt-10 pb-3 bg-gradient-to-b from-[#0B0F17] via-[#0B0F17]/95 to-transparent">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl flex items-center px-3.5 py-2.5 text-white shadow-xl">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input 
              type="text" 
              defaultValue="Campinas, SP ➔ Curitiba, PR"
              className="bg-transparent border-none outline-none text-xs w-full placeholder-slate-400 text-slate-100 font-semibold"
            />
          </div>
          
          <button 
            onClick={() => onNavigate('fuel_stations')}
            className="h-10 px-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
          >
            <Fuel className="w-4 h-4" />
            <span>Postos</span>
          </button>
        </div>

        {/* Truck Specs Live Tags */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar py-0.5 text-[10.5px]">
          <div className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-slate-200 shrink-0 font-medium">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scania R 500 • 6x4 Bitrem</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-slate-200 shrink-0 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Gabarito: 4.40m</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1.5 text-slate-200 shrink-0 font-medium">
            <Fuel className="w-3.5 h-3.5 text-amber-400" />
            <span>Diesel S10</span>
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="relative h-80 w-full bg-[#111827] z-10 pt-28 overflow-hidden">
        {/* Dark High-Res Highway Texture */}
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
          alt="Mapa Rodoviário"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity filter contrast-125"
        />
        
        {/* Modern Satellite Grid Lines */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#10B981 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        {/* Animated Vector Highway Path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 320" preserveAspectRatio="none">
          {/* Secondary Alternative Trajectories */}
          <path 
            d="M 50,260 C 130,230 170,170 340,75" 
            fill="none" 
            stroke="#475569" 
            strokeWidth="3" 
            strokeDasharray="4 4"
            opacity="0.5"
          />
          <path 
            d="M 50,260 C 80,280 230,250 340,75" 
            fill="none" 
            stroke="#475569" 
            strokeWidth="3" 
            strokeDasharray="4 4"
            opacity="0.5"
          />

          {/* Active Route Vector */}
          <motion.path 
            key={selectedRouteId}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            d={
              selectedRouteId === 'eco'
                ? "M 50,260 Q 135,200 200,150 T 340,75"
                : selectedRouteId === 'express'
                ? "M 50,260 C 130,230 170,170 340,75"
                : "M 50,260 C 80,280 230,250 340,75"
            } 
            fill="none" 
            stroke={selectedRouteId === 'eco' ? "#10B981" : selectedRouteId === 'express' ? "#3B82F6" : "#F59E0B"} 
            strokeWidth="5" 
            strokeLinecap="round"
            className="drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]"
          />

          {/* Truck Start Location Pin */}
          <circle cx="50" cy="260" r="7" fill="#0B0F17" stroke="#10B981" strokeWidth="3" />
          <motion.circle 
            animate={{ r: [7, 18, 7], opacity: [0.8, 0, 0.8] }}
            transition={{ repeat: Infinity, duration: 2 }}
            cx="50" cy="260" fill="#10B981" 
          />

          {/* Destination Pin */}
          <circle cx="340" cy="75" r="7" fill="#10B981" stroke="white" strokeWidth="2" />
        </svg>

        {/* Map Interactive Point 1: Melhores Posto Diesel */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-[48%] left-[49%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer z-20"
          onClick={() => onNavigate('fuel_stations')}
        >
          <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xl mb-1 flex items-center gap-1 border border-slate-700">
            <span className="text-emerald-400 font-bold">Diesel S10</span> {currentRoute.bestFuelStation.price}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700" />
          </div>
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.7)] border-2 border-white">
            <Fuel className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
        </motion.div>

        {/* Map Interactive Point 2: Balança Rodoviária ANTT */}
        <div className="absolute top-[26%] left-[73%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
          <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <Scale className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="bg-slate-900 text-blue-400 text-[8.5px] font-bold px-1.5 py-0.5 rounded-full mt-1 border border-slate-700 whitespace-nowrap shadow-md">
            Balança KM 142 (Aberta)
          </span>
        </div>

        {/* Map Interactive Point 3: Viaduto Livre */}
        <div className="absolute top-[70%] left-[28%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
          <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center shadow-md border border-slate-600">
            <Truck className="w-3 h-3 text-emerald-400" />
          </div>
          <span className="bg-slate-900 text-slate-200 text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-1 border border-slate-700 whitespace-nowrap">
            Viaduto 4.80m Livre
          </span>
        </div>

        {/* Bottom Bar on Map */}
        <div className="absolute bottom-2.5 left-4 right-4 flex justify-between items-center z-20 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
            <span className="text-slate-200 text-[10.5px] font-semibold">Traçado Rodoviário</span>
          </div>
          <div className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg text-[9.5px] font-black tracking-wider uppercase">
            CARGA PESADA
          </div>
        </div>
      </div>

      {/* Main Drawer Content */}
      <div className="bg-[#F8FAFC] rounded-t-3xl flex-1 flex flex-col relative z-20 px-4 pt-5 pb-28 shadow-[0_-12px_40px_rgba(0,0,0,0.2)] gap-4 overflow-y-auto no-scrollbar -mt-3">
        
        {/* Header Title with Subtitle */}
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-slate-900 font-bold text-lg tracking-tight">Opções de Rota para Carga</h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              GPS Pesado
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Deslize para o lado para alternar entre as rotas calculadas.
          </p>
        </div>

        {/* Top Route Selection Pills (Synced with Carousel) */}
        <div className="flex gap-1.5 p-1 bg-slate-200/70 rounded-2xl">
          {truckRoutes.map((route, idx) => {
            const isSelected = selectedRouteId === route.id;
            return (
              <button
                key={route.id}
                onClick={() => {
                  setSelectedRouteId(route.id);
                  const el = document.getElementById(`route-card-${route.id}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }}
                className={`flex-1 py-2 px-2 rounded-xl text-center transition-all ${
                  isSelected 
                    ? 'bg-slate-900 text-white font-bold shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 font-medium text-[11px]'
                }`}
              >
                <div className="text-[11px] leading-tight truncate font-bold">
                  {route.id === 'eco' ? 'Menor Custo' : route.id === 'express' ? 'Mais Rápida' : 'Sem Restrição'}
                </div>
                <div className={`text-[9.5px] font-mono-num ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {route.duration}
                </div>
              </button>
            );
          })}
        </div>

        {/* Swipeable Carousel for Routes with Snap */}
        <div className="relative -mx-4">
          <div 
            id="routes-carousel"
            onScroll={(e) => {
              const target = e.currentTarget;
              const scrollLeft = target.scrollLeft;
              const cardWidth = target.offsetWidth * 0.88;
              const newIdx = Math.round(scrollLeft / cardWidth);
              if (truckRoutes[newIdx] && truckRoutes[newIdx].id !== selectedRouteId) {
                setSelectedRouteId(truckRoutes[newIdx].id);
              }
            }}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 pb-2 pt-1 no-scrollbar touch-pan-x"
          >
            {truckRoutes.map((route, index) => {
              const isSelected = selectedRouteId === route.id;
              return (
                <div
                  key={route.id}
                  id={`route-card-${route.id}`}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={`snap-center shrink-0 w-[88%] sm:w-[340px] rounded-2xl p-4 transition-all duration-200 border cursor-pointer ${
                    isSelected 
                      ? 'bg-white border-slate-900 shadow-lg ring-2 ring-slate-900/10' 
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 opacity-80'
                  }`}
                >
                  {/* Card Top Badge & Time */}
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border inline-block ${route.badgeColor} ${route.badgeBorder}`}>
                        {route.badge}
                      </span>
                      <h3 className="text-slate-900 font-bold text-sm mt-1.5 line-clamp-1">{route.name}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-slate-900 font-black text-lg font-mono-num">{route.duration}</span>
                      <p className="text-slate-500 text-[10px] font-bold font-mono-num">{route.distance}</p>
                    </div>
                  </div>

                  {/* Highlights Pill */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-100">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{route.savings}</span>
                  </div>

                  {/* Quick Specs Grid */}
                  <div className="grid grid-cols-3 gap-1.5 py-2.5 border-y border-slate-100 my-2.5 text-center">
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[8.5px] font-bold uppercase block">Diesel</span>
                      <span className="text-slate-900 font-bold text-[11px] font-mono-num truncate block">{route.fuelEstimated.replace(' Diesel S10', '')}</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[8.5px] font-bold uppercase block">Gabarito</span>
                      <span className="text-slate-900 font-bold text-[11px] font-mono-num truncate block">{route.clearance.split(' ')[0]}</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-[8.5px] font-bold uppercase block">Pedágio</span>
                      <span className="text-slate-900 font-bold text-[11px] font-mono-num truncate block">{route.tollCost.split(' ')[0]} {route.tollCost.split(' ')[1]}</span>
                    </div>
                  </div>

                  {/* Fuel Station recommendation */}
                  <div className="bg-slate-900 rounded-xl p-2.5 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[10.5px] font-bold text-white leading-tight truncate max-w-[140px]">{route.bestFuelStation.name}</p>
                        <p className="text-[9px] text-slate-400">{route.bestFuelStation.distance}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold text-xs font-mono-num">{route.bestFuelStation.price}</span>
                      <p className="text-[8px] text-slate-400">Diesel S10</p>
                    </div>
                  </div>

                  {/* Status Indicator Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRouteId(route.id);
                    }}
                    className={`mt-2.5 w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected 
                        ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ Rota Selecionada' : 'Selecionar Esta Rota'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Swipe Dots indicator & Hint */}
          <div className="flex justify-center items-center gap-1.5 mt-2">
            {truckRoutes.map((r, idx) => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRouteId(r.id);
                  const el = document.getElementById(`route-card-${r.id}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  selectedRouteId === r.id ? 'w-6 bg-slate-900' : 'w-1.5 bg-slate-300'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-[10px] text-slate-400 font-medium mt-1">
            ↔ Arraste com o dedo para comparar as 3 rotas
          </p>
        </div>

        {/* Active Selected Route Detailed Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-start">
            <div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${currentRoute.badgeColor} ${currentRoute.badgeBorder}`}>
                {currentRoute.badge}
              </span>
              <h3 className="text-slate-900 font-bold text-sm mt-1.5">{currentRoute.name}</h3>
            </div>
            <div className="text-right">
              <span className="text-slate-900 font-black text-lg font-mono-num">{currentRoute.duration}</span>
              <p className="text-slate-400 text-[10px] font-bold font-mono-num">{currentRoute.distance}</p>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 my-3 text-center">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[9px] font-bold uppercase block">Diesel Previsto</span>
              <span className="text-slate-900 font-black text-xs font-mono-num mt-0.5 block">{currentRoute.fuelEstimated}</span>
              <span className="text-emerald-600 text-[9px] font-bold">{currentRoute.savings}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[9px] font-bold uppercase block">Gabarito Altura</span>
              <span className="text-slate-900 font-black text-xs font-mono-num mt-0.5 block">{currentRoute.clearance}</span>
              <span className="text-blue-600 text-[9px] font-bold">100% Seguro</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="text-slate-400 text-[9px] font-bold uppercase block">Pedágios / Balanças</span>
              <span className="text-slate-900 font-black text-xs font-mono-num mt-0.5 block">{currentRoute.tollCost}</span>
              <span className="text-amber-700 text-[9px] font-bold">{currentRoute.weighStations}</span>
            </div>
          </div>

          {/* Route Technical Highlights */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {currentRoute.highlights.map((h, i) => (
              <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-md">
                ✓ {h}
              </span>
            ))}
          </div>

          {/* Recommended Fuel Stop for this Route */}
          <div 
            onClick={() => onNavigate('fuel_stations')}
            className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl p-3.5 text-white cursor-pointer hover:border-emerald-500/50 transition-all border border-slate-700 shadow-md"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <Fuel className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-emerald-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded">MELHOR PREÇO</span>
                    <span className="text-slate-400 text-[10px]">{currentRoute.bestFuelStation.distance}</span>
                  </div>
                  <h4 className="text-white font-bold text-xs mt-0.5">{currentRoute.bestFuelStation.name}</h4>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-emerald-400 font-black text-base font-mono-num">{currentRoute.bestFuelStation.price}</span>
                <p className="text-slate-400 text-[8px] font-bold uppercase">Diesel S10</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-slate-800">
              {currentRoute.bestFuelStation.amenities.map((a, i) => (
                <span key={i} className="text-slate-300 bg-white/5 px-2 py-0.5 rounded text-[9px] font-medium">
                  • {a}
                </span>
              ))}
            </div>

            <div className="mt-2.5 flex justify-between items-center text-[10.5px] font-bold text-emerald-400">
              <span>Ver todos os postos com desconto nesta rodovia</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Action Navigation Button */}
          <button 
            onClick={() => setIsNavigating(!isNavigating)}
            className={`mt-3.5 w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
              isNavigating 
                ? 'bg-rose-600 text-white shadow-rose-600/30 hover:bg-rose-700' 
                : 'bg-emerald-500 text-slate-950 shadow-emerald-500/20 hover:bg-emerald-400 font-extrabold'
            }`}
          >
            <Navigation2 className={`w-4 h-4 ${isNavigating ? 'animate-spin' : ''}`} />
            {isNavigating ? 'Encerrar Navegação Rodoviária' : 'Iniciar Navegação GPS de Caminhão'}
          </button>
        </div>

        {/* Safety & Resting Points */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
          <h3 className="text-slate-900 font-bold text-xs mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Paradas Certificadas e Segurança para Carretas
          </h3>
          
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <Coffee className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Ponto de Parada Graal 500</h4>
                  <span className="text-[10px] font-bold text-emerald-600">KM 165</span>
                </div>
                <p className="text-slate-500 text-[10px] mt-0.5">Pátio 100% monitorado com vigilância armada, chuveiro gratuito para clientes de Diesel.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Trecho de Serra: Atenção Freio Motor</h4>
                  <span className="text-[10px] font-bold text-amber-700">KM 210 - 225</span>
                </div>
                <p className="text-slate-500 text-[10px] mt-0.5">Área de escape disponível no KM 218. Recomenda-se uso de freio motor e marcha reduzida.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
