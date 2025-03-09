import BookingForm from "@/components/ui/BookingForm";
import { Suspense } from "react";

export default function BookingPage() {
  return (
    <div className="pt-40 bg-[#F9F9F9] min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-4xl font-bold mb-12 text-[#002A5C]">
          Réservation
        </h1>
        <Suspense
          fallback={<div className="text-center py-8">Chargement...</div>}
        >
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}
