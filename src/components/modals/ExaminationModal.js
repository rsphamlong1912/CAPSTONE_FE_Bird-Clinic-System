import React from "react";
import styles from "./ExaminationModal.module.scss";

const ExaminationModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} className={styles.overlay}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={styles.modalContainer}
      >
        <p className={styles.closeBtn} onClick={onClose}>
          X
        </p>
        <div className={styles.container}>
          <div className={styles.InfText}>Nội dung khám</div>
          <div className={styles.element}>
            <h5>1. Khám tổng quát</h5>
            <table>
              <tr>
                <th>Cân nặng:</th>
                <td>1.2 Kg</td>
              </tr>
              <th>Nhiệt độ:</th>
              <td>36 độ C</td>
              <tr>
                <th>Biểu hiện lâm sàng:</th>
                <td>Dừ nhát, biếng ăn</td>
              </tr>
              <th>Chuẩn đoán:</th>
              <td>Thiếu chicken</td>
              <tr>
                <th>Ghi chú:</th>
                <td>0.8 Kg</td>
              </tr>
            </table>
            <h5>2. Yêu cầu dịch vụ</h5>
            <div className={styles.service}>Xét nghiệm máu</div>
            <div className={styles.service}>Xét nghiệm phân chim</div>
          </div>
          <img
            src="https://vnn-imgs-f.vgcloud.vn/2019/12/31/14/bai-thuoc-tu-chim-se-chua-nam-gioi-liet-duong-it-tinh.jpg"
            className={styles.image}
          />
          <div className={styles.idBrid}>ID: 1016781</div>
        </div>
      </div>
    </div>
  );
};

export default ExaminationModal;
