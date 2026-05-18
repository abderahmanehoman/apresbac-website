import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

// تفعيل طاقية الإخفاء
puppeteer.use(StealthPlugin());

// Load environment variables if available
dotenv.config();

// ==========================================
// 1. Configuration
// ==========================================
const supabaseUrl = 'https://eiqwwtoodkibmpnigwvk.supabase.co';
const supabaseKey = 'sb_publishable_XlA7CgWOatF8bNE2DNUvPA_wBVYyXVy';
const supabase = createClient(supabaseUrl, supabaseKey);

// Use the new SDK for Gemini as per AI Studio setup
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "process.env.GEMINI_API_KEY" });

// ==========================================
// 2. Targeted Websites & Extractors
// ==========================================
const SITES = [
    { 
        name: "Orientation Chabab", 
        url: "https://orientation-chabab.com/baccalaureat", 
        // Generalized Selectors for articles
        linkSelector: "h2 a, h3 a, .post-title a" 
    },
    { 
        name: "9rayti", 
        url: "https://www.9rayti.com/actualites?q=&month=&year=2026", 
        linkSelector: "h2 a, h3 a, .actualite-item a, .news-title a" 
    },
    { 
        name: "Moutamadris", 
        url: "https://moutamadris.ma/concours/", 
        linkSelector: "h2.entry-title a, h3.entry-title a" 
    },
    { 
        name: "Tawjihnet", 
        url: "https://www.tawjihnet.net/", 
        linkSelector: "h2.entry-title a, h3.entry-title a, .post-title a" 
    }
];

// Helper: Basic filter to ignore explicit job links before wasting AI tokens
const isJobOrAd = (link) => {
    const lowerLink = link.toLowerCase();
    const badKeywords = ['emploi', 'recrutement', 'fonction-publique', 'ofppt-recrute', 'pub', 'anapec'];
    return badKeywords.some(keyword => lowerLink.includes(keyword));
};

