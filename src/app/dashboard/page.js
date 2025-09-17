

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardAuthForm from "./DashboardAuthForm";


export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  async function handleLogout() {
    "use server";
    await auth.api.signOut();
    redirect("/sign-in");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      {session ? (
        <>
          <h2>Bienvenue {session.user.email}</h2>
          <form action={handleLogout}>
            <button type="submit">Se déconnecter</button>
          </form>
        </>
      ) : (
        <>
          <h2>Bienvenue invité</h2>
          <DashboardAuthForm />
        </>
      )}
    </div>
  );
}
