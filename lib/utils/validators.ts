// Input Validation Utilities using Zod

import { z } from 'zod'
import { LIMITS } from './constants'

// Username validation (lowercase alphanumeric + underscore, 3-30 chars)
export const usernameSchema = z
  .string()
  .min(LIMITS.USERNAME_MIN_LENGTH, 'Username must be at least 3 characters')
  .max(LIMITS.USERNAME_MAX_LENGTH, 'Username must be at most 30 characters')
  .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores')

// Profile validation
export const profileSchema = z.object({
  username: usernameSchema,
  display_name: z
    .string()
    .min(1, 'Display name is required')
    .max(LIMITS.DISPLAY_NAME_MAX_LENGTH, `Display name must be at most ${LIMITS.DISPLAY_NAME_MAX_LENGTH} characters`),
  bio: z
    .string()
    .max(LIMITS.BIO_MAX_LENGTH, `Bio must be at most ${LIMITS.BIO_MAX_LENGTH} characters`)
    .optional(),
  avatar_url: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
  theme_id: z.string().optional(),
  is_public: z.boolean().optional(),
})

// Block validation schemas
export const textBlockSchema = z.object({
  type: z.literal('text'),
  content: z.object({
    title: z.string().max(LIMITS.BLOCK_TITLE_MAX_LENGTH),
    body: z.string().max(LIMITS.BLOCK_BODY_MAX_LENGTH).optional(),
  }),
})

export const imageBlockSchema = z.object({
  type: z.literal('image'),
  content: z.object({
    url: z.string().url('Invalid image URL'),
    alt: z.string().optional(),
    link: z.string().url('Invalid link').optional().or(z.literal('')),
  }),
})

export const buttonBlockSchema = z.object({
  type: z.literal('button'),
  content: z.object({
    label: z.string().min(1, 'Button label is required').max(50),
    url: z.string().url('Invalid URL'),
    style: z.enum(['primary', 'secondary', 'outline']).optional(),
  }),
})

export const socialLinksBlockSchema = z.object({
  type: z.literal('social_links'),
  content: z.object({
    links: z.array(
      z.object({
        platform: z.string(),
        url: z.string().url('Invalid URL'),
        handle: z.string().optional(),
      })
    ),
  }),
})

export const embedBlockSchema = z.object({
  type: z.literal('embed'),
  content: z.object({
    url: z.string().url('Invalid embed URL'),
    type: z.enum(['youtube', 'spotify', 'iframe']).optional(),
  }),
})

export const aiChatBlockSchema = z.object({
  type: z.literal('ai_chat'),
  content: z.object({
    greeting: z.string().optional(),
    systemPrompt: z.string().optional(),
    avatarUrl: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
  }),
})

// Combined block schema
export const blockSchema = z.discriminatedUnion('type', [
  textBlockSchema,
  imageBlockSchema,
  buttonBlockSchema,
  socialLinksBlockSchema,
  embedBlockSchema,
  aiChatBlockSchema,
])

// Auth validation
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  username: usernameSchema,
  display_name: z.string().min(1, 'Display name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Helper function to validate username availability
export async function checkUsernameAvailability(
  username: string,
  supabase: any
): Promise<boolean> {
  const { data, error } = await supabase
    .from('users_profile')
    .select('username')
    .eq('username', username.toLowerCase())
    .single()

  return !data && !error
}
