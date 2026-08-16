import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Package, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  Award, 
  FileText, 
  AlertTriangle, 
  ChevronRight,
  UserCheck,
  Building,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onNavigate: (view: string) => void;
}

export const ProfileView: React.FC<Props> = ({ onNavigate }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full bg-[#0B0F17] min-h-full font-sans flex flex-col relative overflow-hidden"
    >
      {/* Top Header */}
      <div className="px-4 pt-10 pb-4 relative z-20">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <h1 className="text-white font-bold text-sm tracking-tight">Perfil do Motorista</h1>
            <p className="text-slate-400 text-[10px]">Cadastro Nacional ANTT Verificado</p>
          </div>
          <div className="w-9 h-9" />
        </div>
      </div>

      {/* Driver Avatar Header Card */}
      <div className="flex flex-col items-center px-4 pb-6 relative z-20">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200"
            alt="Carlos Henrique Silva"
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500/40 shadow-2xl"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-slate-900">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <h2 className="text-white font-bold text-base mt-3">Carlos Henrique Silva</h2>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
            Motorista Ouro • RNTRC: 58493021-9
          </span>
        </div>
      </div>

      {/* Main Drawer Container */}
      <div className="bg-[#F8FAFC] rounded-t-3xl flex-1 flex flex-col relative z-30 px-4 pt-6 pb-28 shadow-[0_-12px_40px_rgba(0,0,0,0.25)] gap-4 overflow-y-auto no-scrollbar">
        
        {/* Verification Status Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-slate-900 font-bold text-xs">Identidade Digital Validada (Gov.br)</h3>
            <p className="text-emerald-800 text-[10.5px]">Apto para transporte de cargas fechadas, químicas e alto valor.</p>
          </div>
        </div>

        {/* Certifications and Licenses */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-slate-900 font-bold text-xs">Habilitação & Cursos Especializados</h3>
            <span className="text-[10px] font-bold text-emerald-600">4 Ativos</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 overflow-hidden text-xs">
            <div className="p-3 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">CNH Categoria E (Exerce Atividade Remunerada)</p>
                <p className="text-slate-400 text-[10px]">Validade: 14/10/2026 • Registro Detran-SP</p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-100">
                Regular
              </span>
            </div>

            <div className="p-3 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">Curso MOPP (Movimentação de Prod. Perigosos)</p>
                <p className="text-slate-400 text-[10px]">Homologado Contran / Sest Senat</p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-100">
                Válido
              </span>
            </div>

            <div className="p-3 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">Exame Toxicológico Periódico</p>
                <p className="text-slate-400 text-[10px]">Coleta Negativa realizada em 05/2024</p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-100">
                Em Dia
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry Sanctions & Road Infractions */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-slate-900 font-bold text-xs">Histórico de Sanções e Alertas de Rodovia</h3>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              1 Alerta Educativo
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-3.5 flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-slate-900 font-bold text-xs">Alerta de Velocidade Máxima de Chuva</h4>
                  <span className="text-slate-400 text-[9px] font-bold">12/07/2023</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                  Identificado 84 km/h com pista molhada na BR-116 KM 210. O tacógrafo registrou retorno imediato para velocidade segura (70 km/h).
                </p>
                <span className="inline-block mt-2 text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Status: Sem pontuação na CNH (Resolvido)
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
