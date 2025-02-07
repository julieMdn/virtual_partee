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
        source="date"
        label="Date de réservation"
        locales="fr-FR"
        options={{ year: "numeric", month: "long", day: "numeric" }}
      />
      <TextField source="status" label="Statut" />
      <ReferenceField source="userId" reference="users" label="Utilisateur">
        <TextField source="username" />
      </ReferenceField>
      <ReferenceField source="offerId" reference="offers" label="Offre">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField
        source="timeSlotId"
        reference="timeslots"
        label="Créneau horaire"
      >
        <DateField source="startTime" />
      </ReferenceField>
      <ReferenceField source="paymentId" reference="payments" label="Paiement">
        <TextField source="id" />
      </ReferenceField>
    </Datagrid>
  </List>
);

export default BookingList;
