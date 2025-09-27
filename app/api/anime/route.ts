import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const genre = searchParams.get("genre")
  const year = searchParams.get("year")
  const status = searchParams.get("status")

  try {
    // Интеграция с Jikan API (MyAnimeList) для метаданных
    const jikanUrl = new URL("https://api.jikan.moe/v4/anime")
    if (query) jikanUrl.searchParams.set("q", query)
    if (genre) jikanUrl.searchParams.set("genres", genre)
    if (year) jikanUrl.searchParams.set("start_date", `${year}-01-01`)
    if (status) jikanUrl.searchParams.set("status", status)
    jikanUrl.searchParams.set("page", page.toString())
    jikanUrl.searchParams.set("limit", limit.toString())

    const jikanResponse = await fetch(jikanUrl.toString())
    const jikanData = await jikanResponse.json()

    // Обогащаем данные информацией о доступных озвучках
    const enrichedData = await Promise.all(
      jikanData.data?.map(async (anime: any) => {
        const dubInfo = await getAvailableDubs(anime.mal_id)
        return {
          id: anime.mal_id,
          title: anime.title,
          titleEnglish: anime.title_english,
          titleJapanese: anime.title_japanese,
          synopsis: anime.synopsis,
          image: anime.images?.jpg?.large_image_url,
          score: anime.score,
          episodes: anime.episodes,
          status: anime.status,
          year: anime.year,
          genres: anime.genres?.map((g: any) => g.name) || [],
          studios: anime.studios?.map((s: any) => s.name) || [],
          availableDubs: dubInfo,
          trailer: anime.trailer?.youtube_id,
        }
      }) || [],
    )

    return NextResponse.json({
      data: enrichedData,
      pagination: jikanData.pagination,
    })
  } catch (error) {
    console.error("Error fetching anime:", error)
    return NextResponse.json({ error: "Failed to fetch anime data" }, { status: 500 })
  }
}

async function getAvailableDubs(malId: number) {
  const dubs = []

  try {
    // Проверяем Anilibria
    const anilibriaResponse = await fetch(`https://api.anilibria.tv/v3/title/search?search=${malId}`)
    if (anilibriaResponse.ok) {
      const anilibriaData = await anilibriaResponse.json()
      if (anilibriaData.list && anilibriaData.list.length > 0) {
        dubs.push({
          provider: "Anilibria",
          quality: ["720p", "1080p"],
          episodes: anilibriaData.list[0].player?.list || {},
        })
      }
    }
  } catch (error) {
    console.log("Anilibria API unavailable")
  }

  // Добавляем mock данные для других озвучек (в реальном проекте здесь были бы реальные API)
  dubs.push(
    {
      provider: "AnimeVost",
      quality: ["480p", "720p", "1080p"],
      episodes: generateMockEpisodes(24), // Mock данные
    },
    {
      provider: "AniDub",
      quality: ["720p", "1080p"],
      episodes: generateMockEpisodes(24),
    },
  )

  return dubs
}

function generateMockEpisodes(count: number) {
  const episodes: { [key: string]: any } = {}
  for (let i = 1; i <= count; i++) {
    episodes[i] = {
      name: `Серия ${i}`,
      uuid: `episode-${i}`,
      preview: `/placeholder.svg?height=200&width=350&query=anime episode ${i}`,
      skips: {
        opening: [90, 180],
        ending: [1320, 1410],
      },
    }
  }
  return episodes
}
