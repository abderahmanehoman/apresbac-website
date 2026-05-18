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

    // 🚀 المصفوفة الكبيرة والذكية لتجربة كاع الموديلات المتاحة بالتتابع (من الأقوى للأخف)
    const modelsToTry = [
      "gemini-3.1-pro-preview","gemini-3.1-flash-preview","gemini-2.5-pro","gemini-2.5-flash","gemini-2.0-pro","gemini-2.0-flash","gemini-1.5-pro","gemini-1.5-flash",
    ];
    let response: any = null;
    let successfulModel = "";
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model: modelName, 
          contents: [
            { role: 'user', parts: [{ text: initialPrompt }] },
            { role: 'model', parts: [{ text: "أنا الموجه الذكي، واجد باش نعاون التلاميذ المغاربة." }] },
            ...chatHistory,
            { role: 'user', parts: [{ text: userMsg }] }
          ],
        });
        
        successfulModel = modelName;
        break; 
      } catch (err) {
        console.error(`فشل الموديل ${modelName}، غندوزو للتالي:`, err);
        lastError = err;
      }
    }

    if (!response || !successfulModel) {
      throw lastError || new Error("جميع الموديلات المتاحة فشلت في الاستجابة");
    }

    const originalText = response.text || "سمح ليا، وقع واحد المشكل صغير. عاود صيفط ليا ميساج!";
    const text = `${originalText}\n\n*(🤖 تمت الإجابة بواسطة: ${successfulModel})*`;

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