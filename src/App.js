import { Fragment } from "react";
import "./App.css";
import MainLayout from "./layouts/MainLayout/MainLayout";
import { Route, Routes } from "react-router-dom";
import Checkin from "./pages/staff/Checkin";
import TrackAppoinments from "./pages/staff/TrackAppoinments";
import ExaminationToday from "./pages/doctor/healthcheck/ExaminationToday";
import WaitingResult from "./pages/doctor/healthcheck/WaitingResult";
import AppointmentSchedule from "./pages/doctor/healthcheck/AppointmentSchedule";
import DoneExamination from "./pages/doctor/healthcheck/DoneExamination";
import Examing from "./pages/doctor/healthcheck/Examing";

const listTabsStaff = [
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
const listTabsHealthCheck = [
  {
    id: 1,
    name: "Khám hôm nay",
    to: "/examination",
  },
  {
    id: 2,
    name: "Chờ kết quả",
    to: "/wait-result",
  },
  {
    id: 3,
    name: "Lịch hẹn",
    to: "/schedule",
  },
  {
    id: 4,
    name: "Đã khám",
    to: "/done",
  },
];

function App() {
  return (
    <Fragment>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout listTabs={listTabsStaff}>
              <TrackAppoinments></TrackAppoinments>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/checkin"
          element={
            <MainLayout listTabs={listTabsStaff}>
              <Checkin></Checkin>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/examination"
          element={
            <MainLayout listTabs={listTabsHealthCheck}>
              <ExaminationToday></ExaminationToday>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/examing"
          element={
            <MainLayout listTabs={listTabsHealthCheck}>
              <Examing></Examing>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/wait-result"
          element={
            <MainLayout listTabs={listTabsHealthCheck}>
              <WaitingResult></WaitingResult>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/schedule"
          element={
            <MainLayout listTabs={listTabsHealthCheck}>
              <AppointmentSchedule></AppointmentSchedule>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/done"
          element={
            <MainLayout listTabs={listTabsHealthCheck}>
              <DoneExamination></DoneExamination>
            </MainLayout>
          }
        ></Route>
      </Routes>
    </Fragment>
  );
}

export default App;
