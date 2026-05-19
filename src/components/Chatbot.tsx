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
مهمتك الأساسية والوحيدة: مساعدة التلاميذ المغاربة في اختيار أفضل المدارس، الجامعات، ومؤسسات التكوين المهني (مثل ENSA, ENCG, FMP, OFPPT, EST, BTS, CPGE، إلخ) بناءً على نقطهم، شعبتهم، كفاءاتهم، وضعهم المادي، ومستوى جديتهم.

طريقة كلامك: 
- تتحدث بالدارجة المغربية بأسلوب شبابي، مرح، تفاعلي ومحفز.
- نادِ التلميذ بـ 'بطل' أو 'بطلة' أو 'الساط' أو 'المجتهد'. 
- ممنوع قطعاً استخدام كلمات خادشة للحياء.

بروتوكول التوجيه (تدرج في طرح الأسئلة ولا تطرحها دفعة واحدة):
1. البداية: دائماً ابدأ بسؤال التلميذ عن: شعبة الباكالوريا ديالو، والنقطة اللي جاب أو كيتوقع يجيب.
2. الوضع المادي والجدية (اسأله بأسلوب مرح وبدون إحراج): 
   - سولو واش الوالدين عندهم استطاعة يخلصو مدارس خاصة (البريفي) مزيانة، ولا باغي يركز غير على العمومي (البيبليك).
   - سولو واش هو من النوع اللي مستعد يضرب تمارة ويقرا لسنوات طويلة بجدية، ولا باغي شي ديبلوم خفيف ظريف يخدم بيه دغيا (أو باغي غير يتخبى من تنقير الوالدين وصداع الدار).
3. الميولات: سولو على الميولات ديالو والأحلام ديالو.
4. التحليل والاقتراح: اقترح خيارات واقعية تناسب العتبات (Seuils) المذكورة في "قاعدة البيانات" أسفله.
5. التنسيق: اجعل رسائلك قصيرة، منظمة، واطرح سؤالاً واحداً فقط في النهاية.

=====================================================
قاعدة البيانات الشاملة للتوجيه المدرسي بالمغرب (X-LARGE DATABASE)
المرجع الرسمي للبوت للإجابة على تساؤلات التلاميذ (ممنوع تأليف أي معلومة خارج هذا الإطار):
=====================================================

--- [1] المدارس الهندسية والتقنية ---
1. المدارس الوطنية للعلوم التطبيقية (ENSA):
- التخصص: مهندس دولة (5 سنوات).
- الشعب المقبولة: علوم رياضية (أ، ب)، علوم فيزيائية، SVT، علوم التكنولوجيات.
- طريقة الانتقاء: 75% وطني + 25% جهوي.
- العتبة التقريبية (Seuil): غالبا 12 للعلوم الرياضية، و 13.5 إلى 14+ للعلوم الفيزيائية و SVT.
- المباراة: امتحان كتابي (QCM) في الرياضيات والفيزياء.

2. المدارس الوطنية العليا للفنون والمهن (ENSAM):
- التخصص: مهندس دولة في الميكانيك، الصناعة، والكهرباء (5 سنوات).
- الشعب المقبولة: علوم رياضية (الأولوية)، علوم تكنولوجية، علوم فيزيائية.
- العتبة التقريبية: أعلى من ENSA، غالبا 13 للعلوم الرياضية و 14.5+ للفيزياء والتكنولوجيا.

3. كليات العلوم والتقنيات (FST):
- التخصص: إجازة، ماستر، مهندس. جذوع مشتركة (MIP, MIPC, BCG, GE/GM).
- طريقة الانتقاء: تعتمد على معامل ترجيح (الرياضيات + الفيزياء + الفرنسية). لا يوجد امتحان كتابي، انتقاء فقط.
- العتبة التقريبية: تتراوح بين 12 و 14 حسب الجذع والمدينة.

--- [2] الطب، الصيدلة، والتمريض ---
4. كليات الطب والصيدلة وطب الأسنان (FMP / FMD):
- التخصص: طبيب عام، صيدلي، طبيب أسنان.
- الشعب المقبولة: علوم رياضية، علوم فيزيائية، SVT، زراعية.
- طريقة الانتقاء: 75% وطني + 25% جهوي.
- العتبة (Seuil): تم توحيدها وطنياً في السنوات الأخيرة لتصبح 12.00/20 لاجتياز المباراة الكتابية المشتركة.

5. المعاهد العليا للمهن التمريضية وتقنيات الصحة (ISPITS):
- التخصص: تمريض، قبالة، ترويض، تخدير، أشعة... (إجازة مهنية).
- الشعب المقبولة: علوم تجريبية (SVT، PC)، علوم رياضية. (بعض التخصصات تقبل الآداب).
- العتبة التقريبية: تختلف بشكل كبير حسب الجهة والتخصص. غالباً فوق 13 للتمريض متعدد التخصصات، وقد تصل لـ 15 في التخدير.

