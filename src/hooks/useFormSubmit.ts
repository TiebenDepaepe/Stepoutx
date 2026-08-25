import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface FormData {
  naam: string;
  leeftijd: string;
  woonplaats: string;
  gsm: string;
  email: string;
  instagram: string;
  beschikbaarheid: string[];
  motivatie: string;
  doelen: string[];
  persoonlijkheid: string[];
  groepsrol: string;
  spannendst: string;
  ongemakkelijk: string;
  waaromPassen: string;
  watSpreektAan: string;
  sportiviteit: string;
  socialeInteractie: string;
  zelfstandigheid: string;
  
  // New questions for Part 4
  kmWandelen: string;
  meerdereDagenWandelen: string;
  bereidTrainen: string;
  fysiekeUitdaging: string;
  lichamelijkeKlachten: string;
  reactieRegenMoeheid: string;
  omgangTragerWandelen: string;
  eigenMoeheid: string;
  omgangGroepsbeslissing: string;
  omgangIrritatiesConflicten: string;
  ergernissenAnderen: string;
  typePersoonBotsen: string;
  behoefteGroepMoeilijk: string;
  redenStoppen: string;

  medisch: boolean;
  medischUitleg: string;
  noodcontactNaam: string;
  noodcontactGsm: string;
  foto: File | null;
  video: File | null;
  agreement: boolean;
  privacyAgreement: boolean;
}

interface SubmitState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  uploadProgress: {
    foto: number;
    video: number;
  };
  /** Dutch sentences about uploads that failed while the registration itself was saved. */
  uploadWarnings: string[];
}

interface SubmitResult {
  success: boolean;
  error?: string;
  warnings?: string[];
}

type UploadKind = 'foto' | 'video';

/** An upload error whose message is already a finished Dutch sentence. */
export class UploadFailure extends Error {
  /** De onvertaalde oorzaak, voor de notitie die de admin te zien krijgt. */
  readonly technical: string;

  constructor(message: string, technical = '') {
    super(message);
    this.technical = technical;
  }
}

/**
 * A File from an <input> is a pointer to a file on the device, not a copy of
 * its bytes. That pointer can go stale while someone works through the rest of
 * this (long) form: the browser gets backgrounded, memory pressure hits, or the
 * photo lives in iCloud and was never downloaded locally. `name` and `size`
 * keep reporting their cached values, so validation still passes – and the
 * upload then sends an empty body, which Storage rejects with "No content
 * provided". Touching one byte up front turns that into a usable message.
 */
export const assertFileReadable = async (file: File, kind: UploadKind): Promise<void> => {
  if (file.size === 0) {
    throw new UploadFailure(
      `Je ${kind} is leeg (0 bytes). Waarschijnlijk is het bestand niet volledig op je toestel opgeslagen. Kies je ${kind} opnieuw en probeer het nog eens.`,
      'file.size === 0'
    );
  }

  // Safari only gained Blob.arrayBuffer() in 14. Without it we cannot probe, and
  // guessing would reject perfectly good files - so let the upload decide.
  if (typeof file.slice !== 'function' || typeof file.slice(0, 1).arrayBuffer !== 'function') {
    return;
  }

  try {
    const firstByte = await file.slice(0, 1).arrayBuffer();
    if (firstByte.byteLength === 0) throw new Error('read returned no bytes');
  } catch (readError) {
    // Worth logging: Storage request logs are not reachable from the CLI, so
    // this console line is the only trace of why an upload never started.
    console.error(`File no longer readable (${kind}):`, readError);
    throw new UploadFailure(
      `We konden je ${kind} niet meer lezen. Dat gebeurt soms als je tussendoor van app wisselde, of als het bestand nog in iCloud of Google Foto's staat. Selecteer je ${kind} hierboven opnieuw en verstuur daarna meteen – al je andere antwoorden blijven gewoon staan.`,
      `unreadable: ${readError instanceof Error ? readError.message : String(readError)}`
    );
  }
};

