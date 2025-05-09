"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Instagram, Video, Megaphone, ChevronRight, Plus } from "lucide-react"

function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Create Content</h1>
            <p className="text-muted-foreground mt-1">Choose a content type to get started with your campaign</p>
          </div>
          <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/5">
            <span className="text-primary font-medium">Pro Account</span>
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Image Posts Card */}
        <Card className="group relative overflow-hidden border-border/40 transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Instagram className="h-5 w-5 text-primary" />
              Image Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-0">
            <div className="relative aspect-video mb-4 overflow-hidden rounded-lg bg-muted">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/vibrant-instagram-template-G1gkFSRH5bDbuRBon57vAHy81DMNTC.png"
                alt="Image Posts"
                width={400}
                height={200}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              Create stunning Instagram image posts that align with your brand identity.
            </p>
          </CardContent>
          <CardFooter className="pt-2">
            <Button asChild className="w-full group">
              <Link href="/dashboard/image-posts" className="flex items-center justify-between">
                <span className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Image Posts
                </span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
          <span className="absolute top-3 right-3 flex h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
        </Card>

        {/* Video Posts Card */}
        <Card className="group relative overflow-hidden border-border/40 transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:bg-primary/5 opacity-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Video className="h-5 w-5 text-primary" />
              Video Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-0">
            <div className="relative aspect-video mb-4 overflow-hidden rounded-lg bg-muted">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/video-editing-timeline-qO7u2jX7INmV0Mef3EA3ExuXlqmSdV.png"
                alt="Video Posts"
                width={400}
                height={200}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              Generate engaging video content for your social media channels.
            </p>
          </CardContent>
          <CardFooter className="pt-2">
            <Button asChild className="w-full group" disabled>
              <Link href="#" className="flex items-center justify-between">
                <span className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Coming Soon
                </span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
          <Badge className="absolute top-3 right-3 bg-muted text-muted-foreground">Coming Soon</Badge>
        </Card>

        {/* Commercial Ads Card */}
        <Card className="group relative overflow-hidden border-border/40 transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:bg-primary/5 opacity-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Megaphone className="h-5 w-5 text-primary" />
              Commercial Ads
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-0">
            <div className="relative aspect-video mb-4 overflow-hidden rounded-lg bg-muted">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/professional-advertisement-XH9QaoXwDrkfNSuxKtytr0lbnTzLPp.png"
                alt="Commercial Ads"
                width={400}
                height={200}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              Design professional commercial advertisements for your business.
            </p>
          </CardContent>
          <CardFooter className="pt-2">
            <Button asChild className="w-full group" disabled>
              <Link href="#" className="flex items-center justify-between">
                <span className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Coming Soon
                </span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
          <Badge className="absolute top-3 right-3 bg-muted text-muted-foreground">Coming Soon</Badge>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
