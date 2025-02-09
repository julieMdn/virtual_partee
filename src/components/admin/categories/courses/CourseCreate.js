import { Create, SimpleForm, TextInput } from "react-admin";

const CourseCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" label="Titre du cours" />
    </SimpleForm>
  </Create>
);

export default CourseCreate;
