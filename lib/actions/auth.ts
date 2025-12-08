// Authentication Actions
// Handle user sign up, sign in, sign out
// Compatible with Edge Runtime

import { createServerClient } from '@/lib/supabase/server'
import { signUpSchema, signInSchema } from '@/lib/utils/validators'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signUp(
  email: string,
  password: string,
  username: string,
  displayName: string
) {
  try {
    // Convert username to lowercase for storage
    const normalizedUsername = username.toLowerCase()

    // Validate input
    const rawFormData = {
      email,
      password,
      confirmPassword: password,
      username: normalizedUsername,
      display_name: displayName,
    }

    const validation = signUpSchema.safeParse(rawFormData)
    if (!validation.success) {
      return {
        error: validation.error.errors[0].message,
      }
    }

    const supabase = createServerClient()

    // Check username availability (using anon key is fine for SELECT)
    const { data: existingUser, error: checkError } = await supabase
      .from('users_profile')
      .select('username')
      .eq('username', normalizedUsername)
      .maybeSingle()

    // If we got data, username exists
    if (existingUser) {
      return { error: 'Username already taken' }
    }

    // IMPORTANT: Use admin client for signup to avoid email confirmation issues
    const { createAdminClient } = await import('@/lib/supabase/server')
    const adminClient = createAdminClient()

    // Create user using admin client (bypasses email confirmation)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        username: normalizedUsername,
        display_name: displayName,
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: 'Failed to create user account' }
    }

    console.log('User created:', authData.user.id)

    // Create profile in users_profile table
    const { error: profileError } = await adminClient.from('users_profile').insert([{
      id: authData.user.id,
      username: normalizedUsername,
      display_name: displayName,
      theme_id: 'minimal',
      is_public: true,
    }] as any)

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Clean up: delete the auth user if profile creation fails
      await adminClient.auth.admin.deleteUser(authData.user.id)
      return { error: `Failed to create profile: ${profileError.message}` }
    }

    console.log('Profile created successfully')

    // Sign the user in to create a session
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      console.error('Auto sign-in error:', signInError)
      // Profile is created, user can sign in manually
      return { 
        success: true, 
        message: 'Account created successfully! Please sign in.',
        redirect: '/login'
      }
    }

    if (!sessionData.session) {
      return {
        success: true,
        message: 'Account created! Please sign in.',
        redirect: '/login'
      }
    }

    console.log('User signed in successfully')
    
    // Return success without redirecting - let the client handle it
    return { 
      success: true,
      redirect: '/dashboard'
    }
  } catch (error: any) {
    console.error('Signup error:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const rawFormData = {
      email,
      password,
    }

    // Validate input
    const validation = signInSchema.safeParse(rawFormData)
    if (!validation.success) {
      return {
        error: validation.error.errors[0].message,
      }
    }

    // Use validated data
    const validatedData = validation.data

    const supabase = createServerClient()

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (authError) {
      console.error('Sign in error:', authError)
      return { error: authError.message }
    }

    if (!data.session) {
      return { error: 'Failed to create session' }
    }

    console.log('Sign in successful')

    // Return success and let client handle redirect
    return { 
      success: true,
      redirect: '/dashboard'
    }
  } catch (error: any) {
    console.error('Sign in error:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
}

export async function signOut() {
  const supabase = createServerClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function getCurrentUser() {
  const supabase = createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('users_profile')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    ...user,
    profile,
  }
}
