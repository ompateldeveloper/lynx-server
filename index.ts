import { Hono } from "hono";
import { cors } from "hono/cors";
// import { auth } from "./src/lib/auth";
import publicRouter from "./src/routes/public.routes.js";
import privateRouter from "./src/routes/private.routes.js";

const app = new Hono().basePath("/api");

app.use(cors());

// Better Auth handler
// app.on(["POST", "GET"], "/auth/*", (c) => {
//     return auth.handler(c.req.raw);
// });

// Routes
app.route("/public", publicRouter);
app.route("/private", privateRouter);

app.get("/", (c) => {
    return c.json({ message: "Lynx Latency API is running" });
});
app.get("/app", (c) => {
    return c.json({ message: "App" });
});

export default app;
