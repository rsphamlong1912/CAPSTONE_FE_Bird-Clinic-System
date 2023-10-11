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
import Signin from "./pages/Signin";
import Division from "./pages/staff/Division";
import CreateAppoinment from "./pages/staff/CreateAppoinment";
import GroomingToday from "./pages/staff/grooming/GroomingToday";
import Grooming from "./pages/staff/grooming/Grooming";

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
  {
    id: 3,
    name: "Phân công",
    to: "/division",
  },
  {
    id: 4,
    name: "Tạo cuộc hẹn",
    to: "/create-appoinment",
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

const listTabsGrooming = [
  {
    id: 1,
    name: "Khám hôm nay",
    to: "/grooming-today",
  },
  {
    id: 2,
    name: "Lịch hẹn",
    to: "/schedule",
  },
  {
    id: 3,
    name: "Lịch sử tiếp nhận",
    to: "/history-grooming",
  },
];

function App() {
  return (
    <Fragment>
      <Routes>
        {/* STAFF  */}
        <Route
          path="/"
          element={
            <MainLayout listTabs={listTabsStaff}>
              <TrackAppoinments></TrackAppoinments>
            </MainLayout>
          }
        ></Route>
        <Route path="/signin" element={<Signin></Signin>}></Route>
        <Route
          path="/checkin"
          element={
            <MainLayout listTabs={listTabsStaff}>
              <Checkin></Checkin>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/division"
          element={
            <MainLayout listTabs={listTabsStaff}>
              <Division></Division>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/create-appoinment"
          element={
            <MainLayout listTabs={listTabsStaff}>
              <CreateAppoinment></CreateAppoinment>
            </MainLayout>
          }
        ></Route>
        {/* HEALTH CHECK  */}
        <Route
          path="/examination"
          element={
            <MainLayout listTabs={listTabsHealthCheck}>
              <ExaminationToday></ExaminationToday>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/examination/:id"
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
        {/* GROOMING  */}
        <Route
          path="/grooming"
          element={
            <MainLayout listTabs={listTabsGrooming}>
              <GroomingToday></GroomingToday>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/grooming/:id"
          element={
            <MainLayout listTabs={listTabsGrooming}>
              <Grooming></Grooming>
            </MainLayout>
          }
        ></Route>
      </Routes>
    </Fragment>
  );
}

export default App;
