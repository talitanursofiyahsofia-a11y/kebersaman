import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  Upload,
  Trash2,
  Image as ImageIcon,
  Film,
  Music,
  FileText,
  RotateCcw,
  Check,
  Palette,
  Sliders,
  Sparkles,
} from 'lucide-react';
import {
  MemoryItem,
  MemoryText,
  AudioPreset,
  BackgroundConfig,
  BgMedia,
} from '../types/portfolio';
import { THEME_PRESETS } from '../utils/themeHelper';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  memoryText: MemoryText;
  onSaveText: (text: MemoryText) => void;
  photos: MemoryItem[];
  onSavePhotos: (photos: MemoryItem[]) => void;
  videos: MemoryItem[];
  onSaveVideos: (videos: MemoryItem[]) => void;
  audioPreset: AudioPreset;
  onSelectPreset: (preset: AudioPreset) => void;
  uploadedAudioName: string;
  onSaveAudioFile: (file: File) => Promise<void>;
  onRemoveAudioFile: () => void;
  bgConfig: BackgroundConfig;
  onUpdateBgConfig: (config: BackgroundConfig) => void;
  onSaveBgMedia: (media: BgMedia) => Promise<void>;
  onRemoveBgMedia: () => void;
  onResetToDefault: () => void;
  defaultActiveTab?: 'text' | 'images' | 'videos' | 'audio' | 'background';
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  memoryText,
  onSaveText,
  photos,
  onSavePhotos,
  videos,
  onSaveVideos,
  audioPreset,
  onSelectPreset,
  uploadedAudioName,
  onSaveAudioFile,
  onRemoveAudioFile,
  bgConfig,
  onUpdateBgConfig,
  onSaveBgMedia,
  onRemoveBgMedia,
  onResetToDefault,
  defaultActiveTab = 'background',
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'images' | 'videos' | 'audio' | 'background'>(defaultActiveTab);

  // Form states
  const [title, setTitle] = useState(memoryText.title);
  const [subtitle, setSubtitle] = useState(memoryText.subtitle);
  const [content, setContent] = useState(memoryText.content);
  const [author, setAuthor] = useState(memoryText.author);
  const [date, setDate] = useState(memoryText.date);

  // Background preview state (staged or active)
  const [bgPreviewMedia, setBgPreviewMedia] = useState<BgMedia | null>(bgConfig.bgMedia || null);
  const [stagedBgFile, setStagedBgFile] = useState<File | null>(null);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // File input refs
  const bgInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(memoryText.title);
    setSubtitle(memoryText.subtitle);
    setContent(memoryText.content);
    setAuthor(memoryText.author);
    setDate(memoryText.date);
  }, [memoryText]);

  useEffect(() => {
    if (bgConfig.bgMedia) {
      setBgPreviewMedia(bgConfig.bgMedia);
    } else if (bgConfig.customImageUrl) {
      setBgPreviewMedia({ type: 'image', src: bgConfig.customImageUrl });
    } else {
      setBgPreviewMedia(null);
    }
  }, [bgConfig.bgMedia, bgConfig.customImageUrl]);

  useEffect(() => {
    if (defaultActiveTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab, isOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // ------------------- BACKGROUND HANDLERS -------------------
  const handleBgInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStagedBgFile(file);
    const isVid = file.type.startsWith('video/');
    const url = URL.createObjectURL(file);
    setBgPreviewMedia({
      type: isVid ? 'video' : 'image',
      src: url,
    });
  };

  const handleSaveBg = async () => {
    if (!stagedBgFile) {
      if (bgPreviewMedia) {
        showToast('Latar belakang telah aktif.');
      } else {
        showToast('Pilih file gambar atau video terlebih dahulu.');
      }
      return;
    }

    setIsProcessing(true);
    const file = stagedBgFile;
    const isVid = file.type.startsWith('video/');

    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;
        const mediaObj: BgMedia = {
          type: isVid ? 'video' : 'image',
          src: dataUrl,
        };
        await onSaveBgMedia(mediaObj);
        onUpdateBgConfig({
          ...bgConfig,
          themeId: isVid ? 'custom-video' : 'custom-image',
          bgMedia: mediaObj,
          customImageUrl: isVid ? null : dataUrl,
          customVideoUrl: isVid ? dataUrl : null,
        });
        setStagedBgFile(null);
        showToast(`Latar belakang ${isVid ? 'video' : 'gambar'} berhasil disimpan!`);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        showToast('Gagal memproses file latar.');
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch {
      showToast('Terjadi kesalahan saat menyimpan latar.');
      setIsProcessing(false);
    }
  };

  // ------------------- TEXT HANDLERS -------------------
  const handleSaveText = () => {
    onSaveText({
      title,
      subtitle,
      content,
      author,
      date,
    });
    showToast('Teks kenangan berhasil disimpan!');
  };

  // ------------------- IMAGE HANDLERS -------------------
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1600;
          const MAX_HEIGHT = 1600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.88));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveImages = async () => {
    const inputEl = imageInputRef.current;
    if (!inputEl || !inputEl.files || inputEl.files.length === 0) {
      showToast('Pilih setidaknya 1 gambar untuk diunggah.');
      return;
    }

    const files = Array.from(inputEl.files);
    const remainingSlots = 24 - photos.length;
    if (remainingSlots <= 0) {
      showToast('Galeri foto sudah penuh (maksimal 24 foto).');
      return;
    }

    setIsProcessing(true);
    const filesToProcess = files.slice(0, remainingSlots);

    try {
      const newPhotos: MemoryItem[] = [];
      for (let i = 0; i < filesToProcess.length; i++) {
        const f = filesToProcess[i];
        const dataUrl = await processImageFile(f);
        newPhotos.push({
          id: `photo-${Date.now()}-${i}`,
          type: 'image',
          url: dataUrl,
          caption: f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          date: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          tag: 'Kenangan Baru',
        });
      }

      const updated = [...photos, ...newPhotos];
      onSavePhotos(updated);
      showToast(`${filesToProcess.length} gambar berhasil ditambahkan!`);
      if (inputEl) inputEl.value = '';
    } catch {
      showToast('Gagal memproses gambar. Silakan coba kembali.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ------------------- VIDEO HANDLERS -------------------
  const handleSaveVideos = async () => {
    const inputEl = videoInputRef.current;
    if (!inputEl || !inputEl.files || inputEl.files.length === 0) {
      showToast('Pilih file video (MP4/WebM) untuk diunggah.');
      return;
    }

    const files = Array.from(inputEl.files);
    const remainingSlots = 5 - videos.length;
    if (remainingSlots <= 0) {
      showToast('Batas video kenangan telah tercapai (maksimal 5 video).');
      return;
    }

    setIsProcessing(true);
    const filesToProcess = files.slice(0, remainingSlots);

    try {
      const newVideos: MemoryItem[] = [];
      for (let i = 0; i < filesToProcess.length; i++) {
        const f = filesToProcess[i];
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error('Gagal membaca video'));
          reader.readAsDataURL(f);
        });

        newVideos.push({
          id: `video-${Date.now()}-${i}`,
          type: 'video',
          url: dataUrl,
          caption: f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          date: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          tag: 'Video Momen',
        });
      }

      const updated = [...videos, ...newVideos];
      onSaveVideos(updated);
      showToast(`${filesToProcess.length} video berhasil disimpan!`);
      if (inputEl) inputEl.value = '';
    } catch {
      showToast('Gagal memproses video. Pastikan ukuran video wajar.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ------------------- AUDIO HANDLERS -------------------
  const handleSaveAudio = async () => {
    const inputEl = audioInputRef.current;
    if (!inputEl || !inputEl.files || inputEl.files.length === 0) {
      showToast('Pilih file audio latar (MP3/WAV/M4A) terlebih dahulu.');
      return;
    }

    const file = inputEl.files[0];
    setIsProcessing(true);
    try {
      await onSaveAudioFile(file);
      showToast('Audio latar kenangan berhasil disimpan!');
      if (inputEl) inputEl.value = '';
    } catch {
      showToast('Gagal menyimpan file audio.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Settings Panel Drawer with exact requested id="settings" */}
      <div
        id="settings"
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[520px] bg-white shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 open' : 'translate-x-full'
        }`}
      >
        {/* Header with requested <h3>Pengaturan</h3> */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="text-lg font-bold font-serif-display text-stone-900">
              Pengaturan
            </h3>
            <p className="text-xs text-stone-500">
              Kustomisasi latar, teks kenangan, galeri foto, video, dan audio
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
            aria-label="Tutup Pengaturan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-white px-3 pt-2 gap-1 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('background')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'background'
                ? 'border-amber-800 text-amber-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Latar Belakang</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'text'
                ? 'border-amber-800 text-amber-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Teks Kenangan</span>
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'images'
                ? 'border-amber-800 text-amber-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Gambar ({photos.length}/24)</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'videos'
                ? 'border-amber-800 text-amber-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video ({videos.length}/5)</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'audio'
                ? 'border-amber-800 text-amber-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Audio Latar</span>
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="mx-4 mt-3 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Form Body with All Required Elements */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* ================= SECTION: BACKGROUND ================= */}
          {activeTab === 'background' && (
            <div className="space-y-6">
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="bg-input"
                    className="text-xs font-semibold text-stone-800"
                  >
                    Latar Belakang (Gambar/Video)
                  </label>
                  {(bgConfig.bgMedia || bgConfig.customImageUrl) && (
                    <button
                      onClick={onRemoveBgMedia}
                      className="text-[11px] text-red-600 hover:underline cursor-pointer"
                    >
                      Hapus Latar Kustom
                    </button>
                  )}
                </div>

                {/* Exact requested #bg-preview container */}
                <div id="bg-preview">
                  {bgPreviewMedia ? (
                    bgPreviewMedia.type === 'video' ? (
                      <video
                        src={bgPreviewMedia.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={bgPreviewMedia.src}
                        alt="Preview Latar"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <span className="text-xs text-stone-400">Preview Latar Belakang</span>
                  )}
                </div>

                {/* Exact requested #bg-input */}
                <input
                  type="file"
                  id="bg-input"
                  ref={bgInputRef}
                  accept="image/*,video/*"
                  onChange={handleBgInputChange}
                  className="block w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800 cursor-pointer"
                />

                {/* Exact requested #save-bg button */}
                <button
                  id="save-bg"
                  onClick={handleSaveBg}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Menyimpan...' : 'Simpan Latar'}</span>
                </button>
              </div>

              {/* Preset Theme Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-2">
                  Atau Pilih Tema Nuansa Warna Bawaan:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {THEME_PRESETS.map((theme) => {
                    const isSelected = bgConfig.themeId === theme.id && !bgConfig.bgMedia;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => {
                          onUpdateBgConfig({
                            ...bgConfig,
                            themeId: theme.id,
                            bgMedia: null,
                            customImageUrl: null,
                            customVideoUrl: null,
                          });
                          setBgPreviewMedia(null);
                          showToast(`Latar "${theme.name}" diterapkan!`);
                        }}
                        className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-700 bg-amber-50/60 ring-2 ring-amber-700/20'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="w-4 h-4 rounded-full border border-stone-300 shrink-0"
                            style={{ background: theme.colorPreview }}
                          />
                          <span className="text-xs font-semibold text-stone-900 truncate">
                            {theme.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 line-clamp-1">
                          {theme.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Adjustments: Overlay Opacity & Blur */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800">
                  <Sliders className="w-3.5 h-3.5 text-amber-700" />
                  <span>Penyesuaian Visual Latar</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-stone-600 mb-1">
                    <span>Kepekatan Lapisan Kontras Teks</span>
                    <span className="font-mono tabular-nums">
                      {Math.round(bgConfig.overlayOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.85"
                    step="0.05"
                    value={bgConfig.overlayOpacity}
                    onChange={(e) =>
                      onUpdateBgConfig({
                        ...bgConfig,
                        overlayOpacity: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-amber-800 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-stone-600 mb-1">
                    <span>Efek Buram Latar (Blur)</span>
                    <span className="font-mono tabular-nums">{bgConfig.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    step="1"
                    value={bgConfig.blur}
                    onChange={(e) =>
                      onUpdateBgConfig({
                        ...bgConfig,
                        blur: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-amber-800 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= SECTION: TEXT ================= */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              {/* Exact requested #text-input and #save-text */}
              <div>
                <label
                  htmlFor="text-input"
                  className="block text-xs font-semibold text-stone-700 mb-1"
                >
                  Teks Kenangan
                </label>
                <textarea
                  id="text-input"
                  ref={textInputRef}
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan teks atau cerita kenangan bersama di sini..."
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-800/40 focus:border-amber-800 text-stone-800 leading-relaxed font-sans-body"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Judul Kenangan
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Judul catatan kenangan..."
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-800/40 text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Subjudul / Kutipan
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Sebuah kisah tentang..."
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-800/40 text-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Penulis
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Nama..."
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-800/40 text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Oktober 2026"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-800/40 text-stone-800"
                  />
                </div>
              </div>

              <button
                id="save-text"
                onClick={handleSaveText}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Teks</span>
              </button>
            </div>
          )}

          {/* ================= SECTION: IMAGES (max 24) ================= */}
          {activeTab === 'images' && (
            <div className="space-y-5">
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="image-input"
                    className="text-xs font-semibold text-stone-800"
                  >
                    Upload Gambar (max 24)
                  </label>
                  <span className="text-[11px] font-mono text-stone-500">
                    {photos.length} / 24 foto
                  </span>
                </div>

                {/* Exact requested #image-input */}
                <input
                  type="file"
                  id="image-input"
                  ref={imageInputRef}
                  accept="image/*"
                  multiple
                  className="block w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800 cursor-pointer"
                />

                {/* Exact requested #save-images */}
                <button
                  id="save-images"
                  onClick={handleSaveImages}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Memproses...' : 'Simpan Gambar'}</span>
                </button>
              </div>

              {/* Photo list preview with individual deletion & caption editing */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Daftar Foto Tersimpan
                </h4>

                {photos.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">Belum ada foto.</p>
                ) : (
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {photos.map((photo, i) => (
                      <div
                        key={photo.id || i}
                        className="flex items-center gap-3 p-2 bg-white rounded-lg border border-stone-200 shadow-xs"
                      >
                        <div className="w-12 h-12 rounded bg-stone-100 overflow-hidden shrink-0">
                          <img
                            src={photo.url}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-grow min-w-0">
                          <input
                            type="text"
                            value={photo.caption}
                            onChange={(e) => {
                              const updated = photos.map((p) =>
                                p.id === photo.id ? { ...p, caption: e.target.value } : p
                              );
                              onSavePhotos(updated);
                            }}
                            placeholder="Keterangan foto..."
                            className="w-full text-xs text-stone-800 border-b border-transparent hover:border-stone-300 focus:border-amber-800 focus:outline-hidden py-0.5 truncate"
                          />
                          <p className="text-[10px] text-stone-400 truncate">
                            {photo.date || 'Hari Istimewa'}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            const updated = photos.filter((p) => p.id !== photo.id);
                            onSavePhotos(updated);
                            showToast('Foto dihapus.');
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                          title="Hapus foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= SECTION: VIDEOS (max 5) ================= */}
          {activeTab === 'videos' && (
            <div className="space-y-5">
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="video-input"
                    className="text-xs font-semibold text-stone-800"
                  >
                    Upload Video (max 5)
                  </label>
                  <span className="text-[11px] font-mono text-stone-500">
                    {videos.length} / 5 video
                  </span>
                </div>

                {/* Exact requested #video-input */}
                <input
                  type="file"
                  id="video-input"
                  ref={videoInputRef}
                  accept="video/*"
                  multiple
                  className="block w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800 cursor-pointer"
                />

                {/* Exact requested #save-videos */}
                <button
                  id="save-videos"
                  onClick={handleSaveVideos}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Menyimpan Video...' : 'Simpan Video'}</span>
                </button>
              </div>

              {/* Video list preview with delete & caption editing */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Daftar Video Tersimpan
                </h4>

                {videos.length === 0 ? (
                  <p className="text-xs text-stone-400 italic">Belum ada video kenangan.</p>
                ) : (
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {videos.map((vid, i) => (
                      <div
                        key={vid.id || i}
                        className="flex items-center gap-3 p-2 bg-white rounded-lg border border-stone-200 shadow-xs"
                      >
                        <div className="w-12 h-12 rounded bg-black overflow-hidden shrink-0 flex items-center justify-center">
                          <video
                            src={vid.url}
                            preload="metadata"
                            muted
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-grow min-w-0">
                          <input
                            type="text"
                            value={vid.caption}
                            onChange={(e) => {
                              const updated = videos.map((v) =>
                                v.id === vid.id ? { ...v, caption: e.target.value } : v
                              );
                              onSaveVideos(updated);
                            }}
                            placeholder="Keterangan video..."
                            className="w-full text-xs text-stone-800 border-b border-transparent hover:border-stone-300 focus:border-amber-800 focus:outline-hidden py-0.5 truncate"
                          />
                          <p className="text-[10px] text-stone-400 truncate">
                            {vid.date || 'Video Kenangan'}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            const updated = videos.filter((v) => v.id !== vid.id);
                            onSaveVideos(updated);
                            showToast('Video dihapus.');
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                          title="Hapus video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= SECTION: AUDIO ================= */}
          {activeTab === 'audio' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-2">
                  Pilih Melodi Suasana Bawaan
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'melodi-senja', name: 'Melodi Senja (Harmoni Akustik)', desc: 'Tenang, hangat, arpeggio akustik' },
                    { id: 'piano-hujan', name: 'Piano Hujan (Nostalgia Lembut)', desc: 'Sentuhan tuts piano sendu rintik hujan' },
                    { id: 'bintang-malam', name: 'Bintang Malam (Suasana Syahdu)', desc: 'Ambient luas menenangkan' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onSelectPreset(p.id as AudioPreset)}
                      className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                        audioPreset === p.id && !uploadedAudioName
                          ? 'border-amber-800 bg-amber-50/70 text-stone-900 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 text-stone-600 bg-white'
                      }`}
                    >
                      <p className="text-xs font-semibold text-stone-800">{p.name}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-stone-200 pt-4">
                {/* Exact requested #audio-input and #save-audio */}
                <label
                  htmlFor="audio-input"
                  className="block text-xs font-semibold text-stone-800 mb-1"
                >
                  Upload Audio Latar
                </label>
                <p className="text-[11px] text-stone-500 mb-3">
                  Gunakan lagu kenangan kalian sendiri (format MP3, WAV, M4A).
                </p>

                <input
                  type="file"
                  id="audio-input"
                  ref={audioInputRef}
                  accept="audio/*"
                  className="block w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800 cursor-pointer mb-3"
                />

                <button
                  id="save-audio"
                  onClick={handleSaveAudio}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Menyimpan Audio...' : 'Simpan Audio'}</span>
                </button>

                {uploadedAudioName && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-medium text-stone-900 truncate">
                        {uploadedAudioName}
                      </p>
                      <p className="text-[10px] text-stone-500">Audio kustom aktif</p>
                    </div>
                    <button
                      onClick={onRemoveAudioFile}
                      className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                      title="Hapus audio kustom"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Reset seluruh portofolio ke pengaturan awal bawaan?')) {
                onResetToDefault();
                showToast('Portofolio telah direset ke setelan awal.');
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bawaan</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </>
  );
};
