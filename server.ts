import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client server-side with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Server API Routes

// 1. Asistente de Redacción Empática y Resolución de Conflictos (Problema 4 y Módulo 4)
app.post('/api/ai/empathic-response', async (req, res) => {
  try {
    const { citizenName, requestType, projectArea, citizenDescription, agentNotes, tone } = req.body;

    if (aiClient) {
      const prompt = `Actúa como Coordinador de Servicio al Cliente de la "Corporación Social Somos Uno", entidad que promueve la dignidad, solidaridad y universalidad en comunidades vulnerables.
Genera una respuesta institucional formal, cálida, altamente empática y clara para el siguiente requerimiento:

- Ciudadano/Beneficiario: ${citizenName || 'Ciudadano(a)'}
- Tipo de Solicitud: ${requestType || 'Petición / Requerimiento'}
- Área / Proyecto Social involucrado: ${projectArea || 'Servicio Social'}
- Motivo o Reclamo del Ciudadano: ${citizenDescription || 'No especificado'}
- Notas internas del funcionario / Concepto técnico: ${agentNotes || 'Revisión en trámite'}
- Tono solicitado: ${tone || 'Empático, respetuoso y resolutivo'}

Instrucciones:
1. Saludo cordial y respetuoso reconociendo la importancia de su situación.
2. Agradecimiento por comunicarse con Somos Uno.
3. Explicación clara sin tecnicismos legales confusos sobre la situación y la acción tomada o respuesta técnica.
4. Compromiso institucional y pasos a seguir o canales de acompañamiento.
5. Despedida fraterna reafirmando la misión comunitaria de Somos Uno.

Devuelve únicamente la carta/comunicación en formato de texto bien estructurado.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ text: response.text });
    }

    // High quality deterministic fallback if no API key
    const fallbackText = `Estimado(a) ${citizenName || 'Beneficiario(a)'},

Reciba un cordial y fraternal saludo de parte de todo el equipo de la Corporación Social Somos Uno.

Agradecemos profundamente su comunicación y el tiempo que nos ha dedicado para hacernos llegar su ${requestType ? requestType.toLowerCase() : 'solicitud'} respecto al programa de ${projectArea || 'Atención Social'}. En nuestra corporación trabajamos bajo los principios de dignidad, solidaridad y universalidad, por lo que cada una de sus inquietudes es una prioridad para nosotros.

En relación a su caso ("${citizenDescription || 'su requerimiento presentado'}"), le informamos que el equipo operativo y los coordinadores técnicos han revisado detalladamente sus antecedentes y nos encontramos coordinando la solución más oportuna y justa para usted y su núcleo familiar. ${agentNotes ? `Específicamente: ${agentNotes}` : ''}

Reiteramos nuestro compromiso de mantenerlo(a) permanentemente informado(a). Puede realizar el seguimiento de su expediente a través de nuestro portal web con su número de radicado o acercándose a nuestra sede donde con gusto le atenderemos.

Cordialmente,

Coordinación de Atención al Ciudadano y Servicio Social
Corporación Social Somos Uno
"Dignidad, Solidaridad y Vocación de Servicio Comunitario"`;

    return res.json({ text: fallbackText });
  } catch (error: any) {
    console.error('Error generating empathic response:', error);
    return res.status(500).json({ error: error?.message || 'Error al generar respuesta empática' });
  }
});

// 2. Asistente de Análisis de Causa Raíz y Acción Correctiva (Problema 1, 3, 5 y Módulo 6)
app.post('/api/ai/corrective-action', async (req, res) => {
  try {
    const { recurringPattern, affectedArea, isbScore, pendingCasesCount } = req.body;

    if (aiClient) {
      const prompt = `Eres un auditor de calidad y mejora continua de procesos de servicio al cliente bajo metodología PHVA para la "Corporación Social Somos Uno".
Analiza la siguiente no conformidad operativa:
- Patrón recurrente: ${recurringPattern}
- Área / Proyecto Social: ${affectedArea}
- Índice de Satisfacción Actual (ISB): ${isbScore}%
- Casos con riesgo de vencimiento o vencidos: ${pendingCasesCount}

Genera un plan de acción correctiva concreto en formato JSON con la siguiente estructura:
{
  "rootCause": "Explicación de la causa raíz identificada",
  "correctiveAction": "Acción inmediata de corrección",
  "preventiveAction": "Estrategia para evitar recurrencia a mediano plazo",
  "responsibleRole": "Cargo responsable de liderar la mejora",
  "executionDays": número de días para implementación (ej. 15),
  "kpiToMonitor": "Indicador clave de seguimiento"
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }

    // High quality deterministic fallback
    return res.json({
      rootCause: `Desalineación entre la capacidad de recepción y el tiempo de emisión de conceptos técnicos en el área de ${affectedArea || 'Proyectos'}.`,
      correctiveAction: `Instaurar un comité extraordinario de descongestión semanal y habilitar plantilla simplificada de concepto técnico.`,
      preventiveAction: `Ajustar la matriz de tiempos SLA y capacitar a los líderes de proyectos en el sistema digital unificado.`,
      responsibleRole: `Coordinador de ${affectedArea || 'Operaciones'} y Líder de Servicio al Cliente`,
      executionDays: 14,
      kpiToMonitor: `Porcentaje de conceptos técnicos emitidos en menos de 5 días hábiles`,
    });
  } catch (error: any) {
    console.error('Error in corrective action API:', error);
    return res.status(500).json({ error: error?.message || 'Error al generar plan de mejora' });
  }
});

// Configure Vite or Static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Somos Uno customer service server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
