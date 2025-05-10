// // // import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// // // import { Button } from "@/components/ui/button"
// // // import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// // // import Image from "next/image"
// // // import Link from "next/link"
// // // import { ArrowRight, Check, Instagram, Sparkles } from "lucide-react"
// // // import { createServerClient } from "@/lib/supabase/server"
// // // import { UserProfileDropdown } from "@/components/user-profile-dropdown"

// // // export default async function LandingPage() {
// // //   const supabase = createServerClient()
// // //   const {
// // //     data: { session },
// // //   } = await supabase.auth.getSession()
// // //   const isLoggedIn = !!session

// // //   return (
// // //     <div className="flex min-h-screen flex-col">
// // //       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
// // //         <div className="container flex h-16 items-center justify-between">
// // //           <div className="flex gap-2 items-center">
// // //             <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center">
// // //               <span className="text-xl font-bold">B</span>
// // //               <span className="absolute top-0 right-0 bg-gradient-to-br from-blue-400 to-purple-500 text-[8px] px-1 rounded-bl-md font-semibold">
// // //                 AI
// // //               </span>
// // //             </div>
// // //             <div className="font-bold text-xl flex items-center">
// // //               BrandStudioAI
// // //               <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-md font-medium">
// // //                 BETA
// // //               </span>
// // //             </div>
// // //           </div>
// // //           <div className="hidden md:flex items-center space-x-6">
// // //             <nav className="flex items-center space-x-6">
// // //               <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
// // //                 Features
// // //               </Link>
// // //               <Link href="#demo" className="text-sm font-medium transition-colors hover:text-primary">
// // //                 How It Works
// // //               </Link>
// // //               <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
// // //                 Pricing
// // //               </Link>
// // //               <Link href="#faq" className="text-sm font-medium transition-colors hover:text-primary">
// // //                 FAQ
// // //               </Link>
// // //             </nav>
// // //             <div className="flex items-center gap-4">
// // //               {isLoggedIn ? (
// // //                 <div className="flex items-center gap-4">
// // //                   <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
// // //                     Dashboard
// // //                   </Link>
// // //                   <UserProfileDropdown />
// // //                 </div>
// // //               ) : (
// // //                 <>
// // //                   <Link href="/login" className="text-sm font-medium transition-colors hover:text-primary">
// // //                     Sign In
// // //                   </Link>
// // //                   <Link href="/signup">
// // //                     <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
// // //                       Sign Up
// // //                     </Button>
// // //                   </Link>
// // //                 </>
// // //               )}
// // //             </div>
// // //           </div>
// // //           <button className="flex items-center justify-center rounded-md p-2 text-foreground md:hidden">
// // //             <svg
// // //               xmlns="http://www.w3.org/2000/svg"
// // //               width="24"
// // //               height="24"
// // //               viewBox="0 0 24 24"
// // //               fill="none"
// // //               stroke="currentColor"
// // //               strokeWidth="2"
// // //               strokeLinecap="round"
// // //               strokeLinejoin="round"
// // //               className="h-6 w-6"
// // //             >
// // //               <line x1="4" x2="20" y1="12" y2="12" />
// // //               <line x1="4" x2="20" y1="6" y2="6" />
// // //               <line x1="4" x2="20" y1="18" y2="18" />
// // //             </svg>
// // //             <span className="sr-only">Toggle menu</span>
// // //           </button>
// // //         </div>
// // //       </header>
// // //       <main className="flex-1">
// // //         <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-purple-50">
// // //           <div className="container px-4 md:px-6">
// // //             <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
// // //               <div className="flex flex-col justify-center space-y-4">
// // //                 <div className="space-y-2">
// // //                   <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
// // //                     <Sparkles className="mr-1 h-3.5 w-3.5" />
// // //                     AI-Powered Content Creation
// // //                   </div>
// // //                   <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
// // //                     Create Instagram-Ready Posts with AI
// // //                   </h1>
// // //                   <p className="max-w-[600px] text-muted-foreground md:text-xl">
// // //                     BrandStudioAI helps you generate, manage, and preview Instagram posts that match your brand
// // //                     identity. Save time and boost your social media presence.
// // //                   </p>
// // //                 </div>
// // //                 <div className="flex flex-col gap-2 min-[400px]:flex-row">
// // //                   {isLoggedIn ? (
// // //                     <Link href="/dashboard">
// // //                       <Button
// // //                         size="lg"
// // //                         className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all hover:shadow-purple-300"
// // //                       >
// // //                         Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
// // //                       </Button>
// // //                     </Link>
// // //                   ) : (
// // //                     <Link href="/signup">
// // //                       <Button
// // //                         size="lg"
// // //                         className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all hover:shadow-purple-300"
// // //                       >
// // //                         Get Started <ArrowRight className="ml-2 h-4 w-4" />
// // //                       </Button>
// // //                     </Link>
// // //                   )}
// // //                   <Button size="lg" variant="outline" className="border-purple-200 hover:bg-purple-100 transition-all">
// // //                     <Instagram className="mr-2 h-4 w-4" /> Connect Instagram
// // //                   </Button>
// // //                 </div>
// // //                 <div className="flex flex-wrap items-center gap-4 text-sm">
// // //                   <div className="flex items-center space-x-1">
// // //                     <div className="rounded-full bg-green-100 p-1">
// // //                       <Check className="h-3 w-3 text-green-600" />
// // //                     </div>
// // //                     <span>AI-Generated Images</span>
// // //                   </div>
// // //                   <div className="flex items-center space-x-1">
// // //                     <div className="rounded-full bg-green-100 p-1">
// // //                       <Check className="h-3 w-3 text-green-600" />
// // //                     </div>
// // //                     <span>Smart Captions</span>
// // //                   </div>
// // //                   <div className="flex items-center space-x-1">
// // //                     <div className="rounded-full bg-green-100 p-1">
// // //                       <Check className="h-3 w-3 text-green-600" />
// // //                     </div>
// // //                     <span>Brand Consistency</span>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //               <div className="flex items-center justify-center">
// // //                 <div className="relative aspect-video overflow-hidden rounded-xl border bg-background shadow-xl transition-all hover:shadow-2xl">
// // //                   <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5 z-10"></div>
// // //                   <Image
// // //                     src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dashboard-8Tm8nHGL89T4RXx8qzYAAN9kbJJ2NO.png"
// // //                     alt="BrandStudioAI Dashboard"
// // //                     width={700}
// // //                     height={400}
// // //                     className="object-cover"
// // //                   />
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </section>

// // //         <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
// // //           <div className="container px-4 md:px-6">
// // //             <div className="flex flex-col items-center justify-center space-y-4 text-center">
// // //               <div className="space-y-2">
// // //                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
// // //                   Video Tour
// // //                 </div>
// // //                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">See BrandStudioAI in action</h2>
// // //                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// // //                   Watch how easy it is to create, manage, and schedule Instagram content with our AI-powered platform
// // //                 </p>
// // //               </div>
// // //             </div>

// // //             <div className="mx-auto max-w-4xl mt-12">
// // //               <div className="relative aspect-video overflow-hidden rounded-xl border shadow-xl bg-black">
// // //                 {/* Video Thumbnail with Play Button Overlay */}
// // //                 <div className="absolute inset-0 flex items-center justify-center z-10 group cursor-pointer">
// // //                   <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm group-hover:bg-purple-600 transition-all duration-300 group-hover:scale-110">
// // //                     <svg
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                       width="24"
// // //                       height="24"
// // //                       viewBox="0 0 24 24"
// // //                       fill="none"
// // //                       stroke="currentColor"
// // //                       strokeWidth="2"
// // //                       strokeLinecap="round"
// // //                       strokeLinejoin="round"
// // //                       className="h-10 w-10 text-white"
// // //                     >
// // //                       <polygon points="5 3 19 12 5 21 5 3" />
// // //                     </svg>
// // //                   </div>
// // //                   <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>
// // //                 </div>

// // //                 {/* Video Thumbnail Image */}
// // //                 <Image
// // //                   src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dashboard-8Tm8nHGL89T4RXx8qzYAAN9kbJJ2NO.png"
// // //                   alt="BrandStudioAI Video Tutorial"
// // //                   width={1280}
// // //                   height={720}
// // //                   className="object-cover"
// // //                 />

// // //                 {/* This would be replaced with an actual video player in production */}
// // //                 {/* <iframe 
// // //                   width="100%" 
// // //                   height="100%" 
// // //                   src="https://www.youtube.com/embed/your-video-id" 
// // //                   title="BrandStudioAI Tutorial" 
// // //                   frameBorder="0" 
// // //                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
// // //                   allowFullScreen
// // //                   className="absolute inset-0"
// // //                 ></iframe> */}
// // //               </div>

// // //               <div className="mt-8 grid gap-6 md:grid-cols-3">
// // //                 <div className="flex flex-col items-center text-center p-4 rounded-lg">
// // //                   <div className="rounded-full bg-purple-100 p-3 mb-4">
// // //                     <svg
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                       width="24"
// // //                       height="24"
// // //                       viewBox="0 0 24 24"
// // //                       fill="none"
// // //                       stroke="currentColor"
// // //                       strokeWidth="2"
// // //                       strokeLinecap="round"
// // //                       strokeLinejoin="round"
// // //                       className="h-6 w-6 text-purple-600"
// // //                     >
// // //                       <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
// // //                       <polyline points="14 2 14 8 20 8" />
// // //                       <path d="M12 18v-6" />
// // //                       <path d="m9 15 3 3 3-3" />
// // //                     </svg>
// // //                   </div>
// // //                   <h3 className="text-lg font-bold">Create Brand Kits</h3>
// // //                   <p className="text-sm text-muted-foreground mt-2">
// // //                     Set up your brand identity in minutes with our intuitive brand kit manager
// // //                   </p>
// // //                 </div>

// // //                 <div className="flex flex-col items-center text-center p-4 rounded-lg">
// // //                   <div className="rounded-full bg-purple-100 p-3 mb-4">
// // //                     <svg
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                       width="24"
// // //                       height="24"
// // //                       viewBox="0 0 24 24"
// // //                       fill="none"
// // //                       stroke="currentColor"
// // //                       strokeWidth="2"
// // //                       strokeLinecap="round"
// // //                       strokeLinejoin="round"
// // //                       className="h-6 w-6 text-purple-600"
// // //                     >
// // //                       <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
// // //                       <path d="M12 8v-2" />
// // //                       <path d="M12 18v-2" />
// // //                       <path d="M8 12H6" />
// // //                       <path d="M18 12h-2" />
// // //                       <path d="m8.93 8.93-1.41-1.41" />
// // //                       <path d="m15.07 15.07-1.41-1.41" />
// // //                       <path d="m15.07 8.93 1.41-1.41" />
// // //                       <path d="m8.93 15.07 1.41-1.41" />
// // //                     </svg>
// // //                   </div>
// // //                   <h3 className="text-lg font-bold">Generate Content</h3>
// // //                   <p className="text-sm text-muted-foreground mt-2">
// // //                     Let AI create stunning images and captions that match your brand style
// // //                   </p>
// // //                 </div>

// // //                 <div className="flex flex-col items-center text-center p-4 rounded-lg">
// // //                   <div className="rounded-full bg-purple-100 p-3 mb-4">
// // //                     <svg
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                       width="24"
// // //                       height="24"
// // //                       viewBox="0 0 24 24"
// // //                       fill="none"
// // //                       stroke="currentColor"
// // //                       strokeWidth="2"
// // //                       strokeLinecap="round"
// // //                       strokeLinejoin="round"
// // //                       className="h-6 w-6 text-purple-600"
// // //                     >
// // //                       <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
// // //                       <line x1="16" x2="16" y1="2" y2="6" />
// // //                       <line x1="8" x2="8" y1="2" y2="6" />
// // //                       <line x1="3" x2="21" y1="10" y2="10" />
// // //                       <path d="M8 14h.01" />
// // //                       <path d="M12 14h.01" />
// // //                       <path d="M16 14h.01" />
// // //                       <path d="M8 18h.01" />
// // //                       <path d="M12 18h.01" />
// // //                       <path d="M16 18h.01" />
// // //                     </svg>
// // //                   </div>
// // //                   <h3 className="text-lg font-bold">Schedule & Publish</h3>
// // //                   <p className="text-sm text-muted-foreground mt-2">
// // //                     Plan your content calendar and publish directly to Instagram
// // //                   </p>
// // //                 </div>
// // //               </div>

// // //               <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
// // //                 <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
// // //                   Start Free Trial
// // //                 </Button>
// // //                 <Button variant="outline" size="lg">
// // //                   Book a Demo
// // //                 </Button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </section>

// // //         <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-white">
// // //           <div className="container px-4 md:px-6">
// // //             <div className="flex flex-col items-center justify-center space-y-4 text-center">
// // //               <div className="space-y-2">
// // //                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
// // //                   Features
// // //                 </div>
// // //                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
// // //                   Everything you need for Instagram success
// // //                 </h2>
// // //                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// // //                   BrandStudioAI combines AI-powered content generation with powerful management tools to streamline your
// // //                   social media workflow.
// // //                 </p>
// // //               </div>
// // //             </div>
// // //             <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
// // //               <Card className="group overflow-hidden border-purple-100 transition-all hover:border-purple-200 hover:shadow-md">
// // //                 <CardHeader>
// // //                   <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
// // //                     <svg
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                       width="24"
// // //                       height="24"
// // //                       viewBox="0 0 24 24"
// // //                       fill="none"
// // //                       stroke="currentColor"
// // //                       strokeWidth="2"
// // //                       strokeLinecap="round"
// // //                       strokeLinejoin="round"
// // //                       className="h-6 w-6 text-purple-600"
// // //                     >
// // //                       <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
// // //                       <path d="M18 14h-8" />
// // //                       <path d="M15 18h-5" />
// // //                       <path d="M10 6h8v4h-8V6Z" />
// // //                     </svg>
// // //                   </div>
// // //                   <CardTitle>Brand Kit Management</CardTitle>
// // //                   <CardDescription>
// // //                     Create and manage brand kits with your brand's name, colors, tone, and logo.
// // //                   </CardDescription>
// // //                 </CardHeader>
// // //                 <CardContent>
// // //                   <div className="aspect-video overflow-hidden rounded-lg border border-purple-100 transition-all group-hover:border-purple-200">
// // //                     <Image
// // //                       src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brand-kit-fqATE6cTccLEZjufVBRGQZfuST05JY.png"
// // //                       alt="Brand Kit Manager"
// // //                       width={400}
// // //                       height={225}
// // //                       className="object-cover transition-transform group-hover:scale-105"
// // //                     />
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>
// // //               <Card className="group overflow-hidden border-purple-100 transition-all hover:border-purple-200 hover:shadow-md">
// // //                 <CardHeader>
// // //                   <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
// // //                     <svg
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                       width="24"
// // //                       height="24"
// // //                       viewBox="0 0 24 24"
// // //                       fill="none"
// // //                       stroke="currentColor"
// // //                       strokeWidth="2"
// // //                       strokeLinecap="round"
// // //                       strokeLinejoin="round"
// // //                       className="h-6 w-6 text-purple-600"
// // //                     >
// // //                       <path d="M12 2H2v10h10V2Z" />
// // //                       <path d="M12 12H2v10h10V12Z" />
// // //                       <path d="M22 2h-10v20h10V2Z" />
// // //                     </svg>
// // //                   </div>
// // //                   <CardTitle>AI-Powered Post Generation</CardTitle>
// // //                   <CardDescription>
// // //                     Generate Instagram posts with captions and images that match your brand style.
// // //                   </CardDescription>
// // //                 </CardHeader>
// // //                 <CardContent>
// // //                   <div className="aspect-video overflow-hidden rounded-lg border border-purple-100 transition-all group-hover:border-purple-200">
// // //                     <Image
// // //                       src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-post-lUIx1DtfNNcsqQhFi2u6fkfmr74DW0.png"
// // //                       alt="Instagram Posts"
// // //                       width={400}
// // //                       height={225}
// // //                       className="object-cover transition-transform group-hover:scale-105"
// // //                     />
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>
// // //               <Card className="group overflow-hidden border-purple-100 transition-all hover:border-purple-200 hover:shadow-md">
// // //                 <CardHeader>
// // //                   <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
// // //                     <svg
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                       width="24"
// // //                       height="24"
// // //                       viewBox="0 0 24 24"
// // //                       fill="none"
// // //                       stroke="currentColor"
// // //                       strokeWidth="2"
// // //                       strokeLinecap="round"
// // //                       strokeLinejoin="round"
// // //                       className="h-6 w-6 text-purple-600"
// // //                     >
// // //                       <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
// // //                       <line x1="16" x2="16" y1="2" y2="6" />
// // //                       <line x1="8" x2="8" y1="2" y2="6" />
// // //                       <line x1="3" x2="21" y1="10" y2="10" />
// // //                       <path d="M8 14h.01" />
// // //                       <path d="M12 14h.01" />
// // //                       <path d="M16 14h.01" />
// // //                       <path d="M8 18h.01" />
// // //                       <path d="M12 18h.01" />
// // //                       <path d="M16 18h.01" />
// // //                     </svg>
// // //                   </div>
// // //                   <CardTitle>Post Scheduling</CardTitle>
// // //                   <CardDescription>Plan and schedule your posts with an intuitive calendar interface.</CardDescription>
// // //                 </CardHeader>
// // //                 <CardContent>
// // //                   <div className="aspect-video overflow-hidden rounded-lg border border-purple-100 transition-all group-hover:border-purple-200">
// // //                     <Image
// // //                       src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/schedule-XX7MmZx9vXoYiL7guvMGYmfgiXj4SU.png"
// // //                       alt="Post Scheduling"
// // //                       width={400}
// // //                       height={225}
// // //                       className="object-cover transition-transform group-hover:scale-105"
// // //                     />
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>
// // //               <Card className="group overflow-hidden border-purple-100 transition-all hover:border-purple-200 hover:shadow-md">
// // //                 <CardHeader>
// // //                   <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
// // //                     <svg
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                       width="24"
// // //                       height="24"
// // //                       viewBox="0 0 24 24"
// // //                       fill="none"
// // //                       stroke="currentColor"
// // //                       strokeWidth="2"
// // //                       strokeLinecap="round"
// // //                       strokeLinejoin="round"
// // //                       className="h-6 w-6 text-purple-600"
// // //                     >
// // //                       <path d="M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4" />
// // //                       <rect width="10" height="7" x="12" y="13" rx="2" />
// // //                     </svg>
// // //                   </div>
// // //                   <CardTitle>Content Management</CardTitle>
// // //                   <CardDescription>Manage all your generated content from a central dashboard.</CardDescription>
// // //                 </CardHeader>
// // //                 <CardContent>
// // //                   <div className="aspect-video overflow-hidden rounded-lg border border-purple-100 transition-all group-hover:border-purple-200">
// // //                     <Image
// // //                       src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/summary-7H32Oso9LcuhsAwQRHL2U4foVG6hcf.png"
// // //                       alt="Content Management"
// // //                       width={400}
// // //                       height={225}
// // //                       className="object-cover transition-transform group-hover:scale-105"
// // //                     />
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>
// // //               <Card className="group overflow-hidden border-purple-100 transition-all hover:border-purple-200 hover:shadow-md">
// // //                 <CardHeader>
// // //                   <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
// // //                     <svg
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                       width="24"
// // //                       height="24"
// // //                       viewBox="0 0 24 24"
// // //                       fill="none"
// // //                       stroke="currentColor"
// // //                       strokeWidth="2"
// // //                       strokeLinecap="round"
// // //                       strokeLinejoin="round"
// // //                       className="h-6 w-6 text-purple-600"
// // //                     >
// // //                       <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
// // //                       <path d="M14 2v4a2 2 0 0 0 2 2h4" />
// // //                       <path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1" />
// // //                       <path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" />
// // //                     </svg>
// // //                   </div>
// // //                   <CardTitle>Post Preview</CardTitle>
// // //                   <CardDescription>Preview how your posts will look on Instagram before publishing.</CardDescription>
// // //                 </CardHeader>
// // //                 <CardContent>
// // //                   <div className="aspect-video overflow-hidden rounded-lg border border-purple-100 transition-all group-hover:border-purple-200">
// // //                     <Image
// // //                       src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/before-scheduling-75fSYTvdCxq4qbVSN1WwB2s5Ae407l.png"
// // //                       alt="Post Preview"
// // //                       width={400}
// // //                       height={225}
// // //                       className="object-cover transition-transform group-hover:scale-105"
// // //                     />
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>
// // //               <Card className="group overflow-hidden border-purple-100 transition-all hover:border-purple-200 hover:shadow-md">
// // //                 <CardHeader>
// // //                   <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
// // //                     <svg
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                       width="24"
// // //                       height="24"
// // //                       viewBox="0 0 24 24"
// // //                       fill="none"
// // //                       stroke="currentColor"
// // //                       strokeWidth="2"
// // //                       strokeLinecap="round"
// // //                       strokeLinejoin="round"
// // //                       className="h-6 w-6 text-purple-600"
// // //                     >
// // //                       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
// // //                       <polyline points="7 10 12 15 17 10" />
// // //                       <line x1="12" x2="12" y1="15" y2="3" />
// // //                     </svg>
// // //                   </div>
// // //                   <CardTitle>Export & Publish</CardTitle>
// // //                   <CardDescription>Export your content or publish directly to Instagram.</CardDescription>
// // //                 </CardHeader>
// // //                 <CardContent>
// // //                   <div className="aspect-video overflow-hidden rounded-lg border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-center transition-all group-hover:border-purple-200">
// // //                     <Instagram className="h-12 w-12 text-purple-600" />
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>
// // //             </div>
// // //           </div>
// // //         </section>

