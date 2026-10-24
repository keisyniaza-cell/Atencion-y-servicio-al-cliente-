import React, { useState } from 'react';
import { PROCESS_CHARACTERIZATION_MATRIX } from '../data/initialData';
import { Layers, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

export const CaracterizacionProceso: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<string>('all');

  const filteredSteps = PROCESS_CHARACTERIZATION_MATRIX.filter(
    (s) => selectedStage === 'all' || s.phvaStage === selectedStage
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              Ficha Técnica de Calidad y Caracterización
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Caracterización del Proceso de Atención y Servicio al Cliente
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Estructura formal del ciclo <strong>PHVA (Planificar - Hacer - Verificar - Actuar)</strong> de la Corporación Social Somos Uno, especificando proveedores, insumos de entrada, actividades clave, salidas documentales y clientes destinatarios.
            </p>
          </div>
        </div>

        {/* Process Meta Box */}
        <div className="mt-6 pt-5 border-t border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-700">
          <div>
            <span className="text-slate-500 block text-[11px]">Nombre del Proceso:</span>
            <span className="font-bold text-slate-900">Atención al Cliente y Gestión de PQRS</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Líder del Proceso:</span>
            <span className="font-bold text-slate-900">Coordinador de Servicio al Cliente</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-slate-500 block text-[11px]">Objetivo del Proceso:</span>
            <span className="text-slate-800">
              Recibir, orientar, tramitar y dar solución oportuna a solicitudes, peticiones, quejas, reclamos y sugerencias de la comunidad, garantizando altos estándares de calidad, empatía y satisfacción.
            </span>
          </div>
        </div>
      </div>

      {/* PHVA Stage Filters */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <button
          onClick={() => setSelectedStage('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            selectedStage === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Todo el Ciclo PHVA (6 Módulos)
        </button>
        <button
          onClick={() => setSelectedStage('PLANIFICAR')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            selectedStage === 'PLANIFICAR'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Planificar (Módulo 1)
        </button>
        <button
          onClick={() => setSelectedStage('HACER')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            selectedStage === 'HACER'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Hacer (Módulos 2, 3, 4)
        </button>
        <button
          onClick={() => setSelectedStage('VERIFICAR')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            selectedStage === 'VERIFICAR'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Verificar (Módulo 5)
        </button>
        <button
          onClick={() => setSelectedStage('ACTUAR')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            selectedStage === 'ACTUAR'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Actuar (Módulo 6)
        </button>
      </div>

      {/* Characterization Cards Stack */}
      <div className="space-y-4">
        {filteredSteps.map((step) => (
          <div
            key={step.moduleNumber}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs"
          >
            {/* Header of Module */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                    step.phvaStage === 'PLANIFICAR'
                      ? 'bg-blue-100 text-blue-800'
                      : step.phvaStage === 'HACER'
                      ? 'bg-emerald-100 text-emerald-800'
                      : step.phvaStage === 'VERIFICAR'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {step.phvaStage}
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  MÓDULO {step.moduleNumber}: {step.moduleName}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Página 4-5 Caracterización Somos Uno
              </span>
            </div>

            {/* Matrix Body: Provider -> Input -> Activities -> Outputs -> Recipient */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
              {/* Provider */}
              <div className="space-y-1">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block text-slate-500">
                  Proveedor
                </span>
                <p className="font-semibold text-slate-800">{step.provider}</p>
              </div>

              {/* Inputs */}
              <div className="space-y-1">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block text-slate-500">
                  Entradas (Insumos)
                </span>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
                  {step.inputs.map((inp, idx) => (
                    <li key={idx}>{inp}</li>
                  ))}
                </ul>
              </div>

              {/* Activities */}
              <div className="space-y-1 md:col-span-1">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block text-slate-500">
                  Actividades del Paso
                </span>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
                  {step.stepActivities.map((act, idx) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>

              {/* Outputs */}
              <div className="space-y-1">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block text-slate-500">
                  Salidas (Documentos / Resultados)
                </span>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
                  {step.outputs.map((out, idx) => (
                    <li key={idx} className="font-medium text-slate-800">
                      {out}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer */}
              <div className="space-y-1">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block text-slate-500">
                  Cliente / Destinatario
                </span>
                <p className="font-semibold text-slate-800">{step.customerOrRecipient}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
