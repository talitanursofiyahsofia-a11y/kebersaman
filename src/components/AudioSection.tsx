import React from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Upload,
  Disc3,
  Radio,
} from 'lucide-react';
import { AudioState, AudioPreset } from '../types/portfolio';

interface AudioSectionProps {
  audioState: AudioState;
  onTogglePlay: () => void;
  onVolumeChange: (vol: number) => void;
  onToggleLoop: () => void;
  onSelectPreset: (preset: AudioPreset) => void;
  onOpenSettings: (tab?: 'text' | 'images' | 'videos' | 'audio' | 'background') => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isDarkTheme?: boolean;
}

export const AudioSection: React.FC<AudioSectionProps> = ({
  audioState,
  onTogglePlay,
  onVolumeChange,
  onToggleLoop,
  onSelectPreset,
  onOpenSettings,
  audioRef,
  isDarkTheme = false,
}) => {
  const getTrackName = () => {
    if (audioState.mode === 'uploaded' && audioState.uploadedFileName) {
      return audioState.uploadedFileName;
    }
    switch (audioState.presetId) {
      case 'melodi-senja':
        return 'Melodi Senja (Harmoni Akustik Cmaj9)';
      case 'piano-hujan':
        return 'Piano Hujan (Nostalgia Lembut)';
      case 'bintang-malam':
        return 'Bintang Malam (Suasana Syahdu)';
      default:
        return 'Audio Latar Kenangan';
    }
  };

  const getTrackDescription = () => {
    if (audioState.mode === 'uploaded') {
      return 'Lagu kenangan pilihan pribadi yang diunggah.';
    }
    switch (audioState.presetId) {
      case 'melodi-senja':
        return 'Arpeggio gitar akustik dan piano hangat berirama tenang.';
      case 'piano-hujan':
        return 'Sentuhan tuts piano sendu berteman rintik hujan malam.';
      case 'bintang-malam':
        return 'Alunan ambient luas laksana menatap langit berbintang.';
      default:
        return 'Alunan musik latar pengiring kenangan.';
    }
  };

  return (
    <section
      id="audio-section"
      className={`section fade-in py-16 border-b transition-colors duration-300 ${
        isDarkTheme ? 'border-slate-800/80 bg-slate-950/40' : 'border-stone-200/70 bg-stone-50/50'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div
              className={`flex items-center gap-2 text-xs font-semibold tracking-wider uppercase mb-1 ${
                isDarkTheme ? 'text-amber-400' : 'text-amber-800'
              }`}
            >
              <span>Alunan Suasana</span>
              <span aria-hidden="true" className={isDarkTheme ? 'text-slate-600' : 'text-stone-300'}>
                ·
              </span>
              <span className={`font-normal ${isDarkTheme ? 'text-slate-400' : 'text-stone-500'}`}>
                Pemutar Latar Otomatis
              </span>
            </div>
            <h2
              className={`text-2xl sm:text-3xl font-bold font-serif-display tracking-tight transition-colors ${
                isDarkTheme ? 'text-white' : 'text-stone-900'
              }`}
            >
              Audio Latar
            </h2>
            <p
              className={`text-sm mt-1 max-w-lg transition-colors ${
                isDarkTheme ? 'text-slate-300' : 'text-stone-500'
              }`}
            >
              Musik pengiring suasana untuk melengkapi setiap foto & video kenangan. Pilih melodi ambient bawaan atau unggah lagu favorit kalian.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenSettings('audio')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors shadow-xs cursor-pointer ${
                isDarkTheme
                  ? 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-amber-500" />
              <span>Unggah File Audio</span>
            </button>
          </div>
        </div>

        {/* Vinyl Player Showcase Box */}
        <div
          className={`rounded-2xl border shadow-sm p-6 sm:p-8 transition-colors ${
            isDarkTheme
              ? 'bg-slate-900/90 border-slate-800 text-slate-100'
              : 'bg-white border-stone-200/90 text-stone-900'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Turntable / Vinyl Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center bg-stone-950 rounded-full shadow-2xl border-4 border-stone-800 overflow-hidden">
                {/* Grooves on vinyl */}
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center bg-[radial-gradient(circle,#1c1917_30%,#292524_31%,#1c1917_32%,#292524_45%,#1c1917_46%,#292524_60%,#1c1917_61%,#292524_75%,#0c0a09_100%)] ${
                    audioState.isPlaying ? 'animate-spin-slow' : 'animate-spin-pause'
                  }`}
                >
                  {/* Center Label */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-700 border-4 border-amber-900 flex flex-col items-center justify-center text-center p-2 text-white shadow-inner">
                    <Disc3 className="w-5 h-5 text-amber-200 mb-0.5" />
                    <span className="text-[9px] font-bold tracking-tight uppercase">Kenangan</span>
                    <span className="text-[7px] text-amber-200/80">33 RPM</span>
                  </div>
                </div>

                {/* Turntable Tonearm Needle */}
                <div
                  className={`absolute top-2 right-4 w-2 h-24 origin-top transition-transform duration-700 pointer-events-none ${
                    audioState.isPlaying ? 'rotate-18' : '-rotate-12'
                  }`}
                >
                  <div className="w-1.5 h-20 bg-stone-300 rounded shadow-md mx-auto" />
                  <div className="w-3 h-4 bg-amber-600 rounded-xs shadow" />
                </div>
              </div>
            </div>

            {/* Track Info & Interactive Player Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div
                  className={`flex items-center gap-2 text-xs font-semibold mb-1 ${
                    isDarkTheme ? 'text-amber-400' : 'text-amber-800'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>
                    {audioState.mode === 'uploaded' ? 'File Audio Pribadi' : 'Melodi Suasana Bawaan'}
                  </span>
                </div>
                <h3
                  className={`text-xl sm:text-2xl font-bold font-serif-display ${
                    isDarkTheme ? 'text-white' : 'text-stone-900'
                  }`}
                >
                  {getTrackName()}
                </h3>
                <p
                  className={`text-sm mt-1 leading-relaxed ${
                    isDarkTheme ? 'text-slate-300' : 'text-stone-500'
                  }`}
                >
                  {getTrackDescription()}
                </p>
              </div>

              {/* Preset Selector Buttons */}
              <div className="space-y-2">
                <span className={`text-xs font-medium ${isDarkTheme ? 'text-slate-300' : 'text-stone-500'}`}>
                  Pilih Melodi Suasana:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'melodi-senja', name: '1. Melodi Senja', sub: 'Harmoni Akustik' },
                    { id: 'piano-hujan', name: '2. Piano Hujan', sub: 'Nostalgia Sendu' },
                    { id: 'bintang-malam', name: '3. Bintang Malam', sub: 'Ambient Tenang' },
                  ].map((item) => {
                    const isSelected =
                      audioState.mode === 'preset' && audioState.presetId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectPreset(item.id as AudioPreset)}
                        className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                          isSelected
                            ? isDarkTheme
                              ? 'border-amber-500 bg-amber-950/40 text-amber-200 shadow-xs'
                              : 'border-amber-700 bg-amber-50/60 text-stone-900 shadow-xs'
                            : isDarkTheme
                            ? 'border-slate-800 hover:border-slate-700 text-slate-300 bg-slate-900/40'
                            : 'border-stone-200 hover:border-stone-300 text-stone-600 bg-stone-50/30'
                        }`}
                      >
                        <p className="text-xs font-semibold">{item.name}</p>
                        <p className={`text-[11px] mt-0.5 ${isDarkTheme ? 'text-slate-400' : 'text-stone-400'}`}>
                          {item.sub}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visualizer bars */}
              <div className="py-1">
                <div
                  className={`flex items-center justify-between text-xs mb-2 ${
                    isDarkTheme ? 'text-slate-400' : 'text-stone-400'
                  }`}
                >
                  <span>Gelombang Alunan Suasana</span>
                  <span>{audioState.isPlaying ? 'Mengalun Indah' : 'Jeda'}</span>
                </div>
                <div className="h-6 flex items-end gap-1.5">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-full rounded-t transition-all duration-300 ${
                        isDarkTheme ? 'bg-amber-500/80' : 'bg-amber-700/80'
                      } ${audioState.isPlaying ? 'animate-pulse' : 'h-1 opacity-20'}`}
                      style={{
                        height: audioState.isPlaying
                          ? `${Math.max(15, (Math.sin(i * 0.7 + Date.now() / 500) + 1) * 45)}%`
                          : '4px',
                        animationDelay: `${i * 60}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Transport & Volume Controls */}
              <div
                className={`pt-2 flex flex-wrap items-center justify-between gap-4 border-t ${
                  isDarkTheme ? 'border-slate-800' : 'border-stone-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={onTogglePlay}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-600 hover:bg-amber-500 text-white transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label={audioState.isPlaying ? 'Jeda Audio' : 'Putar Audio'}
                  >
                    {audioState.isPlaying ? (
                      <Pause className="w-5 h-5 fill-white" />
                    ) : (
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={onToggleLoop}
                    className={`p-2 rounded-lg transition-colors cursor-pointer ${
                      audioState.isLooping
                        ? isDarkTheme
                          ? 'text-amber-400 bg-amber-950/60'
                          : 'text-amber-800 bg-amber-50'
                        : isDarkTheme
                        ? 'text-slate-400 hover:text-slate-300'
                        : 'text-stone-400 hover:text-stone-600'
                    }`}
                    title="Ulangi Otomatis (Loop)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onVolumeChange(audioState.volume > 0 ? 0 : 0.6)}
                    className={`p-1.5 transition-colors cursor-pointer ${
                      isDarkTheme ? 'text-slate-400 hover:text-slate-200' : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {audioState.volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-stone-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioState.volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className={`w-24 sm:w-32 accent-amber-600 h-1.5 rounded-lg cursor-pointer ${
                      isDarkTheme ? 'bg-slate-700' : 'bg-stone-200'
                    }`}
                  />
                  <span
                    className={`text-xs font-mono tabular-nums w-8 text-right ${
                      isDarkTheme ? 'text-slate-400' : 'text-stone-400'
                    }`}
                  >
                    {Math.round(audioState.volume * 100)}%
                  </span>
                </div>
              </div>

              {/* Native audio player with controls adhering strictly to user snippet */}
              <div className="pt-2">
                <label htmlFor="audio-player" className="block text-[11px] text-stone-400 mb-1">
                  Kontrol Pemutar Audio Standar:
                </label>
                <audio
                  id="audio-player"
                  ref={audioRef}
                  controls
                  src={audioState.uploadedUrl || undefined}
                  loop={audioState.isLooping}
                  className="w-full mt-1 accent-amber-600"
                  preload="auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
