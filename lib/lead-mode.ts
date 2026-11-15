import "server-only";

export type LeadMode = "optional" | "required" | "off";

/** The sole source of truth for the gateway mode. */
export function readLeadMode(value = process.env.NEXT_LEAD_MODE): LeadMode {
  const mode = value?.trim().toLowerCase();
  if (!mode) return "optional";
  if (mode === "optional" || mode === "required" || mode === "off") return mode;
  // Invalid configuration must not lock visitors out of the public website.
  console.warn("[tutka-leads] INVALID_LEAD_MODE");
  return "off";
}
