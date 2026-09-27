"use client";

import { useState } from "react";
import SuccessCheckIcon from "./SuccessCheckIcon";

// Brand artwork for the "Invitation Accepted" screen. Drop the design's SVG at
// public/images/invitation-accepted.svg; until it exists (or if it fails to
// load) the drawn check is shown instead, so the screen never breaks.
const ART_SRC = "/images/invitation-accepted.svg";

export default function InvitationAcceptedArt({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) return <SuccessCheckIcon className={className} />;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ART_SRC}
      alt=""
      aria-hidden="true"
      onError={() => setFailed(true)}
      className={`object-contain ${className ?? ""}`}
    />
  );
}
