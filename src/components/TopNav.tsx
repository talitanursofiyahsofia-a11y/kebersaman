import React from 'react';
import { Settings, Volume2, VolumeX, Palette } from 'lucide-react';
import { BackgroundThemeId } from '../types/portfolio';

interface TopNavProps {
  onOpenSettings: (tab?: 'text' | 'images' | 'videos' | 'audio' | 'background') => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentThemeId: BackgroundThemeId;
  isDarkTheme: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenSettings,
  isPlaying,
  onTogglePlay,
  isDarkTheme,
}) => {
  return (
    <header
      className={`fade-in sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
        isDarkTheme
          ? 'bg-slate-950/80 border-slate-800 text-slate-100'
          : 'bg-white/85 border-stone-200/80 text-stone-900'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6 sm:gap-8">
        {/* Zone 1: Brand wordmark with h1 matching specification */}
        <a
          href="#"
          className="inline-block whitespace-nowrap shrink-0 transition-colors"
        >
          <h1
            className={`text-xl font-bold tracking-tight font-serif-display ${
              isDarkTheme
                ? 'text-white hover:text-amber-400'
                : 'text-stone-900 hover:text-amber-800'
            }`}
          >
            Portofolio Saya
          </h1>
        </a>

        {/* Zone 2: Navigation links */}
        <nav
          className={`hidden md:flex items-center gap-7 text-sm font-medium transition-colors ${
            isDarkTheme ? 'text-slate-300' : 'text-stone-600'
          }`}
        >
          <a
            href="#kenangan"
            className={`transition-colors whitespace-nowrap shrink-0 ${
              isDarkTheme ? 'hover:text-white' : 'hover:text-stone-900'
            }`}
          >
            Kenangan Bersama
          </a>
          <a
            href="#audio-section"
            className={`transition-colors whitespace-nowrap shrink-0 ${
              isDarkTheme ? 'hover:text-white' : 'hover:text-stone-900'
            }`}
          >
            Audio Latar
          </a>
          <a
            href="#text-section"
            className={`transition-colors whitespace-nowrap shrink-0 ${
              isDarkTheme ? 'hover:text-white' : 'hover:text-stone-900'
            }`}
          >
            Teks Kenangan
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Background Theme Switcher Button */}
          <button
            onClick={() => onOpenSettings('background')}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              isDarkTheme
                ? 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
            title="Ubah Latar Belakang & Suasana"
          >
            <Palette className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Ubah Latar</span>
          </button>

          {/* Quick audio toggle */}
          <button
            onClick={onTogglePlay}
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              isPlaying
                ? isDarkTheme
                  ? 'bg-amber-950/60 text-amber-300 border-amber-700/60 shadow-xs'
                  : 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                : isDarkTheme
                ? 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
            title={isPlaying ? 'Jeda Audio' : 'Putar Audio'}
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span className="hidden sm:inline">Audio Aktif</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                <span className="hidden sm:inline">Audio Hening</span>
              </>
            )}
          </button>

          {/* Primary Action Button with exact requested id="toggle-settings" */}
          <button
            id="toggle-settings"
            onClick={() => onOpenSettings('background')}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-lg shadow-xs hover:shadow transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              isDarkTheme
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Pengaturan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
