import { MemoryItem, MemoryPhoto, MemoryText, AudioPreset, BackgroundConfig, BgMedia } from '../types/portfolio';

// Initial default seed photos using local high-resolution assets
export const DEFAULT_PHOTOS: MemoryPhoto[] = [
  {
    id: 'photo-1',
    type: 'image',
    url: '/src/assets/images/memory_sunset_golden_hour_1792242184821.jpg',
    caption: 'Senja terindah di tepi tebing karang, saat waktu terasa berhenti sejenak.',
    date: '14 Agustus 2025',
    tag: 'Petualangan',
    location: 'Pantai Selatan'
  },
  {
    id: 'photo-2',
    type: 'image',
    url: '/src/assets/images/memory_cozy_cafe_journal_1792242185646.jpg',
    caption: 'Secangkir kopi hangat, obrolan tanpa akhir, dan coretan cerita di sudut kedai.',
    date: '28 Oktober 2025',
    tag: 'Momen Manis',
    location: 'Kedai Sudut Kota'
  },
  {
    id: 'photo-3',
    type: 'image',
    url: '/src/assets/images/memory_mountain_stargazing_1792242185545.jpg',
    caption: 'Menerbangkan harapan di bawah taburan jutaan bintang dan hembusan angin dingin.',
    date: '31 Desember 2025',
    tag: 'Momen Manis',
    location: 'Puncak Bukit Bintang'
  },
  {
    id: 'photo-4',
    type: 'image',
    url: '/src/assets/images/memory_vintage_polaroids_1792242185909.jpg',
    caption: 'Koleksi foto polaroid pertama yang menyimpan jutaan senyuman dan tawa.',
    date: '12 Januari 2026',
    tag: 'Kenangan',
    location: 'Ruang Kenangan'
  }
];

export const DEFAULT_VIDEOS: MemoryItem[] = [];

export const DEFAULT_TEXT: MemoryText = {
  title: 'Catatan Untuk Setiap Langkah yang Telah Kita Lalui',
  subtitle: 'Sebuah kisah sederhana tentang tawa, perjalanan, dan rasa syukur',
  content: `Ada hari-hari yang mungkin biasa bagi orang lain, namun terasa begitu istimewa saat dilalui bersama. Dari langkah-langkah kecil di jalanan berliku, tawa lepas di kedai kopi saat hujan turun, hingga keheningan damai saat menatap langit senja.\n\nTerima kasih telah menjadi bagian paling berwarna dalam setiap halaman perjalanan ini. Portofolio ini bukan sekadar kumpulan foto, melainkan jejak langkah rasa syukur atas setiap detik yang telah terukir abadi. Semoga setiap kali kita menoleh ke belakang melalui lembaran ini, kita selalu diingatkan bahwa perjalanan terbaik adalah saat kita saling menemani.`,
  author: 'Dengan Tulus & Penuh Syukur',
  date: 'Oktober 2026'
};

export const DEFAULT_BG_CONFIG: BackgroundConfig = {
  themeId: 'nostalgia',
  customImageUrl: null,
  customVideoUrl: null,
  bgMedia: null,
  overlayOpacity: 0.15,
  blur: 0,
};

const DB_NAME = 'PortofolioKenanganDB';
const DB_VERSION = 3;
const STORE_PHOTOS = 'photos';
const STORE_VIDEOS = 'videos';
const STORE_AUDIO = 'audio';
const STORE_CONFIG = 'config';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
        db.createObjectStore(STORE_PHOTOS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_VIDEOS)) {
        db.createObjectStore(STORE_VIDEOS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_AUDIO)) {
        db.createObjectStore(STORE_AUDIO, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORE_CONFIG)) {
        db.createObjectStore(STORE_CONFIG, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ------------------- IMAGES -------------------

export async function getStoredPhotos(): Promise<MemoryItem[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PHOTOS, 'readonly');
      const store = tx.objectStore(STORE_PHOTOS);
      const req = store.getAll();
      req.onsuccess = () => {
        const result = req.result as MemoryItem[];
        if (result && result.length > 0) {
          resolve(result.map(item => ({ ...item, type: 'image' })));
        } else {
          // Check localStorage 'portofolio_images' fallback
          const local = localStorage.getItem('portofolio_images');
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const formatted: MemoryItem[] = parsed.map((item, i) => {
                  if (typeof item === 'string') {
                    return {
                      id: `img-legacy-${i}`,
                      type: 'image',
                      url: item,
                      caption: `Foto #${i + 1}`,
                      date: 'Momen Berharga'
                    };
                  }
                  return { ...item, type: 'image' };
                });
                return resolve(formatted);
              }
            } catch {
              // fallback
            }
          }
          resolve(DEFAULT_PHOTOS);
        }
      };
      req.onerror = () => resolve(DEFAULT_PHOTOS);
    });
  } catch {
    return DEFAULT_PHOTOS;
  }
}

