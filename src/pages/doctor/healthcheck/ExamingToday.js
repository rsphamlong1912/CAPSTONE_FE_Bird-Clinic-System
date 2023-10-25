import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./styles/ExamingToday.module.scss";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/axios";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";

const ExamingToday = () => {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/booking");
        console.log("api ne:", response.data.data);

        const accountId = localStorage.getItem("account_id");
        const vetCustomers = response.data.data.filter(
          (booking) => booking.veterinarian_id === accountId
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
  }, []);
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
                <td>09:36</td>
                <td>
                  <strong>Phạm Ngọc Long</strong>
                </td>
                <td>
                  <p class="status being">Đang khám</p>
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
        <p class="status being">
          <LoadingSkeleton></LoadingSkeleton>
        </p>
      </td>
    </tr>
  );
};

export default ExamingToday;
