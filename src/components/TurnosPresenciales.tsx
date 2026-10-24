import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QueueTicket } from '../types';
import { Users, Bell, Clock, CheckCircle2, Ticket as TicketIcon, Volume2 } from 'lucide-react';

export const TurnosPresenciales: React.FC = () => {
  const { queueTickets, generateQueueTurn, callQueueTurn, completeQueueTurn } = useApp();

  const [citizenName, setCitizenName] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [serviceType, setServiceType] = useState<QueueTicket['serviceType']>('Atención Prioritaria (Adulto Mayor)');
  const [activeCounter, setActiveCounter] = useState('Ventanilla 1 (Prioritaria)');

  const waitingList = queueTickets.filter((q) => q.status === 'En Espera');
  const callingList = queueTickets.filter((q) => q.status === 'Llamando');
  const attendedList = queueTickets.filter((q) => q.status === 'Atendido');

  const handleGenerateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName || !documentNumber) return;
    generateQueueTurn(citizenName, documentNumber, serviceType);
    setCitizenName('');
    setDocumentNumber('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              Solución al Problema 2 del Diagnóstico Operativo
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gestor de Turnos y Taquilla Presencial Digital
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Elimina la congestión y largas filas en sedes de atención presencial de Somos Uno. Organiza el flujo de usuarios por tipología con prioridad estricta para adultos mayores y personas vulnerables.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              En Espera: {waitingList.length} usuarios
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Ticket Generator & Live Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1: Dispensador de Turno */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <TicketIcon className="w-5 h-5 text-slate-800" />
            <h3 className="text-sm font-bold text-slate-900">
              Dispensador de Turno (Taquilla de Entrada)
            </h3>
          </div>

          <form onSubmit={handleGenerateTicket} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Servicio Requerido *
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-medium"
              >
                <option value="Atención Prioritaria (Adulto Mayor)">
                  A: Atención Prioritaria (Adulto Mayor / Discapacidad)
                </option>
                <option value="Radicación PQRS">
                  B: Radicación Formal de Requerimiento / PQRS
                </option>
                <option value="Orientación Convocatorias">
                  B: Orientación Convocatorias y Programas Sociales
                </option>
                <option value="Consulta de Estado">
                  C: Consulta de Estado de Radicado Previo
                </option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Nombre del Ciudadano *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Ana Lucía Gómez"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Número de Cédula / Documento *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. 43567890"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-mono tabular-nums"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Imprimir / Generar Turno Digital
            </button>
          </form>

          {/* Counter selector for the agent */}
          <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
            <span className="font-semibold text-slate-800 block">
              Operador de Ventanilla Activa:
            </span>
            <select
              value={activeCounter}
              onChange={(e) => setActiveCounter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
            >
              <option value="Ventanilla 1 (Prioritaria)">Ventanilla 1 (Prioritaria Adulto Mayor)</option>
              <option value="Ventanilla 2 (Radicación)">Ventanilla 2 (Radicación PQRS)</option>
              <option value="Ventanilla 3 (Orientación)">Ventanilla 3 (Orientación y Subsidios)</option>
            </select>
          </div>
        </div>

        {/* Col 2: Pantalla de Sala de Espera (Visual Display) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold tracking-wide uppercase">
                  Pantalla de Llamado en Sala de Espera
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400">Somos Uno · Turnos en Vivo</span>
            </div>

            {/* Calling Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {callingList.length > 0 ? (
                callingList.map((q) => (
                  <div
                    key={q.ticketNumber}
                    className="bg-slate-800 border-2 border-emerald-500 rounded-xl p-5 text-center space-y-2 animate-pulse"
                  >
                    <span className="text-xs text-emerald-400 font-semibold tracking-widest uppercase">
                      Llamando Ahora
                    </span>
                    <div className="text-4xl font-extrabold font-mono text-white tabular-nums">
                      {q.ticketNumber}
                    </div>
                    <div className="text-sm font-semibold text-slate-200">
                      {q.citizenName}
                    </div>
                    <div className="text-xs text-emerald-300 font-medium">
                      Pase a: {q.counterAssigned || 'Ventanilla 1'}
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => completeQueueTurn(q.ticketNumber)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs cursor-pointer font-medium"
                      >
                        Finalizar Atención
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-slate-400 text-xs">
                  No hay turnos llamando en este momento. Seleccione un turno en espera abajo para llamar.
                </div>
              )}
            </div>
          </div>

          {/* Queue in Waiting */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Cola de Espera Activa ({waitingList.length})
              </h4>
              <span className="text-[11px] text-slate-500">Orden de llegada y prioridad</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {waitingList.length > 0 ? (
                waitingList.map((q) => (
                  <div
                    key={q.ticketNumber}
                    className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-base text-slate-900 tabular-nums">
                        {q.ticketNumber}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-800">{q.citizenName}</div>
                        <div className="text-[11px] text-slate-500">
                          {q.serviceType} · C.C. {q.documentNumber}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => callQueueTurn(q.ticketNumber, activeCounter)}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Llamar a {activeCounter.split(' ')[0]} {activeCounter.split(' ')[1]}
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Sala de espera despejada. No hay usuarios esperando en este momento.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
