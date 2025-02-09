import {
  Edit,
  SimpleForm,
  NumberInput,
  DateInput,
  ReferenceInput,
} from "react-admin";

const ScoreEdit = () => (
  <Edit>
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
  </Edit>
);

export default ScoreEdit;
