import { redirect } from "next/navigation";
import AuthScreen from "@/frontend/components/AuthScreen";
import { getCurrentUser } from "@/backend/auth";

export default async function HomePage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return <AuthScreen />;
}
