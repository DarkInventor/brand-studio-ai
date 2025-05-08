"use server"

import { createActionClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signUp(formData: FormData) {
  const supabase = createActionClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string

  const { error } = await supabase.auth.signUp({
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

  return { success: "Check your email to confirm your account!" }
}

export async function signIn(formData: FormData) {
  try {
    const supabase = createActionClient()

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Sign-in error:", error.message)
      return { error: error.message }
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

export async function signInWithGitHub() {
  try {
    const supabase = createActionClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { url: data.url }
  } catch (error) {
    console.error("Error with GitHub sign-in:", error)
    return { error: "An unexpected error occurred with GitHub sign-in." }
  }
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

    // Upload avatar if provided
    if (avatarFile && avatarFile.size > 0) {
      const fileExt = avatarFile.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, avatarFile)

      if (uploadError) {
        return { error: "Error uploading avatar: " + uploadError.message }
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName)

      avatarUrl = publicUrl
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
