"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft, ArrowRight, ArrowUp, BriefcaseBusiness, Check,
  Layers, Code2, Globe2, Heart, ImageIcon,
  Mail, MessageCircle, MonitorPlay, Pause, Play, Search, UserRound,
  X,
} from "lucide-react";
import {
  profile, projects, technologies,
  type Project,
} from "@/lib/portfolio";
import { interactionRequest, loadComments, useInteractions } from "@/lib/interactions";
import type { ProjectComment, ProjectInteraction } from "@/lib/interaction-types";
import { projectReelUrl, projectsFeedUrl, reconcileCategory } from "@/lib/project-navigation";
import { buildTechnologyGroups, matchesTechnology, reconcileTechnology } from "@/lib/technologies";
import { repositoryAvailable, validExternalUrl, validMediaUrl } from "@/lib/urls";
import Modal from "./modal";
import TechStack from "./tech-stack";
import ProjectDetails from "./project-details";
import ContactPanel from "./contact-panel";
import BrandLogo from "./brand-logo";
import { AboutSection, ExperienceSection } from "./portfolio-sections";

type Tab = "Projects" | "Tech Stack" | "Experience" | "About";
const tabs: Tab[] = ["Projects", "Tech Stack", "Experience", "About"];
const tabIcons = { Projects: Code2, "Tech Stack": Layers, Experience: BriefcaseBusiness, About: UserRound };

function formatCount(count: number) {
  return new Intl.NumberFormat().format(count);
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-state">
      <span className="empty-mark"><Code2 size={20} /></span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function ProjectCard({ project, interaction, onOpen }: { project: Project; interaction?: ProjectInteraction; onOpen: () => void }) {
  return (
    <motion.button className="project-card" onClick={onOpen} whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }}>
      <div className="project-cover">
        {project.thumbnail_url && <img src={project.thumbnail_url} alt={`${project.title} preview`} />}
        {!project.thumbnail_url && <div className="cover-placeholder"><Code2 size={24} /><span>Project preview</span></div>}
        {project.featured && <span className="featured-label">Featured</span>}
        <span className="card-open"><ArrowRight size={17} /></span>
      </div>
      <div className="card-copy">
        <span className="card-category">{project.category || "Project"}</span>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <div className="card-foot"><span><Heart size={14} /> {interaction ? formatCount(interaction.like_count) : "—"}</span><span><MessageCircle size={14} /> {interaction ? formatCount(interaction.comment_count) : "—"}</span></div>
      </div>
      <span className="sr-only">Open {project.title} project reel</span>
    </motion.button>
  );
}

