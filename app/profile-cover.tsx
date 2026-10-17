"use client";

import { profile } from "@/lib/portfolio";

export default function ProfileCover() {
  const banner = profile.bannerUrl || "/media/cover-banner.png";

  return (
    <div className="profile-cover-wrap" aria-label="Personal cover banner">
      <img
        src={banner}
        alt={`${profile.name} cover banner`}
        className="profile-cover-img"
        width={1200}
        height={320}
        loading="eager"
      />
    </div>
  );
}
