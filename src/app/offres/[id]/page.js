import { getOfferById } from "@/lib/serverMethods/offers/getOfferById";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/ui/AddToCartButton";

export default async function OfferDetail({ params: { id } }) {
  // Assurons-nous que l'ID est bien un nombre
  const offerId = Number(id);

  if (isNaN(offerId)) {
    return (
      <div className="pt-40 container mx-auto px-4">
        <div className="text-center text-red-500">ID d'offre invalide</div>
        <div className="text-center mt-4">
          <Link
            href="/offres"
            className="text-[#3C8D0D] hover:text-[#327A0B] underline"
          >
            Retourner aux offres
          </Link>
        </div>
      </div>
    );
  }

  const { success, data: offer, error } = await getOfferById(offerId);

  if (!success) {
    return (
      <div className="pt-40 container mx-auto px-4">
        <div className="text-center text-red-500">Erreur : {error}</div>
        <div className="text-center mt-4">
          <Link
            href="/offres"
            className="text-[#3C8D0D] hover:text-[#327A0B] underline"
          >
            Retourner aux offres
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9F9F9]">
      <div className="pt-28 container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-[#F5E1C0]">
          <div className="relative h-96 w-full">
            <Image
              src={offer.picture}
              alt={offer.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#002A5C] mb-4">
                {offer.title}
              </h1>
              <p className="text-[#002A5C]/80 text-lg leading-relaxed">
                {offer.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-4xl font-bold text-[#3C8D0D]">
                  {offer.price.toFixed(2)}€
                </p>
              </div>

              <div className="flex gap-4 w-full sm:w-auto">
                <AddToCartButton offer={offer} />
                <button className="w-full sm:w-auto bg-[#3C8D0D] hover:bg-[#327A0B] text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                  Réserver maintenant
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#F5E1C0]">
              <Link
                href="/offres"
                className="text-[#3C8D0D] hover:text-[#327A0B] underline"
              >
                ← Retour aux offres
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
