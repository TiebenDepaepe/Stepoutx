import { useEffect, useRef, useState } from 'react';
import { Send, Upload, Check, User, Calendar, Heart, Users, Shield, Camera, Video, Sparkles } from 'lucide-react';

// Available dates for selection
const availableDates = [
  '6-12 april 2025',
  '20-26 april 2025',
  '4-10 mei 2025',
  '18-24 mei 2025',
  '1-7 juni 2025',
  '15-21 juni 2025',
];

// Motivation options
const motivationOptions = [
  'nieuwe vrienden',
  'zelfvertrouwen',
  'avontuur',
  'uit comfortzone',
  'even weg uit mijn omgeving',
  'iets totaal nieuws proberen',
];

// Personality options
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
  'dromerig',
];

// Group role options
const groupRoleOptions = [
  { value: 'stille-observator', label: 'de stille observator' },
  { value: 'rustig-aanwezig', label: 'rustig maar aanwezig' },
  { value: 'snel-praten', label: 'iemand die snel praat met iedereen' },
  { value: 'grappenmaker', label: 'de grappenmaker' },
  { value: 'initiatief', label: 'degene die initiatief neemt' },
];

// Excitement options
const excitementOptions = [
  { value: 'nieuwe-mensen', label: 'nieuwe mensen leren kennen' },
  { value: 'liften', label: 'liften' },
  { value: 'overnachten', label: 'overnachten bij onbekenden' },
  { value: 'geen-planning', label: 'geen vaste planning' },
  { value: 'fysiek', label: 'fysiek moe worden' },
];

interface FormData {
  // Part 1 - Basic
  naam: string;
  leeftijd: string;
  woonplaats: string;
  gsm: string;
  email: string;
  instagram: string;
  // Part 2 - Availability
  beschikbaarheid: string[];
  // Part 3 - Motivation
  motivatie: string;
  doelen: string[];
  // Part 4 - Personality
  persoonlijkheid: string[];
  groepsrol: string;
  spannendst: string;
  ongemakkelijk: string;
  waaromPassen: string;
  // Part 5 - Practical
  medisch: boolean;
  medischUitleg: string;
  noodcontactNaam: string;
  noodcontactGsm: string;
  // Part 6 - Optional
  foto: File | null;
  video: File | null;
}

const initialFormData: FormData = {
  naam: '',
  leeftijd: '',
  woonplaats: '',
  gsm: '',
  email: '',
  instagram: '',
  beschikbaarheid: [],
  motivatie: '',
  doelen: [],
  persoonlijkheid: [],
  groepsrol: '',
  spannendst: '',
  ongemakkelijk: '',
  waaromPassen: '',
  medisch: false,
  medischUitleg: '',
  noodcontactNaam: '',
  noodcontactGsm: '',
  foto: null,
  video: null,
};

