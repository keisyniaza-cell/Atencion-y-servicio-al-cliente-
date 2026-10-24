import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Ticket } from '../types';
import {
  Search,
  CheckCircle2,
  Clock,
  HeartHandshake,
  HelpCircle,
  FileText,
  Send,
  Star,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const PortalCiudadano: React.FC<{ onOpenNewModal: () => void }> = ({ onOpenNewModal }) => {
  const { tickets, faqs, recordSatisfactionSurvey } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [foundTicket, setFoundTicket] = useState<Ticket | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Citizen survey states if ticket has response but no survey yet
  const [citizenRating, setCitizenRating] = useState(5);
  const [citizenComments, setCitizenComments] = useState('');
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setHasSearched(true);
    const clean = searchQuery.trim().toLowerCase();
    const result = tickets.find(
      (t) =>
        t.radicadoNumber.toLowerCase() === clean ||
        t.citizen.documentNumber.toLowerCase() === clean ||
        t.citizen.fullName.toLowerCase().includes(clean)
    );

    setFoundTicket(result || null);
  };

  const handleCitizenSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundTicket) return;

    recordSatisfactionSurvey(foundTicket.id, {
      appliedBy: 'Encuesta Directa desde Portal Ciudadano',
      empathyScore: citizenRating,
      clarityScore: citizenRating,
      timelinessScore: citizenRating,
      effectiveResolutionScore: citizenRating,
      feedbackComments: citizenComments || 'Calificación enviada directamente por el beneficiario.',
    });
    setSurveySubmitted(true);
  };

  const filteredFaqs = faqs.filter(
    (f) => selectedFaqCategory === 'all' || f.category === selectedFaqCategory
  );

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-4">
      {/* Community Hero */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full">
            <HeartHandshake className="w-4 h-4" />
            <span>Portal de Atención a la Comunidad · Somos Uno</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Atención Digna, Solidaria y Transparente a Nuestros Beneficiarios
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Consulte en tiempo real el estado de su requerimiento, radique una solicitud sin filas ni intermediarios, y acceda a información verificada sobre programas sociales y subsidios comunitarios.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onOpenNewModal}
              className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              + Radicar Nueva Petición o Queja
            </button>
            <a
              href="#faqs-section"
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Guía de Requisitos y Convocatorias
            </a>
          </div>
        </div>
      </div>

      {/* Tracker Section: Search by Radicado or ID */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl font-bold text-slate-900">
            Consulte el Avance de su Requerimiento
          </h2>
          <p className="text-xs text-slate-500">
            Ingrese su número de radicado oficial (ejemplo: <strong>SOMOS-2026-0038</strong>) o su número de cédula.
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              required
              placeholder="Número de Radicado o Cédula..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            Consultar Estado
          </button>
        </form>

        {/* Search Result */}
        {hasSearched && (
          <div className="pt-4 border-t border-slate-200">
            {foundTicket ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-xs text-slate-500 block">Número de Radicado:</span>
                    <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                      {foundTicket.radicadoNumber}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Beneficiario: <strong>{foundTicket.citizen.fullName}</strong>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Estado Actual:</span>
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full inline-block mt-0.5">
                      {foundTicket.status}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      Área: {foundTicket.assignedProjectArea}
                    </span>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Etapas del Proceso de Atención (PHVA):
                  </span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">1. Radicación</span>
                        <span className="text-[10px] text-slate-500">Recibido en sistema</span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          foundTicket.technicalConcept ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">2. Concepto Técnico</span>
                        <span className="text-[10px] text-slate-500">
                          {foundTicket.technicalConcept ? 'Emitido por líder' : 'En evaluación'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          foundTicket.officialResponse ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">3. Respuesta Oficial</span>
                        <span className="text-[10px] text-slate-500">
                          {foundTicket.officialResponse ? 'Notificada formalmente' : 'En validación'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          foundTicket.status === 'Cerrado' ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">4. Cierre y Archivo</span>
                        <span className="text-[10px] text-slate-500">
                          {foundTicket.status === 'Cerrado' ? 'Expediente concluido' : 'Pendiente cierre'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Official Response Preview if available */}
                {foundTicket.officialResponse && (
                  <div className="bg-white border border-emerald-200 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                      <span className="text-xs font-bold text-emerald-900 uppercase">
                        Respuesta Oficial de la Corporación Social Somos Uno:
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Constancia: {foundTicket.officialResponse.deliveryProofCode}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 whitespace-pre-line leading-relaxed">
                      {foundTicket.officialResponse.responseText}
                    </p>

                    <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      Notificada vía {foundTicket.officialResponse.channelNotified} · Aprobada por {foundTicket.officialResponse.approvedBy}
                    </div>
                  </div>
                )}

                {/* Citizen Rating Widget if not surveyed yet */}
                {foundTicket.officialResponse && !foundTicket.survey && !surveySubmitted && (
                  <form
                    onSubmit={handleCitizenSurvey}
                    className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
                  >
                    <span className="text-xs font-bold text-slate-900 block">
                      ¿Cómo califica la atención recibida en la Corporación Social Somos Uno?
                    </span>
                    <p className="text-xs text-slate-500">
                      Su opinión es vital para nuestro Índice de Satisfacción del Beneficiario (ISB).
                    </p>

                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setCitizenRating(star)}
                          className={`text-xl cursor-pointer transition-transform hover:scale-110 ${
                            star <= citizenRating ? 'text-amber-500' : 'text-slate-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-800 ml-2">
                        {citizenRating} de 5 Estrellas
                      </span>
                    </div>

                    <input
                      type="text"
                      placeholder="Deje un comentario sobre la atención recibida (opcional)..."
                      value={citizenComments}
                      onChange={(e) => setCitizenComments(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5"
                    />

                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                    >
                      Enviar Calificación de Servicio
                    </button>
                  </form>
                )}

                {surveySubmitted && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium">
                    ¡Muchas gracias por su calificación! Ha sido registrada en el Índice ISB institucional.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                No se encontró ningún requerimiento con el dato ingresado. Verifique el número de radicado o cédula.
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAQs Section: Informative Guides to Prevent Misinformation */}
      <div id="faqs-section" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
            Información Unificada Oficial
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Guía de Preguntas Frecuentes, Programas y Convocatorias
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Soluciona inconsistencias en la información entregada a la comunidad y evita la desinformación en los barrios y veredas de cobertura.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setSelectedFaqCategory('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedFaqCategory === 'all'
                ? 'bg-slate-900 text-white font-medium'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todos los Programas
          </button>
          <button
            onClick={() => setSelectedFaqCategory('Nutrición y Seguridad Alimentaria')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedFaqCategory === 'Nutrición y Seguridad Alimentaria'
                ? 'bg-slate-900 text-white font-medium'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Comedores & Nutrición
          </button>
          <button
            onClick={() => setSelectedFaqCategory('Vivienda y Mejoramiento Comunitario')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedFaqCategory === 'Vivienda y Mejoramiento Comunitario'
                ? 'bg-slate-900 text-white font-medium'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Mejoramiento de Vivienda
          </button>
          <button
            onClick={() => setSelectedFaqCategory('Atención Integral al Adulto Mayor')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedFaqCategory === 'Atención Integral al Adulto Mayor'
                ? 'bg-slate-900 text-white font-medium'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Adulto Mayor
          </button>
          <button
            onClick={() => setSelectedFaqCategory('Empleabilidad y Emprendimiento')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedFaqCategory === 'Empleabilidad y Emprendimiento'
                ? 'bg-slate-900 text-white font-medium'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Empleabilidad & Cursos
          </button>
        </div>

        {/* FAQ Accordion */}
        <div className="divide-y divide-slate-200 border-y border-slate-200 text-xs">
          {filteredFaqs.map((faq) => {
            const isOpen = expandedFaqId === faq.id;
            return (
              <div key={faq.id} className="py-4">
                <button
                  onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                  className="w-full text-left flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="pt-3 space-y-3 text-slate-600">
                    <p className="leading-relaxed">{faq.answer}</p>

                    {faq.requirements && faq.requirements.length > 0 && (
                      <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                          Requisitos Documentales Obligatorios:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                          {faq.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-400">
                      Actualizado: {faq.lastUpdated} · Programa: {faq.category}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
