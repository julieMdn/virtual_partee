import {
  Edit,
  SimpleForm,
  DateInput,
  NumberInput,
  TextInput,
} from "react-admin";

const PaymentEdit = () => (
  <Edit>
    <SimpleForm>
      <DateInput source="date" label="Date" />
      <NumberInput source="amount" label="Montant" />
      <NumberInput source="tvaAmount" label="Montant TVA" />
      <TextInput source="status" label="Statut" />
    </SimpleForm>
  </Edit>
);

export default PaymentEdit;
