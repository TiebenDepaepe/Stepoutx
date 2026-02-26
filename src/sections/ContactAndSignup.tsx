import { useEffect, useRef, useState } from 'react';
import { Mail, CheckCircle, Clock, XCircle, ArrowRight, Sparkles, Send, Upload, Check, User, Calendar, Heart, Users, Shield, Camera, Video, Loader2, AlertCircle } from 'lucide-react';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { validateForm, validateFile } from '@/lib/validation';

// Form data and options
const availableDates = [
  { date: '22 juni - 27 juni', disabled: false },
  { date: '29 juni - 4 juli', disabled: false },
  { date: '6 juli - 11 juli', disabled: false },
  { date: '13 juli - 18 juli', disabled: false },
  { date: '20 juli - 25 juli', disabled: true, full: true },
  { date: '27 juli - 1 augustus', disabled: false },
  { date: '3 - 8 augustus', disabled: false },
  { date: '10 - 15 augustus', disabled: false },
  { date: '20 - 25 augustus', disabled: true, full: true }
];
const motivationOptions = ['nieuwe vrienden', 'zelfvertrouwen', 'avontuur', 'uit comfortzone', 'even weg uit mijn omgeving', 'iets totaal nieuws proberen'];
const personalityOptions = ['rustig', 'sociaal', 'humoristisch', 'gevoelig', 'direct', 'spontaan', 'zorgzaam', 'avontuurlijk', 'georganiseerd', 'dromerig'];
const groupRoleOptions = [{ value: 'stille-observator', label: 'de stille observator' }, { value: 'rustig-aanwezig', label: 'rustig maar aanwezig' }, { value: 'snel-praten', label: 'iemand die snel praat met iedereen' }, { value: 'grappenmaker', label: 'de grappenmaker' }, { value: 'initiatief', label: 'degene die initiatief neemt' }];
const excitementOptions = [{ value: 'nieuwe-mensen', label: 'nieuwe mensen leren kennen' }, { value: 'liften', label: 'liften' }, { value: 'overnachten', label: 'overnachten bij onbekenden' }, { value: 'geen-planning', label: 'geen vaste planning' }, { value: 'fysiek', label: 'fysiek moe worden' }];

// New options for the 4 additional questions
const watSpreektAanOptions = [
  { value: 'sociale-uitdagingen', label: 'sociale uitdagingen (nieuwe mensen, gesprekken, opdrachten)' },
  { value: 'fysieke-uitdagingen', label: 'fysieke uitdagingen (wandelen, actief bezig zijn)' },
  { value: 'combinatie', label: 'een combinatie van beide' }
];

const sportiviteitOptions = [
  { value: 'weinig', label: 'weinig sportief' },
  { value: 'gemiddeld', label: 'gemiddeld sportief' },
  { value: 'actief', label: 'actief en sport regelmatig' },
  { value: 'zeer-sportief', label: 'zeer sportief' }
];

const socialeInteractieOptions = [
  { value: 'bijna-altijd-samen', label: 'bijna altijd samen met de groep' },
  { value: 'mix', label: 'een mix van samen en eigen momenten' },
  { value: 'tijd-voor-mezelf', label: 'ik heb regelmatig tijd voor mezelf nodig' }
];

const zelfstandigheidOptions = [
  { value: 'makkelijk-initiatief', label: 'ik neem makkelijk initiatief' },
  { value: 'volg-mee', label: 'ik volg meestal mee' },
  { value: 'duidelijke-begeleiding', label: 'ik heb graag duidelijke begeleiding' }
];

interface FormData {
  naam: string; leeftijd: string; woonplaats: string; gsm: string; email: string; instagram: string;
  beschikbaarheid: string[]; motivatie: string; doelen: string[];
  persoonlijkheid: string[]; groepsrol: string; spannendst: string; ongemakkelijk: string; waaromPassen: string;
  // New fields for deel 4
  watSpreektAan: string;
  sportiviteit: string;
  socialeInteractie: string;
  zelfstandigheid: string;
  medisch: boolean; medischUitleg: string; noodcontactNaam: string; noodcontactGsm: string;
  foto: File | null; video: File | null;
}

