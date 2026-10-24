import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket, RequestType, TicketStatus } from '../../types';
import { Search, Filter, Plus, Clock, Eye, AlertTriangle } from 'lucide-react';

export const Modulo2Radicacion: React.FC<{ onOpenNewModal: () => void }> = ({ onOpenNewModal }) => {
  const { tickets, getSlaStatus, setSelectedTicket } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSla, setSelectedSla] = useState<'all' | 'green' | 'amber' | 'red'>('all');

  const filteredTickets = tickets.filter((t) => {
    // Search
    const matchSearch =
      t.radicadoNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.citizen.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.citizen.documentNumber.includes(searchTerm) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase());

    // Type filter
    const matchType = selectedType === 'all' || t.type === selectedType;

    // Status filter
    const matchStatus = selectedStatus === 'all' || t.status === selectedStatus;

    // SLA filter
    const sla = getSlaStatus(t);
    const matchSla = selectedSla === 'all' || sla.color === selectedSla;

    return matchSearch && matchType && matchStatus && matchSla;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              Etapa PHVA: Hacer · Módulo 2
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Recepción, Orientación y Radicación Centralizada
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Sistema unificado de radicación de requerimientos ciudadanos. Garantiza acogida al usuario, tipificación oportuna y control riguroso de vencimientos según normatividad vigente.
            </p>
          </div>
          <button
            onClick={onOpenNewModal}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 cursor-pointer transition-colors shadow-sm self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Radicar Requerimiento</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por radicado (SOMOS-2026-...), nombre o cédula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          {/* Filter by Type */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            >
              <option value="all">Todas las Tipologías</option>
              <option value="Petición">Petición</option>
              <option value="Queja">Queja</option>
              <option value="Reclamo">Reclamo</option>
              <option value="Sugerencia">Sugerencia</option>
              <option value="Consulta de Información">Consulta de Información</option>
              <option value="Trámite Social">Trámite Social</option>
            </select>
          </div>

          {/* Filter by Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            >
              <option value="all">Todos los Estados</option>
              <option value="Radicado">Radicado</option>
              <option value="En Trámite Técnico">En Trámite Técnico</option>
              <option value="Concepto Emitido">Concepto Emitido</option>
              <option value="Respuesta Notificada">Respuesta Notificada</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>
        </div>

        {/* SLA Segmented Filter Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">Semáforo SLA:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedSla('all')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                selectedSla === 'all'
                  ? 'bg-slate-900 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({tickets.length})
            </button>
            <button
              onClick={() => setSelectedSla('green')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                selectedSla === 'green'
                  ? 'bg-emerald-800 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              A Tiempo
            </button>
            <button
              onClick={() => setSelectedSla('amber')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                selectedSla === 'amber'
                  ? 'bg-amber-700 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Por Vencer (&le; 4 días)
            </button>
            <button
              onClick={() => setSelectedSla('red')}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                selectedSla === 'red'
                  ? 'bg-rose-700 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Vencidos
            </button>
          </div>
        </div>
      </div>

      {/* Table of Radicados */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-5">Radicado & Fecha</th>
                <th className="py-3 px-5">Beneficiario / Documento</th>
                <th className="py-3 px-5">Tipología & Asunto</th>
                <th className="py-3 px-5">Proyecto Social</th>
                <th className="py-3 px-5">SLA / Vencimiento</th>
                <th className="py-3 px-5">Estado PHVA</th>
                <th className="py-3 px-5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => {
                  const sla = getSlaStatus(ticket);
                  return (
                    <tr
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      {/* Radicado */}
                      <td className="py-3 px-5">
                        <div className="font-mono font-bold text-slate-900 tabular-nums">
                          {ticket.radicadoNumber}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          {new Date(ticket.createdAt).toLocaleDateString('es-CO')} · {ticket.channel}
                        </div>
                      </td>

                      {/* Citizen */}
                      <td className="py-3 px-5">
                        <div className="font-semibold text-slate-900">
                          {ticket.citizen.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          {ticket.citizen.documentNumber}
                          {ticket.citizen.isVulnerablePopulation && (
                            <span className="text-amber-800 ml-1">· Prioritario</span>
                          )}
                        </div>
                      </td>

                      {/* Tipología & Subject */}
                      <td className="py-3 px-5 max-w-xs">
                        <div className="font-medium text-slate-800">
                          {ticket.type}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate" title={ticket.subject}>
                          {ticket.subject}
                        </div>
                      </td>

                      {/* Proyecto Social */}
                      <td className="py-3 px-5">
                        <div className="font-medium text-slate-800 text-[11px]">
                          {ticket.assignedProjectArea}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {ticket.assignedCoordinator}
                        </div>
                      </td>

                      {/* SLA */}
                      <td className="py-3 px-5 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${
                            sla.color === 'green'
                              ? 'bg-emerald-50 text-emerald-800'
                              : sla.color === 'amber'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-rose-50 text-rose-800'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{sla.label}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-mono tabular-nums">
                          Límite: {new Date(ticket.dueDate).toLocaleDateString('es-CO')}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-5 whitespace-nowrap">
                        <span className="font-medium text-slate-800">
                          {ticket.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(ticket);
                          }}
                          className="px-2.5 py-1 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Expediente</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No se encontraron requerimientos con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
