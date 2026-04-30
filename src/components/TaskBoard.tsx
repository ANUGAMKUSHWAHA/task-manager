"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateTaskStatus } from "@/app/actions/task"
import { format } from "date-fns"
import { CheckCircle2, Circle, Clock, MoreHorizontal, User } from "lucide-react"

export function TaskBoard({ tasks, members, isAdmin, userId }: { tasks: any[], members: any[], isAdmin: boolean, userId: string }) {
  const [updating, setUpdating] = useState<string | null>(null)

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    setUpdating(taskId)
    try {
      await updateTaskStatus(taskId, newStatus)
    } catch (err) {
      console.error("Failed to update status", err)
      alert("Failed to update status")
    } finally {
      setUpdating(null)
    }
  }

  const columns = [
    { id: "TODO", label: "To Do", icon: <Circle className="h-4 w-4 text-zinc-400" /> },
    { id: "IN_PROGRESS", label: "In Progress", icon: <Clock className="h-4 w-4 text-blue-500" /> },
    { id: "DONE", label: "Done", icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" /> }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "MEDIUM": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      case "LOW": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      default: return "bg-zinc-100 text-zinc-700"
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {columns.map((column) => (
        <div key={column.id} className="space-y-4">
          <div className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wider text-zinc-500 p-2">
            {column.icon}
            {column.label}
            <Badge variant="secondary" className="ml-auto bg-zinc-200 dark:bg-zinc-800">
              {tasks.filter(t => t.status === column.id).length}
            </Badge>
          </div>
          <div className="space-y-4 min-h-[500px]">
            {tasks.filter(t => t.status === column.id).map((task) => {
              const isAssignedToMe = task.assigneeId === userId
              const canEdit = isAdmin || isAssignedToMe

              return (
                <Card key={task.id} className="group hover:shadow-md transition-all border-zinc-200 dark:border-zinc-800">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between">
                      <Badge className={`${getPriorityColor(task.priority)} border-0 text-[10px] px-1.5 h-5`}>
                        {task.priority}
                      </Badge>
                      <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                    <CardTitle className="text-base mt-2">{task.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-4">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {task.description || "No description"}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                          {task.assignee?.name?.[0] || <User className="h-3 w-3" />}
                        </div>
                        <span className="text-xs text-zinc-500 font-medium truncate max-w-[80px]">
                          {task.assignee?.name || "Unassigned"}
                        </span>
                      </div>
                      {task.dueDate && (
                        <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(task.dueDate), "MMM d")}
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <Select
                        disabled={!canEdit || updating === task.id}
                        value={task.status}
                        onValueChange={(value) => handleStatusChange(task.id, value)}
                      >
                        <SelectTrigger className="h-8 text-[10px] bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TODO" className="text-xs">To Do</SelectItem>
                          <SelectItem value="IN_PROGRESS" className="text-xs">In Progress</SelectItem>
                          <SelectItem value="DONE" className="text-xs">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {tasks.filter(t => t.status === column.id).length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-400">
                <p className="text-xs">No tasks here</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
