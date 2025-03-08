import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#002A5C] text-[#F9F9F9] py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link
              href="/"
              className="text-xl font-bold hover:text-[#F5E1C0] transition-colors"
            >
              Virtual Partee
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 md:mb-0">
            <Link
              href="/pages/concept"
              className="hover:text-[#F5E1C0] transition-colors"
            >
              Le concept
            </Link>
            <Link
              href="/pages/offers"
              className="hover:text-[#F5E1C0] transition-colors"
            >
              Nos offres
            </Link>
            <Link
              href="/pages/contact"
              className="hover:text-[#F5E1C0] transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/pages/cgv"
              className="hover:text-[#F5E1C0] transition-colors"
            >
              CGV
            </Link>
          </div>

          <div className="text-sm">
            <p>© 2025 Virtual Partee - Tous droits réservés</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
