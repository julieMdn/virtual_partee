import {
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  ReferenceArrayInput,
  AutocompleteArrayInput,
} from "react-admin";

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

export default UserEdit;
