export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  location: string
  jobTitle?: string
  company?: string
  bio?: string
  skills: string[]
  experience: string
  profileImage?: string
  preferences: {
    jobType: string[]
    salaryRange: {
      min: number
      max: number
    }
    remoteWork: boolean
    willingToRelocate: boolean
  }
  socialLinks: {
    linkedin?: string
    github?: string
    portfolio?: string
  }
}

export const mockUser: User = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  jobTitle: "Senior Frontend Developer",
  company: "TechCorp Inc.",
  bio: "Passionate frontend developer with 5+ years of experience building modern web applications. I love creating intuitive user experiences and working with cutting-edge technologies.",
  skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "GraphQL", "AWS"],
  experience: "5+ years",
  profileImage: "/placeholder.svg?height=120&width=120&text=JD",
  preferences: {
    jobType: ["full-time", "remote"],
    salaryRange: {
      min: 120000,
      max: 160000,
    },
    remoteWork: true,
    willingToRelocate: false,
  },
  socialLinks: {
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    portfolio: "https://johndoe.dev",
  },
}

export const skillOptions = [
  "React",
  "TypeScript",
  "JavaScript",
  "Next.js",
  "Vue.js",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "Flutter",
  "React Native",
  "HTML/CSS",
  "Tailwind CSS",
  "SASS/SCSS",
  "GraphQL",
  "REST APIs",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "Git",
  "CI/CD",
]

export const experienceLevels = [
  "Entry level (0-1 years)",
  "Junior (1-3 years)",
  "Mid-level (3-5 years)",
  "Senior (5-8 years)",
  "Lead (8-12 years)",
  "Principal (12+ years)",
]
