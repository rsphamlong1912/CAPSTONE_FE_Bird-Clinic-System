import React, { useState, useRef, useEffect } from "react";
import styles from "./MediaGroomingModal.module.scss";
import { api } from "../../services/axios";

const MediaGroomingModal = ({ open, onClose, formDetailId }) => {
  const [beforeGroomingImages, setBeforeGroomingImages] = useState([]);
  const [afterGroomingImages, setAfterGroomingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getMediaImage = async () => {
      try {
        const response = await api.get(`/media/?type=service_form_details&type_id=${formDetailId}`);
        const images = response.data.data;

        const beforeGroomingLinks = images.filter(img => img.is_before).map(img => img.link);
        const afterGroomingLinks = images.filter(img => img.is_after).map(img => img.link);

        setBeforeGroomingImages(beforeGroomingLinks);
        setAfterGroomingImages(afterGroomingLinks);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    // Check if the modal is open before fetching data
    if (open) {
      setLoading(true); // Set loading to true before starting the API call
      setTimeout(() => {
        getMediaImage();
      }, 1000);
    }
  }, [open, formDetailId]);

  if (!open) {
    return null;
  }
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
          <div className={styles.InfText}>Hồ sơ chăm sóc</div>
          <div className={styles.element}>
            <p>Trước grooming</p>
            {loading ? (
              <p>Loading...</p>
            ) : (
              beforeGroomingImages.map((link, index) => (
                <img key={index} src={link} alt={`Before Grooming ${index}`} />
              ))
            )}
          </div>
          <div className={styles.history}>
            <p>Sau grooming</p>
            {loading ? (
              <p>Loading...</p>
            ) : (
              afterGroomingImages.map((link, index) => (
                <img key={index} src={link} alt={`After Grooming ${index}`} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaGroomingModal;
