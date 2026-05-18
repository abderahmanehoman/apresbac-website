import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, X, Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const INITIAL_PROMPT = `
تعليمات صارمة لك: 
أنت "الموجه الذكي"، مساعد ذكي مغربي متخصص حصرياً في التوجيه المدرسي والمهني لما بعد الباكالوريا (Tawjih).
مهمتك الأساسية والوحيدة: مساعدة التلاميذ المغاربة في اختيار أفضل المدارس، الجامعات، ومؤسسات التكوين المهني (مثل ENSA, ENCG, FMP, OFPPT, EST, BTS, CPGE، إلخ) بناءً على نقطهم، شعبتهم، كفاءاتهم، وأحلامهم.

طريقة كلامك: 
- تتحدث بالدارجة المغربية بأسلوب شبابي، مرح، تفاعلي ومحفز.
- نادِ التلميذ بـ 'بطل' أو 'بطلة' أو 'الساط' أو 'المجتهد'. 
- ممنوع قطعاً استخدام كلمات خادشة للحياء.

بروتوكول التوجيه:
1. البداية: دائماً ابدأ بسؤال التلميذ عن: شعبة الباكالوريا ديالو، والنقطة اللي جاب أو كيتوقع يجيب.
2. الميولات: سولو على الميولات ديالو والأحلام ديالو.
3. التحليل والاقتراح: اقترح خيارات واقعية تناسب العتبات (Seuils).
4. التنسيق: اجعل رسائلك قصيرة، منظمة، واطرح سؤالاً واحداً فقط في النهاية.
`;

export default function Chatbot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "أهلاً بك! ✌️ ناضي باش نبداو، ولكن قبل كلشي، قولي بعدا شنو سميتك؟" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // 🚀 Your Netlify Route:
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          userMsg,
          initialPrompt: INITIAL_PROMPT
        })
      });

      // 🔥 FIX: Safety check before parsing JSON. 
      // If Netlify routes incorrectly, it returns an HTML 404 page!
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text();
        console.error("Netlify HTML/Text Error:", errorText);
        throw new Error(`مشكل فالاتصال مع السيرفر (Status: ${response.status}). الفانكشن مابقاتش مقريا مزيان ف Netlify!`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Network response was not ok');
      }
      
      if (data.error) {
        setMessages(prev => [...prev, { role: 'model', content: data.error }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', content: data.text }]);
      }
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: error.message || "كاين شوية ديال الزحام، واقيلا السيرفر عيا شوية. عاود صيفط ليا ميساج بطل!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white text-slate-900 w-full max-w-lg h-[80vh] rounded-3xl flex flex-col overflow-hidden shadow-2xl relative"
          >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-blue-600 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold flex items-center gap-2">
                    الموجه الذكي AI
                    <Sparkles size={14} className="text-emerald-300" />
                  </h3>
                  <p className="text-[10px] text-white/70">متواجد للمساعدة 24/7</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex w-full",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                      msg.role === 'user'
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white border text-slate-700 rounded-tl-none shadow-sm"
                    )}
                  >
                    {msg.role === 'model' ? (
                      <div className="text-sm space-y-2 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:ml-4">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border rounded-2xl rounded-tl-none p-3 shadow-sm">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                      />
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        className="w-1.5 h-1.5 bg-blue-600 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="كتب سؤالك هنا بطل..."
                  className="flex-1 px-4 py-2 border rounded-xl outline-none focus:border-blue-600 transition-colors text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 text-white p-2 px-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
