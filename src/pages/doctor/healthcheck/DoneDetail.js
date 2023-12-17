import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./DoneDetail.module.scss";
import "reactjs-popup/dist/index.css";
import ProfileBirdModal from "../../../components/modals/ProfileBirdModal";
import { api } from "../../../services/axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";
import io from "socket.io-client";
import Popup from "reactjs-popup";
import { Modal } from "antd";
const socket = io("https://clinicsystem.io.vn");

const DoneDetail = () => {
  const [serviceFormList, setServiceFormList] = useState();
  const [medicalRecordData, setMedicalRecordData] = useState([]);
  const [imgUrl, setImgUrl] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [serviceFormDetailSideArr, setServiceFormDetailSideArr] = useState();
  const [birdProfile, setBirdProfile] = useState();
  // const location = useLocation();
  // const { socket } = location.state || {};
  const { bookingId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openModalProfile, setOpenModalProfile] = useState(false);
  const [bookingInfo, setBookingInfo] = useState();
  const [openMedicine, setOpenMedicine] = useState(false);
  const [prescription, setPrescription ] = useState();


  const openPopup = async (id) => {
    const responseImgUrl = await api.get(
      `/media/?type=service_form_details&type_id=${id}`
    );
    if (responseImgUrl.data.data[0]?.link) {
      setImgUrl(responseImgUrl.data.data[0]?.link);
    } else {
      setImgUrl(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Flag_of_None.svg/1024px-Flag_of_None.svg.png"
      );
    }
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };




  //LẤY THÔNG TIN BOOKING
  useEffect(() => {
    const getBooking = async () => {
      try {
        const response = await api.get(
          `/booking/${bookingId}?service_type_id=ST001`
        );
        setBookingInfo(response.data.data[0]);
        console.log("thong tin booking ne:", response.data.data[0]);

        //GET BIRF PROFILE
        const responseBird = await api.get(`/bird/${response.data.data[0].bird_id}`);
        setBirdProfile(responseBird.data.data);

        //GET SERVICE FORM
        const responseServiceForm = await api.get(
          `/service-form/?booking_id=${bookingId}`
        );

        const filterList = responseServiceForm.data.data.slice(0, -1);

        if (filterList.length > 0) {
          const tempArr = [];

          // Lặp qua dữ liệu response và thêm các phần tử vào mảng tạm thời
          filterList.forEach((item) => {
            item.service_form_details.forEach((item2) => {
              tempArr.push(item2);
            });
            console.log("temp arr", tempArr);
          });

          setServiceFormDetailSideArr(tempArr);

          try {
            const responsesMedicalMedia = await Promise.all(
              tempArr.map(async (item) => {
                if (item.status === "done") {
                  const responseDetail = await api.get(
                    `/medical-record/?service_form_detail_id=${item.service_form_detail_id}`
                  );
                  return responseDetail.data.data[0];
                } else {
                  return {
                    note: item.note,
                    service_form_detail_id: item.service_form_detail_id,
                  };
                }
              })
            );
            // Thêm dữ liệu vào medicalRecordData
            setMedicalRecordData(responsesMedicalMedia);
            console.log("upda", responsesMedicalMedia);
          } catch (error) {
            console.error("Lỗi khi gọi API:", error);
          }
        }

        setServiceFormList(filterList);
        console.log("service form list", filterList);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPrescription = async () => {
      try {
        const responsePrescription = await api.get(
          `/prescription/?booking_id=${bookingId}`
        );
        console.log("thuoc ne", responsePrescription.data.data.prescription_details)
        setPrescription(responsePrescription.data.data.prescription_details)
        
      } catch (error) {
        console.log(error);
      }
    }

    getBooking();
    fetchPrescription();
  }, [bookingId]);

  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  // Định dạng giờ và phút thành chuỗi với đủ hai chữ số
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Tạo chuỗi thời gian ở định dạng giờ:phút
  const currentTime = `${formattedHours}:${formattedMinutes}`;



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
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypress: () => {},
    onKeypressEscape: () => {},
    overlayClassName: "overlay-custom-class-name",
  };

  const handleConfirmCancel = (item) => {
    const updatedOptions = {
      ...optionsCancel,
      buttons: [
        {
          label: "Xác nhận",
          onClick: async () => {
            try {
              const responseCancel = await api.put(
                `/booking/${item.booking_id}`,
                {
                  status: "cancelled",
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
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypress: () => {},
    onKeypressEscape: () => {},
    overlayClassName: "overlay-custom-class-name",
  };


  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.left} onClick={() => navigate(`/done`)}>
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
            <table>
                  <tbody>
                    <tr>
                      <th>Triệu chứng</th>
                      <td>{bookingInfo?.symptom}</td>
                    </tr>
                    <tr>
                      <th>Chẩn đoán</th>
                      <td>{bookingInfo?.diagnosis}</td>
                    </tr>
                    <tr>
                      <th>Lời khuyên</th>
                      <td>{bookingInfo?.recommendations}</td>
                    </tr>
                    
                  </tbody>
                </table>
              <div className={styles.examingService}>
                {serviceFormList &&
                  serviceFormList.length > 0 &&
                  serviceFormList.map((item, index) => (
                    <div>
                      <h3 className={styles.requireText}>
                        <ion-icon name="documents-outline"></ion-icon>Kết quả
                        xét nghiệm {index + 1}:
                      </h3>
                      {item.service_form_details.map((item, index) => {
                        const matchingMedicalRecord = medicalRecordData.find(
                          (record) =>
                            record.service_form_detail_id ===
                            item.service_form_detail_id
                        );
                        console.log("record ne huu", matchingMedicalRecord);

                        if (matchingMedicalRecord) {
                          return (
                            <div key={index} className={styles.resultDetail}>
                              <div className={styles.titleService}>
                                <h4>
                                  {item.note}
                                  {matchingMedicalRecord.hasOwnProperty(
                                    "symptom"
                                  ) ? (
                                    <span></span>
                                  ) : (
                                    <span className={styles.cancelled}>
                                      Đã huỷ
                                    </span>
                                  )}
                                </h4>

                                <span
                                  onClick={() =>
                                    openPopup(item.service_form_detail_id)
                                  }
                                  className={styles.viewFile}
                                >
                                  <ion-icon name="document-outline"></ion-icon>
                                  Xem file
                                </span>
                                <Popup
                                  open={isOpen}
                                  closeOnDocumentClick
                                  onClose={closePopup}
                                >
                                  <div className={styles.popup}>
                                    <br></br>
                                    <img
                                      src={imgUrl}
                                      alt=""
                                      className={styles.imgPopup}
                                    />
                                  </div>
                                </Popup>
                              </div>
                              <div className={styles.lineItem}>
                                <span className={styles.label}>
                                  Triệu chứng:
                                </span>
                                <span>{matchingMedicalRecord.symptom}</span>
                              </div>
                              <div className={styles.lineItem}>
                                <span className={styles.label}>Chẩn đoán:</span>
                                <span>{matchingMedicalRecord.diagnose}</span>
                              </div>
                              <div className={styles.lineItem}>
                                <span className={styles.label}>
                                  Khuyến nghị:
                                </span>
                                <span>
                                  {matchingMedicalRecord.recommendations}
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                      <div key={index}>{item.note}</div>
                    </div>
                  ))}
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
                <div
                  className={styles.boxDataItem}
                  onClick={() => setOpenMedicine(true)}
                >
                  <ion-icon name="print-outline"></ion-icon>
                  <span>Xem đơn thuốc</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ProfileBirdModal
        open={openModalProfile}
        birdProfile={birdProfile}
        onClose={() => setOpenModalProfile(false)}
      />
      <Modal
        title="Đơn thuốc đã kê"
        centered
        open={openMedicine}
        onOk={() => setOpenMedicine(false)}
        onCancel={() => setOpenMedicine(false)}
        width={1000}
      >
        <table className={styles.table}>
                        <tr>
                            <th>Tên thuốc</th>
                            <th>Đơn vị</th>
                            <th>Số liều dùng/ số ngày</th>
                            <th>Tổng số liều</th>
                            <th>Ghi chú</th>
                        </tr>
                        {prescription && prescription.length > 0 && prescription.map((item, index) => (
                            <tr>
                                <td>{item.medicine.name}</td>
                                <td>{item.medicine.unit}</td>
                                <td>{item.dose}/{item.day}</td>
                                <td>{item.total_dose}</td>
                                <td>{item.note}</td>
                            </tr>
                        ))}
                        
                    </table>
      </Modal>


      <div className={styles.footerContent}>
        <button className={styles.btnBack} onClick={() => navigate(`/track`)}>
          Quay lại
        </button>

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

export default DoneDetail;
