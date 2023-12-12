import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./TrackDetail.module.scss";
import "reactjs-popup/dist/index.css";
import ProfileTrackModal from "../../components/modals/ProfileTrackModal";
import { api } from "../../services/axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import io from "socket.io-client";
import { useReactToPrint } from "react-to-print";
import { HoaDonTong } from "../../components/pdfData/HoaDonTong";
import { Select, Modal } from "antd";
import { PhieuKhamBenh } from "../../components/pdfData/PhieuKhamBenh";

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
  const [billDetailList, setBillDetailList] = useState();
  const [serviceFormDetailList, setServiceFormDetailList] = useState();
  const [showPrintBill, setShowPrintBill] = useState(false);
  const [bookingStatus, setBookingStatus] = useState();
  const [modalCheckin, setModalCheckin] = useState();
  const [modalCancel, setModalCancel] = useState();
  const [birdProfile, setBirdProfile] = useState([]);
  const [birdProfileBreed, setBirdProfileBreed] = useState([]);

  //Print
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const printRefPKB = useRef();
  const handlePrintPKB = useReactToPrint({
    content: () => printRefPKB.current,
  });

  const fetchVeterinarians = async (vet, date) => {
    try {
      // let responseVeterinarians;
      // if (vet.service_type_id === "ST001") {
      //   responseVeterinarians = await api.get(
      //     `/vet/?service_id=${vet.service_id}&service_type_id=${vet.service_type_id}&date=${date}`
      //   );
      // } else {
      //   responseVeterinarians = await api.get(
      //     `/vet/?service_type_id=${vet.service_type_id}&date=${date}`
      //   );
      // }

      const responseVeterinarians = await api.get(`/vet/?date=${date}`);
      console.log("response", responseVeterinarians.data.data);
      let filterList;
      if (vet.service_type_id === "ST001") {
        filterList = responseVeterinarians.data.data.filter(
          (item) =>
            item.veterinarian.is_primary === "1" &&
            item.veterinarian.service_type_id === "ST001"
        );
      } else {
        filterList = responseVeterinarians.data.data.filter(
          (item) => item.veterinarian.service_type_id === vet.service_type_id
        );
      }
      console.log("filter list", filterList);
      setVeterinarians(filterList);
      console.log("fetch vet", responseVeterinarians.data.data);
      // console.log("vet.service_id", vet.service_id);
      // console.log("vet.service_type_id", vet.service_type_id);
      // console.log("fetch", responseVeterinarians);
    } catch (error) {
      console.error("Error fetching veterinarians:", error);
    }
  };

  const fetchBookingInfo = async () => {
    try {
      const responseBooking = await api.get(`/booking/${bookingId}`);
      setBookingInfo(responseBooking.data.data);
      setBookingStatus(responseBooking.data.data.status);
      setSelectedVet(responseBooking.data.data.veterinarian_id);
      fetchVeterinarians(
        responseBooking.data.data.veterinarian,
        responseBooking.data.data.arrival_date
      );

      if (responseBooking.data.data && responseBooking.data.data.bird_id) {
        getBirdProfile(responseBooking.data.data.bird_id);
      }

      console.log("responseBooking", responseBooking);
    } catch (error) {
      console.log(error);
    }
  };

  const getBirdProfile = async (birdId) => {
    try {
      const response = await api.get(`/bird/${birdId}`);
      setBirdProfile(response.data.data);
      setBirdProfileBreed(response.data.data.bird_breed.breed)
    } catch (error) {
      console.log(error);
    }
  };

  const fetchServiceForm = async () => {
    try {
      const responseServiceForm = await api.get(
        `/service-form/?booking_id=${bookingId}`
      );
      if (responseServiceForm.data.data.length !== 0) {
        setShowPrintBill(true);
        const serviceFormDetailArr = [];
        responseServiceForm.data.data.forEach((item) => {
          serviceFormDetailArr.push(...item.service_form_details);
        });
        setServiceFormDetailList(serviceFormDetailArr);
      }
    } catch (error) {
      console.log(error);
      setLoading(false); // Handle error and set loading to false
    }
  };

  useEffect(() => {
    fetchBookingInfo();
    fetchServiceForm();
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

  const handleVetSelection = (value) => {
    setSelectedVet(value);
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
    console.log("item", item);
    try {
      const sp1 = await api.get(`/service-package/SP1`);
      if (sp1) {
        // Tạo service_Form
        const createdResponse = await api.post(`/service-form/`, {
          bird_id: item.bird_id,
          booking_id: item.booking_id,
          reason_referral: "any",
          status: "pending",
          date: item.arrival_date,
          veterinarian_referral: item.veterinarian_id,
          total_price: sp1.data.data.price,
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
        console.log("create service form", createdResponse);
      }
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
        label: "Hủy",
      },
    ],
    closeOnEscape: true,
    closeOnClickOutside: true,
    keyCodeForClose: [8, 32],
    willUnmount: () => { },
    afterClose: () => { },
    onClickOutside: () => { },
    onKeypress: () => { },
    onKeypressEscape: () => { },
    overlayClassName: "overlay-custom-class-name",
  };

  // const handleConfirmAlert = (item) => {
  //   const updatedOptions = {
  //     ...options,
  //     buttons: [
  //       {
  //         label: "Xác nhận",
  //         onClick: async () => {
  //           console.log("selected vet", selectedVet);
  //           try {
  //             const response = await api.put(`/booking/${item.booking_id}`, {
  //               veterinarian_id: selectedVet,
  //               status: "checked_in",
  //               checkin_time: currentTime,
  //             });
  //             if (response) {
  //               socket.emit("confirm-check-in", {
  //                 customer_id: item.account_id,
  //                 veterinarian_id: item.veterinarian_id,
  //               });
  //               toast.success("Check-in thành công!", {
  //                 position: "top-right",
  //                 autoClose: 5000,
  //                 hideProgressBar: false,
  //                 closeOnClick: true,
  //                 pauseOnHover: true,
  //                 draggable: true,
  //                 progress: undefined,
  //                 theme: "light",
  //               });
  //               console.log("response doi status ne", response.data);
  //               if (item.service_type_id === "ST001") {
  //                 createNewServiceForm(item);
  //               }
  //               navigate("/track");
  //             }
  //           } catch (error) {
  //             console.log(error);
  //           }
  //         },
  //       },
  //       {
  //         label: "Huỷ",
  //         onClick: () => {
  //           console.log("click no");
  //         },
  //       },
  //     ],
  //   };
  //   confirmAlert(updatedOptions);
  // };

  const handleConfirmAlert = async (item) => {
    try {
      const response = await api.put(`/booking/${item.booking_id}`, {
        veterinarian_id: selectedVet,
        status: "checked_in",
        checkin_time: currentTime,
      });
      if (response) {
        socket.emit("confirm-check-in", {
          customer_id: item.account_id,
          veterinarian_id: item.veterinarian_id,
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
        if (item.service_type_id === "ST001") {
          createNewServiceForm(item);
        }
        navigate("/track");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const optionsCancel = {
    title: "Xác nhận",
    message: "Bạn có chắc huỷ cuộc hẹn?",
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
    willUnmount: () => { },
    afterClose: () => { },
    onClickOutside: () => { },
    onKeypress: () => { },
    onKeypressEscape: () => { },
    overlayClassName: "overlay-custom-class-name",
  };

  // const handleConfirmCancel = (item) => {
  //   const updatedOptions = {
  //     ...optionsCancel,
  //     buttons: [
  //       {
  //         label: "Xác nhận",
  //         onClick: async () => {
  //           try {
  //             const responseCancel = await api.put(
  //               `/booking/${item.booking_id}`,
  //               {
  //                 status: "cancelled",
  //               }
  //             );
  //             if (responseCancel) {
  //               console.log("đã huỷ cuộc hẹn");
  //               toast.success("Đã huỷ thành công!", {
  //                 position: "top-right",
  //                 autoClose: 5000,
  //                 hideProgressBar: false,
  //                 closeOnClick: true,
  //                 pauseOnHover: true,
  //                 draggable: true,
  //                 progress: undefined,
  //                 theme: "light",
  //               });
  //               navigate("/track");
  //             }
  //           } catch (error) {
  //             console.log(error);
  //           }
  //         },
  //       },
  //       {
  //         label: "Huỷ",
  //         onClick: () => {
  //           console.log("click no");
  //         },
  //       },
  //     ],
  //   };
  //   confirmAlert(updatedOptions);
  // };

  const handleConfirmCancel = async (item) => {
    try {
      const responseCancel = await api.put(`/booking/${item.booking_id}`, {
        status: "cancelled",
      });
      if (responseCancel) {
        console.log("Đã huỷ cuộc hẹn");
        toast.success("Đã huỷ thành công!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/track");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const optionsCheckinAfter = {
    title: "Xác nhận",
    message: "Tiến hành checkin sau xét nghiệm?",
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
    willUnmount: () => { },
    afterClose: () => { },
    onClickOutside: () => { },
    onKeypress: () => { },
    onKeypressEscape: () => { },
    overlayClassName: "overlay-custom-class-name",
  };

  const handleCheckinAfter = (item) => {
    const updatedOptions = {
      ...optionsCheckinAfter,
      buttons: [
        {
          label: "Xác nhận",
          onClick: async () => {
            try {
              const responseCancel = await api.put(
                `/booking/${item.booking_id}`,
                {
                  status: "checked_in_after_test",
                }
              );
              if (responseCancel) {
                console.log("đã huỷ cuộc hẹn");
                toast.success("Đã huỷ thành công!", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
                navigate("/track");
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
    <div>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.left} onClick={() => navigate(`/track`)}>
            <ion-icon name="chevron-back-outline"></ion-icon>
            <h4>THOÁT</h4>
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
              {/* <div className={styles.InfText}>THÔNG TIN CUỘC HẸN</div> */}
              <h1 className={styles.InfText}>THÔNG TIN CUỘC HẸN</h1>
              <div className={styles.containerInfo}>
                <div className={styles.element}>
                  <table>
                    <tbody>
                      <tr>
                        <th>Dịch vụ</th>
                        <td>{bookingInfo?.service_type}</td>
                      </tr>
                      <tr>
                        <th>Mã số</th>
                        <td>{bookingInfo?.booking_id}</td>
                      </tr>
                      <tr>
                        <th>Khách hàng</th>
                        <td>{bookingInfo?.customer_name}</td>
                      </tr>
                      <tr>
                        <th>Số điện thoại</th>
                        <td>{bookingInfo?.bird.customer.phone}</td>
                      </tr>
                      <tr>
                        <th>Chim</th>
                        <td>{bookingInfo?.bird.name}</td>
                      </tr>
                      <tr>
                        <th>Ngày đặt</th>
                        <td>{bookingInfo?.arrival_date}</td>
                      </tr>
                      <tr>
                        <th>Giờ dự kiến</th>
                        <td>{bookingInfo?.estimate_time}</td>
                      </tr>
                      <tr>
                        <th>Giờ checkin</th>
                        <td>
                          {bookingInfo?.checkin_time
                            ? bookingInfo?.checkin_time
                            : "Chưa checkin"}
                        </td>
                      </tr>
                      <tr>
                        <th>Bác sĩ phụ trách</th>
                        {/* <select
                          onChange={handleVetSelection}
                          className={styles.selectVet}
                        >
                          {veterinarians &&
                            veterinarians.length > 0 &&
                            veterinarians.map((vet) => {
                              if (
                                vet.veterinarian.name ===
                                bookingInfo?.veterinarian.name
                              ) {
                                return (
                                  <option
                                    key={vet.veterinarian_id}
                                    value={vet.veterinarian_id}
                                    selected={true}
                                  >
                                    {vet.veterinarian.name}
                                  </option>
                                );
                              } else {
                                return (
                                  <option
                                    key={vet.veterinarian_id}
                                    value={vet.veterinarian_id}
                                  >
                                    {vet.veterinarian.name}
                                  </option>
                                );
                              }
                            })}
                        </select> */}
                        {bookingInfo?.status === "booked" ? (
                          <Select
                            onChange={handleVetSelection}
                            name="veterinarian"
                            className={styles.selectVet}
                            defaultValue={bookingInfo?.veterinarian_id}
                          >
                            {veterinarians &&
                              veterinarians.length > 0 &&
                              veterinarians.map((vet) => {
                                if (
                                  vet.veterinarian.name ===
                                  bookingInfo?.veterinarian.name
                                ) {
                                  return (
                                    <Select.Option
                                      key={vet.veterinarian_id}
                                      value={vet.veterinarian_id}
                                      selected={true}
                                    >
                                      {vet.veterinarian.name}
                                    </Select.Option>
                                  );
                                } else {
                                  return (
                                    <Select.Option
                                      key={vet.veterinarian_id}
                                      value={vet.veterinarian_id}
                                    >
                                      {vet.veterinarian.name}
                                    </Select.Option>
                                  );
                                }
                              })}
                          </Select>
                        ) : (
                          <td>{bookingInfo?.veterinarian.name}</td>
                        )}
                      </tr>
                      <tr>
                        <th>Trạng thái</th>
                        <td>
                          <p
                            className={`${styles.status} ${bookingInfo?.status === "checked_in" ||
                              bookingInfo?.status === "checked_in_after_test"
                              ? styles.checkin
                              : bookingInfo?.status === "on_going" ||
                                bookingInfo?.status === "test_requested"
                                ? styles.being
                                : bookingInfo?.status === "booked"
                                  ? styles.booked
                                  : bookingInfo?.status === "finish"
                                    ? styles.finish
                                    : bookingInfo?.status === "cancelled"
                                      ? styles.cancelled
                                      : ""
                              } `}
                          >
                            {bookingInfo?.status === "checked_in"
                              ? "Đã checkin"
                              : bookingInfo?.status === "test_requested"
                                ? "Chờ xét nghiệm"
                                : bookingInfo?.status === "on_going"
                                  ? "Đang khám"
                                  : bookingInfo?.status === "booked"
                                    ? "Chưa checkin"
                                    : bookingInfo?.status === "checked_in_after_test"
                                      ? "Có kết quả"
                                      : bookingInfo?.status === "finish"
                                        ? "Hoàn thành"
                                        : bookingInfo?.status === "cancelled"
                                          ? "Đã huỷ"
                                          : ""}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.history}>
                  <div>
                    <img
                      src={bookingInfo.bird.image}
                      className={styles.image}
                      alt=""
                    />
                  </div>
                  <div className={styles.containerName}>
                    {bookingInfo?.bird.name}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.metaContent}>
              <div className={styles.boxData}>
                <div>
                  <div
                    className={styles.boxDataItem}
                    onClick={() => setOpenModalProfile(true)}
                  >
                    <ion-icon name="calendar-clear-outline"></ion-icon>
                    <span>Hồ sơ chim</span>
                  </div>
                  <div
                    className={styles.boxDataItem}
                    onClick={handlePrintPKB}
                  >
                    <ion-icon name="print-outline"></ion-icon>
                    <span>In phiếu khám bệnh</span>
                  </div>
                </div>
              </div>
              {bookingStatus === "booked" ? (
                <>
                  <button
                    className={styles.btnComplete}
                    onClick={() => setModalCheckin(true)}
                  >
                    Check-in
                  </button>
                  <Modal
                    title="Xác nhận"
                    centered
                    open={modalCheckin}
                    onOk={() => handleConfirmAlert(bookingInfo)}
                    onCancel={() => setModalCheckin(false)}
                    cancelText="Đóng"
                  >
                    <span>
                      Checkin lịch hẹn cho khách hàng{" "}
                      {bookingInfo?.customer_name} ?
                    </span>
                  </Modal>
                </>
              ) : bookingStatus === "test_requested" ? (
                <button
                  className={styles.btnComplete}
                  onClick={() => handleCheckinAfter(bookingInfo)}
                >
                  Check-in sau xét nghiệm
                </button>
              ) : (
                ""
              )}
              {showPrintBill && (
                <button className={styles.btnComplete} onClick={handlePrint}>
                  In hoá đơn
                </button>
              )}
              {bookingInfo?.status !== "cancelled" && (
                <>
                  <button
                    className={styles.btnCancel}
                    onClick={() => setModalCancel(true)}
                  >
                    Hủy cuộc hẹn
                  </button>
                  <Modal
                    title="Xác nhận"
                    centered
                    open={modalCancel}
                    onOk={() => handleConfirmCancel(bookingInfo)}
                    onCancel={() => setModalCancel(false)}
                    cancelText="Đóng"
                  >
                    <span>
                      Hủy lịch hẹn của khách hàng {bookingInfo?.customer_name} ?
                    </span>
                  </Modal>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <ProfileTrackModal
        open={openModalProfile}
        birdProfile={birdProfile}
        birdProfileBreed={birdProfileBreed}
        bookingID={bookingId}
        onClose={() => setOpenModalProfile(false)}
      />
      {showPrintBill && (
        <div style={{ display: "none" }}>
          <HoaDonTong
            ref={printRef}
            billDetailList={billDetailList}
            serviceFormDetailList={serviceFormDetailList}
            bookingInfo={bookingInfo}
          ></HoaDonTong>
        </div>
      )}
      {showPrintBill && (
        <div style={{ display: "none" }}>
          <PhieuKhamBenh
            ref={printRefPKB}
            billDetailList={billDetailList}
            serviceFormDetailList={serviceFormDetailList}
            birdProfile={birdProfile}
            bookingInfo={bookingInfo}
          ></PhieuKhamBenh>
        </div>
      )}
      {/* <div className={styles.footerContent}>
        <button className={styles.btnBack} onClick={() => navigate(`/track`)}>
          Quay lại
        </button>

        <button
          className={styles.btnCont}
          onClick={() => setTab((tab) => tab + 1)}
        >
          Tiếp tục
        </button>
      </div> */}
    </div>
  );
};

const Loading = () => {
  return (
    <div className={styles.mainContent}>
      <div className={styles.content}>
        <h1 className={styles.InfText}>THÔNG TIN CUỘC HẸN</h1>
        <div className={styles.containerInfo}>
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
                  <td>
                    <LoadingSkeleton></LoadingSkeleton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.history}>
            <div className={styles.image}>
              <LoadingSkeleton height={112}></LoadingSkeleton>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.metaContent}>
        <div className={styles.boxData}>
          <div>
            <div className={styles.boxDataItem}>
              <ion-icon name="calendar-clear-outline"></ion-icon>
              <span>Hồ sơ chim</span>
            </div>
            <div className={styles.boxDataItem}>
              <ion-icon name="print-outline"></ion-icon>
              <span>In phiếu khám bệnh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDetail;
