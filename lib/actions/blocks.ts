

// Block Management Server Actions

import { createServerClient } from '@/lib/supabase/server'
import { blockSchema } from '@/lib/utils/validators'
import { revalidatePath } from 'next/cache'
import type { BlockType } from '@/types/database.types'

export async function getUserBlocks(userId: string) {
  const supabase = await createServerClient()

  const { data: blocks, error } = await supabase
    .from('blocks')
    .select('*')
    .eq('user_id', userId)
    .eq('is_visible', true)
    .order('order_index', { ascending: true })

  if (error) {
    return []
  }

  return blocks
}

// Simpler version that accepts direct parameters
export async function createBlockSimple(type: string, content: any) {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  try {
    // Get max order_index
    const { data: existingBlocks } = await supabase
      .from('blocks')
      .select('order_index')
      .eq('user_id', user.id)
      .order('order_index', { ascending: false })
      .limit(1)

    const nextOrderIndex = existingBlocks && existingBlocks[0] 
      ? existingBlocks[0].order_index + 1 
      : 0

    // Insert block
    const { data: newBlock, error } = await supabase
      .from('blocks')
      .insert({
        user_id: user.id,
        type,
        content,
        order_index: nextOrderIndex,
        is_visible: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Block creation error:', error)
      return { error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath(`/dashboard/blocks`)
    
    return { success: true, block: newBlock }
  } catch (error: any) {
    console.error('Block creation error:', error)
    return { error: error.message || 'Failed to create block' }
  }
}

export async function createBlock(formData: FormData) {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const type = formData.get('type') as BlockType
  const content = JSON.parse(formData.get('content') as string)

  // Validate block data
  const validation = blockSchema.safeParse({ type, content })
  if (!validation.success) {
    return {
      error: validation.error.errors[0].message,
    }
  }

  // Get max order_index
  const { data: existingBlocks } = await supabase
    .from('blocks')
    .select('order_index')
    .eq('user_id', user.id)
    .order('order_index', { ascending: false })
    .limit(1)

  const nextOrderIndex = existingBlocks && existingBlocks[0] 
    ? existingBlocks[0].order_index + 1 
    : 0

  // Insert block
  const { data: newBlock, error } = await supabase
    .from('blocks')
    .insert({
      user_id: user.id,
      type,
      content,
      order_index: nextOrderIndex,
      is_visible: true,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  
  return { success: true, block: newBlock }
}

export async function updateBlock(blockId: string, formData: FormData) {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const content = JSON.parse(formData.get('content') as string)
  const is_visible = formData.get('is_visible') === 'true'

  // Update block
  const { error } = await supabase
    .from('blocks')
    .update({
      content,
      is_visible,
    })
    .eq('id', blockId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  
  return { success: true }
}

export async function deleteBlock(blockId: string) {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('blocks')
    .delete()
    .eq('id', blockId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  
  return { success: true }
}

export async function reorderBlocks(blockIds: string[]) {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Update order_index for each block
  const updates = blockIds.map((id, index) => 
    supabase
      .from('blocks')
      .update({ order_index: index })
      .eq('id', id)
      .eq('user_id', user.id)
  )

  await Promise.all(updates)

  revalidatePath('/dashboard')
  
  return { success: true }
}

export async function uploadBlockImage(formData: FormData) {
  const supabase = await createServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const file = formData.get('file') as File
  if (!file) {
    return { error: 'No file provided' }
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: 'File too large (max 5MB)' }
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return { error: 'File must be an image' }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('block-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    return { error: uploadError.message }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('block-images')
    .getPublicUrl(fileName)

  return { success: true, url: publicUrl }
}
