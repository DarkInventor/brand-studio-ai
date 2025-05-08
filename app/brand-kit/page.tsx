"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ArrowRight, Loader2 } from "lucide-react"
import { createBrandKit, getBrandKits, updateBrandKit } from "@/lib/actions/brand-kits"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { useRouter as useNavigationRouter } from "next/navigation"

export default function BrandKitForm() {
  const router = useRouter()
  const navigationRouter = useNavigationRouter()
  const [primaryColor, setPrimaryColor] = useState("#7C3AED")
  const [secondaryColor, setSecondaryColor] = useState("#0EA5E9")
  const [brandTone, setBrandTone] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [brandKits, setBrandKits] = useState<any[]>([])
  const [selectedBrandKitId, setSelectedBrandKitId] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)
  const [brandName, setBrandName] = useState("")
  const [brandDescription, setBrandDescription] = useState("")

  useEffect(() => {
    async function checkAuthAndLoadKits() {
      setIsLoading(true)
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        navigationRouter.push("/login")
        return
      }
      setIsAuthenticated(true)
      // Fetch brand kits
      const kitsRaw = await getBrandKits()
      const kits = (kitsRaw || []).filter((k: any) => k && typeof k === 'object' && typeof k.id === 'string' && typeof k.name === 'string')
      setBrandKits(kits)
      if (kits.length > 0 && (kits[0] as any) && typeof (kits[0] as any).id === 'string') setSelectedBrandKitId((kits[0] as any).id)
      setIsLoading(false)
    }
    checkAuthAndLoadKits()
  }, [navigationRouter])

  useEffect(() => {
    if (!selectedBrandKitId) return;
    const kit = brandKits.find((k: any) => k && typeof k === 'object' && typeof k.id === 'string' && k.id === selectedBrandKitId)
    if (!kit) return;
    setPrimaryColor(kit.primary_color || "#7C3AED")
    setSecondaryColor(kit.secondary_color || "#0EA5E9")
    setBrandTone(kit.brand_tone || "")
    setLogoPreview(kit.logo_url || null)
    setBrandName(kit.name || "")
    setBrandDescription(kit.description || "")
    setLogoFile(null)
    setIsEditing(false)
  }, [selectedBrandKitId])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)
    formData.append("primaryColor", primaryColor)
    formData.append("secondaryColor", secondaryColor)
    formData.append("brandTone", brandTone)
    if (logoFile) {
      formData.set("logo", logoFile)
    }
    const result = await createBrandKit(formData)
    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      // Fetch all kits and select the new one
      const kitsRaw = await getBrandKits()
      const kits = (kitsRaw || []).filter((k: any) => k && typeof k === 'object' && typeof k.id === 'string' && typeof k.name === 'string')
      setBrandKits(kits)
      if (result.data && typeof (result.data as any).id === 'string') setSelectedBrandKitId((result.data as any).id)
      setIsSubmitting(false)
    }
  }

  async function handleUpdate(formData: FormData) {
    setIsSubmitting(true)
    setError(null)
    formData.append("primaryColor", primaryColor)
    formData.append("secondaryColor", secondaryColor)
    formData.append("brandTone", brandTone)
    if (logoFile) {
      formData.set("logo", logoFile)
    }
    const result = await updateBrandKit(selectedBrandKitId, formData)
    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      // Refresh kits and show updated info
      const kitsRaw = await getBrandKits()
      const kits = (kitsRaw || []).filter((k: any) => k && typeof k === 'object' && typeof k.id === 'string' && typeof k.name === 'string')
      setBrandKits(kits)
      setIsEditing(false)
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl py-10 px-4 animate-in fade-in">
      <Card className="w-full shadow-lg">
        <CardHeader className="space-y-1 pb-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Step 1 of 3</div>
            <div className="h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/3 rounded-full bg-primary"></div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Upload Your Brand Kit</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {brandKits.filter((k: any) => k && typeof k === 'object' && typeof k.id === 'string' && typeof k.name === 'string').length > 0 && (
            <div className="mb-6">
              <Label htmlFor="brand-kit-select">Select Brand Kit</Label>
              <Select value={selectedBrandKitId} onValueChange={setSelectedBrandKitId}>
                <SelectTrigger id="brand-kit-select" className="h-12">
                  <SelectValue placeholder="Select a brand kit" />
                </SelectTrigger>
                <SelectContent>
                  {brandKits.filter((k: any) => k && typeof k === 'object' && typeof k.id === 'string' && typeof k.name === 'string').map((kit) => (
                    <SelectItem key={kit.id} value={kit.id}>{kit.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedBrandKitId && brandKits.filter((k: any) => k && typeof k === 'object' && typeof k.id === 'string' && typeof k.name === 'string').length > 0 && !isEditing && (
            <div className="mb-8 p-4 border rounded-lg bg-muted">
              {(() => {
                const kit = brandKits.find((k: any) => k && typeof k === 'object' && typeof k.id === 'string' && k.id === selectedBrandKitId)
                if (!kit) return null
                return (
                  <>
                    <div className="flex items-center gap-4 mb-2">
                      {kit.logo_url && <img src={kit.logo_url} alt="Brand Logo" className="h-12 w-12 object-contain rounded" />}
                      <div>
                        <div className="font-bold text-lg">{kit.name}</div>
                        <div className="text-sm text-muted-foreground">{kit.description}</div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div>Primary: <span style={{ color: kit.primary_color }}>{kit.primary_color}</span></div>
                      <div>Secondary: <span style={{ color: kit.secondary_color }}>{kit.secondary_color}</span></div>
                      <div>Tone: {kit.brand_tone}</div>
                    </div>
                  </>
                )
              })()}
            </div>
          )}

          {isEditing && (
            <form action={handleUpdate} className="space-y-8">
              {/* Logo Upload Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Brand Logo</h3>
                <div className="flex flex-col items-center justify-center gap-6 rounded-xl border border-dashed p-8 sm:flex-row">
                  <div className="flex h-40 w-40 items-center justify-center rounded-xl bg-muted transition-all hover:bg-muted/80">
                    {logoPreview ? (
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo preview"
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <Upload className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col space-y-2 text-center sm:text-left">
                    <Label htmlFor="logo-upload" className="cursor-pointer text-primary hover:underline">
                      Click to upload
                    </Label>
                    <Input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                    <p className="text-sm text-muted-foreground">SVG, PNG, JPG or GIF (max. 2MB)</p>
                  </div>
                </div>
              </div>

              {/* Brand Colors Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Brand Colors</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-12 w-12 rounded-lg border shadow-sm"
                        style={{ backgroundColor: primaryColor }}
                      ></div>
                      <Input
                        id="primary-color"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-12 w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-12 w-12 rounded-lg border shadow-sm"
                        style={{ backgroundColor: secondaryColor }}
                      ></div>
                      <Input
                        id="secondary-color"
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="h-12 w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Details Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Brand Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Brand Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your brand name"
                      className="h-12"
                      required
                      value={brandName}
                      onChange={e => setBrandName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Brand Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your brand in a few sentences"
                      rows={3}
                      className="min-h-[120px] resize-none"
                      value={brandDescription}
                      onChange={e => setBrandDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brandTone">Brand Tone</Label>
                    <Input
                      id="brandTone"
                      name="brandTone"
                      className="h-12"
                      value={brandTone}
                      onChange={e => setBrandTone(e.target.value)}
                      placeholder="Brand tone"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" className="flex items-center gap-2 h-12 px-6" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
