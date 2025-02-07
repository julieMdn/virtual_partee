import {
  Edit,
  SimpleForm,
  DateTimeInput,
  BooleanInput,
  TextInput,
  NumberInput,
} from "react-admin";

const TimeSlotEdit = () => (
  <Edit>
    <SimpleForm>
      <DateTimeInput source="startTime" label="Heure de début" />
      <DateTimeInput source="endTime" label="Heure de fin" />
      <BooleanInput source="isAvailable" label="Disponible" />
      <TextInput source="dayOfWeek" label="Jour de la semaine" />
      <NumberInput source="maxCapacity" label="Capacité maximale" />
    </SimpleForm>
  </Edit>
);

export default TimeSlotEdit;