export async function savePhotos(photos: MemoryItem[]): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_PHOTOS, 'readwrite');
    const store = tx.objectStore(STORE_PHOTOS);
    store.clear();
    for (const p of photos) {
      store.put({ ...p, type: 'image' });
    }

    // Also update localStorage 'portofolio_images' as array of URLs for compatibility
    try {
      const urls = photos.map(p => p.url);
      localStorage.setItem('portofolio_images', JSON.stringify(urls));
    } catch {
      // quota limit might be reached if big data URLs
    }
  } catch (err) {
    console.error('Failed to save photos to IndexedDB', err);
  }
}

// ------------------- VIDEOS -------------------

export async function getStoredVideos(): Promise<MemoryItem[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_VIDEOS, 'readonly');
      const store = tx.objectStore(STORE_VIDEOS);
      const req = store.getAll();
      req.onsuccess = () => {
        const result = req.result as MemoryItem[];
        if (result && result.length > 0) {
          resolve(result.map(item => ({ ...item, type: 'video' })));
        } else {
          // Check localStorage 'portofolio_videos'
          const local = localStorage.getItem('portofolio_videos');
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const formatted: MemoryItem[] = parsed.map((item, i) => {
                  if (typeof item === 'string') {
                    return {
                      id: `video-legacy-${i}`,
                      type: 'video',
                      url: item,
                      caption: `Video Kenangan #${i + 1}`,
                      date: 'Momen Bergerak'
                    };
                  }
                  return { ...item, type: 'video' };
                });
                return resolve(formatted);
              }
            } catch {
              // fallback
            }
          }
          resolve([]);
        }
      };
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

export async function saveVideos(videos: MemoryItem[]): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_VIDEOS, 'readwrite');
    const store = tx.objectStore(STORE_VIDEOS);
    store.clear();
    for (const v of videos) {
      store.put({ ...v, type: 'video' });
    }

    // Update localStorage 'portofolio_videos'
    try {
      const urls = videos.map(v => v.url);
      localStorage.setItem('portofolio_videos', JSON.stringify(urls));
    } catch {
      // quota limit safely caught
    }
  } catch (err) {
    console.error('Failed to save videos to IndexedDB', err);
  }
}

// ------------------- AUDIO -------------------

export async function getStoredAudioFile(): Promise<{ url: string; fileName: string } | null> {
  // First check localStorage 'portofolio_audio'
  const localAudio = localStorage.getItem('portofolio_audio');

  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_AUDIO, 'readonly');
      const store = tx.objectStore(STORE_AUDIO);
      const req = store.get('user_audio');
      req.onsuccess = () => {
        if (req.result && req.result.data) {
          resolve({
            url: req.result.data,
            fileName: req.result.fileName || 'Audio Pribadi'
          });
        } else if (localAudio) {
          resolve({
            url: localAudio,
            fileName: 'Audio Pribadi'
          });
        } else {
          resolve(null);
        }
      };
      req.onerror = () => {
        if (localAudio) resolve({ url: localAudio, fileName: 'Audio Pribadi' });
        else resolve(null);
      };
    });
  } catch {
    if (localAudio) return { url: localAudio, fileName: 'Audio Pribadi' };
    return null;
  }
}

export async function saveStoredAudioFile(dataUrl: string, fileName: string): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_AUDIO, 'readwrite');
    const store = tx.objectStore(STORE_AUDIO);
    store.put({ key: 'user_audio', data: dataUrl, fileName, timestamp: Date.now() });

    try {
      localStorage.setItem('portofolio_audio', dataUrl);
    } catch {
      // quota exceeded caught
    }
  } catch (err) {
    console.error('Failed to save audio to IndexedDB', err);
  }
}

