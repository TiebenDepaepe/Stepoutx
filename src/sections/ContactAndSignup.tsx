import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, Clock, XCircle, ArrowRight, Sparkles, Send, Upload, Check, User, Calendar, Heart, Users, Shield, Camera, Video, Loader2, AlertCircle } from 'lucide-react';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { validateForm, validateFile } from '@/lib/validation';
import { CalendarDatePicker } from '@/components/calendar-date-picker';

// Form data and options
const motivationOptions = [
  'nieuwe vrienden maken',
  'meer zelfvertrouwen krijgen',
  'avontuur beleven',
  'uit mijn comfortzone komen',
  'even weg zijn uit mijn omgeving',
  'iets totaal nieuws proberen'
];
const personalityOptions = [
  'rustig',
  'sociaal',
  'humoristisch',
  'gevoelig',
  'direct',
  'spontaan',
  'zorgzaam',
  'avontuurlijk',
  'georganiseerd',
  'dromerig'
];
const groupRoleOptions = [
  'de stille observator',
  'rustig, maar aanwezig',
  'iemand die snel met iedereen praat',
  'de grappenmaker',
  'degene die initiatief neemt'
];
const excitementOptions = [
  'nieuwe mensen leren kennen',
  'liften',
  'overnachten bij onbekenden',
  'niet precies weten wat er gaat gebeuren',
  'fysiek moe worden'
];
const kmWandelenOptions = [
  'minder dan 10 km',
  '10 tot 15 km',
  '15 tot 20 km',
  'meer dan 20 km'
];
const meerdereDagenWandelenOptions = [
  'dat lijkt mij te zwaar',
  'dat wordt uitdagend, maar ik wil het proberen',
  'dat is voor mij haalbaar',
  'ik kijk juist uit naar de fysieke uitdaging'
];
const bereidTrainenOptions = [
  'ja',
  'misschien',
  'nee',
  'ik wandel of sport al voldoende'
];
const fysiekeUitdagingOptions = [
  'liever beperkt, ik ga vooral mee voor de groep en het avontuur',
  'gemiddeld, het mag uitdagend zijn',
  'veel, ik wil mezelf fysiek echt uitdagen',
  'zeer veel, hoe zwaarder hoe beter'
];
const sportiviteitOptions = [
  'ik sport bijna nooit',
  'ik sport af en toe',
  'ik sport één tot drie keer per week',
  'ik sport meer dan drie keer per week'
];
const socialeInteractieOptions = [
  'ik ben het liefst bijna altijd samen met de groep',
  'ik hou van een combinatie van groepsmomenten en eigen momenten',
  'ik heb regelmatig tijd voor mezelf nodig'
];
const reactieRegenMoeheidOptions = [
  'ik word snel stil, onzeker of gefrustreerd',
  'ik heb even tijd nodig, maar werk daarna weer mee',
  'ik probeer rustig te blijven en mee te zoeken',
  'ik probeer de sfeer goed te houden en neem initiatief'
];
const omgangTragerWandelenOptions = [
  'ik pas mijn tempo zonder probleem aan',
  'ik pas mijn tempo aan, maar vind dat soms lastig',
  'ik wil liever mijn eigen tempo blijven wandelen',
  'dat hangt af van de situatie'
];
const eigenMoeheidOptions = [
  'ik geef snel aan dat ik wil stoppen',
  'ik heb extra pauzes of aanmoediging nodig',
  'ik vertraag, maar probeer verder te gaan',
  'ik blijf doorgaan en probeer positief te blijven'
];
const omgangGroepsbeslissingOptions = [
  'ik pas mij meestal gewoon aan',
  'ik geef mijn mening, maar respecteer de beslissing',
  'ik probeer de anderen te overtuigen',
  'ik vind het moeilijk wanneer de groep niet voor mijn keuze gaat'
];
const omgangIrritatiesConflictenOptions = [
  'ik vermijd het gesprek',
  'ik bespreek het pas wanneer iemand anders erover begint',
  'ik probeer het rustig met de persoon te bespreken',
  'ik spreek het meestal meteen en direct uit'
];
const zelfstandigheidOptions = [
  'ik neem gemakkelijk initiatief',
  'ik denk actief mee, maar hoef niet de leiding te nemen',
  'ik volg meestal mee met de groep',
  'ik heb graag duidelijke begeleiding'
];
const watSpreektAanOptions = [
  'sociale uitdagingen, zoals gesprekken en opdrachten met onbekenden',
  'fysieke uitdagingen, zoals wandelen en actief bezig zijn',
  'een combinatie van beide'
];
const behoefteGroepMoeilijkOptions = [
  'rust en ruimte',
  'aanmoediging',
  'praktische hulp',
  'humor en afleiding',
  'duidelijke afspraken'
];

interface FormData {
  naam: string; leeftijd: string; woonplaats: string; gsm: string; email: string; instagram: string;
  beschikbaarheid: string[]; motivatie: string; doelen: string[];
  persoonlijkheid: string[]; groepsrol: string; spannendst: string; ongemakkelijk: string; waaromPassen: string;
  
