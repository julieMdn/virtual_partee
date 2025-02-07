import {
  Create,
  SimpleForm,
  DateTimeInput,
  BooleanInput,
  TextInput,
  NumberInput,
} from "react-admin";

const TimeSlotCreate = () => (
  <Create>
    <SimpleForm>
      <DateTimeInput source="startTime" label="Heure de début" />
      <DateTimeInput source="endTime" label="Heure de fin" />
      <BooleanInput
        source="isAvailable"
        label="Disponible"
        defaultValue={true}
      />
      <TextInput source="dayOfWeek" label="Jour de la semaine" />
      <NumberInput source="maxCapacity" label="Capacité maximale" min={1} />
    </SimpleForm>
  </Create>
);

export default TimeSlotCreate;
