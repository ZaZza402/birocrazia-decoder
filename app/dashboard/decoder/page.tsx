import { currentUser } from "@clerk/nextjs/server";
import { getUserPlan, PLANS } from "@/lib/plans";
import DecoderClient from "./decoder-client";
import { redirect } from "next/navigation";

export default async function DecoderPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const planId = await getUserPlan(user.id);
  const plan = PLANS[planId];

  return <DecoderClient plan={plan} userId={user.id} />;
}
