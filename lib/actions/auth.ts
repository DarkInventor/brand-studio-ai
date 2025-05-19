"use server"

import { createActionClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { uploadToR2 } from "@/lib/r2"

export async function signUp(formData: FormData) {
  const supabase = createActionClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Ensure profile fields are set after signup
  if (data?.user) {
    const { id } = data.user
    // Always upsert the profile to ensure it exists
    await supabase.from("profiles").upsert({
      id,
      email: email ?? null,
      full_name: fullName ?? null,
    })
  }

  return { success: "Check your email to confirm your account!" }
}

export async function signIn(formData: FormData) {
  try {
    const supabase = createActionClient()

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Sign-in error:", error.message)
      return { error: error.message }
    }

    // Ensure profile fields are set after login
    if (data?.user) {
      const { id, user_metadata } = data.user
      const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", id).single()
      if (!profileError && profile) {
        const updates: any = {}
        if (!profile.email && email) updates.email = email
        if (!profile.full_name && user_metadata?.full_name) updates.full_name = user_metadata.full_name
        if (Object.keys(updates).length > 0) {
          await supabase.from("profiles").update(updates).eq("id", id)
        }
      }
    }

    revalidatePath("/")
    redirect("/dashboard")
  } catch (error) {
    console.error("Unexpected error during sign-in:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const supabase = createActionClient()
  await supabase.auth.signOut()
  revalidatePath("/")
  redirect("/")
}

export async function getCurrentUser() {
  try {
    const supabase = createActionClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    return {
      ...user,
      profile,
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Add these new functions for social login

export async function signInWithGoogle() {
  try {
    const supabase = createActionClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { url: data.url }
  } catch (error) {
    console.error("Error with Google sign-in:", error)
    return { error: "An unexpected error occurred with Google sign-in." }
  }
}

export async function signInWithFacebook() {
  try {
    const supabase = createActionClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { url: data.url }
  } catch (error) {
    console.error("Error with Facebook sign-in:", error)
    return { error: "An unexpected error occurred with Facebook sign-in." }
  }
}

export async function signInWithInstagram() {
  const supabase = createActionClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/instagram/callback`,
      scopes: "instagram_basic,pages_show_list,pages_read_engagement,instagram_content_publish"
    },
  });
  if (error) {
    return { error: error.message };
  }
  return { url: data.url };
}

export async function updateUserProfile(formData: FormData) {
  try {
    const supabase = createActionClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "User not authenticated" }
    }

    const fullName = formData.get("fullName") as string
    const avatarFile = formData.get("avatar") as File

    let avatarUrl = null

    // Upload avatar file to R2 if provided
    if (avatarFile && avatarFile.size > 0) {
      try {
        const buffer = Buffer.from(await avatarFile.arrayBuffer())
        avatarUrl = await uploadToR2(buffer, avatarFile.type, `avatars/${user.id}`)
      } catch (err) {
        return { error: "Error uploading avatar to R2: " + (err instanceof Error ? err.message : String(err)) }
      }
    }

    // Update profile
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        ...(avatarUrl && { avatar_url: avatarUrl }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/dashboard")
    revalidatePath("/profile")

    return { success: "Profile updated successfully!" }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { error: "An unexpected error occurred while updating your profile." }
  }
}
