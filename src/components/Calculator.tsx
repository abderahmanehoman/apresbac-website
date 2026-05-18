import { useState } from 'react';
import { Percent, GraduationCap, AlertTriangle, Stethoscope, Briefcase, Laptop, Settings } from 'lucide-react';
import { motion } from 'motion/react';

const HISTORICAL_SEUILS = [
  { 
    id: 'fmp', 
    name: 'كليات الطب والصيدلة (FMP/FMD)', 
    range: '12.00 - 14.00', 
    streams: 'جميع الشعب العلمية', 
    icon: Stethoscope,
    color: 'text-amber-500', 
    bg: 'bg-amber-100',
    border: 'border-amber-200'
  },
  { 
    id: 'encg', 
    name: 'التجارة والتسيير (ENCG)', 
    range: '13.00 - 15.00', 
    streams: 'علمية (يطلب نقطة أعلى) / اقتصادية (أقل)', 
    icon: Briefcase,
    color: 'text-emerald-500', 
    bg: 'bg-emerald-100',
    border: 'border-emerald-200'
  },
  { 
    id: 'ensa', 
    name: 'العلوم التطبيقية (ENSA)', 
    range: '12.50 - 14.00', 
    streams: 'ت. رياضية (نقطة أقل) / تجريبية (أعلى)', 
    icon: Laptop,
    color: 'text-blue-500', 
    bg: 'bg-blue-100',
    border: 'border-blue-200'
  },
  { 
    id: 'ensam', 
    name: 'الفنون والمهن (ENSAM)', 
    range: '14.50 - 16.00', 
    streams: 'العلوم التجريبية والرياضية والتقنية', 
    icon: Settings,
    color: 'text-purple-500', 
    bg: 'bg-purple-100',
    border: 'border-purple-200'
  },
];

export default function Calculator() {
  const [regional, setRegional] = useState<string>('');
  const [national, setNational] = useState<string>('');
  
  const r = parseFloat(regional);
  const n = parseFloat(national);
  const isValid = !isNaN(r) && !isNaN(n) && r >= 0 && r <= 20 && n >= 0 && n <= 20;

  // Most prominent schools (ENSA, ENCG, Medecine) use 75% national, 25% regional
  const scorePonderee = isValid ? (n * 0.75 + r * 0.25).toFixed(2) : '--';

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold inline-block border-b-4 border-primary pb-2 mb-4">🧮 حاسبة معدل الانتقاء</h2>
          <p className="text-slate-400 mt-2">حسب النقطة ديالك باش تعرف حظوظك في المدارس العليا</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 text-dark p-8 md:p-12 rounded-[2rem] shadow-2xl"
        >
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">النقطة ديال الجهوي (25%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0" max="20" step="0.01"
                    value={regional}
                    onChange={(e) => setRegional(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="مثال: 15.50"
                    dir="ltr"
                  />
                  <Percent size={18} className="absolute right-4 top-3.5 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">النقطة ديال الوطني المرجوة (75%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0" max="20" step="0.01"
                    value={national}
                    onChange={(e) => setNational(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="مثال: 16.00"
                    dir="ltr"
                  />
                  <Percent size={18} className="absolute right-4 top-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col justify-center items-center text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px]"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-[40px]"></div>
              
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center relative z-10">
                <GraduationCap size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-700 relative z-10">نقطة المدارس العليا</h3>
              <div className="text-5xl font-black text-primary drop-shadow-sm relative z-10">
                {scorePonderee}
              </div>
              <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed relative z-10">
                مبنية على 75% للوطني و 25% للجهوي، وتعتمد في ENSA, ENCG, FMP
              </p>
            </div>
          </div>
        </motion.div>

        {/* Seuils Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-12 space-y-6"
        >
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl mb-8">
            <AlertTriangle size={24} className="text-amber-500 shrink-0" />
            <p className="text-sm font-semibold leading-relaxed">
              ملاحظة هامة: هاد العتبات (Seuils) تقريبية ومبنية على السنوات الماضية. كتقدر تطلع أو تهبط كل عام على حساب النقط ديال التلامذ وعدد المقاعد المتوفرة.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-right">
            {HISTORICAL_SEUILS.map(school => (
              <div key={school.id} className={`bg-white p-6 rounded-2xl border-2 ${school.border} shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
                <div className={`absolute top-0 right-0 w-2 h-full ${school.bg}`}></div>
                
                <div className="flex items-start justify-between gap-4 mb-4 z-10 relative">
                  <div className={`p-3 rounded-xl ${school.bg} ${school.color}`}>
                    <school.icon size={24} />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="font-bold text-slate-800 text-lg">{school.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">{school.streams}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-100 z-10 relative group-hover:border-slate-200 transition-colors">
                  <span className="text-sm font-bold text-slate-600">العتبة المتوقعة:</span>
                  <span className={`text-xl font-black ${school.color} drop-shadow-sm`} dir="ltr">{school.range}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }
