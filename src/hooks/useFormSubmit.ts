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
  medisch: boolean;
  medischUitleg: string;
  noodcontactNaam: string;
  noodcontactGsm: string;
  foto: File | null;
  video: File | null;
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
}

interface SubmitResult {
  success: boolean;
  error?: string;
}

export function useFormSubmit() {
  const [state, setState] = useState<SubmitState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    error: null,
    uploadProgress: { foto: 0, video: 0 },
  });

  const uploadFile = async (
    file: File,
    folder: 'photos' | 'videos'
  ): Promise<string | null> => {
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
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Return the file path (not public URL - bucket is private)
      return fileName;
    } catch (error) {
      console.error(`Upload error for ${folder}:`, error);
      throw error;
    }
  };

  const submitForm = async (data: FormData): Promise<SubmitResult> => {
    setState({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
      error: null,
      uploadProgress: { foto: 0, video: 0 },
    });

    try {
      // 1. Upload files first (if any)
      let fotoPath: string | null = null;
      let videoPath: string | null = null;

      if (data.foto) {
        setState(s => ({ ...s, uploadProgress: { ...s.uploadProgress, foto: 30 } }));
        fotoPath = await uploadFile(data.foto, 'photos');
        setState(s => ({ ...s, uploadProgress: { ...s.uploadProgress, foto: 100 } }));
      }

      if (data.video) {
        setState(s => ({ ...s, uploadProgress: { ...s.uploadProgress, video: 30 } }));
        videoPath = await uploadFile(data.video, 'videos');
        setState(s => ({ ...s, uploadProgress: { ...s.uploadProgress, video: 100 } }));
      }

      // 2. Insert form data to database
      const { error: insertError } = await supabase
        .from('inschrijvingen')
        .insert({
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
          medisch: data.medisch,
          medisch_uitleg: data.medisch ? data.medischUitleg : null,
          noodcontact_naam: data.noodcontactNaam,
          noodcontact_gsm: data.noodcontactGsm,
          foto_url: fotoPath,
          video_url: videoPath,
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(`Database error: ${insertError.message}`);
      }

      setState({
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        error: null,
        uploadProgress: { foto: 100, video: 100 },
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Onbekende fout bij verzenden';
      
      setState({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        error: errorMessage,
        uploadProgress: { foto: 0, video: 0 },
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
    });
  };

  return {
    ...state,
    submitForm,
    reset,
  };
}
