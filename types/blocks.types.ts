// Block Type Definitions
// Specific content structures for each block type

import { BlockType } from './database.types'

// Text Block
export interface TextBlockContent {
  title: string
  body?: string
}

// Image Block
export interface ImageBlockContent {
  url: string
  alt?: string
  link?: string
}

// Button Block
export interface ButtonBlockContent {
  label: string
  url: string
  style?: 'primary' | 'secondary' | 'outline'
}

// Social Links Block
export interface SocialLink {
  platform: string
  url: string
  handle?: string
}

export interface SocialLinksBlockContent {
  links: SocialLink[]
}

// Embed Block
export interface EmbedBlockContent {
  url: string
  type?: 'youtube' | 'spotify' | 'iframe'
}

// AI Chat Block
export interface AIChatBlockContent {
  greeting?: string
  systemPrompt?: string
  avatarUrl?: string
}

// Unified Block Content Type
export type BlockContent =
  | TextBlockContent
  | ImageBlockContent
  | ButtonBlockContent
  | SocialLinksBlockContent
  | EmbedBlockContent
  | AIChatBlockContent

// Full Block Interface with typed content
export interface TypedBlock<T = BlockContent> {
  id: string
  user_id: string
  type: BlockType
  content: T
  order_index: number
  is_visible: boolean
  created_at: string
  updated_at: string
}

// Specific typed blocks for each type
export type TextBlock = TypedBlock<TextBlockContent>
export type ImageBlock = TypedBlock<ImageBlockContent>
export type ButtonBlock = TypedBlock<ButtonBlockContent>
export type SocialLinksBlock = TypedBlock<SocialLinksBlockContent>
export type EmbedBlock = TypedBlock<EmbedBlockContent>
export type AIChatBlock = TypedBlock<AIChatBlockContent>
