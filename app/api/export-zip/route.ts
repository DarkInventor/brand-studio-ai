import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'

export async function POST(req: NextRequest) {
  try {
    const { posts } = await req.json()
    if (!Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json({ error: 'No posts provided' }, { status: 400 })
    }
    const zip = new JSZip()
    // Add captions.txt
    const captions = posts.map((post: any, idx: number) => `Post ${idx + 1} (ID: ${post.id}):\n${post.caption}\n`).join("\n---\n\n")
    zip.file('captions.txt', captions)
    // Add images
    await Promise.all(posts.map(async (post: any, idx: number) => {
      if (post.image_url && post.image_url.startsWith('http')) {
        try {
          const res = await fetch(post.image_url)
          if (!res.ok) {
            console.warn(`Failed to fetch image for post ${post.id}: HTTP ${res.status}`)
            return
          }
          const contentType = res.headers.get('content-type') || ''
          if (!contentType.startsWith('image/')) {
            console.warn(`URL did not return an image for post ${post.id}: ${contentType}`)
            return
          }
          const arrayBuffer = await res.arrayBuffer()
          const ext = contentType.split('/')[1].split(';')[0] || 'png'
          zip.file(`images/image_${idx + 1}_${post.id}.${ext}`, arrayBuffer)
        } catch (e) {
          console.warn(`Error fetching image for post ${post.id}:`, e)
        }
      }
    }))
    const content = await zip.generateAsync({ type: 'nodebuffer' })
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="posts_export_${Date.now()}.zip"`,
      },
    })
  } catch (e: any) {
    console.error('Export ZIP error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
} 