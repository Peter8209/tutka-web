// Candidate identity from public records; confirm actual controller and provider before launch.
export const legalConfig = {
  draft: true, version: '2026-11-15', brand: 'TUTKA', legalName: 'NAISTO s. r. o.',
  address: 'Budatínska 16A, 851 06 Bratislava – Petržalka, Slovenská republika',
  companyId: '57720908', taxId: '2122899075', registration: '', vatId: '',
  email: 'tutka.peter@gmail.com', phone: '', dpo: '',
  // Verify and populate in each language under legal-content.json before removing draft.
  analyticsEnabled: false, marketingEnabled: false,
  consentVersion: 2, consentDays: 180,
} as const;
