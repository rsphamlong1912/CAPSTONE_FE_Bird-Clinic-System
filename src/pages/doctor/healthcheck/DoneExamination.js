import React, { useEffect, useState } from "react";
import { BsCalendar2 } from "react-icons/bs";
import styles from "./DoneExamination.module.scss";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/axios";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";
import { Input } from 'antd';
// import io from "socket.io-client";
// const socket = io("https://clinicsystem.io.vn");
const { Search } = Input;

const DoneExamination = () => {
  const today = new Date();
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [dates, setDates] = useState([]);

  // useEffect(() => {
  //   console.log("socket id khi mới vào bên booking: ", socket.id);
  //   socket.emit("login", { account_id: localStorage.getItem("account_id") });
  //   console.log("Login sucess");

  //   socket.on("server-confirm-check-in", (data) => {
  //     console.log("Data trả về: ", data);
  //     fetchData();
  //   });
  // }, []);

  const [visibleDates, setVisibleDates] = useState([]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (date) => {
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}/${mm}`;
  };
  const [selectedDate, setSelectedDate] = useState(formatDate(today));

  useEffect(() => {
    const dateList = [];
    const daysToShow = 30;

    for (let i = -daysToShow; i <= daysToShow; i++) {
      const currentDate = new Date();
      currentDate.setDate(today.getDate() + i);
      dateList.push(formatDate(currentDate));
    }

    setDates(dateList);
    const visibleIndex = dateList.indexOf(formatDate(today));
    setVisibleDates(dateList.slice(visibleIndex - 3, visibleIndex + 4));
  }, []);

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
          booking.service_type_id === "ST001"
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
    console.log(selectedDate);
    fetchData();
  }, [selectedDate]);

  const handlePrevDates = () => {
    const currentIndex = dates.indexOf(visibleDates[0]);
    const prevDates = dates.slice(currentIndex - 1, currentIndex + 6);
    setVisibleDates(prevDates);
    setSelectedDate(prevDates[3]);
  };

  const handleNextDates = () => {
    const currentIndex = dates.indexOf(visibleDates[0]);
    const nextDates = dates.slice(currentIndex + 1, currentIndex + 8);
    setVisibleDates(nextDates);
    setSelectedDate(nextDates[3]);
  };

  return (
    <div className={styles.container}>
            <div className={styles.btnSearch}>
           <div style={{ marginRight: 'auto' }}>
           <h1 className={styles.headerTitle}>LỊCH SỬ KHÁM BỆNH</h1>
          </div>
          <div style={{width: "30%"}}>
          <Search size="large" placeholder="Tìm kiếm lịch sử..." enterButton />
          </div>
      </div>

      <div className={styles.headerContent}>
        <div className={styles.navigation}>
          <button onClick={handlePrevDates}>&lt;</button>
        </div>
        <div className={styles.middle}>
          {visibleDates.map((item, index) => (
            <span
              key={index}
              className={item === selectedDate ? styles.active : ""}
            >
              {formatDateForDisplay(item)}
            </span>
          ))}
        </div>
        <div className={styles.navigation}>
          <button onClick={handleNextDates}>&gt;</button>
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
                  Không có lịch sử khám hôm nay.
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
                <td>{item.bird.name}</td>
                <td>{item.bird.customer.phone}</td>
                <td>{item.estimate_time}</td>
                <td>{item.checkin_time}</td>
                <td>
                  <strong>{item.veterinarian.name}</strong>
                </td>

                <td>
                  <div
                    className={styles.btnExam}
                    onClick={() => navigate(`/done/${item.booking_id}`)}
                  >
                    Xem kết quả
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

export default DoneExamination;
