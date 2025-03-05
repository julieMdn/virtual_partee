"use client";

import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  Layout,
  AppBar,
} from "react-admin";
import { dataProvider } from "ra-data-simple-prisma";
import { LocalesMenuButton } from "react-admin";
import frenchMessages from "ra-language-french";
import englishMessages from "ra-language-english";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { Box, Typography } from "@mui/material";
import authProvider from "./authProvider";
import LanguageIcon from "@mui/icons-material/Language";
import UserList from "./categories/users/UserList";
import UserEdit from "./categories/users/UserEdit";
import UserCreate from "./categories/users/UserCreate";
import ScoreList from "./categories/scores/ScoreList";
import ScoreEdit from "./categories/scores/ScoreEdit";
import ScoreCreate from "./categories/scores/ScoreCreate";
import PaymentList from "./categories/payments/PaymentList";
import PaymentEdit from "./categories/payments/PaymentEdit";
import PaymentCreate from "./categories/payments/PaymentCreate";
import OfferList from "./categories/offers/OfferList";
import OfferEdit from "./categories/offers/OfferEdit";
import OfferCreate from "./categories/offers/OfferCreate";
import BookingList from "./categories/bookings/BookingList";
import BookingEdit from "./categories/bookings/BookingEdit";
import BookingCreate from "./categories/bookings/BookingCreate";
import { useState, useEffect } from "react";

const adminDataProvider = dataProvider("/api", {
  include: {
    Booking: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      offer: {
        select: {
          id: true,
          title: true,
        },
      },
      payment: {
        select: {
          id: true,
          amount: true,
          status: true,
        },
      },
    },
  },
});

const i18nProvider = polyglotI18nProvider((locale) => {
  if (locale === "fr") {
    return {
      ...frenchMessages,
      resources: {
        User: {
          name: "Utilisateur |||| Utilisateurs",
        },
        Offer: {
          name: "Offre |||| Offres",
        },
        Booking: {
          name: "Réservation |||| Réservations",
        },
        Score: {
          name: "Score |||| Scores",
          fields: {
            // ... existing code ...
          },
        },
      },
    };
  }
  if (locale === "en") {
    return {
      ...englishMessages,
      resources: {
        User: {
          name: "User |||| Users",
        },
        Offers: {
          name: "Offer |||| Offers",
        },
        Bookings: {
          name: "Booking |||| Bookings",
        },
        Scores: {
          name: "Score |||| Scores",
        },
      },
    };
  }
  return {};
}, "fr");

const MyAppBar = () => (
  <AppBar>
    <Box flex="1">
      <Typography variant="h6" id="react-admin-title"></Typography>
    </Box>
    <LocalesMenuButton
      languages={[
        { locale: "en", name: "English" },
        { locale: "fr", name: "Français" },
      ]}
      icon={<LanguageIcon />}
    />
  </AppBar>
);

const AdminApp = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Admin
      dataProvider={adminDataProvider}
      i18nProvider={i18nProvider}
      authProvider={authProvider}
      layout={(props) => <Layout {...props} appBar={MyAppBar} />}
    >
      <Resource
        name="User"
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
        recordRepresentation="username"
      />
      <Resource
        name="Offer"
        list={OfferList}
        edit={OfferEdit}
        create={OfferCreate}
        recordRepresentation="offer_title"
      />
      <Resource
        name="Booking"
        list={BookingList}
        edit={BookingEdit}
        create={BookingCreate}
      />
      <Resource
        name="Score"
        list={ScoreList}
        edit={ScoreEdit}
        create={ScoreCreate}
        recordRepresentation="value"
      />
    </Admin>
  );
};

export default AdminApp;
