import React, { useEffect, useState } from "react";
import styles from "./Checkin.module.scss";
import useCurrentDate from "../../hooks/useCurrentDate";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/axios";

const Checkin = () => {
  const navigate = useNavigate();
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/booking");

        const allBookings = response.data.data;
        const checkedInBookings = allBookings.filter(
          (booking) => booking.status === "checked_in"
        );
        setCustomerList(checkedInBookings);
      } catch (error) {
        console.log(error);
      }
    };

    setTimeout(() => {
      setLoading(false);
    }, 850);
    fetchData();
  }, []);
  const { currentDate } = useCurrentDate();
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
              <tr onClick={() => navigate(`/examing/${item.booking_id}`)}>
                <td> {index + 1} </td>
                <td>{item.customer_name}</td>
                <td>Sáo nâu</td>
                <td>Khám tổng quát</td>
                <td>{item.checkin_time}</td>
                <td></td>
                <td>
                  <strong>Phạm Ngọc Long</strong>
                </td>
                <td>
                  <p
                    className={`${styles.status} ${
                      item.status === "booked" ? styles.pending : styles.checkin
                    } `}
                  >
                    {item.status === "booked" ? "Chưa checkin" : "Đã checkin"}
                  </p>
                </td>

                <td>
                  <div className={styles.btnCheckin}>Check in</div>
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
        <p class="status being">
          <LoadingSkeleton></LoadingSkeleton>
        </p>
      </td>
    </tr>
  );
};

export default Checkin;
