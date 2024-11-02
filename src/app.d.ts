// src/app.d.ts
declare global {
  namespace App {
    interface Locals {
      user: {
        id: number;
        username: string;
        email: string;
      } | null;
    }
    interface Platform {
      env: {
        DB: D1Database;
      };
    }
    interface PageData {
      user?: {
        id: number;
        username: string;
        email: string;
      } | null;
    }
  }
}

export {};

