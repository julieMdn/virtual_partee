"use client";

import dynamic from "next/dynamic";

const AdminApp = dynamic(() => import("@/components/admin/AdminApp"));

const AdminPage = () => <AdminApp />;

export default AdminPage;