// // //         <section id="demo" className="w-full py-12 md:py-24 lg:py-32">
// // //           <div className="container px-4 md:px-6">
// // //             <div className="flex flex-col items-center justify-center space-y-4 text-center">
// // //               <div className="space-y-2">
// // //                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
// // //                   How It Works
// // //                 </div>
// // //                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
// // //                   Streamline your social media workflow
// // //                 </h2>
// // //                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// // //                   See how BrandStudioAI helps you create, manage, and publish Instagram content.
// // //                 </p>
// // //               </div>
// // //             </div>
// // //             <div className="mx-auto max-w-5xl mt-12">
// // //               <Tabs defaultValue="create" className="w-full">
// // //                 <TabsList className="grid w-full grid-cols-3">
// // //                   <TabsTrigger value="create">Create</TabsTrigger>
// // //                   <TabsTrigger value="manage">Manage</TabsTrigger>
// // //                   <TabsTrigger value="schedule">Schedule</TabsTrigger>
// // //                 </TabsList>
// // //                 <TabsContent value="create" className="mt-10">
// // //                   <div className="flex flex-col gap-8 md:flex-row">
// // //                     <div className="flex-1 space-y-4">
// // //                       <h3 className="text-2xl font-bold">Create Content</h3>
// // //                       <p className="text-muted-foreground">
// // //                         Choose a content type, select your brand kit, and let AI generate posts that match your brand
// // //                         identity.
// // //                       </p>
// // //                       <ul className="space-y-2">
// // //                         <li className="flex items-start">
// // //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                           <span>Generate multiple posts with a single click</span>
// // //                         </li>
// // //                         <li className="flex items-start">
// // //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                           <span>AI creates both images and captions</span>
// // //                         </li>
// // //                         <li className="flex items-start">
// // //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                           <span>Consistent with your brand guidelines</span>
// // //                         </li>
// // //                       </ul>
// // //                     </div>
// // //                     <div className="flex-1">
// // //                       <div className="overflow-hidden rounded-xl border shadow-lg">
// // //                         <Image
// // //                           src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dashboard-8Tm8nHGL89T4RXx8qzYAAN9kbJJ2NO.png"
// // //                           alt="Create Content"
// // //                           width={600}
// // //                           height={400}
// // //                           className="object-cover"
// // //                         />
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </TabsContent>
// // //                 <TabsContent value="manage" className="mt-10">
// // //                   <div className="flex flex-col gap-8 md:flex-row">
// // //                     <div className="flex-1 space-y-4">
// // //                       <h3 className="text-2xl font-bold">Manage Content</h3>
// // //                       <p className="text-muted-foreground">
// // //                         View, edit, and organize all your generated posts from a central dashboard.
// // //                       </p>
// // //                       <ul className="space-y-2">
// // //                         <li className="flex items-start">
// // //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                           <span>Edit captions and regenerate content</span>
// // //                         </li>
// // //                         <li className="flex items-start">
// // //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                           <span>Filter and search through your content</span>
// // //                         </li>
// // //                         <li className="flex items-start">
// // //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                           <span>Export content in various formats</span>
// // //                         </li>
// // //                       </ul>
// // //                     </div>
// // //                     <div className="flex-1">
// // //                       <div className="overflow-hidden rounded-xl border shadow-lg">
// // //                         <Image
// // //                           src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/summary-7H32Oso9LcuhsAwQRHL2U4foVG6hcf.png"
// // //                           alt="Manage Content"
// // //                           width={600}
// // //                           height={400}
// // //                           className="object-cover"
// // //                         />
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </TabsContent>
// // //                 <TabsContent value="schedule" className="mt-10">
// // //                   <div className="flex flex-col gap-8 md:flex-row">
// // //                     <div className="flex-1 space-y-4">
// // //                       <h3 className="text-2xl font-bold">Schedule Posts</h3>
// // //                       <p className="text-muted-foreground">
// // //                         Plan your content calendar and schedule posts for optimal engagement.
// // //                       </p>
// // //                       <ul className="space-y-2">
// // //                         <li className="flex items-start">
// // //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                           <span>Drag-and-drop scheduling interface</span>
// // //                         </li>
// // //                         <li className="flex items-start">
// // //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                           <span>Weekly and monthly calendar views</span>
// // //                         </li>
// // //                         <li className="flex items-start">
// // //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                           <span>Automatic posting at scheduled times</span>
// // //                         </li>
// // //                       </ul>
// // //                     </div>
// // //                     <div className="flex-1">
// // //                       <div className="overflow-hidden rounded-xl border shadow-lg">
// // //                         <Image
// // //                           src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/schedule-XX7MmZx9vXoYiL7guvMGYmfgiXj4SU.png"
// // //                           alt="Schedule Posts"
// // //                           width={600}
// // //                           height={400}
// // //                           className="object-cover"
// // //                         />
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </TabsContent>
// // //               </Tabs>
// // //             </div>
// // //           </div>
// // //         </section>

// // //         <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50">
// // //           <div className="container px-4 md:px-6">
// // //             <div className="flex flex-col items-center justify-center space-y-4 text-center">
// // //               <div className="space-y-2">
// // //                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
// // //                   Video Tutorials
// // //                 </div>
// // //                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
// // //                   Learn how to use BrandStudioAI
// // //                 </h2>
// // //                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// // //                   Detailed video tutorials to help you get the most out of our platform
// // //                 </p>
// // //               </div>
// // //             </div>

// // //             <div className="mx-auto max-w-6xl mt-12 grid gap-8 md:grid-cols-2">
// // //               <div className="flex flex-col space-y-4">
// // //                 <div className="relative aspect-video overflow-hidden rounded-xl border shadow-lg bg-black">
// // //                   <div className="absolute inset-0 flex items-center justify-center z-10 group cursor-pointer">
// // //                     <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm group-hover:bg-purple-600 transition-all duration-300 group-hover:scale-110">
// // //                       <svg
// // //                         xmlns="http://www.w3.org/2000/svg"
// // //                         width="24"
// // //                         height="24"
// // //                         viewBox="0 0 24 24"
// // //                         fill="none"
// // //                         stroke="currentColor"
// // //                         strokeWidth="2"
// // //                         strokeLinecap="round"
// // //                         strokeLinejoin="round"
// // //                         className="h-6 w-6 text-white"
// // //                       >
// // //                         <polygon points="5 3 19 12 5 21 5 3" />
// // //                       </svg>
// // //                     </div>
// // //                     <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>
// // //                   </div>

// // //                   <Image
// // //                     src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brand-kit-fqATE6cTccLEZjufVBRGQZfuST05JY.png"
// // //                     alt="Creating Brand Kits Tutorial"
// // //                     width={640}
// // //                     height={360}
// // //                     className="object-cover"
// // //                   />
// // //                 </div>
// // //                 <h3 className="text-xl font-bold">Creating Brand Kits</h3>
// // //                 <p className="text-muted-foreground">
// // //                   Learn how to set up your brand identity with colors, tone, and logo for consistent content generation.
// // //                 </p>
// // //               </div>

// // //               <div className="flex flex-col space-y-4">
// // //                 <div className="relative aspect-video overflow-hidden rounded-xl border shadow-lg bg-black">
// // //                   <div className="absolute inset-0 flex items-center justify-center z-10 group cursor-pointer">
// // //                     <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm group-hover:bg-purple-600 transition-all duration-300 group-hover:scale-110">
// // //                       <svg
// // //                         xmlns="http://www.w3.org/2000/svg"
// // //                         width="24"
// // //                         height="24"
// // //                         viewBox="0 0 24 24"
// // //                         fill="none"
// // //                         stroke="currentColor"
// // //                         strokeWidth="2"
// // //                         strokeLinecap="round"
// // //                         strokeLinejoin="round"
// // //                         className="h-6 w-6 text-white"
// // //                       >
// // //                         <polygon points="5 3 19 12 5 21 5 3" />
// // //                       </svg>
// // //                     </div>
// // //                     <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>
// // //                   </div>

// // //                   <Image
// // //                     src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-post-lUIx1DtfNNcsqQhFi2u6fkfmr74DW0.png"
// // //                     alt="Generating Instagram Posts Tutorial"
// // //                     width={640}
// // //                     height={360}
// // //                     className="object-cover"
// // //                   />
// // //                 </div>
// // //                 <h3 className="text-xl font-bold">Generating Instagram Posts</h3>
// // //                 <p className="text-muted-foreground">
// // //                   See how to use AI to create engaging images and captions that align with your brand identity.
// // //                 </p>
// // //               </div>

// // //               <div className="flex flex-col space-y-4">
// // //                 <div className="relative aspect-video overflow-hidden rounded-xl border shadow-lg bg-black">
// // //                   <div className="absolute inset-0 flex items-center justify-center z-10 group cursor-pointer">
// // //                     <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm group-hover:bg-purple-600 transition-all duration-300 group-hover:scale-110">
// // //                       <svg
// // //                         xmlns="http://www.w3.org/2000/svg"
// // //                         width="24"
// // //                         height="24"
// // //                         viewBox="0 0 24 24"
// // //                         fill="none"
// // //                         stroke="currentColor"
// // //                         strokeWidth="2"
// // //                         strokeLinecap="round"
// // //                         strokeLinejoin="round"
// // //                         className="h-6 w-6 text-white"
// // //                       >
// // //                         <polygon points="5 3 19 12 5 21 5 3" />
// // //                       </svg>
// // //                     </div>
// // //                     <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>
// // //                   </div>

// // //                   <Image
// // //                     src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/schedule-XX7MmZx9vXoYiL7guvMGYmfgiXj4SU.png"
// // //                     alt="Scheduling Content Tutorial"
// // //                     width={640}
// // //                     height={360}
// // //                     className="object-cover"
// // //                   />
// // //                 </div>
// // //                 <h3 className="text-xl font-bold">Scheduling Content</h3>
// // //                 <p className="text-muted-foreground">
// // //                   Master the drag-and-drop scheduling interface to plan your content calendar effectively.
// // //                 </p>
// // //               </div>

// // //               <div className="flex flex-col space-y-4">
// // //                 <div className="relative aspect-video overflow-hidden rounded-xl border shadow-lg bg-black">
// // //                   <div className="absolute inset-0 flex items-center justify-center z-10 group cursor-pointer">
// // //                     <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm group-hover:bg-purple-600 transition-all duration-300 group-hover:scale-110">
// // //                       <svg
// // //                         xmlns="http://www.w3.org/2000/svg"
// // //                         width="24"
// // //                         height="24"
// // //                         viewBox="0 0 24 24"
// // //                         fill="none"
// // //                         stroke="currentColor"
// // //                         strokeWidth="2"
// // //                         strokeLinecap="round"
// // //                         strokeLinejoin="round"
// // //                         className="h-6 w-6 text-white"
// // //                       >
// // //                         <polygon points="5 3 19 12 5 21 5 3" />
// // //                       </svg>
// // //                     </div>
// // //                     <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>
// // //                   </div>

// // //                   <Image
// // //                     src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/summary-7H32Oso9LcuhsAwQRHL2U4foVG6hcf.png"
// // //                     alt="Analytics and Reporting Tutorial"
// // //                     width={640}
// // //                     height={360}
// // //                     className="object-cover"
// // //                   />
// // //                 </div>
// // //                 <h3 className="text-xl font-bold">Analytics and Reporting</h3>
// // //                 <p className="text-muted-foreground">
// // //                   Learn how to track performance and optimize your content strategy with our analytics tools.
// // //                 </p>
// // //               </div>
// // //             </div>

// // //             <div className="mt-12 text-center">
// // //               <p className="text-muted-foreground mb-6">Subscribe to our YouTube channel for more tutorials and tips</p>
// // //               <Button className="bg-red-600 hover:bg-red-700">
// // //                 <svg
// // //                   xmlns="http://www.w3.org/2000/svg"
// // //                   width="24"
// // //                   height="24"
// // //                   viewBox="0 0 24 24"
// // //                   fill="none"
// // //                   stroke="currentColor"
// // //                   strokeWidth="2"
// // //                   strokeLinecap="round"
// // //                   strokeLinejoin="round"
// // //                   className="h-5 w-5 mr-2"
// // //                 >
// // //                   <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
// // //                   <path d="m10 15 5-3-5-3z" />
// // //                 </svg>
// // //                 Subscribe to YouTube
// // //               </Button>
// // //             </div>
// // //           </div>
// // //         </section>

