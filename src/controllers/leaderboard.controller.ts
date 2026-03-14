import type { Context } from "hono";
import { db } from "../../db";

export const getLeaderboard = async (c: Context) => {
    try {
        const sources = await db.source.findMany({
            include: {
                pings: true,
            },
        });

        const leaderboard = sources.map(source => {
            const avgLatency = source.pings.reduce((acc, p) => acc + p.latency, 0) / source.pings.length || 0;
            const avgYield = source.pings.reduce((acc, p) => acc + p.yield, 0) / source.pings.length || 0;
            return {
                url: source.url,
                avgLatency,
                avgYield,
                totalPings: source.pings.length,
            };
        }).sort((a, b) => a.avgLatency - b.avgLatency); // Sort by lowest latency

        return c.json(leaderboard);
    } catch (error) {
        console.error("Error getting leaderboard:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
};
