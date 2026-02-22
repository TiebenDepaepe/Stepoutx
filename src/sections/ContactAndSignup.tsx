import { useEffect, useRef, useState } from 'react';
import { Mail, CheckCircle, Clock, XCircle, ArrowRight, Sparkles, Send, Upload, Check, User, Calendar, Heart, Users, Shield, Camera, Video } from 'lucide-react';

// Form data and options
const availableDates = ['6-12 april 2025', '20-26 april 2025', '4-10 mei 2025', '18-24 mei 2025', '1-7 juni 2025', '15-21 juni 2025'];
const motivationOptions = ['nieuwe vrienden', 'zelfvertrouwen', 'avontuur', 'uit comfortzone', 'even weg uit mijn omgeving', 'iets totaal nieuws proberen'];
const personalityOptions = ['rustig', 'sociaal', 'humoristisch', 'gevoelig', 'direct', 'spontaan', 'zorgzaam', 'avontuurlijk', 'georganiseerd', 'dromerig'];
const groupRoleOptions = [{ value: 'stille-observator', label: 'de stille observator' }, { value: 'rustig-aanwezig', label: 'rustig maar aanwezig' }, { value: 'snel-praten', label: 'iemand die snel praat met iedereen' }, { value: 'grappenmaker', label: 'de grappenmaker' }, { value: 'initiatief', label: 'degene die initiatief neemt' }];
const excitementOptions = [{ value: 'nieuwe-mensen', label: 'nieuwe mensen leren kennen' }, { value: 'liften', label: 'liften' }, { value: 'overnachten', label: 'overnachten bij onbekenden' }, { value: 'geen-planning', label: 'geen vaste planning' }, { value: 'fysiek', label: 'fysiek moe worden' }];

interface FormData {
  naam: string; leeftijd: string; woonplaats: string; gsm: string; email: string; instagram: string;
  beschikbaarheid: string[]; motivatie: string; doelen: string[];
  persoonlijkheid: string[]; groepsrol: string; spannendst: string; ongemakkelijk: string; waaromPassen: string;
  medisch: boolean; medischUitleg: string; noodcontactNaam: string; noodcontactGsm: string;
  foto: File | null; video: File | null;
}

const initialFormData: FormData = {
  naam: '', leeftijd: '', woonplaats: '', gsm: '', email: '', instagram: '',
  beschikbaarheid: [], motivatie: '', doelen: [],
  persoonlijkheid: [], groepsrol: '', spannendst: '', ongemakkelijk: '', waaromPassen: '',
  medisch: false, medischUitleg: '', noodcontactNaam: '', noodcontactGsm: '',
  foto: null, video: null,
};

