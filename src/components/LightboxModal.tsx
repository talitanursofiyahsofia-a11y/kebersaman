import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Calendar,
  MapPin,
  Film,
  Image as ImageIcon,
} from 'lucide-react';
import { MemoryItem } from '../types/portfolio';

interface LightboxModalProps {
  items: MemoryItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  autoPlaySlideshow?: boolean;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  items,
  initialIndex,
  isOpen,
  onClose,
  autoPlaySlideshow = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState<boolean>(autoPlaySlideshow);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsPlayingSlideshow(autoPlaySlideshow);
  }, [initialIndex, autoPlaySlideshow]);

  const handleNext = useCallback(() => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Slideshow timer (pauses if current item is a video)
  useEffect(() => {
    if (!isOpen || !isPlayingSlideshow || items.length <= 1) return;
    const currentItem = items[currentIndex];
    if (currentItem?.type === 'video') return; // let video play without auto-advancing prematurely

    const timer = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [isOpen, isPlayingSlideshow, items, currentIndex, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ' && items[currentIndex]?.type !== 'video') {
        e.preventDefault();
        setIsPlayingSlideshow((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev, items, currentIndex]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];
  const isVideo = currentItem.type === 'video';

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 transition-opacity animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tabular-nums text-stone-400">
            {currentIndex + 1} / {items.length}
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm bg-white/10 text-stone-200">
            {isVideo ? <Film className="w-3 h-3 text-amber-400" /> : <ImageIcon className="w-3 h-3" />}
            <span>{isVideo ? 'Video Kenangan' : 'Foto Kenangan'}</span>
          </span>
          {currentItem.tag && (
            <span className="text-xs px-2 py-0.5 rounded-sm bg-white/10 text-stone-200 hidden sm:inline">
              {currentItem.tag}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Slideshow button */}
          <button
            onClick={() => setIsPlayingSlideshow((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              isPlayingSlideshow
                ? 'bg-amber-600 text-white'
                : 'bg-white/10 text-stone-200 hover:bg-white/20'
            }`}
          >
            {isPlayingSlideshow ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Jeda Slideshow</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 ml-0.5" />
                <span>Putar Slideshow</span>
              </>
            )}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-stone-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Media Container */}
      <div className="relative flex-grow flex items-center justify-center my-4 overflow-hidden select-none">
        {/* Previous Button */}
        {items.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Item Sebelumnya"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Main Media Preview */}
        <div className="max-w-5xl max-h-[75vh] w-full flex items-center justify-center">
          {isVideo ? (
            <video
              key={currentItem.id || currentIndex}
              ref={videoRef}
              src={currentItem.url}
              controls
              autoPlay
              playsInline
              className="max-w-full max-h-[75vh] rounded-lg shadow-2xl bg-black"
            />
          ) : (
            <img
              key={currentItem.id || currentIndex}
              src={currentItem.url}
              alt={currentItem.caption}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl transition-all duration-300"
            />
          )}
        </div>

        {/* Next Button */}
        {items.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Item Selanjutnya"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Metadata Card */}
      <div className="max-w-2xl mx-auto w-full bg-stone-900/80 backdrop-blur-md rounded-xl p-4 border border-stone-800 text-stone-200 text-center z-10">
        <p className="font-serif-display text-base sm:text-lg text-white">
          {currentItem.caption || (isVideo ? 'Video Kenangan' : 'Momen Berharga')}
        </p>
        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-stone-400">
          {currentItem.date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>{currentItem.date}</span>
            </div>
          )}
          {currentItem.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>{currentItem.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
