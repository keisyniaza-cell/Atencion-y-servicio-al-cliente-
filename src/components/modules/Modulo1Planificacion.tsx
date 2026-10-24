import React from 'react';
import { SLA_RULES, PROJECT_LEADERS } from '../../data/initialData';
import { Shield, Clock, Users, Headphones, CheckCircle2, BookOpen, Layers } from 'lucide-react';

export const Modulo1Planificacion: React.FC = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Module Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              Etapa PHVA: Planificar
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Módulo 1: Planificación y Apertura de Canales de Atención
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Definición de directrices de servicio, habilitación y estandarización de canales (presencial, telefónico, digital y comunitario), asignación de recursos y parametrización de tiempos máximos de respuesta (SLA).
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>Valores: Dignidad · Solidaridad · Universalidad</span>
          </div>
        </div>
      </div>

      {/* Grid of Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Directrices Institucionales */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-800">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Directrices de Servicio</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Lineamientos aprobados por la Dirección General para asegurar una atención respetuosa, cercana y transparente a las comunidades vulnerables.
          </p>
          <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Acogida cálida sin discriminación ni barreras idiomáticas o digitales.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Prioridad absoluta a adultos mayores, gestantes y personas con discapacidad.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Lenguaje claro: prohibido responder con jerga jurídica o tecnicismos opacos.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 2: Canales Multicanal Habilitados */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-800">
            <Headphones className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Canales Estandarizados</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Elimina el aislamiento y la desinformación en las comunidades (Soluciona el Problema 2 del diagnóstico).
          </p>
          <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-900 block">Sede Presencial</span>
                <span className="text-[11px] text-slate-500">3 Ventanillas con Gestor de Turnos</span>
              </div>
              <span className="text-emerald-700 font-medium text-[11px]">Activo 8:00 - 17:00</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-900 block">Línea Telefónica & WhatsApp</span>
                <span className="text-[11px] text-slate-500">Línea Gratuita y Chat Asistido</span>
              </div>
              <span className="text-emerald-700 font-medium text-[11px]">Activo</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-900 block">Portal Ciudadano Web</span>
                <span className="text-[11px] text-slate-500">Radicación 24/7 y Consulta de Radicado</span>
              </div>
              <span className="text-emerald-700 font-medium text-[11px]">En Línea</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Articulación Inter-Áreas */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-800">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Coordinación Operativa</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Vinculación directa entre recepción y líderes de programas para evitar demoras (Soluciona el Problema 5).
          </p>
          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100 text-slate-700">
            {Object.entries(PROJECT_LEADERS).slice(0, 4).map(([area, info]) => (
              <div key={area} className="flex justify-between items-center py-1 border-b border-slate-100 text-[11px]">
                <span className="font-medium text-slate-800 truncate max-w-[170px]">{area}</span>
                <span className="text-slate-500 truncate">{info.leader.split(' ')[0]} {info.leader.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SLA Normative Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Matriz Parametrizada de Tiempos Máximos de Respuesta (SLA Legal y Complejidad)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Normativa Institucional Somos Uno</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-6">Tipología del Requerimiento</th>
                <th className="py-3 px-6">Tiempo Legal Máximo</th>
                <th className="py-3 px-6">Alcance y Justificación Normativa</th>
                <th className="py-3 px-6">Alerta Preventiva</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(SLA_RULES).map(([type, rule]) => (
                <tr key={type} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">
                    {type}
                  </td>
                  <td className="py-3.5 px-6 font-mono font-bold tabular-nums text-emerald-800">
                    {rule.legalDays} días hábiles
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">
                    {rule.description}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="text-slate-500 text-[11px]">
                      Alerta a los {Math.max(1, rule.legalDays - 4)} días
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
