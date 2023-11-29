import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./styles/ExamingToday.module.scss";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/axios";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";
import io from "socket.io-client";
const socket = io("https://clinicsystem.io.vn");

const ExamingToday = () => {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    console.log("socket id khi mới vào bên booking: ", socket.id);
    socket.emit("login", { account_id: localStorage.getItem("account_id") });
    console.log("Login sucess");

    socket.on("server-confirm-check-in", (data) => {
      console.log("Data trả về: ", data);
      fetchData();
    });
  }, []);

  // useEffect(() => {
  //   const today = new Date();
  //   const nextFourDays = [];

  //   for (let i = 0; i < 5; i++) {
  //     const nextDay = new Date();
  //     nextDay.setDate(today.getDate() + i);
  //     const year = nextDay.getFullYear();
  //     const month = String(nextDay.getMonth() + 1).padStart(2, "0");
  //     const day = String(nextDay.getDate()).padStart(2, "0");
  //     const formattedDate = `${year}-${month}-${day}`;
  //     nextFourDays.push(formattedDate);
  //   }
  //   // Set selectedDate to the first date in the array when component mounts
  //   if (nextFourDays.length > 0) {
  //     setSelectedDate(nextFourDays[0]);
  //   }
  //   setDates(nextFourDays);
  // }, []);

  // const handleDateClick = (date) => {
  //   const clickedDate = new Date(date);
  //   const year = clickedDate.getFullYear();
  //   const month = String(clickedDate.getMonth() + 1).padStart(2, "0");
  //   const day = String(clickedDate.getDate()).padStart(2, "0");
  //   const formattedDate = `${year}-${month}-${day}`;
  //   setSelectedDate(formattedDate);
  // };

  // const formatDateForDisplay = (date) => {
  //   const [yyyy, mm, dd] = date.split("-");
  //   return `${dd}/${mm}`;
  // };

  const handleChangeStatusBooking = async (item) => {
    try {
      const response = await api.put(`/booking/${item.booking_id}`, {
        status: "on_going",
      });
      if (response) {
        socket.emit("start-exam", {
          customer_id: item.account_id,
        });
      }
      console.log("response doi status ne", response.data);
      navigate(`/examing/${item.booking_id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await api.get(`/booking?arrival_date=${selectedDate}`);
      console.log("api ne:", response.data.data);

      const accountId = localStorage.getItem("account_id");
      let vetCustomers = response.data.data.filter(
        (booking) =>
          booking.veterinarian_id === accountId &&
          booking.status !== "pending" &&
          booking.status !== "booked" &&
          booking.status !== "test_requested" &&
          booking.service_type_id === "ST001" &&
          booking.money_has_paid !== "0.00"
      );
      console.log("vet customer ne", vetCustomers);

      vetCustomers = vetCustomers.filter(
        (booking) => booking.checkin_time !== null
      );

      vetCustomers.sort((a, b) => {
        if (a.checkin_time && b.checkin_time) {
          const timeA = a.checkin_time.split(":").map(Number);
          const timeB = b.checkin_time.split(":").map(Number);

          // So sánh giờ
          if (timeA[0] !== timeB[0]) {
            return timeA[0] - timeB[0];
          }

          // Nếu giờ bằng nhau, so sánh phút
          return timeA[1] - timeB[1];
        }
        return 0;
      });

      setCustomerList(vetCustomers);
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
        <div className={styles.left}>
          <h3>DANH SÁCH KHÁM HÔM NAY</h3>
        </div>
        {/* <div className={styles.middle}>
          {dates.map((item, index) => (
            <span
              key={index}
              className={item === selectedDate ? styles.active : ""}
              onClick={() => handleDateClick(item)}
            >
              {formatDateForDisplay(item)}
            </span>
          ))}
        </div> */}
        <div className={styles.right}>
          <div className={styles.btnSearch}>
            <SearchOutlined />
          </div>
          <input type="text" placeholder="Tìm kiếm khách hàng" name="search" />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th> STT</th>
            <th> Khách hàng</th>
            <th> Chim</th>
            <th> Số điện thoại</th>
            <th> Giờ đặt</th>
            <th> Giờ checkin</th>
            <th> Bác sĩ phụ trách</th>
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

          {!loading &&
            customerList.map((item, index) => (
              <tr key={index}>
                <td> {index + 1} </td>
                <td>{item.customer_name}</td>
                <td>{item.bird.name}</td>
                <td>{item.bird.customer.phone}</td>
                <td>{item.estimate_time}</td>
                <td>{item.checkin_time}</td>
                <td>
                  <strong>Phạm Ngọc Long</strong>
                </td>
                <td>
                  <p
                    className={`${styles.status} ${
                      item.status === "checked_in" ||
                      item.status === "checked_in_after_test"
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
                      : item.status === "checked_in_after_test"
                      ? "Có kết quả"
                      : "Chưa checkin"}
                  </p>
                </td>
                <td>
                  <div
                    className={styles.btnExam}
                    onClick={() => handleChangeStatusBooking(item)}
                  >
                    Khám
                  </div>
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

export default ExamingToday;
