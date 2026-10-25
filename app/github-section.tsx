"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import type { GithubStats } from "@/lib/github";
import { profile } from "@/lib/portfolio";
import BrandLogo from "./brand-logo";

type State =
  | { status: "loading" }
  | { status: "ready"; data: GithubStats }
  | { status: "unavailable" };

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function monthLabels(weeks: GithubStats["weeks"]) {
  const labels: Array<{ label: string; column: number }> = [];
  weeks.forEach((week, index) => {
    const first = week.days.find((day) => day.date.endsWith("-01"));
    if (!first) return;
    const label = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" }).format(new Date(`${first.date}T00:00:00Z`));
    if (labels.length && index - labels[labels.length - 1].column < 4) return;
    labels.push({ label, column: index });
  });
  return labels;
}

function GithubContent({ stats }: { stats: GithubStats }) {
  const profileUrl = profile.socialLinks.github;
  const labels = monthLabels(stats.weeks);
  const privateLabel = stats.contributions.includesPrivate ? "Public + private" : "Public";
  return <>
    <div className="github-panel">
      <div className="github-panel-head">
        <div><strong>{formatNumber(stats.contributions.total)} contributions</strong><span>{formatDate(stats.from)} – {formatDate(stats.to)}</span></div>
        <div className="github-panel-actions">
          <span className="github-private">{privateLabel}</span>
          {profileUrl && <a className="text-link" href={profileUrl} target="_blank" rel="noopener noreferrer">View profile <ArrowUpRight size={14} /></a>}
        </div>
      </div>
      <div className="github-months" aria-hidden="true" style={{ gridTemplateColumns: `repeat(${stats.weeks.length}, minmax(0, 1fr))` }}>
        {labels.map((item) => <span key={`${item.label}-${item.column}`} style={{ gridColumnStart: item.column + 1 }}>{item.label}</span>)}
      </div>
      <div className="github-calendar">
        <div className="github-day-labels" aria-hidden="true">{DAY_LABELS.map((label, index) => <span key={index}>{label}</span>)}</div>
        <div className="github-weeks" role="img" aria-label={`${formatNumber(stats.contributions.total)} contributions in the last 12 months. Darker squares mean more contributions.`}>
          {stats.weeks.map((week, weekIndex) => <div className="github-week" key={weekIndex}>
            {Array.from({ length: 7 }, (_, weekday) => {
              const day = week.days.find((item) => item.weekday === weekday);
              return day
                ? <span className={`github-day level-${day.level}`} key={day.date} title={`${formatNumber(day.count)} ${day.count === 1 ? "contribution" : "contributions"} on ${formatDate(day.date)}`} />
                : <span className="github-day is-empty" key={`${weekIndex}-${weekday}`} />;
            })}
          </div>)}
        </div>
      </div>
      <div className="github-legend" aria-hidden="true"><span>Less</span>{[0, 1, 2, 3, 4].map((level) => <span className={`github-day level-${level}`} key={level} />)}<span>More</span></div>
    </div>
    <div className="github-stat-grid">
      <div className="github-stat"><strong>{formatNumber(stats.contributions.total)}</strong><span>Contributions</span></div>
      <div className="github-stat"><strong>{formatNumber(stats.contributions.activeDays)}</strong><span>Active days</span></div>
      <div className="github-stat"><strong>{formatNumber(stats.contributions.longestStreak)}</strong><span>Longest streak</span></div>
      <div className="github-stat"><strong>{formatNumber(stats.repositories)}</strong><span>Public repos</span></div>
    </div>
    {stats.languages.length > 0 && <div className="github-languages">
      <h3>Top languages</h3>
      <div className="github-language-bar" aria-hidden="true">{stats.languages.map((language) => <span key={language.name} style={{ flexGrow: language.percent, background: language.color }} />)}</div>
      <ul className="github-language-list">{stats.languages.map((language) => <li key={language.name}><span className="github-language-dot" style={{ background: language.color }} />{language.name}<em>{language.percent}%</em></li>)}</ul>
    </div>}
  </>;
}

export default function GithubSection() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const profileUrl = profile.socialLinks.github;

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    fetch("/api/github", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("unavailable");
        return await response.json() as GithubStats;
      })
      .then((data) => setState({ status: "ready", data }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "unavailable" });
      });
    return () => controller.abort();
  }, [attempt]);

  return <>
    <div className="section-head"><div><h2>GitHub</h2><p>Contributions and public repositories from the last 12 months.</p></div></div>
    {state.status === "loading" && <div className="github-panel github-loading" role="status">Loading GitHub activity…</div>}
    {state.status === "unavailable" && <div className="github-panel github-fallback">
      <BrandLogo name="GitHub" size={24} fallback={<span className="github-fallback-mark">GH</span>} />
      <div><strong>Live GitHub activity is unavailable.</strong><p>Browse the profile directly, or try again in a moment.</p></div>
      <div className="github-fallback-actions">
        {profileUrl && <a className="text-link" href={profileUrl} target="_blank" rel="noopener noreferrer">View profile <ArrowUpRight size={14} /></a>}
        <button className="text-link" onClick={() => setAttempt((value) => value + 1)}><RefreshCw size={14} /> Try again</button>
      </div>
    </div>}
    {state.status === "ready" && <GithubContent stats={state.data} />}
  </>;
}
