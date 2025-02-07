import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
} from "react-admin";

const TimeSlotList = () => (
  <List>
    <Datagrid>
      <DateField
        source="startTime"
        label="Heure de début"
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
        source="endTime"
        label="Heure de fin"
        locales="fr-FR"
        options={{
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }}
      />
      <BooleanField source="isAvailable" label="Disponible" />
      <TextField source="dayOfWeek" label="Jour de la semaine" />
      <TextField source="maxCapacity" label="Capacité maximale" />
    </Datagrid>
  </List>
);

export default TimeSlotList;
