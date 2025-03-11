import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Concept() {
  return (
    <div className="pt-40 bg-[#F9F9F9] min-h-screen pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-4xl font-bold mb-12 text-[#002A5C]">
          Le Concept Virtual Partee
        </h1>

        {/* Section d'introduction */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#F5E1C0] mb-12">
          <div className="md:flex">
            <div className="md:w-1/2 relative h-64 md:h-auto">
              <Image
                src="https://res.cloudinary.com/dvngzrunp/image/upload/v1741426305/golf_simulator_n4ypjy.jpg"
                alt="Simulateur de golf Virtual Partee"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl font-bold text-[#002A5C] mb-4">
                Une expérience de golf indoor ultime
              </h2>
              <p className="text-[#002A5C]/80 mb-4">
                Virtual Partee est une entreprise premium offrant une salle
                équipée d'un simulateur de golf de dernière génération. Notre
                concept unique vous permet de pratiquer votre passion pour le
                golf toute l'année, quelles que soient les conditions
                météorologiques.
              </p>
              <p className="text-[#002A5C]/80">
                Que vous soyez un golfeur expérimenté cherchant à améliorer
                votre technique, un débutant souhaitant découvrir ce sport, ou
                simplement à la recherche d'une activité ludique entre amis ou
                collègues, Virtual Partee vous offre une expérience immersive et
                conviviale.
              </p>
            </div>
          </div>
        </div>

        {/* Section des services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#F5E1C0] flex flex-col">
            <div className="p-6 flex-grow">
              <div className="w-16 h-16 bg-[#3C8D0D] rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#002A5C] mb-3">
                Entraînement sportif
              </h3>
              <p className="text-[#002A5C]/80">
                Perfectionnez votre swing, analysez vos performances et
                améliorez votre technique grâce à notre simulateur haute
                précision. Idéal pour les golfeurs de tous niveaux souhaitant
                progresser.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#F5E1C0] flex flex-col">
            <div className="p-6 flex-grow">
              <div className="w-16 h-16 bg-[#3C8D0D] rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#002A5C] mb-3">
                Événements de groupe
              </h3>
              <p className="text-[#002A5C]/80">
                Organisez des événements d'entreprise, des team buildings ou des
                fêtes entre amis dans un cadre original et ludique. Une activité
                parfaite pour renforcer la cohésion d'équipe.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#F5E1C0] flex flex-col">
            <div className="p-6 flex-grow">
              <div className="w-16 h-16 bg-[#3C8D0D] rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#002A5C] mb-3">
                Loisirs et détente
              </h3>
              <p className="text-[#002A5C]/80">
                Profitez d'un moment de détente et de plaisir en famille ou
                entre amis. Découvrez le golf de manière ludique et accessible,
                sans les contraintes d'un parcours traditionnel.
              </p>
            </div>
          </div>
        </div>

        {/* Section snacking */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#F5E1C0] mb-12">
          <div className="md:flex flex-row-reverse">
            <div className="md:w-1/2 relative h-64 md:h-auto">
              <Image
                src="https://res.cloudinary.com/dvngzrunp/image/upload/v1741426306/milkshake_bkmb2p.jpg"
                alt="Délicieuses pâtisseries et snacks"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl font-bold text-[#002A5C] mb-4">
                Une expérience complète
              </h2>
              <p className="text-[#002A5C]/80 mb-4">
                En plus de notre simulateur de golf, nous proposons un service
                de snacking et de boissons de qualité. Profitez de délicieuses
                pâtisseries, collations et rafraîchissements pendant vos
                sessions pour une expérience encore plus agréable.
              </p>
              <p className="text-[#002A5C]/80">
                Notre espace lounge vous permet de vous détendre entre deux
                swings, de discuter de votre performance ou simplement de passer
                un moment convivial. Chez Virtual Partee, nous avons pensé à
                tout pour que votre expérience soit parfaite.
              </p>
            </div>
          </div>
        </div>

        {/* Section réservation */}
        <div className="bg-[#002A5C] rounded-xl shadow-lg overflow-hidden mb-12 text-center py-12 px-6">
          <h2 className="text-3xl font-bold text-white mb-6">
            Prêt à vivre l'expérience Virtual Partee ?
          </h2>
          <p className="text-white/90 mb-8 max-w-3xl mx-auto">
            Réservez dès maintenant votre session sur notre simulateur de golf
            et découvrez une nouvelle façon de pratiquer ce sport. Notre système
            de réservation en ligne vous permet de choisir facilement la date,
            l'heure et la durée de votre session.
          </p>
          <Link
            href="/offers"
            className="inline-block px-8 py-4 bg-[#3C8D0D] hover:bg-[#327A0B] text-white font-semibold rounded-lg transition-colors text-lg"
          >
            Découvrir nos offres
          </Link>
        </div>

        {/* Section avantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#F5E1C0] p-6">
            <h3 className="text-2xl font-bold text-[#002A5C] mb-4">
              Pourquoi choisir Virtual Partee ?
            </h3>
            <ul className="space-y-3 text-[#002A5C]/80">
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-[#3C8D0D] mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  Équipement de dernière génération pour une simulation
                  ultra-réaliste
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-[#3C8D0D] mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Parcours virtuels des plus beaux golfs du monde</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-[#3C8D0D] mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  Analyse détaillée de votre swing et de vos performances
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-[#3C8D0D] mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  Accessible à tous les niveaux, du débutant au professionnel
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#F5E1C0] p-6">
            <h3 className="text-2xl font-bold text-[#002A5C] mb-4">
              Notre engagement
            </h3>
            <ul className="space-y-3 text-[#002A5C]/80">
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-[#3C8D0D] mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Un accueil chaleureux et personnalisé</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-[#3C8D0D] mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  Des équipements régulièrement entretenus et mis à jour
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-[#3C8D0D] mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>
                  Une expérience complète alliant sport et convivialité
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-[#3C8D0D] mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Des offres adaptées à tous les besoins</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
