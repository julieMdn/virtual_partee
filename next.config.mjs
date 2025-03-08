/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  async redirects() {
    return [
      {
        source: "/offers",
        destination: "/pages/offers",
        permanent: true,
      },
      {
        source: "/offers/:id",
        destination: "/pages/offers/:id",
        permanent: true,
      },
      {
        source: "/account",
        destination: "/pages/account",
        permanent: true,
      },
      {
        source: "/admin",
        destination: "/pages/admin",
        permanent: true,
      },
      {
        source: "/admin/:path*",
        destination: "/pages/admin/:path*",
        permanent: true,
      },
      {
        source: "/booking",
        destination: "/pages/booking",
        permanent: true,
      },
      {
        source: "/cart",
        destination: "/pages/cart",
        permanent: true,
      },
      {
        source: "/cgv",
        destination: "/pages/cgv",
        permanent: true,
      },
      {
        source: "/concept",
        destination: "/pages/concept",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/pages/contact",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/pages/login",
        permanent: true,
      },
      {
        source: "/payment",
        destination: "/pages/payment",
        permanent: true,
      },
      {
        source: "/payment/success",
        destination: "/pages/payment/success",
        permanent: true,
      },
      {
        source: "/payment/cancel",
        destination: "/pages/payment/cancel",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/pages/register",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
