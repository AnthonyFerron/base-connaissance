import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DashboardAuthForm from "./DashboardAuthForm";
import DashboardLogoutButton from "./DashboardLogoutButton";


export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });


  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      {session ? (
        <>
          <h2>Bienvenue {session.user.email}</h2>
          <DashboardLogoutButton />
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
