# LOTER

A dark, project-first developer portfolio built with Next.js, TypeScript, Tailwind CSS, Lucide, and Motion for React.

## Run locally

1. Install Node.js 24 or newer.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://127.0.0.1:3000`.

## Add real portfolio content

Edit `lib/portfolio.ts`. Add published projects to `projects`; each project includes its reel data, verified live and repository URLs, preview media, and details. Add profile links, résumé, lab work, technology groups, experience, and about content in the same file. The interface shows empty states when those lists are empty.

The initial LOTER entry describes this actual application and uses a screenshot captured from the local build. It has no invented deployment URL, source URL, results, or engagement totals. Its development status is In Progress. Replace or expand the content with your own verified work.

Only `http` and `https` project URLs are accepted for Live View and Source. The project grid and reels use the same project list. Category filters remain in the URL while reels are open.

The Projects tab opens the dedicated `/projects` feed, which starts at the first published project matching the active filters. Project cards open `/projects/[slug]`. The profile is not rendered behind that page. Scrolling updates the project path, and Back to profile returns to the profile with its category and technology filters. Previous `?project=...` links redirect to the dedicated route. Missing or draft project paths return a not-found page.

## Local SQLite storage

The server creates `data/scrollfolio.sqlite` on the first API request using Node's built-in SQLite support. Project records synchronize from `lib/portfolio.ts` when the database connection opens. Restart the development server after changing configured projects. Removed and draft projects keep their existing database history but reject new interactions.

Likes and comments are shared by every browser using this server. Counts come from database rows; configured `like_count` and `comment_count` values are not added to them. A server-issued, HttpOnly visitor cookie and a unique database key prevent repeated likes from the same visitor. Anonymous identity can be reset by clearing cookies; account-based identity and stronger public abuse prevention remain future work.

Comments are validated on the server, submitted as pending, and published only after approval. The comment cooldown applies to the visitor across projects and display names. Public comment responses never include pending submissions or visitor IDs. Older comments remain available through pagination.

Open `/admin` on the local development server to approve or delete comments. Both the page and API disable moderation in production. Development and start scripts bind to `127.0.0.1`; keep the unauthenticated local owner tools on this loopback interface.

The database and its SQLite journal files are ignored by Git. To back up local data, stop the server and copy the whole `data/` folder. Restore that folder while the server is stopped. Do not put database files inside `public/`.

Existing browser `localStorage` is left untouched and is not automatically imported, because visitors can edit those values. Supabase migration and public owner authentication remain the last phase; they are not configured yet.

## Verification

- `npm test` runs isolated SQLite and API regression tests with Node's test runner. Tests use temporary databases and synthetic fixtures.
- `npm run typecheck` checks TypeScript.
- `npm run build` creates the production build.

## Reference design

The profile follows the supplied black, bordered panel with a cover placeholder, avatar, three statistics, paired contact buttons, social links, and compact section navigation. Reels use the supplied charcoal full-screen layout with a wide preview and four primary actions on the right: Like, Comment, Live View, and Source. Save, Bookmark, and Share are not rail actions. Motion for React provides transitions and respects reduced-motion preferences.

If a direct link has a conflicting category, the requested published project takes priority and the URL changes to its category. Normal category browsing preserves the active filter.

## Content model

`Project` in `lib/portfolio.ts` includes `id`, `slug`, `title`, `summary`, `description`, `category`, `tags`, `tech_stack`, `thumbnail_url`, `demo_video_url`, `live_url`, `repository_url`, `status`, `featured`, `published_at`, `like_count`, and `comment_count`.

## Tech Stack tab

Technology cards are grouped into Frontend, Backend, Databases, AI / Machine Learning, DevOps, Tools, and Other. Configure names and categories in `technologies` in `lib/portfolio.ts`. The initial entries are technologies used by this application, not personal proficiency claims.

Project associations come from each published project's `tech_stack`. Matching ignores casing and surrounding whitespace, and repeated entries in one project count once. Unconfigured project technologies appear under Other. Draft projects do not contribute to public counts.

Tech Stack displays the curated main technologies in `lib/portfolio.ts`; project utility dependencies are kept in case studies and do not create extra cards. Web and Mobile / App selectors separate the stacks, with Flutter, Dart, Riverpod, SQLite, and Google ML Kit in Mobile / App. Docker Compose and Supabase service variants count toward their main technology once per project. Selecting a technology opens Projects with platform and technology URL filters. The filters stay active while browsing reels. A direct project link clears an incompatible technology filter so the requested project remains visible. There are no proficiency percentages.

## Reference Parts 9–17

- Project reels contain exactly Like, Comment, Live View, and Source as primary rail actions. Set `repository_visibility` to `private` to disable source access even when a repository URL is configured.
- Reel information supports the configured handle, summary, category, project type, role, and development status. Longer content stays in the case study.
- Optional `details.solution`, `architecture`, `process`, `outcomes`, and `gallery` expand the case study. Gallery entries contain `url`, descriptive `alt`, and optional `caption`; local `/media/...` paths and external HTTP media are supported. Empty sections are omitted.
- Experience entries support start/end dates, contributions, technologies, and an optional organization link. Entries with dates sort newest first. Existing `period` text remains supported.
- About supports background, philosophy, interests, specializations, current learning, and goals. Add only supported information.
- Contact Me and Get in touch open an accessible contact panel. Configured email uses a real `mailto:` action; professional links and résumé download appear only when configured. No mail-sending service or fake contact form is involved.

The user's current focus is Parts 9–17. Broader recommendations such as public deployment, hosted authentication, additional infrastructure, and secondary themes remain outside this pass.
