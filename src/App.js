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
import CreateAppoinment from "./pages/staff/CreateAppoinment";
import HistoryGrooming from "./pages/staff/grooming/HistoryGrooming";
import ScheduleGrooming from "./pages/staff/grooming/ScheduleGrooming";
import BillingBoardingDetail from "./pages/staff/BillingBoardingDetail";
import DoneDetail from "./pages/doctor/healthcheck/DoneDetail";
import ResultTesting from "./pages/doctor/healthcheck/ResultTesting";
import ScheduleBoarding from "./pages/staff/boarding/ScheduleBoarding";
import HistoryBoarding from "./pages/staff/boarding/HistoryBoarding";


import {
  BsCalendar2RangeFill,
  BsCalendar2CheckFill,
  BsCalendar2PlusFill,
  BsCreditCard2BackFill,
  BsFillPlusSquareFill,



} from "react-icons/bs";
import {ConfigProvider} from 'antd';

const listTabsStaff = [
  {
    id: 1,
    name: "Theo dõi lịch hẹn",
    icon: BsCalendar2RangeFill,
    to: "/track",
  },
  {
    id: 2,
    name: "Checkin",
    icon: BsCalendar2CheckFill,
    to: "/checkin",
  },
  {
    id: 3,
    name: "Chờ phê duyệt",
    icon: BsCalendar2PlusFill,
    to: "/approve",
  },
  {
    id: 4,
    name: "Thanh toán",
    icon: BsCreditCard2BackFill,
    to: "/billing",
  },
  {
    id: 5,
    name: "Tạo cuộc hẹn",
    icon: BsFillPlusSquareFill,
    to: "/create",
  },
];
const listTabsHealthCheck = [
  {
    id: 1,
    name: "Khám hôm nay",
    icon: BsFillPlusSquareFill,
    to: "/examing",
  },
  {
    id: 2,
    name: "Chờ kết quả",
    icon: BsFillPlusSquareFill,
    to: "/wait-result",
  },
  {
    id: 3,
    name: "Lịch hẹn",
    icon: BsFillPlusSquareFill,
    to: "/schedule",
  },
  {
    id: 4,
    name: "Đã khám",
    icon: BsFillPlusSquareFill,
    to: "/done",
  },
];

const listTabsReTesting = [
  {
    id: 1,
    name: "Chờ xét nghiệm",
    icon: BsFillPlusSquareFill,
    to: "/retesting",
  },
  {
    id: 2,
    name: "Trả kết quả",
    icon: BsFillPlusSquareFill,
    to: "/result",
  },
  {
    id: 4,
    name: "Đã khám",
    icon: BsFillPlusSquareFill,
    to: "/done-retesting",
  },
];

const listTabsGrooming = [
  {
    id: 1,
    name: "Khám hôm nay",
    icon: BsFillPlusSquareFill,
    to: "/grooming",
  },
  {
    id: 2,
    name: "Lịch hẹn",
    icon: BsFillPlusSquareFill,
    to: "/schedule-grooming",
  },
  {
    id: 3,
    name: "Lịch sử tiếp nhận",
    icon: BsFillPlusSquareFill,
    to: "/history-grooming",
  },
];

const listTabsBoarding = [
  {
    id: 1,
    name: "Khám hôm nay",
    icon: BsFillPlusSquareFill,
    to: "/boarding",
  },
  {
    id: 2,
    name: "Lịch hẹn",
    icon: BsFillPlusSquareFill,
    to: "/schedule-boarding",
  },
  {
    id: 3,
    name: "Quản lý và Báo cáo",
    icon: BsFillPlusSquareFill,
    to: "/manage-report",
  },
  {
    id: 4,
    name: "Lịch sử tiếp nhận",
    icon: BsFillPlusSquareFill,
    to: "/history-boarding",
  },
];

function App() {
  return (
  <ConfigProvider
    theme={{
      token: {
        // Seed Token
        colorPrimary: '#32B768',
        fontFamily: "Inter",
        fontSize: 15,
        // Alias Token
        colorBgContainer: '#ffffff',
      },
    }}
  >
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
          path="/billing-boarding/:id"
          element={
            <MainLayout listTabs={listTabsStaff}>
              <BillingBoardingDetail></BillingBoardingDetail>
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
        <Route
          path="/create"
          element={
            <MainLayout listTabs={listTabsStaff}>
              <CreateAppoinment></CreateAppoinment>
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
        <Route
          path="/done/:bookingId"
          element={
            <MainLayout listTabs={listTabsHealthCheck}>
              <DoneDetail></DoneDetail>
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
        <Route
          path="/schedule-retesting"
          element={
            <MainLayout listTabs={listTabsReTesting}>
              <ResultTesting></ResultTesting>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/done-retesting"
          element={
            <MainLayout listTabs={listTabsReTesting}>
              <ResultTesting></ResultTesting>
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
        <Route
          path="/schedule-boarding"
          element={
            <MainLayout listTabs={listTabsBoarding}>
              <ScheduleBoarding></ScheduleBoarding>
            </MainLayout>
          }
        ></Route>
        <Route
          path="/history-boarding"
          element={
            <MainLayout listTabs={listTabsBoarding}>
              <HistoryBoarding></HistoryBoarding>
            </MainLayout>
          }
        ></Route>
      </Routes>
    </Fragment>
  </ConfigProvider>
  );
}

export default App;
