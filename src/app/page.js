import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1>Bienvenue</h1>
      <a href="/admin" className="mt-4 underline">
        Accéder à l'administration
      </a>
    </main>
  );
}
