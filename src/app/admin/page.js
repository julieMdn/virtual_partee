import AdminClient from "./admin-client";

export const metadata = {
  title: "Administration",
  description: "Interface d'administration",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Tableau de bord administrateur
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Utilisateurs</h2>
              <p className="text-gray-600">
                Gérez les utilisateurs et leurs informations
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Offres</h2>
              <p className="text-gray-600">
                Gérez les offres et les réservations
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Cours</h2>
              <p className="text-gray-600">Gérez les cours et les scores</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <AdminClient />
          </div>
        </div>
      </div>
    </div>
  );
}
