"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createProject(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can create projects")
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const members = formData.getAll("members") as string[] // array of user IDs

  if (!name) {
    throw new Error("Project name is required")
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      members: {
        create: members.map(userId => ({
          userId
        }))
      }
    }
  })

  revalidatePath("/dashboard/projects")
  return project
}

export async function getProjects() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  if (session.user.role === "ADMIN") {
    return prisma.project.findMany({
      include: {
        _count: {
          select: { tasks: true, members: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })
  } else {
    // For members, only return projects they are part of
    const memberships = await prisma.projectUser.findMany({
      where: { userId: session.user.id },
      include: {
        project: {
          include: {
            _count: {
              select: { tasks: true, members: true }
            }
          }
        }
      }
    })
    return memberships.map(m => m.project).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
}

export async function getProjectById(id: string) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      members: {
        include: { user: true }
      },
      tasks: {
        include: { assignee: true },
        orderBy: { dueDate: "asc" }
      }
    }
  })

  if (!project) {
    throw new Error("Project not found")
  }

  if (session.user.role !== "ADMIN") {
    const isMember = project.members.some(m => m.userId === session.user.id)
    if (!isMember) {
      throw new Error("Forbidden: You are not a member of this project")
    }
  }

  return project
}
