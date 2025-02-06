import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  DeleteButton,
  EditButton,
  SimpleList,
} from "react-admin";
import { useMediaQuery } from "@mui/material";

export const UserList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <List>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.user_name}
          secondaryText={(record) => record.user_email}
          tertiaryText={(record) => record.user_role}
        />
      ) : (
        <Datagrid>
          <TextField source="id" />
          <TextField source="user_name" label="Nom d'utilisateur" />
          <EmailField source="user_email" label="Email" />
          <TextField source="user_firstname" label="Prénom" />
          <TextField source="user_lastname" label="Nom" />
          <DateField
            source="user_birthday"
            label="Date de naissance"
            locales="fr-FR"
          />
          <TextField source="user_role" label="Rôle" />
          <DateField
            source="user_created_at"
            label="Date de création"
            showTime
            locales="fr-FR"
          />
          <EditButton />
          <DeleteButton />
        </Datagrid>
      )}
    </List>
  );
};
