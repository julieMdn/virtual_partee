import {
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  FormDataConsumer,
} from "react-admin";

const UserEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="email" label="E-mail" />
      <TextInput source="lastName" label="Nom" />
      <TextInput source="firstName" label="Prénom" />
      <DateInput source="birthday" label="Date de naissance" />

      {/* Téléphone unique */}
      <FormDataConsumer>
        {({ formData }) => {
          const billingAddress = formData.addresses?.find(
            (addr) => addr.type === "billing"
          );
          return (
            <TextInput
              source="addresses[0].phoneNumber"
              label="Téléphone"
              initialValue={billingAddress?.phoneNumber}
            />
          );
        }}
      </FormDataConsumer>

      {/* Adresse de facturation */}
      <FormDataConsumer>
        {({ formData }) => {
          const billingAddress = formData.addresses?.find(
            (addr) => addr.type === "billing"
          );
          return (
            <>
              <h3
                style={{
                  marginBottom: "1rem",
                  color: "#666",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "0.5rem",
                }}
              >
                Adresse de facturation
              </h3>
              <TextInput
                source="addresses[0].street"
                label="Rue"
                initialValue={billingAddress?.street}
              />
              <TextInput
                source="addresses[0].city"
                label="Ville"
                initialValue={billingAddress?.city}
              />
              <TextInput
                source="addresses[0].postCode"
                label="Code Postal"
                initialValue={billingAddress?.postCode}
              />
              <TextInput
                source="addresses[0].country"
                label="Pays"
                initialValue={billingAddress?.country}
              />
              <TextInput
                type="hidden"
                source="addresses[0].type"
                initialValue="billing"
              />
            </>
          );
        }}
      </FormDataConsumer>

      {/* Adresse de livraison */}
      <FormDataConsumer>
        {({ formData }) => {
          const shippingAddress = formData.addresses?.find(
            (addr) => addr.type === "shipping"
          );
          return (
            <>
              <h3
                style={{
                  marginTop: "2rem",
                  marginBottom: "1rem",
                  color: "#666",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "0.5rem",
                }}
              >
                Adresse de livraison
              </h3>
              <TextInput
                source="addresses[1].street"
                label="Rue"
                initialValue={shippingAddress?.street}
              />
              <TextInput
                source="addresses[1].city"
                label="Ville"
                initialValue={shippingAddress?.city}
              />
              <TextInput
                source="addresses[1].postCode"
                label="Code Postal"
                initialValue={shippingAddress?.postCode}
              />
              <TextInput
                source="addresses[1].country"
                label="Pays"
                initialValue={shippingAddress?.country}
              />
              <TextInput
                type="hidden"
                source="addresses[1].type"
                initialValue="shipping"
              />
            </>
          );
        }}
      </FormDataConsumer>
    </SimpleForm>
  </Edit>
);

export default UserEdit;
