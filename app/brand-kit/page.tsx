"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Loader2, Palette, PenLine, ImageIcon, Plus, Check, X, Edit3, ChevronRight } from "lucide-react"
import { createBrandKit, getBrandKits, updateBrandKit, deleteBrandKit } from "@/lib/actions/brand-kits"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { useRouter as useNavigationRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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
  const [activeTab, setActiveTab] = useState("existing")
  const [isDeleting, setIsDeleting] = useState(false)

  const MAX_LOGO_SIZE_MB = 4;

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
      setActiveTab("existing")
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
      const file = e.target.files[0];
      if (file.size > MAX_LOGO_SIZE_MB * 1024 * 1024) {
        setError(`Logo file must be less than ${MAX_LOGO_SIZE_MB}MB`);
        setLogoFile(null);
        setLogoPreview(null);
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setError(null);
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
      setActiveTab("existing")
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

  async function handleDelete() {
    if (!selectedBrandKitId) return;
    if (!window.confirm("Are you sure you want to delete this brand kit? This cannot be undone.")) return;
    setIsDeleting(true);
    setError(null);
    const result = await deleteBrandKit(selectedBrandKitId);
    if (result?.error) {
      setError(result.error);
      setIsDeleting(false);
    } else {
      // Remove from local state
      const kitsRaw = await getBrandKits();
      const kits = (kitsRaw || []).filter((k: any) => k && typeof k === 'object' && typeof k.id === 'string' && typeof k.name === 'string');
      setBrandKits(kits);
      if (kits.length > 0) {
        setSelectedBrandKitId(kits[0].id);
      } else {
        setSelectedBrandKitId("");
        setActiveTab("create");
      }
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your brand kits...</p>
        </div>
      </div>
    )
  }

  const filteredBrandKits = brandKits.filter(
    (k: any) => k && typeof k === "object" && typeof k.id === "string" && typeof k.name === "string",
  )

  return (
    <div className="container mx-auto max-w-4xl py-10 px-4 animate-in fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Brand Kit Manager</h1>
        <p className="text-muted-foreground">Create and manage your brand identity for consistent content generation</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            {filteredBrandKits.length > 0 && (
              <TabsTrigger value="existing" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Existing Brand Kits
              </TabsTrigger>
            )}
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Brand Kit
            </TabsTrigger>
          </TabsList>
        </div>

        {filteredBrandKits.length > 0 && (
          <TabsContent value="existing" className="mt-0 space-y-6">
            <Card className="w-full shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Your Brand Kits</CardTitle>
                <CardDescription>Select a brand kit to view or edit its details</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6 animate-in slide-in-from-top-5 duration-300">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="mb-6">
                  <Label htmlFor="brand-kit-select" className="text-sm font-medium mb-1.5 block">
                    Select Brand Kit
                  </Label>
                  <Select value={selectedBrandKitId} onValueChange={setSelectedBrandKitId}>
                    <SelectTrigger id="brand-kit-select" className="h-10">
                      <SelectValue placeholder="Select a brand kit" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredBrandKits.map((kit) => (
                        <SelectItem key={kit.id} value={kit.id}>
                          {kit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedBrandKitId && filteredBrandKits.length > 0 && !isEditing && (
                  <Card className="border bg-card overflow-hidden">
                    {(() => {
                      const kit = filteredBrandKits.find(
                        (k: any) =>
                          k && typeof k === "object" && typeof k.id === "string" && k.id === selectedBrandKitId,
                      )
                      if (!kit) return null
                      return (
                        <>
                          <div
                            className="relative h-32 bg-gradient-to-r overflow-hidden"
                            style={{
                              backgroundImage: `linear-gradient(to right, ${kit.primary_color || "#7C3AED"}, ${kit.secondary_color || "#0EA5E9"})`,
                            }}
                          >
                            {kit.logo_url && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white/90 rounded-full p-2 shadow-lg">
                                  <img
                                    src={kit.logo_url || "/placeholder.svg"}
                                    alt="Brand Logo"
                                    className="h-16 w-16 object-contain"
                                  />
                                </div>
                              </div>
                            )}
                            <Button
                              size="sm"
                              variant="secondary"
                              className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white"
                              onClick={() => setIsEditing(true)}
                            >
                              <Edit3 className="h-4 w-4" />
                              <span className="sr-only">Edit Brand Kit</span>
                            </Button>
                          </div>

                          <div className="p-6">
                            <div className="mb-4">
                              <h3 className="text-xl font-bold mb-1">{kit.name}</h3>
                              <p className="text-muted-foreground">{kit.description}</p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-3">
                                <h4 className="text-sm font-medium">Brand Colors</h4>
                                <div className="flex gap-3">
                                  <div className="flex flex-col items-center">
                                    <div
                                      className="h-12 w-12 rounded-md border shadow-sm mb-1"
                                      style={{ backgroundColor: kit.primary_color }}
                                    ></div>
                                    <span className="text-xs">{kit.primary_color}</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div
                                      className="h-12 w-12 rounded-md border shadow-sm mb-1"
                                      style={{ backgroundColor: kit.secondary_color }}
                                    ></div>
                                    <span className="text-xs">{kit.secondary_color}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h4 className="text-sm font-medium">Brand Tone</h4>
                                <Badge variant="outline" className="text-xs font-normal">
                                  {kit.brand_tone || "Not specified"}
                                </Badge>
                              </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-2">
                              <Button variant="default" size="sm" className="gap-2" onClick={() => setIsEditing(true)}>
                                <PenLine className="h-4 w-4" />
                                Edit Brand Kit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="gap-2"
                                onClick={handleDelete}
                                disabled={isDeleting}
                              >
                                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                                Delete
                              </Button>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </Card>
                )}

                {isEditing && (
                  <form action={handleUpdate} className="space-y-8 animate-in fade-in">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <PenLine className="h-5 w-5 text-primary" />
                          Edit Brand Kit
                        </h3>
                        <Separator />
                      </div>

                      {/* Brand Details Section */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Brand Details
                        </h4>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Brand Name</Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="Enter your brand name"
                              className="h-10"
                              required
                              value={brandName}
                              onChange={(e) => setBrandName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="brandTone">Brand Tone</Label>
                            <Input
                              id="brandTone"
                              name="brandTone"
                              className="h-10"
                              value={brandTone}
                              onChange={(e) => setBrandTone(e.target.value)}
                              placeholder="Professional, Casual, Friendly, etc."
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Brand Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe your brand in a few sentences"
                            rows={3}
                            className="min-h-[100px] resize-none"
                            value={brandDescription}
                            onChange={(e) => setBrandDescription(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Logo Upload Section */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Brand Logo
                        </h4>
                        <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl border border-dashed p-6">
                          <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-muted/50 transition-all hover:bg-muted/80">
                            {logoPreview ? (
                              <img
                                src={logoPreview || "/placeholder.svg"}
                                alt="Logo preview"
                                className="h-full w-full object-contain p-2"
                              />
                            ) : (
                              <ImageIcon className="h-10 w-10 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex flex-col space-y-2 text-center sm:text-left">
                            <div className="space-y-1">
                              <h5 className="text-sm font-medium">Upload Logo</h5>
                              <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 2MB)</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="relative"
                                onClick={() => document.getElementById("logo-upload")?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Browse Files
                                <Input
                                  id="logo-upload"
                                  type="file"
                                  accept="image/*"
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                  onChange={handleLogoChange}
                                />
                              </Button>
                              {logoPreview && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setLogoPreview(null)
                                    setLogoFile(null)
                                  }}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Brand Colors Section */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Brand Colors
                        </h4>
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="primary-color">Primary Color</Label>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-10 w-10 rounded-md border shadow-sm"
                                style={{ backgroundColor: primaryColor }}
                              ></div>
                              <Input
                                id="primary-color"
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="h-10 w-full"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="secondary-color">Secondary Color</Label>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-10 w-10 rounded-md border shadow-sm"
                                style={{ backgroundColor: secondaryColor }}
                              ></div>
                              <Input
                                id="secondary-color"
                                type="color"
                                value={secondaryColor}
                                onChange={(e) => setSecondaryColor(e.target.value)}
                                className="h-10 w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex items-center gap-2" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="create" className="mt-0">
          <Card className="w-full shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Create New Brand Kit</CardTitle>
              <CardDescription>Define your brand identity for consistent content generation</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6 animate-in slide-in-from-top-5 duration-300">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form action={handleSubmit} className="space-y-8">
                {/* Brand Details Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Brand Details</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="create-name">Brand Name</Label>
                      <Input
                        id="create-name"
                        name="name"
                        placeholder="Enter your brand name"
                        className="h-10"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-tone">Brand Tone</Label>
                      <Select name="brandTone">
                        <SelectTrigger id="create-tone" className="h-10">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="humorous">Humorous</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="inspirational">Inspirational</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-description">Brand Description</Label>
                    <Textarea
                      id="create-description"
                      name="description"
                      placeholder="Describe your brand in a few sentences"
                      rows={3}
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                </div>

                {/* Logo Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Brand Logo</h3>
                  <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl border border-dashed p-6">
                    <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-muted/50 transition-all hover:bg-muted/80">
                      {logoPreview ? (
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex flex-col space-y-2 text-center sm:text-left">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Upload Logo</h4>
                        <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 2MB)</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="relative"
                          onClick={() => document.getElementById("create-logo-upload")?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Browse Files
                          <Input
                            id="create-logo-upload"
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleLogoChange}
                          />
                        </Button>
                        {logoPreview && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setLogoPreview(null)
                              setLogoFile(null)
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brand Colors Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Brand Colors</h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="create-primary-color">Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-10 w-10 rounded-md border shadow-sm"
                          style={{ backgroundColor: primaryColor }}
                        ></div>
                        <Input
                          id="create-primary-color"
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="h-10 w-full"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-secondary-color">Secondary Color</Label>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-10 w-10 rounded-md border shadow-sm"
                          style={{ backgroundColor: secondaryColor }}
                        ></div>
                        <Input
                          id="create-secondary-color"
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="h-10 w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <CardFooter className="flex justify-end px-0 pt-4">
                  <Button type="submit" className="flex items-center gap-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Brand Kit
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
