import type { ReactNode } from "react";
import { readLeadMode } from "../lib/lead-mode";
import SiteShellClient from "./SiteShellClient";

/** Server boundary; use from the server root layout. Only the mode is serialized. */
export default function SiteShell({ children }: { children: ReactNode }) {
  return <SiteShellClient mode={readLeadMode()}>{children}</SiteShellClient>;
}
