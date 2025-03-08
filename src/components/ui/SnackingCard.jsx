import React from "react";
import Image from "next/image";
import Link from "next/link";

const SnackingCard = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-16 bg-white rounded-xl shadow-lg overflow-hidden border border-[#F5E1C0]">
      <div className="md:flex">
        <div className="md:w-1/2 relative h-64 md:h-auto">
          <Image
            src="https://res.cloudinary.com/dvngzrunp/image/upload/v1741426306/milkshake_bkmb2p.jpg"
            alt="Service de snacking et boissons"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="md:w-1/2 p-8">
          <div className="uppercase tracking-wide text-sm text-[#3C8D0D] font-semibold">
            Restauration sur place
          </div>
          <h2 className="mt-2 text-3xl font-bold text-[#002A5C]">
            Snacking & Boissons
          </h2>
          <p className="mt-4 text-[#002A5C]/80">
            En plus de l'expérience de simulation de golf, nous proposons un
            service complet de snacking et de boissons. Profitez de délicieuses
            collations et rafraîchissements pendant vos sessions de golf pour
            une expérience encore plus agréable.
          </p>
          <p className="mt-2 text-[#002A5C]/80">
            Notre menu varié saura satisfaire toutes vos envies, que vous
            souhaitiez un en-cas rapide ou une boisson désaltérante entre deux
            swings.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-block bg-[#3C8D0D] hover:bg-[#327A0B] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnackingCard;
