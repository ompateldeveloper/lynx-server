import type { Context } from "hono";
import { db } from "../../db.js";

export const recordPing = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { url, latency, yield: yieldValue } = body;

        if (!url || latency === undefined || yieldValue === undefined) {
            return c.json({ error: "Missing required fields" }, 400);
        }

        // Find or create the source
        let source = await db.source.findUnique({
            where: { url },
        });

        if (!source) {
            source = await db.source.create({
                data: { url },
            });
        }

        // Create the ping record
        const ping = await db.pings.create({
            data: {
                sourceId: source.id,
                latency,
                yield: yieldValue,
            },
        });

        return c.json({ success: true, data: ping });
    } catch (error) {
        console.error("Error recording ping:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
};

export const runPing = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { url } = body;

        if (!url) {
            return c.json({ error: "URL is required" }, 400);
        }

        const start = Date.now();
        let yieldValue = 100;
        let latency = 0;

        try {
            const response = await fetch(url, { 
                method: "GET",
                signal: AbortSignal.timeout(5000) // 5s timeout
            });
            const end = Date.now();
            latency = end - start;
            
            if (!response.ok) {
                yieldValue = Math.max(0, 100 - (response.status >= 500 ? 50 : 20));
            }
        } catch (error) {
            console.error("Fetch error during ping:", error);
            latency = 5000;
            yieldValue = 0;
        }

        // Find or create the source
        let source = await db.source.findUnique({
            where: { url },
        });

        if (!source) {
            source = await db.source.create({
                data: { url },
            });
        }

        // Create the ping record
        const ping = await db.pings.create({
            data: {
                sourceId: source.id,
                latency,
                yield: yieldValue,
            },
        });

        return c.json({ success: true, data: ping });
    } catch (error) {
        console.error("Error running ping:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
};

export const getStats = async (c: Context) => {
    try {
        const url = c.req.query("url");

        if (!url) {
            return c.json({ error: "URL query parameter is required" }, 400);
        }

        const source = await db.source.findUnique({
            where: { url },
            include: {
                pings: {
                    orderBy: { createdAt: "desc" },
                    take: 50,
                },
            },
        });

        if (!source) {
            return c.json({ error: "Source not found" }, 404);
        }

        const totalPings = source.pings.length;
        const avgLatency = Math.round(source.pings.reduce((acc, p) => acc + p.latency, 0) / totalPings || 0);
        const avgYield = Math.round(source.pings.reduce((acc, p) => acc + p.yield, 0) / totalPings || 0);

        return c.json({
            url: source.url,
            stats: {
                avgLatency,
                avgYield,
                totalPings,
            },
            recentPings: source.pings,
        });
    } catch (error) {
        console.error("Error getting stats:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
};
