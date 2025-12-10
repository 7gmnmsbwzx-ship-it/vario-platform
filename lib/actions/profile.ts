'use server'

// Profile Management Actions

import { createServerClient } from '@/lib/supabase/server'
import { profileSchema } from '@/lib/utils/validators'
import { revalidatePath } from 'next/cache'

// Get current user's profile
export async function getProfile() {
  const supabase = await createServerClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('users_profile')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { error: 'Profile not found' }
  }

  return { data: profile }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const rawFormData = {
    username: formData.get('username') as string,
    display_name: formData.get('display_name') as string,
    bio: formData.get('bio') as string || '',
    avatar_url: formData.get('avatar_url') as string || '',
    theme_id: formData.get('theme_id') as string || 'minimal',
    is_public: formData.get('is_public') === 'true',
  }

  // Validate input
  const validation = profileSchema.safeParse(rawFormData)
  if (!validation.success) {
    return {
      error: validation.error.errors[0].message,
    }
  }

  // Check username availability (if changed)
  const { data: currentProfile } = await supabase
    .from('users_profile')
    .select('username')
    .eq('id', user.id)
    .single()

  if (currentProfile && currentProfile.username !== validation.data.username) {
    const { data: existingUser } = await supabase
      .from('users_profile')
      .select('username')
      .eq('username', validation.data.username.toLowerCase())
      .single()

    if (existingUser) {
      return { error: 'Username already taken' }
    }
  }

  // Update profile
  const { error } = await supabase
    .from('users_profile')
    .update({
      ...validation.data,
      username: validation.data.username.toLowerCase(),
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/${validation.data.username}`)
  
  return { success: true }
}

export async function getUserProfile(username: string) {
  const supabase = await createServerClient()

  const { data: profile, error } = await supabase
    .from('users_profile')
    .select('*')
    .eq('username', username.toLowerCase())
    .eq('is_public', true)
    .single()

  if (error || !profile) {
    return null
  }

  return profile
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const file = formData.get('file') as File
  if (!file) {
    return { error: 'No file provided' }
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { error: 'File too large (max 2MB)' }
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return { error: 'File must be an image' }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (uploadError) {
    return { error: uploadError.message }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  // Update profile with new avatar URL
  const { error: updateError } = await supabase
    .from('users_profile')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  if (updateError) {
    return { error: updateError.message }
  }

  revalidatePath('/dashboard')
  
  return { success: true, url: publicUrl }
}
