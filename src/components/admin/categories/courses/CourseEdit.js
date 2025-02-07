import { Edit, SimpleForm, TextInput } from "react-admin";

const CourseEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" label="Titre du cours" />
    </SimpleForm>
  </Edit>
);

export default CourseEdit;
