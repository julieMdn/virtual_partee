import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
} from "react-admin";

const BookingList = () => (
  <List>
    <Datagrid>
      <DateField
        source="createdAt"
        label="Date de création"
        locales="fr-FR"
        options={{
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }}
      />
      <DateField
        source="eventDate"
        label="Date de l'événement"
        locales="fr-FR"
        options={{
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }}
      />
      <TextField source="status" label="Statut" />
      <ReferenceField source="userId" reference="User" label="Utilisateur">
        <TextField source="username" />
      </ReferenceField>
      <ReferenceField source="offerId" reference="Offer" label="Offre">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField
        source="timeSlotId"
        reference="TimeSlot"
        label="Créneau horaire"
      >
        <DateField source="startTime" />
      </ReferenceField>
      <ReferenceField source="paymentId" reference="Payment" label="Paiement">
        <TextField source="id" />
      </ReferenceField>
    </Datagrid>
  </List>
);

export default BookingList;
