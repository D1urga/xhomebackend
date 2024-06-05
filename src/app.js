import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  }),
);

import postRouter from "./routes/post.route.js";

app.use("/api/v1/post", postRouter);

export { app };
