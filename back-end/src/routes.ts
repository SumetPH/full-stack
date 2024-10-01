import type { Express } from "express";
import auth from "./controllers/auth";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const api = "/api";

const routes = (app: Express) => {
  // routes
  app.use(api, auth);

  // error middleware
  app.use(errorMiddleware);
};

export default routes;