// // //         <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
// // //           <div className="container px-4 md:px-6">
// // //             <div className="flex flex-col items-center justify-center space-y-4 text-center">
// // //               <div className="space-y-2">
// // //                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
// // //                   Pricing
// // //                 </div>
// // //                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
// // //                   Choose the plan that's right for you
// // //                 </h2>
// // //                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// // //                   Affordable plans for businesses of all sizes. Start creating today.
// // //                 </p>
// // //               </div>
// // //             </div>
// // //             <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-12">
// // //               <Card className="flex flex-col">
// // //                 <CardHeader>
// // //                   <CardTitle>Starter</CardTitle>
// // //                   <CardDescription>Perfect for small businesses and solopreneurs.</CardDescription>
// // //                   <div className="mt-4 flex items-baseline text-5xl font-bold">
// // //                     $7.99
// // //                     <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
// // //                   </div>
// // //                 </CardHeader>
// // //                 <CardContent className="flex-1">
// // //                   <ul className="space-y-2 text-sm">
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>100 brand advertisements monthly</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>GPT-Image-1 powered visuals (Low quality)</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>Unique GPT-3.5 Turbo captions</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>Logo placement</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>Basic image sizes (1024x1024)</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>7-day image storage</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>Email support</span>
// // //                     </li>
// // //                   </ul>
// // //                 </CardContent>
// // //                 <CardFooter>
// // //                   {isLoggedIn ? (
// // //                     <Button className="w-full bg-purple-600 hover:bg-purple-700">Upgrade Plan</Button>
// // //                   ) : (
// // //                     <Link href="/signup" className="w-full">
// // //                       <Button className="w-full bg-purple-600 hover:bg-purple-700">Get Started</Button>
// // //                     </Link>
// // //                   )}
// // //                 </CardFooter>
// // //               </Card>
// // //               <Card className="flex flex-col border-purple-600 shadow-lg">
// // //                 <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white">
// // //                   Most Popular
// // //                 </div>
// // //                 <CardHeader>
// // //                   <CardTitle>Professional</CardTitle>
// // //                   <CardDescription>For growing businesses and marketing agencies.</CardDescription>
// // //                   <div className="mt-4 flex items-baseline text-5xl font-bold">
// // //                     $19.99
// // //                     <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
// // //                   </div>
// // //                 </CardHeader>
// // //                 <CardContent className="flex-1">
// // //                   <ul className="space-y-2 text-sm">
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>200 brand advertisements monthly</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>Medium quality image generation</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>Priority image processing</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>Premium image sizes (1024x1536, 1536x1024)</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>Custom text overlay options</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>Batch processing (up to 10 ads at once)</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>30-day image storage</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>Chat support</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>Basic analytics</span>
// // //                     </li>
// // //                   </ul>
// // //                 </CardContent>
// // //                 <CardFooter>
// // //                   {isLoggedIn ? (
// // //                     <Button className="w-full bg-purple-600 hover:bg-purple-700">Upgrade Plan</Button>
// // //                   ) : (
// // //                     <Link href="/signup" className="w-full">
// // //                       <Button className="w-full bg-purple-600 hover:bg-purple-700">Get Started</Button>
// // //                     </Link>
// // //                   )}
// // //                 </CardFooter>
// // //               </Card>
// // //               <Card className="flex flex-col">
// // //                 <CardHeader>
// // //                   <CardTitle>Enterprise</CardTitle>
// // //                   <CardDescription>For marketing agencies and large brands.</CardDescription>
// // //                   <div className="mt-4 flex items-baseline text-5xl font-bold">
// // //                     $99.99
// // //                     <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
// // //                   </div>
// // //                 </CardHeader>
// // //                 <CardContent className="flex-1">
// // //                   <ul className="space-y-2 text-sm">
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>500 brand advertisements monthly</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>High quality image generation</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>Highest priority processing</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>All available image sizes and formats</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>Advanced batch processing (up to 50 ads)</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>API access for integration</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>Custom brand voice profiles</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>90-day image storage</span>
// // //                     </li>
// // //                     <li className="flex items-start">
// // //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// // //                       <span>Dedicated account manager</span>
// // //                     </li>
// // //                   </ul>
// // //                 </CardContent>
// // //                 <CardFooter>
// // //                   {isLoggedIn ? (
// // //                     <Button className="w-full bg-purple-600 hover:bg-purple-700">Upgrade Plan</Button>
// // //                   ) : (
// // //                     <Link href="/signup" className="w-full">
// // //                       <Button className="w-full bg-purple-600 hover:bg-purple-700">Get Started</Button>
// // //                     </Link>
// // //                   )}
// // //                 </CardFooter>
// // //               </Card>
// // //             </div>
// // //           </div>
// // //         </section>

// // //         <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
// // //           <div className="container px-4 md:px-6">
// // //             <div className="flex flex-col items-center justify-center space-y-4 text-center">
// // //               <div className="space-y-2">
// // //                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
// // //                   FAQ
// // //                 </div>
// // //                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
// // //                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// // //                   Everything you need to know about BrandStudioAI
// // //                 </p>
// // //               </div>
// // //             </div>
// // //             <div className="mx-auto max-w-3xl mt-12 space-y-4">
// // //               <Accordion type="single" collapsible className="w-full">
// // //                 <AccordionItem value="item-1">
// // //                   <AccordionTrigger className="text-left">What is BrandStudioAI?</AccordionTrigger>
// // //                   <AccordionContent>
// // //                     BrandStudioAI is an AI-powered platform for generating, managing, and previewing Instagram-ready
// // //                     posts for brands. It leverages OpenAI for creative content generation and helps marketing teams,
// // //                     agencies, and solo founders automate and streamline their social media content creation process.
// // //                   </AccordionContent>
// // //                 </AccordionItem>
// // //                 <AccordionItem value="item-2">
// // //                   <AccordionTrigger className="text-left">How does BrandStudioAI generate content?</AccordionTrigger>
// // //                   <AccordionContent>
// // //                     BrandStudioAI uses advanced AI models from OpenAI to generate both images and captions that match
// // //                     your brand's style and tone. You create a Brand Kit with your brand details, and our AI uses this
// // //                     information to create content that's consistent with your brand identity.
// // //                   </AccordionContent>
// // //                 </AccordionItem>
// // //                 <AccordionItem value="item-3">
// // //                   <AccordionTrigger className="text-left">Can I edit the generated content?</AccordionTrigger>
// // //                   <AccordionContent>
// // //                     Yes! All generated content can be edited. You can modify captions, regenerate images, and make any
// // //                     adjustments needed before scheduling or publishing your posts.
// // //                   </AccordionContent>
// // //                 </AccordionItem>
// // //                 <AccordionItem value="item-4">
// // //                   <AccordionTrigger className="text-left">
// // //                     How many posts can I generate with each plan?
// // //                   </AccordionTrigger>
// // //                   <AccordionContent>
// // //                     The Starter plan includes 100 posts per month, the Professional plan includes 200 posts per month,
// // //                     and the Enterprise plan includes 500 posts per month. If you need more, you can purchase additional
// // //                     credits.
// // //                   </AccordionContent>
// // //                 </AccordionItem>
// // //                 <AccordionItem value="item-5">
// // //                   <AccordionTrigger className="text-left">Can I publish directly to Instagram?</AccordionTrigger>
// // //                   <AccordionContent>
// // //                     Yes, BrandStudioAI allows you to connect your Instagram account and publish posts directly from the
// // //                     platform. You can also schedule posts for future publication at optimal times.
// // //                   </AccordionContent>
// // //                 </AccordionItem>
// // //                 <AccordionItem value="item-6">
// // //                   <AccordionTrigger className="text-left">What image quality can I expect?</AccordionTrigger>
// // //                   <AccordionContent>
// // //                     Image quality depends on your plan. The Starter plan provides low-quality images (1024x1024), the
// // //                     Professional plan offers medium-quality images with more size options, and the Enterprise plan
// // //                     delivers high-quality images in all available sizes and formats.
// // //                   </AccordionContent>
// // //                 </AccordionItem>
// // //                 <AccordionItem value="item-7">
// // //                   <AccordionTrigger className="text-left">Is there a free trial?</AccordionTrigger>
// // //                   <AccordionContent>
// // //                     Yes, we offer a 7-day free trial with access to all features of the Professional plan. No credit
// // //                     card is required to start your trial.
// // //                   </AccordionContent>
// // //                 </AccordionItem>
// // //                 <AccordionItem value="item-8">
// // //                   <AccordionTrigger className="text-left">How long are my images stored?</AccordionTrigger>
// // //                   <AccordionContent>
// // //                     Image storage varies by plan: 7 days for Starter, 30 days for Professional, and 90 days for
// // //                     Enterprise. You can download your images at any time during the storage period. Extended storage
// // //                     options are available for an additional fee.
// // //                   </AccordionContent>
// // //                 </AccordionItem>
// // //               </Accordion>
// // //             </div>
// // //           </div>
// // //         </section>

// // //         <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
// // //           <div className="container px-4 md:px-6">
// // //             <div className="flex flex-col items-center justify-center space-y-4 text-center">
// // //               <div className="space-y-2">
// // //                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
// // //                   Ready to transform your Instagram presence?
// // //                 </h2>
// // //                 <p className="max-w-[900px] text-purple-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// // //                   Join thousands of businesses using BrandStudioAI to create stunning Instagram content.
// // //                 </p>
// // //               </div>
// // //               <div className="flex flex-col gap-2 min-[400px]:flex-row">
// // //                 {isLoggedIn ? (
// // //                   <Link href="/dashboard">
// // //                     <Button
// // //                       size="lg"
// // //                       className="bg-white text-purple-600 hover:bg-purple-100 shadow-lg shadow-purple-800/20 transition-all"
// // //                     >
// // //                       Go to Dashboard
// // //                     </Button>
// // //                   </Link>
// // //                 ) : (
// // //                   <Link href="/signup">
// // //                     <Button
// // //                       size="lg"
// // //                       className="bg-white text-purple-600 hover:bg-purple-100 shadow-lg shadow-purple-800/20 transition-all"
// // //                     >
// // //                       Get Started Free
// // //                     </Button>
// // //                   </Link>
// // //                 )}
// // //                 <Button
// // //                   size="lg"
// // //                   variant="outline"
// // //                   className="border-white text-white hover:bg-purple-700 transition-all"
// // //                 >
// // //                   Schedule a Demo
// // //                 </Button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </section>
// // //       </main>
// // //       <footer className="w-full border-t py-6 md:py-12">
// // //         <div className="container px-4 md:px-6">
// // //           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
// // //             <div className="space-y-4">
// // //               <div className="flex gap-2 items-center">
// // //                 <div className="relative h-9 w-9 overflow-hidden rounded-md bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center">
// // //                   <span className="text-xl font-bold">B</span>
// // //                   <span className="absolute top-0 right-0 bg-gradient-to-br from-blue-400 to-purple-500 text-[8px] px-1 rounded-bl-md font-semibold">
// // //                     AI
// // //                   </span>
// // //                 </div>
// // //                 <div className="font-bold text-xl">BrandStudioAI</div>
// // //               </div>
// // //               <p className="text-sm text-muted-foreground">
// // //                 AI-powered platform for generating, managing, and previewing Instagram-ready posts for brands.
// // //               </p>
// // //               <div className="flex space-x-4">
// // //                 <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// // //                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
// // //                     <path
// // //                       fillRule="evenodd"
// // //                       d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
// // //                       clipRule="evenodd"
// // //                     />
// // //                   </svg>
// // //                 </Link>
// // //                 <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// // //                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
// // //                     <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
// // //                   </svg>
// // //                 </Link>
// // //                 <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// // //                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
// // //                     <path
// // //                       fillRule="evenodd"
// // //                       d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
// // //                       clipRule="evenodd"
// // //                     />
// // //                   </svg>
// // //                 </Link>
// // //               </div>
// // //             </div>
// // //             <div className="space-y-4">
// // //               <h3 className="text-sm font-medium">Product</h3>
// // //               <ul className="space-y-2 text-sm">
// // //                 <li>
// // //                   <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
// // //                     Features
// // //                   </Link>
// // //                 </li>
// // //                 <li>
// // //                   <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
// // //                     Pricing
// // //                   </Link>
// // //                 </li>
// // //                 <li>
// // //                   <Link href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
// // //                     Demo
// // //                   </Link>
// // //                 </li>
// // //                 <li>
// // //                   <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
// // //                     FAQ
// // //                   </Link>
// // //                 </li>
// // //               </ul>
// // //             </div>
// // //             <div className="space-y-4">
// // //               <h3 className="text-sm font-medium">Resources</h3>
// // //               <ul className="space-y-2 text-sm">
// // //                 <li>
// // //                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// // //                     Blog
// // //                   </Link>
// // //                 </li>
// // //                 <li>
// // //                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// // //                     Documentation
// // //                   </Link>
// // //                 </li>
// // //                 <li>
// // //                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// // //                     Guides
// // //                   </Link>
// // //                 </li>
// // //                 <li>
// // //                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// // //                     Support
// // //                   </Link>
// // //                 </li>
// // //               </ul>
// // //             </div>
// // //             <div className="space-y-4">
// // //               <h3 className="text-sm font-medium">Company</h3>
// // //               <ul className="space-y-2 text-sm">
// // //                 <li>
// // //                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// // //                     About
// // //                   </Link>
// // //                 </li>
// // //                 <li>
// // //                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// // //                     Careers
// // //                   </Link>
// // //                 </li>
// // //                 <li>
// // //                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// // //                     Contact
// // //                   </Link>
// // //                 </li>
// // //                 <li>
// // //                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// // //                     Privacy Policy
// // //                   </Link>
// // //                 </li>
// // //               </ul>
// // //             </div>
// // //           </div>
// // //           <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
// // //             © {new Date().getFullYear()} BrandStudioAI. All rights reserved.
// // //           </div>
// // //         </div>
// // //       </footer>
// // //     </div>
// // //   )
// // // }
// // import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// // import Image from "next/image"
// // import Link from "next/link"
// // import { ArrowRight, Check, Instagram, Sparkles } from "lucide-react"
// // import { createServerClient } from "@/lib/supabase/server"
// // import { UserProfileDropdown } from "@/components/user-profile-dropdown"

// // export default async function LandingPage() {
// //   const supabase = createServerClient()
// //   const {
// //     data: { session },
// //   } = await supabase.auth.getSession()
// //   const isLoggedIn = !!session

// //   return (
// //     <div className="flex min-h-screen flex-col">
// //       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
// //         <div className="container flex h-16 items-center justify-between">
// //           <div className="flex gap-2 items-center">
// //             <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center">
// //               <span className="text-xl font-bold">B</span>
// //               <span className="absolute top-0 right-0 bg-gradient-to-br from-blue-400 to-purple-500 text-[8px] px-1 rounded-bl-md font-semibold">
// //                 AI
// //               </span>
// //             </div>
// //             <div className="font-bold text-xl flex items-center">
// //               BrandStudioAI
// //               <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-md font-medium">
// //                 BETA
// //               </span>
// //             </div>
// //           </div>
// //           <div className="hidden md:flex items-center space-x-6">
// //             <nav className="flex items-center space-x-6">
// //               <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
// //                 Features
// //               </Link>
// //               <Link href="#demo" className="text-sm font-medium transition-colors hover:text-primary">
// //                 How It Works
// //               </Link>
// //               <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
// //                 Pricing
// //               </Link>
// //               <Link href="#faq" className="text-sm font-medium transition-colors hover:text-primary">
// //                 FAQ
// //               </Link>
// //             </nav>
// //             <div className="flex items-center gap-4">
// //               {isLoggedIn ? (
// //                 <div className="flex items-center gap-4">
// //                   <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
// //                     Dashboard
// //                   </Link>
// //                   <UserProfileDropdown />
// //                 </div>
// //               ) : (
// //                 <>
// //                   <Link href="/login" className="text-sm font-medium transition-colors hover:text-primary">
// //                     Sign In
// //                   </Link>
// //                   <Link href="/signup">
// //                     <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
// //                       Sign Up
// //                     </Button>
// //                   </Link>
// //                 </>
// //               )}
// //             </div>
// //           </div>
// //           <button className="flex items-center justify-center rounded-md p-2 text-foreground md:hidden">
// //             <svg
// //               xmlns="http://www.w3.org/2000/svg"
// //               width="24"
// //               height="24"
// //               viewBox="0 0 24 24"
// //               fill="none"
// //               stroke="currentColor"
// //               strokeWidth="2"
// //               strokeLinecap="round"
// //               strokeLinejoin="round"
// //               className="h-6 w-6"
// //             >
// //               <line x1="4" x2="20" y1="12" y2="12" />
// //               <line x1="4" x2="20" y1="6" y2="6" />
// //               <line x1="4" x2="20" y1="18" y2="18" />
// //             </svg>
// //             <span className="sr-only">Toggle menu</span>
// //           </button>
// //         </div>
// //       </header>
// //       <main className="flex-1">
// //         <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-purple-50">
// //           <div className="container px-4 md:px-6">
// //             <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
// //               <div className="flex flex-col justify-center space-y-4">
// //                 <div className="space-y-2">
// //                   <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
// //                     <Sparkles className="mr-1 h-3.5 w-3.5" />
// //                     AI-Powered Content Creation
// //                   </div>
// //                   <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
// //                     Create Instagram-Ready Posts with AI
// //                   </h1>
// //                   <p className="max-w-[600px] text-muted-foreground md:text-xl">
// //                     Grow your Instagram following 3x faster with AI-generated content that's always on-brand. Save 15+
// //                     hours per week while increasing engagement by up to 47%.
// //                   </p>
// //                 </div>
// //                 <div className="flex flex-col gap-2 min-[400px]:flex-row">
// //                   {isLoggedIn ? (
// //                     <Link href="/dashboard">
// //                       <Button
// //                         size="lg"
// //                         className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all hover:shadow-purple-300"
// //                       >
// //                         Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
// //                       </Button>
// //                     </Link>
// //                   ) : (
// //                     <Link href="/signup">
// //                       <Button
// //                         size="lg"
// //                         className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all hover:shadow-purple-300"
// //                       >
// //                         Get Started <ArrowRight className="ml-2 h-4 w-4" />
// //                       </Button>
// //                     </Link>
// //                   )}
// //                   <Button size="lg" variant="outline" className="border-purple-200 hover:bg-purple-100 transition-all">
// //                     <Instagram className="mr-2 h-4 w-4" /> Connect Instagram
// //                   </Button>
// //                 </div>
// //                 <div className="flex flex-wrap items-center gap-4 text-sm">
// //                   <div className="flex items-center space-x-1">
// //                     <div className="rounded-full bg-green-100 p-1">
// //                       <Check className="h-3 w-3 text-green-600" />
// //                     </div>
// //                     <span>AI-Generated Images</span>
// //                   </div>
// //                   <div className="flex items-center space-x-1">
// //                     <div className="rounded-full bg-green-100 p-1">
// //                       <Check className="h-3 w-3 text-green-600" />
// //                     </div>
// //                     <span>Smart Captions</span>
// //                   </div>
// //                   <div className="flex items-center space-x-1">
// //                     <div className="rounded-full bg-green-100 p-1">
// //                       <Check className="h-3 w-3 text-green-600" />
// //                     </div>
// //                     <span>Brand Consistency</span>
// //                   </div>
// //                 </div>
// //               </div>
// //               <div className="flex items-center justify-center">
// //                 <div className="relative aspect-video overflow-hidden rounded-xl border bg-background shadow-xl transition-all hover:shadow-2xl">
// //                   <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5 z-10"></div>
// //                   <Image
// //                     src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dashboard-8Tm8nHGL89T4RXx8qzYAAN9kbJJ2NO.png"
// //                     alt="BrandStudioAI Dashboard"
// //                     width={700}
// //                     height={400}
// //                     className="object-cover"
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-white">
// //           <div className="container px-4 md:px-6">
// //             <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
// //               <div className="space-y-2">
// //                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
// //                   Growth Impact
// //                 </div>
// //                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
// //                   Supercharge Your Social Media Growth
// //                 </h2>
// //                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// //                   See how BrandStudioAI transforms your Instagram presence with consistent, high-quality content
// //                 </p>
// //               </div>
// //             </div>

