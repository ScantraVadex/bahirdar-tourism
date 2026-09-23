import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Sun, 
  Plane, 
  HeartHandshake, 
  Languages, 
  Coins, 
  Backpack, 
  ShieldAlert, 
  PhoneCall,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function TravelGuidePage() {
  const amharicPhrases = [
    { amharic: 'Selam (ሰላም)', english: 'Hello / Peace', pronunciation: 'Seh-lahm' },
    { amharic: 'Ameseginalehu (አመሰግናለሁ)', english: 'Thank you very much', pronunciation: 'Ah-meh-seh-geh-nah-leh-hoo' },
    { amharic: 'Yikreta (ይቅርታ)', english: 'Excuse me / Sorry', pronunciation: 'Yee-kreh-tah' },
    { amharic: 'Sint new? (ስንት ነው?)', english: 'How much is it?', pronunciation: 'Sint neh-w' },
    { amharic: 'Konjo (ቆንጆ)', english: 'Beautiful / Good', pronunciation: 'Kon-joh' },
    { amharic: 'Eshi (እሺ)', english: 'OK / Alright / Yes', pronunciation: 'Eh-shee' },
    { amharic: 'Bunna (ቡና)', english: 'Coffee', pronunciation: 'Boon-nah' },
    { amharic: 'Asa (ዓሣ)', english: 'Fish', pronunciation: 'Ah-sah' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2 block">
              Essential Travel Knowledge
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Bahir Dar Visitor Travel Guide
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Plan your journey to Lake Tana with essential practical advice on weather, airport transfers, etiquette, currency, and local safety.
            </p>
          </div>

          <div className="space-y-10">
            {/* 1. Best Time to Visit */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
                  <Sun className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Best Time to Visit & Climate
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Bahir Dar enjoys a warm, pleasant tropical highland climate due to its altitude (1,800m above sea level).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-sky-700 block mb-1">
                    October – March (Peak Season):
                  </span>
                  Sunny, dry weather with pleasant lake breezes. Ideal for monastery boat cruises, city cycling, and the vibrant Timkat Epiphany festival in January.
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-emerald-700 block mb-1">
                    August – November (Peak Waterfall Volume):
                  </span>
                  Best time to experience the Blue Nile Falls in full roar after the summer rains. Surrounding hills are brilliantly green.
                </div>
              </div>
            </div>

            {/* 2. Transportation */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600">
                  <Plane className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Getting Around & Transportation
                </h2>
              </div>
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                <p>
                  <strong>By Air:</strong> Ethiopian Airlines operates multiple daily flights between Addis Ababa (Bole International) and Bahir Dar (Ginbot 20 Airport / BJR), taking only 50 minutes. Most hotels offer complimentary airport shuttles.
                </p>
                <p>
                  <strong>In the City:</strong> Bahir Dar is famous for three-wheel blue "Bajaj" auto-rickshaws, offering affordable rides anywhere in downtown (typically 50–150 ETB). Bicycles are also widely rented along the flat, palm-lined avenues.
                </p>
                <p>
                  <strong>Lake Tana Boat Charters:</strong> Licensed motorized boats can be hired at the main port jetty for half-day or full-day monastery excursions.
                </p>
              </div>
            </div>

            {/* 3. Cultural Etiquette & Customs */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Local Customs & Monastery Etiquette
                </h2>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dress Modestly:</strong> When visiting Orthodox monasteries, cover shoulders and knees. White traditional shawls (Netela) are worn respectfully.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Remove Shoes:</strong> Remove footwear before stepping inside the carpeted church sanctuary.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Monastery Access:</strong> Some island monasteries (e.g. Dega Estifanos) are historically male-only monastic communities, while peninsula monasteries like Ura Kidane Mehret welcome all visitors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Photography:</strong> Always ask permission before photographing clergy, monks, or local craftspeople. Flash photography is prohibited on historic frescoes.</span>
                </li>
              </ul>
            </div>

            {/* 4. Useful Amharic Phrases */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
                  <Languages className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Useful Local Amharic Phrases
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {amharicPhrases.map((phrase, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-sm text-slate-900 block">{phrase.amharic}</span>
                    <span className="text-xs text-sky-700 font-semibold block">{phrase.english}</span>
                    <span className="text-[11px] text-slate-400 italic">"{phrase.pronunciation}"</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Currency & Packing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
                    <Coins className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Currency & Banking</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  The local currency is the <strong>Ethiopian Birr (ETB)</strong>. Commercial Bank of Ethiopia (CBE), Dashen Bank, and Awash Bank ATMs are widely available across Bahir Dar. High-end resorts accept Visa/Mastercard; carry cash for boat tours and market stalls.
                </p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600">
                    <Backpack className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">What to Bring</h3>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Sturdy walking shoes for Blue Nile gorge hike</li>
                  <li>Sun hat, sunglasses, and high-SPF sunscreen</li>
                  <li>Light sweater/jacket for cool lake breeze evenings</li>
                  <li>Binoculars for Lake Tana hippo & pelican watching</li>
                  <li>Insect repellent for evening lakeshore walks</li>
                </ul>
              </div>
            </div>

            {/* 6. Safety & Emergency Contacts */}
            <div id="safety" className="bg-rose-50/70 p-8 rounded-3xl border border-rose-200 shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-2xl bg-rose-600 text-white">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Safety & Emergency Contacts
                </h2>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                Bahir Dar is widely known as one of Ethiopia’s safest, most peaceful cities. In the rare event of an emergency, use the verified numbers below:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                <div className="p-3 bg-white rounded-xl border border-rose-200 text-rose-900">
                  <span className="block text-slate-500 font-normal">Tourist Police Unit</span>
                  <span className="text-sm font-bold text-rose-600">Dial: 991 / +251 58 220 0022</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-200 text-rose-900">
                  <span className="block text-slate-500 font-normal">Felege Hiwot Referral Hospital</span>
                  <span className="text-sm font-bold text-rose-600">Dial: +251 58 220 0511</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-200 text-rose-900">
                  <span className="block text-slate-500 font-normal">Fire & Rescue Service</span>
                  <span className="text-sm font-bold text-rose-600">Dial: 939</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
