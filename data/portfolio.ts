import type {
  AboutContent,
  Education,
  ExperienceEntry,
  NavItem,
  Principle,
  Profile,
  Project,
  SkillCategory,
} from "./types";

/*
 * ---------------------------------------------------------------------------
 * CENTRALIZED PORTFOLIO CONTENT
 * ---------------------------------------------------------------------------
 * Edit copy here; no component changes are needed. Every fact below was checked
 * against a primary source: the public GitHub profile and repositories of
 * aniketbarai (repository descriptions, package manifests, contributor counts,
 * commit and creation dates), the profile README, and the previous live
 * portfolio at abarai.netlify.app. Anything that could not be verified is either
 * omitted or explicitly described as not published.
 *
 * Fields typed `| null` render an honest empty state — they never produce a
 * dead link or a borrowed number.
 *
 * To add a project: append an object to `projects`. The gallery, detail view and
 * mobile carousel pick it up automatically.
 * ---------------------------------------------------------------------------
 */

export const profile: Profile = {
  name: "Aniket Barai",
  monogram: "AB",
  siteName: "Aniket Barai — Full-Stack Developer",
  title: "Full-Stack Developer",
  status: "Open to software engineering internships",
  headline: "Engineering Ideas Into Digital Reality.",
  description:
    "Full-Stack Developer building performant web applications, intelligent digital experiences, and scalable software.",
  email: "aniketbarai677@gmail.com",
  github: "https://github.com/aniketbarai",
  /* Set this to your LinkedIn URL, e.g. "https://www.linkedin.com/in/…".
     While it is null the LinkedIn row is hidden instead of linking nowhere. */
  linkedin: null,
  phone: "+91 73044 14905",
  location: "Mumbai, India",
};

export const navigation: readonly NavItem[] = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export const about: AboutContent = {
  intro: [
    "I'm Aniket Barai, a Computer Engineering student in Mumbai who builds full-stack web applications with React, Node.js, Express and MongoDB — and increasingly with Next.js, TypeScript and Python.",
    "I care about the distance between a working prototype and software people can rely on: clear data models, secure authentication, and interfaces that stay responsive when the data arrives slowly.",
  ],
  focus: [
    "Full-stack product work: React and Next.js frontends on Express, MongoDB and Postgres backends, with JWT and Supabase authentication, deployed on Vercel and Render.",
  ],
  interests: [
    "AI-powered applications: generating and explaining content with Gemini and OpenAI-compatible APIs, and computer vision with MediaPipe.",
    "Problem solving: 244+ algorithmic problems across CodeChef, GeeksforGeeks and HackerRank, with my Java solutions published on GitHub.",
    "Production-oriented projects: a live client website, a four-person cybersecurity platform, and an independently published price tracker.",
    "Teamwork and leadership: elected class representative for two semesters, and hands-on contributions to three-person and four-person project teams.",
  ],
  facts: [
    { label: "Based in", value: "Mumbai, Maharashtra, India" },
    {
      label: "Studying",
      value: "Diploma in Computer Engineering, Government Polytechnic Mumbai (2024 — 2027)",
    },
    { label: "Building with", value: "React · Next.js · Node.js · Express · MongoDB · Python" },
    { label: "Leadership", value: "Class representative, 2nd and 3rd semester" },
  ],
};

/*
 * Ordered by the strength of the work, not by date. Each entry states what was
 * built, how it was implemented, and exactly what my contribution was.
 */
