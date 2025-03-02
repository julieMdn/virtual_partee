"use client";

import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  Layout,
  AppBar,
} from "react-admin";
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
import OfferList from "./categories/offers/OfferList";
import OfferEdit from "./categories/offers/OfferEdit";
import OfferCreate from "./categories/offers/OfferCreate";
import BookingList from "./categories/bookings/BookingList";
import BookingEdit from "./categories/bookings/BookingEdit";
import BookingCreate from "./categories/bookings/BookingCreate";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

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
        },
        Course: {
          name: "Parcours |||| Parcours",
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
        Courses: {
          name: "Course |||| Courses",
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

// Composant Admin avec dataProvider chargé dynamiquement côté client uniquement
const AdminWithDataProvider = dynamic(
  () =>
    import("ra-data-simple-prisma").then(({ dataProvider }) => {
      const AdminComponent = () => (
        <Admin
          dataProvider={dataProvider}
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
          <Resource name="Score" />
          <Resource name="Course" recordRepresentation="title" />
        </Admin>
      );
      return AdminComponent;
    }),
  {
    ssr: false,
    loading: () => <div>Chargement de l'interface d'administration...</div>,
  }
);

const AdminApp = () => {
  return <AdminWithDataProvider />;
};

export default AdminApp;
