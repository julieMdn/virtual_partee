import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  ImageField,
} from "react-admin";

const OfferList = () => (
  <List>
    <Datagrid>
      <TextField source="title" label="Titre" />
      <TextField source="description" label="Description" />
      <NumberField
        source="price"
        label="Prix"
        options={{ style: "currency", currency: "EUR" }}
      />
      <ImageField source="picture" label="Image" />
      <TextField source="duration" label="Durée (minutes)" />
      <DateField
        source="createdAt"
        label="Date de création"
        locales="fr-FR"
        options={{ year: "numeric", month: "long", day: "numeric" }}
      />
    </Datagrid>
  </List>
);

export default OfferList;
