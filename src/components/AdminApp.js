import { Admin, Resource, ListGuesser, Title } from "react-admin";
import { Card, CardContent } from "@mui/material";
import simpleRestProvider from "ra-data-simple-rest";
import { UserList } from "./resources/users/UserList";
import { UserEdit } from "./resources/users/UserEdit";
import authProvider from "./authProvider";

// Composant Dashboard avec Card de MUI
const Dashboard = () => (
  <Card>
    <CardContent>
      <Title title="Tableau de bord d'administration" />
      <p>Bienvenue dans l'interface d'administration.</p>
      <p>
        Utilisez le menu à gauche pour naviguer entre les différentes sections.
      </p>
    </CardContent>
  </Card>
);

// Création d'un dataProvider personnalisé
const customDataProvider = {
  getList: async (resource) => {
    try {
      const response = await fetch(`/api/admin/${resource}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();

      const formattedData = json.data.map((item) => ({
        id: item.user_id,
        ...item,
      }));

      return {
        data: formattedData,
        total: json.total,
      };
    } catch (error) {
      throw error;
    }
  },

  getOne: async (resource, { id }) => {
    const url = new URL(`${window.location.origin}/api/admin/${resource}`);
    url.searchParams.append("id", id);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    return {
      data: {
        id: json.user_id,
        ...json,
      },
    };
  },

  update: async (resource, { id, data }) => {
    const response = await fetch(`/api/admin/${resource}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedData = await response.json();
    return {
      data: {
        id: updatedData.user_id,
        ...updatedData,
      },
    };
  },

  delete: async (resource, { id }) => {
    const response = await fetch(`/api/admin/${resource}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { data: { id } };
  },

  deleteMany: async (resource, { ids }) => {
    await Promise.all(
      ids.map((id) =>
        fetch(`/api/admin/${resource}/${id}`, {
          method: "DELETE",
        })
      )
    );
    return { data: ids };
  },
};

const AdminApp = () => (
  <Admin
    dataProvider={customDataProvider}
    authProvider={authProvider}
    dashboard={Dashboard}
  >
    <Resource
      name="users"
      list={UserList}
      edit={UserEdit}
      options={{ label: "Utilisateurs" }}
    />
  </Admin>
);

export default AdminApp;
