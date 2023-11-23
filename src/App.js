import { Fragment } from "react";
import "./App.css";
import MainLayout from "./layouts/MainLayout/MainLayout";
import { Route, Routes } from "react-router-dom";
import Checkin from "./pages/staff/Checkin";
import TrackAppoinments from "./pages/staff/TrackAppoinments";
import ExamingToday from "./pages/doctor/healthcheck/ExamingToday";
import WaitingResult from "./pages/doctor/healthcheck/WaitingResult";
import AppointmentSchedule from "./pages/doctor/healthcheck/AppointmentSchedule";
import DoneExamination from "./pages/doctor/healthcheck/DoneExamination";
import Examing from "./pages/doctor/healthcheck/Examing";
import Signin from "./pages/Signin";
import GroomingToday from "./pages/staff/grooming/GroomingToday";
import Grooming from "./pages/staff/grooming/Grooming";
import BoardingToday from "./pages/staff/boarding/BoardingToday";
import Boarding from "./pages/staff/boarding/Boarding";
import ManageAndReport from "./pages/staff/boarding/ManageAndReport";
import Report from "./pages/staff/boarding/Report";
import ReTestingToday from "./pages/doctor/healthcheck/ReTestingToday";
import ReTesting from "./pages/doctor/healthcheck/ReTesting";
import PendingBooking from "./pages/staff/PendingBooking";
import Billing from "./pages/staff/Billing";
import BillingHistory from "./pages/staff/BillingHistory";
import TrackDetail from "./pages/staff/TrackDetail";
import BillingDetail from "./pages/staff/BillingDetail";
import ResultToday from "./pages/doctor/healthcheck/ResultToday";
import Result from "./pages/doctor/healthcheck/Result";
import HistoryGrooming from "./pages/staff/grooming/HistoryGrooming";
import ScheduleGrooming from "./pages/staff/grooming/ScheduleGrooming";

const listTabsStaff = [
  {
    id: 1,
    name: "Theo dõi lịch khám",
    to: "/track",
  },
  {
    id: 2,
    name: "Checkin",
    to: "/checkin",
  },
  {
    id: 3,
    name: "Duyệt hẹn",
    to: "/approve",
  },
  {
    id: 4,
    name: "Thanh toán",
    to: "/billing",
  },
  // {
  //   id: 5,
  //   name: "Đã thanh toán",
  //   to: "/billing-history",
  // },
];
const listTabsHealthCheck = [
  {
    id: 1,
    name: "Khám hôm nay",
    to: "/examing",
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

const listTabsReTesting = [
  {
    id: 1,
    name: "Chờ xét nghiệm",
    to: "/retesting",
  },
  {
    id: 2,
    name: "Trả kết quả",
    to: "/result",
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
    to: "/grooming",
  },
  {
    id: 2,
    name: "Lịch hẹn",
    to: "/schedule-grooming",
  },
  {
    id: 3,
    name: "Lịch sử tiếp nhận",
    to: "/history-grooming",
  },
];

const listTabsBoarding = [
  {
    id: 1,
    name: "Khám hôm nay",
    to: "/boarding",
  },
  {
    id: 2,
    name: "Lịch hẹn",
    to: "/schedule",
  },
  {
    id: 3,
    name: "Quản lý và Báo cáo",
    to: "/manage-report",
  },
  {
    id: 4,
    name: "Lịch sử tiếp nhận",
    to: "/history-boarding",
  },
];

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Signin></Signin>}></Route>
        {/* STAFF  */}
        <Route
          path="/track"
          element={
            <MainLayout listTabs={listTabsStaff}>
              <TrackAppoinments></TrackAppoinments>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/track/:bookingId"
          element={
            <MainLayout listTabs={listTabsStaff}>
              <TrackDetail></TrackDetail>
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
          path="/approve"
          element={
            <MainLayout listTabs={listTabsStaff}>
              <PendingBooking></PendingBooking>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/billing"
          element={
            <MainLayout listTabs={listTabsStaff}>
              <Billing></Billing>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/billing/:id"
          element={
            <MainLayout listTabs={listTabsStaff}>
              <BillingDetail></BillingDetail>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/billing-history"
          element={
            <MainLayout listTabs={listTabsStaff}>
              <BillingHistory></BillingHistory>
            </MainLayout>
          }
        ></Route>
        {/* HEALTH CHECK  */}
        {/* MAIN DOCTOR */}
        <Route
          path="/examing"
          element={
            <MainLayout listTabs={listTabsHealthCheck}>
              <ExamingToday></ExamingToday>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/examing/:bookingId"
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
        {/* SIDE DOCTOR  */}
        <Route
          path="/retesting"
          element={
            <MainLayout listTabs={listTabsReTesting}>
              <ReTestingToday></ReTestingToday>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/retesting/:serviceFormDetailId"
          element={
            <MainLayout listTabs={listTabsReTesting}>
              <ReTesting></ReTesting>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/result/"
          element={
            <MainLayout listTabs={listTabsReTesting}>
              <ResultToday></ResultToday>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/result/:serviceFormDetailId"
          element={
            <MainLayout listTabs={listTabsReTesting}>
              <Result></Result>
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
          path="/grooming/:bookingId"
          element={
            <MainLayout listTabs={listTabsGrooming}>
              <Grooming></Grooming>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/schedule-grooming"
          element={
            <MainLayout listTabs={listTabsGrooming}>
              <ScheduleGrooming></ScheduleGrooming>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/history-grooming"
          element={
            <MainLayout listTabs={listTabsGrooming}>
              <HistoryGrooming></HistoryGrooming>
            </MainLayout>
          }
        ></Route>
        {/* BOARDING  */}
        <Route
          path="/boarding"
          element={
            <MainLayout listTabs={listTabsBoarding}>
              <BoardingToday></BoardingToday>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/boarding/:bookingId"
          element={
            <MainLayout listTabs={listTabsBoarding}>
              <Boarding></Boarding>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/manage-report"
          element={
            <MainLayout listTabs={listTabsBoarding}>
              <ManageAndReport></ManageAndReport>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/manage-report/:boarding_id"
          element={
            <MainLayout listTabs={listTabsBoarding}>
              <Report></Report>
            </MainLayout>
          }
        ></Route>
      </Routes>
    </Fragment>
  );
}

export default App;
