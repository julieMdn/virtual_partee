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
  console.log("Données de l'adresse individuelle:", record);

  return (
    <div className="p-4 m-2 bg-white rounded-md shadow-sm border border-gray-200">
      <div className="grid gap-2">
        <div className="flex items-center">
          <span className="font-medium text-gray-600 w-24">Rue :</span>
          <ChipField
            source="address_street"
            className="bg-blue-50 text-blue-700"
          />
        </div>
        <div className="flex items-center">
          <span className="font-medium text-gray-600 w-24">Ville :</span>
          <ChipField
            source="address_city"
            className="bg-blue-50 text-blue-700"
          />
        </div>
        <div className="flex items-center">
          <span className="font-medium text-gray-600 w-24">Code Postal :</span>
          <TextField
            source="address_post_code"
            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
          />
        </div>
        <div className="flex items-center">
          <span className="font-medium text-gray-600 w-24">Pays :</span>
          <ChipField
            source="address_country"
            className="bg-blue-50 text-blue-700"
          />
        </div>
        <div className="flex items-center">
          <span className="font-medium text-gray-600 w-24">Type :</span>
          <ChipField
            source="address_type"
            className="bg-blue-50 text-blue-700"
          />
        </div>
        <div className="flex items-center">
          <span className="font-medium text-gray-600 w-24">Téléphone :</span>
          <ChipField
            source="phone_number"
            className="bg-blue-50 text-blue-700"
          />
        </div>
      </div>
    </div>
  );
};

const UserExpanded = () => {
  const record = useRecordContext();
  console.log("Données complètes:", record);

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
                  className="text-gray-800"
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
                <ChipField
                  source="booking_date"
                  className="bg-green-50 text-green-700"
                />
              </SingleFieldList>
            </ArrayField>
          </div>
        </div>
      </div>
    </div>
  );
};
