import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TopNav } from './components/TopNav';
import { HeroSection } from './components/HeroSection';
import { GallerySection } from './components/GallerySection';
import { AudioSection } from './components/AudioSection';
import { TextSection } from './components/TextSection';
import { LightboxModal } from './components/LightboxModal';
import { SettingsPanel } from './components/SettingsPanel';
import {
  MemoryItem,
  MemoryText,
  AudioState,
  AudioPreset,
  BackgroundConfig,
  BgMedia,
} from './types/portfolio';
import {
  DEFAULT_PHOTOS,
  DEFAULT_VIDEOS,
  DEFAULT_TEXT,
  DEFAULT_BG_CONFIG,
  getStoredPhotos,
  savePhotos,
  getStoredVideos,
  saveVideos,
  getStoredText,
  saveStoredText,
  getStoredAudioFile,
  saveStoredAudioFile,
  removeStoredAudioFile,
  getStoredPresetAudio,
  saveStoredPresetAudio,
  getStoredBackgroundConfig,
  saveStoredBackgroundConfig,
  getStoredBgMedia,
  saveStoredBgMedia,
  removeStoredBgMedia,
} from './utils/storage';
import { THEME_PRESETS, getThemeDef } from './utils/themeHelper';
import { ambientEngine } from './utils/audioSynth';
import { ArrowUp, Palette } from 'lucide-react';