export async function removeStoredAudioFile(): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_AUDIO, 'readwrite');
    const store = tx.objectStore(STORE_AUDIO);
    store.delete('user_audio');
    localStorage.removeItem('portofolio_audio');
  } catch (err) {
    console.error('Failed to remove audio', err);
  }
}

// ------------------- TEXT -------------------

export function getStoredText(): MemoryText {
  try {
    const raw = localStorage.getItem('portofolio_text');
    if (!raw) return DEFAULT_TEXT;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null && 'content' in parsed) {
        return parsed as MemoryText;
      }
      if (typeof parsed === 'string') {
        return { ...DEFAULT_TEXT, content: parsed };
      }
    } catch {
      return { ...DEFAULT_TEXT, content: raw };
    }
  } catch {
    return DEFAULT_TEXT;
  }
  return DEFAULT_TEXT;
}

export function saveStoredText(text: MemoryText): void {
  try {
    localStorage.setItem('portofolio_text', JSON.stringify(text));
  } catch (err) {
    console.error('Failed to save text', err);
  }
}

export function getStoredPresetAudio(): AudioPreset {
  const p = localStorage.getItem('portofolio_audio_preset');
  if (p === 'melodi-senja' || p === 'piano-hujan' || p === 'bintang-malam' || p === 'none') {
    return p;
  }
  return 'melodi-senja';
}

export function saveStoredPresetAudio(preset: AudioPreset): void {
  localStorage.setItem('portofolio_audio_preset', preset);
}

// ------------------- BACKGROUND (IMAGE & VIDEO) -------------------

export function getStoredBackgroundConfig(): BackgroundConfig {
  try {
    const raw = localStorage.getItem('portofolio_bg_config');
    if (!raw) return DEFAULT_BG_CONFIG;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_BG_CONFIG, ...parsed };
  } catch {
    return DEFAULT_BG_CONFIG;
  }
}

export function saveStoredBackgroundConfig(config: BackgroundConfig): void {
  try {
    localStorage.setItem('portofolio_bg_config', JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save bg config', err);
  }
}

export async function getStoredBgMedia(): Promise<BgMedia | null> {
  // Check localStorage 'portofolio_bg'
  const localBg = localStorage.getItem('portofolio_bg');
  let parsedLocal: BgMedia | null = null;
  if (localBg) {
    try {
      const parsed = JSON.parse(localBg);
      if (parsed && (parsed.type === 'image' || parsed.type === 'video') && parsed.src) {
        parsedLocal = parsed;
      }
    } catch {
      // ignore
    }
  }

  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_CONFIG, 'readonly');
      const store = tx.objectStore(STORE_CONFIG);
      const req = store.get('custom_bg_media');
      req.onsuccess = () => {
        if (req.result && req.result.media) {
          resolve(req.result.media);
        } else if (parsedLocal) {
          resolve(parsedLocal);
        } else {
          // Backward compatibility check for custom_bg_image
          const reqLegacy = store.get('custom_bg_image');
          reqLegacy.onsuccess = () => {
            if (reqLegacy.result && reqLegacy.result.data) {
              resolve({ type: 'image', src: reqLegacy.result.data });
            } else {
              resolve(null);
            }
          };
          reqLegacy.onerror = () => resolve(null);
        }
      };
      req.onerror = () => resolve(parsedLocal);
    });
  } catch {
    return parsedLocal;
  }
}

export async function saveStoredBgMedia(media: BgMedia): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_CONFIG, 'readwrite');
    const store = tx.objectStore(STORE_CONFIG);
    store.put({ key: 'custom_bg_media', media, timestamp: Date.now() });

    try {
      localStorage.setItem('portofolio_bg', JSON.stringify(media));
    } catch {
      // quota limit
    }
  } catch (err) {
    console.error('Failed to save custom bg media to IndexedDB', err);
  }
}

export async function removeStoredBgMedia(): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction(STORE_CONFIG, 'readwrite');
    const store = tx.objectStore(STORE_CONFIG);
    store.delete('custom_bg_media');
    store.delete('custom_bg_image');
    localStorage.removeItem('portofolio_bg');
  } catch (err) {
    console.error('Failed to remove custom bg media', err);
  }
}
