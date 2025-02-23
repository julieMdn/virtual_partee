import { getOffers } from "@/lib/serverMethods/offers/getOffers";
import Image from "next/image";
import Link from "next/link";
import { CartProvider } from "@/context/CartContext";
import AddToCartButton from "@/components/ui/AddToCartButton";

export default async function Offres() {
  const { success, data: offers, error } = await getOffers();

  if (!success) {
    return (
      <div className="text-center text-red-500 pt-40">Erreur : {error}</div>
    );
  }

  return (
    <div className="pt-40 bg-[#F9F9F9] min-h-screen">
      <h1 className="text-center text-4xl font-bold mb-12 text-[#002A5C]">
        Nos Offres
      </h1>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 flex flex-col h-full border border-[#F5E1C0]"
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
                  <h2 className="text-2xl font-semibold text-[#002A5C] mb-4">
                    {offer.title}
                  </h2>
                </div>

                <div className="flex-grow">
                  <p className="text-[#002A5C]/80">{offer.description}</p>
                </div>

                <div className="flex-none mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-3xl font-bold text-[#3C8D0D]">
                      {offer.price.toFixed(2)}€
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href={`/offres/${offer.id}`}
                      className="flex-1 bg-[#3C8D0D] hover:bg-[#327A0B] text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                    >
                      Voir les détails
                    </Link>
                    <Link
                      href={`/booking?offerId=${offer.id}`}
                      className="flex-1 bg-[#002A5C] hover:bg-[#001F45] text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                    >
                      Réserver
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
