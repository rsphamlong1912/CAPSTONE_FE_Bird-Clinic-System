import React, { useEffect, useState } from "react";
import { BsCalendar2 } from "react-icons/bs";
import styles from "./styles/ExamingToday.module.scss";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/axios";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";
import { ImFilesEmpty } from "react-icons/im";
import io from "socket.io-client";
import { Modal } from 'antd';

const socket = io("https://clinicsystem.io.vn");

const ExamingToday = () => {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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

  const today = new Date();
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [dates, setDates] = useState(formatDate(today));

  useEffect(() => {
  
  }, []);


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
      const response = await api.get(`/booking?arrival_date=${dates}`);
      console.log("api ne:", response.data.data);

      const accountId = localStorage.getItem("account_id");
      let vetCustomers = response.data.data.filter(
        (booking) =>
          booking.veterinarian_id === accountId &&
          booking.status !== "pending" &&
          booking.status !== "booked" &&
          booking.status !== "test_requested" &&
          booking.status !== "finish" &&
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
  }, [dates]);
  return (
    <div className={styles.container}>
      <div className={styles.headerContent}>
        <div style={{ marginRight: "auto" }}>
          <h1 className={styles.headerTitle}>DANH SÁCH KHÁM HÔM NAY</h1>
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
            <th> Chim</th>
            <th> Số điện thoại</th>
            <th> Giờ đặt</th>
            <th> Giờ checkin</th>
            {/* <th> Bác sĩ phụ trách</th> */}
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
                <td>{item.bird.name}</td>
                <td>{item.bird.customer.phone}</td>
                <td>{item.estimate_time}</td>
                <td>{item.checkin_time}</td>
                {/* <td>
                  <strong>{item.veterinarian.name}</strong>
                </td> */}
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
                  {item.status !== "on_going" ? (
                    <div
                      className={styles.btnExam}
                      onClick={() => setModalOngoing(true)}
                    >
                      Khám
                    </div>
                  ) : (
                    <div
                      className={styles.btnExam}
                      style={{backgroundColor: 'rgba(0, 178, 255, 1)'}}
                      onClick={() => navigate(`/examing/${item.booking_id}`)}
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
                      Khám cho chim {item.bird.name} của khách hàng{" "}
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

export default ExamingToday;
