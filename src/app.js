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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

import postRouter from "./routes/post.route.js";
import useRouter from "./routes/user.route.js";
app.use("/api/v1/user", useRouter);
app.use("/api/v1/post", postRouter);

export { app };
