import { redirect } from "next/navigation";
import DashboardClient from "@/frontend/components/dashboard/DashboardClient";
import { getCurrentUser } from "@/backend/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const savedFarmProfile = user.farmProfile;
  let primaryCrops: string[] = [];
  if (savedFarmProfile) {
    const storedCrops: unknown = JSON.parse(savedFarmProfile.primaryCrops);
    if (!Array.isArray(storedCrops) || !storedCrops.every((crop) => typeof crop === "string")) {
      throw new Error(`Invalid primaryCrops data for farm profile ${savedFarmProfile.id}.`);
    }
    primaryCrops = storedCrops;
  }

  return (
    <DashboardClient
      account={{
        name: user.name,
        email: user.email ?? "",
        phone: user.phone,
        farmProfile: savedFarmProfile
          ? {
              location: savedFarmProfile.location,
              district: savedFarmProfile.district,
              state: savedFarmProfile.state,
              acreage: savedFarmProfile.acreage,
              primaryCrops
            }
          : null
      }}
    />
  );
}
