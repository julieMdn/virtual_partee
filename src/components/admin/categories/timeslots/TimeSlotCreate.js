import { Create, SimpleForm, BooleanInput, TextInput } from "react-admin";

const TimeSlotCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput
        source="startTime"
        label="Heure de début"
        type="time"
        required
      />
      <TextInput source="endTime" label="Heure de fin" type="time" required />
      <BooleanInput
        source="isAvailable"
        label="Disponible"
        defaultValue={true}
      />
    </SimpleForm>
  </Create>
);

export default TimeSlotCreate;
