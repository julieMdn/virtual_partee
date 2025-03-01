import {
  Edit,
  SimpleForm,
  DateTimeInput,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
} from "react-admin";

const BookingEdit = () => (
  <Edit>
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

      <TextInput source="status" label="Statut" />

      <TextInput source="stripeSessionId" label="ID Stripe" />
    </SimpleForm>
  </Edit>
);

export default BookingEdit;
