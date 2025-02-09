import { List, Datagrid, TextField } from "react-admin";

const CourseList = () => (
  <List>
    <Datagrid>
      <TextField source="title" label="Titre du cours" />
    </Datagrid>
  </List>
);

export default CourseList;
