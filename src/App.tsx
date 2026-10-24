import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Modulo1Planificacion } from './components/modules/Modulo1Planificacion';
import { Modulo2Radicacion } from './components/modules/Modulo2Radicacion';
import { Modulo3TramiteInterno } from './components/modules/Modulo3TramiteInterno';
import { Modulo4EmisionRespuesta } from './components/modules/Modulo4EmisionRespuesta';
import { Modulo5EvaluacionCierre } from './components/modules/Modulo5EvaluacionCierre';
import { Modulo6MejoraContinua } from './components/modules/Modulo6MejoraContinua';
import { TurnosPresenciales } from './components/TurnosPresenciales';
import { ComiteCoordinacion } from './components/ComiteCoordinacion';
import { ProtocoloEmpatia } from './components/ProtocoloEmpatia';
import { CaracterizacionProceso } from './components/CaracterizacionProceso';
import { PortalCiudadano } from './components/PortalCiudadano';
import { NewTicketModal } from './components/NewTicketModal';
import { TicketDetailModal } from './components/TicketDetailModal';

const AppContent: React.FC = () => {
  const { activeView, selectedTicket, setSelectedTicket } = useApp();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'modulo1':
        return <Modulo1Planificacion />;
      case 'modulo2':
      case 'dashboard':
        return <Modulo2Radicacion onOpenNewModal={() => setIsNewModalOpen(true)} />;
      case 'modulo3':
        return <Modulo3TramiteInterno />;
      case 'modulo4':
        return <Modulo4EmisionRespuesta />;
      case 'modulo5':
        return <Modulo5EvaluacionCierre />;
      case 'modulo6':
        return <Modulo6MejoraContinua />;
      case 'turnos':
        return <TurnosPresenciales />;
      case 'comite-coordinacion':
        return <ComiteCoordinacion />;
      case 'protocolo-empatia':
        return <ProtocoloEmpatia />;
      case 'caracterizacion':
        return <CaracterizacionProceso />;
      case 'portal-ciudadano':
        return <PortalCiudadano onOpenNewModal={() => setIsNewModalOpen(true)} />;
      default:
        return <Modulo2Radicacion onOpenNewModal={() => setIsNewModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Header onOpenNewModal={() => setIsNewModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveView()}
      </main>

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-900">Corporación Social Somos Uno</span>
            <span className="mx-2">·</span>
            <span>Sistema de Atención al Ciudadano y Gestión de PQRS (Ciclo PHVA)</span>
          </div>
          <div className="text-slate-400">
            Principios: Dignidad · Solidaridad · Universalidad
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NewTicketModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
      />

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