function CommentDrawer({ project, count, onClose }: { project: Project; count?: number; onClose: () => void }) {
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");

  const refresh = useCallback(async (before?: string | null) => {
    setLoading(true);
    try {
      const result = await loadComments(project.id, before);
      setComments((current) => before ? [...current, ...result.comments] : result.comments);
      setCursor(result.nextCursor);
      setLoadError("");
    } catch {
      setLoadError("Could not load comments. Please try again.");
    } finally { setLoading(false); }
  }, [project.id]);

  useEffect(() => {
    void refresh();
    const onFocus = () => { void refresh(); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanBody = body.trim();
    if (website || saving) return;
    if (cleanName.length < 2 || cleanName.length > 40 || cleanBody.length < 8 || cleanBody.length > 1000) {
      setMessage("Use a name of 2–40 characters and a comment of 8–1,000 characters.");
      return;
    }
    setSaving(true);
    try {
      await interactionRequest("comments", "POST", { projectId: project.id, name: cleanName, body: cleanBody, website });
      setName("");
      setBody("");
      setMessage("Submitted for owner review.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save this comment. Please try again.");
    } finally { setSaving(false); }
  }

  return (
    <Modal kind="comments" labelId="comments-title" onClose={onClose}>
      <motion.aside className="comment-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }}>
        <div className="drawer-head"><div><span className="eyebrow">Project conversation</span><h2 id="comments-title">Comments{count !== undefined && ` (${formatCount(count)})`}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close comments"><X size={20} /></button></div>
        <p className="drawer-project">{project.title}</p>
        <div className="comment-list">
          {comments.map((comment) => <article className="comment" key={comment.id}><div className="comment-avatar">{comment.name.slice(0, 1).toUpperCase()}</div><div><strong>{comment.name}</strong><p>{comment.body}</p><time dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleDateString()}</time></div></article>)}
          {loading && <p className="muted-empty" role="status">Loading comments…</p>}
          {!loading && !loadError && !comments.length && <p className="muted-empty">No approved comments yet. Leave the first one.</p>}
          {loadError && <p className="form-message" role="alert">{loadError} <button className="text-link" onClick={() => void refresh(cursor)}>Retry</button></p>}
          {!loading && !loadError && cursor && <button className="text-link" onClick={() => void refresh(cursor)}>Load older comments</button>}
        </div>
        <form className="comment-form" onSubmit={submit}>
          <label>Display name<input value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={40} autoComplete="nickname" required /></label>
          <label>Your comment<textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={1000} rows={4} required /></label>
          <label className="honeypot" aria-hidden="true">Website<input tabIndex={-1} value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
          <button className="button button-primary" type="submit" disabled={saving}>{saving ? "Submitting…" : "Submit comment"} <ArrowRight size={16} /></button>
          <p className="form-note">Comments are published after owner review.</p>
          {message && <p className="form-message" role="status">{message}</p>}
        </form>
      </motion.aside>
    </Modal>
  );
}

export function Reels({
  selected, category, technology, onExit, onSelect, reactions,
}: { selected: Project; category: string; technology: string; onExit: () => void; onSelect: (project: Project) => void; reactions: ReturnType<typeof useInteractions> }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const initialSlug = useRef(selected.slug);
  const reduceMotion = useReducedMotion();
  const filtered = useMemo(() => projects.filter((project) => project.status === "published" && (!category || project.category === category) && matchesTechnology(project, technology)), [category, technology]);
  const activeIndex = filtered.findIndex((project) => project.slug === selected.slug);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const active = root.querySelector<HTMLElement>(`[data-slug="${CSS.escape(initialSlug.current)}"]`);
    active?.scrollIntoView({ block: "start", behavior: "auto" });
  }, [filtered]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver((entries) => {
      const top = entries.filter((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const slug = top?.target.getAttribute("data-slug");
      if (slug) {
        const project = filtered.find((item) => item.slug === slug);
        if (project && project.id !== selected.id) onSelect(project);
      }
    }, { root, threshold: [0.5, 0.75] });
    root.querySelectorAll("[data-slug]").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [filtered, selected, onSelect]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let isPointerDown = false;
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;

    function snapToClosest() {
      if (!root || isPointerDown) return;
      const height = root.clientHeight;
      if (!height) return;
      const targetIndex = Math.max(0, Math.min(Math.round(root.scrollTop / height), filtered.length - 1));
      const targetTop = targetIndex * height;
      if (Math.abs(root.scrollTop - targetTop) > 2) {
        root.scrollTo({ top: targetTop, behavior: reduceMotion ? "auto" : "smooth" });
      }
    }

    function onPointerDown() {
      isPointerDown = true;
      if (scrollTimer) clearTimeout(scrollTimer);
    }

    function onPointerUp() {
      if (!isPointerDown) return;
      isPointerDown = false;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(snapToClosest, 60);
    }

    function onScroll() {
      if (isPointerDown) return;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(snapToClosest, 120);
    }

    function onScrollEnd() {
      if (scrollTimer) clearTimeout(scrollTimer);
      snapToClosest();
    }

    root.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    root.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("scrollend", onScrollEnd, { passive: true });

    return () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      root.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      root.removeEventListener("scroll", onScroll);
      root.removeEventListener("scrollend", onScrollEnd);
    };
  }, [filtered.length, reduceMotion]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      const video = entry.target.querySelector("video");
      if (!video) return;
      if (entry.isIntersecting && entry.intersectionRatio >= 0.6 && entry.target.getAttribute("data-slug") === selected.slug && !paused) void video.play().catch(() => undefined);
      else video.pause();
    }), { root, threshold: 0.6 });
    root.querySelectorAll("[data-slug]").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [paused, filtered, selected.slug]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (commentsOpen || detailsOpen) { if (event.key === "Escape") { setCommentsOpen(false); setDetailsOpen(false); } return; }
      if (event.key === "Escape") onExit();
      if (["ArrowDown", "PageDown", "ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        const direction = event.key === "ArrowDown" || event.key === "PageDown" ? 1 : -1;
        const next = Math.max(0, Math.min(activeIndex + direction, filtered.length - 1));
        rootRef.current?.querySelectorAll("[data-slug]")[next]?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, commentsOpen, detailsOpen, filtered, onExit, reduceMotion]);

  return (
    <motion.main className="reels-shell" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <header className="reels-top"><button className="back-link" onClick={onExit} aria-label="Back to profile"><ArrowLeft size={18} /> <span>Project Reels</span></button><span className="reel-count">{Math.max(activeIndex + 1, 1)} <i>/</i> {filtered.length}</span></header>
      <div className="reels-scroll" ref={rootRef}>
        {filtered.map((project, index) => {
          const interaction = reactions.interactions.find((item) => item.projectId === project.id);
          const isLiked = Boolean(interaction?.liked);
          const validLive = validExternalUrl(project.live_url);
          const validRepo = repositoryAvailable(project);
          const hasVideo = validMediaUrl(project.demo_video_url);
          return (
            <article className="reel" data-slug={project.slug} key={project.id} inert={project.id !== selected.id}>
              <div className="reel-content">
                <div className="reel-preview">
                  {hasVideo ? <video src={project.demo_video_url ?? undefined} muted loop playsInline poster={project.thumbnail_url ?? undefined} /> : project.thumbnail_url ? <img src={project.thumbnail_url} alt={`${project.title} project preview`} /> : <div className="reel-preview-empty"><Code2 size={34} /><span>Project preview</span></div>}
                  {hasVideo && <button className="video-toggle" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Play project video" : "Pause project video"}>{paused ? <Play size={18} /> : <Pause size={18} />}</button>}
                </div>
                <div className="reel-copy"><span className="reel-handle">{profile.handle}</span><h1>{project.title}</h1><p className="reel-summary">{project.summary}</p><div className="tag-list">{project.tech_stack.slice(0, 6).map((tag) => <span className="tag" key={tag}><BrandLogo name={tag} size={13} />{tag}</span>)}{project.tech_stack.length > 6 && <button className="tag" onClick={() => setDetailsOpen(true)} aria-label={`View all ${project.tech_stack.length} technologies`}>+{project.tech_stack.length - 6} more</button>}</div><p className="reel-description">{[project.category, project.project_type, project.role, project.development_status].filter(Boolean).join(" · ")}</p><button className="text-link" onClick={() => setDetailsOpen(true)}>View Full Case Study <ArrowRight size={16} /></button></div>
              </div>
              <div className="interaction-rail" aria-label="Project actions">
                <button className={`rail-action ${isLiked ? "is-liked" : ""}`} disabled={!reactions.ready || reactions.saving !== null} onClick={() => void reactions.like(project.id)} aria-pressed={isLiked}><span className="rail-icon"><Heart size={23} fill={isLiked ? "currentColor" : "none"} /></span><span>Like</span><small>{interaction ? formatCount(interaction.like_count) : "—"}</small></button>
                <button className="rail-action" onClick={() => setCommentsOpen(true)}><span className="rail-icon"><MessageCircle size={23} /></span><span>Comment</span><small>{interaction ? formatCount(interaction.comment_count) : "—"}</small></button>
                <button className="rail-action" disabled={!validLive} onClick={() => validLive && window.open(project.live_url!, "_blank", "noopener,noreferrer")} aria-label={validLive ? "Open live project in a new tab" : "Demo unavailable"}><span className="rail-icon"><MonitorPlay size={23} /></span><span>Live View</span>{!validLive && <small>Demo unavailable</small>}</button>
                <button className="rail-action" disabled={!validRepo} onClick={() => validRepo && window.open(project.repository_url!, "_blank", "noopener,noreferrer")} aria-label={validRepo ? "Open source repository in a new tab" : "Source unavailable"}><span className="rail-icon"><Code2 size={23} /></span><span>Source</span>{!validRepo && <small>Source unavailable</small>}</button>
              </div>
              <div className="reel-hint">{index < filtered.length - 1 ? <><ArrowUp size={18} /><span>Swipe up for next project</span></> : <><Check size={18} /><span>You’re all caught up</span></>}</div>
            </article>
          );
        })}
      </div>
      <AnimatePresence>{commentsOpen && <CommentDrawer project={selected} count={reactions.interactions.find((item) => item.projectId === selected.id)?.comment_count} onClose={() => setCommentsOpen(false)} />}</AnimatePresence>
      <AnimatePresence>{detailsOpen && <ProjectDetails project={selected} onClose={() => setDetailsOpen(false)} />}</AnimatePresence>
      {reactions.error && <div className="notice" role="alert">{reactions.error} <button className="text-link" onClick={() => void reactions.refresh()}>Retry</button></div>}
    </motion.main>
  );
}

