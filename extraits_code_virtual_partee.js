/**
 * EXTRAITS DE CODE DE L'APPLICATION VIRTUAL PARTEE
 * ================================================
 */

/**
 * 1. INTERFACES UTILISATEUR
 * -------------------------
 */

// Extrait du composant NavBar.jsx - Interface de navigation
const NavBar = () => {
  // ...
  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-[#002A5C]">
              Virtual Partee
            </Link>
            <Link
              href="/offers"
              className="hidden sm:block px-4 py-2 text-white bg-[#3C8D0D] rounded-md hover:bg-[#327A0B] transition-colors ml-2 md:ml-4"
            >
              Réserver
            </Link>
          </div>
          {/* Menu pour desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/concept"
              className="text-[#002A5C] hover:text-[#FF8C42] transition-colors"
            >
              Le concept
            </Link>
            {/* Autres liens... */}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Extrait du composant Carousel.jsx - Carrousel d'images
const Carousel = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-12 overflow-hidden">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="relative h-[500px] w-full">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover rounded-xl"
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 text-center">
                <h3 className="text-xl font-semibold">{image.caption}</h3>
                {image.description && <p>{image.description}</p>}
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

/**
 * 2. COMPOSANTS MÉTIER
 * --------------------
 */

// Extrait de la page d'accueil - Logique métier et affichage
export default async function Home() {
  const { success, data: offers, error } = await getOffers();

  if (!success) {
    return (
      <div className="text-center text-red-500 pt-40">Erreur : {error}</div>
    );
  }

  const carouselImages = [
    {
      src: "https://res.cloudinary.com/dvngzrunp/image/upload/v1741426289/golf1_xzyew1.jpg",
      alt: "Simulation de golf",
      caption: "Une expérience de golf immersive",
      description: "Découvrez notre simulateur de golf de dernière génération",
    },
    // Autres images...
  ];

  return (
    <div className="pt-40 bg-[#F9F9F9]">
      <AnimatedTitle className="text-center text-4xl font-bold mb-12 text-[#002A5C]">
        Maîtrisez le parcours, quel que soit le temps : <br /> votre expérience
        de golf indoor ultime
      </AnimatedTitle>

      {/* Affichage des offres */}
      <div className="container mx-auto px-4 mb-16">
        <h2 className="text-3xl font-bold mb-8 text-[#002A5C] text-center">
          Nos offres
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Contenu de la carte d'offre... */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Extrait du composant BookingForm - Logique de réservation
const BookingForm = ({ offerId, offerTitle, offerPrice }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Fonction pour vérifier si une date doit être désactivée
  const tileDisabled = ({ date, view }) => {
    // Désactiver les dimanches
    if (view === "month" && date.getDay() === 0) {
      return true;
    }

    // Désactiver les dates passées
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Logique de soumission du formulaire...

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          minDate={new Date()}
          className="w-full"
          tileDisabled={tileDisabled}
        />
      </div>
      {/* Reste du formulaire... */}
    </div>
  );
};

// Extrait de getOffers.js - Accès aux données des offres
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getOffers() {
  try {
    const offers = await prisma.offer.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        picture: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        price: "asc",
      },
    });

    return {
      success: true,
      data: offers,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des offres:", error);
    return {
      success: false,
      error: "Impossible de récupérer les offres",
    };
  }
}

// Extrait de route.js dans api/bookings - API de réservation
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const bookings = await prisma.booking.findMany({
      where: userId ? { userId: parseInt(userId) } : {},
      include: {
        offer: true,
        timeSlot: true,
      },
    });

    return NextResponse.json(
      { success: true, data: bookings },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des réservations",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Extrait du contexte d'authentification - Gestion de l'état utilisateur
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: "Erreur de connexion" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
