"use client";

import { BriefcaseBusiness, Code2, Globe2, Mail } from "lucide-react";
import { profile, projects, technologies } from "@/lib/portfolio";
import { buildTechnologyGroups } from "@/lib/technologies";
import { validExternalUrl, validMediaUrl } from "@/lib/urls";
import BrandLogo from "./brand-logo";
import ProfileCover from "./profile-cover";

export default function ProfilePanel({ totalLikes, onContact }: { totalLikes: number; onContact: () => void }) {
  const publishedCount = projects.filter((project) => project.status === "published").length;
  const technologyCount = buildTechnologyGroups(technologies, projects).reduce((sum, group) => sum + group.technologies.length, 0);
  const formatCount = (count: number) => new Intl.NumberFormat().format(count);
  return (
        <div className="profile-column">
        <aside className="profile-panel" aria-label="Developer profile">
          <header className="topbar">
            <a className="wordmark" href="/" aria-label="LOTER home"><Code2 size={18} /><span>LOTER</span></a>
            <div className="top-actions">{process.env.NODE_ENV !== "production" && <a className="icon-button" href="/admin" aria-label="Open local comment moderation"><BriefcaseBusiness size={17} /></a>}</div>
          </header>

          <ProfileCover />

          <section className="profile-intro">
            <div className="profile-avatar"><img src={profile.avatarUrl} alt={`${profile.name} profile photo`} width={72} height={72} decoding="async" /></div>
            <div className="profile-copy"><h1>{profile.name}</h1><p className="handle">{profile.handle}</p><p className="role">{profile.role}</p><span className={`availability ${profile.available === true ? "available" : ""}`}><span />{profile.available === null ? "Availability not set" : profile.available ? "Open to opportunities" : "Currently focused"}</span></div>
          </section>

          <section className="profile-summary">
            <p className="bio">{profile.bio}</p>
            <div className="profile-stats">
              <div><strong>{publishedCount}</strong><span>Projects</span></div>
              <div><strong>{technologyCount}</strong><span>Technologies</span></div>
              {totalLikes > 0 && <div><strong>{formatCount(totalLikes)}</strong><span>Likes</span></div>}
            </div>
            <div className="profile-actions"><button className="button button-primary" onClick={() => onContact()}>Contact Me</button>{validMediaUrl(profile.resumeUrl) ? <a className="button button-outline" href={profile.resumeUrl} download>Download CV</a> : <button className="button button-outline" disabled title="No résumé has been published">CV unavailable</button>}</div>
            <div className="social-links">{[
              ["GitHub", profile.socialLinks.github, <BrandLogo name="GitHub" size={17} key="github" />],
              ["LinkedIn", profile.socialLinks.linkedin, <BrandLogo name="LinkedIn" size={17} key="linkedin" />],
              ["Email", profile.email ? `mailto:${profile.email}` : "", <Mail size={17} key="email" />],
              ["Website", profile.socialLinks.website, <Globe2 size={17} key="website" />],
            ].filter(([label, href]) => label === "Email" ? Boolean(profile.email) : validExternalUrl(String(href))).map(([label, href, icon]) => <a key={String(label)} href={String(href)} target={String(href).startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" aria-label={String(label)}>{icon}</a>)}</div>
            <p className="profile-copyright">© {new Date().getFullYear()} {profile.name}</p>
          </section>
        </aside>
        </div>
  );
}
