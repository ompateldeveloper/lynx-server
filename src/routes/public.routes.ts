import { Hono } from "hono";
import { getStats, recordPing, runPing } from "../controllers/ping.controller.js";
import { getLeaderboard } from "../controllers/leaderboard.controller.js";

const publicRouter = new Hono();

publicRouter.get("/leaderboard", getLeaderboard);
publicRouter.get("/stats", getStats);
publicRouter.post("/ping", recordPing);
publicRouter.post("/run-ping", runPing);

export default publicRouter;
