import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ReTesting.module.scss";
import ExaminationModal from "../../../components/modals/ExaminationModal";
import "reactjs-popup/dist/index.css";
import "flatpickr/dist/flatpickr.css";
import ProfileBirdModal from "../../../components/modals/ProfileBirdModal";
import { api } from "../../../services/axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

const ReTesting = () => {
  const { serviceFormDetailId } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openModalProfile, setOpenModalProfile] = useState(false);

  const [serviceFormDetailInfo, setServiceFormDetailInfo] = useState();

  const [testingData, setTestingData] = useState({
    symptom: "",
    diagnose: "",
    recommendations: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestingData({
      ...testingData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(`/medicalRecord/`, {
        ...testingData,
        service_form_detail_id: serviceFormDetailId,
      }); // Directly use testingData from the state
      console.log("Data has been successfully submitted:", response.data);
      toast.success("Gửi thành công!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Additional handling if required
    } catch (error) {
      console.error("Error submitting data:", error);
      // Error handling, if needed
    }
  };

  // const handleDoneServiceFormDetail = async () => {
  //   try {
  //     const doneResponse = await api.put(
  //       `/service_Form_detail/${serviceFormDetailId}`,
  //       {
  //         status: "done",
  //         veterinarian_id: localStorage.getItem("account_id"),
  //         process_at: 0,
  //       }
  //     );

  //     //TĂNG SERVICE HAS DONE LÊN 1
  //     const serviceFormId = serviceFormDetailInfo.service_form_id;
  //     // Lấy thông tin hiện tại của service form
  //     const serviceFormResult = await api.get(`/service_Form/${serviceFormId}`);
  //     // Lấy giá trị hiện tại của num_ser_has_done từ response

  //     const currentNumSerHasDone =
  //       serviceFormResult.data.data[0].num_ser_has_done;
  //     // Tăng giá trị lên 1
  //     const updatedNumSerHasDone = currentNumSerHasDone + 1;

  //     const isDone =
  //       serviceFormResult.data.data[0].num_ser_must_do === updatedNumSerHasDone;

  //     if (isDone) {
  //       try {
  //         const updateBookingResponse = await api.put(
  //           `/booking/${serviceFormDetailInfo.booking_id}`,
  //           {
  //             status: "checked_in_after_test",
  //           }
  //         );
  //       } catch (error) {
  //         console.error("Đã xảy ra lỗi khi cập nhật đặt chỗ:", error);
  //       }
  //     }

  //     // Gửi yêu cầu PUT để cập nhật giá trị num_ser_has_done
  //     const increaseResponse = await api.put(`/service_Form/${serviceFormId}`, {
  //       num_ser_has_done: updatedNumSerHasDone,
  //       status: isDone ? "done" : "paid",
  //     });

  //     console.log("increaseRes", increaseResponse.data);

  //     //TOAST THÔNG BÁO
  //     toast.success("Hoàn thành khám thành công!", {
  //       position: "top-right",
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });

  //     setTimeout(navigate(`/retesting/`), 500);
  //     // Additional handling if required
  //   } catch (error) {
  //     console.error("Error submitting data:", error);
  //     // Error handling, if needed
  //   }
  // };

  const options = {
    title: "Xác nhận",
    message: "Bạn có chắc chắn hoàn thành xét nghiệm?",
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

  const handleConfirmAlert = () => {
    const updatedOptions = {
      ...options,
      buttons: [
        {
          label: "Xác nhận",
          onClick: async () => {
            try {
              const doneResponse = await api.put(
                `/service_Form_detail/${serviceFormDetailId}`,
                {
                  status: "wait_result",
                  veterinarian_id: localStorage.getItem("account_id"),
                  process_at: 0,
                }
              );
              if (doneResponse) {
                navigate("/retesting");
              }
            } catch (error) {
              console.error("Error submitting data:", error);
              // Error handling, if needed
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

  //LẤY THÔNG TIN SERVICE FORM DETAIL
  useEffect(() => {
    const getServiceFormDetail = async () => {
      try {
        const response = await api.get(
          `/service_Form_detail/${serviceFormDetailId}`
        );
        // serviceFormDetailInfo()
        setServiceFormDetailInfo(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getServiceFormDetail();
  }, [serviceFormDetailId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Lấy file đã chọn
    const fileInput = document.getElementById("file");
    const file = fileInput.files[0];

    // Tạo formData chứa dữ liệu cần gửi
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", serviceFormDetailInfo.note);
    formData.append("type_id", serviceFormDetailInfo.service_package_id);
    formData.append("type_service", serviceFormDetailInfo.service_package_id);

    // const requestData = {
    //   type: serviceFormDetailInfo.note,
    //   type_id: serviceFormDetailInfo.service_package_id,
    //   is_before: "any",
    //   is_after: "any",
    //   type_service: "ST001",
    //   image: file,
    // };

    console.log("file ne: ", file);

    // Thực hiện gọi API sử dụng axios
    try {
      const response = await api.post("/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Xử lý response nếu cần
      console.log("Response:", response.data);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error:", error);
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
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypress: () => {},
    onKeypressEscape: () => {},
    overlayClassName: "overlay-custom-class-name",
  };

  const handleConfirmCancel = () => {
    const updatedOptions = {
      ...optionsCancel,
      buttons: [
        {
          label: "Xác nhận",
          onClick: async () => {
            try {
              const responseCancel = await api.put(
                `/service_Form_detail/${serviceFormDetailId}`,
                {
                  status: "cancelled",
                }
              );
              if (responseCancel) {
                //TĂNG SERVICE HAS DONE LÊN 1
                const serviceFormId = serviceFormDetailInfo.service_form_id;
                // Lấy thông tin hiện tại của service form
                const serviceFormResult = await api.get(
                  `/service_Form/${serviceFormId}`
                );
                // Lấy giá trị hiện tại của num_ser_has_done từ response

                const currentNumSerHasDone =
                  serviceFormResult.data.data[0].num_ser_has_done;
                // Tăng giá trị lên 1
                const updatedNumSerHasDone = currentNumSerHasDone + 1;

                const isDone =
                  serviceFormResult.data.data[0].num_ser_must_do ===
                  updatedNumSerHasDone;

                //   if (isDone) {
                //     try {
                //       const updateBookingResponse = await api.put(
                //         `/booking/${serviceFormDetailInfo.booking_id}`,
                //         {
                //           status: "checked_in_after_test",
                //         }
                //       );
                //     } catch (error) {
                //       console.error("Đã xảy ra lỗi khi cập nhật đặt chỗ:", error);
                //     }
                //   }

                // Gửi yêu cầu PUT để cập nhật giá trị num_ser_has_done
                const increaseResponse = await api.put(
                  `/service_Form/${serviceFormId}`,
                  {
                    num_ser_has_done: updatedNumSerHasDone,
                    status: isDone ? "done" : "paid",
                  }
                );

                console.log("increaseRes", increaseResponse.data);

                //TOAST THÔNG BÁO
                toast.success("Huỷ thành công!", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });

                navigate(`/retesting`);
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
          <div className={styles.left} onClick={() => navigate("/retesting")}>
            <ion-icon name="chevron-back-outline"></ion-icon>
            <span>Thoát</span>
          </div>
          <div className={styles.right}>
            <div className={styles.nameCustomer}>KH: Nguyễn Trí Công</div>
          </div>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.content}>
            <div className={styles.retesting}>
              <h2 className={styles.title}>
                Xét nghiệm {serviceFormDetailInfo?.note}
              </h2>
              <div className={styles.lineItem}>
                <span className={styles.label}>Mã số:</span>
                <span>HCO012J6</span>
              </div>
              <div className={styles.lineItem}>
                <span className={styles.label}>Tên khách hàng:</span>
                <span>Nguyễn Trí Công</span>
              </div>
              <div className={styles.lineItem}>
                <span className={styles.label}>Tên chim:</span>
                <span>Vẹt xanh</span>
              </div>
            </div>
          </div>
          <div className={styles.metaContent}>
            <div className={styles.boxData}>
              <div
                className={styles.boxDataItem}
                onClick={() => setOpenModal(true)}
              >
                <ion-icon name="thermometer-outline"></ion-icon>
                <span>Nội dung khám</span>
              </div>
              <div
                className={styles.boxDataItem}
                onClick={() => setOpenModalProfile(true)}
              >
                <ion-icon name="calendar-clear-outline"></ion-icon>
                <span>Hồ sơ chim khám</span>
              </div>
            </div>
            <button className={styles.btnComplete} onClick={handleConfirmAlert}>
              Xác nhận xét nghiệm
            </button>
            <button
              className={styles.btnHospitalize}
              onClick={handleConfirmCancel}
            >
              Huỷ
            </button>
          </div>
        </div>
      </div>
      <ExaminationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        // examData={examData}
        // selectedServices={selectedServices}
      />
      <ProfileBirdModal
        open={openModalProfile}
        onClose={() => setOpenModalProfile(false)}
      />
      <div className={styles.footerContent}>
        <button className={styles.btnBack}>Quay lại</button>
      </div>
    </div>
  );
};

export default ReTesting;
