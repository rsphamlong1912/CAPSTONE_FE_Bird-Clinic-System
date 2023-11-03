import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ReTesting.module.scss";
import ExaminationModal from "../../../components/modals/ExaminationModal";
import "reactjs-popup/dist/index.css";
import "flatpickr/dist/flatpickr.css";
import ProfileBirdModal from "../../../components/modals/ProfileBirdModal";
import { api } from "../../../services/axios";
import { toast } from "react-toastify";

const ReTesting = () => {
  const { serviceFormDetailId } = useParams();
  const [tab, setTab] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openModalProfile, setOpenModalProfile] = useState(false);

  const [serviceFormDetailInfo, setServiceFormDetailInfo] = useState();

  const [testingData, setTestingData] = useState({
    symptom: "",
    diagnose: "",
    recommendations: "",
  });

  // const notify = () =>
  //   toast.error("🦄 Wow so easy!", {
  //     position: "top-right",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "light",
  //   });

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

  const handleDoneServiceFormDetail = async () => {
    try {
      const doneResponse = await api.put(
        `/service_Form_detail/${serviceFormDetailId}`,
        {
          status: "done",
          veterinarian_id: localStorage.getItem("account_id"),
          process_at: 0,
        }
      );

      //TĂNG SERVICE HAS DONE LÊN 1
      const serviceFormId = serviceFormDetailInfo.service_form_id;
      // Lấy thông tin hiện tại của service form
      const serviceFormDetails = await api.get(
        `/service_Form/${serviceFormId}`
      );
      // Lấy giá trị hiện tại của num_ser_has_done từ response
      const currentNumSerHasDone =
        serviceFormDetails.data.data[0].num_ser_has_done;
      // Tăng giá trị lên 1
      const updatedNumSerHasDone = currentNumSerHasDone + 1;
      // Gửi yêu cầu PUT để cập nhật giá trị num_ser_has_done
      const increaseResponse = await api.put(`/service_Form/${serviceFormId}`, {
        num_ser_has_done: updatedNumSerHasDone,
      });

      console.log("increaseRes", increaseResponse.data);

      //TOAST THÔNG BÁO
      toast.success("Hoàn thành khám thành công!", {
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

  //LẤY THÔNG TIN SERVICE FORM DETAIL
  useEffect(() => {
    const getServiceFormDetail = async () => {
      try {
        const response = await api.get(
          `/service_Form_detail/${serviceFormDetailId}`
        );
        // serviceFormDetailInfo()
        setServiceFormDetailInfo(response.data.data);
        setTab(response.data.data.process_at);
      } catch (error) {
        console.log(error);
      }
    };

    getServiceFormDetail();
  }, [serviceFormDetailId]);

  const handleBackTab = async () => {
    const newTabValue = tab - 1; // Lấy giá trị mới của tab

    setTab(newTabValue); // Cập nhật giá trị tab

    try {
      const sendProcessToApi = await api.put(
        `/service_Form_detail/${serviceFormDetailId}`,
        {
          process_at: newTabValue, // Sử dụng giá trị mới của tab
        }
      );
      console.log("Change Tab Successful");
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error:", error);
      // Đảm bảo quay lại giá trị trước đó nếu có lỗi xảy ra
      setTab((tab) => tab + 1);
    }
  };

  const handleNextTab = async () => {
    const newTabValue = tab + 1; // Lấy giá trị mới của tab
    setTab(newTabValue); // Cập nhật giá trị tab

    try {
      const sendProcessToApi = await api.put(
        `/service_Form_detail/${serviceFormDetailId}`,
        {
          process_at: newTabValue, // Sử dụng giá trị mới của tab
        }
      );
      console.log("Change Tab Successfull");
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error:", error);
      // Đảm bảo quay lại giá trị trước đó nếu có lỗi xảy ra
      setTab((tab) => tab - 1);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.left}>
            <ion-icon name="chevron-back-outline"></ion-icon>
            <span>Thoát</span>
          </div>
          <div className={styles.right}>
            <div className={styles.nameCustomer}>KH: Nguyễn Trí Công</div>
          </div>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.content}>
            <div className={styles.procedureTab}>
              <span className={`${tab === 1 ? styles.active : ""}`}>
                Thông tin tiếp nhận
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span className={`${tab === 2 ? styles.active : ""}`}>
                Điều trị
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span className={`${tab === 3 ? styles.active : ""}`}>
                Trả kết quả
              </span>
            </div>
            {tab == 1 && (
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
            )}
            {tab == 2 && (
              <div className={styles.retesting}>
                <h2 className={styles.title}>Trả kết quả xét nghiệm</h2>
                <form>
                  <div className={styles.fileInput}>
                    <label htmlFor="symptom">Triệu chứng</label>
                    <input
                      type="text"
                      name="symptom"
                      id="symptom"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.fileInput}>
                    <label htmlFor="diagnose">Chẩn đoán</label>
                    <input
                      type="text"
                      name="diagnose"
                      id="diagnose"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.fileInput}>
                    <label htmlFor="recommendations">Đề nghị</label>
                    <input
                      type="text"
                      name="recommendations"
                      id="recommendations"
                      onChange={handleInputChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className={styles.btnSubmit}
                    onClick={handleFormSubmit}
                  >
                    Gửi
                  </button>
                </form>
              </div>
            )}
            {tab == 3 && (
              <div className={styles.retesting}>
                <h2 className={styles.title}>Trả kết quả xét nghiệm</h2>
                <form>
                  <div className={styles.fileInput}>
                    <label htmlFor="file">Tải lên file xét nghiệm</label>
                    <input type="file" name="file" id="file" />
                    <p className={styles.fileInfo}>
                      *Dung lượng không vượt quá 5mb
                    </p>
                  </div>
                  <button type="submit" className={styles.btnSubmit}>
                    Gửi
                  </button>
                </form>
              </div>
            )}
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
            <button
              className={styles.btnComplete}
              onClick={handleDoneServiceFormDetail}
            >
              Hoàn thành khám
            </button>
            <button className={styles.btnHospitalize}>Nhập viện</button>
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
        {tab !== 1 && (
          <button className={styles.btnBack} onClick={handleBackTab}>
            Quay lại
          </button>
        )}

        <button className={styles.btnCont} onClick={handleNextTab}>
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default ReTesting;