export const projects: readonly Project[] = [
  {
    slug: "hackaware",
    title: "HackAware",
    category: "Cybersecurity simulation platform",
    year: "2026",
    problem:
      "Security awareness is usually taught as theory. Reading about an attack is not the same as watching one run and understanding which defence stops it.",
    built: [
      "Simulated attack and defence scenarios users can walk through safely",
      "Scenario-driven React interface with motion-led transitions",
      "Express API with account authentication and persisted progress",
    ],
    implementation: [
      "Express 5 API with Mongoose models, JWT sessions and bcrypt password hashing",
      "Vite, React 19, Tailwind CSS v4 and Framer Motion on the client",
      "Frontend and backend run together from one concurrently-based dev script",
    ],
    stack: ["React 19", "Vite", "Tailwind CSS", "Framer Motion", "Express 5", "MongoDB", "JWT"],
    role: "One of four developers (with Kirti Sheth, Shubham Shinde and Rutuja Harugade) and the most active contributor to the repository — 39 of 49 commits.",
    source: "contributor",
    github: "https://github.com/primecodestudio74-ui/CyberAttacks",
    live: null,
    image: null,
    accent: "cyan",
    emblem: "shield",
  },
  {
    slug: "trackdeal",
    title: "trackdeal",
    category: "Price tracking web application",
    year: "2026",
    problem:
      "Watching prices across several stores means checking the same pages by hand, over and over, and remembering numbers that change without warning.",
    built: [
      "Product tracking with per-user accounts and a dashboard",
      "Price history visualised as charts instead of a single current figure",
      "Scheduled checks that record new prices without anyone opening the site",
    ],
    implementation: [
      "Next.js 16 App Router with Supabase for authentication and hosted Postgres",
      "Firecrawl reads product pages server-side and returns structured price data",
      "A Vercel cron route runs the checks on a schedule; Resend handles notifications",
    ],
    stack: ["Next.js 16", "React 19", "Supabase", "Tailwind CSS", "Recharts", "Firecrawl", "Resend"],
    role: "Sole developer; the only contributor to the repository.",
    source: "owned",
    github: "https://github.com/aniketbarai/trackdeal",
    live: "https://my-trackdeal.vercel.app",
    image: null,
    accent: "silver",
    emblem: "pulse",
  },
  {
    slug: "interview-prep-ai",
    title: "Interview Prep AI",
    category: "AI-assisted interview preparation",
    year: "2026",
    problem:
      "Generic question banks don't match a specific role or experience level, and passive reading doesn't build the recall interviews demand.",
    built: [
      "Role- and experience-specific interview sessions",
      "Accordion interface separating questions, answers, explanations and personal notes",
      "Pin system for revision and persistent session history",
    ],
    implementation: [
      "JWT authentication with bcrypt password hashing",
      "Server-side AI integration for generating questions and on-demand explanations",
      "MongoDB sessions with Mongoose, so users can pause and resume",
    ],
    stack: ["React", "Tailwind CSS", "Node.js", "Express", "MongoDB", "JWT", "Gemini API"],
    role: "Sole developer; the only contributor to the repository (88 commits).",
    source: "owned",
    github: "https://github.com/aniketbarai/Interview-Prep-AI",
    live: "https://interview-prep-ai-rho.vercel.app",
    image: null,
    accent: "cyan",
    emblem: "rings",
  },
  {
    slug: "craftonbags",
    title: "CraftonBags",
    category: "MERN e-commerce platform",
    year: "2026",
    problem:
      "A bag store needs an online storefront where customers can browse and buy, while the team manages products without touching code.",
    built: [
      "Storefront with product browsing and a shopping cart",
      "Customer authentication",
      "Admin dashboard for product management",
    ],
    implementation: [
      "Express and MongoDB backend with Mongoose models",
      "Firebase Google sign-in, with firebase-admin on the Express backend",
      "Redux Toolkit state management on the React frontend",
    ],
    stack: ["React", "Vite", "Redux Toolkit", "Tailwind CSS", "Express", "MongoDB", "Firebase"],
    role: "Most active of three contributors on the project (60 of 71 commits on GitHub), working across the storefront and backend integration.",
    source: "contributor",
    github: "https://github.com/kirti24-s/craftonbags",
    live: null,
    image: null,
    accent: "lime",
    emblem: "stack",
  },
  {
    slug: "weddingbingo",
    title: "WeddingBingo",
    category: "Client website for a photography business",
    year: "2026",
    problem:
      "A wedding photography business needs a site that presents its work with a cinematic feel and turns visitor enquiries into direct emails.",
    built: [
      "Image gallery with like and click tracking",
      "Contact form that sends email notifications",
      "Scroll-based animations in a dark, editorial theme",
    ],
    implementation: [
      "React and Vite frontend with an Express and MongoDB backend",
      "Helmet, rate limiting and express-validator on the API",
      "Nodemailer for enquiry notifications and ImageKit for image delivery",
    ],
    stack: ["React", "Tailwind CSS", "Framer Motion", "Express", "MongoDB", "Nodemailer", "ImageKit"],
    role: "Sole developer; the only contributor to the repository (36 commits).",
    source: "owned",
    github: "https://github.com/aniketbarai/WeddingBingo",
    live: "https://weddingbingo.in",
    image: null,
    accent: "silver",
    emblem: "grid",
  },
  {
    slug: "signspace",
    title: "sign/space",
    category: "Computer-vision workspace",
    year: "2026",
    problem:
      "Keyboards and passwords are not the only inputs a digital workspace could use. This project explores faces, hands and expressions as interface signals.",
    built: [
      "Passwordless face authentication",
      "Hand-gesture controls inside the workspace",
      "Facial-expression analysis in a real-time interface",
    ],
    implementation: [
      "MediaPipe vision models for hand and face tracking",
      "A separate FastAPI service for the AI components",
      "React and TypeScript client with an Express and MongoDB backend",
    ],
    stack: ["React", "TypeScript", "Express", "MongoDB", "FastAPI", "MediaPipe", "Python"],
    role: "Sole developer; the only contributor to the repository (12 commits).",
    source: "owned",
    github: "https://github.com/aniketbarai/signspace",
    live: "https://signspace-1.onrender.com",
    image: null,
    accent: "cyan",
    emblem: "prism",
  },
  {
    slug: "qmaster",
    title: "QMaster",
    category: "Educational quiz application",
    year: null,
    problem:
      "Practising for a quiz is often passive: read the questions, skim the answers, and hope the format sticks. A working quiz app makes the practice active.",
    built: [
      "Interactive quiz flow with scoring and feedback",
      "Question data loaded and processed before a round starts",
      "Single Python application with a browser interface",
    ],
    implementation: [
      "Built in Python and Streamlit, so the whole app is one runnable script",
      "A data-processing step prepares the question set for each round",
    ],
    stack: ["Python", "Streamlit", "pandas"],
    role: "Sole developer. The source is not published, so no repository link is listed.",
    source: "owned",
    github: null,
    live: null,
    image: null,
    accent: "lime",
    emblem: "grid",
  },
];

