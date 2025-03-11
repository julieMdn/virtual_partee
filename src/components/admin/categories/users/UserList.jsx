import {
  List,
  Datagrid,
  TextField,
  DateField,
  EmailField,
  FunctionField,
} from "react-admin";

const formatAddress = (address) => {
  return `${address.street}, ${address.city} ${address.postCode} ${address.country}`;
};

const UserList = () => (
  <List>
    <Datagrid rowClick="edit">
      <EmailField source="email" label="e-mail" />
      <TextField source="lastName" label="Nom" />
      <TextField source="firstName" label="Prénom" />
      <FunctionField
        label="Score Total"
        render={(record) => {
          const totalScore =
            record.scores?.reduce((sum, score) => sum + score.value, 0) || 0;
          return `${totalScore} points`;
        }}
      />
      <DateField
        source="birthday"
        locales="fr-FR"
        options={{ year: "numeric", month: "long", day: "numeric" }}
        label="Date de naissance"
      />
      <FunctionField
        label="Téléphone"
        render={(record) => {
          const billingAddress = record.addresses?.find(
            (addr) => addr.type === "billing"
          );
          return billingAddress?.phoneNumber || "Non renseigné";
        }}
      />
      <FunctionField
        label="Adresse"
        render={(record) => {
          const billingAddress = record.addresses?.find(
            (addr) => addr.type === "billing"
          );
          if (!billingAddress) return "Non renseignée";
          return formatAddress(billingAddress);
        }}
      />
    </Datagrid>
  </List>
);

export default UserList;
