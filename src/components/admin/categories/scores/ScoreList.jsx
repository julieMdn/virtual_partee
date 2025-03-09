import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
} from "react-admin";

const ScoreList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="value" />
      <DateField source="date" />
      <ReferenceField source="userId" reference="User" label="Utilisateur">
        <TextField source="username" />
      </ReferenceField>
    </Datagrid>
  </List>
);

export default ScoreList;
