export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  tags: string[];
  tech_stack: string[];
  thumbnail_url: string | null;
  demo_video_url: string | null;
  live_url: string | null;
  repository_url: string | null;
  repository_visibility?: "public" | "private";
  development_status?: "Idea" | "In Progress" | "Prototype" | "Completed" | "Archived";
  project_type?: string;
  role?: string;
  status: "published" | "draft";
  featured: boolean;
  published_at: string | null;
  like_count: number;
  comment_count: number;
  details: {
    problem: string;
    features: string[];
    challenges: string;
    solution?: string;
    architecture?: string;
    process?: string;
    outcomes?: string[];
    gallery?: Array<{ url: string; alt: string; caption?: string }>;
  };
};

export const profile = {
  name: "Luther John Allen Concepcion",
  handle: "@loter",
  role: "Junior Full Stack Web Developer",
  bio: "Computer Science student and freelance web developer building full-stack applications and offline AI systems. Open to junior developer roles and internships.",
  available: true as boolean | null,
  email: "lutherjohnallen@gmail.com",
  avatarUrl: "/media/luther-profile.png",
  resumeUrl: "/documents/luther-john-allen-concepcion-cv.pdf",
  socialLinks: {
    github: "https://github.com/loterrr",
    linkedin: "https://www.linkedin.com/in/lutherconcepcion",
    website: "",
  },
};

