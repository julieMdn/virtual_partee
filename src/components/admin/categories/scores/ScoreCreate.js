import {
  Create,
  SimpleForm,
  NumberInput,
  ReferenceInput,
  AutocompleteInput,
} from "react-admin";

const ScoreCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="value" label="Score" min={0} max={100} />
      <ReferenceInput source="userId" reference="User" label="Utilisateur">
        <AutocompleteInput optionText="username" />
      </ReferenceInput>
      <ReferenceInput source="courseId" reference="Course" label="Cours">
        <AutocompleteInput optionText="title" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

export default ScoreCreate;
