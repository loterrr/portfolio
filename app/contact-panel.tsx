"use client";

import { Globe2, Mail, X } from "lucide-react";
import { motion } from "motion/react";
import { profile } from "@/lib/portfolio";
import { validExternalUrl, validMediaUrl } from "@/lib/urls";
import Modal from "./modal";
import BrandLogo from "./brand-logo";

export default function ContactPanel({ onClose }: { onClose: () => void }) {
  const links = [
    { label: "GitHub", href: profile.socialLinks.github },
    { label: "LinkedIn", href: profile.socialLinks.linkedin },
    { label: "Website", href: profile.socialLinks.website },
  ].filter((link) => validExternalUrl(link.href));

  return <Modal kind="details" labelId="contact-title" onClose={onClose}>
    <motion.section className="details-panel contact-panel" initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
      <button className="icon-button details-close" onClick={onClose} aria-label="Close contact"><X size={20} /></button>
      <h2 id="contact-title">Get in touch</h2>
      {profile.email ? <><p>Email is the best way to start a conversation.</p><a className="button button-primary contact-email" href={`mailto:${profile.email}`}><Mail size={17} aria-hidden="true" /><span>{profile.email}</span></a></> : <p>Contact details have not been published yet.</p>}
      {links.length > 0 && <div className="contact-links">{links.map(({ label, href }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer"><BrandLogo name={label} size={17} fallback={<Globe2 size={17} />} /> {label}</a>)}</div>}
      {validMediaUrl(profile.resumeUrl) ? <a className="button button-outline contact-resume" href={profile.resumeUrl} download>Download CV</a> : <p className="muted-empty">Résumé unavailable.</p>}
    </motion.section>
  </Modal>;
}
