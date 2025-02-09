import { List, Datagrid, TextField, DateField, NumberField } from "react-admin";

const PaymentList = () => (
  <List>
    <Datagrid>
      <DateField
        source="date"
        label="Date"
        locales="fr-FR"
        options={{ year: "numeric", month: "long", day: "numeric" }}
      />
      <NumberField
        source="amount"
        label="Montant"
        options={{ style: "currency", currency: "EUR" }}
      />
      <NumberField
        source="tvaAmount"
        label="Montant TVA"
        options={{ style: "currency", currency: "EUR" }}
      />
      <TextField source="status" label="Statut" />
    </Datagrid>
  </List>
);

export default PaymentList;
