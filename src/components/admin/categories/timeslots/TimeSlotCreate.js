import { Create, SimpleForm, BooleanInput, TextInput } from "react-admin";

const TimeSlotCreate = () => {
  const transform = (data) => {
    // Assurons-nous que les heures sont au bon format
    const startTime = data.startTime || "00:00";
    const endTime = data.endTime || "00:00";

    // Créer une date du jour avec l'heure spécifiée
    const today = new Date().toISOString().split("T")[0];

    return {
      startTime: `${today}T${startTime}:00.000Z`,
      endTime: `${today}T${endTime}:00.000Z`,
      isAvailable: data.isAvailable === undefined ? true : data.isAvailable,
    };
  };

  const validateForm = (values) => {
    const errors = {};
    if (!values.startTime) {
      errors.startTime = "L'heure de début est requise";
    }
    if (!values.endTime) {
      errors.endTime = "L'heure de fin est requise";
    }
    if (
      values.startTime &&
      values.endTime &&
      values.startTime >= values.endTime
    ) {
      errors.endTime = "L'heure de fin doit être après l'heure de début";
    }
    return errors;
  };

  return (
    <Create transform={transform}>
      <SimpleForm validate={validateForm}>
        <TextInput
          source="startTime"
          label="Heure de début"
          type="time"
          required
        />
        <TextInput source="endTime" label="Heure de fin" type="time" required />
        <BooleanInput
          source="isAvailable"
          label="Disponible"
          defaultValue={true}
        />
      </SimpleForm>
    </Create>
  );
};

export default TimeSlotCreate;
