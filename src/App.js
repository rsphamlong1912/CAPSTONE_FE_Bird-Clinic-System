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
import ResultTestingDetail from "./pages/doctor/healthcheck/ResultTestingDetail";
import WarningRole from "./pages/WarningRole";

import {
  BsCalendar2RangeFill,
  BsCalendar2CheckFill,
  BsCalendar2PlusFill,
  BsCreditCard2BackFill,
  BsFillPlusSquareFill,
} from "react-icons/bs";
import { ConfigProvider } from "antd";

// Hàm kiểm tra vai trò từ localStorage
const getRoleFromLocalStorage = () => {
  return localStorage.getItem("role"); // Giả sử 'role' chứa vai trò khi đăng nhập
};

// Kiểm tra xem người dùng có quyền truy cập vào route không
const isAuthorized = (allowedRoles, userRole) => {
  return allowedRoles.includes(userRole);
};

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
          colorPrimary: "#32B768",
          fontFamily: "Inter",
          fontSize: 15,
          // Alias Token
          colorBgContainer: "#ffffff",
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
              isAuthorized(["staff"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsStaff}>
                  <TrackAppoinments></TrackAppoinments>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/track/:bookingId"
            element={
              isAuthorized(["staff"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsStaff}>
                  <TrackDetail></TrackDetail>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/checkin"
            element={
              isAuthorized(["staff"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsStaff}>
                  <Checkin></Checkin>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/approve"
            element={
              isAuthorized(["staff"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsStaff}>
                  <PendingBooking></PendingBooking>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/billing"
            element={
              isAuthorized(["staff"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsStaff}>
                  <Billing></Billing>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/billing/:id"
            element={
              isAuthorized(["staff"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsStaff}>
                  <BillingDetail></BillingDetail>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/billing-boarding/:id"
            element={
              isAuthorized(["staff"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsStaff}>
                  <BillingBoardingDetail></BillingBoardingDetail>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/billing-history"
            element={
              isAuthorized(["staff"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsStaff}>
                  <BillingHistory></BillingHistory>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/create"
            element={
              isAuthorized(["staff"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsStaff}>
                  <CreateAppoinment></CreateAppoinment>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          {/* HEALTH CHECK  */}
          {/* MAIN DOCTOR */}
          <Route
            path="/examing"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsHealthCheck}>
                  <ExamingToday></ExamingToday>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/examing/:bookingId"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsHealthCheck}>
                  <Examing></Examing>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/wait-result"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsHealthCheck}>
                  <WaitingResult></WaitingResult>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/schedule"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsHealthCheck}>
                  <AppointmentSchedule></AppointmentSchedule>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/done"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsHealthCheck}>
                  <DoneExamination></DoneExamination>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/done/:bookingId"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsHealthCheck}>
                  <DoneDetail></DoneDetail>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          {/* SIDE DOCTOR  */}
          <Route
            path="/retesting"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsReTesting}>
                  <ReTestingToday></ReTestingToday>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/retesting/:serviceFormDetailId"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsReTesting}>
                  <ReTesting></ReTesting>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/result/"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsReTesting}>
                  <ResultToday></ResultToday>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/result/:serviceFormDetailId"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsReTesting}>
                  <Result></Result>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/schedule-retesting"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsReTesting}>
                  <ResultTesting></ResultTesting>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/done-retesting"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsReTesting}>
                  <ResultTesting></ResultTesting>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/done-retesting/:serviceFormDetailId"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsReTesting}>
                  <ResultTestingDetail></ResultTestingDetail>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          {/* GROOMING  */}
          <Route
            path="/grooming"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsGrooming}>
                  <GroomingToday></GroomingToday>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/grooming/:bookingId"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsGrooming}>
                  <Grooming></Grooming>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/schedule-grooming"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsGrooming}>
                  <ScheduleGrooming></ScheduleGrooming>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/history-grooming"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsGrooming}>
                  <HistoryGrooming></HistoryGrooming>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          {/* BOARDING  */}
          <Route
            path="/boarding"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsBoarding}>
                  <BoardingToday></BoardingToday>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/boarding/:bookingId"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsBoarding}>
                  <Boarding></Boarding>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/manage-report"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsBoarding}>
                  <ManageAndReport></ManageAndReport>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/manage-report/:boarding_id"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsBoarding}>
                  <Report></Report>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/schedule-boarding"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsBoarding}>
                  <ScheduleBoarding></ScheduleBoarding>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route
            path="/history-boarding"
            element={
              isAuthorized(["vet"], getRoleFromLocalStorage()) ? (
                <MainLayout listTabs={listTabsBoarding}>
                  <HistoryBoarding></HistoryBoarding>
                </MainLayout>
              ) : (
                <WarningRole></WarningRole>
              )
            }
          ></Route>
          <Route path="*" element={<WarningRole />} />
        </Routes>
      </Fragment>
    </ConfigProvider>
  );
}

export default App;
