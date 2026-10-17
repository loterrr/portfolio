# Local SQLite implementation plan

**Goal:** Persist genuine reactions and moderated comments in local SQLite, and resolve the audited reel defects.

**Architecture:** Keep portfolio content configured in `lib/portfolio.ts`; synchronize its project records to SQLite. Node route handlers own interactions, anonymous visitor cookies, validation, and moderation. The client reads database counts instead of adding configured counters.

**Constraints:** Supabase migration stays last. No fabricated project content or links. Use installed Node 24 SQLite support. Development binds to loopback; moderation endpoints are disabled in production. Existing browser-local data stays untouched and is not trusted or automatically imported.

## Tasks

- [x] Add failing Node tests for durable SQLite likes, idempotence, moderation privacy, input validation, rate limits, pagination, and project/category reconciliation.
- [x] Implement SQLite tables, project synchronization, transactions, counts, and database-backed abuse controls.
- [x] Add bounded, same-origin API writes and development-only moderation; connect UI loading, errors, comments, and counts.
- [x] Correct per-project action availability and conflicting URLs; use native modal dialogs for keyboard focus containment and restoration.
- [ ] Run the focused test suite, TypeScript, and production build; document exact results and local database operations.
- [x] Apply the LOTER website name and implement grouped technology cards with actual project associations and persistent technology filters.

## Review focus

- A repeated like request must not increment the count twice.
- Pending comments must not appear in public lists or counts.
- Invalid, draft, and removed project IDs must reject interaction writes.
- Changing a display name must not bypass the server comment cooldown.
- Direct links must render the requested project even when the category conflicts.

## Decisions

- The user approved SQLite and project-first URL reconciliation after the audit.
- Use the existing development-only moderation policy, enforced on the API as well as the page. Public owner sign-in remains part of the later migration.
- Execute in the current authorized workspace; it has no Git repository, so no worktree or commit is available.
- The reference images govern the visual design. Their black profile panel and charcoal reels take priority over unrelated generated design directions.
- The user narrowed the master reference to Parts 9–17. Finish action rails, project information, case studies, comments, Labs, Tech Stack, Experience, About, and Contact; defer unrelated theme, routing, and infrastructure expansion.
