import { z } from 'zod';

// Form validation schema with Dutch error messages
export const signupFormSchema = z.object({
  naam: z.string()
    .min(2, 'Naam moet minstens 2 karakters bevatten')
    .max(100, 'Naam is te lang')
    .regex(/^[\p{L}\s'.\-]+$/u, 'Naam mag alleen letters, spaties en koppeltekens bevatten'),
  
  leeftijd: z.string()
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 18 && num <= 26;
    }, 'Leeftijd moet tussen 18 en 26 jaar zijn'),
  
  woonplaats: z.string()
    .min(2, 'Woonplaats moet minstens 2 karakters bevatten')
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
    .max(50, 'Instagram handle is te lang')
    .optional()
    .or(z.literal('')),
  
  beschikbaarheid: z.array(z.string())
    .min(1, 'Selecteer minstens één beschikbare datum'),
  
  motivatie: z.string()
    .min(20, 'Motivatie moet minstens 20 karakters bevatten')
    .max(2000, 'Motivatie is te lang (max 2000 karakters)'),
  
  doelen: z.array(z.string())
    .min(1, 'Selecteer minstens één doel')
    .max(2, 'Je kan maximaal 2 doelen selecteren'),
  
  kmWandelen: z.string()
    .min(1, 'Selecteer hoeveel kilometer je kan wandelen'),
  
  meerdereDagenWandelen: z.string()
    .min(1, 'Selecteer je voorkeur voor meerdere dagen wandelen'),
  
  bereidTrainen: z.string()
    .min(1, 'Selecteer of je bereid bent te trainen'),
  
  fysiekeUitdaging: z.string()
    .min(1, 'Selecteer de gewenste hoeveelheid fysieke uitdaging'),
  
  sportiviteit: z.string()
    .min(1, 'Selecteer hoe sportief je bent'),
  
  lichamelijkeKlachten: z.string()
    .min(1, 'Vul in of je klachten of beperkingen hebt'),
  
  persoonlijkheid: z.array(z.string())
    .min(1, 'Selecteer minstens één eigenschap')
    .max(3, 'Je kan maximaal 3 eigenschappen selecteren'),
  
  groepsrol: z.string()
    .min(1, 'Selecteer een groepsrol'),
  
  socialeInteractie: z.string()
    .min(1, 'Selecteer hoeveel sociale interactie je fijn vindt'),
  
  spannendst: z.string()
    .min(1, 'Selecteer wat je het spannendst vindt'),
  
  reactieRegenMoeheid: z.string()
    .min(1, 'Selecteer hoe je reageert in deze situatie'),
  
  omgangTragerWandelen: z.string()
    .min(1, 'Selecteer hoe je omgaat met tragere wandelaars'),
  
  eigenMoeheid: z.string()
    .min(1, 'Selecteer wat je doet bij eigen moeheid'),
  
  ongemakkelijk: z.string()
    .min(5, 'Dit veld moet minstens 5 karakters bevatten')
    .max(1000, 'Dit veld is te lang (max 1000 karakters)'),
  
  omgangGroepsbeslissing: z.string()
    .min(1, 'Selecteer hoe je omgaat met groepsbeslissingen'),
  
  omgangIrritatiesConflicten: z.string()
    .min(1, 'Selecteer hoe je omgaat met irritaties of conflicten'),
  
  zelfstandigheid: z.string()
    .min(1, 'Selecteer hoe zelfstandig je bent'),
  
  watSpreektAan: z.string()
    .min(1, 'Selecteer wat jou het meest aanspreekt'),
  
  waaromPassen: z.string()
    .min(5, 'Dit veld moet minstens 5 karakters bevatten')
    .max(1000, 'Dit veld is te lang (max 1000 karakters)'),
  
  ergernissenAnderen: z.string()
    .min(5, 'Dit veld moet minstens 5 karakters bevatten')
    .max(1000, 'Dit veld is te lang (max 1000 karakters)'),
  
  typePersoonBotsen: z.string()
    .min(5, 'Dit veld moet minstens 5 karakters bevatten')
    .max(1000, 'Dit veld is te lang (max 1000 karakters)'),
  
  behoefteGroepMoeilijk: z.string()
    .min(1, 'Selecteer wat je van de groep nodig hebt'),
  
  redenStoppen: z.string()
    .min(5, 'Dit veld moet minstens 5 karakters bevatten')
    .max(1000, 'Dit veld is te lang (max 1000 karakters)'),
  
  medisch: z.boolean(),
  
  medischUitleg: z.string()
    .max(1000, 'Medische uitleg is te lang')
    .optional()
    .or(z.literal('')),
  
  noodcontactNaam: z.string()
    .min(2, 'Naam noodcontact is te kort')
    .max(100, 'Naam noodcontact is te lang'),
  
  noodcontactGsm: z.string()
    .min(8, 'GSM-nummer noodcontact is te kort')
    .max(20, 'GSM-nummer noodcontact is te lang')
    .regex(/^\+?[\d\s().-]+$/, 'GSM-nummer mag alleen cijfers, spaties en + bevatten'),
  
  foto: z.instanceof(File, { message: 'Upload een foto van jezelf' })
    .refine((file) => file.size <= 50 * 1024 * 1024, {
      message: 'Foto is te groot, maximaal 50MB toegelaten. Kies een kleinere foto.',
    }),
  video: z.instanceof(File)
    .refine((file) => file.size <= 50 * 1024 * 1024, {
      message: 'Video is te groot, maximaal 50MB toegelaten. Tip: film in 1080p in plaats van 4K, of maak je video iets korter.',
    })
    .nullable()
    .optional(),
  
  agreement: z.boolean()
    .refine((val) => val === true, 'Je moet akkoord gaan met de voorwaarden'),

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
