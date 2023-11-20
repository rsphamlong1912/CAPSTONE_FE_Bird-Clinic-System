import React, { useEffect, useState } from "react";
import styles from "./Checkin.module.scss";
import useCurrentDate from "../../hooks/useCurrentDate";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/axios";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

const Checkin = () => {
  const navigate = useNavigate();
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentDate } = useCurrentDate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/booking");
        const filterBookings = response.data.data.filter(
          (booking) =>
            booking.status !== "pending" && booking.status !== "booked"
        );
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
        <div className={styles.left}>DANH SÁCH CHECKIN HÔM NAY</div>
        <div className={styles.right}>{currentDate}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th> STT</th>
            <th> Khách hàng</th>
            <th> Chim</th>
            <th> Dịch vụ</th>
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
              <tr
                key={index}
                // onClick={() => navigate(`/examing/${item.booking_id}`)}
              >
                <td> {index + 1} </td>
                <td>{item.customer_name}</td>
                <td>{item.bird.name}</td>
                <td>Khám tổng quát</td>
                <td>{item.estimate_time}</td>
                <td></td>
                <td>
                  <strong>Phạm Ngọc Long</strong>
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
                      : ""}
                  </p>
                </td>

                <td>
                  <div className={styles.btnCheckin}>Xem</div>
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
