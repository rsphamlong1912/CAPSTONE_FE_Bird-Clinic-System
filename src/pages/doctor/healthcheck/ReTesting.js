import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ReTesting.module.scss";
import ExaminationModal from "../../../components/modals/ExaminationModal";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { RiDeleteBinLine } from "react-icons/ri";
import "flatpickr/dist/flatpickr.css";
import Flatpickr from "react-flatpickr";
import ProfileBirdModal from "../../../components/modals/ProfileBirdModal";

import { useReactToPrint } from "react-to-print";
import { PhieuChiDinh } from "../../../components/pdfData/PhieuChiDinh";
import { api } from "../../../services/axios";


const ReTesting = () => {
  const { serviceFormDetailId } = useParams();
  const [tab, setTab] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openModalProfile, setOpenModalProfile] = useState(false);

  const [serviceFormDetailInfo, setServiceFormDetailInfo] = useState();

  const [testingData, setTestingData] = useState({
    description: "",
    suggestion: "",
    diagnosis: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestingData({
      ...testingData,
      [name]: value,
    });
  };

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await api.post(`/medicalRecord/`, testingData); // Directly use testingData from the state
  //     console.log("Data has been successfully submitted:", response.data);
  //     // Additional handling if required
  //   } catch (error) {
  //     console.error("Error submitting data:", error);
  //     // Error handling, if needed
  //   }
  // };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]; // Giả sử chỉ chọn một tệp
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(`/medicalRecord/`, formData, {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
        symptom: "any",
        diagnose: "any",
        recommendations: "any",
        type: "any",
        type_id: "any",
        is_before: "any",
        is_after: "any",
        type_service: "any",
      });
      console.log("Tệp đã được tải lên thành công:", response.data);
      // Xử lý thành công, nếu cần
    } catch (error) {
      console.error("Lỗi khi tải lên tệp:", error);
      // Xử lý lỗi, nếu cần
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
                Trả kết quả
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span className={`${tab === 3 ? styles.active : ""}`}>
                Hoàn tất
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
                    <label htmlFor="file">Tải lên file xét nghiệm</label>
                    <input
                      type="file"
                      name="file"
                      id="file"
                      onChange={handleFileUpload}
                    />
                    <p className={styles.fileInfo}>
                      *Dung lượng không vượt quá 5mb
                    </p>
                  </div>
                  <div className={styles.fileInput}>
                    <label htmlFor="description">Mô tả</label>
                    <input
                      type="text"
                      name="description"
                      id="description"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.fileInput}>
                    <label htmlFor="suggestion">Đề nghị</label>
                    <input
                      type="text"
                      name="suggestion"
                      id="suggestion"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.fileInput}>
                    <label htmlFor="diagnosis">Chẩn đoán</label>
                    <input
                      type="text"
                      name="diagnosis"
                      id="diagnosis"
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="submit">Gửi</button>
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
            <button className={styles.btnComplete}>Hoàn thành khám</button>
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
