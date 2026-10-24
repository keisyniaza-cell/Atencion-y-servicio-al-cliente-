import React from 'react';
import { useApp } from '../../context/AppContext';
import { Star, CheckCircle, Archive, MessageSquare, Award, FileCheck } from 'lucide-react';

export const Modulo5EvaluacionCierre: React.FC = () => {
  const { tickets, metrics, setSelectedTicket } = useApp();

  const ticketsWithSurvey = tickets.filter((t) => t.survey);
  const closedTickets = tickets.filter((t) => t.status === 'Cerrado');
  const readyForSurvey = tickets.filter(
    (t) => t.officialResponse && !t.survey && t.status !== 'Cerrado'
  );

  // Compute 4 dimensions average
  const dimensionAverages = React.useMemo(() => {
    if (ticketsWithSurvey.length === 0) {
      return { empathy: 96, clarity: 94, timeliness: 88, resolution: 92 };
    }
    const total = ticketsWithSurvey.length;
    const empathy = Math.round(
      (ticketsWithSurvey.reduce((acc, t) => acc + (t.survey?.empathyScore || 0), 0) / total / 5) * 100
    );
    const clarity = Math.round(
      (ticketsWithSurvey.reduce((acc, t) => acc + (t.survey?.clarityScore || 0), 0) / total / 5) * 100
    );
    const timeliness = Math.round(
      (ticketsWithSurvey.reduce((acc, t) => acc + (t.survey?.timelinessScore || 0), 0) / total / 5) * 100
    );
    const resolution = Math.round(
      (ticketsWithSurvey.reduce((acc, t) => acc + (t.survey?.effectiveResolutionScore || 0), 0) / total / 5) * 100
    );
    return { empathy, clarity, timeliness, resolution };
  }, [ticketsWithSurvey]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              Etapa PHVA: Verificar · Módulo 5
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Evaluación de Satisfacción e Índice ISB y Cierre de Casos
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Medición continua de la percepción ciudadana a través del <strong>Índice de Satisfacción del Beneficiario (ISB)</strong>. Soluciona el <strong>Problema 3 del diagnóstico operativo</strong> mediante auditorías de satisfacción post-atención y archivo digital con trazabilidad legal.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex items-center gap-3 shrink-0">
            <Award className="w-8 h-8 text-emerald-600" />
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">
                ISB Global Institucional:
              </span>
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {metrics.averageISB}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Dimension Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dim 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <span className="text-xs text-slate-500 font-medium">1. Trato Digno y Empatía</span>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {dimensionAverages.empathy}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full"
              style={{ width: `${dimensionAverages.empathy}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-slate-500 block">Calidez y escucha activa</span>
        </div>

        {/* Dim 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <span className="text-xs text-slate-500 font-medium">2. Claridad de Información</span>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {dimensionAverages.clarity}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full"
              style={{ width: `${dimensionAverages.clarity}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-slate-500 block">Sin tecnicismos confusos</span>
        </div>

        {/* Dim 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <span className="text-xs text-slate-500 font-medium">3. Oportunidad en Tiempos</span>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {dimensionAverages.timeliness}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full"
              style={{ width: `${dimensionAverages.timeliness}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-slate-500 block">Cumplimiento de SLA legal</span>
        </div>

        {/* Dim 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <span className="text-xs text-slate-500 font-medium">4. Solución Efectiva</span>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {dimensionAverages.resolution}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full"
              style={{ width: `${dimensionAverages.resolution}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-slate-500 block">Resolución de fondo</span>
        </div>
      </div>

      {/* Grid: Ready to survey vs Surveyed & Closed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases ready for survey */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Casos Listos para Encuesta de Satisfacción Post-Notificación
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
              {readyForSurvey.length}
            </span>
          </div>

          <div className="p-4 divide-y divide-slate-100 flex-1 space-y-3 overflow-y-auto max-h-[500px]">
            {readyForSurvey.length > 0 ? (
              readyForSurvey.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="pt-3 first:pt-0 hover:bg-slate-50 p-3 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900 tabular-nums">
                      {ticket.radicadoNumber}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                      {ticket.citizen.phone}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-800 mt-1">
                    {ticket.citizen.fullName} · {ticket.type}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                    {ticket.subject}
                  </p>

                  <div className="mt-2 text-right">
                    <span className="text-xs text-slate-900 font-medium hover:underline inline-block">
                      Aplicar Encuesta ISB &rarr;
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-xs text-slate-400">
                No hay casos pendientes de encuesta en este momento.
              </div>
            )}
          </div>
        </div>

        {/* Surveyed & Archived */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">
                Expedientes Cerrados y Calificados en el Archivo Digital
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
              {closedTickets.length}
            </span>
          </div>

          <div className="p-4 divide-y divide-slate-100 flex-1 space-y-3 overflow-y-auto max-h-[500px]">
            {closedTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="pt-3 first:pt-0 hover:bg-slate-50 p-3 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-900 tabular-nums">
                    {ticket.radicadoNumber}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold tabular-nums text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {ticket.survey?.overallISB || 95}% ISB
                    </span>
                    <span className="text-[11px] text-slate-400">Archivado</span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-800 mt-1">
                  {ticket.citizen.fullName}
                </div>

                {ticket.survey?.feedbackComments && (
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 italic bg-slate-50 p-2 rounded">
                    "{ticket.survey.feedbackComments}"
                  </p>
                )}

                <div className="text-[11px] text-slate-500 mt-2 flex justify-between">
                  <span>Cerrado por: {ticket.closedBy || 'Coordinación'}</span>
                  <span>{new Date(ticket.closedAt || '').toLocaleDateString('es-CO')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
