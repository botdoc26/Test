"use client"

import { useState } from "react"

export interface AnimeData {
  id: number
  title: string
  titleEnglish?: string
  titleJapanese?: string
  synopsis: string
  image: string
  score: number
  episodes: number
  status: string
  year: number
  genres: string[]
  studios: string[]
  availableDubs: DubInfo[]
  trailer?: string
}

export interface DubInfo {
  provider: string
  quality: string[]
  episodes: { [key: string]: any }
  description?: string
  logo?: string
}

export interface SearchFilters {
  query?: string
  genre?: string
  year?: string
  status?: string
  page?: number
  limit?: number
}

export function useAnime() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchAnime = async (filters: SearchFilters = {}) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filters.query) params.set("q", filters.query)
      if (filters.genre) params.set("genre", filters.genre)
      if (filters.year) params.set("year", filters.year)
      if (filters.status) params.set("status", filters.status)
      if (filters.page) params.set("page", filters.page.toString())
      if (filters.limit) params.set("limit", filters.limit.toString())

      const response = await fetch(`/api/anime?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch anime")
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getAnimeDetails = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/anime/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch anime details")
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getEpisodes = async (id: string, provider = "Anilibria") => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/anime/${id}/episodes?provider=${provider}`)
      if (!response.ok) {
        throw new Error("Failed to fetch episodes")
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    searchAnime,
    getAnimeDetails,
    getEpisodes,
  }
}
