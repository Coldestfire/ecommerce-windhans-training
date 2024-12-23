/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_BACKEND_URL: string; // add more env variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  