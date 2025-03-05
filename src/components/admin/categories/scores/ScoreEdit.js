import {
  Edit,
  SimpleForm,
  NumberInput,
  DateInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";

const ScoreEdit = () => (
  <Edit>
    <SimpleForm>
      <NumberInput source="value" label="Score" />
      <DateInput source="date" label="Date" />
      <ReferenceInput source="userId" reference="User" label="Utilisateur">
        <SelectInput optionText="username" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export default ScoreEdit;
