import { useState } from "react";
import AdminTabs from "../components/admin/AdminTabs";
import RegisteredUsersPanel from "../components/admin/RegisteredUsersPanel";
import VisitorsPanel from "../components/admin/VisitorsPanel";

const TABS = [
  { value: "registered", label: "Registered users" },
  { value: "visitors", label: "Visitors" },
];

export default function AdminUsersPage() {
  const [tab, setTab] = useState("registered");

  return (
    <div>
      <h1 className="text-2xl mb-1">Users</h1>
      <AdminTabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === "registered" ? <RegisteredUsersPanel /> : <VisitorsPanel />}
    </div>
  );
}