// //             <div className="grid gap-8 md:grid-cols-3">
// //               <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-purple-100 shadow-sm">
// //                 <div className="rounded-full w-16 h-16 bg-purple-100 flex items-center justify-center mb-4">
// //                   <svg
// //                     xmlns="http://www.w3.org/2000/svg"
// //                     width="24"
// //                     height="24"
// //                     viewBox="0 0 24 24"
// //                     fill="none"
// //                     stroke="currentColor"
// //                     strokeWidth="2"
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     className="h-8 w-8 text-purple-600"
// //                   >
// //                     <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
// //                   </svg>
// //                 </div>
// //                 <h3 className="text-2xl font-bold mb-2">47%</h3>
// //                 <p className="text-xl font-semibold text-purple-600 mb-2">Higher Engagement</p>
// //                 <p className="text-muted-foreground">
// //                   Users report an average 47% increase in likes, comments, and shares after just 30 days
// //                 </p>
// //               </div>

// //               <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-purple-100 shadow-sm">
// //                 <div className="rounded-full w-16 h-16 bg-purple-100 flex items-center justify-center mb-4">
// //                   <svg
// //                     xmlns="http://www.w3.org/2000/svg"
// //                     width="24"
// //                     height="24"
// //                     viewBox="0 0 24 24"
// //                     fill="none"
// //                     stroke="currentColor"
// //                     strokeWidth="2"
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     className="h-8 w-8 text-purple-600"
// //                   >
// //                     <path d="M12 2v20" />
// //                     <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
// //                   </svg>
// //                 </div>
// //                 <h3 className="text-2xl font-bold mb-2">15+ Hours</h3>
// //                 <p className="text-xl font-semibold text-purple-600 mb-2">Saved Weekly</p>
// //                 <p className="text-muted-foreground">
// //                   Eliminate the time spent on content creation, design, and scheduling with our automated workflow
// //                 </p>
// //               </div>

// //               <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-purple-100 shadow-sm">
// //                 <div className="rounded-full w-16 h-16 bg-purple-100 flex items-center justify-center mb-4">
// //                   <svg
// //                     xmlns="http://www.w3.org/2000/svg"
// //                     width="24"
// //                     height="24"
// //                     viewBox="0 0 24 24"
// //                     fill="none"
// //                     stroke="currentColor"
// //                     strokeWidth="2"
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     className="h-8 w-8 text-purple-600"
// //                   >
// //                     <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
// //                     <circle cx="9" cy="7" r="4" />
// //                     <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
// //                     <path d="M16 3.13a4 4 0 0 1 0 7.75" />
// //                   </svg>
// //                 </div>
// //                 <h3 className="text-2xl font-bold mb-2">3x</h3>
// //                 <p className="text-xl font-semibold text-purple-600 mb-2">Faster Follower Growth</p>
// //                 <p className="text-muted-foreground">
// //                   Consistent, high-quality content helps you grow your audience three times faster than manual posting
// //                 </p>
// //               </div>
// //             </div>

// //             <div className="mt-16 grid gap-8 md:grid-cols-2">
// //               <div className="bg-white p-8 rounded-xl border border-purple-100 shadow-sm">
// //                 <h3 className="text-xl font-bold mb-4">Why Consistency Is Key to Instagram Growth</h3>
// //                 <ul className="space-y-3">
// //                   <li className="flex items-start">
// //                     <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
// //                       <svg
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         className="h-3 w-3 text-green-600"
// //                       >
// //                         <polyline points="20 6 9 17 4 12" />
// //                       </svg>
// //                     </div>
// //                     <p>Instagram's algorithm favors accounts that post regularly</p>
// //                   </li>
// //                   <li className="flex items-start">
// //                     <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
// //                       <svg
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         className="h-3 w-3 text-green-600"
// //                       >
// //                         <polyline points="20 6 9 17 4 12" />
// //                       </svg>
// //                     </div>
// //                     <p>Consistent posting increases your discoverability in feeds and search</p>
// //                   </li>
// //                   <li className="flex items-start">
// //                     <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
// //                       <svg
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         className="h-3 w-3 text-green-600"
// //                       >
// //                         <polyline points="20 6 9 17 4 12" />
// //                       </svg>
// //                     </div>
// //                     <p>Regular content builds audience trust and strengthens brand recognition</p>
// //                   </li>
// //                   <li className="flex items-start">
// //                     <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
// //                       <svg
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         className="h-3 w-3 text-green-600"
// //                       >
// //                         <polyline points="20 6 9 17 4 12" />
// //                       </svg>
// //                     </div>
// //                     <p>BrandStudioAI ensures you never miss a posting opportunity</p>
// //                   </li>
// //                 </ul>
// //               </div>

// //               <div className="bg-white p-8 rounded-xl border border-purple-100 shadow-sm">
// //                 <h3 className="text-xl font-bold mb-4">How AI-Generated Content Drives Growth</h3>
// //                 <ul className="space-y-3">
// //                   <li className="flex items-start">
// //                     <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
// //                       <svg
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         className="h-3 w-3 text-green-600"
// //                       >
// //                         <polyline points="20 6 9 17 4 12" />
// //                       </svg>
// //                     </div>
// //                     <p>AI analyzes top-performing content in your niche for inspiration</p>
// //                   </li>
// //                   <li className="flex items-start">
// //                     <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
// //                       <svg
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         className="h-3 w-3 text-green-600"
// //                       >
// //                         <polyline points="20 6 9 17 4 12" />
// //                       </svg>
// //                     </div>
// //                     <p>Captions are optimized for engagement with trending hashtags</p>
// //                   </li>
// //                   <li className="flex items-start">
// //                     <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
// //                       <svg
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         className="h-3 w-3 text-green-600"
// //                       >
// //                         <polyline points="20 6 9 17 4 12" />
// //                       </svg>
// //                     </div>
// //                     <p>Images are created to match current visual trends while staying on-brand</p>
// //                   </li>
// //                   <li className="flex items-start">
// //                     <div className="rounded-full bg-green-100 p-1 mr-3 mt-1">
// //                       <svg
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         className="h-3 w-3 text-green-600"
// //                       >
// //                         <polyline points="20 6 9 17 4 12" />
// //                       </svg>
// //                     </div>
// //                     <p>Posting schedule is optimized for when your audience is most active</p>
// //                   </li>
// //                 </ul>
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
// //           <div className="container px-4 md:px-6">
// //             <div className="flex flex-col items-center justify-center space-y-4 text-center">
// //               <div className="space-y-2">
// //                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
// //                   Video Tour
// //                 </div>
// //                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">See BrandStudioAI in action</h2>
// //                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// //                   Watch how easy it is to create, manage, and schedule Instagram content with our AI-powered platform
// //                 </p>
// //               </div>
// //             </div>

// //             <div className="mx-auto max-w-4xl mt-12">
// //               <div className="relative aspect-video overflow-hidden rounded-xl border shadow-xl bg-black">
// //                 {/* Video Thumbnail with Play Button Overlay */}
// //                 <div className="absolute inset-0 flex items-center justify-center z-10 group cursor-pointer">
// //                   <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm group-hover:bg-purple-600 transition-all duration-300 group-hover:scale-110">
// //                     <svg
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       width="24"
// //                       height="24"
// //                       viewBox="0 0 24 24"
// //                       fill="none"
// //                       stroke="currentColor"
// //                       strokeWidth="2"
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       className="h-10 w-10 text-white"
// //                     >
// //                       <polygon points="5 3 19 12 5 21 5 3" />
// //                     </svg>
// //                   </div>
// //                   <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>
// //                 </div>

// //                 {/* Video Thumbnail Image */}
// //                 <Image
// //                   src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dashboard-8Tm8nHGL89T4RXx8qzYAAN9kbJJ2NO.png"
// //                   alt="BrandStudioAI Video Tutorial"
// //                   width={1280}
// //                   height={720}
// //                   className="object-cover"
// //                 />

// //                 {/* This would be replaced with an actual video player in production */}
// //                 {/* <iframe 
// //                   width="100%" 
// //                   height="100%" 
// //                   src="https://www.youtube.com/embed/your-video-id" 
// //                   title="BrandStudioAI Tutorial" 
// //                   frameBorder="0" 
// //                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
// //                   allowFullScreen
// //                   className="absolute inset-0"
// //                 ></iframe> */}
// //               </div>

// //               <div className="mt-8 grid gap-6 md:grid-cols-3">
// //                 <div className="flex flex-col items-center text-center p-4 rounded-lg">
// //                   <div className="rounded-full bg-purple-100 p-3 mb-4">
// //                     <svg
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       width="24"
// //                       height="24"
// //                       viewBox="0 0 24 24"
// //                       fill="none"
// //                       stroke="currentColor"
// //                       strokeWidth="2"
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       className="h-6 w-6 text-purple-600"
// //                     >
// //                       <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
// //                       <polyline points="14 2 14 8 20 8" />
// //                       <path d="M12 18v-6" />
// //                       <path d="m9 15 3 3 3-3" />
// //                     </svg>
// //                   </div>
// //                   <h3 className="text-lg font-bold">Create Brand Kits</h3>
// //                   <p className="text-sm text-muted-foreground mt-2">
// //                     Set up your brand identity in minutes with our intuitive brand kit manager
// //                   </p>
// //                 </div>

// //                 <div className="flex flex-col items-center text-center p-4 rounded-lg">
// //                   <div className="rounded-full bg-purple-100 p-3 mb-4">
// //                     <svg
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       width="24"
// //                       height="24"
// //                       viewBox="0 0 24 24"
// //                       fill="none"
// //                       stroke="currentColor"
// //                       strokeWidth="2"
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       className="h-6 w-6 text-purple-600"
// //                     >
// //                       <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
// //                       <path d="M12 8v-2" />
// //                       <path d="M12 18v-2" />
// //                       <path d="M8 12H6" />
// //                       <path d="M18 12h-2" />
// //                       <path d="m8.93 8.93-1.41-1.41" />
// //                       <path d="m15.07 15.07-1.41-1.41" />
// //                       <path d="m15.07 8.93 1.41-1.41" />
// //                       <path d="m8.93 15.07 1.41-1.41" />
// //                     </svg>
// //                   </div>
// //                   <h3 className="text-lg font-bold">Generate Content</h3>
// //                   <p className="text-sm text-muted-foreground mt-2">
// //                     Let AI create stunning images and captions that match your brand style
// //                   </p>
// //                 </div>

// //                 <div className="flex flex-col items-center text-center p-4 rounded-lg">
// //                   <div className="rounded-full bg-purple-100 p-3 mb-4">
// //                     <svg
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       width="24"
// //                       height="24"
// //                       viewBox="0 0 24 24"
// //                       fill="none"
// //                       stroke="currentColor"
// //                       strokeWidth="2"
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       className="h-6 w-6 text-purple-600"
// //                     >
// //                       <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
// //                       <line x1="16" x2="16" y1="2" y2="6" />
// //                       <line x1="8" x2="8" y1="2" y2="6" />
// //                       <line x1="3" x2="21" y1="10" y2="10" />
// //                       <path d="M8 14h.01" />
// //                       <path d="M12 14h.01" />
// //                       <path d="M16 14h.01" />
// //                       <path d="M8 18h.01" />
// //                       <path d="M12 18h.01" />
// //                       <path d="M16 18h.01" />
// //                     </svg>
// //                   </div>
// //                   <h3 className="text-lg font-bold">Schedule & Publish</h3>
// //                   <p className="text-sm text-muted-foreground mt-2">
// //                     Plan your content calendar and publish directly to Instagram
// //                   </p>
// //                 </div>
// //               </div>

// //               <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
// //                 <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
// //                   Start Free Trial
// //                 </Button>
// //                 <Button variant="outline" size="lg">
// //                   Book a Demo
// //                 </Button>
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-white">
// //           <div className="container px-4 md:px-6">
// //             <div className="flex flex-col items-center justify-center space-y-4 text-center">
// //               <div className="space-y-2">
// //                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
// //                   Features
// //                 </div>
// //                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
// //                   Everything you need for Instagram success
// //                 </h2>
// //                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// //                   BrandStudioAI combines AI-powered content generation with powerful management tools to streamline your
// //                   social media workflow.
// //                 </p>
// //               </div>
// //             </div>
// //             <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
// //               <Card className="group overflow-hidden border-purple-100 transition-all hover:border-purple-200 hover:shadow-md">
// //                 <CardHeader>
// //                   <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
// //                     <svg
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       width="24"
// //                       height="24"
// //                       viewBox="0 0 24 24"
// //                       fill="none"
// //                       stroke="currentColor"
// //                       strokeWidth="2"
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       className="h-6 w-6 text-purple-600"
// //                     >
// //                       <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
// //                       <path d="M18 14h-8" />
// //                       <path d="M15 18h-5" />
// //                       <path d="M10 6h8v4h-8V6Z" />
// //                     </svg>
// //                   </div>
// //                   <CardTitle>Brand Kit Management</CardTitle>
// //                   <CardDescription>
// //                     Create and manage brand kits with your brand's name, colors, tone, and logo.
// //                   </CardDescription>
// //                 </CardHeader>
// //                 <CardContent>
// //                   <div className="aspect-video overflow-hidden rounded-lg border border-purple-100 transition-all group-hover:border-purple-200">
// //                     <Image
// //                       src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brand-kit-fqATE6cTccLEZjufVBRGQZfuST05JY.png"
// //                       alt="Brand Kit Manager"
// //                       width={400}
// //                       height={225}
// //                       className="object-cover transition-transform group-hover:scale-105"
// //                     />
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //               <Card className="group overflow-hidden border-purple-100 transition-all hover:border-purple-200 hover:shadow-md">
// //                 <CardHeader>
// //                   <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
// //                     <svg
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       width="24"
// //                       height="24"
// //                       viewBox="0 0 24 24"
// //                       fill="none"
// //                       stroke="currentColor"
// //                       strokeWidth="2"
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       className="h-6 w-6 text-purple-600"
// //                     >
// //                       <path d="M12 2H2v10h10V2Z" />
// //                       <path d="M12 12H2v10h10V12Z" />
// //                       <path d="M22 2h-10v20h10V2Z" />
// //                     </svg>
// //                   </div>
// //                   <CardTitle>AI-Powered Post Generation</CardTitle>
// //                   <CardDescription>
// //                     Generate Instagram posts with captions and images that match your brand style.
// //                   </CardDescription>
// //                 </CardHeader>
// //                 <CardContent>
// //                   <div className="aspect-video overflow-hidden rounded-lg border border-purple-100 transition-all group-hover:border-purple-200">
// //                     <Image
// //                       src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-post-lUIx1DtfNNcsqQhFi2u6fkfmr74DW0.png"
// //                       alt="Instagram Posts"
// //                       width={400}
// //                       height={225}
// //                       className="object-cover transition-transform group-hover:scale-105"
// //                     />
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //               <Card className="group overflow-hidden border-purple-100 transition-all hover:border-purple-200 hover:shadow-md">
// //                 <CardHeader>
// //                   <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
// //                     <svg
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       width="24"
// //                       height="24"
// //                       viewBox="0 0 24 24"
// //                       fill="none"
// //                       stroke="currentColor"
// //                       strokeWidth="2"
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       className="h-6 w-6 text-purple-600"
// //                     >
// //                       <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
// //                       <line x1="16" x2="16" y1="2" y2="6" />
// //                       <line x1="8" x2="8" y1="2" y2="6" />
// //                       <line x1="3" x2="21" y1="10" y2="10" />
// //                       <path d="M8 14h.01" />
// //                       <path d="M12 14h.01" />
// //                       <path d="M16 14h.01" />
// //                       <path d="M8 18h.01" />
// //                       <path d="M12 18h.01" />
// //                       <path d="M16 18h.01" />
// //                     </svg>
// //                   </div>
// //                   <CardTitle>Post Scheduling</CardTitle>
// //                   <CardDescription>Plan and schedule your posts with an intuitive calendar interface.</CardDescription>
// //                 </CardHeader>
// //                 <CardContent>
// //                   <div className="aspect-video overflow-hidden rounded-lg border border-purple-100 transition-all group-hover:border-purple-200">
// //                     <Image
// //                       src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/schedule-XX7MmZx9vXoYiL7guvMGYmfgiXj4SU.png"
// //                       alt="Post Scheduling"
// //                       width={400}
// //                       height={225}
// //                       className="object-cover transition-transform group-hover:scale-105"
// //                     />
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //               <Card className="group overflow-hidden border-purple-100 transition-all hover:border-purple-200 hover:shadow-md">
// //                 <CardHeader>
// //                   <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
// //                     <svg
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       width="24"
// //                       height="24"
// //                       viewBox="0 0 24 24"
// //                       fill="none"
// //                       stroke="currentColor"
// //                       strokeWidth="2"
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       className="h-6 w-6 text-purple-600"
// //                     >
// //                       <path d="M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4" />
// //                       <rect width="10" height="7" x="12" y="13" rx="2" />
// //                     </svg>
// //                   </div>
// //                   <CardTitle>Content Management</CardTitle>
// //                   <CardDescription>Manage all your generated content from a central dashboard.</CardDescription>
// //                 </CardHeader>
// //                 <CardContent>
// //                   <div className="aspect-video overflow-hidden rounded-lg border border-purple-100 transition-all group-hover:border-purple-200">
// //                     <Image
// //                       src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/summary-7H32Oso9LcuhsAwQRHL2U4foVG6hcf.png"
// //                       alt="Content Management"
// //                       width={400}
// //                       height={225}
// //                       className="object-cover transition-transform group-hover:scale-105"
// //                     />
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //               <Card className="group overflow-hidden border-purple-100 transition-all hover:border-purple-200 hover:shadow-md">
// //                 <CardHeader>
// //                   <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
// //                     <svg
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       width="24"
// //                       height="24"
// //                       viewBox="0 0 24 24"
// //                       fill="none"
// //                       stroke="currentColor"
// //                       strokeWidth="2"
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       className="h-6 w-6 text-purple-600"
// //                     >
// //                       <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
// //                       <path d="M14 2v4a2 2 0 0 0 2 2h4" />
// //                       <path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1" />
// //                       <path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" />
// //                     </svg>
// //                   </div>
// //                   <CardTitle>Post Preview</CardTitle>
// //                   <CardDescription>Preview how your posts will look on Instagram before publishing.</CardDescription>
// //                 </CardHeader>
// //                 <CardContent>
// //                   <div className="aspect-video overflow-hidden rounded-lg border border-purple-100 transition-all group-hover:border-purple-200">
// //                     <Image
// //                       src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/before-scheduling-75fSYTvdCxq4qbVSN1WwB2s5Ae407l.png"
// //                       alt="Post Preview"
// //                       width={400}
// //                       height={225}
// //                       className="object-cover transition-transform group-hover:scale-105"
// //                     />
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //               <Card className="group overflow-hidden border-purple-100 transition-all hover:border-purple-200 hover:shadow-md">
// //                 <CardHeader>
// //                   <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
// //                     <svg
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       width="24"
// //                       height="24"
// //                       viewBox="0 0 24 24"
// //                       fill="none"
// //                       stroke="currentColor"
// //                       strokeWidth="2"
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       className="h-6 w-6 text-purple-600"
// //                     >
// //                       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
// //                       <polyline points="7 10 12 15 17 10" />
// //                       <line x1="12" x2="12" y1="15" y2="3" />
// //                     </svg>
// //                   </div>
// //                   <CardTitle>Export & Publish</CardTitle>
// //                   <CardDescription>Export your content or publish directly to Instagram.</CardDescription>
// //                 </CardHeader>
// //                 <CardContent>
// //                   <div className="aspect-video overflow-hidden rounded-lg border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center justify-center transition-all group-hover:border-purple-200">
// //                     <Instagram className="h-12 w-12 text-purple-600" />
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             </div>
// //           </div>
// //         </section>

