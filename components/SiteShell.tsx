import type { ReactNode } from "react";
import SiteShellClient from "./SiteShellClient";
export default function SiteShell({children}:{children:ReactNode}) { return <SiteShellClient>{children}</SiteShellClient>; }
