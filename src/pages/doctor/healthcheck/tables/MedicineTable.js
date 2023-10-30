import React, { useState, useRef, useEffect } from "react";
import styles from "./MedicineTable.module.scss";
import { api } from "../../../../services/axios";

const MedicineTable = ({ onDelete, index, onUpdateData }) => {
    //tab 3
    const [examMedicine, setExamMedicine] = useState({
        medicine: "",
        type: "",
        amount: 0,
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

    //tab 3 get api
    const [medicineNames, setMedicineNames] = useState([]);

    useEffect(() => {
        const sendApiforData = async () => {
            try {
                const response = await api.get(`/medicine/`);
                const medicineData = response.data.data;
                // const names = medicineData.map((medicine) => medicine.name);
                setMedicineNames(medicineData);
                console.log("adata:", medicineData);
            } catch (error) {
                console.log(error);
            }
        };
        sendApiforData();

    }, []);

    const [selectedMedicine, setSelectedMedicine] = useState("");
    const [selectedUnit, setSelectedUnit] = useState("");
    // Thêm sự kiện xử lý khi tên thuốc được chọn
    const handleMedicineSelect = (e) => {
        const selectedMedicineName = e.target.value;
        setSelectedMedicine(selectedMedicineName);

        const { name, value } = e.target;
        setExamMedicine({
            ...examMedicine,
            [name]: value,
        });

        // Tìm đơn vị và cập nhật selectedUnit
        const unit = medicineNames
            .filter((timeSlot) => timeSlot.name === selectedMedicineName)[0]?.unit;
        setSelectedUnit(unit);
    };

    const [MedicineAmount, setMedicineAmount] = useState(0);

    useEffect(() => {
        // Tính toán giá trị amount khi unit hoặc day thay đổi
        if (examMedicine.unit && examMedicine.day) {
            setMedicineAmount(examMedicine.unit * examMedicine.day);
        }
    }, [examMedicine.unit, examMedicine.day]);

    // console.log('MedicineAmount',MedicineAmount);
    // console.log('selectedUnit',selectedUnit);
    // console.log('examMedicine',examMedicine);

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
                        value={selectedMedicine}
                        onChange={handleMedicineSelect}
                    >
                        <option value="">Chọn thuốc</option>
                        {medicineNames.map((medicine) => (
                            <option
                                key={medicine.medicine_id}
                                value={medicine.name}
                            >
                                {medicine.name}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedMedicine && (  // Hiển thị đơn vị khi đã chọn tên thuốc
                    <div className={styles.First}>
                        <p>Đơn vị</p>
                        {medicineNames
                            .filter((timeSlot) => timeSlot.name === selectedMedicine)
                            .map((filteredSlot, index) => (
                                <p className={styles.TypeList} key={index}>{filteredSlot.unit}</p>
                            ))}
                    </div>
                )}
                {examMedicine.unit && examMedicine.day && (
                    <div className={styles.First}>
                        <p>Số liều dùng</p>
                        <p
                            className={styles.AmountList}
                            name="amount"
                            value={examMedicine.amount}
                        >{examMedicine.unit * examMedicine.day}</p>
                    </div>
                )}
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