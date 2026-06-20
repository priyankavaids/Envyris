/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAIL_DRIVER?: string;
  readonly VITE_GMAIL_USER?: string;
  readonly VITE_GMAIL_PASS?: string;
  readonly VITE_ALERT_RECIPIENT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
