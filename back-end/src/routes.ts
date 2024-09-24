import type { Express } from "express";
import auth from "./controllers/auth";
import post from "./controllers/post";

const routes = (app: Express) => {
  app.use(auth);
  app.use(post);
};

export default routes;