export default function SignupForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: keyof FormData, value: string, max?: number) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) };
      }
      if (max && current.length >= max) {
        return prev;
      }
      return { ...prev, [field]: [...current, value] };
    });
  };

  const handleRadioChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: 'foto' | 'video', file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would normally send the data to your backend
    console.log('Form submitted:', formData);
  };

  if (submitted) {
    return (
      <section ref={sectionRef} className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-mint rounded-3xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
              Bedankt voor je inschrijving!
            </h2>
            <p className="text-charcoal/70 text-lg">
              We nemen zo snel mogelijk contact met je op. Hou je mailbox in de gaten!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-8 opacity-20">
        <Sparkles className="w-8 h-8" />
      </div>
      <div className="absolute top-40 right-12 opacity-15">
        <div className="w-4 h-4 rounded-full bg-charcoal/20" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-lavender rounded-full text-sm font-medium text-charcoal mb-6">
            <Send className="w-4 h-4 text-purple-accent" />
            INSCHRIJVEN
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-charcoal mb-4">
            Schrijf je in voor een <span className="text-purple-accent">StepOut</span>-reis
          </h2>
          <p className="text-lg text-charcoal/60 max-w-2xl mx-auto">
            Vul het formulier in en we nemen zo snel mogelijk contact met je op
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Part 1 - Basic Info */}
          <div className="bg-mint rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-purple-accent" />
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal">Deel 1 – Basis</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Naam *</label>
                <input
                  type="text"
                  name="naam"
                  value={formData.naam}
                  onChange={handleTextChange}
                  required
                  className="w-full px-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all"
                  placeholder="Jouw naam"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Leeftijd *</label>
                <input
                  type="number"
                  name="leeftijd"
                  value={formData.leeftijd}
                  onChange={handleTextChange}
                  required
                  min="18"
                  max="25"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all"
                  placeholder="18-25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Woonplaats *</label>
                <input
                  type="text"
                  name="woonplaats"
                  value={formData.woonplaats}
                  onChange={handleTextChange}
                  required
                  className="w-full px-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all"
                  placeholder="Stad/dorp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">GSM-nummer *</label>
                <input
                  type="tel"
                  name="gsm"
                  value={formData.gsm}
                  onChange={handleTextChange}
                  required
                  className="w-full px-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all"
                  placeholder="+32 4XX XX XX XX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">E-mail *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleTextChange}
                  required
                  className="w-full px-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all"
                  placeholder="jouw@email.be"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Instagram <span className="text-charcoal/50">(optioneel)</span>
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleTextChange}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all"
                  placeholder="@jouwprofiel"
                />
              </div>
            </div>
          </div>

          {/* Part 2 - Availability */}
          <div className="bg-lavender rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5 text-purple-accent" />
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal">Deel 2 – Beschikbaarheid</h3>
            </div>

            <p className="text-sm text-charcoal/70 mb-4">Welke data kan je? (meerkeuze)</p>
            <div className="flex flex-wrap gap-3">
              {availableDates.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => handleCheckboxChange('beschikbaarheid', date)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.beschikbaarheid.includes(date)
                      ? 'bg-purple-accent text-white'
                      : 'bg-white text-charcoal hover:bg-purple-accent/10'
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          {/* Part 3 - Motivation */}
          <div className="bg-blush rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5 text-purple-accent" />
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal">Deel 3 – Motivatie</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Waarom wil je mee met StepOut? *
                </label>
                <textarea
                  name="motivatie"
                  value={formData.motivatie}
                  onChange={handleTextChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all resize-none"
                  placeholder="Vertel ons waarom je mee wilt..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-3">
                  Wat hoop je uit deze reis te halen? <span className="text-charcoal/50">(kies max. 2)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {motivationOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleCheckboxChange('doelen', option, 2)}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        formData.doelen.includes(option)
                          ? 'bg-purple-accent text-white'
                          : 'bg-white text-charcoal hover:bg-purple-accent/10'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Part 4 - Personality */}
          <div className="bg-sky-soft rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Users className="w-5 h-5 text-purple-accent" />
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal">Deel 4 – Persoonlijkheid & groepsdynamiek</h3>
            </div>

            <div className="space-y-8">
              {/* Personality traits */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-3">
                  Hoe zouden je vrienden jou omschrijven? <span className="text-charcoal/50">(kies max. 3)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {personalityOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleCheckboxChange('persoonlijkheid', option, 3)}
                      className={`px-3 py-2 rounded-full text-sm transition-all ${
                        formData.persoonlijkheid.includes(option)
                          ? 'bg-purple-accent text-white'
                          : 'bg-white text-charcoal hover:bg-purple-accent/10'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Group role - Radio */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-3">
                  In een nieuwe groep ben jij meestal: *
                </label>
                <div className="space-y-2">
                  {groupRoleOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${
                        formData.groepsrol === option.value ? 'ring-2 ring-purple-accent' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="groepsrol"
                        value={option.value}
                        checked={formData.groepsrol === option.value}
                        onChange={(e) => handleRadioChange('groepsrol', e.target.value)}
                        required
                        className="w-5 h-5 text-purple-accent"
                      />
                      <span className="text-charcoal">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Excitement - Radio */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-3">
                  Wat vind je het spannendst aan deze reis? *
                </label>
                <div className="space-y-2">
                  {excitementOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer transition-all hover:bg-purple-accent/5 ${
                        formData.spannendst === option.value ? 'ring-2 ring-purple-accent' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="spannendst"
                        value={option.value}
                        checked={formData.spannendst === option.value}
                        onChange={(e) => handleRadioChange('spannendst', e.target.value)}
                        required
                        className="w-5 h-5 text-purple-accent"
                      />
                      <span className="text-charcoal">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Open questions */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Hoe ga jij meestal om met ongemakkelijke of spannende situaties? *
                </label>
                <textarea
                  name="ongemakkelijk"
                  value={formData.ongemakkelijk}
                  onChange={handleTextChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all resize-none"
                  placeholder="Beschrijf kort..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Waarom zou jij goed in een StepOut-groep passen? *
                </label>
                <textarea
                  name="waaromPassen"
                  value={formData.waaromPassen}
                  onChange={handleTextChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all resize-none"
                  placeholder="Vertel ons waarom..."
                />
              </div>
            </div>
          </div>

          {/* Part 5 - Practical */}
          <div className="bg-mint rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Shield className="w-5 h-5 text-purple-accent" />
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal">Deel 5 – Praktisch & veiligheid</h3>
            </div>

            <div className="space-y-6">
              {/* Medical */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-3">
                  Heb je medische zaken of allergieën waar we rekening mee moeten houden?
                </label>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="medisch"
                      checked={!formData.medisch}
                      onChange={() => setFormData((prev) => ({ ...prev, medisch: false, medischUitleg: '' }))}
                      className="w-5 h-5 text-purple-accent"
                    />
                    <span className="text-charcoal">Nee</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="medisch"
                      checked={formData.medisch}
                      onChange={() => setFormData((prev) => ({ ...prev, medisch: true }))}
                      className="w-5 h-5 text-purple-accent"
                    />
                    <span className="text-charcoal">Ja</span>
                  </label>
                </div>
                {formData.medisch && (
                  <textarea
                    name="medischUitleg"
                    value={formData.medischUitleg}
                    onChange={handleTextChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all resize-none"
                    placeholder="Leg uit..."
                  />
                )}
              </div>

              {/* Emergency contact */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Noodcontact naam *</label>
                  <input
                    type="text"
                    name="noodcontactNaam"
                    value={formData.noodcontactNaam}
                    onChange={handleTextChange}
                    required
                    className="w-full px-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all"
                    placeholder="Naam"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Noodcontact GSM *</label>
                  <input
                    type="tel"
                    name="noodcontactGsm"
                    value={formData.noodcontactGsm}
                    onChange={handleTextChange}
                    required
                    className="w-full px-4 py-3 bg-white rounded-xl border border-charcoal/10 focus:border-purple-accent focus:ring-2 focus:ring-purple-accent/20 outline-none transition-all"
                    placeholder="+32 4XX XX XX XX"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Part 6 - Optional Uploads */}
          <div className="bg-lavender rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Camera className="w-5 h-5 text-purple-accent" />
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal">Deel 6 – Optioneel (maar waardevol)</h3>
            </div>

            <div className="space-y-6">
              {/* Photo upload */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-3">
                  Upload een foto <span className="text-charcoal/50">(optioneel)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('foto', e.target.files?.[0] || null)}
                    className="hidden"
                    id="foto-upload"
                  />
                  <label
                    htmlFor="foto-upload"
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-dashed border-charcoal/20 cursor-pointer hover:border-purple-accent hover:bg-purple-accent/5 transition-all"
                  >
                    <Upload className="w-5 h-5 text-charcoal/50" />
                    <span className="text-charcoal/70">
                      {formData.foto ? formData.foto.name : 'Klik om een foto te uploaden'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Video upload */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Upload een korte video <span className="text-charcoal/50">(15–30 sec, optioneel)</span>
                </label>
                <p className="text-xs text-charcoal/50 mb-3">
                  Vertel kort wie je bent en waarom je mee wil.
                </p>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileChange('video', e.target.files?.[0] || null)}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-dashed border-charcoal/20 cursor-pointer hover:border-purple-accent hover:bg-purple-accent/5 transition-all"
                  >
                    <Video className="w-5 h-5 text-charcoal/50" />
                    <span className="text-charcoal/70">
                      {formData.video ? formData.video.name : 'Klik om een video te uploaden'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="btn-primary text-lg px-10 py-4 group"
            >
              <Send className="w-5 h-5 mr-2" />
              Verstuur inschrijving
            </button>
            <p className="text-sm text-charcoal/50 mt-4">
              Door te versturen ga je akkoord met onze voorwaarden
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
