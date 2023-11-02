import React from "react";
import styles from "./PrescriptionModal.module.scss";
import { RiDeleteBinLine } from "react-icons/ri";

const PrescriptionModal = ({ open, onClose, forms, examMedicineType}) => {
  if (!open) return null;
  // console.log('selectedUnit',selectedUnit);
  // console.log('medicineNames',medicineNames);
  // console.log('examMedicine',examMedicine);
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
            </tr>
          </thead>
          <tbody>
            {forms
              .filter((data, index) => index > -1) // Skip the undefined element
              .map((prescription, index) => (
                <tr key={index}>
                  <td>{prescription.selectedMedicine}</td>
                  <td>{prescription.amount} liều trong {prescription.day} ngày</td>
                  <td>{prescription.unit}</td>
                  <td>{prescription.type}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionModal;
