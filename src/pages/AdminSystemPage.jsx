import { useState } from "react";
import AdminTabs from "../components/admin/AdminTabs";
import BackupResetPanel from "../components/admin/BackupResetPanel";
import ApiUsagePanel from "../components/admin/ApiUsagePanel";
import FadeIn from "../components/common/FadeIn";

const TABS = [
  { value: "backup", label: "Backup & reset" },
  { value: "api", label: "API usage" },
];

export default function AdminSystemPage() {
  const [tab, setTab] = useState("backup");

  return (
    <div>
      <FadeIn as="h1" delay={0.05} className="text-2xl mb-1">
        System
      </FadeIn>
      <FadeIn delay={0.15}>
        <AdminTabs tabs={TABS} active={tab} onChange={setTab} />
      </FadeIn>
      <FadeIn delay={0.25}>
        {tab === "backup" ? <BackupResetPanel /> : <ApiUsagePanel />}
      </FadeIn>
    </div>
  );
}
