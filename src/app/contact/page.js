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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-[#002A5C] mb-8 text-center">
            Contactez-nous
          </h1>

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

          <div className="mt-12 text-center space-y-4">
            <h2 className="text-xl font-semibold text-[#002A5C]">
              Autres moyens de nous contacter
            </h2>
            <p className="text-[#002A5C]/80">
              Email: contact@virtualpartee.com
            </p>
            <p className="text-[#002A5C]/80">Téléphone: +33 (0)1 23 45 67 89</p>
          </div>
        </div>
      </div>
    </main>
  );
}
