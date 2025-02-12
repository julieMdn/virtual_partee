import { getOffers } from "@/lib/serverMethods/offers/getOffers";
import Image from "next/image";

export default async function Home() {
  const { success, data: offers, error } = await getOffers();

  if (!success) {
    return (
      <div className="text-center text-red-500 pt-40">Erreur : {error}</div>
    );
  }

  return (
    <div className="pt-40">
      <h1 className="text-center text-4xl font-bold mb-12">
        Bienvenue sur Virtual Partee
      </h1>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 flex flex-col h-full"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={offer.picture}
                  alt={offer.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="p-6 flex flex-col h-full">
                <div className="flex-none">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    {offer.title}
                  </h2>
                </div>

                <div className="flex-grow">
                  <p className="text-gray-600">{offer.description}</p>
                </div>

                <div className="flex-none mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-3xl font-bold text-blue-600">
                      {offer.price.toFixed(2)}€
                    </p>
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    Choisir cette offre
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
