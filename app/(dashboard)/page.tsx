"use client";

import { useConvexAuth, useMutation } from "convex/react";
import { GigList } from "./_components/gig-list";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";

const Dashboard = () => {
    const searchParams = useSearchParams();
    const { isAuthenticated, isLoading } = useConvexAuth();
    const store = useMutation(api.users.store);
    
    useEffect(() => {
        if (!isAuthenticated || isLoading) {
            return;
        }
        
        const storeUser = async () => {
            try {
                await store({});
            } catch (error) {
                console.error("Failed to store user:", error);
            }
        }
        storeUser();
    }, [isAuthenticated, isLoading, store])

    // Convert URLSearchParams to object
    const query = {
        search: searchParams.get('search') || undefined,
        favorites: searchParams.get('favorites') || undefined,
        filter: searchParams.get('filter') || undefined,
    };

    return (
        <GigList
            query={query}
        />
    );
};

export default Dashboard;