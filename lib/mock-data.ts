export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: "full-time" | "part-time" | "contract" | "remote"
  salary?: string
  description: string
  requirements: string[]
  postedDate: Date
  isNew: boolean
  companyLogo?: string
  companyDescription?: string
  responsibilities?: string[]
  benefits?: string[]
  applicationUrl?: string
}

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "full-time",
    salary: "$120k - $160k",
    description:
      "We are looking for an experienced Senior Frontend Developer to join our dynamic engineering team. In this role, you'll be at the forefront of building cutting-edge web applications that serve millions of users worldwide. You'll work closely with our product and design teams to create intuitive, high-performance user interfaces using the latest frontend technologies.\n\nAs a senior member of the team, you'll have the opportunity to mentor junior developers, influence technical decisions, and shape the future of our frontend architecture. We're seeking someone who is passionate about creating exceptional user experiences and has a strong track record of delivering scalable, maintainable code.",
    requirements: [
      "5+ years of professional experience with React and modern JavaScript",
      "Strong proficiency in TypeScript and ES6+",
      "Experience with state management libraries (Redux, MobX, or similar)",
      "Deep understanding of modern CSS frameworks and methodologies",
      "Experience with testing frameworks (Jest, React Testing Library)",
      "Knowledge of performance optimization techniques",
      "Strong problem-solving and communication skills",
      "Experience with Git and collaborative development workflows"
    ],
    responsibilities: [
      "Design and develop responsive, high-performance web applications",
      "Collaborate with UX/UI designers to implement pixel-perfect interfaces",
      "Write clean, maintainable, and well-documented code",
      "Conduct code reviews and mentor junior developers",
      "Optimize applications for maximum speed and scalability",
      "Participate in architecture decisions and technical planning",
      "Stay up-to-date with emerging frontend technologies and best practices",
      "Work in an Agile environment with cross-functional teams"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "401(k) matching up to 6%",
      "Flexible work arrangements and remote options",
      "Professional development budget ($2,000/year)",
      "Unlimited PTO policy",
      "Latest MacBook Pro and equipment",
      "Catered lunches and snacks in office",
      "Annual team retreats and events"
    ],
    postedDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isNew: true,
    companyLogo: "/placeholder.svg?height=40&width=40&text=TC",
    companyDescription: "TechCorp Inc. is a leading technology company focused on building innovative solutions that transform how businesses operate. With over 500 employees across 5 offices, we're committed to creating a culture of excellence, collaboration, and continuous learning.",
    applicationUrl: "https://techcorp.example.com/careers/senior-frontend-developer"
  },
  {
    id: "2",
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    type: "full-time",
    salary: "$100k - $140k",
    description:
      "StartupXYZ is seeking a talented Product Manager to drive the vision and execution of our flagship SaaS platform. In this pivotal role, you'll define product strategy, prioritize features, and work cross-functionally to deliver solutions that delight our customers and drive business growth.\n\nYou'll be the voice of the customer within the organization, conducting research, gathering feedback, and translating insights into actionable product requirements. This is an excellent opportunity for someone who thrives in a fast-paced startup environment and wants to make a significant impact on a rapidly growing product.",
    requirements: [
      "3+ years of product management experience in SaaS or tech",
      "Technical background or strong technical aptitude",
      "Experience with Agile/Scrum methodologies",
      "Proven track record of shipping successful products",
      "Excellent analytical and problem-solving skills",
      "Strong communication and stakeholder management",
      "Data-driven decision-making approach",
      "Experience with product analytics tools (Mixpanel, Amplitude, etc.)"
    ],
    responsibilities: [
      "Define and communicate product vision and strategy",
      "Develop and maintain product roadmap based on business priorities",
      "Gather and prioritize product requirements from stakeholders",
      "Work closely with engineering, design, and marketing teams",
      "Conduct user research and analyze customer feedback",
      "Define success metrics and track product performance",
      "Make data-driven decisions to optimize product features",
      "Present product updates to leadership and stakeholders"
    ],
    benefits: [
      "Competitive salary with generous equity package",
      "Health, dental, and vision insurance",
      "Flexible working hours and hybrid work model",
      "Professional growth opportunities",
      "Modern office in Manhattan with great perks",
      "Commuter benefits",
      "Company-sponsored team events",
      "Latest tools and software"
    ],
    postedDate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isNew: true,
    companyLogo: "/placeholder.svg?height=40&width=40&text=SX",
    companyDescription: "StartupXYZ is a fast-growing B2B SaaS company revolutionizing how businesses manage their operations. Founded in 2020, we've raised $25M in funding and serve over 1,000 customers worldwide.",
    applicationUrl: "https://startupxyz.example.com/jobs/product-manager"
  },
  {
    id: "3",
    title: "UX Designer",
    company: "Design Studio",
    location: "Remote",
    type: "remote",
    salary: "$80k - $110k",
    description:
      "Join our award-winning design team as a UX Designer and create exceptional digital experiences for a diverse portfolio of clients. You'll work on projects ranging from mobile apps to enterprise software, collaborating with clients and internal teams to deliver user-centered design solutions.\n\nThis is a fully remote position that offers the flexibility to work from anywhere while being part of a supportive, creative team. We're looking for someone who is passionate about understanding user needs and translating them into elegant, functional designs.",
    requirements: [
      "3+ years of UX design experience",
      "Strong portfolio demonstrating user-centered design process",
      "Expert proficiency in Figma and design tools",
      "Experience conducting user research and usability testing",
      "Understanding of information architecture and interaction design",
      "Knowledge of accessibility standards (WCAG)",
      "Excellent presentation and communication skills",
      "Bachelor's degree in Design, HCI, or related field"
    ],
    responsibilities: [
      "Create wireframes, prototypes, and high-fidelity designs",
      "Conduct user research, interviews, and usability testing",
      "Develop user personas, journey maps, and flow diagrams",
      "Collaborate with clients to understand business requirements",
      "Work with developers to ensure design feasibility",
      "Present design concepts and rationale to stakeholders",
      "Iterate designs based on feedback and testing results",
      "Maintain design systems and component libraries"
    ],
    benefits: [
      "Competitive salary with performance bonuses",
      "100% remote work with flexible hours",
      "Health and wellness benefits",
      "Home office setup stipend ($1,500)",
      "Professional development and conference budget",
      "Generous PTO (20 days + holidays)",
      "Latest design tools and software",
      "Annual company retreat"
    ],
    postedDate: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    isNew: true,
    companyLogo: "/placeholder.svg?height=40&width=40&text=DS",
    companyDescription: "Design Studio is a boutique digital design agency specializing in creating beautiful, user-friendly experiences for startups and enterprises. With a fully distributed team, we've completed over 200 projects for clients worldwide.",
    applicationUrl: "https://designstudio.example.com/careers/ux-designer"
  },
  {
    id: "4",
    title: "Backend Engineer",
    company: "CloudTech Solutions",
    location: "Austin, TX",
    type: "full-time",
    salary: "$110k - $150k",
    description:
      "CloudTech Solutions is looking for an experienced Backend Engineer to design and build scalable, high-performance APIs and microservices. You'll work with cutting-edge cloud technologies to power our platform that serves thousands of enterprise customers.\n\nJoin a team of talented engineers who are passionate about building robust, maintainable systems. You'll have the opportunity to work on challenging technical problems and contribute to architectural decisions that shape the future of our platform.",
    requirements: ["4+ years backend development (Node.js, Python, or Go)", "Strong experience with AWS or GCP", "Microservices architecture knowledge", "SQL and NoSQL databases", "RESTful API design", "Experience with message queues (RabbitMQ, Kafka)", "Understanding of security best practices"],
    responsibilities: ["Design and develop RESTful APIs and microservices", "Optimize database queries and performance", "Implement security and data protection measures", "Write unit and integration tests", "Collaborate with frontend team on API contracts", "Monitor system performance and troubleshoot issues", "Participate in on-call rotation"],
    benefits: ["Competitive salary and stock options", "Comprehensive health benefits", "Flexible hybrid work model", "Learning and development budget", "Ergonomic office setup", "Team lunches and social events", "Parental leave"],
    postedDate: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    isNew: true,
    companyLogo: "/placeholder.svg?height=40&width=40&text=CT",
    companyDescription: "CloudTech Solutions provides enterprise cloud infrastructure and SaaS solutions to Fortune 500 companies. Founded in 2015, we're a profitable, rapidly growing company with 200+ employees.",
    applicationUrl: "https://cloudtech.example.com/careers/backend-engineer"
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Seattle, WA",
    type: "full-time",
    salary: "$130k - $170k",
    description:
      "We're seeking a talented Data Scientist to join our analytics team and help drive data-driven decision making across the organization. You'll work on exciting projects involving predictive modeling, machine learning, and advanced analytics to solve complex business problems.\n\nThis role offers the opportunity to work with large-scale datasets and cutting-edge ML technologies while collaborating with cross-functional teams.",
    requirements: ["Master's or PhD in Data Science, Statistics, or related field", "Strong programming skills in Python or R", "Experience with ML frameworks (TensorFlow, PyTorch, scikit-learn)", "Solid understanding of statistics and experimental design", "Experience with big data tools (Spark, Hadoop)", "Strong communication skills to explain complex findings", "SQL proficiency"],
    responsibilities: ["Build and deploy machine learning models", "Analyze large datasets to extract actionable insights", "Design and run A/B tests", "Create data visualizations and dashboards", "Collaborate with product and engineering teams", "Present findings to stakeholders", "Stay current with latest ML research"],
    benefits: ["Top-tier compensation and equity", "Comprehensive insurance coverage", "Relocation assistance available", "Conference attendance and learning budget", "Modern office with great amenities", "Flexible PTO", "Retirement matching"],
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isNew: false,
    companyLogo: "/placeholder.svg?height=40&width=40&text=AP",
    companyDescription: "Analytics Pro is a data analytics platform helping businesses make better decisions through advanced analytics and AI. We process billions of data points daily for over 5,000 enterprise clients.",
    applicationUrl: "https://analyticspro.example.com/jobs/data-scientist"
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "Infrastructure Inc.",
    location: "Denver, CO",
    type: "full-time",
    salary: "$115k - $145k",
    description: "Join our DevOps team to build and maintain the infrastructure that powers our global platform. You'll work on automation, CI/CD pipelines, and ensuring high availability and performance of our systems. This is a hands-on role where you'll have significant impact on our infrastructure strategy and implementation.",
    requirements: ["3+ years DevOps/SRE experience", "Strong knowledge of Docker and Kubernetes", "Experience with CI/CD tools (Jenkins, GitLab CI, CircleCI)", "Cloud platform expertise (AWS, Azure, or GCP)", "Infrastructure as Code (Terraform, CloudFormation)", "Scripting skills (Python, Bash)", "Monitoring and logging tools experience"],
    responsibilities: ["Design and maintain CI/CD pipelines", "Manage Kubernetes clusters and container orchestration", "Implement infrastructure as code", "Monitor system performance and reliability", "Automate deployment processes", "Troubleshoot production issues", "Improve system security and compliance"],
    benefits: ["Competitive salary with bonus potential", "Full health and wellness benefits", "Remote work options (2 days/week)", "Professional certification reimbursement", "Generous PTO and holidays", "401(k) matching", "Stock options"],
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isNew: false,
    companyLogo: "/placeholder.svg?height=40&width=40&text=II",
    companyDescription: "Infrastructure Inc. provides managed cloud infrastructure services to enterprises worldwide. We manage millions of servers and maintain 99.99% uptime for our customers.",
    applicationUrl: "https://infrastructure-inc.example.com/careers/devops"
  },
  {
    id: "7",
    title: "Marketing Manager",
    company: "Growth Agency",
    location: "Los Angeles, CA",
    type: "full-time",
    salary: "$85k - $115k",
    description: "Growth Agency is seeking a creative and data-driven Marketing Manager to lead our digital marketing initiatives. You'll develop and execute marketing strategies across multiple channels, manage campaigns, and drive growth for our clients in the tech and e-commerce sectors.",
    requirements: ["5+ years digital marketing experience", "Proven track record of successful campaigns", "Expertise in Google Analytics, SEO, and SEM", "Experience with marketing automation tools", "Strong content creation and copywriting skills", "Social media management experience", "Budget management skills"],
    responsibilities: ["Develop comprehensive marketing strategies", "Plan and execute multi-channel campaigns", "Manage social media presence and content calendar", "Analyze campaign performance and ROI", "Collaborate with creative team on content", "Manage marketing budget and vendors", "Report on KPIs to leadership"],
    benefits: ["Competitive salary with performance bonuses", "Health, dental, and vision insurance", "Flexible work schedule", "Creative and collaborative work environment", "Professional development opportunities", "Company events and team outings", "Downtown LA office with great perks"],
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isNew: false,
    companyLogo: "/placeholder.svg?height=40&width=40&text=GA",
    companyDescription: "Growth Agency is a full-service digital marketing agency focused on driving measurable results for tech startups and e-commerce brands. We've helped over 100 companies scale their marketing.",
    applicationUrl: "https://growthagency.example.com/jobs/marketing-manager"
  },
  {
    id: "8",
    title: "Mobile Developer",
    company: "App Innovations",
    location: "Miami, FL",
    type: "contract",
    salary: "$70 - $90/hour",
    description: "App Innovations is looking for an experienced Mobile Developer for a 6-month contract (with possibility of extension) to build and maintain cross-platform mobile applications. You'll work on consumer-facing apps with millions of users, using React Native to deliver high-quality mobile experiences.",
    requirements: ["4+ years React Native development", "Published apps on iOS App Store and Google Play", "Strong JavaScript/TypeScript skills", "Experience with mobile UI/UX best practices", "Knowledge of native iOS/Android development", "Experience with RESTful APIs and state management", "Understanding of mobile app performance optimization"],
    responsibilities: ["Develop new features for mobile applications", "Maintain and improve existing codebase", "Optimize app performance and responsiveness", "Integrate with backend APIs", "Implement responsive designs from Figma mockups", "Write unit and integration tests", "Participate in code reviews", "Collaborate with product and design teams"],
    benefits: ["Competitive hourly rate", "Flexible working hours", "Remote work option", "Possibility of contract extension or full-time conversion", "Work on high-impact consumer apps", "Collaborative team environment"],
    postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    isNew: false,
    companyLogo: "/placeholder.svg?height=40&width=40&text=AI",
    companyDescription: "App Innovations builds consumer mobile applications that have been downloaded over 50 million times. We specialize in lifestyle, fitness, and productivity apps.",
    applicationUrl: "https://appinnovations.example.com/contractors/mobile-developer"
  },
]

export const jobTypes = ["full-time", "part-time", "contract", "remote"] as const
export const dateFilters = ["today", "week", "month", "all"] as const

export function getRecentJobs(): Job[] {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  return mockJobs.filter((job) => job.postedDate > oneDayAgo)
}

export function filterJobs(
  jobs: Job[],
  searchTerm: string,
  location: string,
  jobType: string,
  dateFilter: string,
): Job[] {
  return jobs.filter((job) => {
    // Search term filter
    const matchesSearch =
      !searchTerm ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())

    // Location filter
    const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase())

    // Job type filter
    const matchesJobType = !jobType || jobType === "all" || job.type === jobType

    // Date filter
    let matchesDate = true
    if (dateFilter && dateFilter !== "all") {
      const now = new Date()
      const jobDate = job.postedDate

      switch (dateFilter) {
        case "today":
          matchesDate = jobDate.toDateString() === now.toDateString()
          break
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = jobDate > weekAgo
          break
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = jobDate > monthAgo
          break
      }
    }

    return matchesSearch && matchesLocation && matchesJobType && matchesDate
  })
}
