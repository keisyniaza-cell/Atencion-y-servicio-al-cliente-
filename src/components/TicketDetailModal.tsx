import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Ticket, TechnicalConcept } from '../types';
import {
  X,
  Clock,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Send,
  Star,
  ShieldCheck,
  Archive,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';

interface TicketDetailModalProps {
  ticket: Ticket;
  onClose: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket, onClose }) => {
  const {
    getSlaStatus,
    addTicketNote,
    addTechnicalConcept,
    approveAndSendOfficialResponse,
    recordSatisfactionSurvey,
    closeTicketWithChecklist,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'timeline' | 'concept' | 'response' | 'survey'>('timeline');

  // New Note
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteAuthor, setNewNoteAuthor] = useState('Gestor de Atención');

  // Technical Concept Form (Modulo 3)
  const [conceptDecision, setConceptDecision] = useState<TechnicalConcept['decision']>('Favorable / Aprobado');
  const [conceptJustification, setConceptJustification] = useState(ticket.technicalConcept?.technicalJustification || '');
  const [conceptActions, setConceptActions] = useState(ticket.technicalConcept?.actionsSuggested || '');
  const [isSubmittingConcept, setIsSubmittingConcept] = useState(false);

  // Official Response Form (Modulo 4)
  const [responseText, setResponseText] = useState(ticket.officialResponse?.responseText || '');
  const [responseApprover, setResponseApprover] = useState('Patricia Salcedo (Coordinadora de Calidad y Servicio)');
  const [notificationChannel, setNotificationChannel] = useState('Portal Digital y Notificación Telefónica');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Survey Form (Modulo 5)
  const [empathyScore, setEmpathyScore] = useState(ticket.survey?.empathyScore || 5);
  const [clarityScore, setClarityScore] = useState(ticket.survey?.clarityScore || 5);
  const [timelinessScore, setTimelinessScore] = useState(ticket.survey?.timelinessScore || 4);
  const [resolutionScore, setResolutionScore] = useState(ticket.survey?.effectiveResolutionScore || 5);
  const [surveyComments, setSurveyComments] = useState(ticket.survey?.feedbackComments || '');
  const [surveySurveyor, setSurveySurveyor] = useState('Encuesta de Seguimiento Telefónico');

  const sla = getSlaStatus(ticket);

  // Add simple internal note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addTicketNote(ticket.id, {
      author: newNoteAuthor,
      role: 'Equipo Somos Uno',
      content: newNoteText.trim(),
    });
    setNewNoteText('');
  };

  // Submit Technical Concept
  const handleSaveConcept = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingConcept(true);
    addTechnicalConcept(ticket.id, {
      leaderName: ticket.assignedCoordinator,
      area: ticket.assignedProjectArea,
      date: new Date().toISOString().split('T')[0],
      decision: conceptDecision,
      technicalJustification: conceptJustification,
      actionsSuggested: conceptActions,
    });
    setIsSubmittingConcept(false);
    setActiveTab('response');
  };

  // Generate AI Empathic Response
  const handleGenerateAiResponse = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/empathic-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenName: ticket.citizen.fullName,
          requestType: ticket.type,
          projectArea: ticket.assignedProjectArea,
          citizenDescription: ticket.description,
          agentNotes: ticket.technicalConcept?.technicalJustification || ticket.notes[0]?.content || '',
          tone: 'Empático, cálido, digno y resolutivo (Valores Somos Uno)',
        }),
      });
      const data = await res.json();
      if (data.text) {
        setResponseText(data.text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Approve and Notify Response
  const handleApproveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    approveAndSendOfficialResponse(ticket.id, {
      responseText: responseText.trim(),
      approvedBy: responseApprover,
      channelNotified: notificationChannel,
    });
    setActiveTab('survey');
  };

  // Submit Satisfaction Survey
  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    recordSatisfactionSurvey(ticket.id, {
      appliedBy: surveySurveyor,
      empathyScore,
      clarityScore,
      timelinessScore,
      effectiveResolutionScore: resolutionScore,
      feedbackComments: surveyComments,
    });
  };

  // Close Ticket
  const handleCloseTicket = () => {
    closeTicketWithChecklist(ticket.id, 'Patricia Salcedo (Coordinadora)');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-4xl w-full my-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold tabular-nums text-emerald-400">
                  {ticket.radicadoNumber}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  {ticket.type}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs text-slate-300">{ticket.status}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{ticket.subject}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* SLA indicator */}
            <div
              className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 ${
                sla.color === 'green'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : sla.color === 'amber'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>SLA: {sla.label}</span>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Sub-Header: Citizen Summary */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-600 shrink-0">
          <div>
            <span className="text-slate-400 block text-[11px]">Beneficiario:</span>
            <span className="font-semibold text-slate-900">{ticket.citizen.fullName}</span>
            <span className="block text-slate-500 font-mono tabular-nums">
              {ticket.citizen.documentNumber}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Canal & Teléfono:</span>
            <span className="font-medium text-slate-800">{ticket.channel}</span>
            <span className="block text-slate-500 font-mono tabular-nums">{ticket.citizen.phone}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Proyecto Social Asignado:</span>
            <span className="font-medium text-slate-800">{ticket.assignedProjectArea}</span>
            <span className="block text-slate-500">{ticket.assignedCoordinator}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Enfoque Poblacional:</span>
            <span className="font-medium text-slate-800">
              {ticket.citizen.vulnerabilityType || 'General'}
            </span>
            <span className="block text-slate-500 text-[11px]">
              Vencimiento: {new Date(ticket.dueDate).toLocaleDateString('es-CO')}
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Modules 2, 3, 4, 5) */}
        <div className="px-6 border-b border-slate-200 bg-white flex gap-6 text-xs font-medium text-slate-500 shrink-0">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            01. Bitácora & Expediente
          </button>
          <button
            onClick={() => setActiveTab('concept')}
            className={`py-3 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'concept'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <span>02. Concepto Técnico</span>
            {ticket.technicalConcept && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
          <button
            onClick={() => setActiveTab('response')}
            className={`py-3 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'response'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <span>03. Respuesta Institucional</span>
            {ticket.officialResponse && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
          <button
            onClick={() => setActiveTab('survey')}
            className={`py-3 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'survey'
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <span>04. Encuesta ISB & Cierre</span>
            {ticket.survey && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* TAB 1: Bitácora & Expediente */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* Solicitud Inicial */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Descripción Inicial del Ciudadano
                </span>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {ticket.description}
                </p>
                {ticket.citizen.address && (
                  <p className="text-xs text-slate-500 pt-1 border-t border-slate-200">
                    Ubicación reportada: {ticket.citizen.address} · {ticket.citizen.neighborhoodOrVereda}
                  </p>
                )}
              </div>

              {/* Historial de Notas */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Historial de Seguimiento y Trazabilidad PHVA
                </h4>

                <div className="space-y-3">
                  {ticket.notes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-3.5 rounded-lg border text-xs space-y-1 ${
                        note.isTechnicalConcept
                          ? 'bg-blue-50/70 border-blue-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-semibold text-slate-800">
                          {note.author} <span className="font-normal text-slate-500">({note.role})</span>
                        </span>
                        <span className="tabular-nums font-mono text-[11px]">
                          {new Date(note.date).toLocaleString('es-CO')}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed mt-1">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form to add internal note */}
              <form onSubmit={handleAddNote} className="space-y-3 pt-4 border-t border-slate-200">
                <label className="block text-xs font-medium text-slate-700">
                  Agregar Nueva Nota de Gestión Interna / Coordinación
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newNoteAuthor}
                    onChange={(e) => setNewNoteAuthor(e.target.value)}
                    placeholder="Nombre del funcionario"
                    className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                  />
                  <div className="md:col-span-3 flex gap-2">
                    <input
                      type="text"
                      required
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Registrar avance, llamada realizada o acuerdo con líder técnico..."
                      className="flex-1 text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      Registrar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Concepto Técnico (Módulo 3 - HACER) */}
          {activeTab === 'concept' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Módulo 3: Gestión y Trámite con Área Técnica
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    Líder: {ticket.assignedCoordinator}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  El líder del proyecto social {ticket.assignedProjectArea} debe validar antecedentes técnicos, cruzar bases de datos y expedir su concepto formal estandarizado.
                </p>
              </div>

              {ticket.technicalConcept ? (
                <div className="bg-white border border-emerald-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-bold text-slate-900">
                        Concepto Técnico Vigente Registrado
                      </span>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                      {ticket.technicalConcept.decision}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Justificación Técnica:</span>
                      <p className="text-slate-800 mt-0.5 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                        {ticket.technicalConcept.technicalJustification}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">Acciones Operativas Recomendadas:</span>
                      <p className="text-slate-800 mt-0.5 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                        {ticket.technicalConcept.actionsSuggested}
                      </p>
                    </div>

                    <div className="text-slate-500 text-[11px] pt-2">
                      Emitido por {ticket.technicalConcept.leaderName} · Fecha: {ticket.technicalConcept.date}
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveConcept} className="space-y-4 border border-slate-200 rounded-xl p-5 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Decisión Técnica *
                      </label>
                      <select
                        value={conceptDecision}
                        onChange={(e) => setConceptDecision(e.target.value as any)}
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                      >
                        <option value="Favorable / Aprobado">Favorable / Aprobado</option>
                        <option value="En Verificación de Campo">En Verificación de Campo</option>
                        <option value="Requiere Subsanación de Requisitos">Requiere Subsanación de Requisitos</option>
                        <option value="No Favorable Justificado">No Favorable Justificado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Área de Proyectos Responsable
                      </label>
                      <input
                        type="text"
                        disabled
                        value={ticket.assignedProjectArea}
                        className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Justificación Técnica y Antecedentes *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={conceptJustification}
                      onChange={(e) => setConceptJustification(e.target.value)}
                      placeholder="Describa el cruce de planillas, visita domiciliaria o validación normativa..."
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-3"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Acción Operativa Recomendada para la Respuesta *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={conceptActions}
                      onChange={(e) => setConceptActions(e.target.value)}
                      placeholder="Indique la solución concreta que se le entregará al beneficiario..."
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-3"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingConcept}
                      className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      Guardar Concepto y Continuar a Respuesta
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: Respuesta Institucional (Módulo 4 - HACER) */}
          {activeTab === 'response' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                    Módulo 4: Redacción Empática y Notificación Formal
                  </span>
                  <p className="text-xs text-slate-600">
                    Alineada a los valores de Dignidad, Solidaridad y Universalidad de la Corporación Social Somos Uno.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAiResponse}
                  disabled={isGeneratingAi}
                  className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isGeneratingAi ? 'Generando Redacción...' : 'Asistente de Redacción Empática'}</span>
                </button>
              </div>

              {ticket.officialResponse ? (
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-bold text-slate-900">
                        Respuesta Oficial Aprobada y Notificada
                      </span>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-slate-600">
                      Constancia: {ticket.officialResponse.deliveryProofCode}
                    </span>
                  </div>

                  <div className="text-xs space-y-3">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-800 whitespace-pre-line leading-relaxed">
                      {ticket.officialResponse.responseText}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-slate-600 pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Aprobado Por:</span>
                        <span className="font-medium text-slate-800">{ticket.officialResponse.approvedBy}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Canal de Notificación:</span>
                        <span className="font-medium text-slate-800">{ticket.officialResponse.channelNotified}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApproveResponse} className="space-y-4 border border-slate-200 rounded-xl p-5 bg-white">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Texto de la Comunicación Formal para el Beneficiario *
                    </label>
                    <textarea
                      required
                      rows={8}
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Escriba la comunicación o utilice el 'Asistente de Redacción Empática' para redactar una respuesta institucional clara, cálida y sin tecnicismos confusos..."
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-3 font-sans leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Canal Oficial de Notificación *
                      </label>
                      <select
                        value={notificationChannel}
                        onChange={(e) => setNotificationChannel(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                      >
                        <option value="Portal Digital y Notificación Telefónica">Portal Digital y Llamada Telefónica</option>
                        <option value="Correo Electrónico Certificado">Correo Electrónico Certificado</option>
                        <option value="Entrega Física en Taquilla de Sede">Entrega Física en Taquilla de Sede</option>
                        <option value="Visita Domiciliaria Territorial">Visita Domiciliaria Territorial (Adulto Mayor / Rural)</option>
                        <option value="WhatsApp Institucional Verificado">WhatsApp Institucional Verificado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Funcionario que Aprueba y Valida *
                      </label>
                      <input
                        type="text"
                        required
                        value={responseApprover}
                        onChange={(e) => setResponseApprover(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Validar y Notificar al Beneficiario</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: Encuesta ISB & Cierre (Módulo 5 - VERIFICAR) */}
          {activeTab === 'survey' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Módulo 5: Evaluación de Satisfacción y Cierre de Casos
                </span>
                <p className="text-xs text-slate-600">
                  Resuelve el Problema 3 del diagnóstico: Medición periódica del <strong>Índice de Satisfacción del Beneficiario (ISB)</strong> en 4 dimensiones de servicio.
                </p>
              </div>

              {ticket.survey ? (
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-xs text-slate-500">Índice de Satisfacción Obtenido:</span>
                      <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                        {ticket.survey.overallISB}% ISB
                      </div>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <span>Aplicada el: {ticket.survey.date}</span>
                      <span className="block text-slate-600 font-medium">{ticket.survey.appliedBy}</span>
                    </div>
                  </div>

                  {/* 4 Dimensions Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Trato y Empatía:</span>
                      <span className="text-base font-bold text-slate-900 tabular-nums">
                        {ticket.survey.empathyScore} / 5
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Claridad de Info:</span>
                      <span className="text-base font-bold text-slate-900 tabular-nums">
                        {ticket.survey.clarityScore} / 5
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Tiempo de Espera:</span>
                      <span className="text-base font-bold text-slate-900 tabular-nums">
                        {ticket.survey.timelinessScore} / 5
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Solución Efectiva:</span>
                      <span className="text-base font-bold text-slate-900 tabular-nums">
                        {ticket.survey.effectiveResolutionScore} / 5
                      </span>
                    </div>
                  </div>

                  {ticket.survey.feedbackComments && (
                    <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[11px]">Comentarios del Beneficiario:</span>
                      <p className="text-slate-800 mt-1 italic">"{ticket.survey.feedbackComments}"</p>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmitSurvey} className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
                  <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Aplicación de Encuesta Rápida al Beneficiario
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        1. Trato digno, empatía y calidez del personal (1-5)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={empathyScore}
                        onChange={(e) => setEmpathyScore(Number(e.target.value))}
                        className="w-full accent-slate-900"
                      />
                      <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                        <span>1 (Deficiente)</span>
                        <span className="font-bold text-slate-900">{empathyScore} ★</span>
                        <span>5 (Excelente)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        2. Claridad de la información brindada (1-5)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={clarityScore}
                        onChange={(e) => setClarityScore(Number(e.target.value))}
                        className="w-full accent-slate-900"
                      />
                      <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                        <span>1 (Confuso)</span>
                        <span className="font-bold text-slate-900">{clarityScore} ★</span>
                        <span>5 (Muy Claro)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        3. Agilidad y cumplimiento de tiempos de respuesta (1-5)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={timelinessScore}
                        onChange={(e) => setTimelinessScore(Number(e.target.value))}
                        className="w-full accent-slate-900"
                      />
                      <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                        <span>1 (Muy Lento)</span>
                        <span className="font-bold text-slate-900">{timelinessScore} ★</span>
                        <span>5 (Oportuno)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        4. Solución o alternativa efectiva entregada (1-5)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={resolutionScore}
                        onChange={(e) => setResolutionScore(Number(e.target.value))}
                        className="w-full accent-slate-900"
                      />
                      <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                        <span>1 (Sin Solución)</span>
                        <span className="font-bold text-slate-900">{resolutionScore} ★</span>
                        <span>5 (Resuelto)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Comentarios o sugerencias del beneficiario
                    </label>
                    <textarea
                      rows={2}
                      value={surveyComments}
                      onChange={(e) => setSurveyComments(e.target.value)}
                      placeholder="Percepción cualitativa expresada por el usuario..."
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500">
                      ISB Calculado Preliminar:{' '}
                      <strong className="text-slate-900 font-mono tabular-nums">
                        {Math.round(((empathyScore + clarityScore + timelinessScore + resolutionScore) / 4 / 5) * 100)}%
                      </strong>
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                    >
                      Registrar Encuesta ISB
                    </button>
                  </div>
                </form>
              )}

              {/* Checklist for Final Closure */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Checklist de Verificación para Cierre de Expediente (Módulo 5)
                  </span>
                  {ticket.status === 'Cerrado' && (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                      Expediente Archivado
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        ticket.officialResponse ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <span>1. Comunicación formal emitida y debidamente notificada al beneficiario.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        ticket.technicalConcept ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <span>2. Concepto técnico formal expedido por el área de proyectos sociales.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        ticket.survey ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <span>3. Encuesta de percepción e Índice de Satisfacción del Beneficiario (ISB) registrado.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        ticket.notes.length > 0 ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <span>4. Trazabilidad completa y bitácora de eventos documentada.</span>
                  </div>
                </div>

                {ticket.status !== 'Cerrado' ? (
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Al cerrar, el expediente quedará formalmente archivado en el histórico institucional.
                    </span>
                    <button
                      type="button"
                      onClick={handleCloseTicket}
                      disabled={!ticket.officialResponse}
                      className={`px-5 py-2 text-xs font-semibold text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                        ticket.officialResponse
                          ? 'bg-emerald-700 hover:bg-emerald-800'
                          : 'bg-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Cerrar Ticket y Archivar Expediente</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-slate-600 pt-2 border-t border-slate-200">
                    Cerrado el {new Date(ticket.closedAt || '').toLocaleString('es-CO')} por {ticket.closedBy}.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
