import { Create, SimpleForm, TextInput, NumberInput } from "react-admin";

const OfferCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" label="Titre" required />
      <TextInput
        source="description"
        label="Description"
        multiline
        rows={4}
        required
      />
      <NumberInput source="price" label="Prix" min={0} step={0.01} required />
      <TextInput source="picture" label="URL de l'image" required />
      <NumberInput source="duration" label="Durée (minutes)" min={0} required />
    </SimpleForm>
  </Create>
);

export default OfferCreate;
