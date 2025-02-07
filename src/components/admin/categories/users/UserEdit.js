import {
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  FormDataConsumer,
} from "react-admin";

const UserEdit = (props) => (
  <Edit {...props} mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="email" label="E-mail" />
      <TextInput source="lastName" label="Nom" />
      <TextInput source="firstName" label="Prénom" />
      <DateInput source="birthday" label="Date de naissance" />

      {/* Adresse */}
      <FormDataConsumer>
        {({ formData }) => {
          const billingAddress = formData.addresses?.find(
            (addr) => addr.type === "billing"
          );
          return (
            <>
              <h3 className="mt-8 mb-4 text-gray-600 border-b border-gray-300 pb-2">
                Adresse
              </h3>
              <TextInput
                source="addresses[0].street"
                label="Rue"
                defaultValue={billingAddress?.street}
              />
              <TextInput
                source="addresses[0].city"
                label="Ville"
                defaultValue={billingAddress?.city}
              />
              <TextInput
                source="addresses[0].postCode"
                label="Code Postal"
                defaultValue={billingAddress?.postCode}
              />
              <TextInput
                source="addresses[0].country"
                label="Pays"
                defaultValue={billingAddress?.country}
              />
              <TextInput
                source="addresses[0].type"
                defaultValue="billing"
                style={{ display: "none" }}
              />
              <TextInput
                source="addresses[0].phoneNumber"
                defaultValue={billingAddress?.phoneNumber || ""}
                style={{ display: "none" }}
              />
            </>
          );
        }}
      </FormDataConsumer>
    </SimpleForm>
  </Edit>
);

export default UserEdit;
