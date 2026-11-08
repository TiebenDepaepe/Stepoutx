import { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { compressPhoto, UploadAborted, uploadWithProgress } from '@/lib/upload';
import { sendRegistrationConfirmationEmail } from '@/services/emailService';

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
  voorwaardenAgreement: boolean;
  privacyAgreement: boolean;
}

const calculateAge = (birthDateString: string): number | null => {
  if (!birthDateString) return null;
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
};

interface SubmitState {
  isSubmitting: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  /** Dutch sentences about uploads that failed while the registration itself was saved. */
  uploadWarnings: string[];
}

interface SubmitResult {
  success: boolean;
  error?: string;
  warnings?: string[];
}

export type UploadKind = 'foto' | 'video';

export interface UploadStatus {
  status: 'idle' | 'uploading' | 'done' | 'error';
  /** Bytes sent so far and in total, for a real progress bar. */
  loaded: number;
  total: number;
}

const IDLE_UPLOAD: UploadStatus = { status: 'idle', loaded: 0, total: 0 };

interface UploadJob {
  /** The file as the visitor picked it, to recognise it again at submit time. */
  source: File;
  promise: Promise<string>;
  abort: () => void;
}

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
    uploadWarnings: [],
  });

  const [uploads, setUploads] = useState<Record<UploadKind, UploadStatus>>({
    foto: IDLE_UPLOAD,
    video: IDLE_UPLOAD,
  });
  const jobs = useRef<Record<UploadKind, UploadJob | null>>({ foto: null, video: null });

  const setUpload = (kind: UploadKind, next: UploadStatus) =>
    setUploads((current) => ({ ...current, [kind]: next }));

  const runUpload = (kind: UploadKind, source: File): UploadJob => {
    let aborted = false;
    let abortRequest = () => {};
    const isCurrent = () => jobs.current[kind]?.source === source && !aborted;

    const promise = (async () => {
      setUpload(kind, { status: 'uploading', loaded: 0, total: source.size });

      // Bail out early with a message the visitor can act on, instead of letting
      // Storage reject an empty body with an English API error.
      await assertFileReadable(source, kind);
      const file = kind === 'foto' ? await compressPhoto(source) : source;
      if (aborted) throw new UploadAborted();

      // Unique path: folder/timestamp_random.ext. Bucket is private, so we keep
      // the path rather than a public URL.
      const folder = kind === 'foto' ? 'photos' : 'videos';
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const path = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

      const request = uploadWithProgress(path, file, (loaded, total) => {
        if (isCurrent()) setUpload(kind, { status: 'uploading', loaded, total });
      });
      abortRequest = request.abort;

      try {
        await request.promise;
      } catch (error) {
        if (error instanceof UploadAborted) throw error;
        const raw = error instanceof Error ? error.message : String(error);
        console.error(`Upload error for ${kind}:`, error);
        throw new UploadFailure(uploadErrorMessage(raw, kind), raw);
      }
      return path;
    })();

    promise.then(
      () => {
        if (isCurrent()) {
          setUploads((current) => ({
            ...current,
            [kind]: { status: 'done', loaded: current[kind].total, total: current[kind].total },
          }));
        }
      },
      (error) => {
        if (isCurrent() && !(error instanceof UploadAborted)) {
          setUpload(kind, { ...IDLE_UPLOAD, status: 'error' });
        }
      }
    );

    return {
      source,
      promise,
      abort: () => {
        aborted = true;
        abortRequest();
      },
    };
  };

  /**
   * Start uploading the moment a file is picked (deel 8), not when the form is
   * sent. By the time someone has answered deel 9 and ticked the checkboxes,
   * most of the upload is already behind them. Picking another file cancels
   * the previous upload; `null` clears it.
   */
  const startUpload = (kind: UploadKind, file: File | null) => {
    jobs.current[kind]?.abort();
    jobs.current[kind] = file ? runUpload(kind, file) : null;
    if (!file) setUpload(kind, IDLE_UPLOAD);
  };

  /** The storage path for this file: reuses the background upload, retrying once if it failed. */
  const ensureUploaded = async (kind: UploadKind, file: File): Promise<string> => {
    const existing = jobs.current[kind];
    if (existing && existing.source === file) {
      try {
        return await existing.promise;
      } catch (error) {
        // A dropped connection minutes ago says little about now: try again.
        console.warn(`Background upload of ${kind} failed, retrying at submit:`, error);
      }
    }
    const job = runUpload(kind, file);
    jobs.current[kind] = job;
    return job.promise;
  };

  const submitForm = async (data: FormData): Promise<SubmitResult> => {
    setState({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
      error: null,
        uploadWarnings: [],
    });

    try {
      // 1. Files: usually already uploaded in the background since deel 8
      const warnings: string[] = [];
      const diagnostics: string[] = [];

      /**
       * Een mislukte upload mag nooit een volledig ingevuld formulier kosten. Op
       * telefoons gaat uploaden regelmatig mis (in-app browser, iCloud, groot
       * bestand); we slaan de inschrijving dan gewoon op zonder het bestand en
       * vertellen achteraf wat er ontbreekt.
       */
      const tryUpload = async (file: File, kind: UploadKind): Promise<string | null> => {
        try {
          return await ensureUploaded(kind, file);
        } catch (uploadError) {
          console.error(`Upload skipped for ${kind}:`, uploadError);
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

      // Photo and video side by side: the slower one sets the pace, not the sum.
      const [fotoPath, videoPath] = await Promise.all([
        data.foto ? tryUpload(data.foto, 'foto') : Promise.resolve(null),
        data.video ? tryUpload(data.video, 'video') : Promise.resolve(null),
      ]);

      /**
       * Uploadproblemen verdwenen tot nu toe spoorloos: de bezoeker zag een
       * foutmelding en wij zagen niets. Deze notitie belandt in het admin-veld
       * bij de inschrijving, zodat meteen duidelijk is wat er misging.
       *
       * Ook het geval "helemaal geen foto gekozen" noteren we. Dat is namelijk
       * de stille variant: gaat de bestandskiezer in een in-app browser niet
       * open, dan is er nooit een upload om te laten mislukken. Zonder deze
       * regel zie je enkel een inschrijving zonder foto en weet je niet waarom.
       */
      const notes: string[] = [];
      if (diagnostics.length) {
        notes.push('Uploaden mislukt tijdens het inschrijven:', ...diagnostics);
      }
      if (!data.foto) {
        notes.push(
          'Geen foto gekozen. Komt dit vaker voor bij dezelfde browser hieronder, dan opent de bestandskiezer daar waarschijnlijk niet.'
        );
      }

      const notities = notes.length
        ? [
            'Automatisch genoteerd:',
            ...notes,
            `Browser: ${typeof navigator === 'undefined' ? 'onbekend' : navigator.userAgent.slice(0, 300)}`,
          ].join('\n')
        : null;

      // 2. Insert form data to database
      const calculatedAge = calculateAge(data.geboortedatum);

      const payload = {
        naam: data.naam,
        geboortedatum: data.geboortedatum,
        leeftijd: calculatedAge,
        woonplaats: data.woonplaats,
        gsm: data.gsm,
        email: data.email,
        instagram: data.instagram || null,
        huidige_bezigheid: data.huidigeBezigheid,
        studie_uitleg: data.studieUitleg || null,
        werk_uitleg: data.werkUitleg || null,
        bezigheid_anders_uitleg: data.bezigheidAndersUitleg || null,
        expeditie_voorkeur: data.expeditieVoorkeur,
        beschikbaarheid: data.beschikbaarheid,
        persoonlijkheid: data.persoonlijkheid,
        nieuwe_groep: data.nieuweGroep,
        nieuwe_groep_extra: data.nieuweGroepExtra || null,
        rol_vriendengroep: data.rolVriendengroep,
        rol_vriendengroep_extra: data.rolVriendengroepExtra || null,
        sociaal_meerdaagse: data.sociaalMeerdaagse,
        sociaal_meerdaagse_extra: data.sociaalMeerdaagseExtra || null,
        vrije_tijd_interesses: data.vrijeTijdInteresses,
        vrije_tijd_anders: data.vrijeTijdAnders || null,
        motivatie: data.motivatie,
        doelen: data.doelen,
        km_wandelen: data.kmWandelen,
        meerdere_dagen_wandelen: data.meerdereDagenWandelen,
        ergernissen_anderen: data.ergernissenAnderen,
        type_persoon_botsen: data.typePersoonBotsen,
        extra_info_groep: data.extraInfoGroep || null,
        medisch: data.medisch,
        medisch_uitleg: data.medisch ? data.medischUitleg : null,
        noodcontact_naam: data.noodcontactNaam,
        noodcontact_gsm: data.noodcontactGsm,
        foto_url: fotoPath,
        video_url: videoPath,
        vrienden_ingeschreven: data.vriendenIngeschreven,
        vrienden_namen: data.vriendenIngeschreven ? data.vriendenNamen : null,
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

      // 3. Stuur automatische bevestigingsmail (blokkeert de inschrijving niet als dit mislukt)
      await sendRegistrationConfirmationEmail({
        naam: data.naam,
        email: data.email,
        gsm: data.gsm,
        woonplaats: data.woonplaats,
        instagram: data.instagram,
        expeditieVoorkeur: data.expeditieVoorkeur,
        beschikbaarheid: data.beschikbaarheid,
        motivatie: data.motivatie,
      });

      setState({
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        error: null,
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
        uploadWarnings: [],
    });
  };

  return {
    ...state,
    uploads,
    startUpload,
    submitForm,
    reset,
  };
}
