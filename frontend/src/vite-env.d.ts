/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_SHOW_PREP_MODULES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
