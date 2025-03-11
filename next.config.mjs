/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  // Ajouter des redirections pour corriger le problème d'accès à l'admin
  async redirects() {
    return [
      {
        source: "/pages/admin",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/pages/admin/:path*",
        destination: "/admin/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
