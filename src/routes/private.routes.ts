import { Hono } from "hono";
// import { auth } from "../lib/auth";

const privateRouter = new Hono();
// privateRouter.on(["GET", "POST"], "/auth/**", (c) => {
//     return auth.handler(c.req.raw);
// });

export default privateRouter;
