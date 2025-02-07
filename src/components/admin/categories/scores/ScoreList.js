import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
} from "react-admin";

const ScoreList = () => (
  <List>
    <Datagrid>
      <TextField source="value" label="Score" />
      <DateField
        source="date"
        label="Date"
        locales="fr-FR"
        options={{ year: "numeric", month: "long", day: "numeric" }}
      />
      <ReferenceField source="userId" reference="users" label="Utilisateur">
        <TextField source="username" />
      </ReferenceField>
      <ReferenceField source="courseId" reference="courses" label="Cours">
        <TextField source="title" />
      </ReferenceField>
    </Datagrid>
  </List>
);

export default ScoreList;
