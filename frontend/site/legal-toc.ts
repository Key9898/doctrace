export const PRIVACY_SECTION_IDS = [
  "privacy-who",
  "privacy-scope",
  "privacy-roles",
  "privacy-site",
  "privacy-cookies",
  "privacy-addin",
  "privacy-cloud",
  "privacy-processors",
  "privacy-host",
  "privacy-excel",
  "privacy-retention",
  "privacy-delete",
  "privacy-not",
  "privacy-children",
  "privacy-rights",
  "privacy-transfers",
  "privacy-security",
  "privacy-changes",
  "privacy-contact",
] as const;

export const TERMS_SECTION_IDS = [
  "terms-agreement",
  "terms-tool",
  "terms-license",
  "terms-data",
  "terms-confidentiality",
  "terms-local",
  "terms-use",
  "terms-accounts",
  "terms-warranty",
  "terms-liability",
  "terms-auditor",
  "terms-third",
  "terms-changes",
  "terms-termination",
  "terms-law",
  "terms-publisher",
  "terms-contact",
] as const;

export type PrivacySectionId = (typeof PRIVACY_SECTION_IDS)[number];
export type TermsSectionId = (typeof TERMS_SECTION_IDS)[number];
