import { mutation, query } from './_generated/server';

const subcategoriesByCategory = {
    'Web Development': [
        'Frontend Development', 'Backend Development', 'Full-Stack Development', 'WordPress', 'Shopify', 'E-commerce', 'Web Design'
    ],
    'Mobile Development': [
        'iOS Development', 'Android Development', 'Flutter Development', 'React Native', 'Xamarin', 'Mobile App Design', 'Mobile Game Development'
    ],
    'Design': [
        'UI/UX Design', 'Graphic Design', 'Logo Design', 'Branding', 'Illustration', 'Print Design', 'Motion Graphics'
    ],
    'Writing': [
        'Content Writing', 'Copywriting', 'Technical Writing', 'Creative Writing', 'Proofreading', 'Editing', 'Ghostwriting'
    ],
    'Marketing': [
        'Social Media Marketing', 'SEO', 'Email Marketing', 'Content Marketing', 'Influencer Marketing', 'PPC Advertising', 'Marketing Strategy'
    ],
    'Data Science': [
        'Machine Learning', 'Data Analysis', 'Big Data', 'Data Visualization', 'Predictive Analytics', 'Deep Learning', 'Natural Language Processing'
    ],
    'Artificial Intelligence': [
        'Computer Vision', 'Robotics', 'Speech Recognition', 'AI Ethics', 'Reinforcement Learning', 'Expert Systems', 'Cognitive Computing'
    ],
    'Game Development': [
        'Game Design', 'Game Programming', 'Game Art', 'Game Testing', 'Game Marketing', 'VR Development', 'AR Development'
    ],
    'Finance': [
        'Investing', 'Personal Finance', 'Financial Planning', 'Stock Market', 'Cryptocurrency', 'Banking', 'Insurance'
    ],
    'Photography': [
        'Portrait Photography', 'Landscape Photography', 'Product Photography', 'Event Photography', 'Street Photography', 'Fashion Photography', 'Travel Photography'
    ]
};


export const create = mutation({
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const categories = await ctx.db.query("categories").collect();
        
        if (categories.length === 0) {
            throw new Error("Please seed categories first before seeding subcategories");
        }

        const subcategoriesCheck = await ctx.db.query("subcategories").collect();

        if (subcategoriesCheck.length > 0) {
            // Clear existing subcategories to allow re-seeding
            await Promise.all(
                subcategoriesCheck.map(subcategory => 
                    ctx.db.delete(subcategory._id)
                )
            );
        }

        await Promise.all(
            categories.flatMap((category) => {
                const categorySubcategories = subcategoriesByCategory[category.name as keyof typeof subcategoriesByCategory] || [];
                return categorySubcategories.map((subcategoryName) =>
                    ctx.db.insert("subcategories", {
                        categoryId: category._id,
                        name: subcategoryName
                    })
                );
            })
        );

        const newSubcategories = await ctx.db.query("subcategories").collect();
        return { message: "Subcategories seeded successfully", count: newSubcategories.length };
    },
});