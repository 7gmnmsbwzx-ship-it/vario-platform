// Theme Type Definitions

export interface ThemeConfig {
  fontFamily: string
  primaryColor: string
  backgroundColor: string
  accentColor: string
  borderRadius: string
  spacing: 'compact' | 'comfortable' | 'spacious'
}

export interface ThemePreset {
  id: string
  name: string
  description: string
  config: ThemeConfig
  is_premium?: boolean
  preview_image_url?: string
}

// CSS Variables generated from theme
export interface ThemeCSSVars {
  '--font-family': string
  '--color-primary': string
  '--color-background': string
  '--color-accent': string
  '--border-radius': string
  '--spacing-multiplier': string
}

// Helper to convert ThemeConfig to CSS variables
export function themeToCSSVars(config: ThemeConfig): ThemeCSSVars {
  const spacingMultiplier = 
    config.spacing === 'compact' ? '0.8' :
    config.spacing === 'spacious' ? '1.2' : '1'

  return {
    '--font-family': config.fontFamily,
    '--color-primary': config.primaryColor,
    '--color-background': config.backgroundColor,
    '--color-accent': config.accentColor,
    '--border-radius': config.borderRadius,
    '--spacing-multiplier': spacingMultiplier,
  }
}
