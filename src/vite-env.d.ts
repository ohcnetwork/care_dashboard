/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_NAV_LOGO: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
