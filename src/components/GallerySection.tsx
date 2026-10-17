import React, { useState } from 'react';
import { Plus, Maximize2, Calendar, MapPin, Sparkles, Film, Image as ImageIcon, Play } from 'lucide-react';
import { MemoryItem } from '../types/portfolio';

interface GallerySectionProps {
  photos: MemoryItem[];
  videos: MemoryItem[];
  onSelectItem: (item: MemoryItem, indexInFullList: number) => void;
  onOpenSettings: (tab?: 'text' | 'images' | 'videos' | 'audio' | 'background') => void;
  onStartSlideshow: () => void;
  isDarkTheme?: boolean;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  photos,
  videos,
  onSelectItem,
  onOpenSettings,
  onStartSlideshow,
  isDarkTheme = false,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'photo' | 'video'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('Semua');

  // Combined list preserving order
  const allItems: MemoryItem[] = [
    ...photos.map(p => ({ ...p, type: 'image' as const })),
    ...videos.map(v => ({ ...v, type: 'video' as const })),
  ];

  const tags = [
    'Semua',
    ...Array.from(new Set(allItems.map((item) => item.tag).filter(Boolean))) as string[],
  ];

  const filteredItems = allItems.filter((item) => {
    if (filterType === 'photo' && item.type !== 'image') return false;
    if (filterType === 'video' && item.type !== 'video') return false;
    if (selectedTag !== 'Semua' && item.tag !== selectedTag) return false;
    return true;
  });

