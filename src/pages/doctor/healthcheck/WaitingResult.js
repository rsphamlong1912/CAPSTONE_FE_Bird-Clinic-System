import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./WaitingResult.module.scss";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/axios";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";
import { ImFilesEmpty } from "react-icons/im";

const WaitingResult = () => {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/booking?arrival_date=${selectedDate}`);
        console.log("api ne:", response.data.data);

        const accountId = localStorage.getItem("account_id");
        const vetCustomers = response.data.data.filter(
          (booking) =>
            booking.veterinarian_id === accountId &&
            (booking.status === "test_requested" ||
              booking.status === "checked_in_after_test")
        );

        setCustomerList(vetCustomers);
        console.log("Updated customerList:", vetCustomers);
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
        <div className={styles.left}>
          <h3>DANH SÁCH CHỜ KẾT QUẢ</h3>
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
          {!loading && customerList.length === 0 && (
            <tr className={styles.NoGroomingDetial}>
              <td colSpan="9">
                <ImFilesEmpty className={styles.iconEmpty} />
                <h3 className={styles.txtNoGrooming}>Hiện tại không có hàng chờ kết quả nào.</h3>
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
                  <p
                    className={`${styles.status} ${item.status === "test_requested"
                        ? styles.being
                        : styles.checkin
                      } `}
                  >
                    {item.status === "test_requested"
                      ? "Chờ xét nghiệm"
                      : item.status === "checked_in_after_test"
                        ? "Có kết quả"
                        : ""}
                  </p>
                </td>
                <td>
                  <div
                    className={styles.btnExam}
                    onClick={() => navigate(`/examing/${item.booking_id}`)}
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

export default WaitingResult;
