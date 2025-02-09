import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
} from "react-admin";

const OfferEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" label="Titre" />
      <TextInput source="description" label="Description" multiline rows={4} />
      <NumberInput source="price" label="Prix" min={0} step={0.01} />
      <TextInput source="picture" label="URL de l'image" />
      <NumberInput source="duration" label="Durée (minutes)" min={0} />
      <DateInput source="createdAt" label="Date de création" disabled />
    </SimpleForm>
  </Edit>
);

export default OfferEdit;
