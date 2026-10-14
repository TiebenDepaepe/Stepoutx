import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const storedItems = [
  {
    name: 'plottwist-cookie-notice',
    purpose: 'Onthoudt dat je de cookiemelding hebt gesloten, zodat ze niet bij elk bezoek terugkomt.',
    type: 'Lokale opslag (localStorage), functioneel',
    duration: 'Tot je je browsergegevens wist',
  },
  {
    name: 'plottwist-auth-token',
    purpose: 'Houdt beheerders ingelogd op het afgeschermde admin-gedeelte. Gewone bezoekers krijgen dit nooit.',
    type: 'Lokale opslag (localStorage), strikt noodzakelijk',
    duration: 'Tot je uitlogt',
  },
];

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal mb-6">
          Cookiebeleid
        </h1>
        <p className="text-charcoal/70 mb-4 leading-relaxed">
          Deze website gebruikt <strong>geen tracking-, analyse- of
          marketingcookies</strong>. We volgen je dus niet en tonen geen
          gepersonaliseerde advertenties. Daarom vragen we ook geen toestemming:
          wat we bewaren, is enkel nodig om de site te laten werken.
        </p>
        <p className="text-charcoal/50 text-sm mb-10">Laatst bijgewerkt: 14 oktober 2026</p>

        <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
          Wat we in je browser bewaren
        </h2>
        <div className="space-y-4 mb-10">
          {storedItems.map((item) => (
            <div key={item.name} className="card-pastel bg-mint-light">
              <p className="font-mono text-sm text-charcoal mb-2">{item.name}</p>
              <p className="text-charcoal/80 mb-2">{item.purpose}</p>
              <p className="text-sm text-charcoal/60">
                {item.type} · Bewaartermijn: {item.duration}
              </p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
          Diensten van derden
        </h2>
        <ul className="list-disc pl-5 space-y-3 text-charcoal/70 leading-relaxed mb-10">
          <li>
            <strong>Google Fonts</strong>: de lettertypes van deze site worden
            geladen via Google. Daarbij ontvangt Google je IP-adres. Google Fonts
            plaatst geen cookies.
          </li>
          <li>
            <strong>Supabase</strong>: bewaart inschrijvingen en de video's op
            deze site. Voor gewone bezoekers plaatst Supabase geen cookies.
          </li>
          <li>
            <strong>Sociale media</strong>: de knoppen naar YouTube, TikTok en
            Instagram zijn gewone links. Pas als je erop klikt, kom je op hun
            website, waar hun eigen cookiebeleid geldt.
          </li>
        </ul>

        <h2 className="font-display text-2xl font-bold text-charcoal mb-4">
          Zelf wissen
        </h2>
        <p className="text-charcoal/70 leading-relaxed">
          Je kan alles wat deze site bewaart op elk moment verwijderen via de
          instellingen van je browser, onder "sitegegevens" of "cookies en
          websitegegevens".
        </p>
      </main>
      <Footer />
    </div>
  );
}
