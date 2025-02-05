"use client";
import { Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import authProvider from "./authProvider";

const dataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    try {
      const response = await fetch(
        `/api/admin/${resource}?${new URLSearchParams({
          page: page.toString(),
          perPage: perPage.toString(),
          sortField: field,
          sortOrder: order,
          filter: JSON.stringify(params.filter),
        })}`
      );

      const json = await response.json();

      return {
        data: json.data,
        total: json.total,
      };
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  getOne: async (resource, params) => {
    const response = await fetch(`/api/admin/${resource}/${params.id}`);
    const json = await response.json();
    return { data: json };
  },

  create: async (resource, params) => {
    const response = await fetch(`/api/admin/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    return { data: json };
  },

  update: async (resource, params) => {
    const response = await fetch(`/api/admin/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    return { data: json };
  },

  delete: async (resource, params) => {
    await fetch(`/api/admin/${resource}/${params.id}`, {
      method: "DELETE",
    });
    return { data: params.previousData };
  },

  deleteMany: async (resource, params) => {
    const response = await fetch(`/api/admin/${resource}/bulk-delete`, {
      method: "POST",
      body: JSON.stringify({ ids: params.ids }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { data: [] };
  },
};

const AdminApp = () => {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      requireAuth
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
