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
  bannerUrl: "/media/cover-banner.png",
  resumeUrl: "/documents/luther-john-allen-concepcion-cv.pdf",
  socialLinks: {
    github: "https://github.com/loterrr",
    linkedin: "https://www.linkedin.com/in/lutherconcepcion",
    website: "",
  },
};

export const projects: Project[] = [{
  id: "tara-ba",
  slug: "tara-ba",
  title: "Tara?",
  summary: "Turn barkada ideas into confirmed meetups.",
  description: "A group planning web app that helps friends turn hangout ideas into confirmed meetups. Create a plan, share the link, and decide together on dates that work for everyone.",
  category: "Web",
  tags: ["Group planning", "Meetups", "Scheduling"],
  tech_stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Git"],
  thumbnail_url: "/media/projects/tara-ba/tara-hero.png",
  demo_video_url: null,
  live_url: "https://tara-ba.vercel.app",
  repository_url: null,
  status: "published",
  project_type: "Group planning application",
  featured: true,
  published_at: null,
  like_count: 0,
  comment_count: 0,
  details: {
    problem: "Coordinating a hangout across a group can leave ideas stuck in chat without an agreed date.",
    solution: "Give friends a shared plan link where they can propose dates and decide together.",
    features: ["Create a hangout plan", "Share a plan through a link", "Propose dates and let everyone say what works"],
    challenges: "",
    gallery: [
      { url: "/media/projects/tara-ba/tara-hero.png", alt: "Tara landing page with pink branding and a create a plan button", caption: "A shared starting point for planning the next barkada meetup." },
      { url: "/media/projects/tara-ba/tara-create-plan.png", alt: "Tara create-plan form with plan name, organizer name, and short note fields", caption: "Create a plan with the basics before choosing dates and places." },
      { url: "/media/projects/tara-ba/tara-confirmed.png", alt: "Tara invitation demo showing a confirmed coffee meetup with its date and place", caption: "Public invitation demo showing the confirmed plan guests can respond to." },
    ],
  },
}, {
  id: "peer-drop",
  slug: "peer-drop",
  title: "Peer Drop",
  summary: "Private browser-to-browser file sharing with WebRTC.",
  description: "A browser file-sharing application with a Next.js frontend and a Node.js/Fastify signaling backend. People connect through session links, room codes, or QR codes, with group-room access controls and direct browser-to-browser file transfers.",
  category: "Web",
  tags: ["File sharing", "WebRTC", "Privacy"],
  tech_stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Fastify", "Node.js", "WebRTC", "Redis", "PostgreSQL", "Docker", "Vercel", "GitHub Actions", "Git", "GitHub"],
  thumbnail_url: "/media/projects/peer-drop/peerdrop-hero.png",
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
    gallery: [
      { url: "/media/projects/peer-drop/peerdrop-hero.png", alt: "Peer Drop landing hero and transfer initiation interface", caption: "Direct browser-to-browser file sharing landing page." },
      { url: "/media/projects/peer-drop/peerdrop-receive.png", alt: "Peer Drop receive files modal with session code input", caption: "Secure session code entry to establish a direct P2P stream." },
      { url: "/media/projects/peer-drop/peerdrop-workflow.png", alt: "Peer Drop 3-step file sharing workflow overview", caption: "Simple 3-step workflow: pick files, share link, direct transfer." },
      { url: "/media/projects/peer-drop/peerdrop-broadcasting.png", alt: "Peer Drop active room connection and session broadcasting", caption: "Real-time broadcasting status showing connected devices and session links." },
      { url: "/media/projects/peer-drop/peerdrop-transfer-complete.png", alt: "Peer Drop verified transfer complete interface with download button", caption: "End-to-end verified transfer complete with preview and download options." },
    ],
  },
}, {
  id: "togethercam",
  slug: "togethercam",
  title: "TogetherCam",
  summary: "A photo booth for taking pictures together or apart.",
  description: "A browser-based photo-booth experience with options to start a booth or join a room.",
  category: "Web",
  tags: ["Photo booth"],
  tech_stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "PostgreSQL", "Vercel", "Git", "GitHub"],
  thumbnail_url: "/media/projects/togethercam/togethercam-showcase.jpg",
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
    gallery: [
      { url: "/media/projects/togethercam/togethercam-showcase.jpg", alt: "TogetherCam product showcase featuring photobooth strips and polaroid layouts", caption: "Product showcase featuring photo strips and polaroid layouts." },
      { url: "/media/projects/togethercam/togethercam-home.png", alt: "TogetherCam home screen with start booth and join room options", caption: "Clean dark landing screen to start a booth or join a room." },
      { url: "/media/projects/togethercam/togethercam-mode-select.png", alt: "TogetherCam photo mode selection interface", caption: "Mode selection: together with a single camera or apart with remote peers." },
      { url: "/media/projects/togethercam/togethercam-photo-count.png", alt: "TogetherCam pose count selection: 2, 4, or 6 photos", caption: "Pose selection: quick 2 photos, popular 4-strip, or 6-photo full reel." },
      { url: "/media/projects/togethercam/togethercam-join-room.png", alt: "TogetherCam room code entry screen", caption: "Join an active remote photo booth room via short room code." },
    ],
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
  thumbnail_url: "/media/projects/gimik/gimik-hero.png",
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
    gallery: [
      { url: "/media/projects/gimik/gimik-hero.png", alt: "Gimik landing page with live telemetry card", caption: "Landing page with live night-out telemetry, timeline logs, and expense tracking." },
      { url: "/media/projects/gimik/gimik-discover-venues.png", alt: "Gimik venue discovery map and Philippine nightlife atlas", caption: "Interactive Philippine nightlife map covering bars, lounges, KTVs, and speakeasies." },
      { url: "/media/projects/gimik/gimik-feed.png", alt: "Gimik empty social feed with popular venues and friends circle", caption: "Social feed empty state with popular venues and a friends sidebar." },
      { url: "/media/projects/gimik/gimik-friends.png", alt: "Gimik friends list with profile links, hangout counts, and search", caption: "Friends list with profile links, hangout counts, and search." },
    ],
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
  thumbnail_url: "/media/projects/the-archive/archive-dashboard.jpg",
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
    gallery: [
      { url: "/media/projects/the-archive/archive-dashboard.jpg", alt: "The Archive mobile operations dashboard with system status and insights", caption: "Monochrome daily briefing dashboard with system operational telemetry and insights." },
      { url: "/media/projects/the-archive/archive-finance.jpg", alt: "The Archive finance screen with monthly budgets and burn rate", caption: "Personal finance tracker with spending anomaly detection, budgets, and subscriptions." },
      { url: "/media/projects/the-archive/archive-tasks.jpg", alt: "The Archive empty task list with workload indicator", caption: "Task manager showing a workload indicator and an empty task list." },
      { url: "/media/projects/the-archive/archive-vault.jpg", alt: "The Archive vault interface", caption: "Offline secure vault for passwords, recovery codes, and sensitive notes." },
      { url: "/media/projects/the-archive/archive-lock-screen.jpg", alt: "The Archive Nothing OS-inspired monochrome PIN lock screen", caption: "Monochrome dot-matrix PIN security screen protecting local encrypted storage." },
    ],
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
  thumbnail_url: "/media/projects/isked/isked-schedule-matrix.jpg",
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
    gallery: [
      { url: "/media/projects/isked/isked-schedule-matrix.jpg", alt: "iSked weekly timetable matrix showing color-coded class blocks", caption: "Generated weekly timetable matrix with color-coded classes and room assignments." },
      { url: "/media/projects/isked/isked-home.jpg", alt: "iSked home dashboard with attendance tracker and upcoming exams", caption: "Student home dashboard tracking attendance rate, class schedules, and deadlines." },
      { url: "/media/projects/isked/isked-review-scan.jpg", alt: "iSked OCR schedule review screen and course editor", caption: "Reviewing parsed study load courses after Google ML Kit on-device OCR scan." },
      { url: "/media/projects/isked/isked-scan-crop.jpg", alt: "iSked document scanner with corner adjustment handles", caption: "Document crop interface for capturing university registration forms and syllabi." },
    ],
  },
}, {
  id: "wilddex",
  slug: "wilddex",
  title: "WildDex",
  summary: "Discover real wildlife, identify species with AI, and build your Field Dex.",
  description: "A gamified wildlife discovery platform inspired by Pokémon GO. Users photograph nature in the field, submit catches for AI species verification and authenticity checks, and log discoveries to a digital Field Dex, real-time sightings map, social feed, and global leagues.",
  category: "Web",
  tags: ["Wildlife", "AI vision", "Geospatial", "Gamification"],
  tech_stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "TensorFlow.js", "Google Cloud Vision API", "Supabase", "PostgreSQL", "Prisma", "Mapbox GL JS", "Vercel", "Git", "GitHub"],
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
  tech_stack: ["PHP", "MySQL", "JavaScript", "Bootstrap", "Leaflet", "Render", "Git", "GitHub"],
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
  thumbnail_url: "/media/projects/isu-registrar/registrar-dashboard.png",
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
    gallery: [
      { url: "/media/projects/isu-registrar/registrar-login.png", alt: "Isabela State University Registrar official portal login screen", caption: "Branded portal login screen." },
      { url: "/media/projects/isu-registrar/registrar-dashboard.png", alt: "Isabela State University Registrar dashboard with audit logs and metrics", caption: "Admin dashboard showing faculty, classroom, section stats, and system integrity logs." },
      { url: "/media/projects/isu-registrar/registrar-scheduler.png", alt: "Academic Scheduler visual timetable grid and subject pool", caption: "Interactive drag-and-drop academic scheduler with conflict detection and Excel export." },
      { url: "/media/projects/isu-registrar/registrar-student-schedule.png", alt: "Student weekly schedule portal with enrollment load and room assignments", caption: "Student-facing schedule portal with room assignments and print capability." },
    ],
  },
}, {
  id: "loter-portfolio",
  slug: "loter",
  title: "LOTER",
  summary: "A developer portfolio with a social profile and immersive project reels.",
  description: "LOTER brings project discovery, full-screen reels, technology filters, and moderated conversations into one developer portfolio. Portfolio content is configured in TypeScript, while likes and comments use Supabase when configured, with local SQLite as a fallback.",
  category: "Web",
  tags: ["Portfolio", "Full-stack"],
  tech_stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Supabase", "PostgreSQL", "SQLite", "Vercel", "GitHub Actions", "Git", "GitHub"],
  thumbnail_url: null,
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
    features: ["Vertical project reels with category and technology filters", "Supabase-backed likes and moderated comments with a local SQLite fallback", "Technology cards linked to published project associations", "Accessible comment and case-study dialogs"],
    architecture: "Next.js displays the portfolio and handles project interactions. Project content comes from TypeScript configuration. Supabase PostgreSQL stores interaction data when configured; otherwise, the app uses local SQLite.",
    process: "The interface follows the supplied profile and reel references. Development proceeds incrementally with focused database, API, navigation, and technology-association checks.",
    challenges: "Shared counts need server storage and idempotent writes. Pending comments must stay private until approval. URL filters must stay consistent with the active reel.",
  },
}];

export const technologies: Record<string, string[]> = {
  Frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Flutter", "Dart", "Riverpod"],
  Backend: ["Node.js", "PHP", "Supabase", "Prisma"],
  Databases: ["PostgreSQL", "MySQL", "SQLite"],
  "AI / Machine Learning": ["TensorFlow.js", "Google ML Kit"],
  DevOps: ["Docker", "Vercel", "Render"],
  Tools: ["Git", "GitHub", "GitHub Actions", "Vite"],
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
