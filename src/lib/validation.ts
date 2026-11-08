import { z } from 'zod';

// Form validation schema with Dutch error messages
export const signupFormSchema = z.object({
  // Deel 1: Even kennismaken
  naam: z.string()
    .min(2, 'Vul je volledige voor- en achternaam in')
    .max(100, 'Naam is te lang'),
  
  geboortedatum: z.string()
    .min(1, 'Vul je geboortedatum in')
    .refine((val) => {
      const d = new Date(val);
      if (isNaN(d.getTime())) return false;
      const today = new Date();
      let age = today.getFullYear() - d.getFullYear();
      const m = today.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
      return age >= 16 && age <= 40;
    }, 'Controleer je geboortedatum (expedities zijn gericht op jongvolwassenen)'),
  
  woonplaats: z.string()
    .min(2, 'Vul je woonplaats (gemeente of stad) in')
    .max(100, 'Woonplaats is te lang'),
  
  gsm: z.string()
    .min(8, 'GSM-nummer is te kort')
    .max(20, 'GSM-nummer is te lang')
    .regex(/^\+?[\d\s().-]+$/, 'GSM-nummer mag alleen cijfers, spaties en + bevatten'),
  
  email: z.string()
    .email('Ongeldig e-mailadres')
    .min(5, 'E-mailadres is te kort')
    .max(100, 'E-mailadres is te lang'),
  
  instagram: z.string()
    .min(1, 'Vul je Instagram-gebruikersnaam in')
    .max(60, 'Instagram-gebruikersnaam is te lang'),
  
  huidigeBezigheid: z.string()
    .min(1, 'Selecteer wat je momenteel doet'),
  
  studieUitleg: z.string().optional().or(z.literal('')),
  werkUitleg: z.string().optional().or(z.literal('')),
  bezigheidAndersUitleg: z.string().optional().or(z.literal('')),
  
  // Deel 2: Jouw expeditie
  expeditieVoorkeur: z.string()
    .min(1, 'Selecteer welke expeditie jouw voorkeur heeft'),
  
  beschikbaarheid: z.array(z.string())
    .min(1, 'Selecteer minstens één beschikbare reisweek'),
  
  // Deel 3: Wie ben jij?
  persoonlijkheid: z.array(z.string())
    .min(1, 'Selecteer minstens één eigenschap')
    .max(3, 'Je kan maximaal 3 eigenschappen selecteren'),
  
  nieuweGroep: z.string()
    .min(1, 'Selecteer hoe jij meestal bent in een nieuwe groep'),
  
  nieuweGroepExtra: z.string().optional().or(z.literal('')),
  
  rolVriendengroep: z.string()
    .min(1, 'Selecteer welke rol je meestal opneemt in een vriendengroep'),
  
  rolVriendengroepExtra: z.string().optional().or(z.literal('')),
  
  sociaalMeerdaagse: z.string()
    .min(1, 'Selecteer hoe sociaal jij bent tijdens een meerdaagse trip'),
  
  sociaalMeerdaagseExtra: z.string().optional().or(z.literal('')),
  
  vrijeTijdInteresses: z.array(z.string())
    .min(1, 'Selecteer minstens één interesse')
    .max(5, 'Je kan maximaal 5 interesses selecteren'),
  
  vrijeTijdAnders: z.string().optional().or(z.literal('')),
  
  // Deel 4: Wat verwacht je van PlotTwist?
  motivatie: z.string()
    .min(10, 'Vertel ons wat meer over waarom je mee wilt (minstens 10 karakters)')
    .max(2000, 'Tekst is te lang (max 2000 karakters)'),
  
  doelen: z.array(z.string())
    .min(1, 'Selecteer minstens één doel')
    .max(2, 'Je kan maximaal 2 doelen selecteren'),
  
  // Deel 5: Wandelen en fysieke haalbaarheid
  kmWandelen: z.string()
    .min(1, 'Selecteer hoeveel kilometer je denkt te kunnen wandelen'),
  
  meerdereDagenWandelen: z.string()
    .min(1, 'Selecteer hoe je staat tegenover meerdere dagen wandelen'),
  
  // Deel 6: De laatste persoonlijke vragen
  ergernissenAnderen: z.string()
    .min(5, 'Dit veld moet minstens 5 karakters bevatten')
    .max(1000, 'Dit veld is te lang (max 1000 karakters)'),
  
  typePersoonBotsen: z.string()
    .min(5, 'Dit veld moet minstens 5 karakters bevatten')
    .max(1000, 'Dit veld is te lang (max 1000 karakters)'),
  
  extraInfoGroep: z.string().optional().or(z.literal('')),
  
  // Deel 7: Praktisch en veiligheid
  medisch: z.boolean(),
  
  medischUitleg: z.string()
    .max(1000, 'Toelichting is te lang')
    .optional()
    .or(z.literal('')),
  
  noodcontactNaam: z.string()
    .min(2, 'Naam noodcontact is te kort')
    .max(100, 'Naam noodcontact is te lang'),
  
  noodcontactGsm: z.string()
    .min(8, 'GSM-nummer noodcontact is te kort')
    .max(20, 'GSM-nummer noodcontact is te lang')
    .regex(/^\+?[\d\s().-]+$/, 'GSM-nummer mag alleen cijfers, spaties en + bevatten'),
  
  // Deel 8: Foto en video
  foto: z.instanceof(File)
    .refine((file) => file.size <= 50 * 1024 * 1024, {
      message: 'Foto is te groot, maximaal 50MB toegelaten. Kies een kleinere foto.',
    })
    .nullable()
    .optional(),
  video: z.instanceof(File)
    .refine((file) => file.size <= 50 * 1024 * 1024, {
      message: 'Video is te groot, maximaal 50MB toegelaten. Tip: film in 1080p in plaats van 4K, of maak je video iets korter.',
    })
    .nullable()
    .optional(),
  
  // Deel 9: Nog een laatste vraag
  vriendenIngeschreven: z.boolean(),
  vriendenNamen: z.string().optional().or(z.literal('')),
  
  // Voorwaarden & Privacy
  agreement: z.boolean()
    .refine((val) => val === true, 'Je moet akkoord gaan met de voorwaarden'),

  voorwaardenAgreement: z.boolean()
    .refine((val) => val === true, 'Je moet akkoord gaan met de algemene voorwaarden'),

  privacyAgreement: z.boolean()
    .refine((val) => val === true, 'Je moet akkoord gaan met het privacybeleid'),
});

export type SignupFormData = z.infer<typeof signupFormSchema>;

// Custom validation for file types and sizes
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const formatMB = (bytes: number): string => (bytes / (1024 * 1024)).toFixed(0);

export const validateFile = (file: File | null, type: 'image' | 'video'): string | null => {
  if (!file) return null;

  if (file.size > MAX_FILE_SIZE) {
    if (type === 'image') {
      return `Deze foto is ${formatMB(file.size)}MB, maximaal 50MB toegelaten. Kies een kleinere foto.`;
    }
    return `Deze video is ${formatMB(file.size)}MB, maximaal 50MB toegelaten. Tip: film in 1080p in plaats van 4K, of maak je video iets korter.`;
  }

  return null;
};

// Helper to validate form and return field errors
export const validateForm = (data: unknown): { success: true; data: SignupFormData } | { success: false; errors: Record<string, string> } => {
  const result = signupFormSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result.error.issues.forEach((err: any) => {
    const field = String(err.path[0]);
    if (!errors[field]) {
      errors[field] = err.message;
    }
  });
  
  return { success: false, errors };
};
