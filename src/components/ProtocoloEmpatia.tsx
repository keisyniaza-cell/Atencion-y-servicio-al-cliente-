import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HeartHandshake, Shield, Sparkles, CheckCircle2, Award, BookOpen, AlertCircle, Play } from 'lucide-react';

export const ProtocoloEmpatia: React.FC = () => {
  const { empathyAudits, addEmpathyAudit } = useApp();

  const [activeTab, setActiveTab] = useState<'manual' | 'simulator' | 'audits'>('manual');

  // Simulator State
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [chosenOption, setChosenOption] = useState<number | null>(null);
  const [simulatorFeedback, setSimulatorFeedback] = useState<string | null>(null);

  // New Audit State
  const [showAuditForm, setShowAuditForm] = useState(false);
  const [agentEvaluated, setAgentEvaluated] = useState('Julian Restrepo (Ventanilla 2)');
  const [auditor, setAuditor] = useState('Patricia Salcedo (Coordinadora)');
  const [scoreEmpathy, setScoreEmpathy] = useState(25);
  const [scoreListening, setScoreListening] = useState(24);
  const [scoreLanguage, setScoreLanguage] = useState(24);
  const [scoreDeescalation, setScoreDeescalation] = useState(23);
  const [auditFeedback, setAuditFeedback] = useState('');
  const [ticketReviewed, setTicketReviewed] = useState('SOMOS-2026-0038');

  const scenarios = [
    {
      title: 'Caso 1: Beneficiaria adulta mayor alterada por exclusión en ración de comedor',
      context: 'Doña Esther (72 años) llega a la taquilla muy disgustada, levantando la voz porque no le entregaron el almuerzo en el comedor comunitario y dice que "en Somos Uno solo engañan a los pobres".',
      options: [
        {
          text: 'Pedirle enérgicamente que se calme o llamar a seguridad para que no altere la sala de espera.',
          isOptimal: false,
          feedback: 'Incorrecto. Vulnera el principio de dignidad y empatía. Incrementar la hostilidad empeora la crisis y aísla a una adulta mayor vulnerable.',
        },
        {
          text: 'Interrumpirla de inmediato para pedirle la cédula y decirle que revise el reglamento en la cartelera.',
          isOptimal: false,
          feedback: 'Insuficiente. Corta la expresión emocional antes de que la persona se sienta escuchada, generando mayor frustración.',
        },
        {
          text: 'Invitarla cordialmente a tomar asiento, ofrecerle un vaso con agua, escuchar su molestia sin interrumpir, validar su sentir ("Entiendo su angustia, doña Esther, y le aseguro que revisaremos su caso de inmediato") y tramitar su verificación.',
          isOptimal: true,
          feedback: '¡Excelente! Aplica el principio de Acogida Cálida, Escucha Activa y Técnica LAST. La validación emocional desarma el conflicto y abre camino a la solución.',
        },
      ],
    },
    {
      title: 'Caso 2: Usuario que exige respuesta inmediata a un trámite de subsidio habitacional',
      context: 'Un padre de familia lleva 5 minutos en ventanilla y golpea el mostrador diciendo que la ley dice que le deben resolver ya mismo o interpondrá una tutela.',
      options: [
        {
          text: 'Discutir sobre el Código de Procedimiento Administrativo y decirle que tiene que esperar los 15 días hábiles que marca la ley.',
          isOptimal: false,
          feedback: 'Incorrecto. El uso confrontativo de tecnicismos legales solo profundiza la desconfianza institucional.',
        },
        {
          text: 'Mantener un tono de voz sereno y pausado, agradecerle que acuda a la corporación, explicarle con calidez el trámite de campo que realiza el equipo de ingenieros para proteger la seguridad de su familia, y entregarle su número de radicado para seguimiento en el portal web.',
          isOptimal: true,
          feedback: '¡Excelente! Aplica Desescalamiento asertivo: no se pone a la defensiva, explica el valor del proceso en beneficio de su hogar y le brinda control mediante el radicado digital.',
        },
        {
          text: 'Decirle que si quiere poner tutela que la ponga, porque ese es el procedimiento.',
          isOptimal: false,
          feedback: 'Grave falla ética y de servicio. Atenta directamente contra la vocación social y los valores de Somos Uno.',
        },
      ],
    },
  ];

  const handleSelectOption = (idx: number) => {
    setChosenOption(idx);
    setSimulatorFeedback(scenarios[selectedScenarioIndex].options[idx].feedback);
  };

  const handleNextScenario = () => {
    setSelectedScenarioIndex((prev) => (prev + 1) % scenarios.length);
    setChosenOption(null);
    setSimulatorFeedback(null);
  };

  const handleSaveAudit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmpathyAudit({
      agentEvaluated,
      auditor,
      greetingAndEmpathyScore: scoreEmpathy,
      activeListeningScore: scoreListening,
      clearPlainLanguageScore: scoreLanguage,
      conflictDeescalationScore: scoreDeescalation,
      feedback: auditFeedback || 'Evaluación periódica de calidad en atención satisfactoria.',
      ticketReviewedRadicado: ticketReviewed,
    });
    setShowAuditForm(false);
    setAuditFeedback('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              Solución al Problema 4 del Diagnóstico Operativo
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Protocolo de Atención Empática y Resolución de Conflictos
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Manual institucional de servicio al cliente, técnicas de comunicación cálida, simulador interactivo de situaciones difíciles y auditorías internas periódicas de atención ciudadana para la Corporación Social Somos Uno.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700">
            <HeartHandshake className="w-4 h-4 text-emerald-700" />
            <span>Dignidad · Solidaridad · Universalidad</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-medium">
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'manual'
              ? 'bg-slate-900 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Manual del Protocolo Institucional
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'simulator'
              ? 'bg-slate-900 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Simulador de Situaciones Difíciles</span>
        </button>
        <button
          onClick={() => setActiveTab('audits')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'audits'
              ? 'bg-slate-900 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Auditorías Internas de Calidad ({empathyAudits.length})</span>
        </button>
      </div>

      {/* TAB 1: Manual */}
      {activeTab === 'manual' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Step 1 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-800">PASO 01</span>
              <h3 className="text-sm font-bold text-slate-900">Acogida Cálida</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contacto visual amable, saludo respetuoso, postura abierta. Hacer sentir al beneficiario que su presencia es bienvenida y valorada.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-800">PASO 02</span>
              <h3 className="text-sm font-bold text-slate-900">Escucha Activa</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No interrumpir mientras la persona expone su necesidad o reclamo. Asentir, tomar notas y validar sus emociones ("Comprendo su preocupación").
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-800">PASO 03</span>
              <h3 className="text-sm font-bold text-slate-900">Lenguaje Claro</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explicar requisitos y procedimientos en palabras cotidianas. Evitar siglas confusas o citas de artículos de leyes que generen distancia.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-800">PASO 04</span>
              <h3 className="text-sm font-bold text-slate-900">Técnica LAST</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>L</strong>isten (Escuchar), <strong>A</strong>pologize (Disculpa institucional sincera), <strong>S</strong>olve (Solución clara), <strong>T</strong>hank (Agradecer su alerta).
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-800">PASO 05</span>
              <h3 className="text-sm font-bold text-slate-900">Cierre Respetuoso</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Entregar comprobante de radicado con fecha legal, verificar si quedan dudas y despedirse con calidez reafirmando el compromiso comunitario.
              </p>
            </div>
          </div>

          {/* Golden Rules Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Reglas de Oro en Situaciones de Conflicto o Beneficiarios Inconformes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Separar a la persona del problema:</span>
                <p>El beneficiario está angustiado por su situación socioeconómica, no contra el funcionario personalmente. Responder con serenidad evita escalar el altercado.</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Nunca decir "Eso no me corresponde a mí":</span>
                <p>En Somos Uno somos un equipo articulado. Si la respuesta depende de un área técnica, orientar al ciudadano y canalizar el radicado directamente.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Simulator */}
      {activeTab === 'simulator' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-mono text-emerald-800 font-bold uppercase">
                Simulador de Entrenamiento y Desescalamiento
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {scenarios[selectedScenarioIndex].title}
              </h3>
            </div>
            <button
              onClick={handleNextScenario}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cambiar Caso &rarr;
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1">
            <span className="font-bold text-slate-900 block">Contexto de la Situación:</span>
            <p className="leading-relaxed">{scenarios[selectedScenarioIndex].context}</p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              ¿Cuál es la respuesta y conducta adecuada según el protocolo de Somos Uno?
            </span>
            <div className="space-y-2.5">
              {scenarios[selectedScenarioIndex].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  className={`w-full text-left p-3.5 rounded-lg border text-xs transition-all cursor-pointer ${
                    chosenOption === i
                      ? opt.isOptimal
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium'
                        : 'bg-rose-50 border-rose-500 text-rose-950'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono font-bold text-slate-500 text-[11px] shrink-0">
                      Opción {String.fromCharCode(65 + i)}:
                    </span>
                    <span>{opt.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {simulatorFeedback && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed ${
                scenarios[selectedScenarioIndex].options[chosenOption || 0].isOptimal
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <div className="font-bold mb-1 flex items-center gap-1.5">
                {scenarios[selectedScenarioIndex].options[chosenOption || 0].isOptimal ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Retroalimentación de Excelencia en Servicio</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>Oportunidad de Mejora Detectada</span>
                  </>
                )}
              </div>
              <p>{simulatorFeedback}</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Audits */}
      {activeTab === 'audits' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600">
              Evaluaciones periódicas de calidad y empatía realizadas por la Coordinación de Servicio al Cliente sobre muestras de atención ciudadana.
            </p>
            <button
              onClick={() => setShowAuditForm(!showAuditForm)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              {showAuditForm ? 'Cancelar' : '+ Registrar Nueva Auditoría'}
            </button>
          </div>

          {showAuditForm && (
            <form
              onSubmit={handleSaveAudit}
              className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm"
            >
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Rúbrica de Auditoría Interna de Atención (100 Puntos)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Funcionario Evaluado *</label>
                  <input
                    type="text"
                    required
                    value={agentEvaluated}
                    onChange={(e) => setAgentEvaluated(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Auditor Responsable *</label>
                  <input
                    type="text"
                    required
                    value={auditor}
                    onChange={(e) => setAuditor(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Radicado Muestreado</label>
                  <input
                    type="text"
                    value={ticketReviewed}
                    onChange={(e) => setTicketReviewed(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              {/* 4 Scores */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Acogida & Empatía (0-25)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={scoreEmpathy}
                    onChange={(e) => setScoreEmpathy(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Escucha Activa (0-25)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={scoreListening}
                    onChange={(e) => setScoreListening(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Lenguaje Claro (0-25)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={scoreLanguage}
                    onChange={(e) => setScoreLanguage(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Desescalamiento (0-25)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={scoreDeescalation}
                    onChange={(e) => setScoreDeescalation(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Retroalimentación Cualitativa para el Funcionario
                </label>
                <textarea
                  rows={2}
                  value={auditFeedback}
                  onChange={(e) => setAuditFeedback(e.target.value)}
                  placeholder="Aspectos destacados y recomendaciones para el plan de formación..."
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-600">
                  Puntaje Total:{' '}
                  <strong className="text-slate-900 font-mono text-base tabular-nums">
                    {scoreEmpathy + scoreListening + scoreLanguage + scoreDeescalation} / 100
                  </strong>
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Guardar Auditoría
                </button>
              </div>
            </form>
          )}

          {/* List of Audits */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="divide-y divide-slate-100 text-xs">
              {empathyAudits.map((aud) => (
                <div key={aud.id} className="p-4 hover:bg-slate-50 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{aud.agentEvaluated}</span>
                      <span className="text-slate-400 mx-2">·</span>
                      <span className="text-slate-500 font-mono tabular-nums">{aud.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-emerald-800 font-mono tabular-nums bg-emerald-50 px-2.5 py-0.5 rounded">
                        {aud.totalScore} / 100
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-700 leading-relaxed italic bg-slate-50 p-2.5 rounded border border-slate-100">
                    "{aud.feedback}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Auditor: {aud.auditor}</span>
                    {aud.ticketReviewedRadicado && (
                      <span className="font-mono">Caso auditado: {aud.ticketReviewedRadicado}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
