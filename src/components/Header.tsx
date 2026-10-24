import React from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Users, HeartHandshake, BarChart3, Clock, Compass } from 'lucide-react';

export const Header: React.FC<{ onOpenNewModal: () => void }> = ({ onOpenNewModal }) => {
  const { activeView, setActiveView, metrics } = useApp();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 no-print">
      {/* Primary Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (Nav links) - Zone 3 (Primary Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('dashboard')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                <span>Somos Uno</span>
              </div>
              <div className="text-xs text-slate-500 font-medium hidden sm:block">
                Corporación Social · Atención y PQRS
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 single-line navigation links with hover states */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveView('modulo2')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeView === 'modulo2' ? 'text-slate-900 font-semibold border-b-2 border-emerald-600' : ''
              }`}
            >
              Radicación Central
            </button>
            <button
              onClick={() => setActiveView('modulo3')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeView === 'modulo3' ? 'text-slate-900 font-semibold border-b-2 border-emerald-600' : ''
              }`}
            >
              Articulación Técnica
            </button>
            <button
              onClick={() => setActiveView('protocolo-empatia')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeView === 'protocolo-empatia' ? 'text-slate-900 font-semibold border-b-2 border-emerald-600' : ''
              }`}
            >
              Protocolo Empático
            </button>
            <button
              onClick={() => setActiveView('modulo6')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeView === 'modulo6' ? 'text-slate-900 font-semibold border-b-2 border-emerald-600' : ''
              }`}
            >
              Tablero ISB y Mejora
            </button>
            <button
              onClick={() => setActiveView('portal-ciudadano')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeView === 'portal-ciudadano' ? 'text-slate-900 font-semibold border-b-2 border-emerald-600' : ''
              }`}
            >
              Portal Ciudadano
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenNewModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              + Radicar Requerimiento
            </button>
          </div>
        </div>
      </div>

      {/* Sub-bar with quick PHVA module switcher and live status summary */}
      <div className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Quick Module Switcher */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveView('modulo1')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                activeView === 'modulo1' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              M1: Planificar
            </button>
            <button
              onClick={() => setActiveView('modulo2')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                activeView === 'modulo2' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              M2: Radicación
            </button>
            <button
              onClick={() => setActiveView('modulo3')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                activeView === 'modulo3' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              M3: Trámite & Áreas
            </button>
            <button
              onClick={() => setActiveView('modulo4')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                activeView === 'modulo4' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              M4: Respuesta Oficial
            </button>
            <button
              onClick={() => setActiveView('modulo5')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                activeView === 'modulo5' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              M5: ISB & Cierre
            </button>
            <button
              onClick={() => setActiveView('modulo6')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                activeView === 'modulo6' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              M6: Mejora Continua
            </button>
            <span className="text-slate-300 mx-1">|</span>
            <button
              onClick={() => setActiveView('turnos')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                activeView === 'turnos' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Turnos en Sede
            </button>
            <button
              onClick={() => setActiveView('comite-coordinacion')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                activeView === 'comite-coordinacion' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Comité Semanal
            </button>
            <button
              onClick={() => setActiveView('caracterizacion')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                activeView === 'caracterizacion' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Matriz PHVA
            </button>
          </div>

          {/* Clean unboxed operational indicators */}
          <div className="flex items-center gap-3 text-slate-500 shrink-0 font-medium">
            <span>SLA: <strong className="text-slate-800 font-semibold tabular-nums">{metrics.slaCompliancePercentage}%</strong></span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>ISB: <strong className="text-slate-800 font-semibold tabular-nums">{metrics.averageISB}%</strong></span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Activos: <strong className="text-slate-800 font-semibold tabular-nums">{metrics.activeTickets}</strong></span>
            {metrics.overdueTickets > 0 && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-rose-700 font-medium">Vencidos: <strong className="font-semibold tabular-nums">{metrics.overdueTickets}</strong></span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
