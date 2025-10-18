import { v } from "convex/values";
import { query } from "./_generated/server";

export const getByUser = query({
    args: {
        username: v.string(),
    },
    handler: async (ctx, args) => {
        // Allow viewing skills without authentication (public profile)
        const user = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .first();

        // Return empty array if user not found (graceful handling)
        if (!user) {
            return [];
        }

        const skills = await ctx.db
            .query("skills")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .collect();

        return skills;
    },
});