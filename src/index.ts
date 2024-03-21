import express, { Express, Request, Response } from "express";
import mongooseDbRun from "./mongoose";

const app: Express = express();


app.get("/", (req: Request, res: Response) => {
  res.send("Live server");
});

mongooseDbRun()

app.listen(3001, () => {
  console.log(`[server]: Server is running at http://localhost:3001`);
});