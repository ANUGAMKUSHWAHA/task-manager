# Team Task Manager

A full-stack web application for project and task management with role-based access control.

## Features

- **Authentication**: Signup and Login with NextAuth.
- **Role-Based Access**: 
  - **Admins**: Can create projects, assign members, and create/assign tasks.
  - **Members**: Can view assigned projects and update the status of their assigned tasks.
- **Project Management**: Create and manage projects with team members.
- **Task Tracking**: Kanban-style task board with status updates (To Do, In Progress, Done).
- **Dashboard**: Overview of total projects, tasks, completed items, and overdue tasks.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: PostgreSQL (Production) / SQLite (Local)
- **ORM**: Prisma
- **Auth**: NextAuth.js

## Local Development

1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Setup environment variables**:
    Create a `.env` file based on `.env.example`.
4.  **Initialize the database**:
    ```bash
    npx prisma db push
    npx tsx prisma/seed.ts
    ```
    *Seed login: `admin@example.com` / `admin123`*
5.  **Run the app**:
    ```bash
    npm run dev
    ```

## Deployment to Railway

This project is ready to be deployed on [Railway](https://railway.app/).

1.  **Push your code** to a GitHub repository.
2.  **Create a new project** on Railway and select **Deploy from GitHub repo**.
3.  **Add a PostgreSQL database** to your Railway project.
4.  **Configure Environment Variables** in Railway:
    - `DATABASE_URL`: (Railway automatically provides this if you add the Postgres plugin).
    - `NEXTAUTH_SECRET`: Generate a random string (e.g., `openssl rand -base64 32`).
    - `NEXTAUTH_URL`: Your deployed URL (e.g., `https://your-app-name.up.railway.app`).
5.  **Set Custom Build Command**:
    In Railway settings, set the **Build Command** to:
    ```bash
    npm run deploy
    ```
    This will ensure migrations are applied before the build.
6.  **Switch to PostgreSQL**:
    Before deploying, update `prisma/schema.prisma` to use the `postgresql` provider:
    ```prisma
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    ```
