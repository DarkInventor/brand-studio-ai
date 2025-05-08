"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { updateUserProfile } from "@/lib/actions/auth"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/login")
          return
        }

        // Get user profile
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        setUser({
          ...session.user,
          profile,
        })

        if (profile?.avatar_url) {
          setAvatarPreview(profile.avatar_url)
        }
      } catch (error) {
        console.error("Error loading user profile:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [router])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    // Add the avatar file if it exists
    if (avatarFile) {
      formData.set("avatar", avatarFile)
    }

    const result = await updateUserProfile(formData)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
    }

    setIsSubmitting(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (user?.profile?.full_name) {
      return user.profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }
    return user?.email?.substring(0, 2).toUpperCase() || "U"
  }

  return (
    <div className="container mx-auto max-w-3xl py-10 px-4 animate-in fade-in">
      <Card className="w-full shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
          <CardDescription>Update your personal information and profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-500 bg-green-50">
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <form action={handleSubmit} className="space-y-8">
            {/* Avatar Upload Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Profile Picture</h3>
              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarPreview || ""} alt={user?.profile?.full_name || "User"} />
                    <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <Label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                  >
                    <Upload className="h-4 w-4" />
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="flex flex-col space-y-2 text-center sm:text-left">
                  <p className="text-sm font-medium">Upload a new profile picture</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF (max. 2MB)</p>
                </div>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Your full name"
                    className="h-12"
                    defaultValue={user?.profile?.full_name || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email || ""} className="h-12 bg-muted" disabled />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </div>
            </div>

            <Button type="submit" className="ml-auto flex items-center gap-2 h-12 px-6" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
