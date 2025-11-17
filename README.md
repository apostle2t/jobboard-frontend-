# Job Board Application

A modern full-stack job board platform built with Next.js and Spring Boot, featuring real-time job search, user profiles, bookmarks, and messaging capabilities.

## 🚀 Features

- **Job Search & Filtering** - Search jobs by keyword, location, and type
- **User Authentication** - OAuth integration with Google and GitHub
- **Profile Management** - Upload profile pictures, manage skills and preferences
- **Bookmarks** - Save and organize favorite job listings
- **Messaging** - Share jobs and communicate with other users
- **Real-time Updates** - Dynamic job listings from backend API
- **Responsive Design** - Mobile-friendly interface with dark mode support

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui, Radix UI
- **State Management:** React Hooks
- **Icons:** Lucide React

### Backend
- **Framework:** Spring Boot
- **Database:** PostgreSQL
- **Storage:** AWS S3 (profile pictures)
- **Authentication:** JWT, OAuth 2.0

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Spring Boot backend running (see backend repo)
- PostgreSQL database
- AWS S3 bucket configured

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd job-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Environment Variables

Create a `.env.local` file in the root directory:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:8080` |

## 📁 Project Structure

```
job-board/
├── app/                      # Next.js app router pages
│   ├── auth/                # Authentication pages
│   ├── bookmarks/           # Bookmarks page
│   ├── jobs/                # Job listings page
│   ├── messages/            # Messaging interface
│   ├── profile/             # User profile page
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── job-card.tsx         # Job listing card
│   ├── navigation.tsx       # Main navigation
│   └── ...
├── lib/                     # Utilities and mock data
├── src/lib/                 # API utilities
│   ├── auth.ts             # Authentication helpers
│   ├── jobs-api.ts         # Jobs API client
│   └── user-api.ts         # User API client
├── public/                  # Static assets
└── styles/                  # Global styles
```

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🔐 Authentication

This application supports multiple authentication methods:
- OAuth 2.0 (Google, GitHub)
- JWT-based session management

