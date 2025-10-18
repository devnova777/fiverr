"use client";

import { CreateForm } from "./_components/create-form";
import { useParams } from "next/navigation";

const CreateGig = () => {
    const params = useParams<{ username: string }>();
    
    return (
        <div className="flex justify-center">
            <CreateForm
                username={params.username}
            />
        </div>
    );
}
export default CreateGig;