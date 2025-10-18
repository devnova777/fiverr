import { mutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';

const categories = [
    { name: 'Web Development' },
    { name: 'Mobile Development' },
    { name: 'Design' },
    { name: 'Writing' },
    { name: 'Marketing' },
    { name: 'Data Science' },
    { name: 'Artificial Intelligence' },
    { name: 'Game Development' },
    { name: 'Finance' },
    { name: 'Photography' }
];

export const create = mutation({
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        // Check if categories already exist
        const existingCategories = await ctx.db.query("categories").collect();
        if (existingCategories.length > 0) {
            return { message: "Categories already seeded", count: existingCategories.length };
        }

        // Insert all categories
        await Promise.all(
            categories.map((category) => 
                ctx.db.insert("categories", {
                    name: category.name
                })
            )
        );

        return { message: "Categories seeded successfully", count: categories.length };
    },
});
