"use client";
import { Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
import jsonServerProvider from "ra-data-json-server";

const dataProvider = jsonServerProvider("/api/admin");

const myDataProvider = {
  ...dataProvider,
  getList: async (resource, params) => {
    const response = await fetch(
      `/api/admin/${resource}?${new URLSearchParams({
        range: JSON.stringify([
          params.pagination.page * params.pagination.perPage,
          (params.pagination.page + 1) * params.pagination.perPage - 1,
        ]),
        sort: JSON.stringify(params.sort),
        filter: JSON.stringify(params.filter),
      })}`
    );

    const json = await response.json();
    const contentRange = response.headers.get("Content-Range");
    const total = contentRange
      ? parseInt(contentRange.split("/").pop(), 10)
      : 0;

    return {
      data: json.data,
      total: total,
    };
  },
};

const AdminApp = () => {
  return (
    <Admin
      dataProvider={myDataProvider}
      disableTelemetry
      requireAuth={false}
      title="Administration"
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
        name="timeslots"
        list={ListGuesser}
        edit={EditGuesser}
        options={{ label: "Créneaux" }}
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
