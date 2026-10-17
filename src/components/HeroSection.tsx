import React from 'react';
import { Sparkles, Play, Image as ImageIcon, Heart } from 'lucide-react';
import { MemoryPhoto } from '../types/portfolio';

interface HeroSectionProps {
  photoCount: number;
  featuredPhoto?: MemoryPhoto;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStartSlideshow: () => void;
  onOpenSettings: (tab?: 'text' | 'images' | 'videos' | 'audio' | 'background') => void;
  isDarkTheme?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  photoCount,
  featuredPhoto,
  isPlaying,
  onTogglePlay,
  onStartSlideshow,
  onOpenSettings,
  isDarkTheme = false,
}) => {
  return (
    <section
      className={`relative overflow-hidden pt-8 pb-14 border-b transition-colors duration-300 ${
        isDarkTheme
          ? 'border-slate-800/80 bg-slate-950/40'
          : 'border-stone-200/60 bg-gradient-to-b from-amber-50/40 via-stone-50/20 to-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 space-y-6">
            <div
              className={`flex items-center gap-2 text-xs font-semibold tracking-wide uppercase ${
                isDarkTheme ? 'text-amber-400' : 'text-amber-800'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isDarkTheme ? 'fill-amber-400 text-amber-400' : 'fill-amber-700 text-amber-700'
                }`}
              />
              <span>Arsip Digital Momen Berharga</span>
              <span aria-hidden="true" className={isDarkTheme ? 'text-slate-600' : 'text-stone-300'}>
                ·
              </span>
              <span className={`font-normal ${isDarkTheme ? 'text-slate-400' : 'text-stone-500'}`}>
                Kenangan Abadi
              </span>
            </div>

            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-display tracking-tight leading-[1.15] text-balance transition-colors ${
                isDarkTheme ? 'text-white' : 'text-stone-900'
              }`}
            >
              Setiap Detik Bersama, Terukir Selamanya dalam Lembaran Kisah.
            </h1>

            <p
              className={`text-base sm:text-lg leading-relaxed max-w-xl font-normal transition-colors ${
                isDarkTheme ? 'text-slate-300' : 'text-stone-600'
              }`}
            >
              Selamat datang di portofolio kenangan kita. Ruang tenang untuk merayakan langkah yang telah terlewati, senyuman yang terabadikan, dan alunan melodi yang menghidupkan kembali setiap memori indah.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#kenangan"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Lihat Galeri Kenangan</span>
              </a>

              <button
                onClick={onTogglePlay}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border shadow-xs transition-all whitespace-nowrap cursor-pointer ${
                  isDarkTheme
                    ? 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                <Play
                  className={`w-4 h-4 ${
                    isPlaying ? 'text-amber-500 fill-amber-500' : isDarkTheme ? 'text-slate-300' : 'text-stone-600'
                  }`}
                />
                <span>{isPlaying ? 'Jeda Musik Latar' : 'Putar Musik Latar'}</span>
              </button>

              <button
                onClick={onStartSlideshow}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isDarkTheme
                    ? 'text-slate-300 hover:text-white'
                    : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Mulai Slideshow</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Polaroid Highlight */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group max-w-sm w-full">
              {/* Decorative washi tape effect */}
              <div
                className={`absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 rotate-[-2deg] rounded-xs shadow-xs z-10 pointer-events-none backdrop-blur-xs border-y ${
                  isDarkTheme
                    ? 'bg-amber-500/30 border-amber-400/40'
                    : 'bg-amber-200/70 border-amber-300/40'
                }`}
              />

              {/* Polaroid Frame */}
              <div
                className={`p-4 pb-6 rounded-lg shadow-md border transition-transform duration-300 group-hover:-rotate-1 group-hover:scale-[1.01] ${
                  isDarkTheme
                    ? 'bg-slate-900 border-slate-800 text-slate-100'
                    : 'bg-white border-stone-200/90 text-stone-900'
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded bg-stone-100">
                  {featuredPhoto ? (
                    <img
                      src={featuredPhoto.url}
                      alt={featuredPhoto.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-4 text-center">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-xs">Belum ada foto</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <p
                    className={`font-serif-display text-sm italic line-clamp-1 ${
                      isDarkTheme ? 'text-slate-200' : 'text-stone-800'
                    }`}
                  >
                    "{featuredPhoto?.caption || 'Momen terindah kita'}"
                  </p>
                  <p
                    className={`text-xs mt-1 font-sans-body ${
                      isDarkTheme ? 'text-slate-400' : 'text-stone-400'
                    }`}
                  >
                    {featuredPhoto?.date || 'Hari Istimewa'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Zone Fact Strip below hero split */}
        <div
          className={`mt-12 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-6 transition-colors ${
            isDarkTheme ? 'border-slate-800 text-slate-300' : 'border-stone-200/70 text-stone-600'
          }`}
        >
          <div>
            <p
              className={`text-2xl font-bold font-serif-display tabular-nums ${
                isDarkTheme ? 'text-white' : 'text-stone-900'
              }`}
            >
              {photoCount}{' '}
              <span
                className={`text-sm font-normal font-sans-body ${
                  isDarkTheme ? 'text-slate-400' : 'text-stone-500'
                }`}
              >
                / 24
              </span>
            </p>
            <p className={`text-xs mt-0.5 ${isDarkTheme ? 'text-slate-400' : 'text-stone-500'}`}>
              Foto Kenangan Tersimpan
            </p>
          </div>
          <div>
            <p
              className={`text-2xl font-bold font-serif-display ${
                isDarkTheme ? 'text-white' : 'text-stone-900'
              }`}
            >
              {isPlaying ? 'Memutar' : 'Siap'}
            </p>
            <p className={`text-xs mt-0.5 ${isDarkTheme ? 'text-slate-400' : 'text-stone-500'}`}>
              Audio Latar Musik
            </p>
          </div>
          <div>
            <p
              className={`text-2xl font-bold font-serif-display ${
                isDarkTheme ? 'text-white' : 'text-stone-900'
              }`}
            >
              100%
            </p>
            <p className={`text-xs mt-0.5 ${isDarkTheme ? 'text-slate-400' : 'text-stone-500'}`}>
              Penyimpanan Lokal Pribadi
            </p>
          </div>
          <div>
            <button
              onClick={() => onOpenSettings('background')}
              className={`text-left text-xs font-semibold hover:underline flex flex-col justify-center h-full cursor-pointer ${
                isDarkTheme ? 'text-amber-400 hover:text-amber-300' : 'text-amber-800 hover:text-amber-900'
              }`}
            >
              <span>+ Ubah Latar & Kenangan</span>
              <span className={`text-[11px] font-normal ${isDarkTheme ? 'text-slate-400' : 'text-stone-400'}`}>
                Buka panel kustomisasi
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
