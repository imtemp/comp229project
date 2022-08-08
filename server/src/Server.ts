import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import StatusCodes from "http-status-codes";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import "express-async-errors";
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

import logger from "./shared/Logger";
import { cookieProps, DB_URI, CORS } from "./shared/constants";

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const mongoDB = mongoose.connection;
mongoDB.on("error", console.error.bind(console, "Connection Error:"));
mongoDB.once("open", () => {
  console.log("Connected to MongoDB...");
});

import * as models from "./models/";
import BaseRouter from "./routes";

const app = express();

app.use(cors(CORS));
// Allow cross-origin requests in dev environments
if (process.env.NODE_ENV !== "production") {
  app.options("*", cors(CORS));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(cookieProps.secret));

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

app.use("/api", BaseRouter);

// Return JSON responses for 404s
app.get("*", function (req, res) {
  res.status(404).json({});
});

// Print API errors
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.err(err, true);

  let statusCode: number;
  let error: string;
  try {
    error = JSON.stringify(err);
    statusCode = BAD_REQUEST;
  } catch (ex) {
    logger.err(ex, true);
    error = "<could not report the error>";
    statusCode = INTERNAL_SERVER_ERROR;
  }
  return res.status(statusCode).json({
    error: error,
  });
});

export default app;
