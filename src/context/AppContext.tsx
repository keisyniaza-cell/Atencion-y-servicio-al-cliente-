import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Ticket,
  QueueTicket,
  FAQItem,
  ImprovementPlan,
  CoordinationMeeting,
  EmpathyAudit,
  RequestType,
  TicketStatus,
  SocialProjectArea,
  CitizenData,
  TechnicalConcept,
  SatisfactionSurvey,
  InternalNote,
} from '../types';
import {
  INITIAL_TICKETS,
  INITIAL_QUEUE_TICKETS,
  INITIAL_FAQS,
  INITIAL_IMPROVEMENT_PLANS,
  INITIAL_COORDINATION_MEETINGS,
  INITIAL_EMPATHY_AUDITS,
  SLA_RULES,
  PROJECT_LEADERS,
} from '../data/initialData';

interface AppContextType {
  tickets: Ticket[];
  queueTickets: QueueTicket[];
  faqs: FAQItem[];
  improvementPlans: ImprovementPlan[];
  coordinationMeetings: CoordinationMeeting[];
  empathyAudits: EmpathyAudit[];
  activeView: string;
  setActiveView: (view: string) => void;
  selectedTicket: Ticket | null;
  setSelectedTicket: (ticket: Ticket | null) => void;
  
  // Actions
  createNewTicket: (data: {
    type: RequestType;
    channel: any;
    priority: any;
    assignedProjectArea: SocialProjectArea;
    citizen: CitizenData;
    subject: string;
    description: string;
    initialNote?: string;
  }) => Ticket;
  
  updateTicketStatus: (ticketId: string, newStatus: TicketStatus, noteText?: string) => void;
  addTicketNote: (ticketId: string, note: Omit<InternalNote, 'id' | 'date'>) => void;
  addTechnicalConcept: (ticketId: string, concept: TechnicalConcept) => void;
  approveAndSendOfficialResponse: (
    ticketId: string,
    response: {
      responseText: string;
      approvedBy: string;
      channelNotified: string;
    }
  ) => void;
  recordSatisfactionSurvey: (ticketId: string, survey: Omit<SatisfactionSurvey, 'overallISB' | 'date'>) => void;
  closeTicketWithChecklist: (ticketId: string, closedBy: string) => void;
  
  // Queue Management
  generateQueueTurn: (citizenName: string, documentNumber: string, serviceType: QueueTicket['serviceType']) => QueueTicket;
  callQueueTurn: (ticketNumber: string, counterName: string) => void;
  completeQueueTurn: (ticketNumber: string) => void;
  
  // Continuous Improvement & Coordination
  addImprovementPlan: (plan: Omit<ImprovementPlan, 'id' | 'code' | 'dateIdentified'>) => void;
  addCoordinationMeeting: (meeting: Omit<CoordinationMeeting, 'id' | 'date'>) => void;
  addEmpathyAudit: (audit: Omit<EmpathyAudit, 'id' | 'date' | 'totalScore'>) => void;
  addFAQ: (faq: Omit<FAQItem, 'id' | 'lastUpdated'>) => void;

  // Helpers
  getSlaStatus: (ticket: Ticket) => {
    remainingDays: number;
    color: 'green' | 'amber' | 'red';
    label: string;
    isOverdue: boolean;
  };
  metrics: {
    totalTickets: number;
    activeTickets: number;
    closedTickets: number;
    overdueTickets: number;
    slaCompliancePercentage: number;
    averageISB: number;
    ticketsByArea: Record<string, number>;
    ticketsByType: Record<string, number>;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('somos_uno_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [queueTickets, setQueueTickets] = useState<QueueTicket[]>(() => {
    const saved = localStorage.getItem('somos_uno_queue');
    return saved ? JSON.parse(saved) : INITIAL_QUEUE_TICKETS;
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem('somos_uno_faqs');
    return saved ? JSON.parse(saved) : INITIAL_FAQS;
  });

  const [improvementPlans, setImprovementPlans] = useState<ImprovementPlan[]>(() => {
    const saved = localStorage.getItem('somos_uno_pmc');
    return saved ? JSON.parse(saved) : INITIAL_IMPROVEMENT_PLANS;
  });

