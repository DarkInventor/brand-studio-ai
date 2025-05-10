// import type React from "react"
// import type { Metadata } from "next"
// import { Outfit } from "next/font/google"
// import "./globals.css"

// // Load Outfit font - a modern, clean sans-serif that matches the brand image
// const outfit = Outfit({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800", "900"],
//   variable: "--font-outfit",
// })

// export const metadata: Metadata = {
//   title: "BrandStudio AI",
//   description: "Generate branded Instagram posts instantly with AI",
//     generator: 'v0.dev'
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${outfit.className} antialiased`}>{children}</body>
//     </html>
//   )
// }
import type React from "react"
import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "BrandStudioAI - AI-Powered Instagram Content Creation",
  description:
    "Generate, manage, and preview Instagram-ready posts for your brand with AI. Watch our video tutorials to learn how to use the platform.",
  keywords: "AI, Instagram, content creation, social media, brand management",
  authors: [{ name: "BrandStudioAI Team" }],
  openGraph: {
    title: "BrandStudioAI - AI-Powered Instagram Content Creation",
    description: "Generate, manage, and preview Instagram-ready posts for your brand with AI.",
    url: "https://brandstudioai.com",
    siteName: "BrandStudioAI",
    images: [
      {
        url: "https://brandstudioai.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BrandStudioAI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
       <body className={`${outfit.className} antialiased`}>{children}</body>
    </html>
  )
}
