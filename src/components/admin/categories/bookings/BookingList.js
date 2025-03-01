import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
  FunctionField,
} from "react-admin";

const formatDateTime = (date) => {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const BookingList = () => (
  <List>
    <Datagrid rowClick="edit">
      <ReferenceField source="userId" reference="User" label="Client">
        <FunctionField
          render={(record) => `${record.firstName} ${record.lastName}`}
        />
      </ReferenceField>

      <ReferenceField source="offerId" reference="Offer" label="Prestation">
        <TextField source="title" />
      </ReferenceField>

      <DateField
        source="eventDate"
        label="Date de l'événement"
        locales="fr-FR"
        showTime
        options={{
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }}
      />

      <FunctionField
        label="Montant"
        render={(record) =>
          record.payment?.amount
            ? `${record.payment.amount.toFixed(2)} €`
            : "Non payé"
        }
      />

      <TextField source="stripeSessionId" label="ID Stripe" />

      <TextField source="status" label="Statut" />

      <DateField
        source="createdAt"
        label="Date de réservation"
        locales="fr-FR"
        showTime
      />
    </Datagrid>
  </List>
);

export default BookingList;
