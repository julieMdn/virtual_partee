import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    // TODO: Ici vous pourriez ajouter la logique pour envoyer un email
    // Par exemple avec nodemailer ou un service d'email

    // Pour l'instant, on simule un succès
    return NextResponse.json({
      success: true,
      message: "Message envoyé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de l'envoi du message",
      },
      { status: 500 }
    );
  }
}
