import React from "react";
import styles from "./PrescriptionModal.module.scss";
import { RiDeleteBinLine } from "react-icons/ri";

const PrescriptionModal = ({ open, onClose, examMedicine, examMedicineFirst }) => {
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
        <h2>Toa thuốc</h2>
        <table>
          <thead>
            <tr>
              <th>Tên thuốc</th>
              <th>Liều lượng</th>
              <th>Đơn vị</th>
              <th>Loại</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{examMedicineFirst.medicine}</td>
              <td>{examMedicineFirst.amount} liều trong {examMedicineFirst.day} ngày</td>
              <td>{examMedicineFirst.unit}</td>
              <td>{examMedicineFirst.type}</td>
              <td>
                <RiDeleteBinLine
                  className={styles.btnDelete}
                />
              </td>
            </tr>
            {examMedicine
              .filter((data, index) => index > 0) // Skip the undefined element
              .map((prescription, index) => (
                <tr key={index}>
                  <td>{prescription.medicine}</td>
                  <td>{prescription.amount} liều trong {prescription.day} ngày</td>
                  <td>{prescription.unit}</td>
                  <td>{prescription.type}</td>
                  <td>
                    <RiDeleteBinLine className={styles.btnDelete} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionModal;
