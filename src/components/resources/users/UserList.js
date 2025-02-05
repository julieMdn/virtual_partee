import { List, Datagrid, TextField, EmailField, DateField } from "react-admin";

export const UserList = () => {
  console.log("Rendu de UserList - Début");

  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="user_name" label="Nom d'utilisateur" />
        <EmailField source="user_email" label="Email" />
        <TextField source="user_firstname" label="Prénom" />
        <TextField source="user_lastname" label="Nom" />
        <TextField source="user_role" label="Rôle" />
        <DateField source="user_created_at" label="Date de création" />
      </Datagrid>
    </List>
  );
};
