interface CloudflareEnv {
  nextagent_db: D1Database;
  nextagent_docs: R2Bucket;
  STRIPE_SECRET_KEY: string;
  GROQ_API_KEY_1: string;
  GROQ_API_KEY_2: string;
  OPENROUTER_API_KEY: string;
  AUTH_SECRET: string;
  AUTH_GOOGLE_ID: string;
  AUTH_GOOGLE_SECRET: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends CloudflareEnv {}
  }
}

export {};
