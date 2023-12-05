import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./TrackAppoinments.module.scss";
import { api } from "../../services/axios";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import DetailBookingModal from "../../components/modals/DetailBookingModal";
import { ImFilesEmpty } from "react-icons/im";

import io from "socket.io-client";
const socket = io("https://clinicsystem.io.vn");

const TrackAppoinments = () => {
  const today = new Date();
  const navigate = useNavigate();
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModalDetailBooking, setOpenModalDetailBooking] = useState(false);

  const [dates, setDates] = useState([]);
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

  const [visibleDates, setVisibleDates] = useState([]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (date) => {
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}/${mm}`;
  };
  const [selectedDate, setSelectedDate] = useState(formatDate(today));

  useEffect(() => {
    const dateList = [];
    const daysToShow = 30;

    for (let i = -daysToShow; i <= daysToShow; i++) {
      const currentDate = new Date();
      currentDate.setDate(today.getDate() + i);
      dateList.push(formatDate(currentDate));
    }

    setDates(dateList);
    const visibleIndex = dateList.indexOf(formatDate(today));
    setVisibleDates(dateList.slice(visibleIndex - 3, visibleIndex + 4));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/booking?arrival_date=${selectedDate}`);
        console.log("sdjvbcs", response.data.data);
        let filterBookings = response.data.data.filter(
          (booking) => booking.status !== "pending"
        );
        // filterBookings = filterBookings.filter(
        //   (booking) => booking.checkin_time !== null
        // );

        filterBookings.sort((a, b) => {
          if (a.checkin_time && b.checkin_time) {
            const timeA = a.checkin_time.split(":").map(Number);
            const timeB = b.checkin_time.split(":").map(Number);

            // So sánh giờ
            if (timeA[0] !== timeB[0]) {
              return timeA[0] - timeB[0];
            }

            // Nếu giờ bằng nhau, so sánh phút
            return timeA[1] - timeB[1];
          }
          return 0;
        });

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
      const createdResponse = await api.post(`/service-form/`, {
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

  const handlePrevDates = () => {
    const currentIndex = dates.indexOf(visibleDates[0]);
    const prevDates = dates.slice(currentIndex - 1, currentIndex + 6);
    setVisibleDates(prevDates);
    setSelectedDate(prevDates[3]);
  };

  const handleNextDates = () => {
    const currentIndex = dates.indexOf(visibleDates[0]);
    const nextDates = dates.slice(currentIndex + 1, currentIndex + 8);
    setVisibleDates(nextDates);
    setSelectedDate(nextDates[3]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContent}>
        <div className={styles.left}></div>
        <div className={styles.navigation}>
          <button onClick={handlePrevDates}>&lt;</button>
        </div>
        <div className={styles.middle}>
          {visibleDates.map((item, index) => (
            <span
              key={index}
              className={item === selectedDate ? styles.active : ""}
            >
              {formatDateForDisplay(item)}
            </span>
          ))}
        </div>
        <div className={styles.navigation}>
          <button onClick={handleNextDates}>&gt;</button>
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
            <th>Số điện thoại</th>
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
              <td colSpan="10">
                <ImFilesEmpty className={styles.iconEmpty} />
                <h3 className={styles.txtNoGrooming}>
                  Không có lịch khám nào cho ngày này.
                </h3>
              </td>
            </tr>
          )}
          {!loading &&
            customerList.map((item, index) => (
              <tr key={index}>
                <td> {index + 1} </td>
                <td>{item.customer_name}</td>
                <td>{item.bird.customer.phone}</td>
                <td>{item.bird.name}</td>
                <td>{item.service_type}</td>
                <td>{item.estimate_time}</td>
                <td>{item.checkin_time || "_____"}</td>
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
                        : item.status === "finish"
                        ? styles.finish
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
                      : item.status === "finish"
                      ? "Hoàn thành"
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
