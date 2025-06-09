import { RequestHandler } from 'express';

declare module 'express-async-handler' {
  function expressAsyncHandler(handler: RequestHandler): RequestHandler;
  export = expressAsyncHandler;
} 