  // Deel 4 questions
  kmWandelen: string;
  meerdereDagenWandelen: string;
  bereidTrainen: string;
  fysiekeUitdaging: string;
  sportiviteit: string;
  lichamelijkeKlachten: string;
  lichamelijkeKlachtenUitleg: string;
  socialeInteractie: string;
  reactieRegenMoeheid: string;
  omgangTragerWandelen: string;
  eigenMoeheid: string;
  omgangGroepsbeslissing: string;
  omgangIrritatiesConflicten: string;
  zelfstandigheid: string;
  watSpreektAan: string;
  ergernissenAnderen: string;
  typePersoonBotsen: string;
  behoefteGroepMoeilijk: string;
  redenStoppen: string;

  medisch: boolean; medischUitleg: string; noodcontactNaam: string; noodcontactGsm: string;
  foto: File | null; video: File | null;
  agreement: boolean;
  privacyAgreement: boolean;
}

const initialFormData: FormData = {
  naam: '', leeftijd: '', woonplaats: '', gsm: '', email: '', instagram: '',
  beschikbaarheid: [], motivatie: '', doelen: [],
  persoonlijkheid: [], groepsrol: '', spannendst: '', ongemakkelijk: '', waaromPassen: '',
  
  kmWandelen: '',
  meerdereDagenWandelen: '',
  bereidTrainen: '',
  fysiekeUitdaging: '',
  sportiviteit: '',
  lichamelijkeKlachten: '',
  lichamelijkeKlachtenUitleg: '',
  socialeInteractie: '',
  reactieRegenMoeheid: '',
  omgangTragerWandelen: '',
  eigenMoeheid: '',
  omgangGroepsbeslissing: '',
  omgangIrritatiesConflicten: '',
  zelfstandigheid: '',
  watSpreektAan: '',
  ergernissenAnderen: '',
  typePersoonBotsen: '',
  behoefteGroepMoeilijk: '',
  redenStoppen: '',

  medisch: false, medischUitleg: '', noodcontactNaam: '', noodcontactGsm: '',
  foto: null, video: null,
  agreement: false,
  privacyAgreement: false,
};

