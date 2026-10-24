import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SocialProjectArea, Ticket } from '../../types';
import { PROJECT_LEADERS } from '../../data/initialData';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const Modulo3TramiteInterno: React.FC = () => {
  const { tickets, getSlaStatus, setSelectedTicket, setActiveView } = useApp();

  const [activeAreaFilter, setActiveAreaFilter] = useState<string>('all');

  const areas: SocialProjectArea[] = [
    'Nutrición y Seguridad Alimentaria',
    'Vivienda y Mejoramiento Comunitario',
    'Empleabilidad y Emprendimiento',
    'Atención Integral al Adulto Mayor',
    'Primera Infancia y Educación',
    'Dirección y Asuntos Jurídicos',
  ];

  const filteredTickets = tickets.filter(
    (t) => activeAreaFilter === 'all' || t.assignedProjectArea === activeAreaFilter
  );

  const pendingConceptCount = tickets.filter(
    (t) => !t.technicalConcept && t.status !== 'Cerrado'
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              Etapa PHVA: Hacer · Módulo 3
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gestión, Escalamiento y Trámite Interno con Áreas Técnicas
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Articulación directa entre Servicio al Cliente y los líderes de proyectos sociales de Somos Uno. Soluciona el <strong>Problema 5 (Desarticulación Operativa)</strong> mediante solicitudes estandarizadas de concepto técnico y seguimiento semanal.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('comite-coordinacion')}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Ver Comité Semanal</span>
            </button>
          </div>
        </div>

        {/* Operational metric banner */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-600">
          <div>
            <span className="text-slate-400">Pendientes de Concepto Técnico:</span>{' '}
            <strong className="text-amber-800 font-mono tabular-nums text-sm">
              {pendingConceptCount} casos
            </strong>
          </div>
          <span className="text-slate-300">·</span>
          <div>
            <span className="text-slate-400">Conceptos Técnicos Emitidos:</span>{' '}
            <strong className="text-emerald-800 font-mono tabular-nums text-sm">
              {tickets.filter((t) => t.technicalConcept).length} casos
            </strong>
          </div>
          <span className="text-slate-300">·</span>
          <div>
            <span className="text-slate-400">Meta SLA Interno:</span>{' '}
            <span className="text-slate-800 font-semibold">&le; 3 días hábiles para concepto</span>
          </div>
        </div>
      </div>

      {/* Filter by Area */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveAreaFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
            activeAreaFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Todas las Áreas ({tickets.length})
        </button>
        {areas.map((area) => {
          const count = tickets.filter((t) => t.assignedProjectArea === area).length;
          return (
            <button
              key={area}
              onClick={() => setActiveAreaFilter(area)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeAreaFilter === area
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {area} ({count})
            </button>
          );
        })}
      </div>

      {/* Project Areas Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {areas
          .filter((area) => activeAreaFilter === 'all' || activeAreaFilter === area)
          .map((area) => {
            const areaLeader = PROJECT_LEADERS[area];
            const areaTickets = tickets.filter((t) => t.assignedProjectArea === area);
            const pendingInArea = areaTickets.filter(
              (t) => !t.technicalConcept && t.status !== 'Cerrado'
            ).length;

            return (
              <div
                key={area}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
              >
                {/* Header of Area Card */}
                <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{area}</h3>
                    <p className="text-[11px] text-slate-500">
                      Coordinador: {areaLeader?.leader} · {areaLeader?.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        pendingInArea > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {pendingInArea} pendiente{pendingInArea === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>

                {/* List of Cases in Area */}
                <div className="p-4 divide-y divide-slate-100 flex-1 space-y-3">
                  {areaTickets.length > 0 ? (
                    areaTickets.map((t) => {
                      const sla = getSlaStatus(t);
                      return (
                        <div
                          key={t.id}
                          onClick={() => setSelectedTicket(t)}
                          className="pt-3 first:pt-0 hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-slate-900 tabular-nums">
                              {t.radicadoNumber}
                            </span>
                            <div className="flex items-center gap-2">
                              {t.technicalConcept ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Concepto Emitido</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded">
                                  <Clock className="w-3 h-3" />
                                  <span>Pendiente Concepto</span>
                                </span>
                              )}
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                  sla.color === 'green'
                                    ? 'text-emerald-700 bg-emerald-50'
                                    : sla.color === 'amber'
                                    ? 'text-amber-700 bg-amber-50'
                                    : 'text-rose-700 bg-rose-50'
                                }`}
                              >
                                {sla.label}
                              </span>
                            </div>
                          </div>

                          <div className="text-xs text-slate-800 font-medium mt-1">
                            {t.citizen.fullName} ·{' '}
                            <span className="text-slate-500 font-normal">{t.type}</span>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                            {t.subject}
                          </p>

                          {t.technicalConcept && (
                            <div className="mt-2 text-[11px] bg-slate-50 p-2 rounded border border-slate-200 text-slate-600">
                              <strong className="text-slate-800">Decisión Técnica:</strong>{' '}
                              {t.technicalConcept.decision}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No hay casos asignados actualmente a este proyecto social.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
