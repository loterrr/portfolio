"use client";

import { ArrowRight } from "lucide-react";
import { about, experience } from "@/lib/portfolio";
import { validExternalUrl } from "@/lib/urls";
import BrandLogo from "./brand-logo";

export function ExperienceSection() {
  const entries = [...experience].sort((a, b) => (Date.parse(b.start_date ?? "") || 0) - (Date.parse(a.start_date ?? "") || 0));
  return <>
    <div className="section-head"><div><h2>Experience</h2><p>Work, learning, and milestones.</p></div></div>
    {entries.length ? <div className="timeline">{entries.map((item) => <article className="timeline-item" key={`${item.organization}-${item.role}`}>
      <span className="timeline-dot" />
      <span className="timeline-period">{item.period || (item.start_date ? `${item.start_date} – ${item.end_date ?? "Present"}` : "")}</span>
      <h3>{item.role}</h3>
      <p className="timeline-org">{validExternalUrl(item.url) ? <a href={item.url} target="_blank" rel="noopener noreferrer">{item.organization}</a> : item.organization}</p>
      {item.summary && <p>{item.summary}</p>}
      {Boolean(item.contributions?.length) && <ul>{item.contributions!.map((contribution) => <li key={contribution}>{contribution}</li>)}</ul>}
      {Boolean(item.technologies?.length) && <div className="tag-list">{item.technologies!.map((technology) => <span className="tag" key={technology}><BrandLogo name={technology} size={13} />{technology}</span>)}</div>}
    </article>)}</div> : <p className="section-empty">Experience details have not been published yet.</p>}
  </>;
}

export function AboutSection({ onContact }: { onContact: () => void }) {
  return <>
    <div className="section-head"><div><h2>About</h2><p>Background, interests, and what comes next.</p></div></div>
    <article className="about-block">
      {about.introduction && <p>{about.introduction}</p>}
      {about.background && <><h3>Background</h3><p>{about.background}</p></>}
      {about.philosophy && <><h3>Development philosophy</h3><p>{about.philosophy}</p></>}
      {about.interests.length > 0 && <><h3>Technical interests</h3><div className="tag-list">{about.interests.map((item) => <span className="tag" key={item}>{item}</span>)}</div></>}
      {about.specializations.length > 0 && <><h3>Specializations</h3><div className="tag-list">{about.specializations.map((item) => <span className="tag" key={item}>{item}</span>)}</div></>}
      {about.learning.length > 0 && <><h3>Currently learning</h3><div className="tag-list">{about.learning.map((item) => <span className="tag" key={item}>{item}</span>)}</div></>}
      {about.goals && <><h3>Career goals</h3><p>{about.goals}</p></>}
    </article>
    <div className="contact-strip"><h3>Have something in mind?</h3><button className="button button-primary" onClick={onContact}>Get in touch <ArrowRight size={16} /></button></div>
  </>;
}