const responseOptions = [
  { icon: CheckCircle, title: 'Geselecteerd', description: <>Je krijgt een voorstel met datum en groep, en kan je plek bevestigen met een <strong>250€ voorschot</strong>.</>, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  { icon: Clock, title: 'Wachtlijst', description: <>Je past bij het concept, maar de groep zit vol. Je wordt gecontacteerd als er een plek vrijkomt.</>, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { icon: XCircle, title: 'Niet geselecteerd', description: <>De expeditie past op dit moment niet goed bij jou of bij de groep.</>, bgColor: 'bg-red-100', iconColor: 'text-red-500' },
];

export default function ContactAndSignup() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const revealForm = () => setShowForm(true);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Form submission hook
  const { submitForm, isSubmitting, isError, error, uploadProgress } = useFormSubmit();
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.05 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));
    // Validate single field on blur
    const result = validateForm({ ...formData, [fieldName]: formData[fieldName as keyof FormData] });
    if (!result.success) {
      const fieldError = result.errors[fieldName];
      if (fieldError) {
        setFormErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
      }
    }
  };

  const handleCheckboxChange = (field: keyof FormData, value: string, max?: number) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      if (current.includes(value)) return { ...prev, [field]: current.filter((v) => v !== value) };
      if (max && current.length >= max) return prev;
      return { ...prev, [field]: [...current, value] };
    });
    // Clear error when user makes a selection
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleRadioChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user makes a selection
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const handleFileChange = (field: 'foto' | 'video', file: File | null) => {
    // Mark field as touched immediately so error shows
    setTouchedFields((prev) => new Set(prev).add(field));
    
    // Validate file first before setting it
    if (file) {
      const error = validateFile(file, field === 'foto' ? 'image' : 'video');
      if (error) {
        // Don't set the file if validation fails - keep previous or null
        setFormErrors((prev) => ({ ...prev, [field]: error }));
        // Still update the file input to show user selected something, 
        // but mark it as invalid
        setFormData((prev) => ({ ...prev, [field]: file }));
      } else {
        setFormErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
        setFormData((prev) => ({ ...prev, [field]: file }));
      }
    } else {
      // File was cleared
      setFormData((prev) => ({ ...prev, [field]: null }));
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouchedFields(new Set(Object.keys(formData)));
    
    // Validate entire form before submission
    const validationResult = validateForm(formData);
    
    if (!validationResult.success) {
      setFormErrors(validationResult.errors);
      
      // Scroll to first error
      const firstErrorField = Object.keys(validationResult.errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"], [data-field="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (errorElement as HTMLElement).focus();
      }
      return;
    }

    // Validate physical complaints explanation if 'ja' is selected
    if (formData.lichamelijkeKlachten === 'ja' && !formData.lichamelijkeKlachtenUitleg.trim()) {
      setFormErrors(prev => ({ ...prev, lichamelijkeKlachtenUitleg: 'Vul de uitleg in voor je lichamelijke klachten' }));
      const errorElement = document.querySelector(`[name="lichamelijkeKlachtenUitleg"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (errorElement as HTMLElement).focus();
      }
      return;
    }
    
    // Clear any previous errors
    setFormErrors({});

    // Map physical complaints for database submission
    const submissionData = { ...formData };
    if (formData.lichamelijkeKlachten === 'ja') {
      submissionData.lichamelijkeKlachten = `ja, namelijk: ${formData.lichamelijkeKlachtenUitleg}`;
    }
    
    const result = await submitForm(submissionData);
    
    if (result.success) {
      setSubmitted(true);
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    }
  };

  // Helper to show error message for a field
  const getFieldError = (fieldName: string): string | null => {
    return touchedFields.has(fieldName) ? formErrors[fieldName] || null : null;
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
    <section ref={sectionRef} id="contact" className="relative bg-white pb-16 md:pb-24">
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
      {/* 
        STRUCTURE NOTE FOR FUTURE DEVELOPERS:
        This section has a "peek" effect where the form is partially hidden until clicked.
        The clipped-container (the div with max-h-[450px] or max-h-[8000px]) controls the visible height.
        The reveal button MUST be positioned INSIDE this container to appear at the correct % height.
      */}
      <div id="signup-form" className="relative">
        {/* Clipped container: this is the positioning context for the reveal button */}
        <div 
          className={`relative transition-all duration-700 ease-out ${showForm ? 'max-h-none' : 'max-h-[450px] overflow-hidden'}`}
        >
          {/* Gradient overlay when hidden - creates the fade-out effect at the bottom */}
          {!showForm && (
            <div className="absolute inset-0 z-20 backdrop-blur-[1px]">
              <div className="h-full w-full bg-gradient-to-b from-white via-white via-[20%] to-transparent" />
            </div>
          )}

          {/* Form content - less top padding */}
          <div className="pt-2 pb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-lavender/10 to-white" />
            
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              {/* Form Header - partially visible */}
              <div className={`text-center mb-6 transition-all duration-500 ${showForm ? 'opacity-100' : 'opacity-70'}`}>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-charcoal mb-2">
                  Inschrijfformulier
                </h3>
                <p className="text-charcoal/60">
                  <span className="font-bold">belangrijke note:</span> je schrijft je ALLEEN in (vriend of vriendinnen samen is niet toegelaten). PlotTwist is bedoeld om nieuwe mensen te leren kennen. Wees eerlijk bij het invullen, we vormen diverse groepen, dus ook introverte of rustigere personen zijn helemaal welkom.
                </p>
                <p className="text-charcoal/60">
                  Vul alle velden in zodat we je goed kunnen plaatsen
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 mt-8">
                {/* Part 1 - Basic Info (partially visible with more fields) */}
                <div className={`bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5 transition-opacity duration-500 ${showForm ? 'opacity-100' : 'opacity-60'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-lavender rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-accent" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-charcoal">Deel 1 – Basis</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Naam *</label>
                    <input 
                      type="text" 
                      name="naam" 
                      value={formData.naam} 
                      onChange={handleTextChange} 
                      onBlur={() => handleBlur('naam')}
                      required 
                      className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all ${
                        getFieldError('naam') 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                      }`} 
                      placeholder="Jouw naam" 
                    />
                    {getFieldError('naam') && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError('naam')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Leeftijd *</label>
                    <input 
                      type="number" 
                      name="leeftijd" 
                      value={formData.leeftijd} 
                      onChange={handleTextChange} 
                      onBlur={() => handleBlur('leeftijd')}
                      required 
                      min="18" 
                      max="26" 
                      className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all ${
                        getFieldError('leeftijd') 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                      }`} 
                      placeholder="18-26" 
                    />
                    {getFieldError('leeftijd') && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError('leeftijd')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Woonplaats *</label>
                    <input 
                      type="text" 
                      name="woonplaats" 
                      value={formData.woonplaats} 
                      onChange={handleTextChange} 
                      onBlur={() => handleBlur('woonplaats')}
                      required 
                      className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all ${
                        getFieldError('woonplaats') 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                      }`} 
                      placeholder="Stad/dorp" 
                    />
                    {getFieldError('woonplaats') && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError('woonplaats')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">GSM-nummer *</label>
                    <input 
                      type="tel" 
                      name="gsm" 
                      value={formData.gsm} 
                      onChange={handleTextChange} 
                      onBlur={() => handleBlur('gsm')}
                      required 
                      className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all ${
                        getFieldError('gsm') 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                      }`} 
                      placeholder="+32 4XX XX XX XX" 
                    />
                    {getFieldError('gsm') && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError('gsm')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">E-mailadres *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleTextChange} 
                      onBlur={() => handleBlur('email')}
                      required 
                      className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all ${
                        getFieldError('email') 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                      }`} 
                      placeholder="jouw@email.be" 
                    />
                    {getFieldError('email') && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError('email')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Instagram <span className="text-charcoal/50">(optioneel)</span></label>
                    <input 
                      type="text" 
                      name="instagram" 
                      value={formData.instagram} 
                      onChange={handleTextChange} 
                      onBlur={() => handleBlur('instagram')}
                      className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all ${
                        getFieldError('instagram') 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                      }`} 
                      placeholder="@jouwprofiel" 
                    />
                    {getFieldError('instagram') && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError('instagram')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Rest of form - only visible when revealed */}
              {showForm && (
                <div className="space-y-8 mt-8">
                  {/* Part 2 - Availability */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-mint rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-accent" />
                      </div>
                      <h4 className="text-lg font-display font-bold text-charcoal">Deel 2 – Beschikbaarheid</h4>
                    </div>
                    <div data-field="beschikbaarheid">
                      <CalendarDatePicker
                        selectedDates={formData.beschikbaarheid}
                        onChange={(dates) => {
                          setFormData(prev => ({ ...prev, beschikbaarheid: dates }));
                          // Clear error when user makes a selection
                          if (formErrors.beschikbaarheid) {
                            setFormErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors.beschikbaarheid;
                              return newErrors;
                            });
                          }
                        }}
                        error={getFieldError('beschikbaarheid')}
                      />
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
                        <label className="block text-sm font-medium text-charcoal mb-2">Waarom wil je mee met PlotTwist? *</label>
                        <textarea 
                          name="motivatie" 
                          value={formData.motivatie} 
                          onChange={handleTextChange} 
                          onBlur={() => handleBlur('motivatie')}
                          required 
                          rows={4} 
                          className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all resize-none ${
                            getFieldError('motivatie') 
                              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                              : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                          }`} 
                          placeholder="Vertel ons waarom je mee wilt..." 
                        />
                        {getFieldError('motivatie') && (
                          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('motivatie')}
                          </p>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Part 4 - Expectations, Walking & Group Dynamics */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-sky-soft rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-accent" />
                      </div>
                      <h4 className="text-lg font-display font-bold text-charcoal">Deel 4 – Verwachtingen, wandelen & groepsdynamiek</h4>
                    </div>
                    <div className="space-y-8">
                      {/* Q1: Wat hoop je uit deze expeditie te halen? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Wat hoop je uit deze expeditie te halen? <span className="text-charcoal/50">(Kies maximaal 2)</span> *</label>
                        <div data-field="doelen" className="flex flex-wrap gap-2">
                          {motivationOptions.map((option) => (
                            <button key={option} type="button" onClick={() => handleCheckboxChange('doelen', option, 2)} className={`px-4 py-2 rounded-full text-sm transition-all ${formData.doelen.includes(option) ? 'bg-purple-accent text-white' : 'bg-gray-100 text-charcoal hover:bg-purple-accent/10'}`}>
                              {option}
                            </button>
                          ))}
                        </div>
                        {getFieldError('doelen') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('doelen')}
                          </p>
                        )}
                      </div>

                      {/* Q2: Hoeveel kilometer kun jij op één dag wandelen met een volle rugzak? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Hoeveel kilometer kun jij op één dag wandelen met een volle rugzak? *</label>
                        <div data-field="kmWandelen" className={`space-y-2 rounded-xl p-1 ${getFieldError('kmWandelen') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {kmWandelenOptions.map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.kmWandelen === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="kmWandelen" value={option} checked={formData.kmWandelen === option} onChange={(e) => handleRadioChange('kmWandelen', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('kmWandelen') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('kmWandelen')}
                          </p>
                        )}
                      </div>

                      {/* Q3: Hoe sta je tegenover meerdere dagen na elkaar 15 km wandelen met een volle rugzak? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Hoe sta je tegenover meerdere dagen na elkaar 15 km wandelen met een volle rugzak? *</label>
                        <div data-field="meerdereDagenWandelen" className={`space-y-2 rounded-xl p-1 ${getFieldError('meerdereDagenWandelen') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {meerdereDagenWandelenOptions.map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.meerdereDagenWandelen === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="meerdereDagenWandelen" value={option} checked={formData.meerdereDagenWandelen === option} onChange={(e) => handleRadioChange('meerdereDagenWandelen', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('meerdereDagenWandelen') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('meerdereDagenWandelen')}
                          </p>
                        )}
                      </div>

                      {/* Q4: Ben je bereid om vooraf te trainen als je momenteel weinig wandelt? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Ben je bereid om vooraf te trainen als je momenteel weinig wandelt? *</label>
                        <div data-field="bereidTrainen" className={`space-y-2 rounded-xl p-1 ${getFieldError('bereidTrainen') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {bereidTrainenOptions.map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.bereidTrainen === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="bereidTrainen" value={option} checked={formData.bereidTrainen === option} onChange={(e) => handleRadioChange('bereidTrainen', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('bereidTrainen') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('bereidTrainen')}
                          </p>
                        )}
                      </div>

                      {/* Q5: Hoeveel fysieke uitdaging wil je tijdens PlotTwist? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Hoeveel fysieke uitdaging wil je tijdens PlotTwist? *</label>
                        <div data-field="fysiekeUitdaging" className={`space-y-2 rounded-xl p-1 ${getFieldError('fysiekeUitdaging') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {fysiekeUitdagingOptions.map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.fysiekeUitdaging === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="fysiekeUitdaging" value={option} checked={formData.fysiekeUitdaging === option} onChange={(e) => handleRadioChange('fysiekeUitdaging', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('fysiekeUitdaging') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('fysiekeUitdaging')}
                          </p>
                        )}
                      </div>

                      {/* Q6: Hoe sportief ben jij momenteel? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Hoe sportief ben jij momenteel? *</label>
                        <div data-field="sportiviteit" className={`space-y-2 rounded-xl p-1 ${getFieldError('sportiviteit') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {sportiviteitOptions.map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.sportiviteit === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="sportiviteit" value={option} checked={formData.sportiviteit === option} onChange={(e) => handleRadioChange('sportiviteit', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('sportiviteit') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('sportiviteit')}
                          </p>
                        )}
                      </div>

                      {/* Q7: Heb je lichamelijke klachten of beperkingen die wandelen met een rugzak moeilijker kunnen maken? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Heb je lichamelijke klachten of beperkingen die wandelen met een rugzak moeilijker kunnen maken? *</label>
                        <div data-field="lichamelijkeKlachten" className={`space-y-2 rounded-xl p-1 ${getFieldError('lichamelijkeKlachten') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {['nee', 'ja'].map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.lichamelijkeKlachten === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="lichamelijkeKlachten" value={option} checked={formData.lichamelijkeKlachten === option} onChange={(e) => handleRadioChange('lichamelijkeKlachten', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option === 'nee' ? 'nee' : 'ja, namelijk:'}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('lichamelijkeKlachten') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('lichamelijkeKlachten')}
                          </p>
                        )}
                        {formData.lichamelijkeKlachten === 'ja' && (
                          <div className="mt-3">
                            <textarea 
                              name="lichamelijkeKlachtenUitleg" 
                              value={formData.lichamelijkeKlachtenUitleg} 
                              onChange={handleTextChange} 
                              onBlur={() => handleBlur('lichamelijkeKlachtenUitleg')}
                              required 
                              rows={2} 
                              className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all resize-none ${
                                getFieldError('lichamelijkeKlachtenUitleg') 
                                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                                  : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                              }`} 
                              placeholder="Beschrijf je klachten of beperkingen..." 
                            />
                            {getFieldError('lichamelijkeKlachtenUitleg') && (
                              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {getFieldError('lichamelijkeKlachtenUitleg')}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Q8: Hoe zouden je vrienden jou omschrijven? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Hoe zouden je vrienden jou omschrijven? <span className="text-charcoal/50">(kies max. 3)</span> *</label>
                        <div data-field="persoonlijkheid" className="flex flex-wrap gap-2">
                          {personalityOptions.map((option) => (
                            <button key={option} type="button" onClick={() => handleCheckboxChange('persoonlijkheid', option, 3)} className={`px-3 py-2 rounded-full text-sm transition-all ${formData.persoonlijkheid.includes(option) ? 'bg-purple-accent text-white' : 'bg-gray-100 text-charcoal hover:bg-purple-accent/10'}`}>
                              {option}
                            </button>
                          ))}
                        </div>
                        {getFieldError('persoonlijkheid') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('persoonlijkheid')}
                          </p>
                        )}
                      </div>

                      {/* Q9: In een nieuwe groep ben jij meestal: */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">In een nieuwe groep ben jij meestal: *</label>
                        <div data-field="groepsrol" className={`space-y-2 rounded-xl p-1 ${getFieldError('groepsrol') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {groupRoleOptions.map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.groepsrol === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="groepsrol" value={option} checked={formData.groepsrol === option} onChange={(e) => handleRadioChange('groepsrol', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('groepsrol') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('groepsrol')}
                          </p>
                        )}
                      </div>

                      {/* Q10: Hoeveel sociale interactie vind je fijn tijdens een trip? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Hoeveel sociale interactie vind je fijn tijdens een trip? *</label>
                        <div data-field="socialeInteractie" className={`space-y-2 rounded-xl p-1 ${getFieldError('socialeInteractie') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {socialeInteractieOptions.map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.socialeInteractie === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="socialeInteractie" value={option} checked={formData.socialeInteractie === option} onChange={(e) => handleRadioChange('socialeInteractie', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('socialeInteractie') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('socialeInteractie')}
                          </p>
                        )}
                      </div>

                      {/* Q11: Wat vind je het spannendst aan deze expeditie? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Wat vind je het spannendst aan deze expeditie? *</label>
                        <div data-field="spannendst" className={`space-y-2 rounded-xl p-1 ${getFieldError('spannendst') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {excitementOptions.map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.spannendst === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="spannendst" value={option} checked={formData.spannendst === option} onChange={(e) => handleRadioChange('spannendst', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('spannendst') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('spannendst')}
                          </p>
                        )}
                      </div>

                      {/* Q12: Stel: het regent, iedereen is moe en jullie hebben nog geen slaapplek. Hoe reageer jij waarschijnlijk? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Stel: het regent, iedereen is moe en jullie hebben nog geen slaapplek. Hoe reageer jij waarschijnlijk? *</label>
                        <div data-field="reactieRegenMoeheid" className={`space-y-2 rounded-xl p-1 ${getFieldError('reactieRegenMoeheid') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {reactieRegenMoeheidOptions.map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.reactieRegenMoeheid === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="reactieRegenMoeheid" value={option} checked={formData.reactieRegenMoeheid === option} onChange={(e) => handleRadioChange('reactieRegenMoeheid', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('reactieRegenMoeheid') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('reactieRegenMoeheid')}
                          </p>
                        )}
                      </div>

                      {/* Q13: Hoe ga je om met iemand die trager wandelt dan jij? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Hoe ga je om met iemand die trager wandelt dan jij? *</label>
                        <div data-field="omgangTragerWandelen" className={`space-y-2 rounded-xl p-1 ${getFieldError('omgangTragerWandelen') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {omgangTragerWandelenOptions.map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.omgangTragerWandelen === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="omgangTragerWandelen" value={option} checked={formData.omgangTragerWandelen === option} onChange={(e) => handleRadioChange('omgangTragerWandelen', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('omgangTragerWandelen') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('omgangTragerWandelen')}
                          </p>
                        )}
                      </div>

                      {/* Q14: Wat doe je wanneer jij zelf tijdens een wandeling erg moe wordt? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Wat doe je wanneer jij zelf tijdens een wandeling erg moe wordt? *</label>
                        <div data-field="eigenMoeheid" className={`space-y-2 rounded-xl p-1 ${getFieldError('eigenMoeheid') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {eigenMoeheidOptions.map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.eigenMoeheid === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="eigenMoeheid" value={option} checked={formData.eigenMoeheid === option} onChange={(e) => handleRadioChange('eigenMoeheid', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('eigenMoeheid') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('eigenMoeheid')}
                          </p>
                        )}
                      </div>

                      {/* Q15: Hoe ga jij meestal om met ongemakkelijke of spannende situaties? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Hoe ga jij meestal om met ongemakkelijke of spannende situaties? *</label>
                        <textarea 
                          name="ongemakkelijk" 
                          value={formData.ongemakkelijk} 
                          onChange={handleTextChange} 
                          onBlur={() => handleBlur('ongemakkelijk')}
                          required 
                          rows={3} 
                          className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all resize-none ${
                            getFieldError('ongemakkelijk') 
                              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                              : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                          }`} 
                          placeholder="Vul hier je antwoord in..." 
                        />
                        {getFieldError('ongemakkelijk') && (
                          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('ongemakkelijk')}
                          </p>
                        )}
                      </div>

                      {/* Q16: Hoe ga je om met een groepsbeslissing waar jij het niet volledig mee eens bent? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Hoe ga je om met een groepsbeslissing waar jij het niet volledig mee eens bent? *</label>
                        <div data-field="omgangGroepsbeslissing" className={`space-y-2 rounded-xl p-1 ${getFieldError('omgangGroepsbeslissing') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {omgangGroepsbeslissingOptions.map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.omgangGroepsbeslissing === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="omgangGroepsbeslissing" value={option} checked={formData.omgangGroepsbeslissing === option} onChange={(e) => handleRadioChange('omgangGroepsbeslissing', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('omgangGroepsbeslissing') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('omgangGroepsbeslissing')}
                          </p>
                        )}
                      </div>

                      {/* Q17: Hoe ga jij om met irritaties of conflicten in een groep? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Hoe ga jij om met irritaties of conflicten in een groep? *</label>
                        <div data-field="omgangIrritatiesConflicten" className={`space-y-2 rounded-xl p-1 ${getFieldError('omgangIrritatiesConflicten') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {omgangIrritatiesConflictenOptions.map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.omgangIrritatiesConflicten === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="omgangIrritatiesConflicten" value={option} checked={formData.omgangIrritatiesConflicten === option} onChange={(e) => handleRadioChange('omgangIrritatiesConflicten', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('omgangIrritatiesConflicten') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('omgangIrritatiesConflicten')}
                          </p>
                        )}
                      </div>

                      {/* Q18: Hoe zelfstandig voel jij je tijdens een expeditie? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Hoe zelfstandig voel jij je tijdens een expeditie? *</label>
                        <div data-field="zelfstandigheid" className={`space-y-2 rounded-xl p-1 ${getFieldError('zelfstandigheid') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {zelfstandigheidOptions.map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.zelfstandigheid === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="zelfstandigheid" value={option} checked={formData.zelfstandigheid === option} onChange={(e) => handleRadioChange('zelfstandigheid', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('zelfstandigheid') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('zelfstandigheid')}
                          </p>
                        )}
                      </div>

                      {/* Q19: Wat spreekt jou het meest aan? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Wat spreekt jou het meest aan? *</label>
                        <div data-field="watSpreektAan" className={`space-y-2 rounded-xl p-1 ${getFieldError('watSpreektAan') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {watSpreektAanOptions.map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.watSpreektAan === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="watSpreektAan" value={option} checked={formData.watSpreektAan === option} onChange={(e) => handleRadioChange('watSpreektAan', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('watSpreektAan') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('watSpreektAan')}
                          </p>
                        )}
                      </div>

                      {/* Q20: Waarom zou jij goed in een PlotTwist-groep passen? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Waarom zou jij goed in een PlotTwist-groep passen? *</label>
                        <textarea 
                          name="waaromPassen" 
                          value={formData.waaromPassen} 
                          onChange={handleTextChange} 
                          onBlur={() => handleBlur('waaromPassen')}
                          required 
                          rows={3} 
                          className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all resize-none ${
                            getFieldError('waaromPassen') 
                              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                              : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                          }`} 
                          placeholder="Vul hier je antwoord in..." 
                        />
                        {getFieldError('waaromPassen') && (
                          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('waaromPassen')}
                          </p>
                        )}
                      </div>

                      {/* Q21: Waar zouden andere deelnemers zich mogelijk aan kunnen ergeren bij jou? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Waar zouden andere deelnemers zich mogelijk aan kunnen ergeren bij jou? *</label>
                        <textarea 
                          name="ergernissenAnderen" 
                          value={formData.ergernissenAnderen} 
                          onChange={handleTextChange} 
                          onBlur={() => handleBlur('ergernissenAnderen')}
                          required 
                          rows={3} 
                          className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all resize-none ${
                            getFieldError('ergernissenAnderen') 
                              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                              : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                          }`} 
                          placeholder="Vul hier je antwoord in..." 
                        />
                        {getFieldError('ergernissenAnderen') && (
                          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('ergernissenAnderen')}
                          </p>
                        )}
                      </div>

                      {/* Q22: Met welk type persoon bots jij soms? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Met welk type persoon bots jij soms? *</label>
                        <textarea 
                          name="typePersoonBotsen" 
                          value={formData.typePersoonBotsen} 
                          onChange={handleTextChange} 
                          onBlur={() => handleBlur('typePersoonBotsen')}
                          required 
                          rows={3} 
                          className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all resize-none ${
                            getFieldError('typePersoonBotsen') 
                              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                              : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                          }`} 
                          placeholder="Vul hier je antwoord in..." 
                        />
                        {getFieldError('typePersoonBotsen') && (
                          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('typePersoonBotsen')}
                          </p>
                        )}
                      </div>

                      {/* Q23: Wat heb jij van de groep nodig wanneer je het moeilijk hebt? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Wat heb jij van de groep nodig wanneer je het moeilijk hebt? *</label>
                        <div data-field="behoefteGroepMoeilijk" className={`space-y-2 rounded-xl p-1 ${getFieldError('behoefteGroepMoeilijk') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {behoefteGroepMoeilijkOptions.map((option) => (
                            <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.behoefteGroepMoeilijk === option ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="behoefteGroepMoeilijk" value={option} checked={formData.behoefteGroepMoeilijk === option} onChange={(e) => handleRadioChange('behoefteGroepMoeilijk', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option}</span>
                            </label>
                          ))}
                        </div>
                        {getFieldError('behoefteGroepMoeilijk') && (
                          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('behoefteGroepMoeilijk')}
                          </p>
                        )}
                      </div>

                      {/* Q24: Wat zou voor jou een reden kunnen zijn om tijdens de expeditie te willen stoppen? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Wat zou voor jou een reden kunnen zijn om tijdens de expeditie te willen stoppen? *</label>
                        <textarea 
                          name="redenStoppen" 
                          value={formData.redenStoppen} 
                          onChange={handleTextChange} 
                          onBlur={() => handleBlur('redenStoppen')}
                          required 
                          rows={3} 
                          className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all resize-none ${
                            getFieldError('redenStoppen') 
                              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                              : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                          }`} 
                          placeholder="Vul hier je antwoord in..." 
                        />
                        {getFieldError('redenStoppen') && (
                          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('redenStoppen')}
                          </p>
                        )}
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
                          <input 
                            type="text" 
                            name="noodcontactNaam" 
                            value={formData.noodcontactNaam} 
                            onChange={handleTextChange} 
                            onBlur={() => handleBlur('noodcontactNaam')}
                            required 
                            className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all ${
                              getFieldError('noodcontactNaam') 
                                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                                : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                            }`} 
                            placeholder="Naam" 
                          />
                          {getFieldError('noodcontactNaam') && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {getFieldError('noodcontactNaam')}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">Noodcontact GSM *</label>
                          <input 
                            type="tel" 
                            name="noodcontactGsm" 
                            value={formData.noodcontactGsm} 
                            onChange={handleTextChange} 
                            onBlur={() => handleBlur('noodcontactGsm')}
                            required 
                            className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all ${
                              getFieldError('noodcontactGsm') 
                                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                                : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                            }`} 
                            placeholder="+32 4XX XX XX XX" 
                          />
                          {getFieldError('noodcontactGsm') && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {getFieldError('noodcontactGsm')}
                            </p>
                          )}
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
                      <h4 className="text-lg font-display font-bold text-charcoal">Deel 6 – Foto & Video</h4>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Upload een foto *</label>
                        <div className="relative">
                          <input type="file" accept="image/*" onChange={(e) => handleFileChange('foto', e.target.files?.[0] || null)} className="hidden" id="foto-upload" />
                          <label 
                            htmlFor="foto-upload" 
                            className={`flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-dashed cursor-pointer transition-all ${
                              getFieldError('foto')
                                ? 'border-red-400 hover:border-red-500 hover:bg-red-50/30'
                                : 'border-charcoal/20 hover:border-purple-accent hover:bg-purple-accent/5'
                            }`}
                          >
                            <Upload className={`w-5 h-5 ${getFieldError('foto') ? 'text-red-400' : 'text-charcoal/50'}`} />
                            <span className={`${getFieldError('foto') ? 'text-red-600' : 'text-charcoal/70'}`}>{formData.foto ? formData.foto.name : 'Klik om een foto te uploaden'}</span>
                          </label>
                        </div>
                        {getFieldError('foto') && (
                          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('foto')}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Upload een korte video (15–30 sec) <span className="text-charcoal/50">(optioneel)</span></label>
                        <p className="text-xs text-charcoal/50 mb-3">Vertel kort wie je bent en waarom je mee wil.</p>
                        <div className="relative">
                          <input type="file" accept="video/*" onChange={(e) => handleFileChange('video', e.target.files?.[0] || null)} className="hidden" id="video-upload" />
                          <label 
                            htmlFor="video-upload" 
                            className={`flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-dashed cursor-pointer transition-all ${
                              getFieldError('video')
                                ? 'border-red-400 hover:border-red-500 hover:bg-red-50/30'
                                : 'border-charcoal/20 hover:border-purple-accent hover:bg-purple-accent/5'
                            }`}
                          >
                            <Video className={`w-5 h-5 ${getFieldError('video') ? 'text-red-400' : 'text-charcoal/50'}`} />
                            <span className={`${getFieldError('video') ? 'text-red-600' : 'text-charcoal/70'}`}>{formData.video ? formData.video.name : 'Klik om een video te uploaden'}</span>
                          </label>
                        </div>
                        {getFieldError('video') && (
                          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('video')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {isError && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center animate-fade-in">
                      <p className="text-red-600 font-medium flex items-center justify-center gap-2">
                        <XCircle className="w-5 h-5" />
                        Er ging iets mis
                      </p>
                      <p className="text-red-500 text-sm mt-1">{error}</p>
                      <p className="text-red-400 text-xs mt-2">
                        Probeer het opnieuw of contacteer ons via instagram.
                      </p>
                    </div>
                  )}

                  {/* Submit Section - Agreement + Button */}
                  <div data-field="agreement" className={`bg-white rounded-3xl p-6 md:p-8 shadow-soft border transition-all ${getFieldError('agreement') || getFieldError('privacyAgreement') ? 'border-red-300 bg-red-50/30' : 'border-charcoal/5'}`}>
                    {/* Agreement Checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreement"
                        checked={formData.agreement}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, agreement: e.target.checked }));
                          if (formErrors.agreement) {
                            setFormErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.agreement;
                              return newErrors;
                            });
                          }
                        }}
                        className="w-5 h-5 flex-shrink-0 mt-0.5 text-purple-accent rounded border-charcoal/30 focus:ring-purple-accent/20"
                      />
                      <span className="text-sm text-charcoal/80 leading-relaxed">
                        Ik bevestig dat ik weet dat de expeditie €450 kost en dat ik bij selectie een voorschot van €250 betaal om mijn plek vast te leggen. *
                      </span>
                    </label>
                    {getFieldError('agreement') && (
                      <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError('agreement')}
                      </p>
                    )}

                    {/* Privacy Agreement Checkbox */}
                    <label data-field="privacyAgreement" className="flex items-start gap-3 cursor-pointer mt-4">
                      <input
                        type="checkbox"
                        name="privacyAgreement"
                        checked={formData.privacyAgreement}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, privacyAgreement: e.target.checked }));
                          if (formErrors.privacyAgreement) {
                            setFormErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.privacyAgreement;
                              return newErrors;
                            });
                          }
                        }}
                        className="w-5 h-5 flex-shrink-0 mt-0.5 text-purple-accent rounded border-charcoal/30 focus:ring-purple-accent/20"
                      />
                      <span className="text-sm text-charcoal/80 leading-relaxed">
                        Ik heb het{' '}
                        <a
                          href="#/privacybeleid"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-accent hover:underline font-medium"
                        >
                          privacybeleid
                        </a>{' '}
                        gelezen en ga akkoord met de verwerking van mijn persoonsgegevens. *
                      </span>
                    </label>
                    {getFieldError('privacyAgreement') && (
                      <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError('privacyAgreement')}
                      </p>
                    )}

                    {/* Submit Button */}
                    <div className="mt-5">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-charcoal text-white font-display font-bold text-lg rounded-xl hover:bg-charcoal/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Bezig met verzenden...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Verstuur inschrijving
                          </>
                        )}
                      </button>
                    </div>

                    {isSubmitting && (
                      <div className="mt-4 space-y-1">
                        {uploadProgress.foto > 0 && uploadProgress.foto < 100 && (
                          <p className="text-xs text-charcoal/50">Foto uploaden...</p>
                        )}
                        {uploadProgress.video > 0 && uploadProgress.video < 100 && (
                          <p className="text-xs text-charcoal/50">Video uploaden...</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
            </div>
          </div>

          {/* 
            REVEAL BUTTON - POSITIONED INSIDE THE CLIPPED CONTAINER
            This button sits at ~10% from the top of the visible form area when collapsed.
            It's positioned relative to the clipped container (max-h-[450px]), 
            NOT the full form height, so the percentage works correctly.
          */}
          {!showForm && (
            <div className="absolute top-[25%] left-0 right-0 z-30 flex justify-center">
              <button
                onClick={revealForm}
                className="btn-primary text-lg px-8 py-4 group"
              >
                <Mail className="w-5 h-5" />
                Schrijf je hier in
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
