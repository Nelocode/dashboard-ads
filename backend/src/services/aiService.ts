import axios from 'axios';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../lib/prisma';

export const analyzeCampaignData = async (campaignName: string, metrics: any) => {
  // 1. Get Active Config from DB
  const config = await prisma.aiConfig.findFirst({
    where: { isActive: true }
  });

  const provider = config?.provider || 'ollama';
  const apiKey = config?.apiKey || '';
  const model = config?.modelName;

  const prompt = `
    Eres un analista experto en Marketing Digital y Optimización de Anuncios. 
    Analiza la siguiente campaña y proporciona un diagnóstico técnico junto con 3 recomendaciones accionables.
    
    CAMPAÑA: ${campaignName}
    MÉTRICAS: ${JSON.stringify(metrics)}
    
    INSTRUCCIONES:
    - Evalúa si el ROAS y CPA están dentro de rangos saludables.
    - Identifica posibles fugas de presupuesto (Budget Leaks).
    - Sugiere ajustes específicos en la puja o segmentación.
    
    Responde ÚNICAMENTE en formato JSON siguiendo esta estructura:
    {
      "diagnosis": "Breve análisis técnico (1-2 párrafos)",
      "budgetLeaks": "Descripción de dónde se está perdiendo dinero si aplica",
      "suggestions": ["Sugerencia 1", "Sugerencia 2", "Sugerencia 3"]
    }
  `;

  try {
    if (provider === 'ollama') {
      const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
      const response = await axios.post(ollamaUrl, {
        model: model || 'qwen2.5-coder:latest',
        prompt: prompt,
        stream: false,
        format: 'json'
      });
      return JSON.parse(response.data.response);
    } 
    
    if (provider === 'openai') {
      if (!apiKey) throw new Error('API Key de OpenAI no configurada');
      const openai = new OpenAI({ apiKey });
      const response = await openai.chat.completions.create({
        model: model || 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      });
      return JSON.parse(response.choices[0].message.content || '{}');
    }

    if (provider === 'gemini') {
      if (!apiKey) throw new Error('API Key de Google Gemini no configurada');
      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({ model: model || 'gemini-1.5-pro' });
      const result = await geminiModel.generateContent(prompt);
      const text = result.response.text();
      const jsonStr = text.replace(/```json|```/g, '').trim();
      return JSON.parse(jsonStr);
    }

    throw new Error('Proveedor de IA no soportado');

  } catch (error: any) {
    console.error(`Error with ${provider}:`, error.message);
    throw new Error(`Fallo en la comunicación con ${provider}. Verifica tu configuración y API Key.`);
  }
};
