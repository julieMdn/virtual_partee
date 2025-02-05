import {
  Admin,
  Resource,
  ListGuesser,
  Card,
  CardContent,
  Title,
} from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import { UserList } from "./resources/users/UserList";
import authProvider from "./authProvider";

// Composant Dashboard
const Dashboard = () => (
  <div
    style={{
      padding: "20px",
      maxWidth: "800px",
      margin: "0 auto",
    }}
  >
    <h1>Tableau de bord d'administration</h1>
    <p>Bienvenue dans l'interface d'administration.</p>
    <p>
      Utilisez le menu à gauche pour naviguer entre les différentes sections.
    </p>
  </div>
);

// Création d'un dataProvider personnalisé
const customDataProvider = {
  getList: async (resource) => {
    console.log("Appel API pour:", resource);
    try {
      const response = await fetch(`/api/admin/${resource}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      console.log("Réponse API brute:", json);

      const formattedData = json.data.map((item) => ({
        id: item.user_id,
        ...item,
      }));

      return {
        data: formattedData,
        total: json.total,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération:", error);
      throw error;
    }
  },

  getOne: async (resource, { id }) => {
    const response = await fetch(`/api/admin/${resource}/${id}`);
    const json = await response.json();
    return { data: json };
  },
};

const AdminApp = () => {
  console.log("Rendu de AdminApp");

  return (
    <Admin
      dataProvider={customDataProvider}
      authProvider={authProvider}
      dashboard={Dashboard}
    >
      <Resource
        name="users"
        list={UserList}
        options={{ label: "Utilisateurs" }}
      />
    </Admin>
  );
};

export default AdminApp;
