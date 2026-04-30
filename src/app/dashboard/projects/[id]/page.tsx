import { getProjectById } from "@/app/actions/project"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { TaskBoard } from "@/components/TaskBoard"
import { CreateTaskDialog } from "@/components/CreateTaskDialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id)
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "ADMIN"
  const userId = session?.user?.id || ""

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/projects">
              <Button variant="ghost" size="icon" className="-ml-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
          </div>
          <p className="text-muted-foreground">{project.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex -space-x-2">
              {project.members.slice(0, 5).map((m: any) => (
                <div key={m.id} className="h-8 w-8 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold" title={m.user.name}>
                  {m.user.name?.[0]}
                </div>
              ))}
              {project.members.length > 5 && (
                <div className="h-8 w-8 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-[10px] font-bold">
                  +{project.members.length - 5}
                </div>
              )}
            </div>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
              <Users className="h-3.5 w-3.5" />
              {project.members.length} Members
            </div>
          </div>
        </div>
        
        {isAdmin && (
          <CreateTaskDialog projectId={project.id} members={project.members} />
        )}
      </div>

      <TaskBoard 
        tasks={project.tasks} 
        members={project.members} 
        isAdmin={isAdmin} 
        userId={userId} 
      />
    </div>
  )
}
