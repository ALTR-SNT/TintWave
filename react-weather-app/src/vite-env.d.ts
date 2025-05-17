/// <reference types="vite/client" />
// env.d.ts
interface ImportMetaEnv {
  readonly VITE_WEATHER_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}