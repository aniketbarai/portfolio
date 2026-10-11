import type {
  AboutContent,
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
 * Edit copy here; no component changes are needed. Every fact below was
 * checked against the public GitHub profile and repositories of aniketbarai
 * (profile README, repository descriptions/homepages, contributor counts and
 * commit dates). Remove or rewrite any entry you cannot support.
 *
 * To add a project: append an object to `projects`. The gallery, detail
 * view and mobile carousel pick it up automatically.
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
  linkedin: null,
  location: null,
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
    "I'm Aniket Barai, a Computer Engineering diploma student who builds full-stack web applications with React, Node.js, Express, and MongoDB.",
    "I care about the distance between a working prototype and software people can rely on: clear data models, secure authentication, and interfaces that stay responsive.",
  ],
  focus: [
    "React frontends with Express and MongoDB backends, JWT and Firebase authentication, and deployments on Vercel and Render.",
  ],
  interests: [
    "AI-powered applications: generating and explaining content with Gemini and OpenAI-compatible APIs, and computer vision with MediaPipe.",
    "Problem solving: competitive programming on CodeChef, with Java solutions across platforms published on GitHub.",
    "Production-oriented projects: client-facing websites and a collaborative e-commerce platform.",
    "Teamwork: contributions to a three-person project team and to the website of a web development agency.",
  ],
};

export const projects: readonly Project[] = [
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
    slug: "interview-prep-ai",
    title: "Interview Prep AI",
    category: "AI-assisted interview preparation",
    year: "2026",
    problem:
      "Generic question banks don't match a specific role or experience level, and passive reading doesn't build the recall interviews demand.",
    built: [
      "Role- and experience-specific interview sessions",
      "Accordion interface separating questions, answers, explanations, and personal notes",
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
    slug: "weddingbingo",
    title: "WeddingBingo",
    category: "Full-stack photography website",
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
      "Helmet, rate limiting, and express-validator on the API",
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
      "Keyboards and passwords are not the only inputs a digital workspace could use. This project explores faces, hands, and expressions as interface signals.",
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
];

export const skillCategories: readonly SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend Development",
    summary: "Component-driven interfaces with a focus on responsive layout and motion.",
    skills: [
      { name: "React", usage: "Component architecture and state for the CraftonBags, WeddingBingo and Interview Prep AI interfaces." },
      { name: "Next.js", usage: "App Router, server components and metadata for this portfolio." },
      { name: "Tailwind CSS", usage: "Design tokens and responsive utility layouts across the projects above." },
      { name: "Framer Motion", usage: "Scroll-based and interaction animations in WeddingBingo and CraftonBags." },
      { name: "Redux Toolkit", usage: "Shared client state for the CraftonBags storefront." },
      { name: "Three.js / R3F", usage: "WebGL scenes with React Three Fiber and Drei in this portfolio." },
    ],
  },
  {
    id: "backend",
    label: "Backend Development",
    summary: "REST APIs, authentication and server-side validation.",
    skills: [
      { name: "Node.js", usage: "Runtime for the API servers behind CraftonBags, WeddingBingo and Interview Prep AI." },
      { name: "Express.js", usage: "Routing, middleware and validation for the REST endpoints in those projects." },
      { name: "JWT", usage: "Token-based session authentication in Interview Prep AI and other projects." },
      { name: "Firebase Admin", usage: "Verifying Firebase Google sign-in on the CraftonBags backend." },
      { name: "Nodemailer", usage: "Email notifications for contact enquiries in WeddingBingo." },
      { name: "FastAPI", usage: "Python service for AI components in the sign/space project." },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    summary: "Document and relational data models for the projects I have shipped.",
    skills: [
      { name: "MongoDB", usage: "Primary document store for CraftonBags, WeddingBingo, Interview Prep AI and sign/space." },
      { name: "Mongoose", usage: "Schemas and models for users, sessions and content." },
      { name: "MySQL", usage: "Relational data layer in sign/space, accessed through Drizzle ORM." },
    ],
  },
  {
    id: "languages",
    label: "Programming Languages",
    summary: "The languages I use for product code and for problem solving.",
    skills: [
      { name: "JavaScript", usage: "Primary language for the full-stack web projects." },
      { name: "TypeScript", usage: "Typed client and server code in sign/space and this portfolio." },
      { name: "Java", usage: "Object-oriented practice and competitive-programming solutions." },
      { name: "Python", usage: "Scripts, learning projects and the FastAPI AI service." },
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
      { name: "MediaPipe", usage: "Hand and face tracking for gesture and authentication features in sign/space." },
      { name: "Python data work", usage: "Notes, practice programs and datasets in my Python learning repository." },
    ],
  },
  {
    id: "tools",
    label: "Developer Tools",
    summary: "The workflow that takes code from a local branch to a live URL.",
    skills: [
      { name: "Git & GitHub", usage: "Version control, pull requests and public project history." },
      { name: "VS Code", usage: "Primary editor for development." },
      { name: "Postman", usage: "Exercising and debugging REST endpoints during backend work." },
      { name: "Figma", usage: "Interface layout and design planning before implementation." },
      { name: "Vercel & Render", usage: "Hosting the live deployments of Interview Prep AI and sign/space." },
    ],
  },
];

export const experience: readonly ExperienceEntry[] = [
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
    id: "competitive-programming",
    kind: "achievement",
    title: "Competitive programming & problem solving",
    organization: "CodeChef, GeeksforGeeks, HackerRank",
    period: "Jun 2025 — Oct 2025",
    startedOn: "2025-06",
    summary:
      "Practised algorithmic problems on several competitive programming platforms and documented the Java solutions publicly.",
    highlights: [
      "Solutions catalogued in the ProblemSolving-Code repository",
      "Active competitive programmer on CodeChef",
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
