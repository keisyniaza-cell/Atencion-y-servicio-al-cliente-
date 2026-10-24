import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RequestType, EntryChannel, SocialProjectArea, CitizenData, Ticket } from '../types';
import { SLA_RULES, PROJECT_LEADERS } from '../data/initialData';
import { X, CheckCircle, Printer, FileText, AlertCircle } from 'lucide-react';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({ isOpen, onClose }) => {
  const { createNewTicket } = useApp();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);

  // Form states
  const [type, setType] = useState<RequestType>('Petición');
  const [channel, setChannel] = useState<EntryChannel>('Presencial');
  const [priority, setPriority] = useState<any>('Normal');
  const [assignedProjectArea, setAssignedProjectArea] = useState<SocialProjectArea>('Nutrición y Seguridad Alimentaria');

  const [citizen, setCitizen] = useState<CitizenData>({
    fullName: '',
    documentType: 'Cédula de Ciudadanía',
    documentNumber: '',
    phone: '',
    email: '',
    address: '',
    neighborhoodOrVereda: '',
    isVulnerablePopulation: false,
    vulnerabilityType: 'General',
  });

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [initialNote, setInitialNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizen.fullName || !citizen.documentNumber || !subject || !description) {
      alert('Por favor complete los campos obligatorios del ciudadano y el requerimiento.');
      return;
    }

    const ticket = createNewTicket({
      type,
      channel,
      priority,
      assignedProjectArea,
      citizen,
      subject,
      description,
      initialNote,
    });

    setCreatedTicket(ticket);
    setStep('success');
  };

  const handleReset = () => {
    setStep('form');
    setCreatedTicket(null);
    setSubject('');
    setDescription('');
    setInitialNote('');
    setCitizen({
      fullName: '',
      documentType: 'Cédula de Ciudadanía',
      documentNumber: '',
      phone: '',
      email: '',
      address: '',
      neighborhoodOrVereda: '',
      isVulnerablePopulation: false,
      vulnerabilityType: 'General',
    });
    onClose();
  };

  const slaInfo = SLA_RULES[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full my-8 overflow-hidden text-slate-800">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {step === 'form' ? 'Radicación Formal de Requerimiento / PQRS' : 'Comprobante Oficial de Radicación'}
            </h2>
            <p className="text-xs text-slate-500">
              Corporación Social Somos Uno · Proceso de Atención al Ciudadano
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Step 1: Clasificación del Requerimiento & SLA */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
                01. Clasificación del Requerimiento & Tiempos Legales
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Tipo de Solicitud *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as RequestType)}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="Petición">Petición (Interés General / Particular)</option>
                    <option value="Queja">Queja (Conducta o trato del personal)</option>
                    <option value="Reclamo">Reclamo (Falla en el servicio o programa)</option>
                    <option value="Sugerencia">Sugerencia (Propuesta de mejora)</option>
                    <option value="Consulta de Información">Consulta de Información / Requisitos</option>
                    <option value="Trámite Social">Trámite Social (Documentación / Cupo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Canal de Recepción *
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as EntryChannel)}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="Presencial">Presencial (Ventanilla de Sede)</option>
                    <option value="Telefónico">Telefónico (Línea de Atención)</option>
                    <option value="Portal Digital">Portal Web Ciudadano</option>
                    <option value="WhatsApp / Mensajería">WhatsApp Institucional</option>
                    <option value="Comunitario en Territorio">Jornada en Territorio / Veredal</option>
                  </select>
                </div>
              </div>

              {/* Informative SLA badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-900">SLA Normativo Asignado: </span>
                  <span className="tabular-nums font-medium text-emerald-800">{slaInfo.legalDays} días hábiles</span>
                  <span className="block text-slate-500 mt-0.5">{slaInfo.description}</span>
                </div>
              </div>
            </div>

            {/* Step 2: Remisión a Área de Proyecto Social */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
                02. Articulación Operativa con Proyecto Social
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Proyecto Social Involucrado *
                  </label>
                  <select
                    value={assignedProjectArea}
                    onChange={(e) => setAssignedProjectArea(e.target.value as SocialProjectArea)}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="Nutrición y Seguridad Alimentaria">Nutrición y Seguridad Alimentaria</option>
                    <option value="Vivienda y Mejoramiento Comunitario">Vivienda y Mejoramiento Comunitario</option>
                    <option value="Empleabilidad y Emprendimiento">Empleabilidad y Emprendimiento</option>
                    <option value="Atención Integral al Adulto Mayor">Atención Integral al Adulto Mayor</option>
                    <option value="Primera Infancia y Educación">Primera Infancia y Educación</option>
                    <option value="Dirección y Asuntos Jurídicos">Dirección y Asuntos Jurídicos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Coordinador Técnico Responsable
                  </label>
                  <input
                    type="text"
                    disabled
                    value={PROJECT_LEADERS[assignedProjectArea]?.leader}
                    className="w-full text-sm bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Datos del Beneficiario / Ciudadano */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
                03. Identificación del Beneficiario / Ciudadano
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Nombre Completo del Beneficiario *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carmen Rosa Pérez"
                    value={citizen.fullName}
                    onChange={(e) => setCitizen({ ...citizen, fullName: e.target.value })}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Tipo</label>
                    <select
                      value={citizen.documentType}
                      onChange={(e) => setCitizen({ ...citizen, documentType: e.target.value as any })}
                      className="w-full text-sm bg-white border border-slate-300 rounded-lg px-2 py-2"
                    >
                      <option value="Cédula de Ciudadanía">CC</option>
                      <option value="Tarjeta de Identidad">TI</option>
                      <option value="Cédula de Extranjería">CE</option>
                      <option value="Permiso por Protección Temporal (PPT)">PPT</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Número de Documento *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 1023456789"
                      value={citizen.documentNumber}
                      onChange={(e) => setCitizen({ ...citizen, documentNumber: e.target.value })}
                      className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono de Contacto *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 312 345 6789"
                    value={citizen.phone}
                    onChange={(e) => setCitizen({ ...citizen, phone: e.target.value })}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Correo Electrónico (Opcional)</label>
                  <input
                    type="email"
                    placeholder="beneficiario@email.com"
                    value={citizen.email || ''}
                    onChange={(e) => setCitizen({ ...citizen, email: e.target.value })}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Barrio o Vereda</label>
                  <input
                    type="text"
                    placeholder="Ej. Comuna 3 / Vereda El Salado"
                    value={citizen.neighborhoodOrVereda}
                    onChange={(e) => setCitizen({ ...citizen, neighborhoodOrVereda: e.target.value })}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Enfoque Poblacional Prioritario</label>
                  <select
                    value={citizen.vulnerabilityType || 'General'}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setCitizen({
                        ...citizen,
                        vulnerabilityType: val,
                        isVulnerablePopulation: val !== 'General',
                      });
                      if (val !== 'General') {
                        setPriority('Alta (Población Vulnerable)');
                      }
                    }}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="General">Población General</option>
                    <option value="Adulto Mayor">Adulto Mayor (Prioridad Alta)</option>
                    <option value="Madre Cabeza de Hogar">Madre Cabeza de Hogar</option>
                    <option value="Persona con Discapacidad">Persona con Discapacidad</option>
                    <option value="Víctima del Conflicto">Víctima del Conflicto</option>
                    <option value="Comunidad Étnica">Comunidad Étnica / Indígena</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 4: Detalle del Requerimiento */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="text-xs font-semibold text-slate-700 tracking-wider uppercase">
                04. Detalle y Fundamento de la Solicitud
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Asunto Resumido *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Inconformidad por retiro de beneficio en comedor comunitario"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Descripción Detallada de los Hechos *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describa con claridad los hechos, fechas, personas involucradas y la solicitud concreta del beneficiario..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Observación Inicial de Recepción / Escucha Empática
                </label>
                <input
                  type="text"
                  placeholder="Ej. El ciudadano se acoge con calidez, se valida documento físico y se orienta sobre tiempos de trámite."
                  value={initialNote}
                  onChange={(e) => setInitialNote(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-600"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Radicar y Generar Ticket Oficial
              </button>
            </div>
          </form>
        ) : (
          /* Success Receipt Step (Printable) */
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Radicación Exitosa</h3>
              <p className="text-xs text-slate-500">
                El requerimiento ha sido registrado en el sistema centralizado de Somos Uno.
              </p>
            </div>

            {createdTicket && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs text-slate-500">Número de Radicado:</span>
                    <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
                      {createdTicket.radicadoNumber}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500">Fecha y Hora Legal:</span>
                    <div className="text-xs font-medium text-slate-800">
                      {new Date(createdTicket.createdAt).toLocaleDateString('es-CO')} · {new Date(createdTicket.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Beneficiario:</span>
                    <p className="font-semibold text-slate-900">{createdTicket.citizen.fullName}</p>
                    <p className="text-slate-600 font-mono tabular-nums">{createdTicket.citizen.documentType} {createdTicket.citizen.documentNumber}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Tipo de Trámite:</span>
                    <p className="font-semibold text-slate-900">{createdTicket.type}</p>
                    <p className="text-slate-600">{createdTicket.assignedProjectArea}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Tiempo Legal de Respuesta:</span>
                    <p className="font-semibold text-emerald-800">{createdTicket.legalSlaDays} días hábiles</p>
                    <p className="text-slate-500 text-[11px]">
                      Vencimiento: {new Date(createdTicket.dueDate).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Canal Asignado:</span>
                    <p className="font-semibold text-slate-900">{createdTicket.channel}</p>
                    <p className="text-slate-500 text-[11px]">Coordinador: {createdTicket.assignedCoordinator}</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 text-xs">
                  <span className="text-slate-500">Asunto:</span>
                  <p className="font-medium text-slate-800 mt-0.5">{createdTicket.subject}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded p-3 text-[11px] text-slate-500 space-y-1">
                  <p className="font-semibold text-slate-700">Información para el Beneficiario:</p>
                  <p>
                    Puede consultar el avance de su solicitud en cualquier momento en el <strong>Portal Ciudadano Somos Uno</strong> ingresando su número de radicado (<span className="font-mono">{createdTicket.radicadoNumber}</span>) o su documento de identidad.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4" />
                Imprimir Comprobante de Radicación
              </button>

              <button
                onClick={handleReset}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
              >
                Finalizar y Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
