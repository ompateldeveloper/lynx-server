import { Hono } from "hono";
import { getStats, recordPing, runPing } from "../controllers/ping.controller";
import { getLeaderboard } from "../controllers/leaderboard.controller";

const publicRouter = new Hono();

publicRouter.get("/leaderboard", getLeaderboard);
publicRouter.get("/stats", getStats);
publicRouter.post("/ping", recordPing);
publicRouter.post("/run-ping", runPing);

export default publicRouter;
