"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createTask(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can create tasks")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const projectId = formData.get("projectId") as string
  const assigneeId = formData.get("assigneeId") as string | null
  const priority = formData.get("priority") as string || "MEDIUM"
  const dueDateStr = formData.get("dueDate") as string

  if (!title || !projectId) {
    throw new Error("Title and Project are required")
  }

  let dueDate = null
  if (dueDateStr) {
    dueDate = new Date(dueDateStr)
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      projectId,
      assigneeId: assigneeId || null,
      priority,
      dueDate,
      status: "TODO"
    }
  })

  revalidatePath(`/dashboard/projects/${projectId}`)
  revalidatePath("/dashboard")
  return task
}

export async function updateTaskStatus(taskId: string, status: string) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error("Unauthorized")
  }

  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task) {
    throw new Error("Task not found")
  }

  // Admins can update any task. Members can only update tasks assigned to them.
  if (session.user.role !== "ADMIN" && task.assigneeId !== session.user.id) {
    throw new Error("Forbidden: You can only update your own tasks")
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { status }
  })

  revalidatePath(`/dashboard/projects/${task.projectId}`)
  revalidatePath("/dashboard")
  return updatedTask
}