// //         <section id="demo" className="w-full py-12 md:py-24 lg:py-32">
// //           <div className="container px-4 md:px-6">
// //             <div className="flex flex-col items-center justify-center space-y-4 text-center">
// //               <div className="space-y-2">
// //                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
// //                   How It Works
// //                 </div>
// //                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
// //                   Streamline your social media workflow
// //                 </h2>
// //                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// //                   See how BrandStudioAI helps you create, manage, and publish Instagram content.
// //                 </p>
// //               </div>
// //             </div>
// //             <div className="mx-auto max-w-5xl mt-12">
// //               <Tabs defaultValue="create" className="w-full">
// //                 <TabsList className="grid w-full grid-cols-3">
// //                   <TabsTrigger value="create">Create</TabsTrigger>
// //                   <TabsTrigger value="manage">Manage</TabsTrigger>
// //                   <TabsTrigger value="schedule">Schedule</TabsTrigger>
// //                 </TabsList>
// //                 <TabsContent value="create" className="mt-6">
// //                   <div className="flex flex-col gap-8 md:flex-row">
// //                     <div className="flex-1 space-y-4">
// //                       <h3 className="text-2xl font-bold">Create Content</h3>
// //                       <p className="text-muted-foreground">
// //                         Choose a content type, select your brand kit, and let AI generate posts that match your brand
// //                         identity.
// //                       </p>
// //                       <ul className="space-y-2">
// //                         <li className="flex items-start">
// //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                           <span>Generate multiple posts with a single click</span>
// //                         </li>
// //                         <li className="flex items-start">
// //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                           <span>AI creates both images and captions</span>
// //                         </li>
// //                         <li className="flex items-start">
// //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                           <span>Consistent with your brand guidelines</span>
// //                         </li>
// //                       </ul>
// //                     </div>
// //                     <div className="flex-1">
// //                       <div className="overflow-hidden rounded-xl border shadow-lg">
// //                         <Image
// //                           src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dashboard-8Tm8nHGL89T4RXx8qzYAAN9kbJJ2NO.png"
// //                           alt="Create Content"
// //                           width={600}
// //                           height={400}
// //                           className="object-cover"
// //                         />
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </TabsContent>
// //                 <TabsContent value="manage" className="mt-6">
// //                   <div className="flex flex-col gap-8 md:flex-row">
// //                     <div className="flex-1 space-y-4">
// //                       <h3 className="text-2xl font-bold">Manage Content</h3>
// //                       <p className="text-muted-foreground">
// //                         View, edit, and organize all your generated posts from a central dashboard.
// //                       </p>
// //                       <ul className="space-y-2">
// //                         <li className="flex items-start">
// //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                           <span>Edit captions and regenerate content</span>
// //                         </li>
// //                         <li className="flex items-start">
// //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                           <span>Filter and search through your content</span>
// //                         </li>
// //                         <li className="flex items-start">
// //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                           <span>Export content in various formats</span>
// //                         </li>
// //                       </ul>
// //                     </div>
// //                     <div className="flex-1">
// //                       <div className="overflow-hidden rounded-xl border shadow-lg">
// //                         <Image
// //                           src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/summary-7H32Oso9LcuhsAwQRHL2U4foVG6hcf.png"
// //                           alt="Manage Content"
// //                           width={600}
// //                           height={400}
// //                           className="object-cover"
// //                         />
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </TabsContent>
// //                 <TabsContent value="schedule" className="mt-6">
// //                   <div className="flex flex-col gap-8 md:flex-row">
// //                     <div className="flex-1 space-y-4">
// //                       <h3 className="text-2xl font-bold">Schedule Posts</h3>
// //                       <p className="text-muted-foreground">
// //                         Plan your content calendar and schedule posts for optimal engagement.
// //                       </p>
// //                       <ul className="space-y-2">
// //                         <li className="flex items-start">
// //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                           <span>Drag-and-drop scheduling interface</span>
// //                         </li>
// //                         <li className="flex items-start">
// //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                           <span>Weekly and monthly calendar views</span>
// //                         </li>
// //                         <li className="flex items-start">
// //                           <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                           <span>Automatic posting at scheduled times</span>
// //                         </li>
// //                       </ul>
// //                     </div>
// //                     <div className="flex-1">
// //                       <div className="overflow-hidden rounded-xl border shadow-lg">
// //                         <Image
// //                           src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/schedule-XX7MmZx9vXoYiL7guvMGYmfgiXj4SU.png"
// //                           alt="Schedule Posts"
// //                           width={600}
// //                           height={400}
// //                           className="object-cover"
// //                         />
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </TabsContent>
// //               </Tabs>
// //             </div>
// //           </div>
// //         </section>

// //         <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50">
// //           <div className="container px-4 md:px-6">
// //             <div className="flex flex-col items-center justify-center space-y-4 text-center">
// //               <div className="space-y-2">
// //                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
// //                   Video Tutorials
// //                 </div>
// //                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
// //                   Learn how to use BrandStudioAI
// //                 </h2>
// //                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// //                   Detailed video tutorials to help you get the most out of our platform
// //                 </p>
// //               </div>
// //             </div>

// //             <div className="mx-auto max-w-6xl mt-12 grid gap-8 md:grid-cols-2">
// //               <div className="flex flex-col space-y-4">
// //                 <div className="relative aspect-video overflow-hidden rounded-xl border shadow-lg bg-black">
// //                   <div className="absolute inset-0 flex items-center justify-center z-10 group cursor-pointer">
// //                     <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm group-hover:bg-purple-600 transition-all duration-300 group-hover:scale-110">
// //                       <svg
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         className="h-6 w-6 text-white"
// //                       >
// //                         <polygon points="5 3 19 12 5 21 5 3" />
// //                       </svg>
// //                     </div>
// //                     <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>
// //                   </div>

// //                   <Image
// //                     src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brand-kit-fqATE6cTccLEZjufVBRGQZfuST05JY.png"
// //                     alt="Creating Brand Kits Tutorial"
// //                     width={640}
// //                     height={360}
// //                     className="object-cover"
// //                   />
// //                 </div>
// //                 <h3 className="text-xl font-bold">Creating Brand Kits</h3>
// //                 <p className="text-muted-foreground">
// //                   Learn how to set up your brand identity with colors, tone, and logo for consistent content generation.
// //                 </p>
// //               </div>

// //               <div className="flex flex-col space-y-4">
// //                 <div className="relative aspect-video overflow-hidden rounded-xl border shadow-lg bg-black">
// //                   <div className="absolute inset-0 flex items-center justify-center z-10 group cursor-pointer">
// //                     <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm group-hover:bg-purple-600 transition-all duration-300 group-hover:scale-110">
// //                       <svg
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         className="h-6 w-6 text-white"
// //                       >
// //                         <polygon points="5 3 19 12 5 21 5 3" />
// //                       </svg>
// //                     </div>
// //                     <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>
// //                   </div>

// //                   <Image
// //                     src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-post-lUIx1DtfNNcsqQhFi2u6fkfmr74DW0.png"
// //                     alt="Generating Instagram Posts Tutorial"
// //                     width={640}
// //                     height={360}
// //                     className="object-cover"
// //                   />
// //                 </div>
// //                 <h3 className="text-xl font-bold">Generating Instagram Posts</h3>
// //                 <p className="text-muted-foreground">
// //                   See how to use AI to create engaging images and captions that align with your brand identity.
// //                 </p>
// //               </div>

// //               <div className="flex flex-col space-y-4">
// //                 <div className="relative aspect-video overflow-hidden rounded-xl border shadow-lg bg-black">
// //                   <div className="absolute inset-0 flex items-center justify-center z-10 group cursor-pointer">
// //                     <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm group-hover:bg-purple-600 transition-all duration-300 group-hover:scale-110">
// //                       <svg
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         className="h-6 w-6 text-white"
// //                       >
// //                         <polygon points="5 3 19 12 5 21 5 3" />
// //                       </svg>
// //                     </div>
// //                     <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>
// //                   </div>

// //                   <Image
// //                     src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/schedule-XX7MmZx9vXoYiL7guvMGYmfgiXj4SU.png"
// //                     alt="Scheduling Content Tutorial"
// //                     width={640}
// //                     height={360}
// //                     className="object-cover"
// //                   />
// //                 </div>
// //                 <h3 className="text-xl font-bold">Scheduling Content</h3>
// //                 <p className="text-muted-foreground">
// //                   Master the drag-and-drop scheduling interface to plan your content calendar effectively.
// //                 </p>
// //               </div>

// //               <div className="flex flex-col space-y-4">
// //                 <div className="relative aspect-video overflow-hidden rounded-xl border shadow-lg bg-black">
// //                   <div className="absolute inset-0 flex items-center justify-center z-10 group cursor-pointer">
// //                     <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm group-hover:bg-purple-600 transition-all duration-300 group-hover:scale-110">
// //                       <svg
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         className="h-6 w-6 text-white"
// //                       >
// //                         <polygon points="5 3 19 12 5 21 5 3" />
// //                       </svg>
// //                     </div>
// //                     <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>
// //                   </div>

// //                   <Image
// //                     src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/summary-7H32Oso9LcuhsAwQRHL2U4foVG6hcf.png"
// //                     alt="Analytics and Reporting Tutorial"
// //                     width={640}
// //                     height={360}
// //                     className="object-cover"
// //                   />
// //                 </div>
// //                 <h3 className="text-xl font-bold">Analytics and Reporting</h3>
// //                 <p className="text-muted-foreground">
// //                   Learn how to track performance and optimize your content strategy with our analytics tools.
// //                 </p>
// //               </div>
// //             </div>

// //             <div className="mt-12 text-center">
// //               <p className="text-muted-foreground mb-6">Subscribe to our YouTube channel for more tutorials and tips</p>
// //               <Button className="bg-red-600 hover:bg-red-700">
// //                 <svg
// //                   xmlns="http://www.w3.org/2000/svg"
// //                   width="24"
// //                   height="24"
// //                   viewBox="0 0 24 24"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   strokeWidth="2"
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   className="h-5 w-5 mr-2"
// //                 >
// //                   <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
// //                   <path d="m10 15 5-3-5-3z" />
// //                 </svg>
// //                 Subscribe to YouTube
// //               </Button>
// //             </div>
// //           </div>
// //         </section>

// //         <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
// //           <div className="container px-4 md:px-6">
// //             <div className="flex flex-col items-center justify-center space-y-4 text-center">
// //               <div className="space-y-2">
// //                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
// //                   Pricing
// //                 </div>
// //                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
// //                   Choose the plan that's right for you
// //                 </h2>
// //                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// //                   Affordable plans for businesses of all sizes. Start creating today.
// //                 </p>
// //               </div>
// //             </div>
// //             <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-12">
// //               <Card className="flex flex-col">
// //                 <CardHeader>
// //                   <CardTitle>Starter</CardTitle>
// //                   <CardDescription>Perfect for small businesses and solopreneurs.</CardDescription>
// //                   <div className="mt-4 flex items-baseline text-5xl font-bold">
// //                     $7.99
// //                     <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
// //                   </div>
// //                 </CardHeader>
// //                 <CardContent className="flex-1">
// //                   <ul className="space-y-2 text-sm">
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>100 brand advertisements monthly</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>GPT-Image-1 powered visuals (Low quality)</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>Unique GPT-3.5 Turbo captions</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>Logo placement</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>Basic image sizes (1024x1024)</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>7-day image storage</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>Email support</span>
// //                     </li>
// //                   </ul>
// //                 </CardContent>
// //                 <CardFooter>
// //                   {isLoggedIn ? (
// //                     <Button className="w-full bg-purple-600 hover:bg-purple-700">Upgrade Plan</Button>
// //                   ) : (
// //                     <Link href="/signup" className="w-full">
// //                       <Button className="w-full bg-purple-600 hover:bg-purple-700">Get Started</Button>
// //                     </Link>
// //                   )}
// //                 </CardFooter>
// //               </Card>
// //               <Card className="flex flex-col border-purple-600 shadow-lg">
// //                 <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white">
// //                   Most Popular
// //                 </div>
// //                 <CardHeader>
// //                   <CardTitle>Professional</CardTitle>
// //                   <CardDescription>For growing businesses and marketing agencies.</CardDescription>
// //                   <div className="mt-4 flex items-baseline text-5xl font-bold">
// //                     $19.99
// //                     <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
// //                   </div>
// //                 </CardHeader>
// //                 <CardContent className="flex-1">
// //                   <ul className="space-y-2 text-sm">
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>200 brand advertisements monthly</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>Medium quality image generation</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>Priority image processing</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>Premium image sizes (1024x1536, 1536x1024)</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>Custom text overlay options</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>Batch processing (up to 10 ads at once)</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>30-day image storage</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>Chat support</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>Basic analytics</span>
// //                     </li>
// //                   </ul>
// //                 </CardContent>
// //                 <CardFooter>
// //                   {isLoggedIn ? (
// //                     <Button className="w-full bg-purple-600 hover:bg-purple-700">Upgrade Plan</Button>
// //                   ) : (
// //                     <Link href="/signup" className="w-full">
// //                       <Button className="w-full bg-purple-600 hover:bg-purple-700">Get Started</Button>
// //                     </Link>
// //                   )}
// //                 </CardFooter>
// //               </Card>
// //               <Card className="flex flex-col">
// //                 <CardHeader>
// //                   <CardTitle>Enterprise</CardTitle>
// //                   <CardDescription>For marketing agencies and large brands.</CardDescription>
// //                   <div className="mt-4 flex items-baseline text-5xl font-bold">
// //                     $99.99
// //                     <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
// //                   </div>
// //                 </CardHeader>
// //                 <CardContent className="flex-1">
// //                   <ul className="space-y-2 text-sm">
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>500 brand advertisements monthly</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>High quality image generation</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>Highest priority processing</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>All available image sizes and formats</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>Advanced batch processing (up to 50 ads)</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>API access for integration</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>Custom brand voice profiles</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>90-day image storage</span>
// //                     </li>
// //                     <li className="flex items-start">
// //                       <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
// //                       <span>Dedicated account manager</span>
// //                     </li>
// //                   </ul>
// //                 </CardContent>
// //                 <CardFooter>
// //                   {isLoggedIn ? (
// //                     <Button className="w-full bg-purple-600 hover:bg-purple-700">Upgrade Plan</Button>
// //                   ) : (
// //                     <Link href="/signup" className="w-full">
// //                       <Button className="w-full bg-purple-600 hover:bg-purple-700">Get Started</Button>
// //                     </Link>
// //                   )}
// //                 </CardFooter>
// //               </Card>
// //             </div>
// //           </div>
// //         </section>

// //         <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50">
// //           <div className="container px-4 md:px-6">
// //             <div className="flex flex-col items-center justify-center space-y-4 text-center">
// //               <div className="space-y-2">
// //                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
// //                   Success Stories
// //                 </div>
// //                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
// //                   Real Growth from Real Customers
// //                 </h2>
// //                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// //                   See how businesses are transforming their Instagram presence with BrandStudioAI
// //                 </p>
// //               </div>
// //             </div>

