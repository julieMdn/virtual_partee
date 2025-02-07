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
import polyglotI18nProvider from "ra-i18n-polyglot";
import { Box, Typography } from "@mui/material";
import authProvider from "./authProvider";
import LanguageIcon from "@mui/icons-material/Language";
import UserList from "./categories/users/UserList";
import UserEdit from "./categories/users/UserEdit";
import TimeSlotList from "./categories/timeslots/TimeSlotList";
import TimeSlotEdit from "./categories/timeslots/TimeSlotEdit";
import TimeSlotCreate from "./categories/timeslots/TimeSlotCreate";
import ScoreList from "./categories/scores/ScoreList";
import ScoreEdit from "./categories/scores/ScoreEdit";
import ScoreCreate from "./categories/scores/ScoreCreate";
import PaymentList from "./categories/payments/PaymentList";
import PaymentEdit from "./categories/payments/PaymentEdit";
import PaymentCreate from "./categories/payments/PaymentCreate";
import OfferList from "./categories/offers/OfferList";
import OfferEdit from "./categories/offers/OfferEdit";
import OfferCreate from "./categories/offers/OfferCreate";
import CourseList from "./categories/courses/CourseList";
import CourseEdit from "./categories/courses/CourseEdit";
import CourseCreate from "./categories/courses/CourseCreate";
import BookingList from "./categories/bookings/BookingList";
import BookingEdit from "./categories/bookings/BookingEdit";
import BookingCreate from "./categories/bookings/BookingCreate";

const adminDataProvider = dataProvider("/api");

const i18nProvider = polyglotI18nProvider((locale) => {
  if (locale === "fr") {
    return {
      ...frenchMessages,
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
        name="TimeSlot"
        list={TimeSlotList}
        edit={TimeSlotEdit}
        create={TimeSlotCreate}
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
      />
      <Resource
        name="Course"
        list={CourseList}
        edit={CourseEdit}
        create={CourseCreate}
        recordRepresentation="course_title"
      />
    </Admin>
  );
};

export default AdminApp;
