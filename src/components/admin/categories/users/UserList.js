import { List, Datagrid, TextField, DateField, EmailField } from "react-admin";

const UserList = () => (
  <List>
    <Datagrid>
      <EmailField source="email" label="e-mail" />
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

export default UserList;
