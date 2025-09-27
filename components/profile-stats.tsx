"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Heart, Clock, Trophy } from "lucide-react"

const stats = [
  {
    title: "Просмотрено",
    value: "127",
    subtitle: "аниме",
    icon: Eye,
    color: "text-blue-500",
  },
  {
    title: "В избранном",
    value: "23",
    subtitle: "тайтлов",
    icon: Heart,
    color: "text-red-500",
  },
  {
    title: "Время просмотра",
    value: "2,340",
    subtitle: "часов",
    icon: Clock,
    color: "text-green-500",
  },
  {
    title: "Достижения",
    value: "15",
    subtitle: "получено",
    icon: Trophy,
    color: "text-yellow-500",
  },
]

export function ProfileStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
