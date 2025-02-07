"use client";

import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  Layout,
  AppBar,
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  ReferenceArrayInput,
  AutocompleteArrayInput,
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
        name="Address"
        list={ListGuesser}
        edit={EditGuesser}
        recordRepresentation="address_street"
      />
      <Resource
        name="Offer"
        list={ListGuesser}
        edit={EditGuesser}
        recordRepresentation="offer_title"
      />
      <Resource name="TimeSlot" list={ListGuesser} edit={EditGuesser} />
      <Resource name="Booking" list={ListGuesser} edit={EditGuesser} />
      <Resource name="Payment" list={ListGuesser} edit={EditGuesser} />
      <Resource name="Score" list={ListGuesser} edit={EditGuesser} />
      <Resource
        name="Course"
        list={ListGuesser}
        edit={EditGuesser}
        recordRepresentation="course_title"
      />
    </Admin>
  );
};

export default AdminApp;
