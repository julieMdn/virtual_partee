"use client";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: "success",
          message: "Message envoyé avec succès !",
        });
        // Réinitialiser le formulaire
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setStatus({
          type: "error",
          message: data.message || "Une erreur est survenue",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Une erreur est survenue lors de l'envoi du message",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="min-h-screen bg-[#F9F9F9]">
      <div className="pt-28 container mx-auto px-4 pb-12">
        <h1 className="text-3xl font-bold text-[#002A5C] mb-8 text-center">
          Contactez-nous
        </h1>

        {/* Formulaire de contact */}
        <div className="max-w-2xl mx-auto mb-12">
          {status.message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                status.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status.message}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-8 border border-[#F5E1C0]">
            <h2 className="text-2xl font-bold text-[#002A5C] mb-6">
              Envoyez-nous un message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[#002A5C] font-medium mb-2"
                >
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-[#002A5C] font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-[#002A5C] font-medium mb-2"
                >
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-[#002A5C] font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#3C8D0D] hover:bg-[#327A0B] text-white"
                }`}
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </form>
          </div>
        </div>

        {/* Section Nous trouver */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#F5E1C0] mb-12">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#002A5C] mb-6 text-center">
                Nous trouver
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-[#002A5C] mb-3">
                    Adresse
                  </h3>
                  <div className="flex items-start mb-4">
                    <svg
                      className="h-6 w-6 text-[#3C8D0D] mr-3 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-[#002A5C]/80">Virtual Partee</p>
                      <p className="text-[#002A5C]/80">15 Avenue des Sports</p>
                      <p className="text-[#002A5C]/80">75015 Paris</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-[#002A5C] mb-3">
                    Horaires d'ouverture
                  </h3>
                  <div className="flex items-start mb-4">
                    <svg
                      className="h-6 w-6 text-[#3C8D0D] mr-3 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-[#002A5C]/80">
                        Du Lundi au Samedi : 09h - 20h
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#002A5C] mb-3">
                    Contact
                  </h3>
                  <div className="flex items-start mb-4">
                    <svg
                      className="h-6 w-6 text-[#3C8D0D] mr-3 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div>
                      <p className="text-[#002A5C]/80">
                        Téléphone : 01 23 45 67 89
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start mb-4">
                    <svg
                      className="h-6 w-6 text-[#3C8D0D] mr-3 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-[#002A5C]/80">
                        Email : contact@virtualpartee.fr
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
