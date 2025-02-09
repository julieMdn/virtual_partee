import {
  Create,
  SimpleForm,
  NumberInput,
  DateInput,
  ReferenceInput,
} from "react-admin";

const ScoreCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="value" label="Score" />
      <DateInput source="date" label="Date" />
      <ReferenceInput
        source="userId"
        reference="User"
        label="Utilisateur"
      ></ReferenceInput>
      <ReferenceInput
        source="courseId"
        reference="Course"
        label="Cours"
      ></ReferenceInput>
    </SimpleForm>
  </Create>
);

export default ScoreCreate;