export const projects: Project[] = [{
  id: "peer-drop",
  slug: "peer-drop",
  title: "Peer Drop",
  summary: "Private browser-to-browser file sharing with WebRTC.",
  description: "A browser file-sharing application with a Next.js frontend and a Node.js/Fastify signaling backend. People connect through session links, room codes, or QR codes, with group-room access controls and direct browser-to-browser file transfers.",
  category: "Web",
  tags: ["File sharing", "WebRTC", "Privacy"],
  tech_stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Fastify", "Node.js", "WebRTC", "Redis", "PostgreSQL", "Docker", "Git"],
  thumbnail_url: null,
  demo_video_url: null,
  live_url: "https://peer-drop.vercel.app",
  repository_url: null,
  status: "published",
  project_type: "File-sharing application",
  role: "Solo Developer",
  featured: true,
  published_at: "2026-06",
  like_count: 0,
  comment_count: 0,
  details: {
    problem: "Sharing files between devices often requires uploading them to third-party storage or creating an account.",
    solution: "Connect browsers through shareable sessions and transfer file contents using WebRTC DataChannels, with STUN/TURN support for network traversal.",
    features: ["Shareable session links, six-character room codes, and QR codes", "Password-protected group rooms with host approval and a waiting room", "WebRTC DataChannels for direct browser-to-browser transfers", "Web Crypto API with ephemeral ECDH P-256 key exchange and AES-256-GCM chunk encryption", "Passkey and WebAuthn authentication support"],
    architecture: "Next.js provides the interface, while a Fastify server connects users for encrypted WebRTC file transfers. Redis holds temporary room data, PostgreSQL stores users and metadata, and Coturn helps devices connect across networks.",
    process: "Development tooling includes Vitest, ESLint, and tsx. Deployment configuration includes Docker Compose, Kubernetes manifests, and GitHub Actions CI/CD. The public frontend is hosted on Vercel.",
    challenges: "Connecting browsers across different networks requires signaling and NAT traversal. The project uses WebSockets for signaling and Coturn for STUN/TURN support.",
  },
}, {
  id: "togethercam",
  slug: "togethercam",
  title: "TogetherCam",
  summary: "A photo booth for taking pictures together or apart.",
  description: "A browser-based photo-booth experience with options to start a booth or join a room.",
  category: "Web",
  tags: ["Photo booth"],
  tech_stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "PostgreSQL", "Git"],
  thumbnail_url: null,
  demo_video_url: null,
  live_url: "https://togethercam.vercel.app",
  repository_url: null,
  status: "published",
  project_type: "Photo-booth application",
  role: "Solo Developer & Owner",
  featured: false,
  published_at: null,
  like_count: 0,
  comment_count: 0,
  details: {
    problem: "",
    features: ["Start a photo booth", "Join a room", "Canvas-based media processing", "GIF encoding with gifenc"],
    architecture: "React powers the photo booth, with browser tools handling images and GIF exports. Supabase manages accounts, database records, and media storage, while Vercel hosts the app.",
    process: "Testing tools include Vitest, React Testing Library, Happy DOM, and JSDOM.",
    challenges: "",
  },
}, {
  id: "gimik",
  slug: "gimik",
  title: "Gimik",
  summary: "Track nights out, venue hops, and shared memories with friends.",
  description: "A social night-out and hangout tracking web app inspired by Strava and Letterboxd, focused on Philippine nightlife venues, friend groups, live sessions, and post-night recaps. Safety check-ins are manual, with no background GPS tracking or gamified drinking.",
  category: "Web",
  tags: ["Social", "Philippine venues", "Session tracking"],
  tech_stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma", "Better Auth", "Leaflet", "Git"],
  thumbnail_url: null,
  demo_video_url: null,
  live_url: null,
  repository_url: null,
  status: "published",
  project_type: "Social hangout tracker",
  role: "Solo Developer & Owner",
  development_status: "Completed",
  featured: false,
  published_at: null,
  like_count: 0,
  comment_count: 0,
  details: {
    problem: "",
    features: ["Live session cockpit with timer, venue hops, timeline logs, expense splitting, and drink and memory tracking", "Animated night replay with milestone statistics and confetti", "Social feed, emoji reactions, friend graph, and friend statistics", "Philippine nightlife venue directory", "Manual Everyone Home check-ins without background GPS tracking", "Alcohol-neutral logging without gamified drinking"],
    architecture: "Next.js powers the social app, with PostgreSQL and Prisma storing sessions, venues, and activity. Better Auth manages sign-in, Leaflet displays maps, and an in-memory store provides a fallback.",
    process: "Tests use the Node test runner through tsx.",
    challenges: "",
  },
}, {
  id: "nearbyhelp",
  slug: "nearbyhelp",
  title: "NearbyHelp",
  summary: "A bilingual local-services marketplace for customers and verified providers.",
  description: "An English and Filipino hyperlocal on-site services marketplace covering service requests, provider verification, itemized quotes, direct-payment bookings, messaging, reviews, and disputes. The project uses local PGlite persistence, with Supabase as the target deployment backend.",
  category: "Web",
  tags: ["Marketplace", "Local services", "English / Filipino"],
  tech_stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PGlite", "PostgreSQL", "Leaflet", "Git"],
  thumbnail_url: null,
  demo_video_url: null,
  live_url: null,
  repository_url: null,
  status: "published",
  project_type: "Local-services marketplace",
  role: "Solo Developer & Owner",
  development_status: "Completed",
  featured: false,
  published_at: null,
  like_count: 0,
  comment_count: 0,
  details: {
    problem: "",
    features: ["Multi-step customer request wizard with local and server draft saving, service boundaries, and explicit publishing", "Provider onboarding with certification uploads, document scanning, and MFA-protected staff review", "Itemized, versioned quotes and immutable booking snapshots with direct-payment terms", "In-app messaging, reviews, ratings, and dispute resolution", "English and Filipino interface", "Marketplace maintenance sweeps"],
    architecture: "Next.js handles requests, quotes, bookings, and messaging. PGlite stores local data and IndexedDB saves drafts, with Supabase planned for deployment. Leaflet displays service areas, while Sharp and ClamAV process and scan uploads.",
    process: "Quality tools include Vitest, Playwright, Axe Core accessibility checks, and ESLint 9.",
    challenges: "",
  },
}, {
  id: "the-archive",
  slug: "the-archive",
  title: "The Archive",
  summary: "An offline-first mobile dashboard for daily life, finances, and personal records.",
  description: "A personal operations dashboard with a Nothing OS-inspired monochrome interface, dot-matrix typography, and glitch accents. It brings tasks, finance, habits, notes, calendars, and a secure vault into an offline-first mobile app.",
  category: "Mobile",
  tags: ["Offline-first", "Productivity", "Personal finance"],
  tech_stack: ["Flutter", "Dart", "Riverpod", "SQLite", "Git"],
  thumbnail_url: null,
  demo_video_url: null,
  live_url: null,
  repository_url: null,
  status: "published",
  project_type: "Personal operations mobile app",
  role: "Solo Developer & Owner",
  development_status: "Completed",
  featured: false,
  published_at: null,
  like_count: 0,
  comment_count: 0,
  details: {
    problem: "",
    features: ["Daily briefing dashboard with quick capture", "Task priority scoring based on deadlines, importance, procrastination, and energy", "Income, expenses, recurring subscriptions, and budgets", "Statistical spending anomaly detection and rule-based productivity insights", "Secure vault for credentials, recovery codes, and notes with biometric or PIN access", "Habits, notes, calendar, and immersive landscape desk clock", "Android home-screen widgets and deep-linked quick entry"],
    architecture: "Flutter provides the mobile interface, Riverpod manages app state, and Drift stores data locally in SQLite. Secure storage protects vault credentials, while device services handle widgets, notifications, and biometric access.",
    process: "Code generation uses build_runner and drift_dev. CI configuration is provided through Codemagic.",
    challenges: "",
  },
}, {
  id: "isked",
  slug: "isked",
  title: "iSked",
  summary: "An offline academic companion that turns study loads into schedules.",
  description: "iSked — Smart Schedule Auto-Maker is a privacy-focused academic companion for university students. It scans study loads and syllabi, parses schedules locally, builds timetables, tracks tasks, calculates grades, and runs study timers without a cloud account or server.",
  category: "Mobile",
  tags: ["Education", "Offline-first", "OCR", "Scheduling"],
  tech_stack: ["Flutter", "Dart", "Riverpod", "SQLite", "Google ML Kit", "Git"],
  thumbnail_url: null,
  demo_video_url: null,
  live_url: null,
  repository_url: null,
  status: "published",
  project_type: "Academic companion mobile app",
  role: "Solo Developer & Owner",
  development_status: "Completed",
  featured: false,
  published_at: null,
  like_count: 0,
  comment_count: 0,
  details: {
    problem: "",
    features: ["Local OCR extracts courses, class times, rooms, and professors from images and PDFs", "Weekly timetable matrix and daily agenda countdown", "GPA what-if planning for Philippine 1.0–5.0 and US 4.0 scales, with Latin honors tracking", "Pomodoro study timer with subject tags and deadline management", "AES-256 encrypted .isked backup archives", "Class notifications, auto-mute service, and home-screen widgets", "Offline operation without a cloud account or server"],
    architecture: "Flutter and Riverpod power the offline app, with Drift and SQLite storing academic data on the device. Google ML Kit reads schedule documents locally, while device services provide reminders and widgets. Backups use AES-256 encryption.",
    challenges: "",
  },
}, {
  id: "wilddex",
  slug: "wilddex",
  title: "WildDex",
  summary: "Discover real wildlife, identify species with AI, and build your Field Dex.",
  description: "A gamified wildlife discovery platform inspired by Pokémon GO. Users photograph nature in the field, submit catches for AI species verification and authenticity checks, and log discoveries to a digital Field Dex, real-time sightings map, social feed, and global leagues.",
  category: "Web",
  tags: ["Wildlife", "AI vision", "Geospatial", "Gamification"],
  tech_stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "TensorFlow.js", "Google Cloud Vision API", "Supabase", "PostgreSQL", "Prisma", "Mapbox GL JS", "Git"],
  thumbnail_url: null,
  demo_video_url: null,
  live_url: "https://wilddex-xi.vercel.app",
  repository_url: null,
  status: "published",
  project_type: "Wildlife discovery platform",
  featured: false,
  published_at: null,
  like_count: 0,
  comment_count: 0,
  details: {
    problem: "",
    features: ["Field photography with AI-assisted species verification", "On-device wildlife pre-classification with TensorFlow.js and MobileNet", "Authenticity checks to guard against invalid catches", "Digital Field Dex for recorded wildlife discoveries", "Real-time sightings map and heatmaps", "Social discovery feed and global leagues"],
    architecture: "Next.js powers the app, with Supabase PostgreSQL and Prisma storing users and wildlife catches. TensorFlow.js and Google Cloud Vision support species identification, Mapbox displays sightings, and Cloudinary stores photos.",
    process: "Testing and quality tools include Vitest and ESLint 9.",
    challenges: "",
  },
}, {
  id: "medassist",
  slug: "medassist",
  title: "MedAssist",
  summary: "Standardize assistance records and detect duplicate beneficiaries across MAIFIP and AICS.",
  description: "MedAssist — MAIFIP & AICS Beneficiary Duplicate Detection System is a centralized web application for tracking, standardizing, encoding, and checking beneficiary records across government assistance programs. Multi-tier matching and audit logging support the prevention of redundant disbursements and fraudulent claims.",
  category: "Web",
  tags: ["Duplicate detection", "Record management", "MAIFIP", "AICS"],
  tech_stack: ["PHP", "MySQL", "JavaScript", "Bootstrap", "Leaflet", "Git"],
  thumbnail_url: null,
  demo_video_url: null,
  live_url: null,
  repository_url: null,
  status: "published",
  project_type: "Beneficiary duplicate detection system",
  featured: false,
  published_at: null,
  like_count: 0,
  comment_count: 0,
  details: {
    problem: "Beneficiary records across assistance programs need consistent encoding and duplicate checks to help prevent redundant disbursements and fraudulent claims.",
    features: ["Centralized beneficiary record tracking, standardization, and encoding", "Multi-tier duplicate matching across MAIFIP and AICS", "Audit logging for record operations", "Spreadsheet imports and styled .xlsx templates with dynamic totals", "TOTP-based multi-factor authentication", "Client-side and server-side table pagination, sorting, and search", "Visual analytics, geographic distribution maps, and heatmaps"],
    architecture: "PHP runs on Apache and stores beneficiary records in MySQL or MariaDB. The system checks for duplicates and logs record operations. Bootstrap and jQuery provide the interface, with spreadsheet exports, charts, and maps for reporting.",
    challenges: "",
  },
}, {
  id: "isu-registrar",
  slug: "isu-registrar",
  title: "Registrar Portal",
  summary: "Manage classrooms, faculty assignments, curricula, and academic timetables.",
  description: "A web-based academic management and scheduling portal that automates classroom reservations, faculty assignments, curriculum tracking, and schedule generation, with conflict detection across faculty, rooms, and sections.",
  category: "Web",
  tags: ["Academic management", "Scheduling", "Conflict detection"],
  tech_stack: ["PHP", "MySQL", "JavaScript", "Tailwind CSS", "Bootstrap", "Git"],
  thumbnail_url: null,
  demo_video_url: null,
  live_url: null,
  repository_url: null,
  status: "published",
  project_type: "Academic management and scheduling portal",
  featured: false,
  published_at: null,
  like_count: 0,
  comment_count: 0,
  details: {
    problem: "Classroom reservations and faculty, room, and section assignments need coordinated timetables that identify scheduling conflicts.",
    features: ["Classroom reservations and faculty assignments", "Curriculum tracking and academic timetable generation", "Multi-day time-overlap detection across faculty, rooms, and sections", "Calendar views, searchable tables, and visual analytics", "Server-side and client-side Excel generation", "Dark and light themes with a custom design system", "CSRF protection, strict session cookies, security headers, and audit logging"],
    architecture: "PHP and MySQL or MariaDB manage academic records, classroom bookings, and timetables. A conflict engine checks overlapping faculty, room, and section schedules. The web interface provides calendars, reports, and Excel exports.",
    challenges: "",
  },
}, {
  id: "loter-portfolio",
  slug: "loter",
  title: "LOTER",
  summary: "A developer portfolio with a social profile and immersive project reels.",
  description: "LOTER brings project discovery, full-screen reels, technology filters, and moderated conversations into one developer portfolio. Portfolio content is configured in TypeScript, while likes and comments are stored in a local SQLite database.",
  category: "Web",
  tags: ["Portfolio", "Full-stack"],
  tech_stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "SQLite", "Git"],
  thumbnail_url: "/media/loter-profile.png",
  demo_video_url: null,
  live_url: null,
  repository_url: null,
  status: "draft",
  development_status: "In Progress",
  project_type: "Developer portfolio",
  featured: true,
  published_at: "2026-10-17",
  like_count: 0,
  comment_count: 0,
  details: {
    problem: "A project grid offers a quick overview but leaves little room to explain how each application works.",
    solution: "Use a compact social profile for discovery, then open each project in a full-screen reel with a separate case study and comment drawer.",
    features: ["Vertical project reels with category and technology filters", "SQLite-backed likes and moderated comments", "Technology cards linked to published project associations", "Accessible comment and case-study dialogs"],
    architecture: "Next.js displays the portfolio and handles project interactions. Project content comes from TypeScript configuration, while local SQLite stores likes, comments, and moderation data.",
    process: "The interface follows the supplied profile and reel references. Development proceeds incrementally with focused database, API, navigation, and technology-association checks.",
    challenges: "Shared counts need server storage and idempotent writes. Pending comments must stay private until approval. URL filters must stay consistent with the active reel.",
    gallery: [{ url: "/media/loter-profile.png", alt: "The LOTER profile interface during development", caption: "The actual local application, captured during development." }],
  },
}];

