import { z } from 'zod';

// Form validation schema with Dutch error messages
export const signupFormSchema = z.object({
  naam: z.string()
    .min(2, 'Naam moet minstens 2 karakters bevatten')
    .max(100, 'Naam is te lang')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Naam mag alleen letters, spaties en koppeltekens bevatten'),
  
  leeftijd: z.string()
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 18 && num <= 25;
    }, 'Leeftijd moet tussen 18 en 25 jaar zijn'),
  
  woonplaats: z.string()
    .min(2, 'Woonplaats moet minstens 2 karakters bevatten')
    .max(100, 'Woonplaats is te lang'),
  
  gsm: z.string()
    .min(8, 'GSM-nummer is te kort')
    .max(20, 'GSM-nummer is te lang')
    .regex(/^\+?[\d\s\-\(\)\.]+$/, 'GSM-nummer mag alleen cijfers, spaties en + bevatten'),
  
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
    .max(2, 'Je kan maximaal 2 doelen selecteren')
    .optional(),
  
  persoonlijkheid: z.array(z.string())
    .max(3, 'Je kan maximaal 3 eigenschappen selecteren')
    .optional(),
  
  groepsrol: z.string()
    .min(1, 'Selecteer een groepsrol'),
  
  spannendst: z.string()
    .min(1, 'Selecteer wat je het spannendst vindt'),
  
  ongemakkelijk: z.string()
    .min(10, 'Dit veld moet minstens 10 karakters bevatten')
    .max(1000, 'Dit veld is te lang (max 1000 karakters)'),
  
  waaromPassen: z.string()
    .min(10, 'Dit veld moet minstens 10 karakters bevatten')
    .max(1000, 'Dit veld is te lang (max 1000 karakters)'),

  watSpreektAan: z.string()
    .min(1, 'Selecteer wat jou het meest aanspreekt'),

  sportiviteit: z.string()
    .min(1, 'Selecteer hoe sportief je bent'),

  socialeInteractie: z.string()
    .min(1, 'Selecteer hoeveel sociale interactie je fijn vindt'),

  zelfstandigheid: z.string()
    .min(1, 'Selecteer hoe zelfstandig je je voelt tijdens reizen'),
  
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
    .regex(/^\+?[\d\s\-\(\)\.]+$/, 'GSM-nummer mag alleen cijfers, spaties en + bevatten'),
  
  foto: z.instanceof(File).optional().nullable()
    .refine((file) => !file || file.size <= 10 * 1024 * 1024, {
      message: 'Afbeelding mag maximaal 10MB zijn',
    })
    .refine((file) => !file || ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type), {
      message: 'Alleen afbeeldingen (JPG, PNG, WebP, GIF) zijn toegestaan',
    }),
  video: z.instanceof(File).optional().nullable()
    .refine((file) => !file || file.size <= 50 * 1024 * 1024, {
      message: 'Video mag maximaal 50MB zijn',
    })
    .refine((file) => !file || ['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type), {
      message: 'Alleen video\'s (MP4, WebM, MOV) zijn toegestaan',
    }),
});

export type SignupFormData = z.infer<typeof signupFormSchema>;

// Custom validation for file types and sizes
export const validateFile = (file: File | null, type: 'image' | 'video'): string | null => {
  if (!file) return null;
  
  if (type === 'image') {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return 'Alleen afbeeldingen (JPG, PNG, WebP, GIF) zijn toegestaan';
    }
    if (file.size > 10 * 1024 * 1024) {
      return 'Afbeelding mag maximaal 10MB zijn';
    }
  }
  
  if (type === 'video') {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return 'Alleen video\'s (MP4, WebM, MOV) zijn toegestaan';
    }
    if (file.size > 50 * 1024 * 1024) {
      return 'Video mag maximaal 50MB zijn';
    }
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
