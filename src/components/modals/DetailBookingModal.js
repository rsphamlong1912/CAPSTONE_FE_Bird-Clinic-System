import React, { useEffect, useState } from "react";
import styles from "./DetailBookingModal.module.scss";
import { api } from "../../services/axios";

const DetailBookingModal = ({ open, onClose, bookingSelectedInfo }) => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [selectedVet, setSelectedVet] = useState("");

  const fetchVeterinarians = async () => {
    try {
      const responseVeterinarians = await api.get(`/vet`);
      setVeterinarians(responseVeterinarians.data.data);
      console.log("fetch", responseVeterinarians.data.data);
    } catch (error) {
      console.error("Error fetching veterinarians:", error);
    }
  };

  useEffect(() => {
    fetchVeterinarians();
  }, []);

  const handleVetSelection = (event) => {
    setSelectedVet(event.target.value);
  };

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
          <div className={styles.InfText}>Thông tin cuộc hẹn</div>
          <div className={styles.element}>
            <h5>THÔNG TIN CHUNG</h5>
            <table>
              <tbody>
                <tr>
                  <th>Tên dịch vụ</th>
                  <td>{bookingSelectedInfo?.service_type}</td>
                </tr>
                <tr>
                  <th>Tên khách hàng</th>
                  <td>{bookingSelectedInfo?.customer_name}</td>
                </tr>
                <tr>
                  <th>Số điện thoại</th>
                  <td>{bookingSelectedInfo?.bird.customer.phone}</td>
                </tr>
                <tr>
                  <th>Tên chim</th>
                  <td>{bookingSelectedInfo?.bird.name}</td>
                </tr>
                <tr>
                  <th>Giờ checkin</th>
                  <td>{bookingSelectedInfo?.checkin_time}</td>
                </tr>
                <tr>
                  <th>Bác sĩ phụ trách</th>
                  <select
                    onChange={handleVetSelection}
                    className={styles.selectVet}
                  >
                    {veterinarians.map((vet) => {
                      if (vet.name === bookingSelectedInfo?.veterinarian.name) {
                        return (
                          <option
                            key={vet.veterinarian_id}
                            value={vet.name}
                            selected={true}
                          >
                            {vet.name}
                          </option>
                        );
                      } else {
                        return (
                          <option key={vet.veterinarian_id} value={vet.name}>
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
      </div>
    </div>
  );
};

export default DetailBookingModal;
