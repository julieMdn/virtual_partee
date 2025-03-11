import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
  FunctionField,
} from "react-admin";

const formatTimeSlot = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Format de la date (une seule fois)
  const date = start.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Format des heures
  const startHour = start.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endHour = end.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${date} de ${startHour} à ${endHour}`;
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

      <ReferenceField
        source="timeSlotId"
        reference="TimeSlot"
        label="Créneau horaire"
      >
        <FunctionField
          render={(record) => {
            if (!record?.startTime || !record?.endTime) return "Non défini";
            return formatTimeSlot(record.startTime, record.endTime);
          }}
        />
      </ReferenceField>

      <ReferenceField source="paymentId" reference="Payment" label="Montant">
        <FunctionField
          render={(record) =>
            record?.amount ? `${record.amount.toFixed(2)} €` : "Non payé"
          }
        />
      </ReferenceField>

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