export default function Portfolio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as Tab | null;
  const tab: Tab = tabParam && tabs.includes(tabParam) ? tabParam : "About";
  const categoryParam = searchParams.get("category") ?? "";
  const category = reconcileCategory(projects, null, categoryParam);
  const technologyParam = searchParams.get("technology") ?? "";
  const technology = reconcileTechnology(projects, null, technologyParam);
  const technologyGroups = useMemo(() => buildTechnologyGroups(technologies, projects), []);
  const categories = Array.from(new Set(projects.filter((project) => project.status === "published" && matchesTechnology(project, technology)).map((project) => project.category).filter(Boolean)));
  const [search, setSearch] = useState("");
  const reactions = useInteractions();
  const [showSearch, setShowSearch] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (categoryParam === category && technologyParam === technology) return;
    const params = new URLSearchParams(searchParams.toString());
    if (category) params.set("category", category);
    else params.delete("category");
    if (technology) params.set("technology", technology);
    else params.delete("technology");
    router.replace(params.size ? `/?${params}` : "/", { scroll: false });
  }, [category, categoryParam, technology, technologyParam, router, searchParams]);

  const visibleProjects = useMemo(() => projects.filter((project) => project.status === "published" && (!category || project.category === category) && matchesTechnology(project, technology) && (!search || `${project.title} ${project.summary} ${project.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase()))), [category, search, technology]);
  const categoryCounts = categories.map((item) => ({ name: item, count: projects.filter((project) => project.status === "published" && project.category === item && matchesTechnology(project, technology)).length }));

  function buildUrl(values: { project?: string | null; category?: string; technology?: string; tab?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("project");
    if (values.category !== undefined) values.category ? params.set("category", values.category) : params.delete("category");
    if (values.technology !== undefined) values.technology ? params.set("technology", values.technology) : params.delete("technology");
    if (values.tab) params.set("tab", values.tab);
    if (values.project) return projectReelUrl(values.project, params);
    if (values.tab === "Projects") return projectsFeedUrl(params);
    const query = params.toString();
    return query ? `/?${query}` : "/";
  }

  function openProject(project: Project) { router.push(buildUrl({ project: project.slug, category, tab: "Projects" }), { scroll: false }); }
  function selectTab(next: Tab) {
    if (next === "Projects") { router.push(buildUrl({ tab: next }), { scroll: false }); return; }
    router.replace(buildUrl({ tab: next }), { scroll: false });
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }
  function selectCategory(next: string) { router.replace(buildUrl({ category: next }), { scroll: false }); }
  function selectTechnology(next: string, platform: "Web" | "Mobile") {
    setSearch("");
    router.push(buildUrl({ project: null, category: next === "Git" ? "" : platform, technology: next, tab: "Projects" }), { scroll: false });
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="app-frame">
        <section className="profile-panel" aria-label="Developer profile">
        <header className="topbar">
          <a className="wordmark" href="/" aria-label="LOTER home"><Code2 size={18} /><span>LOTER</span></a>
          <div className="top-actions"><button className="icon-button" onClick={() => setShowSearch((value) => !value)} aria-label="Toggle project search"><Search size={18} /></button>{process.env.NODE_ENV !== "production" && <a className="icon-button" href="/admin" aria-label="Open local comment moderation"><BriefcaseBusiness size={17} /></a>}</div>
        </header>

        <section className="profile-cover" aria-label="Optional profile cover"><ImageIcon size={17} /><span>Optional personal banner / cover</span></section>

        <section className="profile-intro">
          <div className="profile-avatar"><img src={profile.avatarUrl} alt={`${profile.name} profile photo`} width={72} height={72} /></div>
          <div className="profile-copy"><h1>{profile.name}</h1><p className="handle">{profile.handle}</p><p className="role">{profile.role}</p><span className={`availability ${profile.available === true ? "available" : ""}`}><span />{profile.available === null ? "Availability not set" : profile.available ? "Open to opportunities" : "Currently focused"}</span></div>
        </section>

        <section className="profile-summary">
          <p className="bio">{profile.bio}</p>
          <div className="profile-stats"><div><strong>{projects.filter((project) => project.status === "published").length}</strong><span>Projects</span></div><div><strong>{technologyGroups.reduce((sum, group) => sum + group.technologies.length, 0)}</strong><span>Technologies</span></div><div><strong>{reactions.ready ? formatCount(reactions.interactions.reduce((sum, item) => sum + item.like_count, 0)) : "—"}</strong><span>Likes</span></div></div>
          <div className="profile-actions"><button className="button button-primary" onClick={() => setContactOpen(true)}>Contact Me</button>{validMediaUrl(profile.resumeUrl) ? <a className="button button-outline" href={profile.resumeUrl} download>Download CV</a> : <button className="button button-outline" disabled title="No résumé has been published">CV unavailable</button>}</div>
          <div className="social-links">{[
            ["GitHub", profile.socialLinks.github, <BrandLogo name="GitHub" size={17} key="github" />],
            ["LinkedIn", profile.socialLinks.linkedin, <BrandLogo name="LinkedIn" size={17} key="linkedin" />],
            ["Email", profile.email ? `mailto:${profile.email}` : "", <Mail size={17} key="email" />],
            ["Website", profile.socialLinks.website, <Globe2 size={17} key="website" />],
          ].filter(([label, href]) => label === "Email" ? Boolean(profile.email) : validExternalUrl(String(href))).map(([label, href, icon]) => <a key={String(label)} href={String(href)} target={String(href).startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" aria-label={String(label)}>{icon}</a>)}</div>
        </section>

        <nav className="tabs" aria-label="Portfolio sections">{tabs.map((item) => {
          const Icon = tabIcons[item];
          return <button key={item} className={tab === item ? "active" : ""} aria-current={tab === item ? "page" : undefined} onClick={() => selectTab(item)}><Icon size={18} aria-hidden="true" /><span>{item}</span></button>;
        })}</nav>
        </section>

        <AnimatePresence mode="wait">
          <motion.section id="portfolio-content" key={tab} className="tab-content" initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.2 }}>
            {tab === "Projects" && <>
              <div className="section-head"><div><span className="eyebrow">Selected work</span><h2>Projects</h2><p>Explore the work, one project at a time.</p></div>{showSearch && <label className="search-field"><Search size={17} /><input autoFocus placeholder="Search projects" value={search} onChange={(event) => setSearch(event.target.value)} /></label>}</div>
              {technology && <div className="technology-filter"><span>Using {technology}</span><button className="icon-button" aria-label="Clear technology filter" onClick={() => router.replace(buildUrl({ technology: "" }), { scroll: false })}><X size={16} /></button></div>}
              {categories.length > 0 && <div className="filters" aria-label="Filter projects by category"><button className={!category ? "selected" : ""} onClick={() => selectCategory("")}>All <span>{projects.filter((project) => project.status === "published" && matchesTechnology(project, technology)).length}</span></button>{categoryCounts.map((item) => <button className={category === item.name ? "selected" : ""} key={item.name} onClick={() => selectCategory(item.name)}>{item.name} <span>{item.count}</span></button>)}</div>}
              {visibleProjects.length ? <div className="project-grid">{visibleProjects.map((project) => <ProjectCard key={project.id} project={project} interaction={reactions.interactions.find((item) => item.projectId === project.id)} onOpen={() => openProject(project)} />)}</div> : <EmptyState title={search || category || technology ? "No matching projects" : "No projects published yet"} text={technology ? `No published projects use ${technology} with these filters yet.` : search || category ? "Try another search or category." : "Published projects will appear here."} />}
            </>}
            {tab === "Tech Stack" && <TechStack groups={technologyGroups} onSelect={selectTechnology} />}
            {tab === "Experience" && <ExperienceSection />}
            {tab === "About" && <AboutSection onContact={() => setContactOpen(true)} />}
          </motion.section>
        </AnimatePresence>

        <footer className="page-footer"><span>© {new Date().getFullYear()} {profile.name}</span><span>Built with care{process.env.NODE_ENV !== "production" && <> · <a href="/admin">Local comment review</a></>}</span></footer>
        {reactions.error && <p className="form-message" role="alert">{reactions.error} <button className="text-link" onClick={() => void reactions.refresh()}>Retry</button></p>}
        <AnimatePresence>{contactOpen && <ContactPanel onClose={() => setContactOpen(false)} />}</AnimatePresence>
      </main>
    </MotionConfig>
  );
}


