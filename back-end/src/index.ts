import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

app.get("/", (req, res) => {
  return res.json({ message: "Hello World!" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export default app;