export const technologies: Record<string, string[]> = {
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Flutter", "Dart", "Riverpod"],
  Backend: ["Node.js", "PHP", "Supabase", "Prisma"],
  Databases: ["PostgreSQL", "MySQL", "SQLite"],
  "AI / Machine Learning": ["TensorFlow.js", "Google ML Kit"],
  DevOps: ["Docker"],
  Tools: ["Git", "Vite"],
};

export const experience: Array<{
  role: string;
  organization: string;
  period: string;
  summary: string;
  start_date?: string;
  end_date?: string | null;
  contributions?: string[];
  technologies?: string[];
  url?: string;
}> = [{
  role: "Freelance Web Developer",
  organization: "Independent · Private Client",
  period: "2025 – Present",
  start_date: "2025",
  end_date: null,
  summary: "Delivered a locally deployed Beneficiary Duplicate Detection System for a private client, covering frontend development, PHP backend development, database design, and offline deployment.",
  contributions: ["Implemented exact and fuzzy matching to identify duplicate records", "Built record-review interfaces, analytics charts, and geographic visualizations", "Implemented record processing and Excel exports"],
  technologies: ["PHP", "MySQL", "Bootstrap", "jQuery", "DataTables", "Chart.js", "Leaflet", "PhpSpreadsheet"],
}, {
  role: "Secretary",
  organization: "Programming Club · Isabela State University Cauayan City Campus",
  period: "2025 – 2026",
  start_date: "2025",
  end_date: "2026",
  summary: "Served as Secretary of the university Programming Club.",
}, {
  role: "Business Manager",
  organization: "Programming Club · Isabela State University Cauayan City Campus",
  period: "2024 – 2025",
  start_date: "2024",
  end_date: "2025",
  summary: "Served as Business Manager of the university Programming Club.",
}, {
  role: "Bachelor of Science in Computer Science",
  organization: "Isabela State University Cauayan City Campus",
  period: "2023 – Present",
  start_date: "2023",
  end_date: null,
  summary: "Expected graduation: August 2027.",
}];

export const about = {
  introduction: "I'm Luther John Allen Concepcion, a Computer Science student and freelance web developer based in the Philippines. I build full-stack web applications and offline AI systems.",
  interests: ["Full-stack web development", "Offline AI systems", "Privacy-focused applications"],
  background: "I've worked as an independent freelance web developer since 2025. My projects span private-client record processing, browser-to-browser file sharing, wildlife identification, and an offline academic PDF question-answering thesis system. I'm pursuing a BS in Computer Science at Isabela State University Cauayan City Campus, with expected graduation in August 2027.",
  philosophy: "",
  specializations: ["Full-stack web applications", "Database design", "Offline AI and retrieval-augmented generation"],
  learning: [] as string[],
  goals: "I'm seeking junior full-stack web developer roles and internships in the Philippines or remotely.",
};
