"use server"

import { createActionClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./auth"

export async function createBrandKit(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to create a brand kit" }
  }

  const supabase = createActionClient()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const primaryColor = formData.get("primaryColor") as string
  const secondaryColor = formData.get("secondaryColor") as string
  const brandTone = formData.get("brandTone") as string

  // Handle logo upload if present
  let logoUrl = null
  const logoFile = formData.get("logo") as File

  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split(".").pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("brand-logos")
      .upload(fileName, logoFile)

    if (uploadError) {
      return { error: "Error uploading logo: " + uploadError.message }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("brand-logos").getPublicUrl(fileName)

    logoUrl = publicUrl
  }

  const { data, error } = await supabase
    .from("brand_kits")
    .insert({
      user_id: user.id,
      name,
      description,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      brand_tone: brandTone,
      logo_url: logoUrl,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/brand-kit")
  revalidatePath("/dashboard")

  return { success: "Brand kit created successfully!", data }
}

export async function getBrandKits() {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  const supabase = createActionClient()

  const { data, error } = await supabase
    .from("brand_kits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching brand kits:", error)
    return []
  }

  return data
}

export async function getBrandKit(id: string) {
  const supabase = createActionClient()

  const { data, error } = await supabase.from("brand_kits").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching brand kit:", error)
    return null
  }

  return data
}

export async function updateBrandKit(id: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to update a brand kit" }
  }

  const supabase = createActionClient()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const primaryColor = formData.get("primaryColor") as string
  const secondaryColor = formData.get("secondaryColor") as string
  const brandTone = formData.get("brandTone") as string

  // Handle logo upload if present
  let logoUrl = null
  const logoFile = formData.get("logo") as File

  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split(".").pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("brand-logos")
      .upload(fileName, logoFile)

    if (uploadError) {
      return { error: "Error uploading logo: " + uploadError.message }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("brand-logos").getPublicUrl(fileName)

    logoUrl = publicUrl
  }

  const updateData: any = {
    name,
    description,
    primary_color: primaryColor,
    secondary_color: secondaryColor,
    brand_tone: brandTone,
  }

  if (logoUrl) {
    updateData.logo_url = logoUrl
  }

  const { data, error } = await supabase
    .from("brand_kits")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/brand-kit")
  revalidatePath("/dashboard")

  return { success: "Brand kit updated successfully!", data }
}

export async function deleteBrandKit(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to delete a brand kit" }
  }

  const supabase = createActionClient()

  const { error } = await supabase.from("brand_kits").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/brand-kit")
  revalidatePath("/dashboard")

  return { success: "Brand kit deleted successfully!" }
}
