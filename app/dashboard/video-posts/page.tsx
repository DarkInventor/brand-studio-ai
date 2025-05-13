"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bean, Clock, ImageIcon, LucideFrame, Maximize2, Mic, Palette, Sparkles, Type } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Image } from "@radix-ui/react-avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export default function DiscoverPage() {
  const [inputValue, setInputValue] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("None")
  const [selectedDuration, setSelectedDuration] = useState("5 sec")
  const [selectedEffect, setSelectedEffect] = useState("None")
  const [selectedQuality, setSelectedQuality] = useState("360p")
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("16:9")

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Discover</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Food image */}
          <div className="relative rounded-lg overflow-hidden shadow-md">
            <div className="absolute top-3 left-3 bg-white/80 p-1 rounded-full">
              <Mic className="w-4 h-4" />
            </div>
            <img src="/placeholder.svg?key=d274p" alt="Food creation" className="w-full h-64 object-cover" />
          </div>

          {/* OpenAI image */}
          <div className="relative rounded-lg overflow-hidden shadow-md col-span-1 row-span-1">
            <div className="absolute top-3 left-3 text-xs font-medium bg-white/80 px-2 py-1 rounded-full">
              Suit Swagger
            </div>
            <img src="/placeholder.svg?key=srnne" alt="OpenAI presentation" className="w-full h-64 object-cover" />
          </div>

          {/* Vogue Walk */}
          <div className="relative rounded-lg overflow-hidden shadow-md row-span-2">
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/80 px-2 py-1 rounded-full">
              <Mic className="w-4 h-4" />
              <span className="text-xs font-medium">Vogue Walk</span>
            </div>
            <img src="/placeholder.svg?key=kx5t6" alt="Vogue Walk" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center">
              <Button className="bg-white/80 text-gray-800 hover:bg-white/90 rounded-lg">Go Create</Button>
              <Button variant="ghost" size="icon" className="bg-white/80 rounded-full h-10 w-10">
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
                  className="lucide lucide-download"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Nature scene */}
          <div className="relative rounded-lg overflow-hidden shadow-md">
            <div className="absolute top-3 left-3 bg-white/80 p-1 rounded-full">
              <Mic className="w-4 h-4" />
            </div>
            <img src="/placeholder.svg?key=pjh9b" alt="Nature scene" className="w-full h-64 object-cover" />
          </div>

          {/* Princess image */}
          <div className="relative rounded-lg overflow-hidden shadow-md">
            <div className="absolute top-3 left-3 bg-white/80 p-1 rounded-full">
              <Mic className="w-4 h-4" />
            </div>
            <img src="/placeholder.svg?key=olb17" alt="Princess illustration" className="w-full h-64 object-cover" />
          </div>
        </div>

        {/* Creation toolbar */}
        <div className="fixed bottom-4 left-0 sm:left-[240px] right-0 bg-white/70 backdrop-blur-md border rounded-lg border-gray-200/50 p-1.5 sm:p-2 max-w-5xl mx-auto shadow-lg ">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 border-b border-gray-200/50 pb-2 sm:pb-0 ">
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 rounded-full text-xs bg-white/50 backdrop-blur-sm">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="flex items-center gap-1.5 cursor-pointer">
                  <ImageIcon className="w-4 h-4" />
                  <span>image</span>
                  {/* <span className="hidden sm:inline text-xs text-gray-500">Upload</span> */}
                </label>
              </Button>
              {/* Duration dropdown using DropdownMenu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5 rounded-full text-xs bg-white/50 backdrop-blur-sm">
                    <Clock className="w-4 h-4" />
                    <span className="hidden sm:inline">{selectedDuration}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setSelectedDuration("5 sec")}>5 sec</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedDuration("8 sec")}>8 sec</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedDuration("10 sec")}>10 sec</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedDuration("30 sec")}>30 sec</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Style dropdown using DropdownMenu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5 rounded-full text-xs bg-white/50 backdrop-blur-sm">
                    <Palette className="w-4 h-4" />
                    <span className="hidden sm:inline">{selectedStyle}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div className="px-2 py-1.5 text-xs text-gray-500">Select a style</div>
                  <DropdownMenuItem onSelect={() => setSelectedStyle("None")}>None</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedStyle("anime")}>anime</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedStyle("3d animation")}>3d animation</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedStyle("clay")}>clay</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedStyle("cyberpunk")}>cyberpunk</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedStyle("comic")}>comic</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Effect dropdown using DropdownMenu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5 rounded-full text-xs bg-white/50 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">{selectedEffect}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                <div className="px-2 py-1.5 text-xs text-gray-500">Select an effect</div>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("None")}>None</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Let's YMCA!")}>Let's YMCA!</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Subject 3 Fever")}>Subject 3 Fever</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Ghibli Live!")}>Ghibli Live!</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Suit Swagger")}>Suit Swagger</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Muscle Surge")}>Muscle Surge</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("360° Microwave")}>360° Microwave</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Warmth of Jesus")}>Warmth of Jesus</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Emergency Beat")}>Emergency Beat</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Anything, Robot")}>Anything, Robot</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Kungfu Club")}>Kungfu Club</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Mint in Box")}>Mint in Box</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Retro Anime Pop")}>Retro Anime Pop</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Vogue Walk")}>Vogue Walk</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Mega Dive")}>Mega Dive</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedEffect("Evil Trigger")}>Evil Trigger</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5 rounded-full text-xs bg-white/50 backdrop-blur-sm">
                    <LucideFrame className="w-4 h-4" /><span className="hidden sm:inline">{selectedQuality}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setSelectedQuality("360p")}>360p</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedQuality("540p")}>540p</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedQuality("720p")}>720p</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedQuality("1080p")}>1080p</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Aspect Ratio dropdown using DropdownMenu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5 rounded-full text-xs bg-white/50 backdrop-blur-sm">
                    <Maximize2 className="w-4 h-4" /><span className="hidden sm:inline">{selectedAspectRatio}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setSelectedAspectRatio("16:9")}>16:9</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedAspectRatio("9:16")}>9:16</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSelectedAspectRatio("1:1")}>1:1</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <div className="relative flex-1">
              <Textarea
                className="bg-white/50 backdrop-blur-sm border-gray-200/50 text-sm h-16 border ring-offset-0 focus-visible:ring-0 "
                placeholder="a cute panda eating in the forest"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="text-xs text-gray-500 mt-0.5 ml-1">Text prompt for video generation</div>
              
              <Input
                className="pl-3 pr-3 mt-2 rounded-full border-gray-200/50 bg-white/50 backdrop-blur-sm w-full text-sm h-8"
                placeholder="Enter negative prompt"
                // value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="text-xs text-gray-500 mt-0.5 ml-1">negative_prompt</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-1.5 gap-1.5">          
            <Button className="bg-primary text-white rounded-full px-4 backdrop-blur-sm w-full sm:w-auto mt-1 sm:mt-0 text-sm h-8">
              Create <span className="ml-1 text-xs bg-white/20 px-1 py-0.5 rounded">⌘ 30</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