const responseOptions = [
  { icon: CheckCircle, title: 'Geselecteerd', description: 'Je krijgt een voorstel met datum en groep, en kan je plek bevestigen met een voorschot.', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  { icon: Clock, title: 'Wachtlijst', description: 'Je past bij het concept, maar de groep zit vol. Je wordt gecontacteerd als er een plek vrijkomt.', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { icon: XCircle, title: 'Niet geselecteerd', description: 'De reis past op dit moment niet goed bij jou of bij de groep.', bgColor: 'bg-red-100', iconColor: 'text-red-500' },
];

export default function ContactAndSignup() {
  const [isVisible, setIsVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.05 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: keyof FormData, value: string, max?: number) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      if (current.includes(value)) return { ...prev, [field]: current.filter((v) => v !== value) };
      if (max && current.length >= max) return prev;
      return { ...prev, [field]: [...current, value] };
    });
  };

  const handleRadioChange = (field: keyof FormData, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleFileChange = (field: 'foto' | 'video', file: File | null) => setFormData((prev) => ({ ...prev, [field]: file }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    console.log('Form submitted:', formData);
  };

  const revealForm = () => {
    setShowForm(true);
    setTimeout(() => {
      const formElement = document.getElementById('signup-form');
      if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  if (submitted) {
    return (
      <section ref={sectionRef} className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-mint to-lavender rounded-3xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">Bedankt voor je inschrijving!</h2>
            <p className="text-charcoal/70 text-lg">We nemen zo snel mogelijk contact met je op. Hou je mailbox in de gaten!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="contact" className="relative bg-white">
      {/* PART 1: Contact Info Section - no border, no shadow, less padding */}
      <div className="pt-16 md:pt-20 pb-4 relative overflow-hidden">
        <div className="absolute top-10 left-[10%] w-32 h-32 bg-lavender/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-[10%] w-40 h-40 bg-mint/30 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-lavender/50 rounded-full text-sm font-medium text-charcoal mb-6">
                <Sparkles className="w-4 h-4 text-purple-accent" />
                INSCHRIJVEN
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-charcoal mb-4">
                Klaar om mee te gaan?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-8">
              <div className="space-y-4 flex flex-col justify-center">
                <p className="text-lg text-charcoal/80 leading-relaxed">
                  Je vult het <span className="font-semibold text-charcoal bg-purple-200/60 rounded px-1">inschrijfformulier</span> in met een paar vragen over jezelf, je motivatie en je beschikbaarheid.
                </p>
                <p className="text-charcoal/70 leading-relaxed">
                  Op basis daarvan stelt <span className="font-medium text-purple-accent">Daria</span> de groepen samen. Daarna krijg je altijd een mail met één van deze drie antwoorden:
                </p>
              </div>

              <div className="space-y-3">
                {responseOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.title} className={`flex items-start gap-3 p-4 ${option.bgColor} rounded-2xl transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`} style={{ transitionDelay: `${(index + 1) * 100}ms` }}>
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Icon className={`w-4 h-4 ${option.iconColor}`} />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-charcoal text-sm">{option.title}</h4>
                        <p className="text-xs text-charcoal/70 leading-relaxed mt-0.5">{option.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-center text-sm text-charcoal/50">
              Zo blijven de groepen klein en goed samengesteld.
            </p>
          </div>
        </div>
      </div>

      {/* PART 2: Form Section with Gradient Reveal - less top padding */}
      <div id="signup-form" className="relative">
        <div 
          className={`relative transition-all duration-700 ease-out ${showForm ? 'max-h-[8000px]' : 'max-h-[450px]'} overflow-hidden`}
        >
          {/* Gradient overlay when hidden - creates the peek effect */}
          {!showForm && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="h-full w-full bg-gradient-to-b from-white via-white/80 via-white/50 via-white/20 to-transparent" />
            </div>
          )}

          {/* Form content - less top padding */}
          <div className="pt-2 pb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-lavender/10 to-white" />
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              {/* Form Header - partially visible */}
              <div className={`text-center mb-6 transition-all duration-500 ${showForm ? 'opacity-100' : 'opacity-50'}`}>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-charcoal mb-2">
                  Inschrijfformulier
                </h3>
                <p className="text-charcoal/60">
                  Vul alle velden in zodat we je goed kunnen plaatsen
                </p>
              </div>

              {/* Part 1 - Basic Info (partially visible with more fields) */}
              <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5 transition-opacity duration-500 ${showForm ? 'opacity-100' : 'opacity-30'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-lavender rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-accent" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-charcoal">Deel 1 – Basis</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Naam *</label>
                    <input type="text" name="naam" value={formData.naam} onChange={handleTextChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all" placeholder="Jouw naam" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Leeftijd *</label>
                    <input type="number" name="leeftijd" value={formData.leeftijd} onChange={handleTextChange} required min="18" max="25" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all" placeholder="18-25" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Woonplaats *</label>
                    <input type="text" name="woonplaats" value={formData.woonplaats} onChange={handleTextChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all" placeholder="Stad/dorp" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">GSM-nummer *</label>
                    <input type="tel" name="gsm" value={formData.gsm} onChange={handleTextChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all" placeholder="+32 4XX XX XX XX" />
                  </div>
                </div>
              </div>

              {/* Rest of form - only visible when revealed */}
              {showForm && (
                <form onSubmit={handleSubmit} className="space-y-8 mt-8">
                  {/* Part 2 - Availability */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-mint rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-accent" />
                      </div>
                      <h4 className="text-lg font-display font-bold text-charcoal">Deel 2 – Beschikbaarheid</h4>
                    </div>
                    <p className="text-sm text-charcoal/70 mb-4">Welke data kan je? (meerkeuze)</p>
                    <div className="flex flex-wrap gap-2">
                      {availableDates.map((date) => (
                        <button key={date} type="button" onClick={() => handleCheckboxChange('beschikbaarheid', date)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.beschikbaarheid.includes(date) ? 'bg-purple-accent text-white' : 'bg-gray-100 text-charcoal hover:bg-purple-accent/10'}`}>
                          {date}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Part 3 - Motivation */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blush rounded-xl flex items-center justify-center">
                        <Heart className="w-5 h-5 text-purple-accent" />
                      </div>
                      <h4 className="text-lg font-display font-bold text-charcoal">Deel 3 – Motivatie</h4>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Waarom wil je mee met StepOut? *</label>
                        <textarea name="motivatie" value={formData.motivatie} onChange={handleTextChange} required rows={4} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all resize-none" placeholder="Vertel ons waarom je mee wilt..." />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Wat hoop je uit deze reis te halen? <span className="text-charcoal/50">(kies max. 2)</span></label>
                        <div className="flex flex-wrap gap-2">
                          {motivationOptions.map((option) => (
                            <button key={option} type="button" onClick={() => handleCheckboxChange('doelen', option, 2)} className={`px-4 py-2 rounded-full text-sm transition-all ${formData.doelen.includes(option) ? 'bg-purple-accent text-white' : 'bg-gray-100 text-charcoal hover:bg-purple-accent/10'}`}>
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Part 4 - Personality */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-sky-soft rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-accent" />
                      </div>
                      <h4 className="text-lg font-display font-bold text-charcoal">Deel 4 – Persoonlijkheid & groepsdynamiek</h4>
                    </div>
                    <div className="space-y-8">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Hoe zouden je vrienden jou omschrijven? <span className="text-charcoal/50">(kies max. 3)</span></label>
                        <div className="flex flex-wrap gap-2">
                          {personalityOptions.map((option) => (
                            <button key={option} type="button" onClick={() => handleCheckboxChange('persoonlijkheid', option, 3)} className={`px-3 py-2 rounded-full text-sm transition-all ${formData.persoonlijkheid.includes(option) ? 'bg-purple-accent text-white' : 'bg-gray-100 text-charcoal hover:bg-purple-accent/10'}`}>
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">In een nieuwe groep ben jij meestal: *</label>
                        <div className="space-y-2">
                          {groupRoleOptions.map((option) => (
                            <label key={option.value} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.groepsrol === option.value ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="groepsrol" value={option.value} checked={formData.groepsrol === option.value} onChange={(e) => handleRadioChange('groepsrol', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Wat vind je het spannendst aan deze reis? *</label>
                        <div className="space-y-2">
                          {excitementOptions.map((option) => (
                            <label key={option.value} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.spannendst === option.value ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="spannendst" value={option.value} checked={formData.spannendst === option.value} onChange={(e) => handleRadioChange('spannendst', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Hoe ga jij meestal om met ongemakkelijke of spannende situaties? *</label>
                        <textarea name="ongemakkelijk" value={formData.ongemakkelijk} onChange={handleTextChange} required rows={3} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all resize-none" placeholder="Beschrijf kort..." />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Waarom zou jij goed in een StepOut-groep passen? *</label>
                        <textarea name="waaromPassen" value={formData.waaromPassen} onChange={handleTextChange} required rows={3} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all resize-none" placeholder="Vertel ons waarom..." />
                      </div>
                    </div>
                  </div>

                  {/* Part 5 - Practical */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-mint rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-purple-accent" />
                      </div>
                      <h4 className="text-lg font-display font-bold text-charcoal">Deel 5 – Praktisch & veiligheid</h4>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Heb je medische zaken of allergieën waar we rekening mee moeten houden?</label>
                        <div className="flex gap-4 mb-3">
                          <label className="flex items-center gap-2">
                            <input type="radio" name="medisch" checked={!formData.medisch} onChange={() => setFormData((prev) => ({ ...prev, medisch: false, medischUitleg: '' }))} className="w-5 h-5 text-purple-accent" />
                            <span className="text-charcoal">Nee</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="medisch" checked={formData.medisch} onChange={() => setFormData((prev) => ({ ...prev, medisch: true }))} className="w-5 h-5 text-purple-accent" />
                            <span className="text-charcoal">Ja</span>
                          </label>
                        </div>
                        {formData.medisch && (
                          <textarea name="medischUitleg" value={formData.medischUitleg} onChange={handleTextChange} rows={3} className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all resize-none" placeholder="Leg uit..." />
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">Noodcontact naam *</label>
                          <input type="text" name="noodcontactNaam" value={formData.noodcontactNaam} onChange={handleTextChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all" placeholder="Naam" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">Noodcontact GSM *</label>
                          <input type="tel" name="noodcontactGsm" value={formData.noodcontactGsm} onChange={handleTextChange} required className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all" placeholder="+32 4XX XX XX XX" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Part 6 - Optional Uploads */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-lavender rounded-xl flex items-center justify-center">
                        <Camera className="w-5 h-5 text-purple-accent" />
                      </div>
                      <h4 className="text-lg font-display font-bold text-charcoal">Deel 6 – Optioneel (maar waardevol)</h4>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Upload een foto <span className="text-charcoal/50">(optioneel)</span></label>
                        <div className="relative">
                          <input type="file" accept="image/*" onChange={(e) => handleFileChange('foto', e.target.files?.[0] || null)} className="hidden" id="foto-upload" />
                          <label htmlFor="foto-upload" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-dashed border-charcoal/20 cursor-pointer hover:border-purple-accent hover:bg-purple-accent/5 transition-all">
                            <Upload className="w-5 h-5 text-charcoal/50" />
                            <span className="text-charcoal/70">{formData.foto ? formData.foto.name : 'Klik om een foto te uploaden'}</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Upload een korte video <span className="text-charcoal/50">(15–30 sec, optioneel)</span></label>
                        <p className="text-xs text-charcoal/50 mb-3">Vertel kort wie je bent en waarom je mee wil.</p>
                        <div className="relative">
                          <input type="file" accept="video/*" onChange={(e) => handleFileChange('video', e.target.files?.[0] || null)} className="hidden" id="video-upload" />
                          <label htmlFor="video-upload" className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-dashed border-charcoal/20 cursor-pointer hover:border-purple-accent hover:bg-purple-accent/5 transition-all">
                            <Video className="w-5 h-5 text-charcoal/50" />
                            <span className="text-charcoal/70">{formData.video ? formData.video.name : 'Klik om een video te uploaden'}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center pt-4">
                    <button type="submit" className="inline-flex items-center gap-3 px-10 py-4 bg-charcoal text-white font-display font-bold text-lg rounded-2xl hover:bg-charcoal/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                      <Send className="w-5 h-5" />
                      Verstuur inschrijving
                    </button>
                    <p className="text-sm text-charcoal/50 mt-4">Door te versturen ga je akkoord met onze voorwaarden</p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Button overlay - positioned on top of the peeking form */}
        {!showForm && (
          <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center">
            <button 
              onClick={revealForm}
              className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-white font-display font-bold text-lg rounded-2xl hover:bg-charcoal/90 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
            >
              <Mail className="w-5 h-5" />
              Schrijf je hier in
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
