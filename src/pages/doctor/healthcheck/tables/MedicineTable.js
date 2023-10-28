import React, { useState } from "react";
import styles from "./MedicineTable.module.scss";

const MedicineTable = ({ onDelete, index, onUpdateData  }) => {
  //tab 3
  const [examMedicine, setExamMedicine] = useState({
    medicine: "",
    type: "",
    amount: "",
    unit: "",
    day: "",
  });

  const handleInputMedicine = (e) => {
    const { name, value } = e.target;
    setExamMedicine({
      ...examMedicine,
      [name]: value,
    });
    onUpdateData(index, examMedicine);
  };
  return (
    <div>
        <div className={styles.contentAll}>
            <h1>{index + 1}.Tên thuốc</h1>
            <h3>HDSD: cho ăn trước uống</h3>
        </div>
        <div className={styles.createFirst}>
            <div className={styles.First}>
            <p>Tên thuốc *</p>
            <select
                className={styles.DrugNameList}
                name="medicine"
                value={examMedicine.medicine}
                onChange={handleInputMedicine}
            >
                <option value="">Chọn thuốc</option>
                <option value="3B VIP INJ">3B VIP INJ</option>
                <option value="ACETYL C">ACETYL C</option>
                <option value="ADE BC COMPLEX">ADE BC COMPLEX</option>
                <option value="ADE BC INJ">ADE BC INJ</option>
                <option value="ALPHA TRYPSIN">ALPHA TRYPSIN</option>
                <option value="ALPHA TRYPSIN WSP">ALPHA TRYPSIN WSP</option>
                <option value="AMINO PHOSPHORIC">AMINO PHOSPHORIC</option>
                <option value="AMOX 15% LA">AMOX 15% LA</option>
                <option value="AMOX AC 50% NEW">AMOX AC 50% NEW</option>
            </select>
            </div>
            <div className={styles.First}>
            <p>Đơn vị</p>
            <select
                className={styles.TypeList}
                name="type"
                value={examMedicine.type}
                onChange={handleInputMedicine}
            >
                <option value="">--</option>
                <option value="Viên">Viên</option>
                <option value="Nước">Nước</option>
                <option value="Bột">Bột</option>
            </select>
            </div>
            <div className={styles.First}>
            <p>Số liều dùng</p>
            <select
                className={styles.AmountList}
                name="amount"
                value={examMedicine.amount}
                onChange={handleInputMedicine}
            >
                <option value="">--</option>{" "}
                {/* Tùy chọn mặc định */}
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
            </div>
        </div>
        <div className={styles.createSecond}>
            <div className={styles.Second}>
            <p>Đơn vị</p>
            <select
                className={styles.UnitList}
                name="unit"
                value={examMedicine.unit}
                onChange={handleInputMedicine}
            >
                <option value="">--</option>{" "}
                {/* Tùy chọn mặc định */}
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
            </div>
            <div className={styles.Second}>
            <p>Ngày</p>
            <select
                className={styles.DayList}
                name="day"
                value={examMedicine.day}
                onChange={handleInputMedicine}
            >
                <option value="">--</option>{" "}
                {/* Tùy chọn mặc định */}
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
            </div>
        </div>
        <div className={styles.createThird}>
            <p className={styles.txtThird}>Hướng dẫn sử dụng</p>
            <textarea
            type="text"
            name="temperature"
            className={styles.Instruct}
            />
        </div>
    </div>
  );
};

export default MedicineTable;