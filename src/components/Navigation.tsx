import { Home, School, Wrench, Wallet, MessageSquare, ExternalLink, Calculator as CalcIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function Header({ onNavigate, activePage }: { onNavigate: (page: string) => void; activePage: string }) {
  const navItems = [
    { id: 'schools', label: 'مدارس', icon: School },
    { id: 'vocational', label: 'تكوين', icon: Wrench },
    { id: 'scholarships', label: 'منح', icon: Wallet },
    { id: 'abroad', label: 'بالخارج', icon: Home },
    { id: 'calculator', label: 'حاسبة', icon: CalcIcon },
    { id: 'consultation', label: 'استشارة', icon: MessageSquare },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] glass h-16 flex items-center px-4 md:px-6 justify-between bg-dark/90 text-white border-b border-white/5 overflow-hidden">
      <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => onNavigate('home')}>
        <img src="https://i.postimg.cc/t4Vqwf3B/logo.jpg" alt="Logo" className="h-10 w-10 rounded-lg object-cover" />
        <span className="font-bold text-xl tracking-tight hidden lg:block">AprèsBac</span>
      </div>
      
      <nav className="hidden md:flex items-center gap-1 lg:gap-2 overflow-x-auto scrollbar-hide shrink-0 pr-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "px-3 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0",
              activePage === item.id ? "bg-primary text-white" : "hover:bg-white/10"
            )}
          >
            <item.icon size={16} />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}

export function MobileNav({ onNavigate, activePage }: { onNavigate: (page: string) => void; activePage: string }) {
  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'schools', label: 'المدارس', icon: School },
    { id: 'vocational', label: 'تكوين', icon: Wrench },
    { id: 'scholarships', label: 'منح', icon: Wallet },
    { id: 'calculator', label: 'حاسبة', icon: CalcIcon },
    { id: 'consultation', label: 'استشارة', icon: MessageSquare },
  ];

  return (
    // 🚨 هنا فين كاين التعديل: حيدنا glass، درنا bg-slate-900 صلب، وفرقناهم بـ justify-around 🚨
    <nav className="fixed bottom-0 left-0 right-0 z-[1001] md:hidden h-16 flex items-center justify-around overflow-x-auto scrollbar-hide bg-slate-900 backdrop-blur-xl border-t border-slate-800 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] px-2">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={cn(
            "flex flex-col items-center gap-1.5 transition-all min-w-[50px] shrink-0",
            activePage === item.id ? "text-secondary transform -translate-y-1" : "text-slate-300 hover:text-white"
          )}
        >
          <item.icon size={22} strokeWidth={activePage === item.id ? 2.5 : 2} />
          <span className="text-[10px] font-bold">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export function ContentCard({ title, description, link, colorPrefix }: { title: string; description: string; link: string; colorPrefix: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        // 🚨 هنا صغرنا العبار (p-4 md:p-5 و rounded-2xl) باش يجيو المدارس متناسقين مع الأخبار 🚨
        "bg-white/95 text-slate-900 p-4 md:p-5 rounded-2xl shadow-md border-r-4 transition-all overflow-hidden relative group cursor-pointer",
        colorPrefix
      )}
      onClick={() => window.open(link, '_blank')}
    >
      <h3 className="text-lg md:text-xl font-bold mb-2 text-slate-900 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">{description}</p>
      <div className="flex items-center gap-2 text-xs font-bold text-primary">
        <span>الموقع الرسمي</span>
        <ExternalLink size={14} />
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
    </motion.div>
  );
}