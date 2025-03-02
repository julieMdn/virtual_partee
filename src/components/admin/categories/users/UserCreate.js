import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  PasswordInput,
  SelectInput,
  required,
  email,
  minLength,
} from "react-admin";

const validateEmail = [required(), email()];
const validatePassword = [required(), minLength(8)];
const validateRequired = [required()];

const UserCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput
          source="email"
          label="Email"
          validate={validateEmail}
          fullWidth
        />
        <PasswordInput
          source="password"
          label="Mot de passe"
          validate={validatePassword}
          fullWidth
        />
        <TextInput
          source="firstName"
          label="Prénom"
          validate={validateRequired}
          fullWidth
        />
        <TextInput
          source="lastName"
          label="Nom"
          validate={validateRequired}
          fullWidth
        />
        <SelectInput
          source="role"
          label="Rôle"
          choices={[
            { id: "USER", name: "Utilisateur" },
            { id: "ADMIN", name: "Administrateur" },
          ]}
          defaultValue="USER"
          validate={validateRequired}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};

export default UserCreate;
