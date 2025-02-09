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
      <DateField source="date" label="Date" locales="fr-FR" showTime={false} />
      <ReferenceField source="userId" reference="User" label="Utilisateur">
        <TextField source="username" />
      </ReferenceField>
      <ReferenceField source="courseId" reference="Course" label="Cours">
        <TextField source="title" />
      </ReferenceField>
    </Datagrid>
  </List>
);

export default ScoreList;
