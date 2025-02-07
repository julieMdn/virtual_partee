import { Create, SimpleForm, NumberInput, TextInput } from "react-admin";

const PaymentCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="amount" label="Montant" min={0} step={0.01} />
      <NumberInput source="tvaAmount" label="Montant TVA" min={0} step={0.01} />
      <TextInput source="status" label="Statut" defaultValue="pending" />
    </SimpleForm>
  </Create>
);

export default PaymentCreate;
