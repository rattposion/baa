declare module 'dotenv' {
  const config: (options?: any) => void;
  export { config };
  export default { config };
}

declare module 'mongoose' {
  export * from 'mongoose';
}

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