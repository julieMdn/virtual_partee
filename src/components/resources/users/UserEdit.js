import { Edit, SimpleForm, TextInput, SelectInput } from "react-admin";

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="user_name" label="Nom d'utilisateur" />
      <TextInput
        source="user_email"
        label="Email"
        type="email"
        validate={(email) => {
          if (!email) return "L'email est requis";
          if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
            return "Email invalide";
          }
        }}
      />
      <TextInput source="user_firstname" label="Prénom" />
      <TextInput source="user_lastname" label="Nom" />
      <SelectInput
        source="user_role"
        label="Rôle"
        choices={[
          { id: "admin", name: "Admin" },
          { id: "user", name: "Utilisateur" },
        ]}
      />
    </SimpleForm>
  </Edit>
);