// ==========================================
// 3. The Smart Logic
// ==========================================
async function startSmartScraping() {
    console.log("🚀 باديين الماكينة الذكية بالـ Scraping (النسخة النهائية والمثالية)...");
    
    // Stealthy Puppeteer Launch
    const browser = await puppeteer.launch({ 
        headless: "new",
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled', // Bypass anti-bot checks
            '--window-size=1920,1080'
        ] 
    });
    
    const page = await browser.newPage();
    // Use a very realistic User Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7,ar;q=0.6',
    });

    for (const site of SITES) {
        console.log(`\n======================================`);
        console.log(`🕸️ كنسكانيو الموقع: ${site.name}`);
        console.log(`======================================`);
        
        try {
            // Wait for network to be idle to ensure dynamic content loads
            await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 60000 });
            
            // 📸 كاميرا المراقبة: غناخدو سكرينشوت باش نشوفو واش تخطينا الحماية
            console.log("📸 كناخدو سكرينشوت للتأكد من الحماية...");
            await page.screenshot({ path: `debug_${site.name.replace(/\s/g, '_')}.png` });
            
            // Extract links using Cheerio for speed & reliability
            const html = await page.content();
            const $ = cheerio.load(html);
            
            let articleLinks = [];
            
            // 🛠️ الحل ديال الروابط النسبية والمقطوعة
            $(site.linkSelector).each((i, el) => {
                let link = $(el).attr('href');
                
                if (link) {
                    // يلا كان الرابط ناقص (كيبدا بـ /)، نلصقو فيه الدومين الأصلي
                    if (!link.startsWith('http')) {
                        const baseUrl = new URL(site.url).origin;
                        link = baseUrl + (link.startsWith('/') ? '' : '/') + link;
                    }
                    
                    // غير باش نتأكدو بلي الرابط ماشي خاوي وماشي إعلان
                    if (!articleLinks.includes(link) && !isJobOrAd(link)) {
                        articleLinks.push(link);
                    }
                }
            });

            // Take only top 5 newest articles (Assuming websites list newest first)
            const newestLinks = articleLinks.slice(0, 5);
            console.log(`✅ لقينا ${newestLinks.length} روابط جديدة متوقعة.`);

            for (let link of newestLinks) {
                console.log(`\n🔎 كنفحصو الرابط: ${link}`);

                // 1. Check if already exists in Supabase to save AI Costs
                const { data: existing, error: dbError } = await supabase
                    .from('concours_news')
                    .select('link')
                    .eq('link', link)
                    .single();
                
                if (existing) { 
                    console.log("⏩ ديجا مسجل عندنا، غندوزو للخبر الجاي."); 
                    continue; 
                }

                // 2. Read the actual article content
                try {
                    // Random delay to mimic human behavior
                    const randomDelay = Math.floor(Math.random() * 3000) + 2000;
                    await new Promise(resolve => setTimeout(resolve, randomDelay));

                    await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 40000 });
                    
                    const content = await page.evaluate(() => {
                        // Attempt to target main article body, fallback to entire body if not found
                        const article = document.querySelector('article, .entry-content, .post-content, main, .contenu-article');
                        if (article) {
                            return article.innerText.slice(0, 2500); // 2500 chars is enough for Gemini to understand context
                        }
                        return document.body.innerText.slice(0, 2500);
                    });

                    if (content.length < 200) {
                        console.log("⚠️ المحتوى خاوي بزاف، يقدر يكون تصويرة ولا فيديو مقدرناش نقراوه.");
                        continue;
                    }

                    // 3. AI Analysis & STRICT Filtering
                    console.log("🤖 كنفيلتريو ونحللو بـ Gemini...");
                    
                    // The Strict Prompt
                    const prompt = `أنت خبير توجيه مغربي ومصنف بيانات دقيق. اليوم هو سنة 2026. 
هدفك: تحليل المقال التالي واستخراج معلومات مباريات ولوج المدارس العليا (Post-Bac) فقط لعرضها للتلاميذ.

شروط هامة جدا:
1. يجب أن يكون المقال يخص ولوج المدارس، المعاهد، أو الجامعات (دراسة بعد الباكالوريا).
2. ارفض رفضا قاطعا أي مقال يخص: فرص العمل (Recrutement/Emploi)، مباريات التوظيف، أو أخبار عامة لا تخص التوجيه المدرسي.
3. استخرج تاريخ آخر أجل للتسجيل (Deadline).

المحتوى:
${content}

رد بصيغة JSON فقط، بدون أي نص إضافي أو علامات مثل (\`\`\`json):
{
    "title": "عنوان قصير وواضح للمباراة (مثال: مباراة ولوج كليات الطب 2026)",
    "is_valid_schooling": true/false, 
    "is_2026": true/false,
    "category": "مدارس مهندسين/طب/تكوين مهني/جامعات/عسكرية",
    "deadline": "تاريخ محدد (مثلا 15 يونيو 2026) أو 'غير محدد'",
    "importance": "High/Medium/Low",
    "description": "وصف قصير مشوق بالدارجة المغربية (حوالي 20 كلمة) يوضح لمن هذه المباراة وشروطها الأساسية"
}`;

                    const result = await ai.models.generateContent({
                        model: "gemini-3-flash-preview", // Using fast flash model
                        contents: prompt
                    });
                    
                    const responseText = result.text;
                    
                    // Safe JSON Extraction Regex
                    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                    if (!jsonMatch) {
                        console.log("❌ Gemini ما رجعش JSON صحيح.");
                        continue;
                    }

                    const data = JSON.parse(jsonMatch[0]);
                    
                    // The Ultimate Filter Statement
                    if (data.is_valid_schooling && data.is_2026) {
                        // 4. Save to Database
                        const { error: insertError } = await supabase.from('concours_news').insert([{
                            title: data.title, 
                            category: data.category, 
                            importance: data.importance,
                            link: link, 
                            deadline: data.deadline, 
                            description: data.description
                        }]);
                        
                        if (insertError) {
                            console.log(`❌ خطأ فالتسجيل فـ Supabase: ${insertError.message}`);
                        } else {
                            console.log(`✅ تسجلات بنجاح! [${data.title}] 🚀`);
                        }
                    } else {
                        console.log(`🚫 ترفضات! إما ماشي قراية (فرصة عمل) أو ماشي 2026. (${data.title})`);
                    }
                } catch (artError) {
                    console.log(`⚠️ مشكل فـ قراءة هاد المقال: ${artError.message}`);
                }
            }
        } catch (siteError) {
            console.error(`🛑 مشكل فـ الدخول للموقع ${siteError.message}`);
        }
    }
    
    await browser.close();
    console.log("\n🏁 سالات المهمة! الماكينة الذكية سكتات والسلعة تنقات.");
}

startSmartScraping();
