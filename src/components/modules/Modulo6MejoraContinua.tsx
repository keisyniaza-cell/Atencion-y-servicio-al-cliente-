import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImprovementPlan, SocialProjectArea } from '../../types';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  Building,
} from 'lucide-react';

export const Modulo6MejoraContinua: React.FC = () => {
  const { metrics, improvementPlans, addImprovementPlan, tickets } = useApp();

  const [isGeneratingAiPlan, setIsGeneratingAiPlan] = useState(false);
  const [showAddPlanForm, setShowAddPlanForm] = useState(false);
  const [showExecutiveReportModal, setShowExecutiveReportModal] = useState(false);

  // Form states for new PMC
  const [detectedProblem, setDetectedProblem] = useState('');
  const [affectedArea, setAffectedArea] = useState<SocialProjectArea>('Nutrición y Seguridad Alimentaria');
  const [rootCause, setRootCause] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [preventiveAction, setPreventiveAction] = useState('');
  const [responsible, setResponsible] = useState('Patricia Salcedo (Servicio) y Coordinador de Área');
  const [deadline, setDeadline] = useState('2026-11-30');
  const [kpiTarget, setKpiTarget] = useState('100% de cumplimiento en tiempos de respuesta SLA');

  // Trigger AI Root Cause Analysis
  const handleAiRootCause = async () => {
    if (!detectedProblem) {
      alert('Por favor describa primero el problema o desviación detectada.');
      return;
    }
    setIsGeneratingAiPlan(true);
    try {
      const res = await fetch('/api/ai/corrective-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recurringPattern: detectedProblem,
          affectedArea,
          isbScore: metrics.averageISB,
          pendingCasesCount: metrics.overdueTickets,
        }),
      });
      const data = await res.json();
      if (data.rootCause) setRootCause(data.rootCause);
      if (data.correctiveAction) setCorrectiveAction(data.correctiveAction);
      if (data.preventiveAction) setPreventiveAction(data.preventiveAction);
      if (data.responsibleRole) setResponsible(data.responsibleRole);
      if (data.kpiToMonitor) setKpiTarget(data.kpiToMonitor);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAiPlan(false);
    }
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    addImprovementPlan({
      detectedProblem,
      rootCause,
      affectedArea,
      correctiveAction,
      preventiveAction,
      responsible,
      deadline,
      status: 'En Implementación',
      kpiTarget,
    });
    setShowAddPlanForm(false);
    setDetectedProblem('');
    setRootCause('');
    setCorrectiveAction('');
    setPreventiveAction('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              Etapa PHVA: Actuar · Módulo 6
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Análisis de Indicadores, Planes de Mejora e Informe Gerencial
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Cierre del ciclo PHVA: análisis de no conformidades, trazabilidad de causas raíz en PQRS recurrentes, formulación de planes de acción correctiva y generación del Informe Gerencial para la Dirección y Junta Directiva de la Corporación Social Somos Uno.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowExecutiveReportModal(true)}
              className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Generar Informe para Junta Directiva</span>
            </button>
            <button
              onClick={() => setShowAddPlanForm(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuevo Plan de Mejora</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: SLA Compliance */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Cumplimiento Global de SLA</span>
            <Clock className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {metrics.slaCompliancePercentage}%
          </div>
          <div className="text-[11px] text-slate-600">
            {metrics.totalTickets - metrics.overdueTickets} de {metrics.totalTickets} casos gestionados a tiempo
          </div>
        </div>

        {/* KPI 2: ISB */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Índice de Satisfacción (ISB)</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {metrics.averageISB}%
          </div>
          <div className="text-[11px] text-emerald-800 font-medium">
            Nivel Favorable Institucional (&gt; 85%)
          </div>
        </div>

        {/* KPI 3: Casos Abiertos / Activos */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Casos en Trámite Activo</span>
            <BarChart3 className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {metrics.activeTickets}
          </div>
          <div className="text-[11px] text-slate-600">
            {metrics.closedTickets} expedientes cerrados y archivados
          </div>
        </div>

        {/* KPI 4: Casos Vencidos */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Riesgo de Vencimiento / Vencidos</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {metrics.overdueTickets}
          </div>
          <div className="text-[11px] text-slate-600">
            {metrics.overdueTickets === 0 ? 'Sin no conformidades críticas' : 'Requiere acción correctiva inmediata'}
          </div>
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown by Type */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Distribución por Tipología de Requerimiento (PQRSC)
          </h3>
          <div className="space-y-2.5">
            {Object.entries(metrics.ticketsByType).map(([type, count]) => {
              const pct = Math.round((count / (metrics.totalTickets || 1)) * 100);
              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-800">{type}</span>
                    <span className="text-slate-500 font-mono tabular-nums">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-slate-800 h-1.5 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown by Social Project Area */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Volumen por Proyecto Social Involucrado
          </h3>
          <div className="space-y-2.5">
            {Object.entries(metrics.ticketsByArea).map(([area, count]) => {
              const pct = Math.round((count / (metrics.totalTickets || 1)) * 100);
              return (
                <div key={area} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-800 truncate max-w-xs">{area}</span>
                    <span className="text-slate-500 font-mono tabular-nums">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-700 h-1.5 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form for new PMC (Conditional) */}
      {showAddPlanForm && (
        <form
          onSubmit={handleSavePlan}
          className="bg-white border-2 border-slate-900 rounded-xl p-6 space-y-4 shadow-md"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Formulación de Plan de Mejora Continua (PMC)
              </h3>
              <p className="text-xs text-slate-500">
                Basado en el ciclo PHVA (Problemas identificados en el Diagnóstico Operativo)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddPlanForm(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Cerrar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Problema o Desviación Detectada *
              </label>
              <input
                type="text"
                required
                value={detectedProblem}
                onChange={(e) => setDetectedProblem(e.target.value)}
                placeholder="Ej. Demoras en conceptos técnicos de proyectos de vivienda..."
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Área de Proyectos Social *
              </label>
              <select
                value={affectedArea}
                onChange={(e) => setAffectedArea(e.target.value as any)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5"
              >
                <option value="Nutrición y Seguridad Alimentaria">Nutrición y Seguridad Alimentaria</option>
                <option value="Vivienda y Mejoramiento Comunitario">Vivienda y Mejoramiento Comunitario</option>
                <option value="Empleabilidad y Emprendimiento">Empleabilidad y Emprendimiento</option>
                <option value="Atención Integral al Adulto Mayor">Atención Integral al Adulto Mayor</option>
                <option value="Primera Infancia y Educación">Primera Infancia y Educación</option>
                <option value="Dirección y Asuntos Jurídicos">Dirección y Asuntos Jurídicos</option>
              </select>
            </div>
          </div>

          {/* AI trigger button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAiRootCause}
              disabled={isGeneratingAiPlan}
              className="px-3.5 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingAiPlan ? 'Analizando Causa Raíz...' : 'Sugerir Causa Raíz y Acción Correctiva con IA'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Causa Raíz Identificada *
              </label>
              <textarea
                required
                rows={2}
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="¿Por qué se originó la falla operativa?"
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Acción Correctiva Inmediata *
              </label>
              <textarea
                required
                rows={2}
                value={correctiveAction}
                onChange={(e) => setCorrectiveAction(e.target.value)}
                placeholder="Acción inmediata para resolver el cuello de botella..."
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Acción Preventiva a Largo Plazo *
              </label>
              <input
                type="text"
                required
                value={preventiveAction}
                onChange={(e) => setPreventiveAction(e.target.value)}
                placeholder="Estrategia para evitar recurrencia..."
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Responsable del Cumplimiento *
              </label>
              <input
                type="text"
                required
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Plazo Límite de Implementación *
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowAddPlanForm(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm cursor-pointer"
            >
              Registrar Plan de Mejora
            </button>
          </div>
        </form>
      )}

      {/* Improvement Plans Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Matriz de Planes de Mejora Continua (PMC) Activos
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {improvementPlans.length} planes registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-5">Código & Fecha</th>
                <th className="py-3 px-5">Problema & Área</th>
                <th className="py-3 px-5">Causa Raíz</th>
                <th className="py-3 px-5">Acción Correctiva & Preventiva</th>
                <th className="py-3 px-5">Responsable</th>
                <th className="py-3 px-5">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {improvementPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-5 whitespace-nowrap">
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {plan.code}
                    </span>
                    <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                      {plan.dateIdentified}
                    </div>
                  </td>
                  <td className="py-3 px-5 max-w-xs">
                    <div className="font-semibold text-slate-900">
                      {plan.detectedProblem}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {plan.affectedArea}
                    </div>
                  </td>
                  <td className="py-3 px-5 text-slate-600 max-w-xs">
                    {plan.rootCause}
                  </td>
                  <td className="py-3 px-5 text-slate-600 max-w-xs space-y-1">
                    <div>
                      <strong className="text-slate-800">Correctiva:</strong> {plan.correctiveAction}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      <strong>Preventiva:</strong> {plan.preventiveAction}
                    </div>
                  </td>
                  <td className="py-3 px-5 text-slate-700 whitespace-nowrap">
                    <div className="font-medium">{plan.responsible}</div>
                    <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                      Plazo: {plan.deadline}
                    </div>
                  </td>
                  <td className="py-3 px-5 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        plan.status === 'Verificado Eficaz'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {plan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Official Executive Report for Board of Directors */}
      {showExecutiveReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full my-6 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
              <div>
                <h3 className="text-sm font-bold">
                  Informe Gerencial de Servicio al Cliente y Gestión de PQRS
                </h3>
                <p className="text-xs text-slate-400">
                  Documento Ejecutivo para la Dirección General y Junta Directiva
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / Exportar PDF</span>
                </button>
                <button
                  onClick={() => setShowExecutiveReportModal(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cerrar
                </button>
              </div>
            </div>

            {/* Document Body (Printable) */}
            <div className="p-8 overflow-y-auto space-y-6 text-slate-800 text-xs leading-relaxed font-sans">
              {/* Header Letterhead */}
              <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                    Corporación Social Somos Uno
                  </h2>
                  <p className="text-xs font-semibold text-slate-600">
                    Coordinación de Calidad, Atención al Ciudadano y Servicio Social
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Principios Institucionales: Dignidad · Solidaridad · Universalidad
                  </p>
                </div>
                <div className="text-right font-mono text-xs text-slate-600 tabular-nums">
                  <div>Fecha: 24 de Octubre de 2026</div>
                  <div>Periodo Evaluado: Trimestre IV - 2026</div>
                  <div className="text-[10px] text-slate-400">Ref: INF-DIR-PQRS-2026-04</div>
                </div>
              </div>

              {/* 1. Diagnóstico y Resultados Operativos */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                  1. Diagnóstico y Resumen de Desempeño Operativo
                </h3>
                <p>
                  En cumplimiento del Flujograma Operativo del Ciclo PHVA y la Matriz de Caracterización del Proceso, se presenta el balance integral de atención al ciudadano y gestión de PQRS. Durante el periodo evaluado se radicaron un total de <strong>{metrics.totalTickets} requerimientos</strong> a través de los canales presenciales, telefónicos y digitales.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Cumplimiento de SLA Normativo:</span>
                    <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                      {metrics.slaCompliancePercentage}%
                    </span>
                    <span className="text-[10px] text-emerald-800 block">Gestión ágil sin vencimientos</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Índice de Satisfacción (ISB):</span>
                    <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                      {metrics.averageISB}%
                    </span>
                    <span className="text-[10px] text-slate-600 block">Calificación favorable comunitaria</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Planes de Mejora Activos:</span>
                    <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                      {improvementPlans.length} PMC
                    </span>
                    <span className="text-[10px] text-slate-600 block">Acciones correctivas en marcha</span>
                  </div>
                </div>
              </div>

              {/* 2. Solución a las 5 Problemáticas del Diagnóstico */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
                  2. Estado de Solución a las 5 Problemáticas Operativas
                </h3>
                <div className="space-y-2">
                  <div className="border border-slate-200 rounded p-2.5">
                    <strong className="text-slate-900">Problema 1: Tiempos de Respuesta Prolongados en PQRS:</strong>
                    <p className="text-slate-600 mt-0.5">
                      Sistematizado mediante radicación digital centralizada, semáforos semanales y control estricto de SLAs normativos (15 días para peticiones/quejas/reclamos, 10 días para consultas/sugerencias).
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded p-2.5">
                    <strong className="text-slate-900">Problema 2: Saturación y Falta de Canales Estandarizados:</strong>
                    <p className="text-slate-600 mt-0.5">
                      Habilitación de Gestor de Turnos presencial con ventanilla prioritaria para adultos mayores, línea de WhatsApp y portal ciudadano 24/7 con catálogo de preguntas frecuentes (FAQ) unificadas.
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded p-2.5">
                    <strong className="text-slate-900">Problema 3: Ausencia de Medición Periódica de Satisfacción:</strong>
                    <p className="text-slate-600 mt-0.5">
                      Implementación del Módulo 5 con encuestas post-servicio en 4 dimensiones (Trato/Empatía, Claridad, Tiempo, Solución) y cálculo automático del ISB consolidado.
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded p-2.5">
                    <strong className="text-slate-900">Problema 4: Carencia de Protocolos de Atención Empática:</strong>
                    <p className="text-slate-600 mt-0.5">
                      Socialización del Manual de Protocolo Empático, simulador de desescalamiento de conflictos y realización de auditorías internas periódicas de atención con rúbrica sobre 100 puntos.
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded p-2.5">
                    <strong className="text-slate-900">Problema 5: Desarticulación entre Servicio y Áreas Operativas:</strong>
                    <p className="text-slate-600 mt-0.5">
                      Creación del Comité Semanal de Coordinación con coordinadores de proyectos (Nutrición, Vivienda, Adulto Mayor, Empleabilidad, Infancia) y estandarización del Concepto Técnico Operativo.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Firmas de Validación */}
              <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-slate-700">
                <div>
                  <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
                  <p className="font-bold text-slate-900">Patricia Salcedo Henao</p>
                  <p className="text-[11px] text-slate-500">Coordinadora de Servicio al Cliente y Calidad</p>
                </div>
                <div>
                  <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
                  <p className="font-bold text-slate-900">Dirección General</p>
                  <p className="text-[11px] text-slate-500">Corporación Social Somos Uno</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
