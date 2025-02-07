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

const UserList = () => (
  <List>
    <Datagrid>
      <TextField source="email" label="e-mail" />
      <TextField source="lastName" label="Nom" />
      <TextField source="firstName" label="Prénom" />
      <DateField
        source="birthday"
        locales="fr-FR"
        options={{ year: "numeric", month: "long", day: "numeric" }}
        label="Date de naissance"
      />
    </Datagrid>
  </List>
);

const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="username" label="Nom d'utilisateur" />
      <TextInput source="email" label="E-mail" />
      <TextInput source="firstName" label="Prénom" />
      <TextInput source="lastName" label="Nom" />
      <DateInput source="birthday" label="Date de naissance" />
      <ReferenceArrayInput
        source="addresses"
        reference="Address"
        label="Adresses"
      >
        <AutocompleteArrayInput
          optionText={(choice) =>
            `${choice.street}, ${choice.city} ${choice.postCode} ${choice.country} - Tél: ${choice.phoneNumber} (${choice.type})`
          }
        />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
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
