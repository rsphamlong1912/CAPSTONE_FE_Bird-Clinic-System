import React, { useState } from "react";
import styles from "./MedicineTable.module.scss";

const MedicineTable = ({ onDelete, index }) => {
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const handleChangeMedicine = (event) => {
    setSelectedMedicine(event.target.value); // Cập nhật giá trị đã chọn khi người dùng thay đổi
  };
  const handleChangeType = (event) => {
    setSelectedType(event.target.value); // Cập nhật giá trị đã chọn khi người dùng thay đổi
  };
  const handleChangeAmount = (event) => {
    setSelectedAmount(event.target.value); // Cập nhật giá trị đã chọn khi người dùng thay đổi
  };
  const handleChangeUnit = (event) => {
    setSelectedUnit(event.target.value); // Cập nhật giá trị đã chọn khi người dùng thay đổi
  };
  const handleChangeDay = (event) => {
    setSelectedDay(event.target.value); // Cập nhật giá trị đã chọn khi người dùng thay đổi
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
              value={selectedMedicine}
              onChange={handleChangeMedicine}
            >
              <option value="">Chọn thuốc</option>
              <option value="1">3B VIP INJ</option>
              <option value="2">ACETYL C</option>
              <option value="3">ADE BC COMPLEX</option>
              <option value="4">ADE BC INJ</option>
              <option value="5">ALPHA TRYPSIN</option>
              <option value="6">ALPHA TRYPSIN WSP</option>
              <option value="7">AMINO PHOSPHORIC</option>
              <option value="8">AMOX 15% LA</option>
              <option value="9">AMOX AC 50% NEW</option>
            </select>
          </div>
          <div className={styles.First}>
            <p>Đơn vị</p>
            <select
              className={styles.TypeList}
              value={selectedType}
              onChange={handleChangeType}
            >
              <option value="">--</option>
              <option value="1">Viên</option>
              <option value="2">Nước</option>
              <option value="3">Bột</option>
            </select>
          </div>
          <div className={styles.First}>
            <p>Số liều dùng</p>
            <select
              className={styles.AmountList}
              value={selectedAmount}
              onChange={handleChangeAmount}
            >
              <option value="">--</option> {/* Tùy chọn mặc định */}
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
              value={selectedUnit}
              onChange={handleChangeUnit}
            >
              <option value="">--</option> {/* Tùy chọn mặc định */}
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
              value={selectedDay}
              onChange={handleChangeDay}
            >
              <option value="">--</option> {/* Tùy chọn mặc định */}
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
          <div className={styles.createThird}>
            <p className={styles.txtThird}>Hướng dẫn sử dụng</p>
            <textarea
              type="text"
              name="temperature"
              className={styles.Instruct}
            />
          </div>
        </div>
    </div>
  );
};

export default MedicineTable;