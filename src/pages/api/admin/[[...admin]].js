import { AdminJS } from "adminjs";

const admin = new AdminJS({
  rootPath: "/admin",
  resources: [],
  dashboard: {
    component: AdminJS.bundle("./components/dashboard"),
  },
});

export default admin.createHandler();

export const config = {
  api: {
    bodyParser: false,
  },
};
