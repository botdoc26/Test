import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const { searchParams } = new URL(request.url)
  const provider = searchParams.get("provider") || "Anilibria"

  try {
    // В реальном приложении здесь был бы запрос к соответствующему API
    const episodes = generateEpisodesForProvider(Number.parseInt(id), provider)

    return NextResponse.json({
      animeId: id,
      provider,
      episodes,
    })
  } catch (error) {
    console.error("Error fetching episodes:", error)
    return NextResponse.json({ error: "Failed to fetch episodes" }, { status: 500 })
  }
}

function generateEpisodesForProvider(animeId: number, provider: string) {
  const episodeCount = 24 // В реальности получали бы из API
  const episodes = []

  for (let i = 1; i <= episodeCount; i++) {
    episodes.push({
      number: i,
      title: `Серия ${i}`,
      description: `Описание серии ${i}`,
      thumbnail: `/placeholder.svg?height=200&width=350&query=anime episode ${i}`,
      duration: "24:00",
      airDate: new Date(2024, 0, i).toISOString(),
      sources: {
        "1080p": `https://example.com/${provider.toLowerCase()}/anime-${animeId}/episode-${i}/1080p.m3u8`,
        "720p": `https://example.com/${provider.toLowerCase()}/anime-${animeId}/episode-${i}/720p.m3u8`,
        "480p": `https://example.com/${provider.toLowerCase()}/anime-${animeId}/episode-${i}/480p.m3u8`,
      },
      subtitles: [
        {
          language: "ru",
          url: `https://example.com/${provider.toLowerCase()}/anime-${animeId}/episode-${i}/ru.vtt`,
        },
      ],
    })
  }

  return episodes
}
