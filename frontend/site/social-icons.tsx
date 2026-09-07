function BrandGlyph({ path }: { path: string }) {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path d={path} fill="currentColor" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect height="16" rx="2" width="20" x="2" y="4" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <BrandGlyph path="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-1.074 0-1.707.406-1.707 1.756v2.215h3.557l-.488 3.667h-3.069v7.98H9.101z" />
  );
}

export function YouTubeIcon() {
  return (
    <BrandGlyph path="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  );
}

export function ViberIcon() {
  return (
    <BrandGlyph path="M11.4.007C9.48.035 5.314.41 3.017 2.63.54 4.89.011 8.056 0 10.507c.006 2.286.387 4.247 1.185 5.831.66 1.308 1.596 2.309 2.717 2.975V24l5.1-2.438c.96.19 1.875.288 2.75.288 8.247 0 11.248-6.896 11.248-11.35C23 4.294 16.618.007 11.4.007zm.05 2.16c4.94 0 8.94 3.31 8.94 8.35 0 5.04-4 8.35-8.94 8.35-.83 0-1.64-.1-2.4-.31l-.36-.1-3.02 1.45v-3.22l-.27-.16c-1.58-.95-2.54-2.58-2.54-4.96 0-5.04 4-9.4 8.59-9.4z" />
  );
}
