import AdminJS from "adminjs";
import { Database, Resource } from "@adminjs/prisma";
import { prisma } from "@/lib/prisma";

AdminJS.registerAdapter({ Database, Resource });

const resources = [
  { resource: { model: prisma.user, client: prisma }, options: {} },
  { resource: { model: prisma.address, client: prisma }, options: {} },
  { resource: { model: prisma.offer, client: prisma }, options: {} },
  { resource: { model: prisma.timeSlot, client: prisma }, options: {} },
  { resource: { model: prisma.booking, client: prisma }, options: {} },
  { resource: { model: prisma.payment, client: prisma }, options: {} },
  { resource: { model: prisma.score, client: prisma }, options: {} },
  { resource: { model: prisma.course, client: prisma }, options: {} },
];

export const adminJs = new AdminJS({
  databases: [prisma],
  resources: resources,
  rootPath: "/admin",
  dashboard: {
    component: AdminJS.bundle("./components/dashboard"),
  },
  branding: {
    companyName: "Virtual Partee",
    logo: false,
    softwareBrothers: false,
  },
});
