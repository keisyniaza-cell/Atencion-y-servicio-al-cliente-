import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Calendar, Plus, CheckCircle2, Clock, FileText, AlertCircle } from 'lucide-react';

export const ComiteCoordinacion: React.FC = () => {
  const { coordinationMeetings, addCoordinationMeeting, tickets, setSelectedTicket } = useApp();

  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('Comité Semanal de Seguimiento No. ' + (coordinationMeetings.length + 15));
  const [participantsInput, setParticipantsInput] = useState('Patricia Salcedo (Servicio), Dra. Carmen Valencia (Nutrición), Ing. Rodrigo Mendoza (Vivienda), Geront. Martha Ospina (Adulto Mayor)');
  const [ticketsInput, setTicketsInput] = useState('SOMOS-2026-0038, SOMOS-2026-0046');
  const [agreementsInput, setAgreementsInput] = useState('Revisión prioritaria de cupos para madres comunitarias en CDI. Validación en terreno de 5 expedientes de techos en la vereda El Manantial.');
  const [nextDate, setNextDate] = useState('2026-11-04');

  // Critical cases requiring discussion
  const criticalCases = tickets.filter(
    (t) => (!t.technicalConcept || t.status === 'En Trámite Técnico') && t.status !== 'Cerrado'
  );

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = participantsInput.split(',').map((p) => p.trim());
    const rads = ticketsInput.split(',').map((r) => r.trim());
    const agrs = agreementsInput.split('.').map((a) => a.trim()).filter(Boolean);

    addCoordinationMeeting({
      title: meetingTitle,
      participants: parts,
      criticalTicketsReviewed: rads,
      agreements: agrs,
      nextMeetingDate: nextDate,
      coordinatorSign: 'Patricia Salcedo H. (Coordinadora Servicio al Cliente)',
    });

    setShowNewMeetingForm(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              Solución al Problema 5 del Diagnóstico Operativo
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Comité Semanal de Coordinación y Articulación Inter-Áreas
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Canal directo y formal de comunicación entre el equipo de Servicio al Cliente y los coordinadores de los proyectos sociales de Somos Uno para revisar casos críticos, destrabar trámites pendientes y unificar conceptos técnicos.
            </p>
          </div>

          <button
            onClick={() => setShowNewMeetingForm(!showNewMeetingForm)}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{showNewMeetingForm ? 'Cancelar' : '+ Registrar Acta de Comité'}</span>
          </button>
        </div>
      </div>

      {/* Critical Cases Strip */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-800 shrink-0" />
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Casos en Agenda Recomendada para el Próximo Comité ({criticalCases.length} Casos Abiertos)
          </h3>
        </div>
        <p className="text-xs text-amber-800">
          Requerimientos en trámite técnico que requieren concepto formal o acuerdo inter-disciplinario urgente para evitar vencimientos de SLA:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {criticalCases.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedTicket(c)}
              className="bg-white border border-amber-200/80 p-3 rounded-lg text-xs space-y-1 hover:border-amber-400 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-slate-900">{c.radicadoNumber}</span>
                <span className="text-[11px] text-amber-800 font-medium">{c.assignedProjectArea}</span>
              </div>
              <div className="font-semibold text-slate-800">{c.citizen.fullName}</div>
              <p className="text-slate-600 line-clamp-1">{c.subject}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form for new coordination meeting */}
      {showNewMeetingForm && (
        <form
          onSubmit={handleCreateMeeting}
          className="bg-white border-2 border-slate-900 rounded-xl p-6 space-y-4 shadow-md"
        >
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Registrar Nueva Acta de Comité Semanal de Coordinación
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Fecha: {new Date().toLocaleDateString('es-CO')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Título de la Sesión *</label>
              <input
                type="text"
                required
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Próxima Sesión Programada *</label>
              <input
                type="date"
                required
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-medium text-slate-700 mb-1">
              Participantes Asistentes (separados por coma) *
            </label>
            <input
              type="text"
              required
              value={participantsInput}
              onChange={(e) => setParticipantsInput(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5"
            />
          </div>

          <div className="text-xs">
            <label className="block font-medium text-slate-700 mb-1">
              Radicados Revisados en Mesa (separados por coma) *
            </label>
            <input
              type="text"
              required
              value={ticketsInput}
              onChange={(e) => setTicketsInput(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 font-mono"
            />
          </div>

          <div className="text-xs">
            <label className="block font-medium text-slate-700 mb-1">
              Acuerdos, Plazos y Compromisos Inter-áreas Pactados *
            </label>
            <textarea
              required
              rows={3}
              value={agreementsInput}
              onChange={(e) => setAgreementsInput(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowNewMeetingForm(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              Firmar y Archivar Acta
            </button>
          </div>
        </form>
      )}

      {/* List of Registered Meetings */}
      <div className="space-y-4">
        {coordinationMeetings.map((m) => (
          <div
            key={m.id}
            className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  Sesión realizada el: {m.date} · Próxima reunión: {m.nextMeetingDate}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Acta en Firme</span>
              </div>
            </div>

            {/* Participants */}
            <div className="text-xs">
              <span className="font-semibold text-slate-700 block mb-1">
                Líderes y Coordinadores Participantes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {m.participants.map((p, i) => (
                  <span
                    key={i}
                    className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[11px]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviewed Radicados */}
            <div className="text-xs">
              <span className="font-semibold text-slate-700 block mb-1">
                Expedientes Críticos Descongestionados:
              </span>
              <div className="flex flex-wrap gap-2">
                {m.criticalTicketsReviewed.map((rad, i) => (
                  <span
                    key={i}
                    className="font-mono font-bold text-slate-800 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[11px]"
                  >
                    {rad}
                  </span>
                ))}
              </div>
            </div>

            {/* Agreements */}
            <div className="text-xs bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block">
                Acuerdos y Compromisos Vinculantes:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {m.agreements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>

            <div className="text-[11px] text-slate-500 pt-1 text-right italic">
              Validado por: {m.coordinatorSign}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
