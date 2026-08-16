import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Fuel, 
  Coffee, 
  Droplets, 
  Star, 
  MapPin, 
  Navigation, 
  ArrowRight, 
  Check, 
  Percent, 
  Truck, 
  Wrench, 
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Clock,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onNavigate: (view: string) => void;
}

export const FuelStationsView: React.FC<Props> = ({ onNavigate }) => {
  const [selectedFilter, setSelectedFilter] = useState('price');
  const [selectedFuelType, setSelectedFuelType] = useState('s10');
  const [tankSize, setTankSize] = useState<number>(500); // 500 Litros padrão cavalo mecânico
  const [addedStation, setAddedStation] = useState<string | null>(null);

  const stations = [
    {
      id: 'graal-mega',
      name: 'Rede Graal 500 Truck Center',
      brand: 'Graal / Petrobras',
      recommended: true,
      rating: 4.9,
      reviewsCount: 482,
      distance: '14.2 km',
      location: 'BR-116 Régis Bittencourt KM 85',
      dieselS10: 'R$ 5,79',
      dieselComum: 'R$ 5,59',
      arla32: 'R$ 2,25/L',
      rawS10: 5.79,
      fleetDiscount: 'Economia de R$ 145,00 no tanque de 500L',
      amenities: [
        { label: 'Pátio Rodotrem 9 Eixos', icon: Truck },
        { label: 'Ducha Quente Grátis', icon: Droplets },
        { label: 'Restaurante 24h', icon: Coffee },
        { label: 'Auto Elétrica & Borracharia', icon: Wrench },
      ],
      pointsBonus: '+500 pts no abastecimento'
    },
    {
      id: 'ipiranga-rodo',
      name: 'Posto RodoRede Ipiranga Estrela',
      brand: 'Ipiranga',
      recommended: false,
      rating: 4.8,
      reviewsCount: 318,
      distance: '8.4 km',
      location: 'Rodovia dos Bandeirantes KM 54',
      dieselS10: 'R$ 5,88',
      dieselComum: 'R$ 5,68',
      arla32: 'R$ 2,35/L',
      rawS10: 5.88,
      fleetDiscount: 'Cashback 2,5% pelo Cartão Frota',
      amenities: [
        { label: 'Ducha Quente', icon: Droplets },
        { label: 'Diesel Rápido Alta Vazão', icon: Fuel },
        { label: 'Conveniência Am/Pm', icon: Coffee },
      ],
      pointsBonus: '+350 pts'
    },
    {
      id: 'shell-express',
      name: 'Shell Evolux Truck Stop',
      brand: 'Shell',
      recommended: false,
      rating: 4.7,
      reviewsCount: 226,
      distance: '21.6 km',
      location: 'Rodovia Anhanguera KM 110',
      dieselS10: 'R$ 5,84',
      dieselComum: 'R$ 5,64',
      arla32: 'R$ 2,30/L',
      rawS10: 5.84,
      fleetDiscount: 'Café da manhã cortesia para > 300L',
      amenities: [
        { label: 'Pátio Seguro Monitorado', icon: ShieldCheck },
        { label: 'Mecânica Diesel Express', icon: Wrench },
        { label: 'Refeitório Climatizado', icon: Coffee },
      ],
      pointsBonus: '+400 pts'
    },
    {
      id: 'decio-postos',
      name: 'Posto Grupo Décio Rodoviário',
      brand: 'Décio / Vibra',
      recommended: false,
      rating: 4.8,
      reviewsCount: 520,
      distance: '38.0 km',
      location: 'BR-381 Fernão Dias KM 190',
      dieselS10: 'R$ 5,82',
      dieselComum: 'R$ 5,60',
      arla32: 'R$ 2,28/L',
      rawS10: 5.82,
      fleetDiscount: 'Arla 32 a granel com desconto progressivo',
      amenities: [
        { label: 'Vagas Bitrem 30m', icon: Truck },
        { label: 'Lavador de Carreta', icon: Droplets },
        { label: 'Churrascaria 24 Horas', icon: Coffee },
      ],
      pointsBonus: '+450 pts'
    }
  ];

  const handleAddStop = (id: string) => {
    setAddedStation(id);
    setTimeout(() => {
      onNavigate('map');
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full bg-[#0B0F17] min-h-full font-sans flex flex-col relative overflow-hidden"
    >
      {/* Header Bar */}
      <div className="px-4 pt-10 pb-4 relative z-20">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => onNavigate('map')} 
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <h1 className="text-white font-bold text-sm tracking-tight">Rede de Postos Parceiros</h1>
            <p className="text-slate-400 text-[10px]">Preços atualizados em tempo real nas rodovias</p>
          </div>
          <div className="w-9 h-9" />
        </div>

        {/* Tipo de Combustível Tabs */}
        <div className="grid grid-cols-3 gap-1.5 mt-3.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setSelectedFuelType('s10')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              selectedFuelType === 's10' 
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Diesel S10
          </button>
          <button
            onClick={() => setSelectedFuelType('comum')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              selectedFuelType === 'comum' 
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Diesel S500
          </button>
          <button
            onClick={() => setSelectedFuelType('arla')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              selectedFuelType === 'arla' 
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Arla 32 a Granel
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-1.5 mt-3 overflow-x-auto no-scrollbar pb-1">
          <button 
            onClick={() => setSelectedFilter('price')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === 'price'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            Menor Preço
          </button>
          <button 
            onClick={() => setSelectedFilter('distance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === 'distance'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            Mais Próximos
          </button>
          <button 
            onClick={() => setSelectedFilter('bitrem')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === 'bitrem'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            Pátio para Bitrem / 9 Eixos
          </button>
        </div>
      </div>

      {/* Main Content Drawer */}
      <div className="bg-[#F8FAFC] rounded-t-3xl flex-1 flex flex-col relative z-30 px-4 pt-5 pb-28 shadow-[0_-12px_40px_rgba(0,0,0,0.25)] gap-3.5 overflow-y-auto no-scrollbar">
        
        {/* Simulator Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center font-bold text-xs">
              500L
            </div>
            <div>
              <p className="text-slate-900 font-bold text-xs">Capacidade do Tanque: 500 Litros</p>
              <p className="text-emerald-700 text-[10.5px]">Abastecendo no menor preço você economiza até R$ 145/tanque</p>
            </div>
          </div>
        </div>

        {/* Station Cards */}
        {stations.map((station) => {
          const priceDisplay = 
            selectedFuelType === 's10' ? station.dieselS10 :
            selectedFuelType === 'comum' ? station.dieselComum : station.arla32;

          const isAdded = addedStation === station.id;

          return (
            <div 
              key={station.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
                station.recommended 
                  ? 'border-emerald-500/60 ring-2 ring-emerald-500/10 relative overflow-hidden' 
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {station.recommended && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-xl">
                  ★ Melhor Preço da Rodovia
                </div>
              )}

              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    station.recommended ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Fuel className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold text-xs leading-snug">{station.name}</h3>
                    <p className="text-slate-500 text-[10.5px] mt-0.5">{station.location} • <strong className="text-slate-700">{station.distance}</strong></p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-slate-800 text-xs font-black font-mono-num">{station.rating}</span>
                      <span className="text-slate-400 text-[10px]">({station.reviewsCount} avaliações)</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-slate-900 font-black text-lg font-mono-num">{priceDisplay}</span>
                  <p className="text-slate-400 text-[9px] font-bold uppercase">
                    {selectedFuelType === 'arla' ? 'Por Litro' : 'Diesel / Litro'}
                  </p>
                </div>
              </div>

              {/* Fleet Discount Banner */}
              <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
                <span className="text-emerald-800 text-[10.5px] font-semibold flex items-center gap-1">
                  <Percent className="w-3 h-3 text-emerald-600" /> {station.fleetDiscount}
                </span>
                <span className="text-[9.5px] font-black text-slate-950 bg-emerald-400 px-1.5 py-0.5 rounded">
                  {station.pointsBonus}
                </span>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
                {station.amenities.map((amenity, i) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={i} className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg">
                      <Icon className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] font-medium text-slate-600">{amenity.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => handleAddStop(station.id)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isAdded 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Adicionado à Rota
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3.5 h-3.5" /> Incluir Parada no GPS
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}

      </div>
    </motion.div>
  );
};
