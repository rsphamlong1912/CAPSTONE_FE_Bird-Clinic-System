import { Fragment } from "react";
import "./App.css";
import MainLayout from "./layouts/MainLayout/MainLayout";
import CheckinHealthCheck from "./pages/staff/healthcheck/CheckinHealthCheck";
import { Route, Routes } from "react-router-dom";
import TrackAppoinments from "./pages/staff/healthcheck/TrackAppoinments";

const listTabs = [
  {
    id: 1,
    name: "Theo dõi lịch khám",
    to: "/",
  },
  {
    id: 2,
    name: "Checkin",
    to: "/checkin",
  },
];

function App() {
  return (
    <Fragment>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout listTabs={listTabs}>
              <TrackAppoinments></TrackAppoinments>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/checkin"
          element={
            <MainLayout listTabs={listTabs}>
              <CheckinHealthCheck></CheckinHealthCheck>
            </MainLayout>
          }
        ></Route>
      </Routes>
    </Fragment>
  );
}

export default App;
