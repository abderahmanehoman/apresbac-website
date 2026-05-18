import { useState, useEffect } from 'react';
import { MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Header, MobileNav, ContentCard } from './components/Navigation';
import Chatbot from './components/Chatbot';
import NewsSection from './components/NewsSection';
import Calculator from './components/Calculator';
import { SCHOOLS, VOCATIONAL, SCHOLARSHIPS, ABROAD } from './constants';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Auto-scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <NewsSection />;
      case 'calculator':
        return <Calculator />;
      case 'schools':
        return (
          <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold inline-block border-b-4 border-primary pb-2 mb-4">🎓 دليل المدارس والجامعات</h2>
            </div>
            <div className="grid gap-6">
              {SCHOOLS.map(s => <ContentCard key={s.id} {...s} colorPrefix={s.color} />)}
            </div>
          </div>
        );
      case 'vocational':
        return (
          <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold inline-block border-b-4 border-secondary pb-2 mb-4">🛠️ التكوين المهني والتقني</h2>
            </div>
            <div className="grid gap-6">
              {VOCATIONAL.map(v => <ContentCard key={v.id} {...v} colorPrefix={v.color} />)}
            </div>
          </div>
        );
      case 'scholarships':
        return (
          <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold inline-block border-b-4 border-blue-400 pb-2 mb-4">💰 المنح الدراسية والدعم</h2>
            </div>
            <div className="grid gap-6">
              {SCHOLARSHIPS.map(s => <ContentCard key={s.id} {...s} colorPrefix={s.color} />)}
            </div>
          </div>
        );
      case 'abroad':
        return (
          <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold inline-block border-b-4 border-red-500 pb-2 mb-4">✈️ الدراسة بالخارج</h2>
            </div>
            <div className="grid gap-6">
              {ABROAD.map(a => <ContentCard key={a.id} {...a} colorPrefix={a.color} />)}
            </div>
          </div>
        );
      case 'consultation':
        return (
          <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold inline-block border-b-4 border-emerald-500 pb-2 mb-4">💬 استشارة وتوجيه شخصي</h2>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/95 text-dark p-8 rounded-[2rem] shadow-2xl text-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare size={40} />
              </div>
              <h3 className="text-2xl font-bold">حاير وماعرفتيش شنو تختار؟ 🤔</h3>
              <p className="text-slate-600 leading-relaxed max-w-lg mx-auto">
                فريق AprèsBac واجد باش يعاونك. غنحللو النقط ديالك، ونشوفو الميولات ديالك، ونرسمو ليك الخطة الناضية باش تحقق الحلم ديالك.
              </p>
              <button
                onClick={() => window.open('https://wa.me/212654867413', '_blank')}
                className="bg-[#25D366] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-3 mx-auto shadow-xl"
              >
                تواصل معنا عبر الواتساب
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.171.821-.333.048-.752.069-1.21-.074-.282-.087-.703-.234-1.206-.454-2.145-.937-3.516-3.125-3.624-3.27-.108-.144-.881-1.171-.881-2.234 0-1.063.541-1.587.755-1.812.215-.225.467-.282.622-.282.155 0 .31.003.444.006.14.003.329-.053.515.393.186.446.638 1.553.693 1.666.056.113.093.244.018.394-.075.15-.113.244-.225.375-.113.131-.237.291-.338.394-.113.113-.23.237-.1.462.13.225.578.953 1.24 1.54.851.758 1.567.994 1.787 1.107.221.113.35.094.481-.056.13-.15.564-.656.715-.881.15-.225.301-.188.508-.113.206.075 1.314.619 1.54.731.225.113.375.169.431.263.056.094.056.544-.088.949z"/>
                </svg>
              </button>
            </motion.div>
          </div>
        );
      default:
        return <NewsSection />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Background Decorative Circles */}
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <Header onNavigate={setActivePage} activePage={activePage} />
      
      <main className="flex-1 pt-24 pb-32 px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-[999] bg-primary text-white p-4 px-6 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all font-bold"
      >
        <Sparkles size={20} />
        <span>الموجه الذكي</span>
      </button>

      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      <MobileNav onNavigate={setActivePage} activePage={activePage} />
      
      {/* Footer Branding */}
      <footer className="w-full py-10 px-6 border-t border-white/5 text-center hidden md:block">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="https://i.postimg.cc/t4Vqwf3B/logo.jpg" alt="Logo" className="h-8 w-8 rounded-md" />
            <span className="font-bold opacity-60">AprèsBac 2026</span>
          </div>
          <p className="text-sm text-white/40">صنع بحب لمساعدة التلاميذ المغاربة في بناء مستقبلهم 🇲🇦</p>
        </div>
      </footer>
    </div>
  );
}
