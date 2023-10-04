import React, { useState } from "react";
import styles from "./styles/Examing.module.scss";
import ExaminationModal from "../../../components/modals/ExaminationModal";

const Examing = () => {
  const [tab, setTab] = useState(1);
  const [openModal, setOpenModal] = useState(false);
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
              <span
                className={`${tab === 1 ? styles.active : ""}`}
                onClick={() => setTab(1)}
              >
                Khám tổng thể
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span
                className={`${tab === 2 ? styles.active : ""}`}
                onClick={() => setTab(2)}
              >
                Yêu cầu dịch vụ
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span
                className={`${tab === 3 ? styles.active : ""}`}
                onClick={() => setTab(3)}
              >
                Kê thuốc
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span
                className={`${tab === 4 ? styles.active : ""}`}
                onClick={() => setTab(4)}
              >
                Hẹn tái khám
              </span>
            </div>
            {tab == 1 && (
              <div className={styles.examing}>
                <div className={styles.wtInfo}>
                  <div className={styles.inputItem}>
                    <label for="weight">Cân nặng</label>
                    <input type="text" name="weight" />
                  </div>
                  <div className={styles.inputItem}>
                    <label for="temperature">Nhiệt độ</label>
                    <input type="text" name="temperature" />
                  </div>
                </div>
                <div className={styles.inputItem}>
                  <label for="temperature">Triệu chứng</label>
                  <input type="text" name="temperature" />
                </div>
                <div className={styles.inputItem}>
                  <label for="temperature">Chẩn đoán</label>
                  <input type="text" name="temperature" />
                </div>
                <div className={styles.inputItem}>
                  <label for="temperature">Ghi chú thêm</label>
                  <textarea type="text" name="temperature" />
                </div>
              </div>
            )}
            {tab == 2 && (
              <div className={styles.examing}>
                <h3 className={styles.requireText}>
                  Yêu cầu các dịch vụ dưới đây (nếu có):
                </h3>
                <div className={styles.serviceItem}>
                  <input type="checkbox" name="temperature" />
                  <label for="temperature">Chụp phim Xray</label>
                </div>
                <div className={styles.serviceItem}>
                  <input type="checkbox" name="temperature" />
                  <label for="temperature">Xét nghiệm máu</label>
                </div>
                <div className={styles.serviceItem}>
                  <input type="checkbox" name="temperature" />
                  <label for="temperature">Phẫu thuật</label>
                </div>
                <div className={styles.serviceItem}>
                  <input type="checkbox" name="temperature" />
                  <label for="temperature">Kiểm tra DNA Sexing</label>
                </div>
                <div className={styles.serviceItem}>
                  <input type="checkbox" name="temperature" />
                  <label for="temperature">Xét nghiệm phân chim</label>
                </div>
                <div className={styles.serviceItem}>
                  <input type="checkbox" name="temperature" />
                  <label for="temperature">Nội soi</label>
                </div>
                <div className={styles.serviceItem}>
                  <input type="checkbox" name="temperature" />
                  <label for="temperature">Xét nghiệm bệnh truyền nhiễm</label>
                </div>
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
              <div className={styles.boxDataItem}>
                <ion-icon name="calendar-clear-outline"></ion-icon>
                <span>Hồ sơ chim khám</span>
              </div>
            </div>
            <button className={styles.btnComplete}>Hoàn thành khám</button>
            <button className={styles.btnHospitalize}>Nhập viện</button>
          </div>
        </div>
      </div>
      <ExaminationModal open={openModal} onClose={() => setOpenModal(false)} />
      <div className={styles.footerContent}>
        {tab !== 1 && (
          <button
            className={styles.btnBack}
            onClick={() => setTab((tab) => tab - 1)}
          >
            Quay lại
          </button>
        )}

        <button
          className={styles.btnCont}
          onClick={() => setTab((tab) => tab + 1)}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default Examing;
