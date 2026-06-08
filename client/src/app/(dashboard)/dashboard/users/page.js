"use client";

import UsersTable from "@/components/Team/UsersTable";
import { RouteGuard } from "@/components/Common/RouteGuard";

export default function UsersPage() {
  return (
    <RouteGuard requiredRoles={["Admin"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UsersTable />
      </div>
    </RouteGuard>
  );
}
