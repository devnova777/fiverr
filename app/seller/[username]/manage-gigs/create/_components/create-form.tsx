"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { useState, useEffect } from "react"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"

interface CreateFormProps {
    username: string;
}

const CreateFormSchema = z.object({
    title: z
        .string()
        .min(20, {
            message: "Title must be at least 20 characters.",
        })
        .max(100, {
            message: "Title must not be longer than 100 characters.",
        }),
    category: z
        .string({
            required_error: "Please select a category.",
        })
        .min(1, {
            message: "Please select a category.",
        }),
    subcategoryId: z
        .string({
            required_error: "Please select a subcategory.",
        })
        .min(1, {
            message: "Please select a subcategory.",
        })
})

type CreateFormValues = z.infer<typeof CreateFormSchema>

// This can come from your database or API.
const defaultValues: Partial<CreateFormValues> = {
    title: "",
    category: "",
    subcategoryId: "",
}

export const CreateForm = ({
    username
}: CreateFormProps) => {
    const categories = useQuery(api.categories.get);
    const [subcategories, setSubcategories] = useState<Doc<"subcategories">[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isSeeding, setIsSeeding] = useState(false);
    
    const seedCategories = useMutation(api.seedCategories.create);
    const seedSubcategories = useMutation(api.seedSubcategories.create);
    
    const {
        mutate,
        pending
    } = useApiMutation(api.gig.create);
    const router = useRouter();

    const form = useForm<CreateFormValues>({
        resolver: zodResolver(CreateFormSchema),
        defaultValues,
        mode: "all",
    })

    // Debug: Track subcategories state changes
    useEffect(() => {
        console.log("🔄 Subcategories state changed:", {
            count: subcategories.length,
            selectedCategory,
            isDisabled: !selectedCategory || subcategories.length === 0
        });
    }, [subcategories, selectedCategory]);

    function handleCategoryChange(categoryName: string) {
        if (categories === undefined) return;
        console.log("=== handleCategoryChange called ===");
        console.log("Selected category name:", categoryName);
        
        setSelectedCategory(categoryName);
        const category = categories.find(cat => cat.name === categoryName);
        
        console.log("Category found:", category);
        console.log("Categories available:", categories.map(c => c.name));
        
        if (category) {
            console.log("Subcategories in category:", category.subcategories);
            console.log("Subcategories count:", category.subcategories?.length || 0);
            
            if (category.subcategories && category.subcategories.length > 0) {
                setSubcategories(category.subcategories);
                console.log("✅ Subcategories set, should enable now");
            } else {
                console.log("❌ No subcategories found in category");
                setSubcategories([]);
            }
            
            // Reset subcategory when category changes
            form.setValue("subcategoryId", "", { shouldValidate: true });
        } else {
            console.log("❌ Category not found in categories array");
            setSubcategories([]);
        }
    }

    async function handleSeedDatabase() {
        setIsSeeding(true);
        try {
            const catResult = await seedCategories({});
            toast.success(catResult.message);
            
            const subResult = await seedSubcategories({});
            toast.success(subResult.message);
            
            toast.info("Database seeded! Page will refresh...");
            setTimeout(() => window.location.reload(), 1500);
        } catch (error: any) {
            toast.error(error.message || "Failed to seed database");
        } finally {
            setIsSeeding(false);
        }
    }

    function onSubmit(data: CreateFormValues) {
        mutate({
            title: data.title,
            description: "",
            subcategoryId: data.subcategoryId,
        })
            .then((gigId: Id<"gigs">) => {
                toast.info("Gig created successfully");
                //form.setValue("title", "");
                router.push(`/seller/${username}/manage-gigs/edit/${gigId}`)
            })
            .catch(() => {
                toast.error("Failed to create gig")
            })
    }

    // Show loading state
    if (categories === undefined) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading categories...</p>
                </div>
            </div>
        );
    }

    // Show message if no categories
    if (categories.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center max-w-md p-6 border rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-2">No Categories Found</h3>
                    <p className="text-gray-600 mb-4">
                        Categories need to be seeded in the database first.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Click the button below to seed the database with default categories and subcategories.
                    </p>
                    <Button 
                        onClick={handleSeedDatabase}
                        disabled={isSeeding}
                        className="w-full"
                    >
                        {isSeeding ? "Seeding Database..." : "Seed Categories & Subcategories"}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Debug Panel */}
            <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs space-y-2">
                <h4 className="font-bold">🐛 Debug Info:</h4>
                <p>Categories loaded: {categories?.length || 0}</p>
                <p>Selected category: {selectedCategory || "none"}</p>
                <p>Subcategories available: {subcategories.length}</p>
                <p>Subcategory disabled: {(!selectedCategory || subcategories.length === 0) ? "YES ❌" : "NO ✅"}</p>
                <p>Title: {form.watch("title")?.substring(0, 30) || "empty"}</p>
                <p>Category value: {form.watch("category") || "empty"}</p>
                <p>SubcategoryId value: {form.watch("subcategoryId") || "empty"}</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="I will do something amazing" {...field} />
                            </FormControl>
                            <FormDescription>
                                Craft a keyword-rich Gig title to attract potential buyers.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                                onValueChange={(categoryName: string) => {
                                    field.onChange(categoryName);
                                    handleCategoryChange(categoryName);
                                }}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                {categories && (
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category._id} value={category.name}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                )}
                            </Select>
                            <FormDescription>
                                Select a category most relevant to your service.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="subcategoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subcategory</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
                                disabled={!selectedCategory || subcategories.length === 0}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={
                                            !selectedCategory 
                                                ? "Select a category first" 
                                                : subcategories.length === 0
                                                ? "No subcategories available"
                                                : "Select a subcategory"
                                        } />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {subcategories.map((subcategory) => (
                                        <SelectItem key={subcategory._id} value={subcategory._id}>
                                            {subcategory.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                {!selectedCategory 
                                    ? "Please select a category first to see subcategories."
                                    : "Subcategory will help buyers pinpoint your service more narrowly."
                                }
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button 
                    type="submit" 
                    disabled={
                        pending || 
                        !form.watch("title") || 
                        form.watch("title").length < 20 ||
                        !form.watch("category") || 
                        !form.watch("subcategoryId")
                    }
                    className="min-w-[120px]"
                >
                    {pending ? "Saving..." : "Save"}
                </Button>
            </form>
        </Form>
        </>
    )
}
