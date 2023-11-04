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
            booking.status === "booked" || booking.status === "check_in"
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

  const options = {
    title: "Xác nhận check-in",
    message: "Tiến hành checkin cuộc hẹn này?",
    buttons: [
      {
        label: "Xác nhận",
      },
      {
        label: "Huỷ",
      },
    ],
    closeOnEscape: true,
    closeOnClickOutside: true,
    keyCodeForClose: [8, 32],
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypress: () => {},
    onKeypressEscape: () => {},
    overlayClassName: "overlay-custom-class-name",
  };

  const handleConfirmAlert = (item) => {
    const updatedOptions = {
      ...options,
      buttons: [
        {
          label: "Xác nhận",
          onClick: async () => {
            try {
              const response = await api.put(`/booking/${item.booking_id}`, {
                status: "check_in",
              });
              toast.success("Check-in thành công!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              console.log("response doi status ne", response.data);
              // setCustomerList(response.data.data);
              createNewServiceForm(item);
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          label: "Huỷ",
          onClick: () => {
            console.log("click no");
          },
        },
      ],
    };
    confirmAlert(updatedOptions);
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
                <td>Sáo nâu</td>
                <td>Khám tổng quát</td>
                <td>{item.estimate_time}</td>
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
                      onClick={() => handleConfirmAlert(item)}
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

export default Checkin;
