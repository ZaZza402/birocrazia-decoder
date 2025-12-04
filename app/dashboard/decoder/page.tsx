import { currentUser } from "@clerk/nextjs/server";
import { getUserPlan } from "@/lib/plans";
import DecoderClient from "./decoder-client";
import { redirect } from "next/navigation";

export default async function DecoderPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const plan = await getUserPlan(user.id);

  return <DecoderClient plan={plan} />;
}
