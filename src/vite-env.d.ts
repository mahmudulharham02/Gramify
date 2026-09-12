/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly "https://tiiftqrvywmtcekedgdn.supabase.co/rest/v1/"?: string;
  readonly "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpaWZ0cXJ2eXdtdGNla2VkZ2RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNjE1NDksImV4cCI6MjEwMzkzNzU0OX0.68Hg6psipXtuMDPlGyx0xghc9k8lX_sSAZQNdfV4thM"?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}
