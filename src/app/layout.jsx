import "./globals.css";
import ClientLayout from "@/components/ui/ClientLayout";

export const metadata = {
  title: "Virtual Partee",
  description: "Simulateur de golf indoor",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.webp", type: "image/webp" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-full flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
