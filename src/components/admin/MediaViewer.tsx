import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImageIcon, Video, Maximize2, Download } from 'lucide-react';

interface MediaViewerProps {
  imageUrl: string | null;
  videoUrl: string | null;
}

export function MediaViewer({ imageUrl, videoUrl }: MediaViewerProps) {
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const hasImage = imageUrl && !imageError;
  const hasVideo = videoUrl && !videoError;

  if (!hasImage && !hasVideo) {
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
      {hasImage && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-charcoal flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-purple-accent" />
              Foto
            </h4>
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
                    src={imageUrl} 
                    alt="Inschrijving foto" 
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                </DialogContent>
              </Dialog>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1"
                onClick={() => window.open(imageUrl, '_blank')}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Open</span>
              </Button>
            </div>
          </div>
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
        </div>
      )}

      {/* Video Section */}
      {hasVideo && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-charcoal flex items-center gap-2">
              <Video className="h-4 w-4 text-purple-accent" />
              Video
            </h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 gap-1"
              onClick={() => window.open(videoUrl, '_blank')}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Open in nieuw tabblad</span>
            </Button>
          </div>
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
        </div>
      )}
    </div>
  );
}
