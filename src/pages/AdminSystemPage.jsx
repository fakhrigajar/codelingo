import { useState } from "react";
import AdminTabs from "../components/admin/AdminTabs";
import BackupResetPanel from "../components/admin/BackupResetPanel";
import ApiUsagePanel from "../components/admin/ApiUsagePanel";

const TABS = [
  { value: "backup", label: "Backup & reset" },
  { value: "api", label: "API usage" },
];

export default function AdminSystemPage() {
  const [tab, setTab] = useState("backup");

  return (
    <div>
      <h1 className="text-2xl mb-1">System</h1>
      <AdminTabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === "backup" ? <BackupResetPanel /> : <ApiUsagePanel />}
    </div>
  );
}