// //             <div className="mx-auto max-w-6xl mt-12 grid gap-8 md:grid-cols-3">
// //               <div className="flex flex-col bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
// //                 <div className="p-6">
// //                   <div className="flex items-center gap-4 mb-4">
// //                     <div className="rounded-full overflow-hidden h-12 w-12 border">
// //                       <Image
// //                         src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/testimonial-1-Yx9Nt9Yd9Nt9Yd9Nt9Yd9Nt9Yd9Nt9Y.jpg"
// //                         alt="Sarah Johnson"
// //                         width={48}
// //                         height={48}
// //                         className="object-cover"
// //                       />
// //                     </div>
// //                     <div>
// //                       <h3 className="font-bold">Sarah Johnson</h3>
// //                       <p className="text-sm text-muted-foreground">Marketing Director, TechFlow</p>
// //                     </div>
// //                   </div>
// //                   <div className="flex text-amber-400 mb-3">
// //                     {[...Array(5)].map((_, i) => (
// //                       <svg
// //                         key={i}
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="currentColor"
// //                         className="h-5 w-5"
// //                       >
// //                         <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
// //                       </svg>
// //                     ))}
// //                   </div>
// //                   <blockquote className="text-muted-foreground italic mb-4">
// //                     "BrandStudioAI saved us 20+ hours per week on content creation. Our engagement has increased by 45%
// //                     since we started using it, and we've seen a 32% growth in followers in just 3 months."
// //                   </blockquote>
// //                   <div className="flex items-center gap-3 text-sm font-medium">
// //                     <div className="flex items-center text-green-600">
// //                       <svg
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         className="mr-1 h-4 w-4"
// //                       >
// //                         <path d="m5 12 5 5 9-9" />
// //                       </svg>
// //                       <span>32% Follower Growth</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="flex flex-col bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
// //                 <div className="p-6">
// //                   <div className="flex items-center gap-4 mb-4">
// //                     <div className="rounded-full overflow-hidden h-12 w-12 border">
// //                       <Image
// //                         src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/testimonial-2-Yx9Nt9Yd9Nt9Yd9Nt9Yd9Nt9Yd9Nt9Y.jpg"
// //                         alt="Michael Chen"
// //                         width={48}
// //                         height={48}
// //                         className="object-cover"
// //                       />
// //                     </div>
// //                     <div>
// //                       <h3 className="font-bold">Michael Chen</h3>
// //                       <p className="text-sm text-muted-foreground">Founder, Wellness Collective</p>
// //                     </div>
// //                   </div>
// //                   <div className="flex text-amber-400 mb-3">
// //                     {[...Array(5)].map((_, i) => (
// //                       <svg
// //                         key={i}
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="currentColor"
// //                         className="h-5 w-5"
// //                       >
// //                         <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
// //                       </svg>
// //                     ))}
// //                   </div>
// //                   <blockquote className="text-muted-foreground italic mb-4">
// //                     "As a solopreneur, I couldn't afford a design team. BrandStudioAI gives me professional-looking
// //                     content that perfectly matches my brand. My follower count has tripled in 6 months, and sales
// //                     directly from Instagram are up 78%."
// //                   </blockquote>
// //                   <div className="flex items-center gap-3 text-sm font-medium">
// //                     <div className="flex items-center text-green-600">
// //                       <svg
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         className="mr-1 h-4 w-4"
// //                       >
// //                         <path d="m5 12 5 5 9-9" />
// //                       </svg>
// //                       <span>78% Sales Increase</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="flex flex-col bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
// //                 <div className="p-6">
// //                   <div className="flex items-center gap-4 mb-4">
// //                     <div className="rounded-full overflow-hidden h-12 w-12 border">
// //                       <Image
// //                         src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/testimonial-3-Yx9Nt9Yd9Nt9Yd9Nt9Yd9Nt9Yd9Nt9Y.jpg"
// //                         alt="Emma Rodriguez"
// //                         width={48}
// //                         height={48}
// //                         className="object-cover"
// //                       />
// //                     </div>
// //                     <div>
// //                       <h3 className="font-bold">Emma Rodriguez</h3>
// //                       <p className="text-sm text-muted-foreground">Social Media Manager, StyleHouse</p>
// //                     </div>
// //                   </div>
// //                   <div className="flex text-amber-400 mb-3">
// //                     {[...Array(5)].map((_, i) => (
// //                       <svg
// //                         key={i}
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="currentColor"
// //                         className="h-5 w-5"
// //                       >
// //                         <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
// //                       </svg>
// //                     ))}
// //                   </div>
// //                   <blockquote className="text-muted-foreground italic mb-4">
// //                     "The consistency in our posts has dramatically improved our brand recognition. Our engagement rate
// //                     went from 2.1% to 5.8% in just two months. We're now getting approached by brands for collaborations
// //                     thanks to our professional feed."
// //                   </blockquote>
// //                   <div className="flex items-center gap-3 text-sm font-medium">
// //                     <div className="flex items-center text-green-600">
// //                       <svg
// //                         xmlns="http://www.w3.org/2000/svg"
// //                         width="24"
// //                         height="24"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                         className="mr-1 h-4 w-4"
// //                       >
// //                         <path d="m5 12 5 5 9-9" />
// //                       </svg>
// //                       <span>176% Engagement Increase</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="mt-16 flex justify-center">
// //               <div className="bg-purple-50 rounded-xl p-8 max-w-3xl text-center">
// //                 <h3 className="text-2xl font-bold mb-4">The BrandStudioAI Advantage</h3>
// //                 <p className="text-muted-foreground mb-6">
// //                   Our AI doesn't just create content—it creates growth-focused content that's designed to increase your
// //                   followers, engagement, and ultimately, your business results.
// //                 </p>
// //                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
// //                   <div className="p-4">
// //                     <div className="text-3xl font-bold text-purple-600 mb-1">100%</div>
// //                     <div className="text-sm text-muted-foreground">Brand Consistency</div>
// //                   </div>
// //                   <div className="p-4">
// //                     <div className="text-3xl font-bold text-purple-600 mb-1">3x</div>
// //                     <div className="text-sm text-muted-foreground">Faster Growth</div>
// //                   </div>
// //                   <div className="p-4">
// //                     <div className="text-3xl font-bold text-purple-600 mb-1">47%</div>
// //                     <div className="text-sm text-muted-foreground">More Engagement</div>
// //                   </div>
// //                   <div className="p-4">
// //                     <div className="text-3xl font-bold text-purple-600 mb-1">15+</div>
// //                     <div className="text-sm text-muted-foreground">Hours Saved Weekly</div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
// //           <div className="container px-4 md:px-6">
// //             <div className="flex flex-col items-center justify-center space-y-4 text-center">
// //               <div className="space-y-2">
// //                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
// //                   FAQ
// //                 </div>
// //                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
// //                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// //                   Everything you need to know about BrandStudioAI
// //                 </p>
// //               </div>
// //             </div>
// //             <div className="mx-auto max-w-3xl mt-12 space-y-4">
// //               <Accordion type="single" collapsible className="w-full">
// //                 <AccordionItem value="item-1">
// //                   <AccordionTrigger className="text-left">What is BrandStudioAI?</AccordionTrigger>
// //                   <AccordionContent>
// //                     BrandStudioAI is an AI-powered platform for generating, managing, and previewing Instagram-ready
// //                     posts for brands. It leverages OpenAI for creative content generation and helps marketing teams,
// //                     agencies, and solo founders automate and streamline their social media content creation process.
// //                   </AccordionContent>
// //                 </AccordionItem>
// //                 <AccordionItem value="item-2">
// //                   <AccordionTrigger className="text-left">How does BrandStudioAI generate content?</AccordionTrigger>
// //                   <AccordionContent>
// //                     BrandStudioAI uses advanced AI models from OpenAI to generate both images and captions that match
// //                     your brand's style and tone. You create a Brand Kit with your brand details, and our AI uses this
// //                     information to create content that's consistent with your brand identity.
// //                   </AccordionContent>
// //                 </AccordionItem>
// //                 <AccordionItem value="item-3">
// //                   <AccordionTrigger className="text-left">Can I edit the generated content?</AccordionTrigger>
// //                   <AccordionContent>
// //                     Yes! All generated content can be edited. You can modify captions, regenerate images, and make any
// //                     adjustments needed before scheduling or publishing your posts.
// //                   </AccordionContent>
// //                 </AccordionItem>
// //                 <AccordionItem value="item-4">
// //                   <AccordionTrigger className="text-left">
// //                     How many posts can I generate with each plan?
// //                   </AccordionTrigger>
// //                   <AccordionContent>
// //                     The Starter plan includes 100 posts per month, the Professional plan includes 200 posts per month,
// //                     and the Enterprise plan includes 500 posts per month. If you need more, you can purchase additional
// //                     credits.
// //                   </AccordionContent>
// //                 </AccordionItem>
// //                 <AccordionItem value="item-5">
// //                   <AccordionTrigger className="text-left">Can I publish directly to Instagram?</AccordionTrigger>
// //                   <AccordionContent>
// //                     Yes, BrandStudioAI allows you to connect your Instagram account and publish posts directly from the
// //                     platform. You can also schedule posts for future publication at optimal times.
// //                   </AccordionContent>
// //                 </AccordionItem>
// //                 <AccordionItem value="item-6">
// //                   <AccordionTrigger className="text-left">What image quality can I expect?</AccordionTrigger>
// //                   <AccordionContent>
// //                     Image quality depends on your plan. The Starter plan provides low-quality images (1024x1024), the
// //                     Professional plan offers medium-quality images with more size options, and the Enterprise plan
// //                     delivers high-quality images in all available sizes and formats.
// //                   </AccordionContent>
// //                 </AccordionItem>
// //                 <AccordionItem value="item-7">
// //                   <AccordionTrigger className="text-left">Is there a free trial?</AccordionTrigger>
// //                   <AccordionContent>
// //                     Yes, we offer a 7-day free trial with access to all features of the Professional plan. No credit
// //                     card is required to start your trial.
// //                   </AccordionContent>
// //                 </AccordionItem>
// //                 <AccordionItem value="item-8">
// //                   <AccordionTrigger className="text-left">How long are my images stored?</AccordionTrigger>
// //                   <AccordionContent>
// //                     Image storage varies by plan: 7 days for Starter, 30 days for Professional, and 90 days for
// //                     Enterprise. You can download your images at any time during the storage period. Extended storage
// //                     options are available for an additional fee.
// //                   </AccordionContent>
// //                 </AccordionItem>
// //               </Accordion>
// //             </div>
// //           </div>
// //         </section>

// //         <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
// //           <div className="container px-4 md:px-6">
// //             <div className="flex flex-col items-center justify-center space-y-4 text-center">
// //               <div className="space-y-2">
// //                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
// //                   Ready to accelerate your Instagram growth?
// //                 </h2>
// //                 <p className="max-w-[900px] text-purple-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
// //                   Join thousands of businesses using BrandStudioAI to grow their followers, increase engagement, and
// //                   drive real business results.
// //                 </p>
// //               </div>
// //               <div className="flex flex-col gap-2 min-[400px]:flex-row">
// //                 {isLoggedIn ? (
// //                   <Link href="/dashboard">
// //                     <Button
// //                       size="lg"
// //                       className="bg-white text-purple-600 hover:bg-purple-100 shadow-lg shadow-purple-800/20 transition-all"
// //                     >
// //                       Go to Dashboard
// //                     </Button>
// //                   </Link>
// //                 ) : (
// //                   <Link href="/signup">
// //                     <Button
// //                       size="lg"
// //                       className="bg-white text-purple-600 hover:bg-purple-100 shadow-lg shadow-purple-800/20 transition-all"
// //                     >
// //                       Start Growing Today
// //                     </Button>
// //                   </Link>
// //                 )}
// //                 <Button
// //                   size="lg"
// //                   variant="outline"
// //                   className="border border-white/40 text-white hover:bg-purple-700 transition-all bg-purple-600/40 backdrop-blur-sm shadow-lg hover:border-white"
// //                 >
// //                   Schedule a Demo
// //                 </Button>
// //               </div>
// //             </div>
// //           </div>
// //         </section>
// //       </main>
// //       <footer className="w-full border-t py-6 md:py-12">
// //         <div className="container px-4 md:px-6">
// //           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
// //             <div className="space-y-4">
// //               <div className="flex gap-2 items-center">
// //                 <div className="relative h-9 w-9 overflow-hidden rounded-md bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center">
// //                   <span className="text-xl font-bold">B</span>
// //                   <span className="absolute top-0 right-0 bg-gradient-to-br from-blue-400 to-purple-500 text-[8px] px-1 rounded-bl-md font-semibold">
// //                     AI
// //                   </span>
// //                 </div>
// //                 <div className="font-bold text-xl">BrandStudioAI</div>
// //               </div>
// //               <p className="text-sm text-muted-foreground">
// //                 AI-powered platform for generating, managing, and previewing Instagram-ready posts for brands.
// //               </p>
// //               <div className="flex space-x-4">
// //                 <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// //                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
// //                     <path
// //                       fillRule="evenodd"
// //                       d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
// //                       clipRule="evenodd"
// //                     />
// //                   </svg>
// //                 </Link>
// //                 <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// //                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
// //                     <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
// //                   </svg>
// //                 </Link>
// //                 <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// //                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
// //                     <path
// //                       fillRule="evenodd"
// //                       d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
// //                       clipRule="evenodd"
// //                     />
// //                   </svg>
// //                 </Link>
// //               </div>
// //             </div>
// //             <div className="space-y-4">
// //               <h3 className="text-sm font-medium">Product</h3>
// //               <ul className="space-y-2 text-sm">
// //                 <li>
// //                   <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
// //                     Features
// //                   </Link>
// //                 </li>
// //                 <li>
// //                   <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
// //                     Pricing
// //                   </Link>
// //                 </li>
// //                 <li>
// //                   <Link href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
// //                     Demo
// //                   </Link>
// //                 </li>
// //                 <li>
// //                   <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
// //                     FAQ
// //                   </Link>
// //                 </li>
// //               </ul>
// //             </div>
// //             <div className="space-y-4">
// //               <h3 className="text-sm font-medium">Resources</h3>
// //               <ul className="space-y-2 text-sm">
// //                 <li>
// //                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// //                     Blog
// //                   </Link>
// //                 </li>
// //                 <li>
// //                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// //                     Documentation
// //                   </Link>
// //                 </li>
// //                 <li>
// //                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// //                     Guides
// //                   </Link>
// //                 </li>
// //                 <li>
// //                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// //                     Support
// //                   </Link>
// //                 </li>
// //               </ul>
// //             </div>
// //             <div className="space-y-4">
// //               <h3 className="text-sm font-medium">Company</h3>
// //               <ul className="space-y-2 text-sm">
// //                 <li>
// //                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// //                     About
// //                   </Link>
// //                 </li>
// //                 <li>
// //                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// //                     Careers
// //                   </Link>
// //                 </li>
// //                 <li>
// //                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// //                     Contact
// //                   </Link>
// //                 </li>
// //                 <li>
// //                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
// //                     Privacy Policy
// //                   </Link>
// //                 </li>
// //               </ul>
// //             </div>
// //           </div>
// //           <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
// //             © {new Date().getFullYear()} BrandStudioAI. All rights reserved.
// //           </div>
// //         </div>
// //       </footer>
// //     </div>
// //   )
// // }
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { Button } from "@/components/ui/button"
// import Image from "next/image"
// import Link from "next/link"
// import { ArrowRight, Check, Instagram, Sparkles } from "lucide-react"
// import { createServerClient } from "@/lib/supabase/server"
// import { UserProfileDropdown } from "@/components/user-profile-dropdown"

// export default async function LandingPage() {
//   const supabase = createServerClient()
//   const {
//     data: { session },
//   } = await supabase.auth.getSession()
//   const isLoggedIn = !!session

