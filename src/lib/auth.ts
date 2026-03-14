import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "../../db";
import { expo } from "@better-auth/expo";

export const auth = betterAuth({
    plugins: [expo()],
    trustedOrigins: ["lynx://", "lynx://*", ...(process.env.NODE_ENV === "development" ? ["exp://", "exp://**", "exp://192.168.*.*:*/**"] : [])],
    database: prismaAdapter(db, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
});
