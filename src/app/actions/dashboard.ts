"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getDashboardStats() {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error("Unauthorized")
  }

  const now = new Date()

  if (session.user.role === "ADMIN") {
    const totalProjects = await prisma.project.count()
    const totalTasks = await prisma.task.count()
    const tasksByStatus = await prisma.task.groupBy({
      by: ['status'],
      _count: { status: true }
    })
    const overdueTasks = await prisma.task.count({
      where: {
        dueDate: { lt: now },
        status: { not: "DONE" }
      }
    })

    return {
      totalProjects,
      totalTasks,
      tasksByStatus,
      overdueTasks,
    }
  } else {
    // Member stats
    const memberships = await prisma.projectUser.count({
      where: { userId: session.user.id }
    })
    const myTasks = await prisma.task.count({
      where: { assigneeId: session.user.id }
    })
    const tasksByStatus = await prisma.task.groupBy({
      by: ['status'],
      where: { assigneeId: session.user.id },
      _count: { status: true }
    })
    const overdueTasks = await prisma.task.count({
      where: {
        assigneeId: session.user.id,
        dueDate: { lt: now },
        status: { not: "DONE" }
      }
    })

    return {
      totalProjects: memberships,
      totalTasks: myTasks,
      tasksByStatus,
      overdueTasks,
    }
  }
}
