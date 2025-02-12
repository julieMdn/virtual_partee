import Link from "next/link";

const Footer = () => {
  return (
    <footer className="text-center bg-[#002A5C] p-4 text-[#F9F9F9] font-bold">
      <Link href="/" className="hover:text-[#F5E1C0] transition-colors">
        2025 Virtual Partee - Tous droits réservés.
      </Link>
    </footer>
  );
};

export default Footer;
