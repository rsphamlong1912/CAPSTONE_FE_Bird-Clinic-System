import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./TrackDetail.module.scss";
import "reactjs-popup/dist/index.css";
import ProfileBirdModal from "../../components/modals/ProfileBirdModal";
import { api } from "../../services/axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import io from "socket.io-client";
const socket = io("https://clinicsystem.io.vn");

const TrackDetail = () => {
  // const location = useLocation();
  // const { socket } = location.state || {};
  const { bookingId } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openModalProfile, setOpenModalProfile] = useState(false);

  const [veterinarians, setVeterinarians] = useState([]);
  const [selectedVet, setSelectedVet] = useState("");
  const [bookingInfo, setBookingInfo] = useState();

  const fetchVeterinarians = async () => {
    try {
      const responseVeterinarians = await api.get(`/vet`);
      setVeterinarians(responseVeterinarians.data.data);
      console.log("fetch", responseVeterinarians.data.data);
    } catch (error) {
      console.error("Error fetching veterinarians:", error);
    }
  };

  const fetchBookingInfo = async () => {
    try {
      const responseBooking = await api.get(`/booking/${bookingId}`);
      setBookingInfo(responseBooking.data.data);
      setSelectedVet(responseBooking.data.data.veterinarian_id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVeterinarians();
    fetchBookingInfo();
    setTimeout(() => {
      setLoading(false);
    }, 850);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      console.log("socket id detail: ", socket.id);
      socket.emit("login", { account_id: localStorage.getItem("account_id") });
      console.log("Login sucess");
    }, 500);
  }, []);

  const handleVetSelection = (event) => {
    setSelectedVet(event.target.value);
  };

  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  // Định dạng giờ và phút thành chuỗi với đủ hai chữ số
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Tạo chuỗi thời gian ở định dạng giờ:phút
  const currentTime = `${formattedHours}:${formattedMinutes}`;

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
            console.log("selected vet", selectedVet);
            try {
              const response = await api.put(`/booking/${item.booking_id}`, {
                veterinarian_id: selectedVet,
                status: "checked_in",
                checkin_time: currentTime,
              });
              if (response) {
                console.log("do response r ne");
                socket.emit("confirm-check-in", {
                  customer_id: item.account_id,
                  veterinarian_id: item.veterinarian_id,
                });
              }
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.left} onClick={() => navigate(`/track`)}>
            <ion-icon name="chevron-back-outline"></ion-icon>
            <span>Trở về</span>
          </div>
          <div className={styles.right}>
            <div className={styles.nameCustomer}>
              KH: {bookingInfo?.customer_name}
            </div>
          </div>
        </div>
        {loading && <Loading></Loading>}
        {!loading && (
          <div className={styles.mainContent}>
            <div className={styles.content}>
              <div className={styles.InfText}>Thông tin cuộc hẹn</div>
              <div className={styles.element}>
                <h5>THÔNG TIN CHUNG</h5>
                <table>
                  <tbody>
                    <tr>
                      <th>Tên dịch vụ</th>
                      <td>{bookingInfo?.service_type}</td>
                    </tr>
                    <tr>
                      <th>Tên khách hàng</th>
                      <td>{bookingInfo?.customer_name}</td>
                    </tr>
                    <tr>
                      <th>Số điện thoại</th>
                      <td>{bookingInfo?.bird.customer.phone}</td>
                    </tr>
                    <tr>
                      <th>Tên chim</th>
                      <td>{bookingInfo?.bird.name}</td>
                    </tr>
                    <tr>
                      <th>Giờ checkin</th>
                      <td>{bookingInfo?.checkin_time}</td>
                    </tr>
                    <tr>
                      <th>Bác sĩ phụ trách</th>
                      <select
                        onChange={handleVetSelection}
                        className={styles.selectVet}
                      >
                        {veterinarians.map((vet) => {
                          if (vet.name === bookingInfo?.veterinarian.name) {
                            return (
                              <option
                                key={vet.veterinarian_id}
                                value={vet.veterinarian_id}
                                selected={true}
                              >
                                {vet.name}
                              </option>
                            );
                          } else {
                            return (
                              <option
                                key={vet.veterinarian_id}
                                value={vet.veterinarian_id}
                              >
                                {vet.name}
                              </option>
                            );
                          }
                        })}
                      </select>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.history}>
                <img
                  src="https://s3-media0.fl.yelpcdn.com/bphoto/hk8tThrdX-iEkolBrYLZBQ/348s.jpg"
                  className={styles.image}
                  alt=""
                />
                {/* <div className={styles.historyText}>Lịch sử</div>
      <div className={styles.infHS}>
        <p>1. Khám tổng quát</p>
        <p>15/08/2023</p>
        <button className={styles.button}>Xem kết quả</button>
      </div>
      <div className={styles.infHS}>
        <p>2. Chụp X-ray</p>
        <p>20/08/2023</p>
        <button className={styles.button}>Xem kết quả</button>
      </div> */}
              </div>
            </div>
            <div className={styles.metaContent}>
              <div className={styles.boxData}>
                <div
                  className={styles.boxDataItem}
                  onClick={() => setOpenModalProfile(true)}
                >
                  <ion-icon name="calendar-clear-outline"></ion-icon>
                  <span>Hồ sơ chim khám</span>
                </div>
              </div>
              <button
                className={styles.btnComplete}
                onClick={() => handleConfirmAlert(bookingInfo)}
              >
                Check-in
              </button>
            </div>
          </div>
        )}
      </div>
      <ProfileBirdModal
        open={openModalProfile}
        onClose={() => setOpenModalProfile(false)}
      />
      <div className={styles.footerContent}>
        <button className={styles.btnBack} onClick={() => navigate(`/track`)}>
          Quay lại
        </button>

        {/* <button
          className={styles.btnCont}
          onClick={() => setTab((tab) => tab + 1)}
        >
          Tiếp tục
        </button> */}
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <div className={styles.mainContent}>
      <div className={styles.content}>
        <div className={styles.InfText}>Thông tin cuộc hẹn</div>
        <div className={styles.element}>
          <h5>
            <LoadingSkeleton></LoadingSkeleton>
          </h5>
          <table>
            <tbody>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <td>
                  <LoadingSkeleton></LoadingSkeleton>
                </td>
              </tr>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <td>
                  <LoadingSkeleton></LoadingSkeleton>
                </td>
              </tr>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <td>
                  <LoadingSkeleton></LoadingSkeleton>
                </td>
              </tr>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <td>
                  <LoadingSkeleton></LoadingSkeleton>
                </td>
              </tr>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <td>
                  <LoadingSkeleton></LoadingSkeleton>
                </td>
              </tr>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <select className={styles.selectVet}>
                  <LoadingSkeleton></LoadingSkeleton>
                </select>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.history}>
          <div className={styles.image}>
            <LoadingSkeleton height={"100%"}></LoadingSkeleton>
          </div>
        </div>
      </div>
      <div className={styles.metaContent}>
        <div className={styles.boxData}>
          <div className={styles.boxDataItem}>
            <ion-icon name="calendar-clear-outline"></ion-icon>
            <span>Hồ sơ chim khám</span>
          </div>
        </div>
        <button className={styles.btnComplete}>Check-in</button>
      </div>
    </div>
  );
};

export default TrackDetail;
