import { profile } from "@/lib/portfolio";

export default function PageFooter() {
  return <footer className="page-footer">
    <span>© {new Date().getFullYear()} {profile.name}</span>
    <span>Built with care{process.env.NODE_ENV !== "production" && <> · <a href="/admin">Local comment review</a></>}</span>
  </footer>;
}
