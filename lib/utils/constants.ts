// Application Constants

export const APP_NAME = 'Vario'
export const APP_DESCRIPTION = 'Your all-in-one link-in-bio platform'

// Block Types
export const BLOCK_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  BUTTON: 'button',
  SOCIAL_LINKS: 'social_links',
  EMBED: 'embed',
  AI_CHAT: 'ai_chat',
} as const

// Social Platforms
export const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: 'Instagram', color: '#E4405F' },
  { id: 'youtube', name: 'YouTube', icon: 'Youtube', color: '#FF0000' },
  { id: 'twitter', name: 'Twitter/X', icon: 'Twitter', color: '#1DA1F2' },
  { id: 'tiktok', name: 'TikTok', icon: 'Music', color: '#000000' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', color: '#0A66C2' },
  { id: 'facebook', name: 'Facebook', icon: 'Facebook', color: '#1877F2' },
  { id: 'github', name: 'GitHub', icon: 'Github', color: '#333333' },
  { id: 'website', name: 'Website', icon: 'Globe', color: '#6366F1' },
]

// Theme Presets
export const THEME_PRESETS = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean white background',
    config: {
      fontFamily: 'Inter',
      primaryColor: '#000000',
      backgroundColor: '#FFFFFF',
      accentColor: '#6366F1',
      borderRadius: '12px',
      spacing: 'comfortable',
    },
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Purple gradient',
    config: {
      fontFamily: 'Inter',
      primaryColor: '#FFFFFF',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accentColor: '#A78BFA',
      borderRadius: '16px',
      spacing: 'spacious',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Sleek dark mode',
    config: {
      fontFamily: 'Inter',
      primaryColor: '#FFFFFF',
      backgroundColor: '#0F172A',
      accentColor: '#60A5FA',
      borderRadius: '8px',
      spacing: 'compact',
    },
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Cozy warm tones',
    config: {
      fontFamily: 'Inter',
      primaryColor: '#7C2D12',
      backgroundColor: '#FFF7ED',
      accentColor: '#F97316',
      borderRadius: '20px',
      spacing: 'comfortable',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Fresh blue palette',
    config: {
      fontFamily: 'Inter',
      primaryColor: '#0C4A6E',
      backgroundColor: '#F0F9FF',
      accentColor: '#0EA5E9',
      borderRadius: '16px',
      spacing: 'spacious',
    },
  },
]

// Analytics Events
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  BLOCK_CLICK: 'block_click',
  AI_CHAT_OPEN: 'ai_chat_open',
  AI_CHAT_MESSAGE: 'ai_chat_message',
  PROFILE_EDIT: 'profile_edit',
  THEME_CHANGE: 'theme_change',
} as const

// Validation Limits
export const LIMITS = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  DISPLAY_NAME_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 160,
  BLOCK_TITLE_MAX_LENGTH: 100,
  BLOCK_BODY_MAX_LENGTH: 500,
  MAX_BLOCKS_FREE: 5,
  MAX_BLOCKS_PRO: 999,
}