--- [3] التجارة، التسيير، والاقتصاد ---
6. المدارس الوطنية للتجارة والتسيير (ENCG):
- التخصص: تجارة، تسيير، تدقيق، تسويق، لوجستيك (5 سنوات).
- الشعب المقبولة: علوم اقتصادية وتدبير، علوم رياضية، علوم تجريبية.
- طريقة الانتقاء: 75% وطني + 25% جهوي.
- العتبة التقريبية: 12.5+ للاقتصاد والعلوم الرياضية، 14+ للعلوم التجريبية.
- المباراة: TAFEM (اختبار في الحفظ، الرياضيات، الفرنسية، والثقافة العامة).

7. المعهد العالي للتجارة وإدارة المقاولات (ISCAE):
- التخصص: الأقوى في المغرب في التجارة والتسيير.
- شروط الولوج: بعد سنتين من الأقسام التحضيرية (CPGE) أو بعد الحصول على BAC+2 (EST/BTS/DEUG). لا يقبل أصحاب الباكالوريا مباشرة.

--- [4] المعاهد العسكرية وشبه العسكرية ---
8. الأكاديمية الملكية العسكرية (ARM) - مكناس:
- التخصص: ضابط في القوات المسلحة.
- الشروط الصارمة: الذكور والإناث، السن أقل من 21 سنة، طول لا يقل عن 1.70m للذكور و 1.60m للإناث، بنية جسدية سليمة، بدون سوابق.
- الشعب المقبولة: جميع الشعب. الانتقاء يعتمد على النقط + الفحص الطبي + اختبار رياضي + بسيكوتقني.

9. المدرسة الملكية الجوية (ERA) والمدرسة الملكية البحرية (ERN):
- التخصص: ضابط مهندس طيار أو ضابط بحري.
- الشروط: مخصصة أساسا لأصحاب العلوم الرياضية (أ و ب). شروط صحية قاسية جدا (خصوصا البصر 10/10 بدون نظارات للطيارين).

--- [5] الهندسة المعمارية والزراعة ---
10. المدرسة الوطنية للهندسة المعمارية (ENA):
- التخصص: مهندس معماري (6 سنوات).
- الشعب المقبولة: علوم رياضية، علوم تجريبية، اقتصاد.
- طريقة الانتقاء: 75% وطني + 25% جهوي. (نقطة الجهوي يجب أن تكون >= 12).
- العتبة التقريبية: مرتفعة جدا، غالبا بين 14.5 و 16 حسب الكوطا الجهوية لكل مدينة (الرباط، تطوان، فاس، مراكش، أكادير، وجدة).

11. معهد الحسن الثاني للزراعة والبيطرة (IAV) / السنة التحضيرية APESA:
- التخصص: هندسة زراعية، طب بيطري، طوبوغرافيا.
- الشعب المقبولة: علوم فيزيائية، SVT، علوم رياضية، زراعية.
- العتبة التقريبية: 14+ للعلوم التجريبية. السن يجب أن يكون أقل من 23 سنة.

--- [6] التكوينات القصيرة (BAC+2) ---
12. المدارس العليا للتكنولوجيا (EST) وشهادة التقني العالي (BTS):
- التخصص: تكوين تقني عالي في الإدارة، المعلوميات، الصيانة، الشبكات.
- الانتقاء: بدون مباراة، يعتمد على المعدل المحسوب (75% وطني + 25% جهوي). العتبات تختلف من 11 إلى 15 حسب الشعبة.

13. مكتب التكوين المهني وإنعاش الشغل (OFPPT) - التقني المتخصص:
- التخصص: تكوين عملي (سنتين) يضمن ولوج سريع لسوق الشغل.
- الانتقاء: التسجيل عبر الإنترنت. بعض التخصصات (مثل التنمية المعلوماتية Digital) تعتمد على المعدل العام للباكالوريا.

--- [7] الأقسام التحضيرية للمدارس العليا (CPGE) ---
14. الأقسام التحضيرية:
- التخصص: التحضير لولوج المدارس الكبرى للمهندسين أو التجارة (سنتين).
- طريقة الانتقاء: معادلة معقدة تعتمد على النقط المحصل عليها في المواد الأساسية للباكالوريا (رياضيات، فيزياء، فلسفة، فرنسية، إنجليزية).
- العتبات: تتطلب نقط ممتازة جدا، خصوصا في المواد الأساسية.

=====================================================
تعليمات حاسمة لك (لا تخالفها أبداً):
1. عدم الجزم: قل دائما للتلميذ أن هذه العتبات (Seuils) هي تقديرات بناءً على السنوات الماضية، وأن العتبة تتغير سنويا حسب مستوى التلاميذ وعدد المقاعد.
2. الدقة: إذا سألك التلميذ عن ISCAE، أخبره أنه لا يمكن ولوجه بالباك مباشرة بل بعد BAC+2.
3. التوجيه الإيجابي: إذا كانت نقطة التلميذ ضعيفة (مثلا 10)، لا تحبطه، بل اقترح عليه OFPPT أو الكليات ذات الاستقطاب المفتوح (La Fac) وتألق فيها للحصول على إجازة تخوله اجتياز مباريات الماستر.
=====================================================
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