  const [coordinationMeetings, setCoordinationMeetings] = useState<CoordinationMeeting[]>(() => {
    const saved = localStorage.getItem('somos_uno_meetings');
    return saved ? JSON.parse(saved) : INITIAL_COORDINATION_MEETINGS;
  });

  const [empathyAudits, setEmpathyAudits] = useState<EmpathyAudit[]>(() => {
    const saved = localStorage.getItem('somos_uno_audits');
    return saved ? JSON.parse(saved) : INITIAL_EMPATHY_AUDITS;
  });

  const [activeView, setActiveView] = useState<string>('modulo2'); // start in reception/radicación or dashboard
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('somos_uno_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('somos_uno_queue', JSON.stringify(queueTickets));
  }, [queueTickets]);

  useEffect(() => {
    localStorage.setItem('somos_uno_pmc', JSON.stringify(improvementPlans));
  }, [improvementPlans]);

  // SLA Calculation helper
  const getSlaStatus = (ticket: Ticket) => {
    const now = new Date();
    const due = new Date(ticket.dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (ticket.status === 'Cerrado') {
      return {
        remainingDays: 0,
        color: 'green' as const,
        label: 'Cerrado Oportuno',
        isOverdue: false,
      };
    }

    if (diffDays <= 0) {
      return {
        remainingDays: diffDays,
        color: 'red' as const,
        label: `Vencido (${Math.abs(diffDays)}d)`,
        isOverdue: true,
      };
    } else if (diffDays <= 4) {
      return {
        remainingDays: diffDays,
        color: 'amber' as const,
        label: `Por Vencer (${diffDays}d)`,
        isOverdue: false,
      };
    } else {
      return {
        remainingDays: diffDays,
        color: 'green' as const,
        label: `A Tiempo (${diffDays}d)`,
        isOverdue: false,
      };
    }
  };

  // Metrics computation
  const metrics = React.useMemo(() => {
    const totalTickets = tickets.length;
    const closedTickets = tickets.filter(t => t.status === 'Cerrado').length;
    const activeTickets = totalTickets - closedTickets;

    const overdueCount = tickets.filter(t => {
      if (t.status === 'Cerrado') return false;
      const due = new Date(t.dueDate);
      return due.getTime() < new Date().getTime();
    }).length;

    const compliance = totalTickets > 0 
      ? Math.round(((totalTickets - overdueCount) / totalTickets) * 100) 
      : 100;

    const ticketsWithSurvey = tickets.filter(t => t.survey && typeof t.survey.overallISB === 'number');
    const averageISB = ticketsWithSurvey.length > 0
      ? Math.round(ticketsWithSurvey.reduce((acc, curr) => acc + (curr.survey?.overallISB || 0), 0) / ticketsWithSurvey.length)
      : 92;

    const ticketsByArea: Record<string, number> = {};
    const ticketsByType: Record<string, number> = {};

    tickets.forEach(t => {
      ticketsByArea[t.assignedProjectArea] = (ticketsByArea[t.assignedProjectArea] || 0) + 1;
      ticketsByType[t.type] = (ticketsByType[t.type] || 0) + 1;
    });

    return {
      totalTickets,
      activeTickets,
      closedTickets,
      overdueTickets: overdueCount,
      slaCompliancePercentage: compliance,
      averageISB,
      ticketsByArea,
      ticketsByType,
    };
  }, [tickets]);

  // Create new ticket
  const createNewTicket = (data: {
    type: RequestType;
    channel: any;
    priority: any;
    assignedProjectArea: SocialProjectArea;
    citizen: CitizenData;
    subject: string;
    description: string;
    initialNote?: string;
  }): Ticket => {
    const radNumber = `SOMOS-2026-${String(tickets.length + 47).padStart(4, '0')}`;
    const legalDays = SLA_RULES[data.type]?.legalDays || 15;
    
    // Calculate due date (adding days)
    const created = new Date();
    const due = new Date(created);
    due.setDate(due.getDate() + legalDays);

    const leader = PROJECT_LEADERS[data.assignedProjectArea]?.leader || 'Coordinación Social';

    const newTicket: Ticket = {
      id: `t-${Date.now()}`,
      radicadoNumber: radNumber,
      createdAt: created.toISOString(),
      dueDate: due.toISOString(),
      legalSlaDays: legalDays,
      type: data.type,
      channel: data.channel,
      priority: data.priority,
      assignedProjectArea: data.assignedProjectArea,
      assignedCoordinator: leader,
      citizen: data.citizen,
      subject: data.subject,
      description: data.description,
      status: 'Radicado',
      closureVerificationChecked: false,
      notes: [
        {
          id: `n-${Date.now()}`,
          date: new Date().toISOString(),
          author: 'Sistema de Radicación Somos Uno',
          role: `Canal ${data.channel}`,
          content: data.initialNote || `Radicación formal efectuada exitosamente. Se asigna tiempo normativo de SLA: ${legalDays} días hábiles según normatividad vigente. Remitido para trámite a ${data.assignedProjectArea}.`,
        },
      ],
    };

    setTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, newStatus: TicketStatus, noteText?: string) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const updatedNotes = [...t.notes];
          if (noteText) {
            updatedNotes.push({
              id: `n-${Date.now()}`,
              date: new Date().toISOString(),
              author: 'Gestor del Proceso',
              role: 'Servicio al Cliente',
              content: noteText,
            });
          }
          return {
            ...t,
            status: newStatus,
            notes: updatedNotes,
          };
        }
        return t;
      })
    );
  };

  const addTicketNote = (ticketId: string, note: Omit<InternalNote, 'id' | 'date'>) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            notes: [
              ...t.notes,
              {
                ...note,
                id: `n-${Date.now()}`,
                date: new Date().toISOString(),
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const addTechnicalConcept = (ticketId: string, concept: TechnicalConcept) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'Concepto Emitido',
            technicalConcept: concept,
            notes: [
              ...t.notes,
              {
                id: `n-${Date.now()}`,
                date: new Date().toISOString(),
                author: concept.leaderName,
                role: `Líder Técnico - ${concept.area}`,
                content: `Concepto emitido [${concept.decision}]: ${concept.technicalJustification}. Acciones recomendadas: ${concept.actionsSuggested}`,
                isTechnicalConcept: true,
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const approveAndSendOfficialResponse = (
    ticketId: string,
    response: {
      responseText: string;
      approvedBy: string;
      channelNotified: string;
    }
  ) => {
    const deliveryCode = `NOTIF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'Respuesta Notificada',
            officialResponse: {
              approvedAt: new Date().toISOString(),
              approvedBy: response.approvedBy,
              responseText: response.responseText,
              channelNotified: response.channelNotified,
              notificationDate: new Date().toISOString(),
              deliveryProofCode: deliveryCode,
            },
            notes: [
              ...t.notes,
              {
                id: `n-${Date.now()}`,
                date: new Date().toISOString(),
                author: response.approvedBy,
                role: 'Validación de Respuesta Institucional',
                content: `Respuesta oficial validada y notificada formalmente al beneficiario vía ${response.channelNotified}. Código de entrega legal: ${deliveryCode}.`,
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const recordSatisfactionSurvey = (
    ticketId: string,
    survey: Omit<SatisfactionSurvey, 'overallISB' | 'date'>
  ) => {
    // ISB calculation: average of the 4 dimensions converted to 0-100%
    const avgScore = (survey.empathyScore + survey.clarityScore + survey.timelinessScore + survey.effectiveResolutionScore) / 4;
    const isbPercentage = Math.round((avgScore / 5) * 100);

    const completedSurvey: SatisfactionSurvey = {
      ...survey,
      date: new Date().toISOString().split('T')[0],
      overallISB: isbPercentage,
    };

    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            survey: completedSurvey,
            notes: [
              ...t.notes,
              {
                id: `n-${Date.now()}`,
                date: new Date().toISOString(),
                author: survey.appliedBy,
                role: 'Módulo 5 - Evaluación de Satisfacción',
                content: `Encuesta de satisfacción aplicada con éxito. Índice de Satisfacción del Beneficiario (ISB) obtenido: ${isbPercentage}%. Dimensiones evaluadas: Empatía (${survey.empathyScore}/5), Claridad (${survey.clarityScore}/5), Tiempo (${survey.timelinessScore}/5), Solución (${survey.effectiveResolutionScore}/5).`,
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const closeTicketWithChecklist = (ticketId: string, closedBy: string) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'Cerrado',
            closedAt: new Date().toISOString(),
            closedBy,
            closureVerificationChecked: true,
            notes: [
              ...t.notes,
              {
                id: `n-${Date.now()}`,
                date: new Date().toISOString(),
                author: closedBy,
                role: 'Cierre y Archivo de Expediente',
                content: `Cierre formal verificado: Requerimiento respondido oportunamente, constancia de notificación archivada, encuesta ISB registrada y expediente digital cerrado en cumplimiento del Módulo 5.`,
              },
            ],
          };
        }
        return t;
      })
    );
  };

  // Queue actions
  const generateQueueTurn = (
    citizenName: string,
    documentNumber: string,
    serviceType: QueueTicket['serviceType']
  ): QueueTicket => {
    const prefix = serviceType.includes('Prioritaria') ? 'A' : serviceType.includes('Radicación') ? 'B' : 'C';
    const nextNum = queueTickets.length + 1;
    const ticketCode = `${prefix}-${String(nextNum).padStart(3, '0')}`;

    const newQueueItem: QueueTicket = {
      ticketNumber: ticketCode,
      citizenName,
      documentNumber,
      serviceType,
      status: 'En Espera',
      createdAt: new Date().toISOString(),
    };

    setQueueTickets(prev => [...prev, newQueueItem]);
    return newQueueItem;
  };

  const callQueueTurn = (ticketNumber: string, counterName: string) => {
    setQueueTickets(prev =>
      prev.map(q =>
        q.ticketNumber === ticketNumber
          ? { ...q, status: 'Llamando', counterAssigned: counterName, calledAt: new Date().toISOString() }
          : q
      )
    );
  };

  const completeQueueTurn = (ticketNumber: string) => {
    setQueueTickets(prev =>
      prev.map(q =>
        q.ticketNumber === ticketNumber ? { ...q, status: 'Atendido' } : q
      )
    );
  };

  // PMC & Audits
  const addImprovementPlan = (plan: Omit<ImprovementPlan, 'id' | 'code' | 'dateIdentified'>) => {
    const code = `PMC-2026-${String(improvementPlans.length + 1).padStart(3, '0')}`;
    const newPlan: ImprovementPlan = {
      ...plan,
      id: `pmc-${Date.now()}`,
      code,
      dateIdentified: new Date().toISOString().split('T')[0],
    };
    setImprovementPlans(prev => [newPlan, ...prev]);
  };

  const addCoordinationMeeting = (meeting: Omit<CoordinationMeeting, 'id' | 'date'>) => {
    const newMeeting: CoordinationMeeting = {
      ...meeting,
      id: `com-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setCoordinationMeetings(prev => [newMeeting, ...prev]);
  };

  const addEmpathyAudit = (audit: Omit<EmpathyAudit, 'id' | 'date' | 'totalScore'>) => {
    const total = audit.greetingAndEmpathyScore + audit.activeListeningScore + audit.clearPlainLanguageScore + audit.conflictDeescalationScore;
    const newAudit: EmpathyAudit = {
      ...audit,
      id: `aud-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      totalScore: total,
    };
    setEmpathyAudits(prev => [newAudit, ...prev]);
  };

  const addFAQ = (faq: Omit<FAQItem, 'id' | 'lastUpdated'>) => {
    const newFAQ: FAQItem = {
      ...faq,
      id: `faq-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setFaqs(prev => [newFAQ, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        tickets,
        queueTickets,
        faqs,
        improvementPlans,
        coordinationMeetings,
        empathyAudits,
        activeView,
        setActiveView,
        selectedTicket,
        setSelectedTicket,
        createNewTicket,
        updateTicketStatus,
        addTicketNote,
        addTechnicalConcept,
        approveAndSendOfficialResponse,
        recordSatisfactionSurvey,
        closeTicketWithChecklist,
        generateQueueTurn,
        callQueueTurn,
        completeQueueTurn,
        addImprovementPlan,
        addCoordinationMeeting,
        addEmpathyAudit,
        addFAQ,
        getSlaStatus,
        metrics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
