import React from 'react';
import { Feather, Edit3, Heart, Calendar } from 'lucide-react';
import { MemoryText } from '../types/portfolio';

interface TextSectionProps {
  memoryText: MemoryText;
  onOpenSettings: (tab?: 'text' | 'images' | 'videos' | 'audio' | 'background') => void;
  isDarkTheme?: boolean;
}

export const TextSection: React.FC<TextSectionProps> = ({
  memoryText,
  onOpenSettings,
  isDarkTheme = false,
}) => {
  const paragraphs = memoryText.content
    ? memoryText.content.split('\n\n').filter((p) => p.trim().length > 0)
    : [memoryText.content];

  return (
    <section
      id="text-section"
      className={`py-20 transition-colors duration-300 ${
        isDarkTheme ? 'bg-slate-950/60' : 'bg-stone-100/40'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase mb-2 ${
              isDarkTheme ? 'text-amber-400' : 'text-amber-800'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Surat & Narasi Kenangan</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-bold font-serif-display tracking-tight transition-colors ${
              isDarkTheme ? 'text-white' : 'text-stone-900'
            }`}
          >
            Teks Kenangan
          </h2>
          <p
            className={`text-sm mt-1 max-w-md mx-auto transition-colors ${
              isDarkTheme ? 'text-slate-300' : 'text-stone-500'
            }`}
          >
            Untaian kata yang merangkum rasa dan pesan yang ingin kita abadikan bersama.
          </p>
        </div>

        {/* Paper Parchment Card */}
        <div
          className={`relative rounded-2xl border shadow-md p-8 sm:p-12 md:p-16 overflow-hidden transition-colors ${
            isDarkTheme
              ? 'bg-slate-900/90 border-slate-800 text-slate-100'
              : 'bg-[#fffdfa] border-stone-200/90 text-stone-900'
          }`}
        >
          {/* Subtle decorative background watermark or corner accent */}
          <div
            className={`absolute top-0 left-0 w-32 h-32 rounded-br-full pointer-events-none ${
              isDarkTheme ? 'bg-amber-400/5' : 'bg-amber-500/5'
            }`}
          />
          <div
            className={`absolute bottom-0 right-0 w-32 h-32 rounded-tl-full pointer-events-none ${
              isDarkTheme ? 'bg-amber-400/5' : 'bg-amber-500/5'
            }`}
          />

          {/* Top Title & Subtitle */}
          <div
            className={`text-center pb-8 border-b mb-8 ${
              isDarkTheme ? 'border-slate-800' : 'border-stone-200/60'
            }`}
          >
            <h3
              className={`text-xl sm:text-2xl md:text-3xl font-bold font-serif-display mb-2 leading-tight ${
                isDarkTheme ? 'text-white' : 'text-stone-900'
              }`}
            >
              {memoryText.title || 'Catatan Perjalanan Kita'}
            </h3>
            {memoryText.subtitle && (
              <p
                className={`text-sm sm:text-base font-serif-display italic ${
                  isDarkTheme ? 'text-slate-300' : 'text-stone-500'
                }`}
              >
                {memoryText.subtitle}
              </p>
            )}
          </div>

          {/* Main Prose Content with id="kenangan-text" */}
          <div
            id="kenangan-text"
            className="prose max-w-none leading-relaxed space-y-4 font-sans-body text-base sm:text-lg"
          >
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className={`leading-relaxed first-letter:text-2xl first-letter:font-serif-display first-letter:font-bold ${
                  isDarkTheme
                    ? 'text-slate-200 first-letter:text-amber-400'
                    : 'text-stone-700 first-letter:text-stone-900'
                }`}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Footer Signature & Date */}
          <div
            className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isDarkTheme ? 'border-slate-800' : 'border-stone-200/60'
            }`}
          >
            <div
              className={`flex items-center gap-2 text-xs ${
                isDarkTheme ? 'text-slate-400' : 'text-stone-500'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{memoryText.date || 'Tercatat dalam Memori'}</span>
              <span aria-hidden="true">·</span>
              <Heart
                className={`w-3.5 h-3.5 ${
                  isDarkTheme ? 'text-amber-400 fill-amber-400' : 'text-amber-700 fill-amber-700'
                }`}
              />
            </div>

            <div className="text-center sm:text-right">
              <p
                className={`text-xs uppercase tracking-widest font-mono ${
                  isDarkTheme ? 'text-slate-400' : 'text-stone-400'
                }`}
              >
                Ditulis Oleh
              </p>
              <p
                className={`font-serif-display font-semibold text-base ${
                  isDarkTheme ? 'text-white' : 'text-stone-900'
                }`}
              >
                {memoryText.author || 'Sahabat Sejati'}
              </p>
            </div>
          </div>

          {/* Quick Edit Float Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => onOpenSettings('text')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border shadow-xs transition-colors cursor-pointer ${
                isDarkTheme
                  ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Edit3 className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-amber-400' : 'text-amber-800'}`} />
              <span>Ubah Teks Kenangan</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
