import {
  Create,
  SimpleForm,
  NumberInput,
  DateInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";

const ScoreCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="value" label="Score" />
      <DateInput source="date" label="Date" />
      <ReferenceInput source="userId" reference="User" label="Utilisateur">
        <SelectInput optionText="username" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

export default ScoreCreate;
