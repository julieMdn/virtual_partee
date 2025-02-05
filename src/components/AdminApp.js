"use client";
import { Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
import authProvider from "./authProvider";

// Dashboard simple
const MyDashboard = () => {
  return (
    <div>
      <h1>Bienvenue dans l'administration</h1>
      <p>Sélectionnez une ressource dans le menu</p>
    </div>
  );
};

// DataProvider minimal sans requêtes asynchrones
const dataProvider = {
  getList: (resource, params) => Promise.resolve({ data: [], total: 0 }),
  getOne: (resource, params) => Promise.resolve({ data: {} }),
  getMany: (resource, params) => Promise.resolve({ data: [] }),
  getManyReference: (resource, params) =>
    Promise.resolve({ data: [], total: 0 }),
  create: (resource, params) =>
    Promise.resolve({ data: { ...params.data, id: 1 } }),
  update: (resource, params) => Promise.resolve({ data: params.data }),
  updateMany: (resource, params) => Promise.resolve({ data: params.ids }),
  delete: (resource, params) => Promise.resolve({ data: params.previousData }),
  deleteMany: (resource, params) => Promise.resolve({ data: params.ids }),
};

const AdminApp = () => {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={MyDashboard}
      disableTelemetry
    >
      <Resource
        name="users"
        list={ListGuesser}
        edit={EditGuesser}
        options={{ label: "Utilisateurs" }}
      />
      <Resource
        name="addresses"
        list={ListGuesser}
        edit={EditGuesser}
        options={{ label: "Adresses" }}
      />
      <Resource
        name="offers"
        list={ListGuesser}
        edit={EditGuesser}
        options={{ label: "Offres" }}
      />
      <Resource
        name="bookings"
        list={ListGuesser}
        edit={EditGuesser}
        options={{ label: "Réservations" }}
      />
      <Resource
        name="payments"
        list={ListGuesser}
        edit={EditGuesser}
        options={{ label: "Paiements" }}
      />
      <Resource
        name="scores"
        list={ListGuesser}
        edit={EditGuesser}
        options={{ label: "Scores" }}
      />
      <Resource
        name="courses"
        list={ListGuesser}
        edit={EditGuesser}
        options={{ label: "Cours" }}
      />
    </Admin>
  );
};

export default AdminApp;