export const skillCategories: readonly SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend Development",
    summary: "Component-driven interfaces with a focus on responsive layout and motion.",
    skills: [
      { name: "React", usage: "Component architecture and state for the HackAware, CraftonBags, WeddingBingo and Interview Prep AI interfaces." },
      { name: "Next.js", usage: "App Router applications: the trackdeal price tracker (Next.js 16) and this portfolio." },
      { name: "Tailwind CSS", usage: "Design tokens and responsive utility layouts across every frontend I have built." },
      { name: "Framer Motion", usage: "Scroll-based and interaction animation in WeddingBingo and HackAware." },
      { name: "Redux Toolkit", usage: "Shared client state for the CraftonBags storefront." },
      { name: "Three.js / R3F", usage: "WebGL scenes with React Three Fiber and Drei in this portfolio." },
    ],
  },
  {
    id: "backend",
    label: "Backend Development",
    summary: "REST APIs, authentication and server-side validation.",
    skills: [
      { name: "Node.js", usage: "Runtime for the API servers behind CraftonBags, WeddingBingo, HackAware and Interview Prep AI." },
      { name: "Express.js", usage: "Routing, middleware and validation for the REST endpoints in those projects." },
      { name: "JWT", usage: "Token-based session authentication in Interview Prep AI, HackAware and sign/space." },
      { name: "Firebase Admin", usage: "Verifying Firebase Google sign-in on the CraftonBags backend." },
      { name: "Nodemailer", usage: "Email notifications for contact enquiries in WeddingBingo." },
      { name: "FastAPI", usage: "Python service for the AI components in the sign/space project." },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    summary: "Document, relational and managed data layers for the projects I have shipped.",
    skills: [
      { name: "MongoDB", usage: "Primary document store for CraftonBags, WeddingBingo, HackAware, Interview Prep AI and sign/space." },
      { name: "Mongoose", usage: "Schemas and models for users, sessions and content." },
      { name: "MySQL", usage: "Relational data layer in sign/space, accessed through Drizzle ORM." },
      { name: "Supabase", usage: "Authentication and hosted Postgres for the trackdeal price tracker." },
    ],
  },
  {
    id: "languages",
    label: "Programming Languages",
    summary: "The languages I use for product code and for problem solving.",
    skills: [
      { name: "JavaScript", usage: "Primary language for the full-stack web projects." },
      { name: "TypeScript", usage: "Typed client and server code in sign/space and this portfolio." },
      { name: "Java", usage: "Object-oriented practice and the 244+ algorithmic solutions I have published." },
      { name: "Python", usage: "The FastAPI vision service, Streamlit apps and my data-processing practice." },
      { name: "C", usage: "Low-level exercises while studying computer engineering and applied security." },
      { name: "HTML & CSS", usage: "Semantic markup and layout for every frontend I build." },
    ],
  },
  {
    id: "ai",
    label: "AI and Data",
    summary: "Practical AI integrations and computer vision, built into real applications.",
    skills: [
      { name: "Gemini API", usage: "Generating role-specific interview questions and explanations in Interview Prep AI." },
      { name: "OpenAI / OpenRouter", usage: "OpenAI-compatible model APIs integrated server-side in Interview Prep AI." },
      { name: "MediaPipe", usage: "Hand and face tracking for the gesture and authentication features in sign/space." },
      { name: "pandas & NumPy", usage: "Loading, cleaning and aggregating datasets in my Python practice repository and in QMaster." },
      { name: "Firecrawl", usage: "Server-side extraction of product pages that feeds trackdeal's price history." },
    ],
  },
  {
    id: "tools",
    label: "Developer Tools",
    summary: "The workflow that takes code from a local branch to a live URL.",
    skills: [
      { name: "Git & GitHub", usage: "Version control, pull requests and the public history of every project here." },
      { name: "Vite", usage: "Build tooling for the React applications (CraftonBags, HackAware, WeddingBingo)." },
      { name: "Streamlit", usage: "The browser interface for the QMaster quiz application." },
      { name: "Postman", usage: "Exercising and debugging REST endpoints during backend work." },
      { name: "Figma", usage: "Interface layout and design planning before implementation." },
      { name: "Vercel & Render", usage: "Hosting for Interview Prep AI, trackdeal and sign/space, with scheduled jobs on Vercel." },
      { name: "VS Code", usage: "Primary editor for development." },
    ],
  },
];

