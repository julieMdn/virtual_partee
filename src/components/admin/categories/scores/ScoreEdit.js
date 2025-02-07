import {
  Edit,
  SimpleForm,
  NumberInput,
  DateInput,
  ReferenceInput,
  AutocompleteInput,
} from "react-admin";

const ScoreEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="value" label="Score" />
      <DateInput source="date" label="Date" />
      <ReferenceInput source="userId" reference="User" label="Utilisateur">
        <AutocompleteInput optionText="username" />
      </ReferenceInput>
      <ReferenceInput source="courseId" reference="Course" label="Cours">
        <AutocompleteInput optionText="title" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export default ScoreEdit;
