import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./GroomingToday.module.scss";
import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";
import { api } from "../../../services/axios";

const GroomingToday = () => {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleChangeStatusBooking = async (item) => {
    try {
      const response = await api.put(`/booking/${item.booking_id}`, {
        status: "on_going",
      });
      console.log("response doi status ne", response.data);
      navigate(`/grooming/${item.booking_id}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/booking");
        const filterBookings = response.data.data.filter(
          (booking) =>
            booking.service_type_id == "ST002"
        );
        setCustomerList(filterBookings);
        console.log('filterBookings', filterBookings)
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
        <div className={styles.left}></div>
        <div className={styles.middle}>
          <span className={styles.active}>06/10</span>
          <span>07/10</span>
          <span>08/10</span>
          <span>09/10</span>
          <span>10/10</span>
        </div>
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
              <tr key={index}>
                <td> {index + 1} </td>
                <td>{item.customer_name}</td>
                <td>{item.bird.name}</td>
                <td>{item.service_type}</td>
                <td>{item.estimate_time}</td>
                <td>{item.checkin_time}</td>
                <td>
                  <strong>{item.veterinarian.name}</strong>
                </td>
                <td>
                  <p
                    className={`${styles.status} ${
                      item.status === "check_in"
                        ? styles.checkin
                        : item.status === "on_going" ||
                          item.status === "test_requested"
                        ? styles.being
                        : ""
                    } `}
                  >
                    {item.status === "check_in"
                      ? "Đã checkin"
                      : item.status === "on_going"
                      ? "Đang chăm sóc"
                      : item.status === "test_requested"
                      ? "Chờ kết quả"
                      : "Chưa checkin"}
                  </p>
                </td>
                <td>
                  <div className={styles.btnCheckin} onClick={() => handleChangeStatusBooking(item)}>Spa</div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className={styles.footerContent}>
        <div className={styles.numberResult}>{!loading && customerList.length} kết quả</div>
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

export default GroomingToday;
