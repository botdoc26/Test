import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Star, MessageCircle, Eye } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "watched",
    title: "Атака титанов",
    episode: "Эпизод 15",
    time: "2 часа назад",
    icon: Play,
  },
  {
    id: 2,
    type: "favorite",
    title: "Магическая битва",
    time: "1 день назад",
    icon: Star,
  },
  {
    id: 3,
    type: "comment",
    title: "Клинок, рассекающий демонов",
    time: "2 дня назад",
    icon: MessageCircle,
  },
  {
    id: 4,
    type: "completed",
    title: "Наруто",
    time: "3 дня назад",
    icon: Eye,
  },
]

const getActivityText = (activity: (typeof activities)[0]) => {
  switch (activity.type) {
    case "watched":
      return `Посмотрел ${activity.episode}`
    case "favorite":
      return "Добавил в избранное"
    case "comment":
      return "Оставил комментарий"
    case "completed":
      return "Завершил просмотр"
    default:
      return ""
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case "watched":
      return "text-blue-500"
    case "favorite":
      return "text-red-500"
    case "comment":
      return "text-green-500"
    case "completed":
      return "text-purple-500"
    default:
      return "text-muted-foreground"
  }
}

export function RecentActivity() {
  return (
    <Card className="glass-effect">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Последняя активность</CardTitle>
        <Button variant="ghost" size="sm">
          Показать все
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity.type)}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{activity.title}</p>
              <p className="text-sm text-muted-foreground">{getActivityText(activity)}</p>
            </div>
            <div className="text-xs text-muted-foreground">{activity.time}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
