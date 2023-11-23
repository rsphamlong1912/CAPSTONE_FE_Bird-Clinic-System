import React from "react";
import styles from "./ProfileBirdModal.module.scss";

const ProfileBirdModal = ({ open, onClose, birdProfile, birdProfileBreed }) => {
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
              <tbody>
                <tr>
                  <th>Tên</th>
                  <td>{birdProfile?.name}</td>
                </tr>
                <tr>
                  <th>Ngày nở</th>
                  <td>{birdProfile?.hatching_date}</td>
                </tr>
                <tr>
                  <th>Giới tính</th>
                  <td>{birdProfile?.gender}</td>
                </tr>
                <tr>
                  <th>Màu sắc</th>
                  <td>{birdProfile?.color}</td>
                </tr>
                <tr>
                  <th>Cân nặng</th>
                  <td>{birdProfile?.weight} gam</td>
                </tr>
                <tr>
                  <th>Microchip</th>
                  <td>{birdProfile?.ISO_microchip}</td>
                </tr>
                <tr>
                  <th>Giống</th>
                  <td>{birdProfileBreed}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.history}>
            <img
              src={birdProfile?.image}
              className={styles.image}
              alt={birdProfile?.name}
            />
            <div className={styles.historyText}>Lịch sử</div>
            <div className={styles.infHS}>
              <p>1. Khám tổng quát</p>
              <p>15/08/2023</p>
              <button className={styles.button}>Xem kết quả</button>
            </div>
            <div className={styles.infHS}>
              <p>2. Chụp X-ray</p>
              <p>20/08/2023</p>
              <button className={styles.button}>Xem kết quả</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBirdModal;
