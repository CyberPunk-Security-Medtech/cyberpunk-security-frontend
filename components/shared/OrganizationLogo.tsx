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
  const [failed, setFailed] = useState(false);

  const src = activeWorkspace?.img;
  const hasLogo = Boolean(src) && src !== "/workspace.svg" && !failed;

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
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