export const education: readonly Education[] = [
  {
    id: "diploma",
    qualification: "Diploma in Computer Engineering",
    institution: "Government Polytechnic Mumbai",
    period: "2024 — 2027",
    startedOn: "2024-08",
    status: "current",
    detail: "Coursework in programming, data structures, databases, networking and software engineering.",
  },
  {
    id: "ssc",
    qualification: "Secondary School Certificate (SSC)",
    institution: "Guru Nanak High School",
    period: "2023 — 2024",
    startedOn: "2023-06",
    status: "completed",
    detail: "Completed secondary education with 90%.",
  },
];

export const experience: readonly ExperienceEntry[] = [
  {
    id: "trackdeal",
    kind: "project",
    title: "Developer, trackdeal",
    organization: "Personal project",
    period: "Sep 2026",
    startedOn: "2026-09",
    summary:
      "Built a price tracker on Next.js 16 with Supabase accounts, Firecrawl extraction and scheduled price checks.",
    highlights: [
      "Server-side extraction of product pages into structured price records",
      "Supabase authentication and Postgres behind per-user dashboards",
      "A Vercel cron route runs the scheduled checks without a manual trigger",
    ],
    links: [{ label: "Live demo", href: "https://my-trackdeal.vercel.app" }],
  },
  {
    id: "signspace",
    kind: "project",
    title: "Developer, sign/space",
    organization: "Personal project",
    period: "Sep 2026",
    startedOn: "2026-09",
    summary:
      "Built a computer-vision workspace that uses face authentication, hand gestures and expression analysis as interface inputs.",
    highlights: [
      "Integrated MediaPipe tracking with a React and TypeScript client",
      "Split the AI components into a FastAPI service",
      "Deployed as a live web application",
    ],
    links: [{ label: "Live demo", href: "https://signspace-1.onrender.com" }],
  },
  {
    id: "primecode-studio",
    kind: "client",
    title: "Team member",
    organization: "PrimeCode Studio — web development & AI solutions",
    period: "Jul 2026",
    startedOn: "2026-07",
    summary:
      "Contributed to the official website of PrimeCode Studio, a web development and AI solutions agency.",
    highlights: [
      "Member of the PrimeCode Studio GitHub organization",
      "Six commits to the agency's website repository in July 2026",
    ],
    links: [{ label: "Agency website", href: "https://primecodestudio.in" }],
  },
  {
    id: "hackaware",
    kind: "project",
    title: "Contributor, HackAware",
    organization: "Four-person team project",
    period: "Mar 2026 — Jul 2026",
    startedOn: "2026-03",
    summary:
      "Worked on a cybersecurity simulation platform that lets people walk through attack and defence scenarios in a safe environment.",
    highlights: [
      "Most active contributor on the repository (39 of 49 commits)",
      "Built the Express 5 API layer with JWT sessions and bcrypt hashing",
      "Worked alongside three teammates on the React 19 client",
    ],
    links: [{ label: "Repository", href: "https://github.com/primecodestudio74-ui/CyberAttacks" }],
  },
  {
    id: "interview-prep-ai",
    kind: "project",
    title: "Developer, Interview Prep AI",
    organization: "Personal project",
    period: "May 2026 — Aug 2026",
    startedOn: "2026-05",
    summary:
      "Designed and built an AI-assisted interview preparation platform with authentication, session history and revision tools.",
    highlights: [
      "Owned the full stack from authentication to AI-generated content",
      "Shipped a persistent session model so practice can be paused and resumed",
    ],
    links: [{ label: "Live demo", href: "https://interview-prep-ai-rho.vercel.app" }],
  },
  {
    id: "craftonbags",
    kind: "project",
    title: "Contributor, CraftonBags",
    organization: "Three-person project team",
    period: "May 2026 — Jul 2026",
    startedOn: "2026-05",
    summary:
      "Worked on a MERN e-commerce platform with authentication, a cart, an admin dashboard and backend integration.",
    highlights: [
      "Most active contributor on the repository (60 of 71 commits)",
      "Worked on the storefront and the API together with teammates",
    ],
    links: [{ label: "Repository", href: "https://github.com/kirti24-s/craftonbags" }],
  },
  {
    id: "weddingbingo",
    kind: "client",
    title: "Developer, WeddingBingo",
    organization: "Wedding photography business",
    period: "Apr 2026 — Sep 2026",
    startedOn: "2026-04",
    summary:
      "Built the full-stack website for a wedding photography business, including the gallery, enquiry form and notifications.",
    highlights: [
      "Designed and implemented the image gallery and interaction tracking",
      "Connected the contact form to email notifications",
    ],
    links: [{ label: "Live site", href: "https://weddingbingo.in" }],
  },
  {
    id: "class-representative",
    kind: "leadership",
    title: "Class Representative",
    organization: "Government Polytechnic Mumbai",
    period: "2nd & 3rd semester",
    startedOn: "2025-01",
    summary:
      "Elected by my cohort to represent students to the department and to keep day-to-day academic operations running.",
    highlights: [
      "Maintained communication between students and faculty",
      "Coordinated schedules and logistics for class-wide technical activities",
    ],
  },
  {
    id: "technical-events",
    kind: "event",
    title: "Hackathons & technical events",
    organization: "Inter-college competitions",
    period: "2025 — 2026",
    startedOn: "2025-06",
    summary:
      "Took part in coding challenges, technical quizzes and rapid-innovation hackathons alongside coursework.",
    highlights: [
      "6+ competitions entered in algorithm, quiz and hackathon formats",
      "Practised building under fixed timelines as part of a team",
    ],
  },
  {
    id: "competitive-programming",
    kind: "achievement",
    title: "Competitive programming & problem solving",
    organization: "CodeChef, GeeksforGeeks, HackerRank",
    period: "Jun 2025 — Oct 2025",
    startedOn: "2025-06",
    summary:
      "Solved 244+ algorithmic problems across several platforms and documented the Java solutions publicly.",
    highlights: [
      "Solutions catalogued in the ProblemSolving-Code repository",
      "Regular practice on CodeChef alongside coursework",
    ],
    links: [{ label: "Solutions", href: "https://github.com/aniketbarai/ProblemSolving-Code" }],
  },
];

export const principles: readonly Principle[] = [
  {
    id: "architecture",
    title: "Clean architecture",
    body: "Separate interface, domain logic and data access so each part can change without breaking the others.",
    icon: "layers",
  },
  {
    id: "performance",
    title: "Performance optimization",
    body: "Measure first. Ship less JavaScript, load heavy views lazily, and keep the first screen useful while anything expensive loads.",
    icon: "gauge",
  },
  {
    id: "user",
    title: "User-centered engineering",
    body: "Design for the path a real person takes, including loading, empty and error states, on any screen size.",
    icon: "users",
  },
  {
    id: "backend",
    title: "Reliable backend systems",
    body: "Validate input at the boundary, protect routes with authentication, and fail with errors that are clear to the caller.",
    icon: "server",
  },
  {
    id: "maintainability",
    title: "Maintainability & scalability",
    body: "Keep modules small and typed. Prefer well-understood tools over clever abstractions, and keep the data model honest.",
    icon: "git",
  },
  {
    id: "learning",
    title: "Continuous learning",
    body: "Solve problems regularly and document what I learn. My public repositories are the working record.",
    icon: "book",
  },
];
