import React from "react";
import styles from "./ProfileBirdModal.module.scss";

const ProfileBirdModal = ({ open, onClose }) => {
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
          <div className={styles.InfText}>Hồ sơ chim khám</div>
          <div className={styles.element}>
            <h5>THÔNG TIN CHIM</h5>
            <table>
              <tr>
                <th>Họ tên</th>
                <td>Con chim xanh</td>
              </tr>
              <th>Ngày nở</th>
              <td>21/03/2022</td>
              <tr>
                <th>Giới tính</th>
                <td>Đực</td>
              </tr>
              <th>Màu sắc</th>
              <td>Xanh</td>
              <tr>
                <th>Cân nặng</th>
                <td>0.8 Kg</td>
              </tr>
              <th>Microchip</th>
              <td>Không có</td>
              <tr>
                <th>Giống</th>
                <td>Không</td>
              </tr>
            </table>
          </div>
          <div className={styles.history}>
            <img src="https://vnn-imgs-f.vgcloud.vn/2019/12/31/14/bai-thuoc-tu-chim-se-chua-nam-gioi-liet-duong-it-tinh.jpg" />
            <div className={styles.historyText}>Lịch sử</div>
            <div className={styles.infHS}>
              <p>1. Khám tổng quát</p>
              <p>15/08/2023</p>
              <button>Xem kết quả</button>
            </div>
            <div className={styles.infHS}>
              <p>2. Chụp X-ray</p>
              <p>20/08/2023</p>
              <button>Xem kết quả</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBirdModal;
