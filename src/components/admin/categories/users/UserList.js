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
      <FunctionField
        label="Téléphone"
        render={(record) => {
          const billingAddress = record.addresses?.find(
            (addr) => addr.type === "billing"
          );
          const shippingAddress = record.addresses?.find(
            (addr) => addr.type === "shipping"
          );

          if (billingAddress?.phoneNumber) {
            return billingAddress.phoneNumber;
          }
          if (shippingAddress?.phoneNumber) {
            return shippingAddress.phoneNumber;
          }
          return "Non renseigné";
        }}
      />
      <FunctionField
        label="Adresse de facturation"
        render={(record) => {
          const billingAddress = record.addresses?.find(
            (addr) => addr.type === "billing"
          );
          if (!billingAddress) return "Non renseignée";

          return formatAddress(billingAddress);
        }}
      />
      <FunctionField
        label="Adresse de livraison"
        render={(record) => {
          const shippingAddress = record.addresses?.find(
            (addr) => addr.type === "shipping"
          );
          const billingAddress = record.addresses?.find(
            (addr) => addr.type === "billing"
          );

          // Si pas d'adresse de livraison mais une adresse de facturation existe
          if (!shippingAddress && billingAddress) {
            return `${formatAddress(billingAddress)}`;
          }

          // Si pas d'adresse de livraison ni de facturation
          if (!shippingAddress) return "Non renseignée";

          return formatAddress(shippingAddress);
        }}
      />
    </Datagrid>
  </List>
);

export default UserList;
