# 🚀 Team Task Manager

A high-performance, premium project and task management platform built for modern teams. Featuring role-based access control, real-time dashboard analytics, and a seamless Kanban experience.

## ✨ Features

- **🔐 Secure Authentication**: Integrated with NextAuth.js for robust Login and Signup.
- **🛡️ Role-Based Access Control (RBAC)**:
  - **Admins**: Create projects, manage team members, and assign tasks.
  - **Members**: Access assigned projects and update their own task progress.
- **📊 Premium Dashboard**: Visualized statistics for projects, tasks, and a critical "Overdue Tasks" alert system.
- **📋 Kanban Task Board**: Interactive task tracking with status transitions (To Do, In Progress, Done).
- **🎨 Premium UI/UX**: Built with Tailwind CSS and Shadcn UI, featuring glassmorphism, smooth animations, and responsive design.
- **⚡ Performance**: Built on Next.js 14 App Router for lightning-fast server-side rendering and actions.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Production) / SQLite (Local)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)

## 🚀 Local Development

### 1. Prerequisites
- Node.js 18+ 
- NPM

### 2. Installation
```bash
git clone <your-repo-url>
cd task-manager
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your_random_secret_here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Initialization
```bash
npx prisma db push
npx tsx prisma/seed.ts
```
*Login with:* `admin@example.com` / `admin123`

### 5. Run the App
```bash
npm run dev
```

## 🌐 Deployment (Railway)

This project is optimized for deployment on [Railway](https://railway.app/).

1. **Connect GitHub**: Select your repository in the Railway dashboard.
2. **Add PostgreSQL**: Add the Postgres plugin to your Railway project.
3. **Environment Variables**:
   - `DATABASE_URL`: (Auto-filled by Railway)
   - `NEXTAUTH_SECRET`: Your random secret
   - `NEXTAUTH_URL`: Your production URL (e.g., `https://your-app.up.railway.app`)
4. **Build Settings**: Set the **Build Command** to:
   ```bash
   npm run deploy
   ```

## 📝 License
Distributed under the MIT License.
