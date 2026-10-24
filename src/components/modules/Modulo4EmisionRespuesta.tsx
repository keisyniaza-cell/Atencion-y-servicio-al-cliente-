import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  Shield,
} from 'lucide-react';

export const Modulo4EmisionRespuesta: React.FC = () => {
  const { tickets, setSelectedTicket } = useApp();

  const awaitingResponse = tickets.filter(
    (t) => !t.officialResponse && t.status !== 'Cerrado'
  );
  const notifiedResponses = tickets.filter((t) => t.officialResponse);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              Etapa PHVA: Hacer · Módulo 4
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Emisión de Respuesta y Comunicación al Usuario
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Redacción y validación de la respuesta institucional con lenguaje empático, claro y respetuoso. Entrega formal al ciudadano por su canal preferido y emisión del certificado de notificación legal.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium text-slate-700">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Asistente de Redacción Empática Activo</span>
          </div>
        </div>

        {/* Counter */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-600">
          <div>
            <span className="text-slate-400">Pendientes de Redacción/Notificación:</span>{' '}
            <strong className="text-amber-800 font-mono tabular-nums text-sm">
              {awaitingResponse.length} casos
            </strong>
          </div>
          <span className="text-slate-300">·</span>
          <div>
            <span className="text-slate-400">Respuestas Notificadas con Éxito:</span>{' '}
            <strong className="text-emerald-800 font-mono tabular-nums text-sm">
              {notifiedResponses.length} casos
            </strong>
          </div>
        </div>
      </div>

      {/* Grid of Awaiting vs Notified */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Casos Pendientes de Respuesta */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Casos Pendientes de Redacción / Notificación
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
              {awaitingResponse.length}
            </span>
          </div>

          <div className="p-4 divide-y divide-slate-100 flex-1 space-y-3 overflow-y-auto max-h-[600px]">
            {awaitingResponse.length > 0 ? (
              awaitingResponse.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="pt-3 first:pt-0 hover:bg-slate-50 p-3 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900 tabular-nums">
                      {ticket.radicadoNumber}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {ticket.assignedProjectArea}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-800 mt-1">
                    {ticket.citizen.fullName}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                    {ticket.subject}
                  </p>

                  <div className="mt-2 flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      {ticket.technicalConcept ? 'Concepto técnico emitido' : 'Pendiente concepto'}
                    </span>
                    <span className="text-xs text-slate-900 font-medium inline-flex items-center gap-1 hover:underline">
                      <span>Redactar Respuesta</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                No hay casos pendientes de respuesta formal en este momento.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Respuestas Ya Notificadas */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Comunicaciones Formales Notificadas al Beneficiario
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
              {notifiedResponses.length}
            </span>
          </div>

          <div className="p-4 divide-y divide-slate-100 flex-1 space-y-3 overflow-y-auto max-h-[600px]">
            {notifiedResponses.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="pt-3 first:pt-0 hover:bg-slate-50 p-3 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-900 tabular-nums">
                    {ticket.radicadoNumber}
                  </span>
                  <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {ticket.officialResponse?.deliveryProofCode}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-800 mt-1">
                  Para: {ticket.citizen.fullName}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mt-1 italic bg-slate-50 p-2 rounded border border-slate-100">
                  "{ticket.officialResponse?.responseText}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                  <span>Canal: {ticket.officialResponse?.channelNotified}</span>
                  <span>Aprobado por: {ticket.officialResponse?.approvedBy.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
