import { getDashboardStats } from "@/app/actions/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, CheckCircle2, Clock, ListTodo } from "lucide-react"

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  // Calculate specific statuses
  const todoCount = stats.tasksByStatus.find(s => s.status === "TODO")?._count.status || 0
  const inProgressCount = stats.tasksByStatus.find(s => s.status === "IN_PROGRESS")?._count.status || 0
  const doneCount = stats.tasksByStatus.find(s => s.status === "DONE")?._count.status || 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-1">Here's a summary of your tasks and projects.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">{todoCount} To Do, {inProgressCount} In Progress</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doneCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Tasks marked as DONE</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all border-red-100 dark:border-red-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Overdue Tasks</CardTitle>
            <Clock className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdueTasks}</div>
            <p className="text-xs text-red-500/80 mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
