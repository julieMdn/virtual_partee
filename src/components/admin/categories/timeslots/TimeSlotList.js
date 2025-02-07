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
      <TextField source="startTime" label="Heure de début" />
      <TextField source="endTime" label="Heure de fin" />
      <BooleanField source="isAvailable" label="Disponible" />
    </Datagrid>
  </List>
);

export default TimeSlotList;
