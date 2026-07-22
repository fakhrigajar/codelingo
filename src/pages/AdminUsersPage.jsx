import { useState } from "react";
import AdminTabs from "../components/admin/AdminTabs";
import RegisteredUsersPanel from "../components/admin/RegisteredUsersPanel";
import VisitorsPanel from "../components/admin/VisitorsPanel";
import FadeIn from "../components/common/FadeIn";

const TABS = [
  { value: "registered", label: "Registered users" },
  { value: "visitors", label: "Visitors" },
];

export default function AdminUsersPage() {
  const [tab, setTab] = useState("registered");

  return (
    <div>
      <FadeIn as="h1" delay={0.05} className="text-2xl mb-1">
        Users
      </FadeIn>
      <FadeIn delay={0.15}>
        <AdminTabs tabs={TABS} active={tab} onChange={setTab} />
      </FadeIn>
      <FadeIn delay={0.25}>
        {tab === "registered" ? <RegisteredUsersPanel /> : <VisitorsPanel />}
      </FadeIn>
    </div>
  );
}
