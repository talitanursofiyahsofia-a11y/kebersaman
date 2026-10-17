import { BackgroundThemeId, BackgroundConfig } from '../types/portfolio';

export interface ThemeDefinition {
  id: BackgroundThemeId;
  name: string;
  description: string;
  colorPreview: string; // for color badge in settings
  isDark: boolean;
  bgImageUrl?: string;
  cssBgClass?: string;
}

export const THEME_PRESETS: ThemeDefinition[] = [
  {
    id: 'nostalgia',
    name: 'Krem Nostalgia',
    description: 'Nuansa kertas vintage krem yang hangat dan menenangkan.',
    colorPreview: '#faf9f5',
    isDark: false,
    cssBgClass: 'bg-[#faf9f5]',
  },
  {
    id: 'starry-night',
    name: 'Langit Berbintang',
    description: 'Pemandangan malam bertabur jutaan bintang kosmik.',
    colorPreview: '#0b1329',
    isDark: true,
    bgImageUrl: '/src/assets/images/bg_starry_night_1792243521112.jpg',
  },
  {
    id: 'warm-paper',
    name: 'Kertas Seni Klasik',
    description: 'Tekstur perkamen kertas seni berserat alami.',
    colorPreview: '#f4ede4',
    isDark: false,
    bgImageUrl: '/src/assets/images/bg_warm_paper_1792243521763.jpg',
  },
  {
    id: 'rose',
    name: 'Mawar Senja (Blush)',
    description: 'Sentuhan palet lembut bernuansa romantis dan manis.',
    colorPreview: '#fdf2f4',
    isDark: false,
    cssBgClass: 'bg-[#fdf2f4]',
  },
  {
    id: 'sage',
    name: 'Sage Teduh (Alami)',
    description: 'Kesejukan dedaunan hijau sage yang damai.',
    colorPreview: '#f2f6f3',
    isDark: false,
    cssBgClass: 'bg-[#f2f6f3]',
  },
  {
    id: 'dark-velvet',
    name: 'Midnight Onyx',
    description: 'Mode gelap elegan minimalis dengan kontras nyaman.',
    colorPreview: '#0f1117',
    isDark: true,
    cssBgClass: 'bg-[#0f1117]',
  },
  {
    id: 'custom-image',
    name: 'Foto Latar Kustom',
    description: 'Gunakan foto pribadi kalian sebagai wallpaper latar belakang.',
    colorPreview: 'linear-gradient(135deg, #f59e0b, #ec4899)',
    isDark: false,
  },
];

export function getThemeDef(id: BackgroundThemeId): ThemeDefinition {
  return THEME_PRESETS.find((t) => t.id === id) || THEME_PRESETS[0];
}
