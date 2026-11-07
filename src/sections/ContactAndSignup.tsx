import { useEffect, useRef, useState } from 'react';
import { CheckCircle, Clock, XCircle, Sparkles, Send, Upload, Check, User, Users, Shield, Camera, Video, Loader2, AlertCircle, Info, ChevronDown, Compass, Smile, Target, Activity, MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { validateForm, validateFile } from '@/lib/validation';
import { CalendarDatePicker } from '@/components/calendar-date-picker';

/** Bestandsgrootte tonen, zodat "te groot" niet als een raadsel aanvoelt. */
const formatFileSize = (bytes: number): string =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

// Options constants
const huidigeBezigheidOptions = [
  'Ik studeer',
  'Ik werk',
  'Ik studeer en werk',
  'Iets anders',
];

const expeditieOptions = [
  'Nederland / Duitsland',
  'Italie (+€145)',
];

const personalityOptions = [
  'Rustig',
  'Sociaal',
  'Grappig',
  'Spontaan',
  'Zorgzaam',
  'Avontuurlijk',
  'Gevoelig',
  'Direct',
  'Creatief',
  'Georganiseerd',
  'Enthousiast',
  'Nuchter',
];

const nieuweGroepOptions = [
  'Ik kijk eerst rustig de kat uit de boom',
  'Ik ben eerst wat rustig, maar kom snel los',
  'Ik maak meestal gemakkelijk contact',
  'Ik ben vaak degene die grapjes maakt en de sfeer erin brengt',
  'Dat hangt echt van de groep af',
];

const rolVriendengroepOptions = [
  'Ik neem vaak het initiatief en stel dingen voor',
  'Soms neem ik het voortouw, soms volg ik gewoon mee',
  'Ik sluit me graag aan bij plannen van anderen',
  'Ik ben vooral degene die voor humor en sfeer zorgt',
  'Ik ben eerder de rustige persoon in de groep',
];

const sociaalMeerdaagseOptions = [
  'Ik ben graag bijna de hele tijd bij de groep',
  'Ik hou van veel groepsmomenten, maar ook af en toe rust',
  'Ik heb regelmatig even tijd voor mezelf nodig',
  'Dat hangt af van de mensen en de sfeer',
];

const vrijeTijdOptions = [
  'Reizen',
  'Festivals',
  'Uitgaan',
  'Muziek',
  'Sport',
  'Fitness',
  'Lopen',
  'Wandelen',
  'Dansen',
  'Gamen',
  'Films & series',
  'Koken',
  'Fotografie',
  'Creatief bezig zijn',
  'Lezen',
  'Dieren',
  'Nieuwe restaurants ontdekken',
  'Gezelschapsspellen',
  'Natuur',
  'Steden ontdekken',
  'Social media',
  'Koffie & terrasjes',
  'Kunst & cultuur',
  'Andere',
];

const doelenOptions = [
  'Nieuwe vrienden maken',
  'Een onvergetelijke reis beleven',
  'Avontuur en spontaniteit',
  'Mijn zelfvertrouwen vergroten',
  'Even ontsnappen aan de dagelijkse routine',
  'Iets totaal nieuws proberen',
];

const kmWandelenOptions = [
  'Minder dan 10 km',
  '10 tot 15 km',
  '15 tot 20 km',
  '20 km of meer',
];

const meerdereDagenWandelenOptionsNedDui = [
  'Dat lijkt me momenteel te zwaar',
  'Dat wordt uitdagend, maar ik wil het graag proberen',
  'Dat lijkt me goed haalbaar',
  'Ik heb hier al ervaring mee',
];

const meerdereDagenWandelenOptionsItalie = [
  'Dat regex lijkt me momenteel te zwaar'.replace('regex ', ''),
  'Dat wordt uitdagend en ik twijfel of het haalbaar is',
  'Dat lijkt me haalbaar, ook al wordt het zwaar',
  'Ik heb hier al ervaring mee',
];

interface FormData {
  // Deel 1: Even kennismaken
  naam: string;
  geboortedatum: string;
  woonplaats: string;
  gsm: string;
  email: string;
  instagram: string;
  huidigeBezigheid: string;
  studieUitleg: string;
  werkUitleg: string;
  bezigheidAndersUitleg: string;

  // Deel 2: Jouw expeditie
  expeditieVoorkeur: string;
  beschikbaarheid: string[];

  // Deel 3: Wie ben jij?
  persoonlijkheid: string[];
  nieuweGroep: string;
  nieuweGroepExtra: string;
  rolVriendengroep: string;
  rolVriendengroepExtra: string;
  sociaalMeerdaagse: string;
  sociaalMeerdaagseExtra: string;
  vrijeTijdInteresses: string[];
  vrijeTijdAnders: string;

  // Deel 4: Wat verwacht je van PlotTwist?
  motivatie: string;
  doelen: string[];

  // Deel 5: Wandelen en fysieke haalbaarheid
  kmWandelen: string;
  meerdereDagenWandelen: string;

  // Deel 6: De laatste persoonlijke vragen
  ergernissenAnderen: string;
  typePersoonBotsen: string;
  extraInfoGroep: string;

  // Deel 7: Praktisch en veiligheid
  medisch: boolean;
  medischUitleg: string;
  noodcontactNaam: string;
  noodcontactGsm: string;

  // Deel 8: Foto en video
  foto: File | null;
  video: File | null;

  // Deel 9: Nog een laatste vraag
  vriendenIngeschreven: boolean;
  vriendenNamen: string;

  // Akkoord
  agreement: boolean;
  privacyAgreement: boolean;
}

const initialFormData: FormData = {
  naam: '',
  geboortedatum: '',
  woonplaats: '',
  gsm: '',
  email: '',
  instagram: '',
  huidigeBezigheid: '',
  studieUitleg: '',
  werkUitleg: '',
  bezigheidAndersUitleg: '',
  expeditieVoorkeur: '',
  beschikbaarheid: [],
  persoonlijkheid: [],
  nieuweGroep: '',
  nieuweGroepExtra: '',
  rolVriendengroep: '',
  rolVriendengroepExtra: '',
  sociaalMeerdaagse: '',
  sociaalMeerdaagseExtra: '',
  vrijeTijdInteresses: [],
  vrijeTijdAnders: '',
  motivatie: '',
  doelen: [],
  kmWandelen: '',
  meerdereDagenWandelen: '',
  ergernissenAnderen: '',
  typePersoonBotsen: '',
  extraInfoGroep: '',
  medisch: false,
  medischUitleg: '',
  noodcontactNaam: '',
  noodcontactGsm: '',
  foto: null,
  video: null,
  vriendenIngeschreven: false,
  vriendenNamen: '',
  agreement: false,
  privacyAgreement: false,
};

const responseOptions = [
  { icon: CheckCircle, title: 'Geselecteerd', description: <>Je krijgt een voorstel met datum en groep, en kan je plek bevestigen met een <strong>250€ voorschot</strong>.</>, bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  { icon: Clock, title: 'Wachtlijst', description: <>Je past bij het concept, maar de groep zit vol. Je wordt gecontacteerd als er een plek vrijkomt.</>, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { icon: XCircle, title: 'Niet geselecteerd', description: <>De expeditie past op dit moment niet goed bij jou of bij de groep.</>, bgColor: 'bg-red-100', iconColor: 'text-red-500' },
];

export default function ContactAndSignup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showTripGuide, setShowTripGuide] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);
  const TOTAL_STEPS = 9;

  const [isInAppBrowser] = useState(() =>
    /Instagram|FBAN|FBAV|FB_IAB|Messenger|TikTok|Snapchat|Pinterest|Line\//i.test(
      typeof navigator === 'undefined' ? '' : navigator.userAgent
    )
  );

  // Form submission hook
  const { submitForm, isSubmitting, isError, error, uploadProgress, uploadWarnings } = useFormSubmit();
  
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
    const result = validateForm({ ...formData, [fieldName]: formData[fieldName as keyof FormData] });
    if (!result.success) {
      const fieldError = result.errors[fieldName];
      if (fieldError) {
        setFormErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
      }
    }
  };

  const handleRadioChange = (name: string, value: string | boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // If switching destination, reset destination-specific physical questions if needed
      return updated;
    });
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (field: 'persoonlijkheid' | 'doelen' | 'vrijeTijdInteresses', value: string, maxItems?: number) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      let updated: string[];
      if (current.includes(value)) {
        updated = current.filter((item) => item !== value);
      } else {
        if (maxItems && current.length >= maxItems) return prev;
        updated = [...current, value];
      }
      return { ...prev, [field]: updated };
    });
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'foto' | 'video') => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const fileError = validateFile(file, type === 'foto' ? 'image' : 'video');
      if (fileError) {
        setFormErrors((prev) => ({ ...prev, [type]: fileError }));
        e.target.value = '';
        return;
      }
    }
    setFormData((prev) => ({ ...prev, [type]: file }));
    if (formErrors[type]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[type];
        return newErrors;
      });
    }
  };

  const getFieldError = (fieldName: string) => {
    return formErrors[fieldName] || (touchedFields.has(fieldName) ? formErrors[fieldName] : undefined);
  };

  const stepFields: Record<number, string[]> = {
    1: ['naam', 'geboortedatum', 'woonplaats', 'gsm', 'email', 'instagram', 'huidigeBezigheid'],
    2: ['expeditieVoorkeur', 'beschikbaarheid'],
    3: ['persoonlijkheid', 'nieuweGroep', 'rolVriendengroep', 'sociaalMeerdaagse', 'vrijeTijdInteresses'],
    4: ['motivatie', 'doelen'],
    5: ['kmWandelen', 'meerdereDagenWandelen'],
    6: ['ergernissenAnderen', 'typePersoonBotsen'],
    7: ['noodcontactNaam', 'noodcontactGsm'],
    8: ['foto', 'video'],
    9: ['agreement', 'privacyAgreement'],
  };

  const validateStep = (step: number): boolean => {
    const validationResult = validateForm(formData);
    const allErrors = validationResult.success ? {} : validationResult.errors;
    const fieldsToCheck = stepFields[step] || [];
    const stepErrors: Record<string, string> = {};

    for (const field of fieldsToCheck) {
      if (allErrors[field]) {
        stepErrors[field] = allErrors[field];
      }
    }

    if (step === 1) {
      if ((formData.huidigeBezigheid === 'Ik studeer' || formData.huidigeBezigheid === 'Ik studeer en werk') && !formData.studieUitleg.trim()) {
        stepErrors.studieUitleg = 'Vul in wat je studeert';
      }
      if ((formData.huidigeBezigheid === 'Ik werk' || formData.huidigeBezigheid === 'Ik studeer en werk') && !formData.werkUitleg.trim()) {
        stepErrors.werkUitleg = 'Vul in wat voor werk je doet';
      }
      if (formData.huidigeBezigheid === 'Iets anders' && !formData.bezigheidAndersUitleg.trim()) {
        stepErrors.bezigheidAndersUitleg = 'Vertel wat je momenteel doet';
      }
    }

    if (step === 3) {
      if (formData.vrijeTijdInteresses.includes('Andere') && !formData.vrijeTijdAnders.trim()) {
        stepErrors.vrijeTijdAnders = 'Vul in welke andere interesses je hebt';
      }
    }

    if (step === 7) {
      if (formData.medisch && !formData.medischUitleg.trim()) {
        stepErrors.medischUitleg = 'Vul in waarmee we rekening moeten houden';
      }
    }

    if (step === 9) {
      if (formData.vriendenIngeschreven && !formData.vriendenNamen.trim()) {
        stepErrors.vriendenNamen = 'Vul de voor- en achternaam in van je vriend(in)';
      }
    }

    if (Object.keys(stepErrors).length > 0) {
      setFormErrors((prev) => ({ ...prev, ...stepErrors }));
      const firstErrorField = Object.keys(stepErrors)[0];
      const errorElement =
        document.querySelector(`[name="${firstErrorField}"]`) ||
        document.querySelector(`[data-field="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (errorElement as HTMLElement).focus?.();
      }
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      setTimeout(() => {
        formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setTimeout(() => {
        formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < TOTAL_STEPS) {
      handleNextStep();
      return;
    }

    if (!validateStep(TOTAL_STEPS)) {
      return;
    }
    
    // Clear errors
    setFormErrors({});

    const result = await submitForm(formData);
    if (result.success) {
      setSubmitted(true);
    }
  };

  const isItalie = formData.expeditieVoorkeur.includes('Italie');

  if (submitted) {
    return (
      <section id="contact" className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-lavender/30 rounded-3xl p-8 md:p-12 border border-purple-accent/20">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-charcoal mb-4">
              Bedankt voor je inschrijving!
            </h3>
            <p className="text-charcoal/70 mb-6">
              We hebben je gegevens goed ontvangen. We bekijken je profiel zorgvuldig om te zien of je past bij een van onze groepen. Je hoort snel van ons!
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-accent/10 rounded-full text-sm text-purple-accent">
              <Sparkles className="w-4 h-4" />
              Hou je mailbox in de gaten
            </div>

            {uploadWarnings.length > 0 && (
              <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left">
                <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  Je inschrijving is opgeslagen, maar één bestand ontbreekt nog:
                </div>
                {uploadWarnings.map((warning) => (
                  <p key={warning} className="mt-1.5 text-xs text-amber-900/80 leading-relaxed">{warning}</p>
                ))}
                <p className="mt-2 text-xs text-amber-900/80 leading-relaxed">
                  Geen zorgen: we hebben al je antwoorden. Stuur je foto of video gerust door via Instagram, dan hangen we ze bij je inschrijving.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="contact" className="relative bg-white pb-16 md:pb-24">
      {/* PART 1: Info Header */}
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

            {!isFormOpen && (
              <div className="text-center mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(true);
                    setTimeout(() => {
                      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }}
                  className="btn-primary text-base md:text-lg px-8 py-4 group"
                >
                  Ik wil me inschrijven
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PART 2: Form Section */}
      <div id="signup-form" ref={formTopRef} className="relative">
        {isFormOpen && (
        <div className="pt-4 pb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-lavender/10 to-white" />
          
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Form Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-charcoal mb-4">
                Inschrijfformulier
              </h3>
              
              {/* Klein geel kadertje */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-5 text-amber-900 text-sm md:text-base leading-relaxed text-left shadow-sm mb-6">
                <p className="font-medium">
                  We besteden veel tijd en aandacht aan het samenstellen van groepen die goed bij elkaar passen. Hoe eerlijker je antwoorden, hoe beter we jou kunnen matchen met de juiste mensen. Er zijn geen juiste of foute antwoorden, dus wees vooral jezelf!
                </p>
              </div>

              {/* Voortgangsbalk */}
              <div className="bg-white rounded-2xl p-4 shadow-soft border border-charcoal/5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-charcoal mb-2">
                  <span>Deel {currentStep} van {TOTAL_STEPS}</span>
                  <span className="text-purple-accent font-semibold">{Math.round((currentStep / TOTAL_STEPS) * 100)}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-accent rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-8 mt-6">
              {/* Deel 1: Even kennismaken */}
              {currentStep === 1 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-lavender rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-accent" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-charcoal">Deel 1: Even kennismaken</h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* 1. Wat is je voornaam en achternaam? */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">1. Wat is je voornaam en achternaam? *</label>
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
                      placeholder="bv. Laura Janssens" 
                    />
                    {getFieldError('naam') && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError('naam')}
                      </p>
                    )}
                  </div>

                  {/* 2. Wat is je geboortedatum? */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">2. Wat is je geboortedatum? *</label>
                    <input 
                      type="date" 
                      name="geboortedatum" 
                      value={formData.geboortedatum} 
                      onChange={handleTextChange} 
                      onBlur={() => handleBlur('geboortedatum')}
                      required 
                      max="2012-01-01"
                      min="1980-01-01"
                      className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all ${
                        getFieldError('geboortedatum') 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                      }`} 
                    />
                    {getFieldError('geboortedatum') && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError('geboortedatum')}
                      </p>
                    )}
                  </div>

                  {/* 3. Waar woon je? */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">3. Waar woon je? *</label>
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
                      placeholder="Gemeente of stad" 
                    />
                    {getFieldError('woonplaats') && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError('woonplaats')}
                      </p>
                    )}
                  </div>

                  {/* 4. Wat is je gsm-nummer? */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">4. Wat is je gsm-nummer? *</label>
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

                  {/* 5. Wat is je e-mailadres? */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">5. Wat is je e-mailadres? *</label>
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
                      placeholder="jouw@email.com" 
                    />
                    {getFieldError('email') && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError('email')}
                      </p>
                    )}
                  </div>

                  {/* 6. Wat is je Instagram? */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">6. Wat is je Instagram? *</label>
                    <input 
                      type="text" 
                      name="instagram" 
                      value={formData.instagram} 
                      onChange={handleTextChange} 
                      onBlur={() => handleBlur('instagram')}
                      required 
                      className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all ${
                        getFieldError('instagram') 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20'
                      }`} 
                      placeholder="@gebruikersnaam" 
                    />
                    {getFieldError('instagram') && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {getFieldError('instagram')}
                      </p>
                    )}
                  </div>
                </div>

                {/* 7. Wat doe je momenteel? */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-charcoal mb-3">7. Wat doe je momenteel? *</label>
                  <div data-field="huidigeBezigheid" className={`grid sm:grid-cols-2 gap-2.5 rounded-xl p-1 ${getFieldError('huidigeBezigheid') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                    {huidigeBezigheidOptions.map((option) => (
                      <label key={option} className={`flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.huidigeBezigheid === option ? 'ring-2 ring-purple-accent bg-purple-accent/5' : ''}`}>
                        <input 
                          type="radio" 
                          name="huidigeBezigheid" 
                          value={option} 
                          checked={formData.huidigeBezigheid === option} 
                          onChange={(e) => handleRadioChange('huidigeBezigheid', e.target.value)} 
                          required 
                          className="w-5 h-5 text-purple-accent" 
                        />
                        <span className="text-charcoal font-medium text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                  {getFieldError('huidigeBezigheid') && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError('huidigeBezigheid')}
                    </p>
                  )}

                  {/* Vervolgveld: Ik studeer */}
                  {(formData.huidigeBezigheid === 'Ik studeer' || formData.huidigeBezigheid === 'Ik studeer en werk') && (
                    <div className="mt-4 p-4 bg-gray-50/80 rounded-2xl border border-charcoal/5">
                      <label className="block text-sm font-medium text-charcoal mb-2">Wat studeer je? *</label>
                      <input 
                        type="text" 
                        name="studieUitleg" 
                        value={formData.studieUitleg} 
                        onChange={handleTextChange} 
                        onBlur={() => handleBlur('studieUitleg')}
                        required
                        className={`w-full px-4 py-3 bg-white rounded-xl border outline-none transition-all ${
                          getFieldError('studieUitleg') ? 'border-red-400 focus:border-red-500' : 'border-charcoal/10 focus:border-purple-accent'
                        }`}
                        placeholder="bv. Toegepaste Psychologie, Rechten, Marketing..." 
                      />
                      {getFieldError('studieUitleg') && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {getFieldError('studieUitleg')}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Vervolgveld: Ik werk */}
                  {(formData.huidigeBezigheid === 'Ik werk' || formData.huidigeBezigheid === 'Ik studeer en werk') && (
                    <div className="mt-4 p-4 bg-gray-50/80 rounded-2xl border border-charcoal/5">
                      <label className="block text-sm font-medium text-charcoal mb-2">Wat voor werk doe je? *</label>
                      <input 
                        type="text" 
                        name="werkUitleg" 
                        value={formData.werkUitleg} 
                        onChange={handleTextChange} 
                        onBlur={() => handleBlur('werkUitleg')}
                        required
                        className={`w-full px-4 py-3 bg-white rounded-xl border outline-none transition-all ${
                          getFieldError('werkUitleg') ? 'border-red-400 focus:border-red-500' : 'border-charcoal/10 focus:border-purple-accent'
                        }`}
                        placeholder="bv. Verpleegkundige, Developer, Zelfstandige..." 
                      />
                      {getFieldError('werkUitleg') && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {getFieldError('werkUitleg')}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Vervolgveld: Iets anders */}
                  {formData.huidigeBezigheid === 'Iets anders' && (
                    <div className="mt-4 p-4 bg-gray-50/80 rounded-2xl border border-charcoal/5">
                      <label className="block text-sm font-medium text-charcoal mb-2">Vertel gerust wat je momenteel doet *</label>
                      <input 
                        type="text" 
                        name="bezigheidAndersUitleg" 
                        value={formData.bezigheidAndersUitleg} 
                        onChange={handleTextChange} 
                        onBlur={() => handleBlur('bezigheidAndersUitleg')}
                        required
                        className={`w-full px-4 py-3 bg-white rounded-xl border outline-none transition-all ${
                          getFieldError('bezigheidAndersUitleg') ? 'border-red-400 focus:border-red-500' : 'border-charcoal/10 focus:border-purple-accent'
                        }`}
                        placeholder="bv. Tussenjaar, op reis, werkzoekend..." 
                      />
                      {getFieldError('bezigheidAndersUitleg') && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {getFieldError('bezigheidAndersUitleg')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* Deel 2: Jouw expeditie */}
              {currentStep === 2 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-lavender rounded-xl flex items-center justify-center">
                    <Compass className="w-5 h-5 text-purple-accent" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-charcoal">Deel 2: Jouw expeditie</h4>
                </div>

                {/* 8. Welke expeditie heeft jouw voorkeur? */}
                <div className="mb-8">
                  <label className="block text-base font-semibold text-charcoal mb-1">
                    8. Welke expeditie heeft jouw voorkeur? *
                  </label>
                  <p className="text-xs text-charcoal/60 mb-3">
                    We houden zoveel mogelijk rekening met je voorkeur, maar kunnen niet garanderen dat je op deze bestemming terechtkomt.
                  </p>
                  
                  <div data-field="expeditieVoorkeur" className={`grid sm:grid-cols-2 gap-3 p-1 rounded-xl ${getFieldError('expeditieVoorkeur') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                    {expeditieOptions.map((option) => (
                      <label 
                        key={option} 
                        className={`flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer transition-all border ${
                          formData.expeditieVoorkeur === option 
                            ? 'ring-2 ring-purple-accent border-purple-accent bg-purple-accent/5 font-semibold text-purple-accent' 
                            : 'border-charcoal/10 hover:bg-purple-accent/5 text-charcoal'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="expeditieVoorkeur" 
                          value={option} 
                          checked={formData.expeditieVoorkeur === option} 
                          onChange={(e) => handleRadioChange('expeditieVoorkeur', e.target.value)} 
                          required 
                          className="w-5 h-5 text-purple-accent" 
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  {getFieldError('expeditieVoorkeur') && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError('expeditieVoorkeur')}
                    </p>
                  )}

                  {/* Automatische informatie bij keuze voor Italie */}
                  {isItalie && (
                    <div className="mt-4 p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-sm text-charcoal/80 space-y-2 animate-fadeIn">
                      <div className="flex items-center gap-2 font-bold text-amber-900">
                        <Info className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Extra vervoerskost: €145</span>
                      </div>
                      <p className="leading-relaxed text-amber-900/90 text-xs sm:text-sm">
                        Voor Italië voorzien we nachtelijk busvervoer. Het is ongeveer 18 uur rijden met de bus en je vertrekt 1 dag vroeger dan bij de andere expedities. Meer praktische informatie ontvang je later.
                      </p>
                    </div>
                  )}

                  {/* Collapsible gids: Welke reis past het best bij jou? */}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setShowTripGuide(!showTripGuide)}
                      className="w-full flex items-center justify-between p-3.5 bg-lavender/40 hover:bg-lavender/60 border border-purple-accent/20 rounded-xl text-left transition-all"
                    >
                      <span className="text-sm font-semibold text-charcoal flex items-center gap-2">
                        <Compass className="w-4 h-4 text-purple-accent" />
                        Welke reis past het best bij jou?
                      </span>
                      <ChevronDown className={`w-4 h-4 text-purple-accent transition-transform duration-300 ${showTripGuide ? 'rotate-180' : ''}`} />
                    </button>

                    {showTripGuide && (
                      <div className="mt-3 p-4 md:p-5 bg-lavender/20 border border-purple-accent/15 rounded-2xl space-y-4 text-xs sm:text-sm text-charcoal/80">
                        <div>
                          <p className="font-bold text-purple-accent text-sm mb-1">Nederland / Duitsland – Aanrader!</p>
                          <p className="leading-relaxed">
                            De ideale eerste PlotTwist! De focus ligt hier nog meer op elkaar leren kennen en de connectie met de locals, dankzij de vertrouwde taal en omgeving. Wij raden deze reis sterk aan!
                          </p>
                        </div>
                        <div className="pt-3 border-t border-purple-accent/10">
                          <p className="font-bold text-purple-accent text-sm mb-1">Italie (+€145) – Voor de echte avonturiers!</p>
                          <p className="leading-relaxed">
                            Een avontuurlijke reis door prachtige berglandschappen! Deze expeditie is fysiek uitdagender en ideaal voor wie graag een stapje verder gaat.
                          </p>
                        </div>
                        <div className="pt-3 border-t border-purple-accent/10">
                          <p className="text-xs text-charcoal/70 leading-relaxed">
                            <span className="font-bold text-charcoal">Let op:</span> We houden zoveel mogelijk rekening met je reisvoorkeur, maar kunnen niet garanderen dat je ook op deze bestemming terechtkomt.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 9. Wanneer ben je beschikbaar? */}
                <div className="pt-6 border-t border-charcoal/5">
                  <label className="block text-base font-semibold text-charcoal mb-1">
                    9. Wanneer ben je beschikbaar? *
                  </label>
                  <p className="text-xs text-charcoal/60 mb-3">
                    Selecteer alle weken waarin je mee kan gaan.
                  </p>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm font-medium text-amber-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0 text-amber-700" />
                    <span>Hoe meer datums je aanduidt, hoe groter de kans op een passende match!</span>
                  </div>

                  {isItalie && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm font-medium text-amber-900 mb-4 flex items-center gap-2">
                      <Info className="w-4 h-4 shrink-0 text-amber-700" />
                      <span>Let op: de expedities naar Italie vertrekken 1 dag vroeger.</span>
                    </div>
                  )}

                  <div data-field="beschikbaarheid" className={`p-1 rounded-2xl ${getFieldError('beschikbaarheid') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                    <CalendarDatePicker
                      selectedDates={formData.beschikbaarheid}
                      onChange={(dates) => {
                        setFormData((prev) => ({ ...prev, beschikbaarheid: dates }));
                        if (formErrors.beschikbaarheid) {
                          setFormErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.beschikbaarheid;
                            return newErrors;
                          });
                        }
                      }}
                      error={getFieldError('beschikbaarheid')}
                    />
                  </div>
                  {getFieldError('beschikbaarheid') && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError('beschikbaarheid')}
                    </p>
                  )}
                </div>
              </div>
              )}

              {/* Deel 3: Wie ben jij? */}
              {currentStep === 3 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-lavender rounded-xl flex items-center justify-center">
                    <Smile className="w-5 h-5 text-purple-accent" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-charcoal">Deel 3: Wie ben jij?</h4>
                </div>
                <p className="text-xs sm:text-sm text-charcoal/60 italic mb-6">
                  Geen juiste of foute antwoorden! We willen je gewoon wat beter leren kennen, zodat we een leuke groep kunnen samenstellen.
                </p>

                {/* 10. Hoe zouden je vrienden jou omschrijven? */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    10. Hoe zouden je vrienden jou omschrijven? <span className="text-charcoal/50">(kies max. 3)</span> *
                  </label>
                  <div data-field="persoonlijkheid" className="flex flex-wrap gap-2">
                    {personalityOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleCheckboxChange('persoonlijkheid', option, 3)}
                        className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                          formData.persoonlijkheid.includes(option)
                            ? 'bg-purple-accent text-white shadow-sm'
                            : 'bg-gray-100 text-charcoal hover:bg-purple-accent/10'
                        }`}
                      >
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

                {/* 11. Hoe ben jij meestal in een nieuwe groep? */}
                <div className="pt-6 border-t border-charcoal/5 mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-3">
                    11. Hoe ben jij meestal in een nieuwe groep? *
                  </label>
                  <div data-field="nieuweGroep" className={`space-y-2 rounded-xl p-1 ${getFieldError('nieuweGroep') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                    {nieuweGroepOptions.map((option) => (
                      <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.nieuweGroep === option ? 'ring-2 ring-purple-accent bg-purple-accent/5' : ''}`}>
                        <input 
                          type="radio" 
                          name="nieuweGroep" 
                          value={option} 
                          checked={formData.nieuweGroep === option} 
                          onChange={(e) => handleRadioChange('nieuweGroep', e.target.value)} 
                          required 
                          className="w-5 h-5 text-purple-accent" 
                        />
                        <span className="text-charcoal text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                  {getFieldError('nieuweGroep') && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError('nieuweGroep')}
                    </p>
                  )}
                  {/* Optioneel tekstveld: Wil je iets toevoegen? */}
                  <div className="mt-3">
                    <input 
                      type="text" 
                      name="nieuweGroepExtra" 
                      value={formData.nieuweGroepExtra} 
                      onChange={handleTextChange} 
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-charcoal/10 text-xs sm:text-sm outline-none focus:border-purple-accent" 
                      placeholder="Wil je iets toevoegen? (optioneel)" 
                    />
                  </div>
                </div>

                {/* 12. Welke rol neem jij meestal op in een vriendengroep? */}
                <div className="pt-6 border-t border-charcoal/5 mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-3">
                    12. Welke rol neem jij meestal op in een vriendengroep? *
                  </label>
                  <div data-field="rolVriendengroep" className={`space-y-2 rounded-xl p-1 ${getFieldError('rolVriendengroep') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                    {rolVriendengroepOptions.map((option) => (
                      <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.rolVriendengroep === option ? 'ring-2 ring-purple-accent bg-purple-accent/5' : ''}`}>
                        <input 
                          type="radio" 
                          name="rolVriendengroep" 
                          value={option} 
                          checked={formData.rolVriendengroep === option} 
                          onChange={(e) => handleRadioChange('rolVriendengroep', e.target.value)} 
                          required 
                          className="w-5 h-5 text-purple-accent" 
                        />
                        <span className="text-charcoal text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                  {getFieldError('rolVriendengroep') && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError('rolVriendengroep')}
                    </p>
                  )}
                  {/* Optioneel tekstveld: Wil je iets toevoegen? */}
                  <div className="mt-3">
                    <input 
                      type="text" 
                      name="rolVriendengroepExtra" 
                      value={formData.rolVriendengroepExtra} 
                      onChange={handleTextChange} 
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-charcoal/10 text-xs sm:text-sm outline-none focus:border-purple-accent" 
                      placeholder="Wil je iets toevoegen? (optioneel)" 
                    />
                  </div>
                </div>

                {/* 13. Hoe sociaal ben jij tijdens een meerdaagse trip? */}
                <div className="pt-6 border-t border-charcoal/5 mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-3">
                    13. Hoe sociaal ben jij tijdens een meerdaagse trip? *
                  </label>
                  <div data-field="sociaalMeerdaagse" className={`space-y-2 rounded-xl p-1 ${getFieldError('sociaalMeerdaagse') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                    {sociaalMeerdaagseOptions.map((option) => (
                      <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.sociaalMeerdaagse === option ? 'ring-2 ring-purple-accent bg-purple-accent/5' : ''}`}>
                        <input 
                          type="radio" 
                          name="sociaalMeerdaagse" 
                          value={option} 
                          checked={formData.sociaalMeerdaagse === option} 
                          onChange={(e) => handleRadioChange('sociaalMeerdaagse', e.target.value)} 
                          required 
                          className="w-5 h-5 text-purple-accent" 
                        />
                        <span className="text-charcoal text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                  {getFieldError('sociaalMeerdaagse') && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError('sociaalMeerdaagse')}
                    </p>
                  )}
                  {/* Optioneel tekstveld: Wil je iets toevoegen? */}
                  <div className="mt-3">
                    <input 
                      type="text" 
                      name="sociaalMeerdaagseExtra" 
                      value={formData.sociaalMeerdaagseExtra} 
                      onChange={handleTextChange} 
                      className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-charcoal/10 text-xs sm:text-sm outline-none focus:border-purple-accent" 
                      placeholder="Wil je iets toevoegen? (optioneel)" 
                    />
                  </div>
                </div>

                {/* 14. Wat doe je graag in je vrije tijd? */}
                <div className="pt-6 border-t border-charcoal/5">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    14. Wat doe je graag in je vrije tijd? <span className="text-charcoal/50">(kies max. 5 interesses)</span> *
                  </label>
                  <div data-field="vrijeTijdInteresses" className="flex flex-wrap gap-2">
                    {vrijeTijdOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleCheckboxChange('vrijeTijdInteresses', option, 5)}
                        className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                          formData.vrijeTijdInteresses.includes(option)
                            ? 'bg-purple-accent text-white shadow-sm'
                            : 'bg-gray-100 text-charcoal hover:bg-purple-accent/10'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {getFieldError('vrijeTijdInteresses') && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError('vrijeTijdInteresses')}
                    </p>
                  )}

                  {/* Automatische functie bij 'Andere' */}
                  {formData.vrijeTijdInteresses.includes('Andere') && (
                    <div className="mt-3 p-3.5 bg-purple-accent/5 rounded-xl border border-purple-accent/20">
                      <label className="block text-xs font-semibold text-charcoal mb-1.5">
                        Welke andere interesses heb je? *
                      </label>
                      <input 
                        type="text" 
                        name="vrijeTijdAnders" 
                        value={formData.vrijeTijdAnders} 
                        onChange={handleTextChange} 
                        onBlur={() => handleBlur('vrijeTijdAnders')}
                        required
                        className="w-full px-3 py-2 bg-white rounded-lg border border-charcoal/15 text-sm outline-none focus:border-purple-accent" 
                        placeholder="Beschrijf je overige interesses..." 
                      />
                      {getFieldError('vrijeTijdAnders') && (
                        <p className="mt-1 text-xs text-red-500">{getFieldError('vrijeTijdAnders')}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* Deel 4: Wat verwacht je van PlotTwist? */}
              {currentStep === 4 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-lavender rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-accent" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-charcoal">Deel 4: Wat verwacht je van PlotTwist?</h4>
                </div>

                {/* 15. Waarom wil je graag mee met PlotTwist? */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    15. Waarom wil je graag mee met PlotTwist? *
                  </label>
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
                    placeholder="Vertel ons waarom je graag mee wilt en wat je aanspreekt aan het concept..." 
                  />
                  {getFieldError('motivatie') && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError('motivatie')}
                    </p>
                  )}
                </div>

                {/* 16. Wat hoop je vooral uit deze expeditie te halen? */}
                <div className="pt-6 border-t border-charcoal/5">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    16. Wat hoop je vooral uit deze expeditie te halen? <span className="text-charcoal/50">(kies max. 2)</span> *
                  </label>
                  <div data-field="doelen" className="grid sm:grid-cols-2 gap-2.5">
                    {doelenOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleCheckboxChange('doelen', option, 2)}
                        className={`p-3.5 rounded-xl text-left text-sm font-medium transition-all border ${
                          formData.doelen.includes(option)
                            ? 'bg-purple-accent text-white border-purple-accent shadow-sm'
                            : 'bg-gray-50 border-charcoal/5 text-charcoal hover:bg-purple-accent/5'
                        }`}
                      >
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
              )}

              {/* Deel 5: Wandelen en fysieke haalbaarheid */}
              {currentStep === 5 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-lavender rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-purple-accent" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-charcoal">Deel 5: Wandelen en fysieke haalbaarheid</h4>
                </div>

                {/* Introductietekst aangepast aan gekozen bestemming */}
                {isItalie ? (
                  <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl mb-6 text-xs sm:text-sm text-charcoal/80 space-y-2">
                    <p className="font-semibold text-charcoal">
                      Tijdens PlotTwist in Italie wandelen we gemiddeld 20 km per dag, soms met hoogteverschillen en met een rugzak van maximaal 10 kg. We nemen pauzes, maar dit vraagt een goede wandelconditie.
                    </p>
                    <p className="italic text-charcoal/70">
                      Je hoeft geen ervaren hiker te zijn, maar langere wandelingen moeten wel haalbaar zijn. Twijfel je? Dan raden we aan om eerst Nederland/Duitsland te kiezen. Daar beleef je minstens evenveel avontuur, met minder fysieke belasting.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-lavender/40 border border-purple-accent/15 rounded-2xl mb-6 text-xs sm:text-sm text-charcoal/80 space-y-2">
                    <p className="font-semibold text-charcoal">
                      Tijdens PlotTwist wandelen we gemiddeld 15 km per dag, verspreid over de hele dag, met een rugzak van maximaal 10 kg. We nemen voldoende pauzes, helpen elkaar en hebben ook rustigere momenten.
                    </p>
                    <p className="italic text-charcoal/70">
                      Je hoeft geen topsporter te zijn! Wees wel eerlijk over je conditie. Ook met minder wandelervaring kan je deelnemen als de expeditie voor jou haalbaar is. Motivatie en bereidheid om je voor te bereiden zijn belangrijk.
                    </p>
                  </div>
                )}

                {/* 17. Hoeveel kilometer denk je momenteel op een dag te kunnen wandelen met een rugzak? */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-3">
                    17. Hoeveel kilometer denk je momenteel op een dag te kunnen wandelen met een rugzak? *
                  </label>
                  <div data-field="kmWandelen" className={`grid sm:grid-cols-2 gap-2.5 rounded-xl p-1 ${getFieldError('kmWandelen') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                    {kmWandelenOptions.map((option) => (
                      <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.kmWandelen === option ? 'ring-2 ring-purple-accent bg-purple-accent/5 font-medium' : ''}`}>
                        <input 
                          type="radio" 
                          name="kmWandelen" 
                          value={option} 
                          checked={formData.kmWandelen === option} 
                          onChange={(e) => handleRadioChange('kmWandelen', e.target.value)} 
                          required 
                          className="w-5 h-5 text-purple-accent" 
                        />
                        <span className="text-charcoal text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                  {getFieldError('kmWandelen') && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError('kmWandelen')}
                    </p>
                  )}
                </div>

                {/* 18. Vraag aangepast aan bestemming */}
                <div className="pt-6 border-t border-charcoal/5">
                  <label className="block text-sm font-medium text-charcoal mb-3">
                    {isItalie 
                      ? '18. Hoe sta je tegenover meerdere dagen na elkaar gemiddeld 20 km wandelen, soms met hoogteverschillen? *'
                      : '18. Hoe sta je tegenover meerdere dagen na elkaar gemiddeld 15 km wandelen? *'}
                  </label>
                  <div data-field="meerdereDagenWandelen" className={`space-y-2 rounded-xl p-1 ${getFieldError('meerdereDagenWandelen') ? 'ring-2 ring-red-300 bg-red-50/30' : ''}`}>
                    {(isItalie ? meerdereDagenWandelenOptionsItalie : meerdereDagenWandelenOptionsNedDui).map((option) => (
                      <label key={option} className={`flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${formData.meerdereDagenWandelen === option ? 'ring-2 ring-purple-accent bg-purple-accent/5 font-medium' : ''}`}>
                        <input 
                          type="radio" 
                          name="meerdereDagenWandelen" 
                          value={option} 
                          checked={formData.meerdereDagenWandelen === option} 
                          onChange={(e) => handleRadioChange('meerdereDagenWandelen', e.target.value)} 
                          required 
                          className="w-5 h-5 text-purple-accent" 
                        />
                        <span className="text-charcoal text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                  {getFieldError('meerdereDagenWandelen') && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError('meerdereDagenWandelen')}
                    </p>
                  )}
                </div>
              </div>
              )}

              {/* Deel 6: De laatste persoonlijke vragen */}
              {currentStep === 6 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-lavender rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-purple-accent" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-charcoal">Deel 6: De laatste persoonlijke vragen</h4>
                </div>

                {/* 19. Waar zouden andere deelnemers zich mogelijk aan kunnen ergeren bij jou? */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    19. Waar zouden andere deelnemers zich mogelijk aan kunnen ergeren bij jou? *
                  </label>
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
                    placeholder="Wees gerust eerlijk! Iedereen heeft gewoontes of mindere kantjes..." 
                  />
                  {getFieldError('ergernissenAnderen') && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError('ergernissenAnderen')}
                    </p>
                  )}
                </div>

                {/* 20. Met welke eigenschappen van andere mensen heb jij het soms moeilijk? */}
                <div className="mb-6 pt-6 border-t border-charcoal/5">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    20. Met welke eigenschappen van andere mensen heb jij het soms moeilijk? *
                  </label>
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
                    placeholder="Denk aan karaktereigenschappen of communicatiestijlen waar je minder goed mee overweg kan..." 
                  />
                  {getFieldError('typePersoonBotsen') && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {getFieldError('typePersoonBotsen')}
                    </p>
                  )}
                </div>

                {/* 21. Is er nog iets dat je ons wilt vertellen voordat we de groepen samenstellen? (optioneel) */}
                <div className="pt-6 border-t border-charcoal/5">
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    21. Is er nog iets dat je ons wilt vertellen voordat we de groepen samenstellen? <span className="text-charcoal/50">(optioneel)</span>
                  </label>
                  <p className="text-xs text-charcoal/60 mb-2">
                    Bijvoorbeeld iets over je persoonlijkheid, met welke mensen je goed klikt of iets waarvan je denkt dat wij het best weten.
                  </p>
                  <textarea 
                    name="extraInfoGroep" 
                    value={formData.extraInfoGroep} 
                    onChange={handleTextChange} 
                    rows={3} 
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-charcoal/10 outline-none focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 resize-none transition-all" 
                    placeholder="Iets toevoegen dat kan helpen bij de groepsindeling..." 
                  />
                </div>
              </div>
              )}

              {/* Deel 7: Praktisch en veiligheid */}
              {currentStep === 7 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-lavender rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-accent" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-charcoal">Deel 7: Praktisch en veiligheid</h4>
                </div>

                {/* 22. Zijn er lichamelijke klachten, medische zaken of allergieen? */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    22. Zijn er lichamelijke klachten, medische zaken of allergieën waarmee we rekening moeten houden om je veilig te laten deelnemen? *
                  </label>
                  <div data-field="medisch" className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${!formData.medisch ? 'bg-purple-accent/10 border-purple-accent text-purple-accent font-semibold' : 'bg-gray-50 border-charcoal/10'}`}>
                      <input 
                        type="radio" 
                        name="medisch" 
                        checked={!formData.medisch} 
                        onChange={() => setFormData(prev => ({ ...prev, medisch: false, medischUitleg: '' }))} 
                        className="sr-only" 
                      />
                      <span>Nee</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.medisch ? 'bg-purple-accent/10 border-purple-accent text-purple-accent font-semibold' : 'bg-gray-50 border-charcoal/10'}`}>
                      <input 
                        type="radio" 
                        name="medisch" 
                        checked={formData.medisch} 
                        onChange={() => setFormData(prev => ({ ...prev, medisch: true }))} 
                        className="sr-only" 
                      />
                      <span>Ja</span>
                    </label>
                  </div>

                  {formData.medisch && (
                    <div className="mt-4 p-4 bg-gray-50/80 rounded-2xl border border-charcoal/10 space-y-2">
                      <label className="block text-sm font-medium text-charcoal">
                        Waarmee moeten we rekening houden? *
                      </label>
                      <textarea 
                        name="medischUitleg" 
                        value={formData.medischUitleg} 
                        onChange={handleTextChange} 
                        onBlur={() => handleBlur('medischUitleg')}
                        required 
                        rows={3} 
                        className={`w-full px-4 py-3 bg-white rounded-xl border outline-none transition-all resize-none ${
                          getFieldError('medischUitleg') 
                            ? 'border-red-400 focus:border-red-500' 
                            : 'border-charcoal/10 focus:border-purple-accent'
                        }`} 
                        placeholder="Beschrijf relevante blessures, medicatie of allergieën..." 
                      />
                      {getFieldError('medischUitleg') && (
                        <p className="text-xs text-red-500">{getFieldError('medischUitleg')}</p>
                      )}
                      <p className="text-xs text-charcoal/50 leading-relaxed italic">
                        Deze informatie wordt afzonderlijk en vertrouwelijk behandeld en is bedoeld voor de veiligheid, niet voor de persoonlijkheidsmatching.
                      </p>
                    </div>
                  )}
                </div>

                {/* 23 & 24. Noodcontact */}
                <div className="grid md:grid-cols-2 gap-4 pt-6 border-t border-charcoal/5">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">23. Noodcontact: volledige naam *</label>
                    <input 
                      type="text" 
                      name="noodcontactNaam" 
                      value={formData.noodcontactNaam} 
                      onChange={handleTextChange} 
                      onBlur={() => handleBlur('noodcontactNaam')}
                      required 
                      className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all ${
                        getFieldError('noodcontactNaam') 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-charcoal/10 focus:border-purple-accent'
                      }`} 
                      placeholder="bv. Mama, partner, broer..." 
                    />
                    {getFieldError('noodcontactNaam') && (
                      <p className="mt-1.5 text-xs text-red-500">{getFieldError('noodcontactNaam')}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">24. Noodcontact: gsm-nummer *</label>
                    <input 
                      type="tel" 
                      name="noodcontactGsm" 
                      value={formData.noodcontactGsm} 
                      onChange={handleTextChange} 
                      onBlur={() => handleBlur('noodcontactGsm')}
                      required 
                      className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all ${
                        getFieldError('noodcontactGsm') 
                          ? 'border-red-400 focus:border-red-500' 
                          : 'border-charcoal/10 focus:border-purple-accent'
                      }`} 
                      placeholder="+32 4XX XX XX XX" 
                    />
                    {getFieldError('noodcontactGsm') && (
                      <p className="mt-1.5 text-xs text-red-500">{getFieldError('noodcontactGsm')}</p>
                    )}
                  </div>
                </div>
              </div>
              )}

              {/* Deel 8: Foto en video */}
              {currentStep === 8 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-lavender rounded-xl flex items-center justify-center">
                    <Camera className="w-5 h-5 text-purple-accent" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-charcoal">Deel 8: Foto en video</h4>
                </div>

                {isInAppBrowser && (
                  <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-900 leading-relaxed flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Tip voor het uploaden:</p>
                      <p>
                        In de ingebouwde browser van Instagram of TikTok kan het kiezen van een bestand soms blokkeren. Open deze pagina via de drie puntjes rechtsboven in Safari of Chrome als een upload niet lukt.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {/* 25. Upload een foto van jezelf */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      25. Upload een foto van jezelf. *
                    </label>
                    <p className="text-xs text-charcoal/50 mb-3">
                      Upload een duidelijke foto waarop we je goed kunnen herkennen.
                    </p>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e, 'foto')} 
                        className="hidden" 
                        id="foto-upload" 
                      />
                      <label htmlFor="foto-upload" className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:bg-lavender/10 ${formData.foto ? 'border-green-400 bg-green-50/30' : getFieldError('foto') ? 'border-red-400 bg-red-50/20' : 'border-charcoal/20'}`}>
                        {formData.foto ? (
                          <>
                            <Check className="w-8 h-8 text-green-600 mb-2" />
                            <span className="text-sm font-medium text-charcoal text-center truncate max-w-full">{formData.foto.name}</span>
                            <span className="text-xs text-charcoal/50 mt-1">{formatFileSize(formData.foto.size)} · Klik om te wijzigen</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-charcoal/40 mb-2" />
                            <span className="text-sm font-medium text-charcoal">Kies een foto</span>
                            <span className="text-xs text-charcoal/50 mt-1">JPG, PNG (max. 50MB)</span>
                          </>
                        )}
                      </label>
                    </div>
                    {getFieldError('foto') && (
                      <p className="mt-1.5 text-xs text-red-500">{getFieldError('foto')}</p>
                    )}
                  </div>

                  {/* 26. Stel jezelf kort voor in een video */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      26. Stel jezelf kort voor in een video van max. 30 sec. <span className="text-charcoal/50">(niet verplicht)</span>
                    </label>
                    <p className="text-xs text-charcoal/50 mb-3">
                      Vertel wie je bent of waarom je zin hebt in PlotTwist. Gewoon jezelf zijn!
                    </p>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="video/*" 
                        onChange={(e) => handleFileChange(e, 'video')} 
                        className="hidden" 
                        id="video-upload" 
                      />
                      <label htmlFor="video-upload" className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:bg-lavender/10 ${formData.video ? 'border-green-400 bg-green-50/30' : getFieldError('video') ? 'border-red-400 bg-red-50/20' : 'border-charcoal/20'}`}>
                        {formData.video ? (
                          <>
                            <Video className="w-8 h-8 text-green-600 mb-2" />
                            <span className="text-sm font-medium text-charcoal text-center truncate max-w-full">{formData.video.name}</span>
                            <span className="text-xs text-charcoal/50 mt-1">{formatFileSize(formData.video.size)} · Klik om te wijzigen</span>
                          </>
                        ) : (
                          <>
                            <Video className="w-8 h-8 text-charcoal/40 mb-2" />
                            <span className="text-sm font-medium text-charcoal">Kies een video (optioneel)</span>
                            <span className="text-xs text-charcoal/50 mt-1">MP4, MOV (max. 50MB)</span>
                          </>
                        )}
                      </label>
                    </div>
                    {getFieldError('video') && (
                      <p className="mt-1.5 text-xs text-red-500">{getFieldError('video')}</p>
                    )}
                  </div>
                </div>
              </div>
              )}

              {/* Stappen-navigatie voor deel 1 t/m 8 */}
              {currentStep < TOTAL_STEPS && (
                <div className="flex items-center justify-between gap-4 pt-2">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white border border-charcoal/15 text-charcoal font-display font-semibold text-sm sm:text-base hover:bg-gray-50 transition-all shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Vorige
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-charcoal text-white font-display font-bold text-sm sm:text-base hover:bg-charcoal/90 transition-all shadow-md hover:shadow-lg group"
                  >
                    Volgende
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              {/* Deel 9: Nog een laatste vraag */}
              {currentStep === 9 && (
              <>
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-lavender rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-accent" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-charcoal">Deel 9: Nog een laatste vraag</h4>
                </div>

                {/* 27. Heeft een vriend of vriendin van jou zich ook ingeschreven voor PlotTwist? */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-3">
                    27. Heeft een vriend of vriendin van jou zich ook ingeschreven voor PlotTwist? *
                  </label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${!formData.vriendenIngeschreven ? 'bg-purple-accent/10 border-purple-accent text-purple-accent font-semibold' : 'bg-gray-50 border-charcoal/10'}`}>
                      <input 
                        type="radio" 
                        name="vriendenIngeschreven" 
                        checked={!formData.vriendenIngeschreven} 
                        onChange={() => setFormData(prev => ({ ...prev, vriendenIngeschreven: false, vriendenNamen: '' }))} 
                        className="sr-only" 
                      />
                      <span>Nee</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.vriendenIngeschreven ? 'bg-purple-accent/10 border-purple-accent text-purple-accent font-semibold' : 'bg-gray-50 border-charcoal/10'}`}>
                      <input 
                        type="radio" 
                        name="vriendenIngeschreven" 
                        checked={formData.vriendenIngeschreven} 
                        onChange={() => setFormData(prev => ({ ...prev, vriendenIngeschreven: true }))} 
                        className="sr-only" 
                      />
                      <span>Ja</span>
                    </label>
                  </div>

                  {formData.vriendenIngeschreven && (
                    <div className="mt-4 p-4 bg-gray-50/80 rounded-2xl border border-charcoal/10 space-y-2 animate-fadeIn">
                      <label className="block text-sm font-medium text-charcoal">
                        Wat is de voornaam en achternaam van die persoon? *
                      </label>
                      <input 
                        type="text" 
                        name="vriendenNamen" 
                        value={formData.vriendenNamen} 
                        onChange={handleTextChange} 
                        onBlur={() => handleBlur('vriendenNamen')}
                        required
                        className={`w-full px-4 py-3 bg-white rounded-xl border outline-none transition-all ${
                          getFieldError('vriendenNamen') ? 'border-red-400 focus:border-red-500' : 'border-charcoal/10 focus:border-purple-accent'
                        }`} 
                        placeholder="Voornaam en achternaam (of meerdere namen)..." 
                      />
                      {getFieldError('vriendenNamen') && (
                        <p className="text-xs text-red-500">{getFieldError('vriendenNamen')}</p>
                      )}
                    </div>
                  )}

                  <div className="p-4 bg-lavender/30 border border-purple-accent/15 rounded-2xl text-xs sm:text-sm text-charcoal/70 leading-relaxed mt-4">
                    Bij PlotTwist matchen we bewust geen vrienden samen, zodat iedereen als onbekende aan hetzelfde avontuur begint. We proberen hier bij het samenstellen van de groepen rekening mee te houden. Ontdek je achteraf dat je toch bij een vriend of vriendin in de groep bent geplaatst? Laat het ons dan zeker weten, dan zoeken we samen naar een passende oplossing.
                  </div>
                </div>
              </div>

              {/* Agreement & Submission */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-charcoal/5 space-y-4">
                {isError && error && (
                  <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-sm text-red-700 flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Er ging iets mis bij het versturen:</p>
                      <p className="mt-0.5 text-xs text-red-600">{error}</p>
                    </div>
                  </div>
                )}

                {/* Terms Agreement */}
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
                    Ik begrijp dat dit een aanvraag is en geen definitieve boeking. Pas na selectie en betaling van het voorschot is mijn plek bevestigd. *
                  </span>
                </label>
                {getFieldError('agreement') && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError('agreement')}
                  </p>
                )}

                {/* Privacy Agreement */}
                <label className="flex items-start gap-3 cursor-pointer">
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
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {getFieldError('privacyAgreement')}
                  </p>
                )}

                {/* Submit & Back Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-charcoal font-display font-semibold text-base transition-all disabled:opacity-50"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Vorige
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-charcoal text-white font-display font-bold text-lg rounded-2xl hover:bg-charcoal/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
                  <div className="mt-4 space-y-1 text-center">
                    {uploadProgress.foto > 0 && uploadProgress.foto < 100 && (
                      <p className="text-xs text-charcoal/50">Foto uploaden...</p>
                    )}
                    {uploadProgress.video > 0 && uploadProgress.video < 100 && (
                      <p className="text-xs text-charcoal/50">Video uploaden...</p>
                    )}
                  </div>
                )}
              </div>
              </>
              )}
            </form>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
