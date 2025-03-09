import {
  Edit,
  SimpleForm,
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

      <ReferenceInput
        source="timeSlotId"
        reference="TimeSlot"
        label="Créneau horaire"
      >
        <AutocompleteInput
          optionText={(record) => {
            if (!record?.startTime) return "Non défini";
            const start = new Date(record.startTime);
            const date = start.toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
            const heure = start.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            });
            return `${date} à ${heure}`;
          }}
        />
      </ReferenceInput>

      <TextInput source="status" label="Statut" />

      <TextInput source="stripeSessionId" label="ID Stripe" />
    </SimpleForm>
  </Edit>
);

export default BookingEdit;
