"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoPlayerProps {
  videos: string[]
  projectTitle?: string
}

function SingleVideoPlayer({
  src,
  title,
  index,
  total,
  onPrev,
  onNext,
  compact = false,
}: {
  src: string
  title?: string
  index: number
  total: number
  onPrev?: () => void
  onNext?: () => void
  compact?: boolean
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null)

  const resetControlsTimer = () => {
    setShowControls(true)
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current)
    if (isPlaying) {
      controlsTimeout.current = setTimeout(() => setShowControls(false), 3000)
    }
  }

  useEffect(() => {
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setIsPlaying(true)
      controlsTimeout.current = setTimeout(() => setShowControls(false), 3000)
    } else {
      video.pause()
      setIsPlaying(false)
      setShowControls(true)
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement?.parentElement
    if (!container) return
    if (!document.fullscreenElement) {
      container.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration) return
    setProgress((video.currentTime / video.duration) * 100)
  }

  const handleLoadedMetadata = () => {
    const video = videoRef.current
    if (!video) return
    setDuration(video.duration)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = x / rect.width
    video.currentTime = pct * video.duration
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const currentTime = videoRef.current ? videoRef.current.currentTime : 0

  return (
    <div
      className="relative bg-black rounded-xl overflow-hidden group select-none"
      style={{ aspectRatio: "16/9" }}
      onMouseMove={resetControlsTimer}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false)
      }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false)
          setShowControls(true)
        }}
        preload="metadata"
        playsInline
      />

      {/* Play/Pause central al hacer clic */}
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
        onClick={togglePlay}
      >
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="bg-black/60 backdrop-blur-sm rounded-full p-5 shadow-2xl"
            >
              <Play className="h-10 w-10 text-white fill-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controles */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-8"
          >
            {/* Barra de progreso */}
            <div
              className="relative h-1 bg-white/30 rounded-full mb-3 cursor-pointer group/progress"
              onClick={handleSeek}
            >
              <div
                className="absolute top-0 left-0 h-full bg-white rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity -translate-x-1/2"
                style={{ left: `${progress}%` }}
              />
            </div>

            {/* Controles inferiores */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-white/80 transition-colors"
                  aria-label={isPlaying ? "Pausar" : "Reproducir"}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 fill-white" />
                  ) : (
                    <Play className="h-5 w-5 fill-white" />
                  )}
                </button>

                {/* Mute */}
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-white/80 transition-colors"
                  aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>

                {/* Tiempo */}
                <span className="text-white text-xs font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Navegación entre videos */}
                {total > 1 && (
                  <span className="text-white/70 text-xs">
                    {index + 1} / {total}
                  </span>
                )}

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-white/80 transition-colors"
                  aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navegación entre videos (flechas laterales) */}
      {total > 1 && (
        <>
          {onPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPrev()
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Video anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {onNext && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNext()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Video siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </>
      )}
    </div>
  )
}

export function VideoPlayer({ videos, projectTitle }: VideoPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!videos || videos.length === 0) return null

  const goNext = () =>
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1))
  const goPrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1))

  return (
    <div className="space-y-4">
      {/* Header de sección */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 bg-primary rounded-full" />
          <h3 className="text-lg font-semibold">
            {videos.length === 1 ? "Video del proyecto" : `Videos del proyecto`}
          </h3>
        </div>
        {videos.length > 1 && (
          <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {videos.length} videos
          </span>
        )}
      </div>

      {/* Player principal */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25 }}
        >
          <SingleVideoPlayer
            src={videos[currentIndex]}
            title={projectTitle}
            index={currentIndex}
            total={videos.length}
            onPrev={videos.length > 1 ? goPrev : undefined}
            onNext={videos.length > 1 ? goNext : undefined}
          />
        </motion.div>
      </AnimatePresence>

      {/* Thumbnails de videos (si hay más de uno) */}
      {videos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {videos.map((videoSrc, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-primary ring-1 ring-primary"
                  : "border-transparent hover:border-muted-foreground/50"
              }`}
            >
              <video
                src={videoSrc}
                className="w-full h-full object-cover"
                preload="metadata"
                muted
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="h-4 w-4 text-white fill-white" />
              </div>
              {index === currentIndex && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
