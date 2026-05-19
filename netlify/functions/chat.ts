import { GoogleGenAI } from "@google/genai";
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// Netlify reads environment variables from your site settings.
const ai = new GoogleGenAI({ 
  apiKey: process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY 
});

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { messages, userMsg, initialPrompt } = body;

    const chatHistory = messages.map((m: any) => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    // 🚀 هنا حددنا موديل واحد فقط: الأسرع والأكثر اقتصاداً
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [
        { role: 'user', parts: [{ text: initialPrompt }] },
        { role: 'model', parts: [{ text: "أنا الموجه الذكي، واجد باش نعاون التلاميذ المغاربة." }] },
        ...chatHistory,
        { role: 'user', parts: [{ text: userMsg }] }
      ],
    });

    const text = response.text || "سمح ليا، وقع واحد المشكل صغير. عاود صيفط ليا ميساج!";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
      return {
        statusCode: 429,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "عذراً بطل، سالا الرصيد ديال المحادثات المتاح حالياً. المرجو إضافة الـ API Key ديالك فالإعدادات ولا حاول مرة أخرى لاحقاً!" }),
      };
    }
    
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "كاين شوية ديال الزحام، واقيلا السيرفر عيا شوية. عاود صيفط ليا ميساج بطل!" }),
    };
  }
};