  return (
    <section
      id="kenangan"
      className={`section fade-in py-16 border-b transition-colors duration-300 ${
        isDarkTheme ? 'border-slate-800/80' : 'border-stone-200/70'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div
              className={`flex items-center gap-2 text-xs font-semibold tracking-wider uppercase mb-1 ${
                isDarkTheme ? 'text-amber-400' : 'text-amber-800'
              }`}
            >
              <span>Galeri Visual & Sinematik</span>
              <span aria-hidden="true" className={isDarkTheme ? 'text-slate-600' : 'text-stone-300'}>
                ·
              </span>
              <span className={`font-normal ${isDarkTheme ? 'text-slate-400' : 'text-stone-500'}`}>
                {photos.length} Foto & {videos.length} Video
              </span>
            </div>
            <h2
              className={`text-2xl sm:text-3xl font-bold font-serif-display tracking-tight transition-colors ${
                isDarkTheme ? 'text-white' : 'text-stone-900'
              }`}
            >
              Kenangan Bersama
            </h2>
            <p
              className={`text-sm mt-1 max-w-lg transition-colors ${
                isDarkTheme ? 'text-slate-300' : 'text-stone-500'
              }`}
            >
              Koleksi foto dan rekaman video kenangan kita. Klik item untuk memutar atau melihat dalam resolusi penuh.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {allItems.length > 0 && (
              <button
                onClick={onStartSlideshow}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors shadow-xs cursor-pointer ${
                  isDarkTheme
                    ? 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Putar Slideshow</span>
              </button>
            )}

            <button
              onClick={() => onOpenSettings('images')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-amber-700 hover:bg-amber-800 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Foto ({photos.length}/24)</span>
            </button>

            <button
              onClick={() => onOpenSettings('videos')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border shadow-xs transition-colors cursor-pointer ${
                isDarkTheme
                  ? 'bg-slate-800 text-amber-300 border-amber-600/50 hover:bg-slate-700'
                  : 'bg-stone-800 text-amber-200 border-stone-700 hover:bg-stone-900'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>Video ({videos.length}/5)</span>
            </button>
          </div>
        </div>

        {/* Media Type & Tag Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          {/* Media Type Segments */}
          <div
            className={`flex items-center gap-1 p-1 rounded-lg border ${
              isDarkTheme
                ? 'bg-slate-900 border-slate-800'
                : 'bg-stone-100/90 border-stone-200/80'
            }`}
          >
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filterType === 'all'
                  ? isDarkTheme
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-white text-stone-900 shadow-xs'
                  : isDarkTheme
                  ? 'text-slate-400 hover:text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Semua ({allItems.length})
            </button>

            <button
              onClick={() => setFilterType('photo')}
              className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filterType === 'photo'
                  ? isDarkTheme
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-white text-stone-900 shadow-xs'
                  : isDarkTheme
                  ? 'text-slate-400 hover:text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>Foto ({photos.length})</span>
            </button>

            <button
              onClick={() => setFilterType('video')}
              className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filterType === 'video'
                  ? isDarkTheme
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-white text-stone-900 shadow-xs'
                  : isDarkTheme
                  ? 'text-slate-400 hover:text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Film className="w-3 h-3" />
              <span>Video ({videos.length})</span>
            </button>
          </div>

          {/* Tags */}
          {tags.length > 2 && (
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                    selectedTag === tag
                      ? isDarkTheme
                        ? 'bg-amber-950/70 border-amber-500 text-amber-200'
                        : 'bg-amber-100/70 border-amber-400 text-amber-900'
                      : isDarkTheme
                      ? 'border-slate-800 text-slate-400 hover:text-white'
                      : 'border-stone-200 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Gallery Grid Container with id="gallery" */}
        {filteredItems.length === 0 ? (
          <div
            className={`text-center py-16 border-2 border-dashed rounded-xl p-8 ${
              isDarkTheme
                ? 'border-slate-800 bg-slate-900/50 text-slate-300'
                : 'border-stone-200 bg-white text-stone-500'
            }`}
          >
            <p className="text-sm mb-3">Belum ada item kenangan dalam kategori ini.</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => onOpenSettings('images')}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors cursor-pointer"
              >
                Unggah Foto
              </button>
              <button
                onClick={() => onOpenSettings('videos')}
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-800 hover:bg-stone-900 rounded-lg transition-colors cursor-pointer"
              >
                Unggah Video
              </button>
            </div>
          </div>
        ) : (
          <div
            id="gallery"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredItems.map((item, index) => {
              const fullIndex = allItems.findIndex((x) => x.id === item.id);
              const isVideo = item.type === 'video';

              return (
                <div
                  key={item.id || index}
                  onClick={() => onSelectItem(item, fullIndex !== -1 ? fullIndex : index)}
                  className={`photo group relative rounded-xl overflow-hidden border shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col ${
                    isDarkTheme
                      ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                      : 'bg-white border-stone-200/90 hover:border-stone-300'
                  }`}
                >
                  {/* Media Frame */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-950">
                    {isVideo ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-stone-900">
                        <video
                          src={item.url}
                          preload="metadata"
                          playsInline
                          muted
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 pointer-events-none"
                        />
                        {/* Play Icon Badge */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                          <span className="w-11 h-11 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-stone-900 ml-0.5" />
                          </span>
                        </div>
                        <span className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-mono font-medium text-white tracking-wide">
                          VIDEO
                        </span>
                      </div>
                    ) : (
                      <>
                        <img
                          src={item.url}
                          alt={item.caption || `Kenangan ${index + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Gradient Overlay for hover */}
                        <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="p-2 rounded-full bg-white/90 text-stone-900 shadow-sm backdrop-blur-xs transform scale-90 group-hover:scale-100 transition-transform">
                            <Maximize2 className="w-4 h-4" />
                          </span>
                        </div>
                      </>
                    )}

                    {/* Tag badge */}
                    {item.tag && (
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-sm bg-black/60 backdrop-blur-xs text-[11px] font-medium text-white tracking-wide">
                        {item.tag}
                      </div>
                    )}
                  </div>

                  {/* Caption & Metadata */}
                  <div
                    className={`p-3.5 flex flex-col justify-between flex-grow ${
                      isDarkTheme ? 'bg-slate-900 text-slate-100' : 'bg-white text-stone-900'
                    }`}
                  >
                    <p
                      className={`text-xs sm:text-sm font-medium line-clamp-2 leading-snug transition-colors ${
                        isDarkTheme
                          ? 'text-slate-200 group-hover:text-amber-400'
                          : 'text-stone-800 group-hover:text-amber-800'
                      }`}
                    >
                      {item.caption || (isVideo ? 'Momen video berharga' : 'Momen indah bersama')}
                    </p>

                    <div
                      className={`mt-2 pt-2 border-t flex items-center justify-between text-[11px] ${
                        isDarkTheme
                          ? 'border-slate-800 text-slate-400'
                          : 'border-stone-100 text-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{item.date || 'Hari Istimewa'}</span>
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-0.5 truncate max-w-[100px]">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