/** Turns a Supabase Storage error into something a Dutch visitor can act on. */
export const uploadErrorMessage = (message: string, kind: UploadKind): string => {
  const normalized = message.toLowerCase();

  if (normalized.includes('no content provided')) {
    return `Je ${kind} kwam leeg aan bij de server, ook al staat het bestand op je toestel. Selecteer je ${kind} hierboven opnieuw en verstuur daarna meteen – al je andere antwoorden blijven gewoon staan.`;
  }

  if (
    normalized.includes('maximum allowed size') ||
    normalized.includes('payload too large') ||
    normalized.includes('entity too large')
  ) {
    return kind === 'foto'
      ? 'Je foto is te groot voor de server. Kies een kleinere foto, maximaal 50MB toegelaten.'
      : 'Je video is te groot voor de server. Maximaal 50MB toegelaten. Tip: film in 1080p in plaats van 4K, of maak je video iets korter.';
  }

  if (
    normalized.includes('failed to fetch') ||
    normalized.includes('networkerror') ||
    normalized.includes('network request failed') ||
    normalized.includes('load failed')
  ) {
    return `Het uploaden van je ${kind} is onderbroken – de verbinding viel weg. Probeer het opnieuw, het liefst op wifi.`;
  }

  return `Het uploaden van je ${kind} is mislukt. Probeer het opnieuw, of stuur ons een bericht via Instagram als het blijft mislukken.`;
};

