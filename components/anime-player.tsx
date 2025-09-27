"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DubInfo } from "@/hooks/use-anime"

interface AnimePlayerProps {
  anime: {
    id: number
    title: string
    currentEpisode: number
    watchProgress: number
    availableDubs?: DubInfo[]
    selectedProvider?: string
    onProviderChange?: (provider: string) => void
  }
}

export function AnimePlayer({ anime }: AnimePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState([80])
  const [progress, setProgress] = useState([anime.watchProgress])
  const [showControls, setShowControls] = useState(true)
  const [selectedQuality, setSelectedQuality] = useState("1080p")

  const currentDub = anime.availableDubs?.find((dub) => dub.provider === anime.selectedProvider)
  const availableQualities = currentDub?.quality || ["1080p", "720p", "480p"]

  return (
    <div className="space-y-4">
      {/* Episode Info and Dub Selection */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">{anime.title}</h1>
          <p className="text-muted-foreground">Эпизод {anime.currentEpisode}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Dub Provider Selection */}
          {anime.availableDubs && anime.availableDubs.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Озвучка:</span>
              <Select value={anime.selectedProvider} onValueChange={anime.onProviderChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {anime.availableDubs.map((dub) => (
                    <SelectItem key={dub.provider} value={dub.provider}>
                      {dub.provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Badge variant="secondary">{selectedQuality}</Badge>
        </div>
      </div>

      {/* Current Dub Info */}
      {currentDub && (
        <div className="glass-effect rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
              <span className="text-xs font-bold">{currentDub.provider[0]}</span>
            </div>
            <div>
              <p className="font-medium">{currentDub.provider}</p>
              <p className="text-xs text-muted-foreground">{currentDub.description}</p>
            </div>
            <div className="ml-auto flex gap-1">
              {currentDub.quality.map((quality) => (
                <Badge key={quality} variant="outline" className="text-xs">
                  {quality}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Player */}
      <div
        className="relative aspect-video bg-black rounded-xl overflow-hidden group cursor-pointer"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Play className="w-16 h-16 text-white/80 mx-auto" />
            <div className="text-white/60 space-y-2">
              <p>Видео плеер</p>
              <p className="text-sm">Озвучка: {anime.selectedProvider}</p>
              <p className="text-xs">Качество: {selectedQuality}</p>
            </div>
          </div>
        </div>

        {/* Controls Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              variant="ghost"
              className="w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            {/* Progress Bar */}
            <Slider value={progress} onValueChange={setProgress} max={100} step={1} className="w-full" />

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>

                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <SkipForward className="w-4 h-4" />
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-20" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-white text-sm">12:34 / 24:00</span>

                {/* Quality Selection */}
                <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                  <SelectTrigger className="w-20 h-8 text-white border-white/20 bg-black/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableQualities.map((quality) => (
                      <SelectItem key={quality} value={quality}>
                        {quality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Settings className="w-4 h-4" />
                </Button>

                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled={anime.currentEpisode <= 1}>
            Предыдущий эпизод
          </Button>
          <Button variant="outline" size="sm">
            Следующий эпизод
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Скорость: 1x
          </Button>
          <Button variant="outline" size="sm">
            Автопереход
          </Button>
        </div>
      </div>
    </div>
  )
}
