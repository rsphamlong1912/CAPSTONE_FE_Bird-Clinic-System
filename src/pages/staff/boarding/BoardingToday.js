import React, { useEffect, useState } from "react";
import { BsCalendar2 } from "react-icons/bs";
import styles from "./BoardingToday.module.scss";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/axios";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";
import { Modal } from 'antd';
import io from "socket.io-client";
const socket = io("https://clinicsystem.io.vn");

const BoardingToday = () => {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [modalOngoing, setModalOngoing] = useState("");

  useEffect(() => {
    console.log("socket id khi mới vào bên booking: ", socket.id);
    socket.emit("login", { account_id: localStorage.getItem("account_id") });
    console.log("Login sucess");

    socket.on("server-confirm-check-in", (data) => {
      console.log("Data trả về: ", data);
      fetchData();
    });
  }, []);

  useEffect(() => {
    const today = new Date();
    const nextFourDays = [];

    for (let i = 0; i < 5; i++) {
      const nextDay = new Date();
      nextDay.setDate(today.getDate() + i);
      const year = nextDay.getFullYear();
      const month = String(nextDay.getMonth() + 1).padStart(2, "0");
      const day = String(nextDay.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      nextFourDays.push(formattedDate);
    }
    // Set selectedDate to the first date in the array when component mounts
    if (nextFourDays.length > 0) {
      setSelectedDate(nextFourDays[0]);
    }
    setDates(nextFourDays);
  }, []);

  const handleDateClick = (date) => {
    const clickedDate = new Date(date);
    const year = clickedDate.getFullYear();
    const month = String(clickedDate.getMonth() + 1).padStart(2, "0");
    const day = String(clickedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setSelectedDate(formattedDate);
    console.log("se,", selectedDate);
  };

  const formatDateForDisplay = (date) => {
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}/${mm}`;
  };

  const handleChangeStatusBooking = async (item) => {
    try {
      const response = await api.put(`/booking/${item.booking_id}`, {
        status: "on_going",
      });
      console.log("response doi status ne", response.data);
      navigate(`/boarding/${item.booking_id}`);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await api.get(`/booking?arrival_date=${selectedDate}`);
      console.log("api ne:", response.data.data);

      const accountId = localStorage.getItem("account_id");
      const vetCustomers = response.data.data.filter(
        (booking) =>
          (booking.veterinarian_id === accountId && (booking.status === "checked_in" || (booking.status === "on_going" && booking.boarding.cage_id === null)) )
          //   ||
          // (booking.status === "on_going" && booking.service_type_id === "ST003")
      );

      vetCustomers.sort((a, b) => {
        const timeA = a.checkin_time.split(":").map(Number);
        const timeB = b.checkin_time.split(":").map(Number);

        // Compare hours
        if (timeA[0] !== timeB[0]) {
          return timeA[0] - timeB[0];
        }

        // If hours are the same, compare minutes
        return timeA[1] - timeB[1];
      });

      setCustomerList(vetCustomers);
      console.log("Updated customerList:", vetCustomers);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 850);
    fetchData();
  }, [selectedDate]);
  return (
    <div className={styles.container}>
      <div className={styles.headerContent}>
        <div style={{ marginRight: "auto" }}>
          <h1 className={styles.headerTitle}>DANH SÁCH TIẾP NHẬN HÔM NAY</h1>
        </div>
        <div style={{ width: "30%" }}>
          {/* <Search size="large" placeholder="Tìm kiếm lịch hẹn..." enterButton /> */}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th> STT</th>
            <th> Khách hàng</th>
            <th> Số điện thoại</th>
            <th> Chim</th>
            <th> Giờ đặt</th>
            <th> Giờ checkin</th>
            <th> Trạng thái</th>
            <th> Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <>
              <Loading></Loading>
              <Loading></Loading>
              <Loading></Loading>
              <Loading></Loading>
              <Loading></Loading>
              <Loading></Loading>
              <Loading></Loading>
            </>
          )}
           {!loading && customerList.length === 0 && (
            <tr className={styles.NoGroomingDetial}>
              <td colSpan="10">
                <div className={styles.emptyContentCenter}>
                  <BsCalendar2 size={50} className={styles.iconEmpty} />
                  <h3 className={styles.txtNoGrooming}>
                    Không có lịch khám nào cho hôm nay.
                  </h3>
                </div>
              </td>
            </tr>
          )}

          {!loading &&
            customerList.map((item, index) => (
              <tr key={index}>
                <td> {index + 1} </td>
                <td>{item.customer_name}</td>
                <td>{item.bird.customer.phone}</td>
                <td>{item.bird.name}</td>
                <td>{item.estimate_time}</td>
                <td>{item.checkin_time}</td>
                <td>
                  <p
                    className={`${styles.status} ${
                      item.status === "checked_in"
                        ? styles.checkin
                        : item.status === "on_going" ||
                          item.status === "test_requested"
                        ? styles.being
                        : styles.booked
                    } `}
                  >
                    {item.status === "checked_in"
                      ? "Đã checkin"
                      : item.status === "on_going"
                      ? "Đang khám"
                      : item.status === "test_requested"
                      ? "Chờ xét nghiệm"
                      : "Chưa checkin"}
                  </p>
                </td>
                <td>
                  {/* <div
                    className={styles.btnExam}
                    onClick={() => handleChangeStatusBooking(item)}
                  >
                    Tiếp nhận
                  </div> */}
                  {item.status !== "on_going" ? (
                    <div
                      className={styles.btnExam}
                      onClick={() => setModalOngoing(true)}
                    >
                      Tiếp nhận
                    </div>
                  ) : (
                    <div
                      className={styles.btnExam}
                      style={{backgroundColor: 'rgba(0, 178, 255, 1)'}}
                      onClick={() => navigate(`/boarding/${item.booking_id}`)}
                    >
                      Tiếp tục
                    </div>
                  )}
                  <Modal
                    title="Xác nhận"
                    centered
                    open={modalOngoing}
                    onOk={() => handleChangeStatusBooking(item)}
                    onCancel={() => setModalOngoing(false)}
                  >
                    <span>
                      Tiếp nhận nội trú cho chim {item.bird.name} của khách hàng{" "}
                      {item.customer_name} ?
                    </span>
                  </Modal>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className={styles.numResult}>
        <div className="number-result">
          {!loading && customerList.length} kết quả
        </div>
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <tr>
      <td>
        <LoadingSkeleton></LoadingSkeleton>
      </td>
      <td>
        <LoadingSkeleton></LoadingSkeleton>
      </td>
      <td>
        <LoadingSkeleton></LoadingSkeleton>
      </td>
      <td>
        <LoadingSkeleton></LoadingSkeleton>
      </td>
      <td>
        <LoadingSkeleton></LoadingSkeleton>
      </td>
      <td>
        <LoadingSkeleton></LoadingSkeleton>
      </td>
      <td>
        <strong>
          <LoadingSkeleton></LoadingSkeleton>
        </strong>
      </td>
      <td>
        <div className="status being">
          <LoadingSkeleton></LoadingSkeleton>
        </div>
      </td>
    </tr>
  );
};

export default BoardingToday;