export function useFormSubmit() {
  const [state, setState] = useState<SubmitState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    error: null,
    uploadProgress: { foto: 0, video: 0 },
    uploadWarnings: [],
  });

  const uploadFile = async (
    file: File,
    folder: 'photos' | 'videos'
  ): Promise<string | null> => {
    const kind: UploadKind = folder === 'photos' ? 'foto' : 'video';

    // Bail out early with a message the visitor can act on, instead of letting
    // Storage reject an empty body with an English API error.
    await assertFileReadable(file, kind);

    // Create unique filename: folder/timestamp_random.ext
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const fileName = `${folder}/${timestamp}_${randomStr}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new UploadFailure(uploadErrorMessage(uploadError.message, kind), uploadError.message);
      }

      // Return the file path (not public URL - bucket is private)
      return fileName;
    } catch (error) {
      // Already translated above - do not run it through the mapper twice.
      if (error instanceof UploadFailure) throw error;

      const raw = error instanceof Error ? error.message : String(error);
      console.error(`Upload error for ${folder}:`, error);
      throw new UploadFailure(uploadErrorMessage(raw, kind), raw);
    }
  };

  const submitForm = async (data: FormData): Promise<SubmitResult> => {
    setState({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
      error: null,
      uploadProgress: { foto: 0, video: 0 },
      uploadWarnings: [],
    });

    try {
      // 1. Upload files first (if any)
      let fotoPath: string | null = null;
      let videoPath: string | null = null;
      const warnings: string[] = [];
      const diagnostics: string[] = [];

      /**
       * Een mislukte upload mag nooit een volledig ingevuld formulier kosten. Op
       * telefoons gaat uploaden regelmatig mis (in-app browser, iCloud, groot
       * bestand); we slaan de inschrijving dan gewoon op zonder het bestand en
       * vertellen achteraf wat er ontbreekt.
       */
      const tryUpload = async (
        file: File,
        folder: 'photos' | 'videos',
        kind: UploadKind
      ): Promise<string | null> => {
        setState(s => ({ ...s, uploadProgress: { ...s.uploadProgress, [kind]: 30 } }));
        try {
          const path = await uploadFile(file, folder);
          setState(s => ({ ...s, uploadProgress: { ...s.uploadProgress, [kind]: 100 } }));
          return path;
        } catch (uploadError) {
          console.error(`Upload skipped for ${kind}:`, uploadError);
          setState(s => ({ ...s, uploadProgress: { ...s.uploadProgress, [kind]: 0 } }));
          warnings.push(
            uploadError instanceof Error
              ? uploadError.message
              : `Het uploaden van je ${kind} is mislukt.`
          );
          diagnostics.push(
            `${kind} (${file.name}, ${Math.round(file.size / 1024)} KB): ${
              uploadError instanceof UploadFailure && uploadError.technical
                ? uploadError.technical
                : uploadError instanceof Error
                  ? uploadError.message
                  : String(uploadError)
            }`
          );
          return null;
        }
      };

      if (data.foto) {
        fotoPath = await tryUpload(data.foto, 'photos', 'foto');
      }

      if (data.video) {
        videoPath = await tryUpload(data.video, 'videos', 'video');
      }

      /**
       * Mislukte uploads verdwenen tot nu toe spoorloos: de bezoeker zag een
       * foutmelding en wij zagen niets. Deze notitie belandt in het admin-veld
       * bij de inschrijving, zodat de volgende keer meteen duidelijk is wat er
       * misging en op welk toestel.
       */
      const notities = diagnostics.length
        ? [
            'Automatisch genoteerd: uploaden mislukt tijdens het inschrijven.',
            ...diagnostics,
            `Browser: ${typeof navigator === 'undefined' ? 'onbekend' : navigator.userAgent.slice(0, 300)}`,
          ].join('\n')
        : null;

      // 2. Insert form data to database
      const payload = {
        naam: data.naam,
        leeftijd: parseInt(data.leeftijd),
        woonplaats: data.woonplaats,
        gsm: data.gsm,
        email: data.email,
        instagram: data.instagram || null,
        beschikbaarheid: data.beschikbaarheid,
        motivatie: data.motivatie,
        doelen: data.doelen,
        persoonlijkheid: data.persoonlijkheid,
        groepsrol: data.groepsrol,
        spannendst: data.spannendst,
        ongemakkelijk: data.ongemakkelijk,
        waarom_passen: data.waaromPassen,
        wat_spreekt_aan: data.watSpreektAan,
        sportiviteit: data.sportiviteit,
        sociale_interactie: data.socialeInteractie,
        zelfstandigheid: data.zelfstandigheid,
        // New questions for Part 4
        km_wandelen: data.kmWandelen,
        meerdere_dagen_wandelen: data.meerdereDagenWandelen,
        bereid_trainen: data.bereidTrainen,
        fysieke_uitdaging: data.fysiekeUitdaging,
        lichamelijke_klachten: data.lichamelijkeKlachten,
        reactie_regen_moeheid: data.reactieRegenMoeheid,
        omgang_trager_wandelen: data.omgangTragerWandelen,
        eigen_moeheid: data.eigenMoeheid,
        omgang_groepsbeslissing: data.omgangGroepsbeslissing,
        omgang_irritaties_conflicten: data.omgangIrritatiesConflicten,
        ergernissen_anderen: data.ergernissenAnderen,
        type_persoon_botsen: data.typePersoonBotsen,
        behoefte_groep_moeilijk: data.behoefteGroepMoeilijk,
        reden_stoppen: data.redenStoppen,
        medisch: data.medisch,
        medisch_uitleg: data.medisch ? data.medischUitleg : null,
        noodcontact_naam: data.noodcontactNaam,
        noodcontact_gsm: data.noodcontactGsm,
        foto_url: fotoPath,
        video_url: videoPath,
        ...(notities ? { notities } : {}),
      };

      let { error: insertError } = await supabase.from('inschrijvingen').insert(payload);

      // Mocht die notitie-kolom niet beschrijfbaar zijn voor bezoekers, dan is
      // de inschrijving belangrijker dan de notitie: nog eens zonder proberen.
      if (insertError && notities) {
        console.error('Insert with diagnostics note failed, retrying without:', insertError);
        const { notities: _dropped, ...withoutNote } = payload;
        ({ error: insertError } = await supabase.from('inschrijvingen').insert(withoutNote));
      }

      if (insertError) {
        console.error('Insert error:', insertError);
        if (insertError.code === '42501') {
          throw new Error('Database RLS Policy Error: De Row Level Security (RLS) policies in de Supabase console blokkeren openbare toevoegingen. Voer de SQL scripts uit om dit op te lossen.');
        }
        throw new Error(`Database fout (${insertError.code}): ${insertError.message}`);
      }

      setState({
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        error: null,
        uploadProgress: { foto: 100, video: 100 },
        uploadWarnings: warnings,
      });

      return { success: true, warnings };
    } catch (error) {
      let errorMessage = 'Er ging iets mis bij het verzenden. Probeer het later opnieuw.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setState({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        error: errorMessage,
        uploadProgress: { foto: 0, video: 0 },
        uploadWarnings: [],
      });
      
      return { success: false, error: errorMessage };
    }
  };

  const reset = () => {
    setState({
      isSubmitting: false,
      isSuccess: false,
      isError: false,
      error: null,
      uploadProgress: { foto: 0, video: 0 },
      uploadWarnings: [],
    });
  };

  return {
    ...state,
    submitForm,
    reset,
  };
}
