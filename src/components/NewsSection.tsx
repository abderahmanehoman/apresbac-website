import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'motion/react';

// ==========================================
// 1. إعدادات Supabase
// ==========================================
const supabaseUrl = 'https://eiqwwtoodkibmpnigwvk.supabase.co';
const supabaseKey = 'sb_publishable_XlA7CgWOatF8bNE2DNUvPA_wBVYyXVy';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function NewsSection() {
  // ==========================================
  // 2. إدارة الحالة (State)
  // ==========================================
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  // ==========================================
  // 3. جلب الداتا من Supabase
  // ==========================================
  async function fetchNews() {
    try {
      const { data, error } = await supabase
        .from('concours_news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      if (data) setNews(data);
    } catch (error: any) {
      console.error("❌ مشكل فـ جلب الأخبار:", error.message);
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // 4. واجهة المستخدم (الديزاين الجديد المصغر وبلا تقسيم)
  // ==========================================
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6" dir="rtl">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold inline-block border-b-4 border-secondary pb-2 text-white">
          🔥 آخر المستجدات 2026
        </h2>
      </div>

      {loading ? (
        <div className="text-center text-white/80 text-lg font-bold">
          <span className="animate-pulse">كاريي جلب الأخبار من الماكينة... ⏳</span>
        </div>
      ) : (
        // 🚨 حيدنا md:grid-cols-2 وخليناهم مستفين واحد تحت واحد مع gap صغير 🚨
        <div className="grid gap-4 md:gap-5">
          {news.length === 0 ? (
            <div className="text-center text-white/80">مازال مكاين حتى خبر، طلق الماكينة ديال Scraping أ البطل!</div>
          ) : (
            news.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3, scale: 1.01 }}
                onClick={() => setSelectedItem(item)}
                // 🚨 نقصنا الـ padding لـ p-4 والـ border لـ 4px باش يجي خفيف 🚨
                className="bg-white/95 text-slate-900 p-4 md:p-5 rounded-xl shadow-md cursor-pointer border-r-4 border-secondary transition-all"
              >
                <h3 className="text-lg font-bold text-primary mb-1 underline decoration-2 underline-offset-4 line-clamp-2">
                  🆕 {item.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3 font-semibold">
                  (كليكي على العنوان باش تعرف كاع المعلومات)
                </p>
                <p className="font-bold text-sm text-slate-700">
                  📅 آخر أجل: <span className="text-red-600">{item.deadline || 'غير محدد'}</span>
                </p>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* 5. نافذة التفاصيل (Modal) */}
      {/* ========================================== */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              // 🚨 صغرنا شوية النافذة باش تجي متناسقة (max-w-md) 🚨
              className="bg-white text-slate-900 rounded-2xl w-full max-w-md p-6 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 left-4 bg-red-100 text-red-600 w-8 h-8 rounded-full font-black text-lg flex items-center justify-center hover:bg-red-200 transition-colors"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold text-primary mb-4 ml-8 leading-snug">
                {selectedItem.title}
              </h2>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                  {selectedItem.description || "المعلومات غاتحط هنا قريباً أ بطل!"}
                </p>
              </div>

              <p className="mb-6 font-bold text-base text-slate-800 text-center">
                📅 آخر أجل: <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md">{selectedItem.deadline || 'غير محدد'}</span>
              </p>
              
              <div className="text-center">
                <a href={selectedItem.link || "#"} target="_blank" rel="noopener noreferrer">
                  <button className="bg-secondary text-white w-full py-3 rounded-xl font-bold text-lg hover:bg-emerald-600 hover:shadow-md transition-all transform hover:-translate-y-1">
                    مستعد؟ تسجل دابا 🚀
                  </button>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}