import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImageIcon, Video, Maximize2, Download } from 'lucide-react';

interface MediaViewerProps {
  imageUrl: string | null;
  videoUrl: string | null;
  imagePath?: string | null;
  videoPath?: string | null;
  imageLoadFailed?: boolean;
  videoLoadFailed?: boolean;
}

export function MediaViewer({ 
  imageUrl, 
  videoUrl, 
  imagePath, 
  videoPath,
  imageLoadFailed = false,
  videoLoadFailed = false
}: MediaViewerProps) {
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Combine prop-based failure (signed URL generation failed) with runtime error
  const hasImageError = imageError || imageLoadFailed;
  const hasVideoError = videoError || videoLoadFailed;
  
  const hasImage = imageUrl && !hasImageError;
  const hasVideo = videoUrl && !hasVideoError;
  
  // Show path when: 
  // 1. Signed URL generation failed (imageLoadFailed) and we have a path
  // 2. Image failed to load at runtime (imageError) and we have a URL
  const showImagePath = (imageLoadFailed && imagePath) || (imageUrl && imageError);
  const showVideoPath = (videoLoadFailed && videoPath) || (videoUrl && videoError);

  // Only show "no media" when there's no image, no video, AND no error paths to show
  if (!hasImage && !hasVideo && !showImagePath && !showVideoPath) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-200">
        <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-soft text-sm">Geen media bestanden</p>
        <p className="text-gray-400 text-xs mt-1">
          Geen foto of video geüpload bij deze inschrijving
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Image Section */}
      {(hasImage || showImagePath) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-charcoal flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-purple-accent" />
              Foto
            </h4>
            {hasImage && (
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Maximize2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Vergroot</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/90">
                    <img 
                      src={imageUrl!} 
                      alt="Inschrijving foto" 
                      className="w-full h-auto max-h-[80vh] object-contain"
                    />
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 gap-1"
                  onClick={() => window.open(imageUrl!, '_blank')}
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Open</span>
                </Button>
              </div>
            )}
          </div>
          {hasImage ? (
            <div className="relative group overflow-hidden rounded-xl bg-gray-100">
              <img 
                src={imageUrl} 
                alt="Inschrijving foto"
                className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                onError={() => setImageError(true)}
              />
              <Dialog>
                <DialogTrigger asChild>
                  <button className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors">
                    <Maximize2 className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/90">
                  <img 
                    src={imageUrl} 
                    alt="Inschrijving foto" 
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                </DialogContent>
              </Dialog>
            </div>
          ) : showImagePath ? (
            <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-6">
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-amber-800 mb-1">Afbeelding niet gevonden</p>
                  <p className="text-xs text-amber-700 mb-2">Het bestand kon niet worden geladen van Supabase:</p>
                  <code className="block text-xs bg-amber-100 text-amber-900 px-2 py-1.5 rounded break-all">
                    {imagePath || imageUrl}
                  </code>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Video Section */}
      {(hasVideo || showVideoPath) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-charcoal flex items-center gap-2">
              <Video className="h-4 w-4 text-purple-accent" />
              Video
            </h4>
            {hasVideo && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1"
                onClick={() => window.open(videoUrl!, '_blank')}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Open in nieuw tabblad</span>
              </Button>
            )}
          </div>
          {hasVideo ? (
            <div className="rounded-xl overflow-hidden bg-gray-900">
              <video 
                src={videoUrl}
                controls
                className="w-full h-64"
                onError={() => setVideoError(true)}
                preload="metadata"
              >
                <p className="text-white text-center p-4">
                  Je browser ondersteunt dit video formaat niet.
                </p>
              </video>
            </div>
          ) : showVideoPath ? (
            <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-6">
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-amber-800 mb-1">Video niet gevonden</p>
                  <p className="text-xs text-amber-700 mb-2">Het bestand kon niet worden geladen van Supabase:</p>
                  <code className="block text-xs bg-amber-100 text-amber-900 px-2 py-1.5 rounded break-all">
                    {videoPath || videoUrl}
                  </code>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
