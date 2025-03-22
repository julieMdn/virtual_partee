import { getOffers } from "@/lib/serverMethods/offers/getOffers";
import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/ui/Carousel";
import SnackingCard from "@/components/ui/SnackingCard";
import AnimatedTitle from "@/components/ui/AnimatedTitle";

export default async function Home() {
  const { success, data: offers, error } = await getOffers();

  if (!success) {
    return (
      <div className="text-center text-red-500 pt-40">Erreur : {error}</div>
    );
  }

  const carouselImages = [
    {
      src: "https://res.cloudinary.com/dvngzrunp/image/upload/v1741426289/golf1_xzyew1.jpg",
      alt: "Simulation de golf",
      caption: "Une expérience de golf immersive",
      description: "Découvrez notre simulateur de golf de dernière génération",
    },
    {
      src: "https://res.cloudinary.com/dvngzrunp/image/upload/v1741426289/golf2_qjvsb2.jpg",
      alt: "Terrain de golf virtuel",
      caption: "Des parcours du monde entier",
      description: "Jouez sur les plus beaux parcours et golfez comme un pro",
    },
    {
      src: "https://res.cloudinary.com/dvngzrunp/image/upload/v1741712127/mae-mu-I7A_pHLcQK8-unsplash_nhlmjj.jpg",
      alt: "Service de snacking",
      caption: "Restauration sur place",
      description: "Profitez de nos services de snacking pendant votre partie",
    },
    {
      src: "https://res.cloudinary.com/dvngzrunp/image/upload/v1741426289/snack2_vpln4o.jpg",
      alt: "Boissons et rafraîchissements",
      caption: "Boissons et rafraîchissements",
      description: "Un large choix de boissons pour vous désaltérer",
    },
  ];

  return (
    <div className="pt-40 bg-[#F9F9F9]">
      <AnimatedTitle className="text-center text-4xl font-bold mb-12 text-[#002A5C] will-change: transform">
        Maîtrisez le parcours, quel que soit le temps : <br /> votre expérience
        de golf indoor ultime
      </AnimatedTitle>

      {/* Carousel Section */}
      <Carousel images={carouselImages} />

      {/* Offers Section */}
      <div className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold mb-8 text-[#002A5C] text-center">
          Nos offres
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform  flex flex-col h-full border border-[#F5E1C0]"
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
                  <p className="text-[#002A5C]/80 line-clamp-2">
                    {offer.description}
                  </p>
                </div>

                <div className="flex-none mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-3xl font-bold text-[#3C8D0D]">
                      {offer.price.toFixed(2)}€
                    </p>
                  </div>

                  <Link
                    href={`/offers/${offer.id}`}
                    className="block w-full bg-[#3C8D0D] hover:bg-[#327A0B] text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                  >
                    En savoir plus
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Snacking Card Section */}
      <SnackingCard />
    </div>
  );
}