//   return (
//     <div className="flex min-h-screen flex-col">
//       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//         <div className="container flex h-16 items-center justify-between">
//           <div className="flex gap-2 items-center">
//             <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center">
//               <span className="text-xl font-bold">B</span>
//               <span className="absolute top-0 right-0 bg-gradient-to-br from-blue-400 to-purple-500 text-[8px] px-1 rounded-bl-md font-semibold">
//                 AI
//               </span>
//             </div>
//             <div className="font-bold text-xl flex items-center">
//               BrandStudioAI
//               <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-md font-medium">
//                 BETA
//               </span>
//             </div>
//           </div>
//           <div className="hidden md:flex items-center space-x-6">
//             <nav className="flex items-center space-x-6">
//               <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
//                 Features
//               </Link>
//               <Link href="#demo" className="text-sm font-medium transition-colors hover:text-primary">
//                 How It Works
//               </Link>
//               <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
//                 Pricing
//               </Link>
//               <Link href="#faq" className="text-sm font-medium transition-colors hover:text-primary">
//                 FAQ
//               </Link>
//             </nav>
//             <div className="flex items-center gap-4">
//               {isLoggedIn ? (
//                 <div className="flex items-center gap-4">
//                   <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
//                     Dashboard
//                   </Link>
//                   <UserProfileDropdown />
//                 </div>
//               ) : (
//                 <>
//                   <Link href="/login" className="text-sm font-medium transition-colors hover:text-primary">
//                     Sign In
//                   </Link>
//                   <Link href="/signup">
//                     <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
//                       Sign Up
//                     </Button>
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//           <button className="flex items-center justify-center rounded-md p-2 text-foreground md:hidden">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="h-6 w-6"
//             >
//               <line x1="4" x2="20" y1="12" y2="12" />
//               <line x1="4" x2="20" y1="6" y2="6" />
//               <line x1="4" x2="20" y1="18" y2="18" />
//             </svg>
//             <span className="sr-only">Toggle menu</span>
//           </button>
//         </div>
//       </header>
//       <main className="flex-1">
//         <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-purple-50">
//           <div className="container px-4 md:px-6">
//             <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
//               <div className="flex flex-col justify-center space-y-4">
//                 <div className="space-y-2">
//                   <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
//                     <Sparkles className="mr-1 h-3.5 w-3.5" />
//                     AI-Powered Instagram Growth
//                   </div>
//                   <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
//                     Generate Instagram posts that grow your followers 3x faster. No design skills needed.
//                   </h1>
//                   <p className="max-w-[600px] text-muted-foreground md:text-xl">
//                     BrandStudioAI creates on-brand images and captions that match your style. Schedule a month of
//                     content in 15 minutes instead of 15 hours.
//                   </p>
//                 </div>
//                 <div className="flex flex-col gap-2 min-[400px]:flex-row">
//                   {isLoggedIn ? (
//                     <Link href="/dashboard">
//                       <Button
//                         size="lg"
//                         className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all hover:shadow-purple-300"
//                       >
//                         Create Instagram Posts <ArrowRight className="ml-2 h-4 w-4" />
//                       </Button>
//                     </Link>
//                   ) : (
//                     <Link href="/signup">
//                       <Button
//                         size="lg"
//                         className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all hover:shadow-purple-300"
//                       >
//                         Start Creating Posts <ArrowRight className="ml-2 h-4 w-4" />
//                       </Button>
//                     </Link>
//                   )}
//                   <Button size="lg" variant="outline" className="border-purple-200 hover:bg-purple-100 transition-all">
//                     <Instagram className="mr-2 h-4 w-4" /> Watch Demo
//                   </Button>
//                 </div>
//                 <div className="flex flex-wrap items-center gap-4 text-sm">
//                   <div className="flex items-center space-x-1">
//                     <div className="rounded-full bg-green-100 p-1">
//                       <Check className="h-3 w-3 text-green-600" />
//                     </div>
//                     <span>47% Higher Engagement</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <div className="rounded-full bg-green-100 p-1">
//                       <Check className="h-3 w-3 text-green-600" />
//                     </div>
//                     <span>15+ Hours Saved Weekly</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <div className="rounded-full bg-green-100 p-1">
//                       <Check className="h-3 w-3 text-green-600" />
//                     </div>
//                     <span>100% Brand Consistency</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex items-center justify-center">
//                 <div className="relative aspect-video overflow-hidden rounded-xl border bg-background shadow-xl transition-all hover:shadow-2xl">
//                   <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5 z-10"></div>
//                   <Image
//                     src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dashboard-8Tm8nHGL89T4RXx8qzYAAN9kbJJ2NO.png"
//                     alt="BrandStudioAI Dashboard"
//                     width={700}
//                     height={400}
//                     className="object-cover"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="w-full py-8 border-y bg-white/50 backdrop-blur-sm">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center justify-center space-y-4 text-center">
//               <p className="text-sm text-muted-foreground">TRUSTED BY BRANDS AND CREATORS WORLDWIDE</p>
//               <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
//                 <Image
//                   src="/fashion-brand-logo.png"
//                   width={120}
//                   height={40}
//                   alt="Fashion Brand"
//                   className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
//                 />
//                 <Image
//                   src="/placeholder.svg?key=4av66"
//                   width={120}
//                   height={40}
//                   alt="Beauty Brand"
//                   className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
//                 />
//                 <Image
//                   src="/fitness-brand-logo.png"
//                   width={120}
//                   height={40}
//                   alt="Fitness Brand"
//                   className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
//                 />
//                 <Image
//                   src="/food-brand-logo.png"
//                   width={120}
//                   height={40}
//                   alt="Food Brand"
//                   className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
//                 />
//                 <Image
//                   src="/placeholder.svg?key=bdymb"
//                   width={120}
//                   height={40}
//                   alt="Travel Brand"
//                   className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
//                 />
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
//               <div className="space-y-2">
//                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
//                   How It Works
//                 </div>
//                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
//                   Create a month of Instagram content in minutes
//                 </h2>
//                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                   Our AI understands what makes content go viral and applies it to your brand
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-12 md:grid-cols-2 lg:gap-16 xl:gap-20">
//               <div className="flex flex-col space-y-4">
//                 <h3 className="text-2xl font-bold">Generate on-brand posts with one click</h3>
//                 <p className="text-muted-foreground">
//                   Tell our AI about your brand, and it creates images and captions that match your style perfectly. No
//                   more struggling with design tools or writer's block.
//                 </p>
//                 <ul className="space-y-2">
//                   <li className="flex items-start">
//                     <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
//                     <span>AI analyzes top-performing content in your niche</span>
//                   </li>
//                   <li className="flex items-start">
//                     <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
//                     <span>Creates images that match current visual trends</span>
//                   </li>
//                   <li className="flex items-start">
//                     <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
//                     <span>Writes captions with trending hashtags</span>
//                   </li>
//                 </ul>
//                 <div className="pt-4">
//                   <Button className="bg-purple-600 hover:bg-purple-700">Try Content Generation</Button>
//                 </div>
//               </div>
//               <div className="overflow-hidden rounded-xl border shadow-lg">
//                 <Image
//                   src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-post-lUIx1DtfNNcsqQhFi2u6fkfmr74DW0.png"
//                   alt="AI-Generated Instagram Post"
//                   width={600}
//                   height={400}
//                   className="object-cover"
//                 />
//               </div>
//             </div>

//             <div className="mt-20 grid gap-12 md:grid-cols-2 lg:gap-16 xl:gap-20">
//               <div className="order-2 md:order-1 overflow-hidden rounded-xl border shadow-lg">
//                 <Image
//                   src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/schedule-XX7MmZx9vXoYiL7guvMGYmfgiXj4SU.png"
//                   alt="Content Calendar"
//                   width={600}
//                   height={400}
//                   className="object-cover"
//                 />
//               </div>
//               <div className="order-1 md:order-2 flex flex-col space-y-4">
//                 <h3 className="text-2xl font-bold">Schedule posts when your audience is most active</h3>
//                 <p className="text-muted-foreground">
//                   Our AI analyzes when your followers are most likely to engage and schedules your posts at optimal
//                   times. Set it once and forget it.
//                 </p>
//                 <ul className="space-y-2">
//                   <li className="flex items-start">
//                     <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
//                     <span>Drag-and-drop calendar interface</span>
//                   </li>
//                   <li className="flex items-start">
//                     <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
//                     <span>Automatic posting at optimal times</span>
//                   </li>
//                   <li className="flex items-start">
//                     <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
//                     <span>Consistent posting improves algorithm ranking</span>
//                   </li>
//                 </ul>
//                 <div className="pt-4">
//                   <Button className="bg-purple-600 hover:bg-purple-700">See Scheduling Demo</Button>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-20 grid gap-12 md:grid-cols-2 lg:gap-16 xl:gap-20">
//               <div className="flex flex-col space-y-4">
//                 <h3 className="text-2xl font-bold">Track growth and optimize your strategy</h3>
//                 <p className="text-muted-foreground">
//                   See which posts perform best and why. Our analytics help you understand what resonates with your
//                   audience so you can create more of what works.
//                 </p>
//                 <ul className="space-y-2">
//                   <li className="flex items-start">
//                     <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
//                     <span>Track follower growth and engagement rates</span>
//                   </li>
//                   <li className="flex items-start">
//                     <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
//                     <span>Identify your best-performing content</span>
//                   </li>
//                   <li className="flex items-start">
//                     <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
//                     <span>Get AI recommendations to improve performance</span>
//                   </li>
//                 </ul>
//                 <div className="pt-4">
//                   <Button className="bg-purple-600 hover:bg-purple-700">View Analytics Demo</Button>
//                 </div>
//               </div>
//               <div className="overflow-hidden rounded-xl border shadow-lg">
//                 <Image
//                   src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/summary-7H32Oso9LcuhsAwQRHL2U4foVG6hcf.png"
//                   alt="Growth Analytics"
//                   width={600}
//                   height={400}
//                   className="object-cover"
//                 />
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
//               <div className="space-y-2">
//                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
//                   Real Results
//                 </div>
//                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
//                   Our customers see growth in 30 days or less
//                 </h2>
//                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                   Don't take our word for it—see the numbers
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-8 md:grid-cols-3">
//               <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-purple-100 shadow-sm">
//                 <div className="rounded-full w-16 h-16 bg-purple-100 flex items-center justify-center mb-4">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-8 w-8 text-purple-600"
//                   >
//                     <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
//                   </svg>
//                 </div>
//                 <h3 className="text-4xl font-bold mb-2">47%</h3>
//                 <p className="text-xl font-semibold text-purple-600 mb-2">Higher Engagement</p>
//                 <p className="text-muted-foreground">
//                   Average increase in likes, comments, and shares after just 30 days of consistent posting
//                 </p>
//               </div>

//               <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-purple-100 shadow-sm">
//                 <div className="rounded-full w-16 h-16 bg-purple-100 flex items-center justify-center mb-4">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-8 w-8 text-purple-600"
//                   >
//                     <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//                     <circle cx="9" cy="7" r="4" />
//                     <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//                     <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//                   </svg>
//                 </div>
//                 <h3 className="text-4xl font-bold mb-2">3x</h3>
//                 <p className="text-xl font-semibold text-purple-600 mb-2">Faster Follower Growth</p>
//                 <p className="text-muted-foreground">
//                   Customers grow their audience three times faster than with manual content creation
//                 </p>
//               </div>

//               <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-purple-100 shadow-sm">
//                 <div className="rounded-full w-16 h-16 bg-purple-100 flex items-center justify-center mb-4">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     className="h-8 w-8 text-purple-600"
//                   >
//                     <path d="M12 2v20" />
//                     <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//                   </svg>
//                 </div>
//                 <h3 className="text-4xl font-bold mb-2">15+</h3>
//                 <p className="text-xl font-semibold text-purple-600 mb-2">Hours Saved Weekly</p>
//                 <p className="text-muted-foreground">
//                   Eliminate time spent on content creation, design, and scheduling with our automated workflow
//                 </p>
//               </div>
//             </div>

//             <div className="mt-16 bg-white p-8 rounded-xl border border-purple-100 shadow-sm">
//               <h3 className="text-xl font-bold mb-6 text-center">Common Concerns About AI Content Creation</h3>

//               <div className="grid gap-8 md:grid-cols-2">
//                 <div className="space-y-4">
//                   <div className="flex items-start">
//                     <div className="rounded-full bg-red-100 p-1 mr-3 mt-1">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         className="h-3 w-3 text-red-600"
//                       >
//                         <line x1="18" y1="6" x2="6" y2="18"></line>
//                         <line x1="6" y1="6" x2="18" y2="18"></line>
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="font-medium">Won't AI content look generic and inauthentic?</p>
//                       <p className="text-sm text-muted-foreground mt-1">
//                         Our AI is trained on your specific brand voice and style. It creates content that's uniquely
//                         yours, not generic templates.
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-start">
//                     <div className="rounded-full bg-red-100 p-1 mr-3 mt-1">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         className="h-3 w-3 text-red-600"
//                       >
//                         <line x1="18" y1="6" x2="6" y2="18"></line>
//                         <line x1="6" y1="6" x2="18" y2="18"></line>
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="font-medium">I don't have design skills. Will I still get good results?</p>
//                       <p className="text-sm text-muted-foreground mt-1">
//                         Absolutely! Our AI handles all the design work. You just provide basic guidance on what you
//                         want, and we create professional-quality content.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex items-start">
//                     <div className="rounded-full bg-red-100 p-1 mr-3 mt-1">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         className="h-3 w-3 text-red-600"
//                       >
//                         <line x1="18" y1="6" x2="6" y2="18"></line>
//                         <line x1="6" y1="6" x2="18" y2="18"></line>
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="font-medium">Is it complicated to set up?</p>
//                       <p className="text-sm text-muted-foreground mt-1">
//                         Not at all. Our onboarding takes just 5 minutes. Create a brand kit, connect your Instagram, and
//                         you're ready to start generating content.
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-start">
//                     <div className="rounded-full bg-red-100 p-1 mr-3 mt-1">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         className="h-3 w-3 text-red-600"
//                       >
//                         <line x1="18" y1="6" x2="6" y2="18"></line>
//                         <line x1="6" y1="6" x2="18" y2="18"></line>
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="font-medium">What if I don't like the generated content?</p>
//                       <p className="text-sm text-muted-foreground mt-1">
//                         You have full editing control. Don't like something? Regenerate it or make manual edits. Our AI
//                         learns from your preferences over time.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center justify-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
//                   Success Stories
//                 </div>
//                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
//                   From struggling to thriving on Instagram
//                 </h2>
//                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                   Real customers sharing their growth journey with BrandStudioAI
//                 </p>
//               </div>
//             </div>

//             <div className="mx-auto max-w-6xl mt-12 grid gap-8 md:grid-cols-3">
//               <div className="flex flex-col bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
//                 <div className="p-6">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="rounded-full overflow-hidden h-12 w-12 border">
//                       <Image
//                         src="/images/testimonial-1.png"
//                         alt="Sarah Johnson"
//                         width={48}
//                         height={48}
//                         className="object-cover"
//                       />
//                     </div>
//                     <div>
//                       <h3 className="font-bold">Sarah Johnson</h3>
//                       <p className="text-sm text-muted-foreground">Marketing Director, TechFlow</p>
//                     </div>
//                   </div>
//                   <div className="flex text-amber-400 mb-3">
//                     {[...Array(5)].map((_, i) => (
//                       <svg
//                         key={i}
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                         className="h-5 w-5"
//                       >
//                         <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//                       </svg>
//                     ))}
//                   </div>
//                   <blockquote className="text-muted-foreground italic mb-4">
//                     "Before BrandStudioAI, I spent 20+ hours weekly on content. Now I spend 2 hours and get better
//                     results. Our engagement increased by 45% and we've gained 5,800 new followers in just 3 months."
//                   </blockquote>
//                   <div className="flex items-center gap-3 text-sm font-medium">
//                     <div className="flex items-center text-green-600">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         className="mr-1 h-4 w-4"
//                       >
//                         <path d="m5 12 5 5 9-9" />
//                       </svg>
//                       <span>5,800 New Followers</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-col bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
//                 <div className="p-6">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="rounded-full overflow-hidden h-12 w-12 border">
//                       <Image
//                         src="/placeholder.svg?height=48&width=48&query=man%20entrepreneur"
//                         alt="Michael Chen"
//                         width={48}
//                         height={48}
//                         className="object-cover"
//                       />
//                     </div>
//                     <div>
//                       <h3 className="font-bold">Michael Chen</h3>
//                       <p className="text-sm text-muted-foreground">Founder, Wellness Collective</p>
//                     </div>
//                   </div>
//                   <div className="flex text-amber-400 mb-3">
//                     {[...Array(5)].map((_, i) => (
//                       <svg
//                         key={i}
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                         className="h-5 w-5"
//                       >
//                         <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//                       </svg>
//                     ))}
//                   </div>
//                   <blockquote className="text-muted-foreground italic mb-4">
//                     "As a solopreneur, I couldn't afford a design team. BrandStudioAI gives me professional content that
//                     perfectly matches my brand. My follower count went from 2,300 to 7,800 in 6 months, and sales from
//                     Instagram are up 78%."
//                   </blockquote>
//                   <div className="flex items-center gap-3 text-sm font-medium">
//                     <div className="flex items-center text-green-600">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         className="mr-1 h-4 w-4"
//                       >
//                         <path d="m5 12 5 5 9-9" />
//                       </svg>
//                       <span>78% Sales Increase</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-col bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
//                 <div className="p-6">
//                   <div className="flex items-center gap-4 mb-4">
//                     <div className="rounded-full overflow-hidden h-12 w-12 border">
//                       <Image
//                         src="/images/testimonial-3.png"
//                         alt="Emma Rodriguez"
//                         width={48}
//                         height={48}
//                         className="object-cover"
//                       />
//                     </div>
//                     <div>
//                       <h3 className="font-bold">Emma Rodriguez</h3>
//                       <p className="text-sm text-muted-foreground">Social Media Manager, StyleHouse</p>
//                     </div>
//                   </div>
//                   <div className="flex text-amber-400 mb-3">
//                     {[...Array(5)].map((_, i) => (
//                       <svg
//                         key={i}
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="currentColor"
//                         className="h-5 w-5"
//                       >
//                         <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//                       </svg>
//                     ))}
//                   </div>
//                   <blockquote className="text-muted-foreground italic mb-4">
//                     "Our engagement rate jumped from 2.1% to 5.8% in just two months with BrandStudioAI. The consistency
//                     in our posts has dramatically improved our brand recognition, and we're now getting approached by
//                     major brands for collaborations."
//                   </blockquote>
//                   <div className="flex items-center gap-3 text-sm font-medium">
//                     <div className="flex items-center text-green-600">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         className="mr-1 h-4 w-4"
//                       >
//                         <path d="m5 12 5 5 9-9" />
//                       </svg>
//                       <span>176% Engagement Increase</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center justify-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
//                   FAQ
//                 </div>
//                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
//                 <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                   Everything you need to know about BrandStudioAI
//                 </p>
//               </div>
//             </div>
//             <div className="mx-auto max-w-3xl mt-12 space-y-4">
//               <Accordion type="single" collapsible className="w-full">
//                 <AccordionItem value="item-1">
//                   <AccordionTrigger className="text-left">What is BrandStudioAI?</AccordionTrigger>
//                   <AccordionContent>
//                     BrandStudioAI is an AI-powered platform for generating, managing, and previewing Instagram-ready
//                     posts for brands. It leverages OpenAI for creative content generation and helps marketing teams,
//                     agencies, and solo founders automate and streamline their social media content creation process.
//                   </AccordionContent>
//                 </AccordionItem>
//                 <AccordionItem value="item-2">
//                   <AccordionTrigger className="text-left">How does BrandStudioAI generate content?</AccordionTrigger>
//                   <AccordionContent>
//                     BrandStudioAI uses advanced AI models from OpenAI to generate both images and captions that match
//                     your brand's style and tone. You create a Brand Kit with your brand details, and our AI uses this
//                     information to create content that's consistent with your brand identity.
//                   </AccordionContent>
//                 </AccordionItem>
//                 <AccordionItem value="item-3">
//                   <AccordionTrigger className="text-left">Can I edit the generated content?</AccordionTrigger>
//                   <AccordionContent>
//                     Yes! All generated content can be edited. You can modify captions, regenerate images, and make any
//                     adjustments needed before scheduling or publishing your posts.
//                   </AccordionContent>
//                 </AccordionItem>
//                 <AccordionItem value="item-4">
//                   <AccordionTrigger className="text-left">
//                     How many posts can I generate with each plan?
//                   </AccordionTrigger>
//                   <AccordionContent>
//                     The Starter plan includes 100 posts per month, the Professional plan includes 200 posts per month,
//                     and the Enterprise plan includes 500 posts per month. If you need more, you can purchase additional
//                     credits.
//                   </AccordionContent>
//                 </AccordionItem>
//                 <AccordionItem value="item-5">
//                   <AccordionTrigger className="text-left">Can I publish directly to Instagram?</AccordionTrigger>
//                   <AccordionContent>
//                     Yes, BrandStudioAI allows you to connect your Instagram account and publish posts directly from the
//                     platform. You can also schedule posts for future publication at optimal times.
//                   </AccordionContent>
//                 </AccordionItem>
//                 <AccordionItem value="item-6">
//                   <AccordionTrigger className="text-left">What image quality can I expect?</AccordionTrigger>
//                   <AccordionContent>
//                     Image quality depends on your plan. The Starter plan provides low-quality images (1024x1024), the
//                     Professional plan offers medium-quality images with more size options, and the Enterprise plan
//                     delivers high-quality images in all available sizes and formats.
//                   </AccordionContent>
//                 </AccordionItem>
//                 <AccordionItem value="item-7">
//                   <AccordionTrigger className="text-left">Is there a free trial?</AccordionTrigger>
//                   <AccordionContent>
//                     Yes, we offer a 7-day free trial with access to all features of the Professional plan. No credit
//                     card is required to start your trial.
//                   </AccordionContent>
//                 </AccordionItem>
//                 <AccordionItem value="item-8">
//                   <AccordionTrigger className="text-left">How long are my images stored?</AccordionTrigger>
//                   <AccordionContent>
//                     Image storage varies by plan: 7 days for Starter, 30 days for Professional, and 90 days for
//                     Enterprise. You can download your images at any time during the storage period. Extended storage
//                     options are available for an additional fee.
//                   </AccordionContent>
//                 </AccordionItem>
//               </Accordion>
//             </div>
//           </div>
//         </section>