const initialFormData: FormData = {
  naam: '', leeftijd: '', woonplaats: '', gsm: '', email: '', instagram: '',
  beschikbaarheid: [], motivatie: '', doelen: [],
  persoonlijkheid: [], groepsrol: '', spannendst: '', ongemakkelijk: '', waaromPassen: '',
  // New fields
  watSpreektAan: '',
  sportiviteit: '',
  socialeInteractie: '',
  zelfstandigheid: '',
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
    
    // Clear any previous errors
    setFormErrors({});
    
    const result = await submitForm(formData);
    
    if (result.success) {
      setSubmitted(true);
    }
  };

  // Helper to show error message for a field
  const getFieldError = (fieldName: string): string | null => {
    return touchedFields.has(fieldName) ? formErrors[fieldName] || null : null;
  };

  const revealForm = () => {
    setShowForm(true);
    setTimeout(() => {
      const formElement = document.getElementById('signup-form');
      if (formElement) {
        const navbarHeight = 80; // Approximate Navbar height
        const elementPosition = formElement.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - navbarHeight,
          behavior: 'smooth'
        });
      }
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
      {/* 
        STRUCTURE NOTE FOR FUTURE DEVELOPERS:
        This section has a "peek" effect where the form is partially hidden until clicked.
        The clipped-container (the div with max-h-[450px] or max-h-[8000px]) controls the visible height.
        The reveal button MUST be positioned INSIDE this container to appear at the correct % height.
      */}
      <div id="signup-form" className="relative">
        {/* Clipped container: this is the positioning context for the reveal button */}
        <div 
          className={`relative transition-all duration-700 ease-out ${showForm ? 'max-h-[8000px]' : 'max-h-[450px]'} overflow-hidden`}
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
                  <span className="font-bold">belangrijke note:</span> je schrijft je ALLEEN in (vriend of vriendinnen samen is niet toegelaten). StepOut is bedoeld om nieuwe mensen te leren kennen. Wees eerlijk bij het invullen, we vormen diverse groepen, dus ook introverte of rustigere personen zijn helemaal welkom.
                </p>
                <p className="text-charcoal/60">
                  Vul alle velden in zodat we je goed kunnen plaatsen
                </p>
              </div>

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
                      max="25" 
                      className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all ${
                        getFieldError('leeftijd') 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                      }`} 
                      placeholder="18-25" 
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
                    <div data-field="beschikbaarheid" className="flex flex-wrap gap-2">
                      {availableDates.map((item) => (
                        <button 
                          key={item.date} 
                          type="button" 
                          disabled={item.disabled}
                          onClick={() => !item.disabled && handleCheckboxChange('beschikbaarheid', item.date)} 
                          className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            item.disabled 
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                              : formData.beschikbaarheid.includes(item.date) 
                                ? 'bg-purple-accent text-white' 
                                : 'bg-gray-100 text-charcoal hover:bg-purple-accent/10'
                          }`}
                        >
                          {item.full ? (
                            <span className="flex items-center gap-2">
                              <span className="opacity-70">{item.date}</span>
                              <span className="flex items-center gap-1 text-[10px] font-semibold bg-gray-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                                <span className="w-1 h-1 bg-white rounded-full" />
                                Vol
                              </span>
                            </span>
                          ) : (
                            item.date
                          )}
                        </button>
                      ))}
                    </div>
                    {getFieldError('beschikbaarheid') && (
                      <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError('beschikbaarheid')}
                      </p>
                    )}
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
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Wat hoop je uit deze reis te halen? <span className="text-charcoal/50">(kies max. 2)</span></label>
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
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">In een nieuwe groep ben jij meestal: *</label>
                        <div data-field="groepsrol" className={`space-y-2 rounded-xl p-1 ${getFieldError('groepsrol') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {groupRoleOptions.map((option) => (
                            <label key={option.value} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.groepsrol === option.value ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="groepsrol" value={option.value} checked={formData.groepsrol === option.value} onChange={(e) => handleRadioChange('groepsrol', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option.label}</span>
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
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Wat vind je het spannendst aan deze reis? *</label>
                        <div data-field="spannendst" className={`space-y-2 rounded-xl p-1 ${getFieldError('spannendst') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {excitementOptions.map((option) => (
                            <label key={option.value} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.spannendst === option.value ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="spannendst" value={option.value} checked={formData.spannendst === option.value} onChange={(e) => handleRadioChange('spannendst', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option.label}</span>
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
                          placeholder="Beschrijf kort..." 
                        />
                        {getFieldError('ongemakkelijk') && (
                          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('ongemakkelijk')}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">Waarom zou jij goed in een StepOut-groep passen? *</label>
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
                          placeholder="Vertel ons waarom..." 
                        />
                        {getFieldError('waaromPassen') && (
                          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {getFieldError('waaromPassen')}
                          </p>
                        )}
                      </div>

                      {/* New Question 1: Wat spreekt jou het meest aan? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Wat spreekt jou het meest aan? *</label>
                        <div data-field="watSpreektAan" className={`space-y-2 rounded-xl p-1 ${getFieldError('watSpreektAan') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {watSpreektAanOptions.map((option) => (
                            <label key={option.value} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.watSpreektAan === option.value ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="watSpreektAan" value={option.value} checked={formData.watSpreektAan === option.value} onChange={(e) => handleRadioChange('watSpreektAan', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option.label}</span>
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

                      {/* New Question 2: Hoe sportief ben jij? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Hoe sportief ben jij? *</label>
                        <div data-field="sportiviteit" className={`space-y-2 rounded-xl p-1 ${getFieldError('sportiviteit') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {sportiviteitOptions.map((option) => (
                            <label key={option.value} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.sportiviteit === option.value ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="sportiviteit" value={option.value} checked={formData.sportiviteit === option.value} onChange={(e) => handleRadioChange('sportiviteit', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option.label}</span>
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

                      {/* New Question 3: Hoeveel sociale interactie vind je fijn? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Hoeveel sociale interactie vind je fijn tijdens een trip? *</label>
                        <div data-field="socialeInteractie" className={`space-y-2 rounded-xl p-1 ${getFieldError('socialeInteractie') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {socialeInteractieOptions.map((option) => (
                            <label key={option.value} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.socialeInteractie === option.value ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="socialeInteractie" value={option.value} checked={formData.socialeInteractie === option.value} onChange={(e) => handleRadioChange('socialeInteractie', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option.label}</span>
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

                      {/* New Question 4: Hoe zelfstandig voel jij je? */}
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Hoe zelfstandig voel jij je tijdens reizen? *</label>
                        <div data-field="zelfstandigheid" className={`space-y-2 rounded-xl p-1 ${getFieldError('zelfstandigheid') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                          {zelfstandigheidOptions.map((option) => (
                            <label key={option.value} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.zelfstandigheid === option.value ? 'ring-2 ring-purple-accent' : ''}`}>
                              <input type="radio" name="zelfstandigheid" value={option.value} checked={formData.zelfstandigheid === option.value} onChange={(e) => handleRadioChange('zelfstandigheid', e.target.value)} required className="w-5 h-5 text-purple-accent" />
                              <span className="text-charcoal">{option.label}</span>
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
                      <h4 className="text-lg font-display font-bold text-charcoal">Deel 6 – Optioneel (maar waardevol)</h4>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-3">Upload een foto <span className="text-charcoal/50">(optioneel)</span></label>
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
                        <label className="block text-sm font-medium text-charcoal mb-2">Upload een korte video <span className="text-charcoal/50">(15–30 sec, optioneel)</span></label>
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

                  {/* Submit Button */}
                  <div className="text-center pt-4">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-3 px-10 py-4 bg-charcoal text-white font-display font-bold text-lg rounded-2xl hover:bg-charcoal/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 min-w-[280px] justify-center"
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
                    
                    <p className="text-sm text-charcoal/50 mt-4">Door te versturen ga je akkoord met onze voorwaarden</p>
                  </div>
                </form>
              )}
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
