import { app, startServer } from "../server";

let promise: Promise<any> | null = null;

export default async function handler(req: any, res: any) {
  if (!promise) {
    promise = startServer();
  }
  await promise;
  return app(req, res);
}
