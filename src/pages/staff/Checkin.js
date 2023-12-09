import React, { useEffect, useState } from "react";
import styles from "./Checkin.module.scss";
import useCurrentDate from "../../hooks/useCurrentDate";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/axios";
import { BsCalendar2 } from "react-icons/bs";

const Checkin = () => {
  const today = new Date();
  const navigate = useNavigate();
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentDate } = useCurrentDate();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(formatDate(today));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/booking?arrival_date=${selectedDate}`);
        const filterBookings = response.data.data.filter(
          (booking) =>
            booking.status !== "pending" &&
            booking.status !== "booked" &&
            booking.status !== "cancelled"
        );
        console.log("filterBookings", filterBookings);
        setCustomerList(filterBookings);
      } catch (error) {
        console.log(error);
      }
    };
    setTimeout(() => {
      setLoading(false);
    }, 850);
    fetchData();
  });

  return (
    <div className={styles.container}>
      <div className={styles.headerContent}>
           <div style={{ marginRight: 'auto' }}>
           <h1 className={styles.headerTitle}>CHECK IN HÔM NAY</h1>
          </div>
          <div style={{width: "30%"}}>
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
            <th> Dịch vụ</th>
            <th> Giờ đặt</th>
            <th> Giờ checkin</th>
            <th> Bác sĩ phụ trách</th>
            <th> Trạng thái</th>
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
                      Không có checkin nào hôm nay.
                  </h3>
                </div>
              </td>
            </tr>
          )}           
          {!loading &&
            customerList.map((item, index) => (
              <tr
                key={index}
                // onClick={() => navigate(`/examing/${item.booking_id}`)}
              >
                <td> {index + 1} </td>
                <td>{item.customer_name}</td>
                <td>{item.bird.customer.phone}</td>
                <td>{item.bird.name}</td>
                <td>{item.service_type}</td>
                <td>{item.estimate_time}</td>
                <td>{item.checkin_time || "_____"}</td>
                <td>
                  <strong>{item.veterinarian.name}</strong>
                </td>
                <td>
                  <p
                    className={`${styles.status} ${
                      item.status === "checked_in"
                        ? styles.checkin
                        : item.status === "on_going" ||
                          item.status === "test_requested"
                        ? styles.being
                        : item.status === "booked"
                        ? styles.booked
                        : item.status === "finish"
                        ? styles.finish
                        : ""
                    } `}
                  >
                    {item.status === "checked_in"
                      ? "Đã checkin"
                      : item.status === "test_requested"
                      ? "Chờ xét nghiệm"
                      : item.status === "on_going"
                      ? "Đang khám"
                      : item.status === "booked"
                      ? "Chưa checkin"
                      : item.status === "finish"
                      ? "Hoàn thành"
                      : ""}
                  </p>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className={styles.footerContent}>
        <div className={styles.numberResult}>
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

export default Checkin;
