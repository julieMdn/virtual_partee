"use client";

import { NextPage } from "next";
import dynamic from "next/dynamic";

const AdminApp = dynamic(() => import("@/components/AdminApp"));

const AdminPage = () => <AdminApp />;

export default AdminPage;
