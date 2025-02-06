import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  DeleteButton,
  EditButton,
  ArrayField,
  SingleFieldList,
  ChipField,
  NumberField,
  SimpleList,
  useRecordContext,
  Labeled,
} from "react-admin";
import { useMediaQuery } from "@mui/material";

export const UserList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <List>
      {isSmall ? (
        <SimpleList
          primaryText={(record) => record.user_name}
          secondaryText={(record) => record.user_email}
          tertiaryText={(record) => record.user_role}
        />
      ) : (
        <Datagrid
          rowClick="expand"
          size="small"
          expand={<UserExpanded />}
          bulkActionButtons={false}
          sx={{
            "& .RaDatagrid-headerCell": {
              backgroundColor: "theme.palette.grey[100]",
            },
            "& .RaDatagrid-row": {
              "&:hover": {
                backgroundColor: "theme.palette.action.hover",
              },
            },
            "& .column-address": {
              minWidth: 200,
            },
            "& .column-scores": {
              minWidth: 150,
            },
            "& .column-bookings": {
              minWidth: 200,
            },
          }}
        >
          <TextField source="id" />
          <TextField source="user_name" label="Nom d'utilisateur" />
          <EmailField source="user_email" label="Email" />
          <TextField source="user_firstname" label="Prénom" />
          <TextField source="user_lastname" label="Nom" />
          <DateField
            source="user_birthday"
            label="Date de naissance"
            locales="fr-FR"
          />
          <TextField source="user_role" label="Rôle" />
          <DateField
            source="user_created_at"
            label="Date de création"
            showTime
            locales="fr-FR"
          />

          <ArrayField source="addresses" label="Adresses">
            <SingleFieldList>
              <ChipField
                source="address_street"
                sx={{
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
            </SingleFieldList>
          </ArrayField>

          <ArrayField source="scores" label="Scores">
            <SingleFieldList>
              <NumberField
                source="score_value"
                options={{ maximumFractionDigits: 2 }}
              />
            </SingleFieldList>
          </ArrayField>

          <ArrayField source="bookings" label="Réservations">
            <SingleFieldList>
              <ChipField
                source="booking_date"
                sx={{
                  maxWidth: "100%",
                  overflow: "hidden",
                }}
              />
            </SingleFieldList>
          </ArrayField>

          <EditButton />
          <DeleteButton />
        </Datagrid>
      )}
    </List>
  );
};

const AddressDetails = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <div className="p-4 m-2 bg-white rounded-md shadow-sm border border-gray-200">
      <div className="grid gap-2">
        <Labeled label="Rue">
          <TextField source="address_street" />
        </Labeled>
        <Labeled label="Ville">
          <TextField source="address_city" />
        </Labeled>
        <Labeled label="Code Postal">
          <TextField source="address_post_code" />
        </Labeled>
        <Labeled label="Pays">
          <TextField source="address_country" />
        </Labeled>
        <Labeled label="Type">
          <TextField source="address_type" />
        </Labeled>
        <Labeled label="Téléphone">
          <TextField source="phone_number" />
        </Labeled>
      </div>
    </div>
  );
};

const UserExpanded = () => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <div className="m-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Détails supplémentaires
      </h3>
      <div className="grid gap-6">
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-3">Adresses</h4>
          <ArrayField source="addresses">
            <SingleFieldList>
              <AddressDetails />
            </SingleFieldList>
          </ArrayField>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-3">Scores</h4>
          <div className="p-4 bg-white rounded-md shadow-sm border border-gray-200">
            <ArrayField source="scores">
              <SingleFieldList>
                <NumberField
                  source="score_value"
                  options={{ maximumFractionDigits: 2 }}
                />
              </SingleFieldList>
            </ArrayField>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-3">
            Réservations
          </h4>
          <div className="p-4 bg-white rounded-md shadow-sm border border-gray-200">
            <ArrayField source="bookings">
              <SingleFieldList>
                <ChipField source="booking_date" />
              </SingleFieldList>
            </ArrayField>
          </div>
        </div>
      </div>
    </div>
  );
};
