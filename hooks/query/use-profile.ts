import { ProfileAction } from "@/services/profile.service";
import { ClientCreateProfileType, ProfileSchema } from "@/types/profile.types";
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner";

export const useProfileQuery = () => {
    const query = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const response = await fetch("/api/v1/profile", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to fetch profile");
            }
            const profile = ProfileSchema.parse(await response.json());
            return profile;
        }
    })

    const CreateProfile = useMutation({
        mutationFn: async (data: ClientCreateProfileType) => {
            toast.promise(
                ProfileAction(data),
                {
                    loading: "Changing profile...",
                    success: "Profile changed successfully!",
                    error: (err) => `Error creating profile: ${err.message}`,
                }
            )
        }
    })

    return { ...query, CreateProfile }
}