import { ImageGenerator } from "@/components/image-generator"

export default function GenerateImagePage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Generate AI Images</h1>
      <div className="flex justify-center">
        <ImageGenerator />
      </div>
    </div>
  )
}
