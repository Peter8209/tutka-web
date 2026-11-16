// Single adapter to the existing legal source of truth. Do not invent registration data.
import { legalConfig } from "@/components/legal/legal-config";
export const company = Object.freeze({ ...legalConfig, website: "https://www.tutka.sk" });
