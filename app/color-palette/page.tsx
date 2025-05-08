"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Info, Palette, Paintbrush, Layers, Sliders, Sparkles, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function ColorPalette() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-10 space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">BrandStudio AI Color Palette</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground">
          A modern, professional color scheme that balances creativity with tech-savvy aesthetics
        </p>
        <div className="flex justify-center pt-4">
          <ThemeToggle />
        </div>
      </div>

      <Tabs defaultValue="palette" className="mx-auto max-w-4xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="palette">
            <Palette className="mr-2 h-4 w-4" />
            Color Palette
          </TabsTrigger>
          <TabsTrigger value="components">
            <Layers className="mr-2 h-4 w-4" />
            UI Components
          </TabsTrigger>
          <TabsTrigger value="usage">
            <Sliders className="mr-2 h-4 w-4" />
            Usage Guidelines
          </TabsTrigger>
        </TabsList>

        <TabsContent value="palette" className="mt-6 space-y-8">
          {/* Primary Colors */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Primary Colors</h2>
              <Badge variant="outline">Brand Identity</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              The primary purple represents creativity, innovation, and the tech-forward nature of BrandStudio AI.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ColorCard
                name="Primary"
                hex="#7C3AED"
                cssVar="hsl(var(--primary))"
                description="Main brand color for headers, primary buttons, and key UI elements"
              />
              <ColorCard
                name="Secondary"
                hex="#0EA5E9"
                cssVar="hsl(var(--secondary))"
                description="For CTAs, links, and interactive elements that need to stand out"
              />
            </div>
          </div>

          <Separator />

          {/* Neutral Colors */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Neutral Colors</h2>
              <Badge variant="outline">Structure & Text</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              These neutral tones provide structure and readability throughout the interface.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <ColorCard
                name="Background"
                cssVar="hsl(var(--background))"
                description="Main background color"
                dynamicColor={true}
              />
              <ColorCard
                name="Muted"
                cssVar="hsl(var(--muted))"
                description="Secondary background"
                dynamicColor={true}
              />
              <ColorCard
                name="Border"
                cssVar="hsl(var(--border))"
                description="Dividers and borders"
                dynamicColor={true}
              />
              <ColorCard
                name="Foreground"
                cssVar="hsl(var(--foreground))"
                description="Primary text color"
                dynamicColor={true}
              />
            </div>
          </div>

          <Separator />

          {/* Accent & Feedback Colors */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Accent & Feedback Colors</h2>
              <Badge variant="outline">Interaction & Status</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              These colors provide visual feedback and highlight important interface elements.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <ColorCard
                name="Accent"
                hex="#818CF8"
                cssVar="hsl(var(--accent))"
                description="Subtle highlights, icons, and hover states"
              />
              <ColorCard
                name="Success"
                hex="#10B981"
                cssVar="hsl(var(--success))"
                description="Positive actions and confirmations"
              />
              <ColorCard
                name="Warning"
                hex="#F59E0B"
                cssVar="hsl(var(--warning))"
                description="Cautionary messages and alerts"
              />
              <ColorCard
                name="Destructive"
                hex="#EF4444"
                cssVar="hsl(var(--destructive))"
                description="Errors and destructive actions"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="components" className="mt-6 space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Primary and secondary action buttons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="destructive">Destructive</Button>
                  <Button className="bg-[hsl(var(--warning))] text-white hover:bg-[hsl(var(--warning))/90]">
                    Warning
                  </Button>
                  <Button className="bg-[hsl(var(--success))] text-white hover:bg-[hsl(var(--success))/90]">
                    Success
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Form Elements */}
            <Card>
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
                <CardDescription>Input fields and form controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Enter your email" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button className="mt-2">Submit</Button>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Notification and feedback messages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>This is an informational message.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>Something went wrong. Please try again.</AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Status indicators and labels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Error</Badge>
                  <Badge className="bg-[hsl(var(--warning))]">Warning</Badge>
                  <Badge className="bg-[hsl(var(--success))]">Success</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Paintbrush className="h-5 w-5 text-primary" />
                <CardTitle>Color Usage Guidelines</CardTitle>
              </div>
              <CardDescription>
                Best practices for implementing the color palette across the BrandStudio AI interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Primary Color (Purple)</h3>
                <ul className="list-disc pl-5 text-sm">
                  <li>Use for main navigation, headers, and primary action buttons</li>
                  <li>Apply to brand elements like logos and key illustrations</li>
                  <li>Use sparingly to maintain visual hierarchy and impact</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Secondary Color (Teal)</h3>
                <ul className="list-disc pl-5 text-sm">
                  <li>Use for call-to-action buttons, links, and interactive elements</li>
                  <li>Apply to progress indicators and selection states</li>
                  <li>Pair with primary color for visual contrast in important UI elements</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Neutral Colors</h3>
                <ul className="list-disc pl-5 text-sm">
                  <li>Use background color for main surfaces and cards</li>
                  <li>Use muted color for secondary backgrounds and hover states</li>
                  <li>Use foreground color for primary text to ensure readability</li>
                  <li>Use muted-foreground for secondary text and less important information</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Accent & Feedback Colors</h3>
                <ul className="list-disc pl-5 text-sm">
                  <li>Use accent indigo for subtle highlights, icons, and hover effects</li>
                  <li>Use success green for positive confirmations and completed states</li>
                  <li>Use warning amber for notifications and cautionary messages</li>
                  <li>Use destructive red for error messages and destructive actions</li>
                </ul>
              </div>

              <Alert className="border-accent bg-accent/10">
                <Sparkles className="h-4 w-4 text-accent" />
                <AlertTitle>Accessibility Tip</AlertTitle>
                <AlertDescription>
                  Ensure text has sufficient contrast against backgrounds. For text on colored backgrounds, aim for a
                  contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                These guidelines help maintain visual consistency across the BrandStudio AI platform.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ColorCard({ name, hex, cssVar, description, textDark = false, dynamicColor = false }) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div
        className="h-24 w-full"
        style={{ backgroundColor: dynamicColor ? `var(--${name.toLowerCase()})` : cssVar || hex }}
      />
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-medium">{name}</h3>
          <span className="text-sm text-muted-foreground">{cssVar ? cssVar : hex}</span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
