import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";

// Supprimer les avertissements concernant les mises à jour React non enveloppées dans act(...)
const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};

// Améliorer la gestion des mises à jour asynchrones dans les tests
global.actAsync = async (callback) => {
  await act(async () => {
    await callback();
  });
};

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    query: {},
  }),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mocks pour next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((param) => {
      if (param === "offerId") return "offer123";
      return null;
    }),
  })),
  usePathname: jest.fn(() => "/"),
  redirect: jest.fn(),
}));

// Mock pour react-hot-toast
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn(),
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

// Mock pour js-cookie
jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

// Mock pour fetch global
global.fetch = jest.fn();

// Configuration pour les tests
beforeEach(() => {
  // Réinitialiser tous les mocks
  jest.clearAllMocks();

  // Configurer fetch par défaut
  global.fetch.mockImplementation((url) => {
    if (url.includes("/api/offers")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: "offer123", title: "Offre de test", price: 100 },
          ]),
      });
    }
    if (url.includes("/api/timeslots")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: "slot1", startTime: "14:00", endTime: "15:00" },
          ]),
      });
    }
    if (url.includes("/api/cart/add")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    }
    if (url.includes("/api/cart")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            items: [{ id: "item1", offerId: "offer123", timeSlotId: "slot1" }],
            total: 100,
          }),
      });
    }
    if (url.includes("/api/user/bookings")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: "booking1", offerId: "offer123", timeSlotId: "slot1" },
          ]),
      });
    }

    // Réponse par défaut
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });
});

// Mocks pour les contextes
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(() => ({
    user: { id: "user123", email: "test@example.com" },
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    checkAuth: jest.fn(),
  })),
  AuthProvider: ({ children }) => children,
}));

jest.mock("@/context/CartContext", () => ({
  useCart: jest.fn(() => ({
    cart: { items: [], total: 0 },
    loading: false,
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    clearCart: jest.fn(),
    error: null,
  })),
  CartProvider: ({ children }) => children,
}));
