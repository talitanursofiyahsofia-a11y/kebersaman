export type MediaType = 'image' | 'video';

export interface MemoryItem {
  id: string;
  type: MediaType;
  url: string;
  caption: string;
  date?: string;
  tag?: string;
  location?: string;
  duration?: number;
}

export type MemoryPhoto = MemoryItem;

export type AudioPreset = 'melodi-senja' | 'piano-hujan' | 'bintang-malam' | 'none';

export interface AudioState {
  mode: 'preset' | 'uploaded';
  presetId: AudioPreset;
  uploadedUrl: string | null;
  uploadedFileName: string;
  isPlaying: boolean;
  volume: number;
  isLooping: boolean;
  currentTime: number;
  duration: number;
}

export interface MemoryText {
  title: string;
  subtitle: string;
  content: string;
  author: string;
  date: string;
}

export type BackgroundThemeId =
  | 'nostalgia'
  | 'starry-night'
  | 'warm-paper'
  | 'rose'
  | 'sage'
  | 'dark-velvet'
  | 'custom-image'
  | 'custom-video';

export interface BgMedia {
  type: 'image' | 'video';
  src: string;
}

export interface BackgroundConfig {
  themeId: BackgroundThemeId;
  customImageUrl?: string | null;
  customVideoUrl?: string | null;
  bgMedia?: BgMedia | null;
  overlayOpacity: number; // 0.0 to 1.0
  blur: number; // 0 to 20 px
}