//         <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center justify-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
//                   Ready to grow your Instagram following?
//                 </h2>
//                 <p className="max-w-[900px] text-purple-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                   Join thousands of creators and brands who are saving time and growing faster with BrandStudioAI
//                 </p>
//               </div>
//               <div className="flex flex-col gap-2 min-[400px]:flex-row">
//                 {isLoggedIn ? (
//                   <Link href="/dashboard">
//                     <Button
//                       size="lg"
//                       className="bg-white text-purple-600 hover:bg-purple-100 shadow-lg shadow-purple-800/20 transition-all"
//                     >
//                       Create Your First Post
//                     </Button>
//                   </Link>
//                 ) : (
//                   <Link href="/signup">
//                     <Button
//                       size="lg"
//                       className="bg-white text-purple-600 hover:bg-purple-100 shadow-lg shadow-purple-800/20 transition-all"
//                     >
//                       Start Your 7-Day Free Trial
//                     </Button>
//                   </Link>
//                 )}
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="border-white/40 border text-white hover:bg-purple-700 transition-all bg-purple-600"
//                 >
//                   Schedule a Demo
//                 </Button>
//               </div>
//               <p className="text-sm text-purple-200 mt-4">No credit card required. Cancel anytime.</p>
//             </div>
//           </div>
//         </section>
//       </main>
//       <footer className="w-full border-t py-6 md:py-12">
//         <div className="container px-4 md:px-6">
//           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
//             <div className="space-y-4">
//               <div className="flex gap-2 items-center">
//                 <div className="relative h-9 w-9 overflow-hidden rounded-md bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center">
//                   <span className="text-xl font-bold">B</span>
//                   <span className="absolute top-0 right-0 bg-gradient-to-br from-blue-400 to-purple-500 text-[8px] px-1 rounded-bl-md font-semibold">
//                     AI
//                   </span>
//                 </div>
//                 <div className="font-bold text-xl">BrandStudioAI</div>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 AI-powered platform for generating, managing, and previewing Instagram-ready posts for brands.
//               </p>
//               <div className="flex space-x-4">
//                 <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
//                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                     <path
//                       fillRule="evenodd"
//                       d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </Link>
//                 <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
//                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                     <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
//                   </svg>
//                 </Link>
//                 <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
//                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                     <path
//                       fillRule="evenodd"
//                       d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </Link>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <h3 className="text-sm font-medium">Product</h3>
//               <ul className="space-y-2 text-sm">
//                 <li>
//                   <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
//                     Features
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
//                     Pricing
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
//                     Demo
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
//                     FAQ
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//             <div className="space-y-4">
//               <h3 className="text-sm font-medium">Resources</h3>
//               <ul className="space-y-2 text-sm">
//                 <li>
//                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
//                     Blog
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
//                     Documentation
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
//                     Guides
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
//                     Support
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//             <div className="space-y-4">
//               <h3 className="text-sm font-medium">Company</h3>
//               <ul className="space-y-2 text-sm">
//                 <li>
//                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
//                     About
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
//                     Careers
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
//                     Contact
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
//                     Privacy Policy
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
//             © {new Date().getFullYear()} BrandStudioAI. All rights reserved.
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, Instagram, Sparkles } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"

export default async function LandingPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const isLoggedIn = !!session

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex gap-2 items-center">
            <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center">
              <span className="text-xl font-bold">B</span>
              <span className="absolute top-0 right-0 bg-gradient-to-br from-blue-400 to-purple-500 text-[8px] px-1 rounded-bl-md font-semibold">
                AI
              </span>
            </div>
            <div className="font-bold text-xl flex items-center">
              BrandStudioAI
              <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-md font-medium">
                BETA
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {!isLoggedIn && (
              <nav className="flex items-center space-x-6">
                <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
                  Features
                </Link>
                <Link href="#demo" className="text-sm font-medium transition-colors hover:text-primary">
                  How It Works
                </Link>
                <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
                  Pricing
                </Link>
                <Link href="#faq" className="text-sm font-medium transition-colors hover:text-primary">
                  FAQ
                </Link>
              </nav>
            )}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                    Dashboard
                  </Link>
                  <UserProfileDropdown />
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium transition-colors hover:text-primary">
                    Sign In
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <button className="flex items-center justify-center rounded-md p-2 text-foreground md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                    <Sparkles className="mr-1 h-3.5 w-3.5" />
                    AI-Powered Instagram Growth
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Generate Instagram posts that grow your followers 3x faster. No design skills needed.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    BrandStudioAI creates on-brand images and captions that match your style. Schedule a month of
                    content in 15 minutes instead of 15 hours.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  {isLoggedIn ? (
                    <Link href="/dashboard">
                      <Button
                        size="lg"
                        className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all hover:shadow-purple-300"
                      >
                        Create Instagram Posts <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all hover:shadow-purple-300"
                      >
                        Start Creating Posts <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <Button size="lg" variant="outline" className="border-purple-200 hover:bg-purple-100 transition-all">
                    <Instagram className="mr-2 h-4 w-4" /> Watch Demo
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="rounded-full bg-green-100 p-1">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span>47% Higher Engagement</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="rounded-full bg-green-100 p-1">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span>15+ Hours Saved Weekly</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="rounded-full bg-green-100 p-1">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span>100% Brand Consistency</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative aspect-video overflow-hidden rounded-xl border bg-background shadow-xl transition-all hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5 z-10"></div>
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dashboard-8Tm8nHGL89T4RXx8qzYAAN9kbJJ2NO.png"
                    alt="BrandStudioAI Dashboard"
                    width={700}
                    height={400}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-8 border-y bg-white/50 backdrop-blur-sm">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <p className="text-sm text-muted-foreground">TRUSTED BY BRANDS AND CREATORS WORLDWIDE</p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
                <Image
                  src="/fashion-brand-logo.png"
                  width={120}
                  height={40}
                  alt="Fashion Brand"
                  className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                />
                <Image
                  src="/placeholder.svg?key=4av66"
                  width={120}
                  height={40}
                  alt="Beauty Brand"
                  className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                />
                <Image
                  src="/fitness-brand-logo.png"
                  width={120}
                  height={40}
                  alt="Fitness Brand"
                  className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                />
                <Image
                  src="/food-brand-logo.png"
                  width={120}
                  height={40}
                  alt="Food Brand"
                  className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                />
                <Image
                  src="/placeholder.svg?key=bdymb"
                  width={120}
                  height={40}
                  alt="Travel Brand"
                  className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Create a month of Instagram content in minutes
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI understands what makes content go viral and applies it to your brand
                </p>
              </div>
            </div>

            <div className="grid gap-12 md:grid-cols-2 lg:gap-16 xl:gap-20">
              <div className="flex flex-col space-y-4">
                <h3 className="text-2xl font-bold">Generate on-brand posts with one click</h3>
                <p className="text-muted-foreground">
                  Tell our AI about your brand, and it creates images and captions that match your style perfectly. No
                  more struggling with design tools or writer's block.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>AI analyzes top-performing content in your niche</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Creates images that match current visual trends</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Writes captions with trending hashtags</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button className="bg-purple-600 hover:bg-purple-700">Try Content Generation</Button>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border shadow-lg">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-post-lUIx1DtfNNcsqQhFi2u6fkfmr74DW0.png"
                  alt="AI-Generated Instagram Post"
                  width={600}
                  height={400}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="mt-20 grid gap-12 md:grid-cols-2 lg:gap-16 xl:gap-20">
              <div className="order-2 md:order-1 overflow-hidden rounded-xl border shadow-lg">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/schedule-XX7MmZx9vXoYiL7guvMGYmfgiXj4SU.png"
                  alt="Content Calendar"
                  width={600}
                  height={400}
                  className="object-cover"
                />
              </div>
              <div className="order-1 md:order-2 flex flex-col space-y-4">
                <h3 className="text-2xl font-bold">Schedule posts when your audience is most active</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes when your followers are most likely to engage and schedules your posts at optimal
                  times. Set it once and forget it.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Drag-and-drop calendar interface</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Automatic posting at optimal times</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Consistent posting improves algorithm ranking</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button className="bg-purple-600 hover:bg-purple-700">See Scheduling Demo</Button>
                </div>
              </div>
            </div>

            <div className="mt-20 grid gap-12 md:grid-cols-2 lg:gap-16 xl:gap-20">
              <div className="flex flex-col space-y-4">
                <h3 className="text-2xl font-bold">Track growth and optimize your strategy</h3>
                <p className="text-muted-foreground">
                  See which posts perform best and why. Our analytics help you understand what resonates with your
                  audience so you can create more of what works.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Track follower growth and engagement rates</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Identify your best-performing content</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Get AI recommendations to improve performance</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button className="bg-purple-600 hover:bg-purple-700">View Analytics Demo</Button>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border shadow-lg">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/summary-7H32Oso9LcuhsAwQRHL2U4foVG6hcf.png"
                  alt="Growth Analytics"
                  width={600}
                  height={400}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                  Real Results
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Our customers see growth in 30 days or less
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Don't take our word for it—see the numbers
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-purple-100 shadow-sm">
                <div className="rounded-full w-16 h-16 bg-purple-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-purple-600"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 className="text-4xl font-bold mb-2">47%</h3>
                <p className="text-xl font-semibold text-purple-600 mb-2">Higher Engagement</p>
                <p className="text-muted-foreground">
                  Average increase in likes, comments, and shares after just 30 days of consistent posting
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-purple-100 shadow-sm">
                <div className="rounded-full w-16 h-16 bg-purple-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-purple-600"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-4xl font-bold mb-2">3x</h3>
                <p className="text-xl font-semibold text-purple-600 mb-2">Faster Follower Growth</p>
                <p className="text-muted-foreground">
                  Customers grow their audience three times faster than with manual content creation
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-purple-100 shadow-sm">
                <div className="rounded-full w-16 h-16 bg-purple-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-purple-600"
                  >
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-4xl font-bold mb-2">15+</h3>
                <p className="text-xl font-semibold text-purple-600 mb-2">Hours Saved Weekly</p>
                <p className="text-muted-foreground">
                  Eliminate time spent on content creation, design, and scheduling with our automated workflow
                </p>
              </div>
            </div>

            <div className="mt-16 bg-white p-8 rounded-xl border border-purple-100 shadow-sm">
              <h3 className="text-xl font-bold mb-6 text-center">Common Concerns About AI Content Creation</h3>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="rounded-full bg-red-100 p-1 mr-3 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3 text-red-600"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Won't AI content look generic and inauthentic?</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Our AI is trained on your specific brand voice and style. It creates content that's uniquely
                        yours, not generic templates.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="rounded-full bg-red-100 p-1 mr-3 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3 text-red-600"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">I don't have design skills. Will I still get good results?</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Absolutely! Our AI handles all the design work. You just provide basic guidance on what you
                        want, and we create professional-quality content.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="rounded-full bg-red-100 p-1 mr-3 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3 text-red-600"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Is it complicated to set up?</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Not at all. Our onboarding takes just 5 minutes. Create a brand kit, connect your Instagram, and
                        you're ready to start generating content.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="rounded-full bg-red-100 p-1 mr-3 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3 text-red-600"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">What if I don't like the generated content?</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        You have full editing control. Don't like something? Regenerate it or make manual edits. Our AI
                        learns from your preferences over time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                  Success Stories
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  From struggling to thriving on Instagram
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Real customers sharing their growth journey with BrandStudioAI
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-6xl mt-12 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-full overflow-hidden h-12 w-12 border">
                      <Image
                        src="/images/testimonial-1.png"
                        alt="Sarah Johnson"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">Sarah Johnson</h3>
                      <p className="text-sm text-muted-foreground">Marketing Director, TechFlow</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground italic mb-4">
                    "Before BrandStudioAI, I spent 20+ hours weekly on content. Now I spend 2 hours and get better
                    results. Our engagement increased by 45% and we've gained 5,800 new followers in just 3 months."
                  </blockquote>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="flex items-center text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1 h-4 w-4"
                      >
                        <path d="m5 12 5 5 9-9" />
                      </svg>
                      <span>5,800 New Followers</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-full overflow-hidden h-12 w-12 border">
                      <Image
                        src="/man-entrepreneur.png"
                        alt="Michael Chen"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">Michael Chen</h3>
                      <p className="text-sm text-muted-foreground">Founder, Wellness Collective</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground italic mb-4">
                    "As a solopreneur, I couldn't afford a design team. BrandStudioAI gives me professional content that
                    perfectly matches my brand. My follower count went from 2,300 to 7,800 in 6 months, and sales from
                    Instagram are up 78%."
                  </blockquote>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="flex items-center text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1 h-4 w-4"
                      >
                        <path d="m5 12 5 5 9-9" />
                      </svg>
                      <span>78% Sales Increase</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-full overflow-hidden h-12 w-12 border">
                      <Image
                        src="/images/testimonial-3.png"
                        alt="Emma Rodriguez"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">Emma Rodriguez</h3>
                      <p className="text-sm text-muted-foreground">Social Media Manager, StyleHouse</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground italic mb-4">
                    "Our engagement rate jumped from 2.1% to 5.8% in just two months with BrandStudioAI. The consistency
                    in our posts has dramatically improved our brand recognition, and we're now getting approached by
                    major brands for collaborations."
                  </blockquote>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="flex items-center text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1 h-4 w-4"
                      >
                        <path d="m5 12 5 5 9-9" />
                      </svg>
                      <span>176% Engagement Increase</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                  FAQ
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to know about BrandStudioAI
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl mt-12 space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">What is BrandStudioAI?</AccordionTrigger>
                  <AccordionContent>
                    BrandStudioAI is an AI-powered platform for generating, managing, and previewing Instagram-ready
                    posts for brands. It leverages OpenAI for creative content generation and helps marketing teams,
                    agencies, and solo founders automate and streamline their social media content creation process.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">How does BrandStudioAI generate content?</AccordionTrigger>
                  <AccordionContent>
                    BrandStudioAI uses advanced AI models from OpenAI to generate both images and captions that match
                    your brand's style and tone. You create a Brand Kit with your brand details, and our AI uses this
                    information to create content that's consistent with your brand identity.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">Can I edit the generated content?</AccordionTrigger>
                  <AccordionContent>
                    Yes! All generated content can be edited. You can modify captions, regenerate images, and make any
                    adjustments needed before scheduling or publishing your posts.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    How many posts can I generate with each plan?
                  </AccordionTrigger>
                  <AccordionContent>
                    The Starter plan includes 100 posts per month, the Professional plan includes 200 posts per month,
                    and the Enterprise plan includes 500 posts per month. If you need more, you can purchase additional
                    credits.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">Can I publish directly to Instagram?</AccordionTrigger>
                  <AccordionContent>
                    Yes, BrandStudioAI allows you to connect your Instagram account and publish posts directly from the
                    platform. You can also schedule posts for future publication at optimal times.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">What image quality can I expect?</AccordionTrigger>
                  <AccordionContent>
                    Image quality depends on your plan. The Starter plan provides low-quality images (1024x1024), the
                    Professional plan offers medium-quality images with more size options, and the Enterprise plan
                    delivers high-quality images in all available sizes and formats.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-left">Is there a free trial?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer a 7-day free trial with access to all features of the Professional plan. No credit
                    card is required to start your trial.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-left">How long are my images stored?</AccordionTrigger>
                  <AccordionContent>
                    Image storage varies by plan: 7 days for Starter, 30 days for Professional, and 90 days for
                    Enterprise. You can download your images at any time during the storage period. Extended storage
                    options are available for an additional fee.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to grow your Instagram following?
                </h2>
                <p className="max-w-[900px] text-purple-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of creators and brands who are saving time and growing faster with BrandStudioAI
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-purple-100 shadow-lg shadow-purple-800/20 transition-all"
                    >
                      Create Your First Post
                    </Button>
                  </Link>
                ) : (
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-purple-100 shadow-lg shadow-purple-800/20 transition-all"
                    >
                      Start Your 7-Day Free Trial
                    </Button>
                  </Link>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 border  text-white hover:bg-purple-700 transition-all bg-purple-600"
                >
                  Schedule a Demo
                </Button>
              </div>
              <p className="text-sm text-purple-200 mt-4">No credit card required. Cancel anytime.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                <div className="relative h-9 w-9 overflow-hidden rounded-md bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center">
                  <span className="text-xl font-bold">B</span>
                  <span className="absolute top-0 right-0 bg-gradient-to-br from-blue-400 to-purple-500 text-[8px] px-1 rounded-bl-md font-semibold">
                    AI
                  </span>
                </div>
                <div className="font-bold text-xl">BrandStudioAI</div>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered platform for generating, managing, and previewing Instagram-ready posts for brands.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} BrandStudioAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
