import React, { useRef } from "react";
import styles from "./ConfirmServiceModal.module.scss";
import { useReactToPrint } from "react-to-print";
import { PhieuChiDinh } from "../pdfData/PhieuChiDinh";
import { useNavigate } from "react-router-dom";

const ConfirmServiceModal = ({ open, onClose, selectedServices }) => {
  const navigate = useNavigate();
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
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
        <div className={styles.InfText}>Thông tin xét nghiệm</div>
        <div style={{ display: "none" }}>
          <PhieuChiDinh
            ref={printRef}
            selectedServices={selectedServices}
          ></PhieuChiDinh>
        </div>
        <div className={styles.container}>
          <div className={styles.element}>
            {selectedServices.map((item, index) => (
              <div key={index}>{item.package_name}</div>
            ))}
            <button
              className={styles.printService}
              onClick={() => navigate("/examing")}
            >
              Hoàn tất
            </button>

            <button className={styles.printService} onClick={handlePrint}>
              In phiếu chỉ định
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmServiceModal;
