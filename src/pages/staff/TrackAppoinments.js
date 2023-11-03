import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./TrackAppoinments.module.scss";
import { api } from "../../services/axios";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import { useNavigate } from "react-router-dom";

const TrackAppoinments = () => {
  const navigate = useNavigate();
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/booking");
        const exceptPendingBookings = response.data.data.filter(
          (booking) => booking.status !== "pending"
        );
        setCustomerList(exceptPendingBookings);
      } catch (error) {
        console.log(error);
      }
    };

    setTimeout(() => {
      setLoading(false);
    }, 850);
    fetchData();
  });

  const handleChangeStatusCheckin = async (item) => {
    try {
      const response = await api.put(`/booking/${item.booking_id}`, {
        status: "check_in",
      });
      console.log("response doi status ne", response.data);
      // setCustomerList(response.data.data);
      createNewServiceForm(item);
    } catch (error) {
      console.log(error);
    }
  };

  const createNewServiceForm = async (item) => {
    try {
      // Tạo service_Form
      const createdResponse = await api.post(`/service_Form/`, {
        bird_id: item.bird_id,
        booking_id: item.booking_id,
        reason_referral: "any",
        status: "pending",
        date: item.arrival_date,
        veterinarian_referral: item.veterinarian_id,
        total_price: 50000,
        qr_code: "any",
        num_ser_must_do: 1,
        num_ser_has_done: 0,
        arr_service_pack: [
          {
            service_package_id: "SP1",
            note: "null",
          },
        ],
      });

      const createdBill = await api.post(`/bill/`, {
        title: "Thanh toán lần 1",
        total_price: createdResponse.data.data.total_price,
        service_form_id: createdResponse.data.data.service_form_id,
        booking_id: item.booking_id,
        payment_method: "cash",
        paypal_transaction_id: "any",
        status: "any",
      });

      console.log("create new bill:", createdBill);
    } catch (err) {
      console.log(err);
    }
  };
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
                      item.status === "pending"
                        ? styles.pending
                        : item.status === "booked"
                        ? styles.booked
                        : item.status === "check_in"
                        ? styles.checkin
                        : item.status === "on_going" ||
                          item.status === "test_requested"
                        ? styles.being
                        : ""
                    } `}
                  >
                    {item.status === "pending"
                      ? "Chờ duyệt"
                      : item.status === "booked"
                      ? "Chưa checkin"
                      : item.status === "check_in"
                      ? "Đã checkin"
                      : item.status === "test_requested"
                      ? "Chờ xét nghiệm"
                      : item.status === "on_going"
                      ? "Đang khám"
                      : "Không xác định"}
                  </p>
                </td>
                <td>
                  {item.status === "booked" ? (
                    <div
                      className={styles.btnCheckin}
                      onClick={() => handleChangeStatusCheckin(item)}
                    >
                      Check in
                    </div>
                  ) : (
                    <div className={styles.btnCheckin}>Xem</div>
                  )}
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

export default TrackAppoinments;
