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
        setCustomerList(response.data.data);
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
        status: "checked_in",
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
        status: "any",
        date: "any",
        veterinarian_referral: "any",
        total_price: "any",
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

      // Sử dụng ID để tạo service_Form_detail
      const createdDetailResponse = await api.post(`/service_Form_detail/`, {
        service_package_id: "SP1",
        service_form_id: createdResponse.data.data.service_form_id, // Sử dụng ID từ service_Form
        note: "any",
        status: "any",
        veterinarian_id: item.veterinarian_id,
        booking_id: item.booking_id,
        process_at: 1,
        checkin_time: item.checkin_time,
      });

      const createdBill = await api.post(`/bill/`, {
        title: "Kham thuong nè",
        total_price: "0",
        service_form_id: createdResponse.data.data.service_form_id,
        booking_id: item.booking_id,
        payment_method: "paypal",
        paypal_transaction_id: "any",
        status: "any",
      });

      const createdBillDetail = await api.post(`/billDetail/`, {
        bill_id: createdBill.data.data.bill_id,
        service_package_id: "SP1",
        price: 50000,
        quantity: 1,
      });

      console.log("create new bill:", createdBillDetail);
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
                      item.status === "booked" ? styles.pending : styles.checkin
                    } `}
                  >
                    {item.status === "booked" ? "Chưa checkin" : "Đã checkin"}
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
