"use client";

import { useState } from "react";

type WorkspaceAvatarProps = {
  /** Workspace-like object carrying an optional logo URL and name. */
  workspace?: { img?: string | null; name?: string | null } | null;
  /** Diameter of the circular avatar, in pixels. */
  size?: number;
  className?: string;
};

/** Sentinel used by AuthContext when an organization has no uploaded logo. */
const NO_LOGO_SRC = "/workspace.svg";

/**
 * Renders a workspace's uploaded organization image in a circular frame,
 * falling back to the organization's initial when none is set or the signed
 * link has expired. Uses a plain <img> because organization logos are hosted
 * on any domain behind signed, expiring links (which next/image rejects).
 */
export default function WorkspaceAvatar({
  workspace,
  size = 40,
  className,
}: WorkspaceAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const src = workspace?.img;
  if (
    typeof src === "string" &&
    src.length > 0 &&
    src !== NO_LOGO_SRC &&
    failedSrc !== src
  ) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={workspace?.name ? `${workspace.name} logo` : "Organization logo"}
        width={size}
        height={size}
        onError={() => setFailedSrc(src)}
        className={`shrink-0 rounded-full object-cover ${className ?? ""}`}
      />
    );
  }

  const initial = (workspace?.name ?? "").trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#E9FFFB] font-semibold text-[#0A8377] ${className ?? ""}`}
    >
      {initial}
    </span>
  );
}
