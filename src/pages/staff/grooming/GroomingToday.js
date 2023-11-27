import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./GroomingToday.module.scss";
import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";
import { api } from "../../../services/axios";
import { ImFilesEmpty } from "react-icons/im";

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

  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/booking?arrival_date=${selectedDate}`);
        const filterBookings = response.data.data.filter(
          (booking) =>
            booking.service_type_id == "ST002" &&
            booking.status !== "pending" && booking.status !== "booked" && booking.status !== "finish"
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
  }, [selectedDate]);

  return (
    <div className={styles.container}>
      <div className={styles.headerContent}>
        <div className={styles.left}></div>
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

          {!loading && customerList.length === 0 && (
            <tr className={styles.NoGroomingDetial}>
              <td colSpan="9">
                <ImFilesEmpty className={styles.iconEmpty} />
                <h3 className={styles.txtNoGrooming}>Không có cuộc hẹn chải chuốt cho ngày đã chọn.</h3>
              </td>
            </tr>
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
                    className={`${styles.status} ${item.status === "checked_in"
                      ? styles.checkin
                      : item.status === "on_going" ||
                        item.status === "test_requested"
                        ? styles.being
                        : ""
                      } `}
                  >
                    {item.status === "checked_in"
                      ? "Đã checkin"
                      : item.status === "on_going"
                        ? "Đang chăm sóc"
                        : item.status === "test_requested"
                          ? "Chờ kết quả"
                          : "Chưa checkin"}
                  </p>
                </td>
                <td>
                  {item.status === "on_going" ? <div className={styles.btnCtn} onClick={() => navigate(`/grooming/${item.booking_id}`)}>Tiếp tục</div>
                  :<div className={styles.btnCheckin} onClick={() => handleChangeStatusBooking(item)}>Tiếp nhận</div>}
                  
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
