export type RequestType = 
  | 'Petición' 
  | 'Queja' 
  | 'Reclamo' 
  | 'Sugerencia' 
  | 'Consulta de Información' 
  | 'Trámite Social';

export type TicketStatus = 
  | 'Radicado' 
  | 'En Trámite Técnico' 
  | 'Concepto Emitido' 
  | 'Respuesta en Validación' 
  | 'Respuesta Notificada' 
  | 'Cerrado';

export type TicketPriority = 'Alta (Población Vulnerable)' | 'Media' | 'Normal';

export type EntryChannel = 'Presencial' | 'Telefónico' | 'Portal Digital' | 'WhatsApp / Mensajería' | 'Comunitario en Territorio';

export type SocialProjectArea = 
  | 'Nutrición y Seguridad Alimentaria'
  | 'Vivienda y Mejoramiento Comunitario'
  | 'Empleabilidad y Emprendimiento'
  | 'Atención Integral al Adulto Mayor'
  | 'Primera Infancia y Educación'
  | 'Dirección y Asuntos Jurídicos';

export interface CitizenData {
  fullName: string;
  documentType: 'Cédula de Ciudadanía' | 'Tarjeta de Identidad' | 'Cédula de Extranjería' | 'Permiso por Protección Temporal (PPT)' | 'Otro';
  documentNumber: string;
  phone: string;
  email?: string;
  address: string;
  neighborhoodOrVereda: string;
  isVulnerablePopulation: boolean;
  vulnerabilityType?: 'Adulto Mayor' | 'Madre Cabeza de Hogar' | 'Persona con Discapacidad' | 'Víctima del Conflicto' | 'Comunidad Étnica' | 'General';
}

export interface InternalNote {
  id: string;
  date: string;
  author: string;
  role: string;
  content: string;
  isTechnicalConcept?: boolean;
}

export interface TechnicalConcept {
  leaderName: string;
  area: SocialProjectArea;
  date: string;
  decision: 'Favorable / Aprobado' | 'En Verificación de Campo' | 'Requiere Subsanación de Requisitos' | 'No Favorable Justificado';
  technicalJustification: string;
  actionsSuggested: string;
  attachments?: string[];
}

export interface SatisfactionSurvey {
  date: string;
  appliedBy: string;
  empathyScore: number; // 1 to 5
  clarityScore: number; // 1 to 5
  timelinessScore: number; // 1 to 5
  effectiveResolutionScore: number; // 1 to 5
  overallISB: number; // calculated 0 to 100%
  feedbackComments?: string;
}

export interface Ticket {
  id: string;
  radicadoNumber: string; // e.g., SOMOS-2026-0045
  createdAt: string;
  dueDate: string;
  legalSlaDays: number;
  type: RequestType;
  channel: EntryChannel;
  priority: TicketPriority;
  assignedProjectArea: SocialProjectArea;
  assignedCoordinator: string;
  citizen: CitizenData;
  subject: string;
  description: string;
  status: TicketStatus;
  technicalConcept?: TechnicalConcept;
  officialResponse?: {
    approvedAt: string;
    approvedBy: string;
    responseText: string;
    channelNotified: string;
    notificationDate: string;
    deliveryProofCode: string;
  };
  survey?: SatisfactionSurvey;
  closedAt?: string;
  closedBy?: string;
  closureVerificationChecked: boolean;
  notes: InternalNote[];
}

export interface QueueTicket {
  ticketNumber: string; // e.g., A-012, B-005
  citizenName: string;
  documentNumber: string;
  serviceType: 'Radicación PQRS' | 'Orientación Convocatorias' | 'Atención Prioritaria (Adulto Mayor)' | 'Consulta de Estado';
  counterAssigned?: string;
  status: 'En Espera' | 'Llamando' | 'Atendido';
  createdAt: string;
  calledAt?: string;
}

export interface FAQItem {
  id: string;
  category: SocialProjectArea | 'General';
  question: string;
  answer: string;
  requirements: string[];
  lastUpdated: string;
  officialNoticeUrl?: string;
}

export interface ImprovementPlan {
  id: string;
  code: string; // e.g., PMC-2026-01
  dateIdentified: string;
  detectedProblem: string;
  rootCause: string;
  affectedArea: SocialProjectArea;
  correctiveAction: string;
  preventiveAction: string;
  responsible: string;
  deadline: string;
  status: 'En Implementación' | 'Verificado Eficaz' | 'Pendiente';
  kpiTarget: string;
}

export interface CoordinationMeeting {
  id: string;
  date: string;
  title: string;
  participants: string[];
  criticalTicketsReviewed: string[]; // radicado numbers
  agreements: string[];
  nextMeetingDate: string;
  coordinatorSign: string;
}

export interface EmpathyAudit {
  id: string;
  date: string;
  agentEvaluated: string;
  auditor: string;
  greetingAndEmpathyScore: number; // 0-25
  activeListeningScore: number; // 0-25
  clearPlainLanguageScore: number; // 0-25
  conflictDeescalationScore: number; // 0-25
  totalScore: number; // 0-100
  feedback: string;
  ticketReviewedRadicado?: string;
}

export interface ProcessCharacterizationStep {
  phvaStage: 'PLANIFICAR' | 'HACER' | 'VERIFICAR' | 'ACTUAR';
  moduleNumber: 1 | 2 | 3 | 4 | 5 | 6;
  moduleName: string;
  provider: string;
  inputs: string[];
  stepActivities: string[];
  outputs: string[];
  customerOrRecipient: string;
}
