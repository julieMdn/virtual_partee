"use client";

import { Admin, Resource, ListGuesser, EditGuesser } from "react-admin";
import { dataProvider } from "ra-data-simple-prisma";

const adminDataProvider = dataProvider("/api");

const AdminApp = () => {
  return (
    <Admin dataProvider={adminDataProvider}>
      <Resource
        name="User"
        list={ListGuesser}
        edit={EditGuesser}
        recordRepresentation="user_name"
      />
      <Resource
        name="Address"
        list={ListGuesser}
        edit={EditGuesser}
        recordRepresentation="address_street"
      />
      <Resource
        name="Offer"
        list={ListGuesser}
        edit={EditGuesser}
        recordRepresentation="offer_title"
      />
      <Resource name="TimeSlot" list={ListGuesser} edit={EditGuesser} />
      <Resource name="Booking" list={ListGuesser} edit={EditGuesser} />
      <Resource name="Payment" list={ListGuesser} edit={EditGuesser} />
      <Resource name="Score" list={ListGuesser} edit={EditGuesser} />
      <Resource
        name="Course"
        list={ListGuesser}
        edit={EditGuesser}
        recordRepresentation="course_title"
      />
    </Admin>
  );
};

export default AdminApp;
