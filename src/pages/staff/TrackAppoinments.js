import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./TrackAppoinments.module.scss";
import { api } from "../../services/axios";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import DetailBookingModal from "../../components/modals/DetailBookingModal";

import io from "socket.io-client";
const socket = io("https://clinicsystem.io.vn");

const TrackAppoinments = () => {
  const navigate = useNavigate();
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModalDetailBooking, setOpenModalDetailBooking] = useState(false);

  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [bookingSelectedInfo, setBookingSelectedInfo] = useState();

  //SOCKET CHECKIN
  useEffect(() => {
    setTimeout(() => {
      console.log("socket id khi mới vào: ", socket.id);
      socket.emit("login", { account_id: "staff" });
      console.log("Login sucess");
      socket.on("server-scan-check-in", (data) => {
        console.log("data", data.booking_id);
        if (data.booking_id) {
          navigate(`/track/${data.booking_id}`);
        }
      });
    }, 500);
  }, []);

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

  const handleDateClick = (date) => {
    const clickedDate = new Date(date);
    const year = clickedDate.getFullYear();
    const month = String(clickedDate.getMonth() + 1).padStart(2, "0");
    const day = String(clickedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setSelectedDate(formattedDate);
  };

  const formatDateForDisplay = (date) => {
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}/${mm}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/booking");
        const filterBookings = response.data.data.filter(
          (booking) => booking.status !== "pending"
        );
        // Sort bookings by checkin_time in ascending order
        // filterBookings.sort((a, b) => {
        //   const timeA = a.checkin_time.split(":").map(Number);
        //   const timeB = b.checkin_time.split(":").map(Number);

        //   // Compare hours
        //   if (timeA[0] !== timeB[0]) {
        //     return timeA[0] - timeB[0];
        //   }

        //   // If hours are the same, compare minutes
        //   return timeA[1] - timeB[1];
        // });
        setCustomerList(filterBookings);
      } catch (error) {
        console.log(error);
      }
    };

    setTimeout(() => {
      setLoading(false);
    }, 850);
    fetchData();
  }, []);

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
            const currentDate = new Date();
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();

            // Định dạng giờ và phút thành chuỗi với đủ hai chữ số
            const formattedHours = hours < 10 ? `0${hours}` : hours;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

            // Tạo chuỗi thời gian ở định dạng giờ:phút
            const currentTime = `${formattedHours}:${formattedMinutes}`;
            try {
              const response = await api.put(`/booking/${item.booking_id}`, {
                status: "checked_in",
                checkin_time: currentTime,
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
              //CHECK SERVICE TYPE
              if (item.service_type_id === "ST001") {
                createNewServiceForm(item);
              }
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
            note: "Khám tổng quát",
          },
        ],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleModal = (item) => {
    setOpenModalDetailBooking(true);
    getBookingSelectedInfo(item.booking_id);
    console.log("modal ne", item);
  };

  const getBookingSelectedInfo = async (id) => {
    try {
      const responseBooking = await api.get(`/booking/${id}`);
      setBookingSelectedInfo(responseBooking.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContent}>
        <div className={styles.left}></div>
        <div className={styles.middle}>
          {dates.map((item, index) => (
            <span
              key={index}
              className={item === selectedDate ? styles.active : ""}
              onClick={() => handleDateClick(item)}
            >
              {formatDateForDisplay(item)}
            </span>
          ))}
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
                      item.status === "checked_in" ||
                      item.status === "checked_in_after_test"
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
                      : item.status === "checked_in_after_test"
                      ? "Có kết quả"
                      : ""}
                  </p>
                </td>
                <td className={styles.flexBtn}>
                  <div
                    className={styles.btnCheckin}
                    onClick={() => navigate(`/track/${item.booking_id}`)}
                  >
                    Xem
                  </div>

                  {/* <div
                    className={styles.btnCheckin}
                    onClick={() => handleModal(item)}
                  >
                    Xem
                  </div> */}
                  {/* {item.status === "booked" ? (
                    <div
                      className={styles.btnCheckin}
                      onClick={() => handleConfirmAlert(item)}
                    >
                      Check in
                    </div>
                  ) : (
                    <div></div>
                  )} */}
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
      <DetailBookingModal
        open={openModalDetailBooking}
        bookingSelectedInfo={bookingSelectedInfo}
        onClose={() => setOpenModalDetailBooking(false)}
      />
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
