declare module 'dotenv';
declare module 'mongoose';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI?: string;
      NODE_ENV?: string;
      PORT?: string;
    }
  }
}

export {}; 