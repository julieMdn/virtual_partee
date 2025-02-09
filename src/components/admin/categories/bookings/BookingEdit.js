import {
  Edit,
  SimpleForm,
  DateInput,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
} from "react-admin";

const BookingEdit = () => (
  <Edit>
    <SimpleForm>
      <DateInput source="date" label="Date de réservation" />
      <TextInput source="status" label="Statut" />
      <ReferenceInput source="userId" reference="User" label="Utilisateur">
        <AutocompleteInput optionText="username" />
      </ReferenceInput>
      <ReferenceInput source="offerId" reference="Offer" label="Offre">
        <AutocompleteInput optionText="title" />
      </ReferenceInput>
      <ReferenceInput
        source="timeSlotId"
        reference="TimeSlot"
        label="Créneau horaire"
      >
        <AutocompleteInput
          optionText={(record) =>
            `${new Date(record.startTime).toLocaleString("fr-FR")} - ${new Date(
              record.endTime
            ).toLocaleString("fr-FR")}`
          }
        />
      </ReferenceInput>
      <ReferenceInput source="paymentId" reference="Payment" label="Paiement">
        <AutocompleteInput optionText="id" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export default BookingEdit;
