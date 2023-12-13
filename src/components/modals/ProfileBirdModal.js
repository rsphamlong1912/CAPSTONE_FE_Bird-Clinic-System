import React, { useState, useRef, useEffect } from "react";
import styles from "./ProfileBirdModal.module.scss";
import { api } from "../../services/axios";
import MediaGroomingModal from "./MediaGroomingModal";

const ProfileBirdModal = ({ open, onClose, birdProfile, birdProfileBreed, bookingID }) => {
  const [serviceFormDetails, setServiceFormDetails] = useState([]);
  const [serviceFormDate, setServiceFormDate] = useState([]);
  const [packageDetails, setPackageDetails] = useState([]);
  const [formDetailId, setFormDetailId] = useState([]);
  const [openModalMediaGrooming, setOpenModalMediaGrooming] = useState(false);

  
  useEffect(() => {
    const getServiceFormDetails = async () => {
      try {
        const response = await api.get(`/service-form/?booking_id=${bookingID}`);
        setServiceFormDetails(response.data.data[0].service_form_details);
        setServiceFormDate(response.data.data[0]);
        // setFormDetailId(response.data.data[0].service_form_details.map((id) => id.service_form_detail_id))
      } catch (error) {
        console.log(error);
      }
    };
    

    const getPackageDetails = async () => {
      try {
        const response = await api.get(`/service-package`);
        const packageData = response.data.data;
        const details = {};

        packageData.forEach((packageInfo) => {
          details[packageInfo.service_package_id] = packageInfo.package_name;
        });

        setPackageDetails(details);
      } catch (error) {
        console.log(error);
      }
    };
    // Check if the modal is open before fetching data
    if (open) {
      getServiceFormDetails();
      getPackageDetails();
    }
  }, [open, bookingID]);
  if (!open) {
    return null;
  }
  // console.log("serviceFormDetails", formDetailId)
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
            {serviceFormDetails.map((service, index) => (
              <div key={index} className={styles.infHS}>
                <p className={styles.infHSName}>{`${index + 1}. ${packageDetails[service.service_package_id] || 'Unknown Package'}`}</p>
                <p className={styles.infHSDate}>{new Date(serviceFormDate.date).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                <button
                  className={styles.button}
                  onClick={() => {
                    // Log the service_package_id
                    setFormDetailId(service.service_form_detail_id)
                    // Open the MediaGroomingModal
                    setOpenModalMediaGrooming(true);
                  }}
                >
                  Xem kết quả
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MediaGroomingModal
        open={openModalMediaGrooming}
        formDetailId={formDetailId}
        onClose={() => setOpenModalMediaGrooming(false)}
      />
    </div>
  );
};

export default ProfileBirdModal;
