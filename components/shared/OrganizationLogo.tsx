"use client";

import { useState } from "react";
import { useAuth } from "@context/AuthContext";

type OrganizationLogoProps = {
  width?: number;
  height?: number;
  /** Shown when the organization has no uploaded logo or it fails to load. */
  fallback?: string;
  className?: string;
};

/**
 * Renders the active workspace's organization logo, falling back to the
 * default Privacure logo when none is set. Uses a plain <img> because
 * organization logos can be hosted on any domain.
 */
export default function OrganizationLogo({
  width = 110,
  height = 70,
  fallback = "/sidebar_logo.svg",
  className,
}: OrganizationLogoProps) {
  const { activeWorkspace } = useAuth();
  // Track which URL failed so switching to another workspace (with a fresh
  // signed link) clears the error instead of sticking on the fallback.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const src = activeWorkspace?.img;
  const hasLogo =
    typeof src === "string" &&
    src.length > 0 &&
    src !== "/workspace.svg" &&
    failedSrc !== src;

  if (!hasLogo) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={fallback}
        alt="PrivaCure"
        width={width}
        height={height}
        className={className}
      />
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={activeWorkspace?.name ?? "Organization logo"}
      width={width}
      height={height}
      onError={() => setFailedSrc(src ?? "")}
      className={className}
    />
  );
}
