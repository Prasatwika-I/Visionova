import { redirect } from "next/navigation";
import { checkIsAdminAuthenticated } from "@/lib/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const isAuthed = await checkIsAdminAuthenticated();

  if (!isAuthed) {
    redirect("/admin/login");
  }

  const isConfiguredWithGoogle = !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SHEET_ID
  );

  return (
    <AdminDashboard
      initialRegistrations={[]}
      isConfiguredWithGoogle={isConfiguredWithGoogle}
    />
  );
}