export default function App() {
  const [photos, setPhotos] = useState<MemoryItem[]>(DEFAULT_PHOTOS);
  const [videos, setVideos] = useState<MemoryItem[]>(DEFAULT_VIDEOS);
  const [memoryText, setMemoryText] = useState<MemoryText>(DEFAULT_TEXT);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settingsTab, setSettingsTab] = useState<'text' | 'images' | 'videos' | 'audio' | 'background'>('background');
  const [bgConfig, setBgConfig] = useState<BackgroundConfig>(DEFAULT_BG_CONFIG);

  // Audio state
  const [audioState, setAudioState] = useState<AudioState>({
    mode: 'preset',
    presetId: 'melodi-senja',
    uploadedUrl: null,
    uploadedFileName: '',
    isPlaying: false,
    volume: 0.6,
    isLooping: true,
    currentTime: 0,
    duration: 0,
  });

  // Lightbox modal state
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    initialIndex: number;
    autoPlaySlideshow: boolean;
  }>({
    isOpen: false,
    initialIndex: 0,
    autoPlaySlideshow: false,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initial load from storage (IndexedDB + localStorage)
  useEffect(() => {
    async function initData() {
      const storedText = getStoredText();
      setMemoryText(storedText);

      const storedPhotos = await getStoredPhotos();
      setPhotos(storedPhotos);

      const storedVideos = await getStoredVideos();
      setVideos(storedVideos);

      const storedAudio = await getStoredAudioFile();
      const storedPreset = getStoredPresetAudio();

      if (storedAudio) {
        setAudioState((prev) => ({
          ...prev,
          mode: 'uploaded',
          uploadedUrl: storedAudio.url,
          uploadedFileName: storedAudio.fileName,
          presetId: storedPreset,
        }));
      } else {
        setAudioState((prev) => ({
          ...prev,
          mode: 'preset',
          presetId: storedPreset,
        }));
      }

      // Background config & media
      const storedBg = getStoredBackgroundConfig();
      const customBgMedia = await getStoredBgMedia();

      if (customBgMedia) {
        setBgConfig({
          ...storedBg,
          themeId: customBgMedia.type === 'video' ? 'custom-video' : 'custom-image',
          bgMedia: customBgMedia,
          customImageUrl: customBgMedia.type === 'image' ? customBgMedia.src : null,
          customVideoUrl: customBgMedia.type === 'video' ? customBgMedia.src : null,
        });
      } else {
        setBgConfig(storedBg);
      }
    }
    initData();
  }, []);

  // Update HTML audio player listeners
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const handleTimeUpdate = () => {
      setAudioState((prev) => ({
        ...prev,
        currentTime: audioEl.currentTime,
      }));
    };

    const handleLoadedMetadata = () => {
      setAudioState((prev) => ({
        ...prev,
        duration: audioEl.duration || 0,
      }));
    };

    const handleEnded = () => {
      if (!audioState.isLooping) {
        setAudioState((prev) => ({ ...prev, isPlaying: false }));
      }
    };

    audioEl.addEventListener('timeupdate', handleTimeUpdate);
    audioEl.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioEl.addEventListener('ended', handleEnded);

    return () => {
      audioEl.removeEventListener('timeupdate', handleTimeUpdate);
      audioEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioEl.removeEventListener('ended', handleEnded);
    };
  }, [audioState.isLooping]);

  // Audio playback controls
  const handleTogglePlay = useCallback(() => {
    if (audioState.isPlaying) {
      if (audioState.mode === 'uploaded' && audioRef.current) {
        audioRef.current.pause();
      } else {
        ambientEngine.stop();
      }
      setAudioState((prev) => ({ ...prev, isPlaying: false }));
    } else {
      if (audioState.mode === 'uploaded' && audioState.uploadedUrl && audioRef.current) {
        ambientEngine.stop();
        audioRef.current.volume = audioState.volume;
        audioRef.current
          .play()
          .then(() => {
            setAudioState((prev) => ({ ...prev, isPlaying: true }));
          })
          .catch((err) => {
            console.warn('Autoplay prevented, switching to ambient', err);
            ambientEngine.setVolume(audioState.volume);
            ambientEngine.start(audioState.presetId);
            setAudioState((prev) => ({ ...prev, isPlaying: true }));
          });
      } else {
        if (audioRef.current) audioRef.current.pause();
        ambientEngine.setVolume(audioState.volume);
        ambientEngine.start(audioState.presetId);
        setAudioState((prev) => ({ ...prev, isPlaying: true }));
      }
    }
  }, [audioState]);

  const handleVolumeChange = (vol: number) => {
    setAudioState((prev) => ({ ...prev, volume: vol }));
    ambientEngine.setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleToggleLoop = () => {
    setAudioState((prev) => ({ ...prev, isLooping: !prev.isLooping }));
  };

  const handleSelectPreset = (preset: AudioPreset) => {
    saveStoredPresetAudio(preset);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const wasPlaying = audioState.isPlaying;
    setAudioState((prev) => ({
      ...prev,
      mode: 'preset',
      presetId: preset,
    }));
    if (wasPlaying) {
      ambientEngine.stop();
      ambientEngine.setVolume(audioState.volume);
      ambientEngine.start(preset);
    }
  };

  // Upload custom audio file
  const handleSaveAudioFile = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        await saveStoredAudioFile(dataUrl, file.name);
        setAudioState((prev) => ({
          ...prev,
          mode: 'uploaded',
          uploadedUrl: dataUrl,
          uploadedFileName: file.name,
        }));
        if (audioState.isPlaying) {
          ambientEngine.stop();
          if (audioRef.current) {
            audioRef.current.src = dataUrl;
            audioRef.current.play().catch(() => {});
          }
        }
        resolve();
      };
      reader.onerror = () => reject(new Error('Gagal membaca file audio'));
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveAudioFile = async () => {
    await removeStoredAudioFile();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setAudioState((prev) => ({
      ...prev,
      mode: 'preset',
      uploadedUrl: null,
      uploadedFileName: '',
    }));
    if (audioState.isPlaying) {
      ambientEngine.start(audioState.presetId);
    }
  };

  // Background management
  const handleUpdateBgConfig = (newConfig: BackgroundConfig) => {
    setBgConfig(newConfig);
    saveStoredBackgroundConfig({
      themeId: newConfig.themeId,
      overlayOpacity: newConfig.overlayOpacity,
      blur: newConfig.blur,
    });
  };

  const handleSaveBgMedia = async (media: BgMedia) => {
    await saveStoredBgMedia(media);
    const updated: BackgroundConfig = {
      ...bgConfig,
      themeId: media.type === 'video' ? 'custom-video' : 'custom-image',
      bgMedia: media,
      customImageUrl: media.type === 'image' ? media.src : null,
      customVideoUrl: media.type === 'video' ? media.src : null,
    };
    setBgConfig(updated);
    saveStoredBackgroundConfig({
      themeId: updated.themeId,
      overlayOpacity: updated.overlayOpacity,
      blur: updated.blur,
    });
  };

  const handleRemoveBgMedia = async () => {
    await removeStoredBgMedia();
    const updated: BackgroundConfig = {
      ...bgConfig,
      themeId: 'nostalgia',
      bgMedia: null,
      customImageUrl: null,
      customVideoUrl: null,
    };
    setBgConfig(updated);
    saveStoredBackgroundConfig({
      themeId: updated.themeId,
      overlayOpacity: updated.overlayOpacity,
      blur: updated.blur,
    });
  };

  // Text management
  const handleSaveText = (newText: MemoryText) => {
    setMemoryText(newText);
    saveStoredText(newText);
  };

  // Photos management
  const handleSavePhotos = async (newPhotos: MemoryItem[]) => {
    setPhotos(newPhotos);
    await savePhotos(newPhotos);
  };

  // Videos management
  const handleSaveVideos = async (newVideos: MemoryItem[]) => {
    setVideos(newVideos);
    await saveVideos(newVideos);
  };

  // Reset to default
  const handleResetToDefault = async () => {
    ambientEngine.stop();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    await savePhotos(DEFAULT_PHOTOS);
    await saveVideos(DEFAULT_VIDEOS);
    saveStoredText(DEFAULT_TEXT);
    await removeStoredAudioFile();
    await removeStoredBgMedia();
    saveStoredPresetAudio('melodi-senja');
    saveStoredBackgroundConfig(DEFAULT_BG_CONFIG);

    setPhotos(DEFAULT_PHOTOS);
    setVideos(DEFAULT_VIDEOS);
    setMemoryText(DEFAULT_TEXT);
    setBgConfig(DEFAULT_BG_CONFIG);
    setAudioState({
      mode: 'preset',
      presetId: 'melodi-senja',
      uploadedUrl: null,
      uploadedFileName: '',
      isPlaying: false,
      volume: 0.6,
      isLooping: true,
      currentTime: 0,
      duration: 0,
    });
  };

  const handleOpenSettings = (tab: 'text' | 'images' | 'videos' | 'audio' | 'background' = 'background') => {
    setSettingsTab(tab);
    setIsSettingsOpen(true);
  };

  // Combined item list for lightbox
  const allMediaItems: MemoryItem[] = [
    ...photos.map(p => ({ ...p, type: 'image' as const })),
    ...videos.map(v => ({ ...v, type: 'video' as const })),
  ];

  // Determine current theme parameters
  const currentTheme = getThemeDef(bgConfig.themeId);
  const isDarkTheme =
    currentTheme.isDark ||
    (bgConfig.themeId === 'custom-image' && bgConfig.overlayOpacity > 0.35) ||
    bgConfig.themeId === 'custom-video';

  // Background visual source
  let activeBgImage: string | undefined = undefined;
  let activeBgVideo: string | undefined = undefined;

  if (bgConfig.bgMedia) {
    if (bgConfig.bgMedia.type === 'video') {
      activeBgVideo = bgConfig.bgMedia.src;
    } else {
      activeBgImage = bgConfig.bgMedia.src;
    }
  } else if (bgConfig.customVideoUrl) {
    activeBgVideo = bgConfig.customVideoUrl;
  } else if (bgConfig.customImageUrl) {
    activeBgImage = bgConfig.customImageUrl;
  } else if (bgConfig.themeId === 'starry-night' || bgConfig.themeId === 'warm-paper') {
    activeBgImage = currentTheme.bgImageUrl;
  }

  // Base background color class
  const baseBgClass = currentTheme.cssBgClass || 'bg-[#faf9f5]';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans-body relative transition-colors duration-300 ${baseBgClass} ${
        isDarkTheme ? 'text-slate-100' : 'text-[#2c2825]'
      }`}
    >
      {/* Background Video (if custom background video is uploaded) */}
      {activeBgVideo && (
        <video
          src={activeBgVideo}
          autoPlay
          muted
          loop
          playsInline
          className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-700"
          style={{
            filter: bgConfig.blur > 0 ? `blur(${bgConfig.blur}px)` : undefined,
            transform: bgConfig.blur > 0 ? 'scale(1.05)' : 'none',
          }}
        />
      )}

      {/* Dynamic Background Image Layer (Wallpaper) */}
      {!activeBgVideo && activeBgImage && (
        <div
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{
            backgroundImage: `url(${activeBgImage})`,
            filter: bgConfig.blur > 0 ? `blur(${bgConfig.blur}px)` : undefined,
            transform: bgConfig.blur > 0 ? 'scale(1.05)' : 'none',
          }}
        />
      )}

      {/* Dynamic Background Overlay for contrast & legibility */}
      {(activeBgImage || activeBgVideo) && (
        <div
          className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
          style={{
            backgroundColor: isDarkTheme ? '#0b0f19' : '#faf9f5',
            opacity: bgConfig.overlayOpacity,
          }}
        />
      )}

      {/* Main Content (Z-indexed above wallpaper) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Bar with brand title & settings toggle */}
        <TopNav
          onOpenSettings={handleOpenSettings}
          isPlaying={audioState.isPlaying}
          onTogglePlay={handleTogglePlay}
          currentThemeId={bgConfig.themeId}
          isDarkTheme={isDarkTheme}
        />

        <main className="flex-grow">
          {/* Hero Section */}
          <HeroSection
            photoCount={photos.length}
            featuredPhoto={photos[0]}
            isPlaying={audioState.isPlaying}
            onTogglePlay={handleTogglePlay}
            onStartSlideshow={() =>
              setLightbox({ isOpen: true, initialIndex: 0, autoPlaySlideshow: true })
            }
            onOpenSettings={handleOpenSettings}
            isDarkTheme={isDarkTheme}
          />

          {/* Gallery Kenangan Bersama (Photos & Videos) */}
          <GallerySection
            photos={photos}
            videos={videos}
            onSelectItem={(_item, index) =>
              setLightbox({ isOpen: true, initialIndex: index, autoPlaySlideshow: false })
            }
            onOpenSettings={handleOpenSettings}
            onStartSlideshow={() =>
              setLightbox({ isOpen: true, initialIndex: 0, autoPlaySlideshow: true })
            }
            isDarkTheme={isDarkTheme}
          />

          {/* Audio Latar Section */}
          <AudioSection
            audioState={audioState}
            onTogglePlay={handleTogglePlay}
            onVolumeChange={handleVolumeChange}
            onToggleLoop={handleToggleLoop}
            onSelectPreset={handleSelectPreset}
            onOpenSettings={handleOpenSettings}
            audioRef={audioRef}
            isDarkTheme={isDarkTheme}
          />

          {/* Teks Kenangan Section */}
          <TextSection
            memoryText={memoryText}
            onOpenSettings={handleOpenSettings}
            isDarkTheme={isDarkTheme}
          />
        </main>

        {/* Footer with exact requested text: © 2026 Portofolio Saya */}
        <footer
          className={`fade-in py-10 border-t transition-colors duration-300 ${
            isDarkTheme
              ? 'bg-slate-950 text-slate-300 border-slate-800'
              : 'bg-stone-900 text-stone-300 border-stone-800'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif-display font-bold text-white text-base">
                Portofolio Saya
              </span>
              <span className="text-stone-600">·</span>
              <p className="text-xs text-stone-400">© 2026 Portofolio Saya</p>
            </div>

            <div className="flex items-center gap-5 text-xs text-stone-400">
              <button
                onClick={() => handleOpenSettings('background')}
                className="hover:text-amber-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Ubah Latar</span>
              </button>
              <a href="#kenangan" className="hover:text-white transition-colors">
                Kenangan
              </a>
              <a href="#audio-section" className="hover:text-white transition-colors">
                Audio Latar
              </a>
              <a href="#text-section" className="hover:text-white transition-colors">
                Teks Kenangan
              </a>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
                aria-label="Kembali ke atas"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Lightbox / Slideshow Modal */}
      <LightboxModal
        items={allMediaItems}
        initialIndex={lightbox.initialIndex}
        isOpen={lightbox.isOpen}
        onClose={() => setLightbox((prev) => ({ ...prev, isOpen: false }))}
        autoPlaySlideshow={lightbox.autoPlaySlideshow}
      />

      {/* Slide-out Settings Drawer */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        memoryText={memoryText}
        onSaveText={handleSaveText}
        photos={photos}
        onSavePhotos={handleSavePhotos}
        videos={videos}
        onSaveVideos={handleSaveVideos}
        audioPreset={audioState.presetId}
        onSelectPreset={handleSelectPreset}
        uploadedAudioName={audioState.uploadedFileName}
        onSaveAudioFile={handleSaveAudioFile}
        onRemoveAudioFile={handleRemoveAudioFile}
        bgConfig={bgConfig}
        onUpdateBgConfig={handleUpdateBgConfig}
        onSaveBgMedia={handleSaveBgMedia}
        onRemoveBgMedia={handleRemoveBgMedia}
        onResetToDefault={handleResetToDefault}
        defaultActiveTab={settingsTab}
      />
    </div>
  );
}
