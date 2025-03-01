import {
  Create,
  SimpleForm,
  DateTimeInput,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
} from "react-admin";

const BookingCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="userId" reference="User" label="Client">
        <AutocompleteInput
          optionText={(record) => `${record.firstName} ${record.lastName}`}
        />
      </ReferenceInput>

      <ReferenceInput source="offerId" reference="Offer" label="Prestation">
        <AutocompleteInput optionText="title" />
      </ReferenceInput>

      <DateTimeInput source="eventDate" label="Date de l'événement" />

      <TextInput source="status" label="Statut" defaultValue="pending" />

      <TextInput source="stripeSessionId" label="ID Stripe" />
    </SimpleForm>
  </Create>
);

export default BookingCreate;
