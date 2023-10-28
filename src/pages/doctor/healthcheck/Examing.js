import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./styles/Examing.module.scss";
import ExaminationModal from "../../../components/modals/ExaminationModal";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { RiDeleteBinLine } from "react-icons/ri";
import "flatpickr/dist/flatpickr.css";
import Flatpickr from "react-flatpickr";
import ProfileBirdModal from "../../../components/modals/ProfileBirdModal";

import { useReactToPrint } from "react-to-print";
import { PhieuChiDinh } from "../../../components/pdfData/PhieuChiDinh";
import { api } from "../../../services/axios";

import MedicineTable from "./tables/MedicineTable";
import PrescriptionModal from "../../../components/modals/PrescriptionModal";

const serviceList = [
  {
    id: 1,
    name: "Chụp phim Xray",
    price: "280000",
  },
  {
    id: 2,
    name: "Xét nghiệm máu",
    price: "500000",
  },
  {
    id: 3,
    name: "Kiểm tra DNA Sexing",
    price: "260000",
  },
  {
    id: 4,
    name: "Xét nghiệm phân chim",
    price: "175000",
  },
  {
    id: 5,
    name: "Nội soi",
    price: "320000",
  },
  {
    id: 6,
    name: "Xét nghiệm bệnh truyền nhiễm",
    price: "250000",
  },
  {
    id: 7,
    name: "Phẫu thuật",
    price: "520000",
  },
];

const Examing = () => {
  const { id } = useParams();
  const [tab, setTab] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openModalProfile, setOpenModalProfile] = useState(false);
  const [openModalPrescription, setOpenModalPrescription] = useState(false);

  //
  const [showInfo, setShowInfo] = useState(false);
  const [showButton, setShowButton] = useState(true);

  //
  const [date, setDate] = useState(new Date());

  //tab 1
  const [examData, setExamData] = useState({
    weight: "",
    temperature: "",
    symptoms: "",
    diagnosis: "",
    additionalNotes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExamData({
      ...examData,
      [name]: value,
    });
  };

  //tab 2
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    const sendDataToApi = async () => {
      try {
        const response = await api.put(`/booking/${id}`, examData);
        console.log("api ne:", response);
      } catch (error) {
        console.log(error);
      }
    };
    sendDataToApi();
  }, [tab]);

  const toggleInfo = () => {
    setShowInfo(!showInfo);
    setShowButton(false); // Ẩn nút sau khi nhấp vào
  };

  //tab 3
  const [examMedicineFirst, setExamMedicineFirst] = useState({
    medicine: "",
    type: "",
    amount: "",
    unit: "",
    day: "",
  });

  const handleInputMedicineFirst = (e) => {
    const { name, value } = e.target;
    setExamMedicineFirst({
      ...examMedicineFirst,
      [name]: value,
    });
  };
  const [examMedicine, setExamMedicine] = useState([]);
  const updateMedicineData = (index, data) => {
    // Clone the current state and update the data for a specific index
    const updatedData = [...examMedicine];
    updatedData[index] = data;
    setExamMedicine(updatedData);
  };
  const [tables, setTables] = useState([]);
  const [tableCount, setTableCount] = useState(1);
  // Hàm này được sử dụng để thêm một bảng mới vào danh sách
  const createTable = () => {
    const newIndex = tableCount;

    // Tạo một instance mới của MedicineTable và truyền vào các prop

    const newTable = (
      <MedicineTable
        key={newIndex}
        index={newIndex}
        onUpdateData={updateMedicineData}
      />
    );

    // Tăng giá trị biến đếm để cho lần tạo tiếp theo
    setTableCount(newIndex + 1);

    // Cập nhật danh sách các bảng
    setTables([...tables, newTable]);

  };
  //tab 3 get api
  const [medicineNames, setMedicineNames] = useState([]);

  useEffect(() => {
    const sendApiforData = async () => {
      try {
        const response = await api.get(`/medicine/`);
        const medicineData = response.data.data;
        const names = medicineData.map((medicine) => medicine.name);
        setMedicineNames(names);
        console.log("adata:", names);
      } catch (error) {
        console.log(error);
      }
    };
    sendApiforData();
    
  }, [tab]);

  //Print
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleChange = (event) => {
    const serviceName = event.target.value;
    const selectedService = serviceList.find(
      (item) => item.name === serviceName
    );

    if (event.target.checked) {
      // Nếu checkbox được chọn, thêm dịch vụ vào danh sách đã chọn
      setSelectedServices([...selectedServices, selectedService]);
    } else {
      // Nếu checkbox được bỏ chọn, loại bỏ dịch vụ khỏi danh sách đã chọn
      setSelectedServices(
        selectedServices.filter((service) => service.name !== serviceName)
      );
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.left}>
            <ion-icon name="chevron-back-outline"></ion-icon>
            <span>Thoát</span>
          </div>
          <div className={styles.right}>
            <div className={styles.nameCustomer}>KH: Nguyễn Trí Công</div>
          </div>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.content}>
            <div className={styles.procedureTab}>
              <span
                className={`${tab === 1 ? styles.active : ""}`}
                onClick={() => setTab(1)}
              >
                Khám tổng thể
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span
                className={`${tab === 2 ? styles.active : ""}`}
                onClick={() => setTab(2)}
              >
                Yêu cầu dịch vụ
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span
                className={`${tab === 3 ? styles.active : ""}`}
                onClick={() => setTab(3)}
              >
                Kê thuốc
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span
                className={`${tab === 4 ? styles.active : ""}`}
                onClick={() => setTab(4)}
              >
                Hẹn tái khám
              </span>
            </div>
            {tab == 1 && (
              <div className={styles.examing}>
                <div className={styles.wtInfo}>
                  <div className={styles.inputItem}>
                    <label htmlFor="weight">Cân nặng</label>
                    <input
                      type="text"
                      name="weight"
                      value={examData.weight}
                      onChange={handleInputChange}
                      id="weight"
                    />
                  </div>
                  <div className={styles.inputItem}>
                    <label htmlFor="temperature">Nhiệt độ</label>
                    <input
                      type="text"
                      name="temperature"
                      value={examData.temperature}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.inputItem}>
                  <label htmlFor="temperature">Triệu chứng</label>
                  <input
                    type="text"
                    name="symptoms"
                    value={examData.symptoms}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.inputItem}>
                  <label htmlFor="temperature">Chẩn đoán</label>
                  <input
                    type="text"
                    name="diagnosis"
                    value={examData.diagnosis}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.inputItem}>
                  <label htmlFor="temperature">Ghi chú thêm</label>
                  <textarea
                    name="additionalNotes"
                    value={examData.additionalNotes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            {tab == 2 && (
              <div className={styles.examing}>
                <h3 className={styles.requireText}>
                  Yêu cầu các dịch vụ dưới đây (nếu có):
                </h3>
                {serviceList.map((item, index) => (
                  <div className={styles.serviceItem} key={index}>
                    <input
                      type="checkbox"
                      name="temperature"
                      value={item.name}
                      checked={selectedServices.some(
                        (service) => service.name === item.name
                      )}
                      onChange={handleChange}
                    />
                    <label htmlFor="temperature">{item.name}</label>
                  </div>
                ))}
                <div style={{ display: "none" }}>
                  <PhieuChiDinh
                    ref={printRef}
                    selectedServices={selectedServices}
                  ></PhieuChiDinh>
                </div>
                <button className={styles.printService} onClick={handlePrint}>
                  In phiếu dịch vụ
                </button>
              </div>
            )}
            {tab == 3 && (
              <div className={styles.examing}>
                <div className={styles.create}>
                  {showButton && (
                    <button className={styles.btnCreate} onClick={toggleInfo}>
                      + Thêm thuốc
                    </button>
                  )}
                  {showInfo && (
                    <div className={styles.createAll}>
                      <div className={styles.scrollableblock}>
                        <div className={styles.contentAll}>
                            <h1>1.Tên thuốc</h1>
                            <h3>HDSD: cho ăn trước uống</h3>
                        </div>
                        <div className={styles.createFirst}>
                            <div className={styles.First}>
                            <p>Tên thuốc *</p>
                            <select
                                className={styles.DrugNameList}
                                name="medicine"
                                value={examMedicineFirst.medicine}
                                onChange={handleInputMedicineFirst}
                            >
                                <option value="">Chọn thuốc</option>
                                {medicineNames.map((name) => (
                                  <option key={name} value={name}>
                                    {name}
                                  </option>
                                ))}
                            </select>
                            </div>
                            <div className={styles.First}>
                            <p>Đơn vị</p>
                            <select
                                className={styles.TypeList}
                                name="type"
                                value={examMedicineFirst.type}
                                onChange={handleInputMedicineFirst}
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
                                value={examMedicineFirst.amount}
                                onChange={handleInputMedicineFirst}
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
                                value={examMedicineFirst.unit}
                                onChange={handleInputMedicineFirst}
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
                                value={examMedicineFirst.day}
                                onChange={handleInputMedicineFirst}
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
                        {tables}
                      </div>

                      {/* <button className={styles.AddMedicine}>
                        + Thêm thuốc
                      </button> */}
                      <div className={styles.boxMedicine}>
                        <button
                          onClick={createTable}
                          className={styles.AddMedicine}
                        >
                          + Thêm thuốc
                        </button>

                        <div
                          className={styles.PrintMedicine}
                          onClick={() => setOpenModalPrescription(true)}
                        >
                          <ion-icon name="thermometer-outline"></ion-icon>
                          <span>Xem đơn thuốc</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {tab == 4 && (
              <div className={styles.create}>
                <div className={styles.SelectDate}>
                  {/* <AiOutlineCalendar/> */}
                  <Flatpickr
                    className={styles.Calendar}
                    value={date} // giá trị ngày tháng
                    // các option thêm cho thư viện
                    options={{
                      dateFormat: "d-m-Y", // format ngày giờ
                    }}
                    // event
                    onChange={(dateSelect) => setDate(dateSelect)}
                  />
                  <button className={styles.btnDone}>Done</button>
                </div>
                <input className={styles.Note} />
                <div>
                  <button className={styles.btnAdd}>+ Tạo</button>
                </div>
              </div>
            )}
          </div>
          <div className={styles.metaContent}>
            <div className={styles.boxData}>
              <div
                className={styles.boxDataItem}
                onClick={() => setOpenModal(true)}
              >
                <ion-icon name="thermometer-outline"></ion-icon>
                <span>Nội dung khám</span>
              </div>
              <div
                className={styles.boxDataItem}
                onClick={() => setOpenModalProfile(true)}
              >
                <ion-icon name="calendar-clear-outline"></ion-icon>
                <span>Hồ sơ chim khám</span>
              </div>
            </div>
            <button className={styles.btnComplete}>Hoàn thành khám</button>
            <button className={styles.btnHospitalize}>Nhập viện</button>
          </div>
        </div>
      </div>
      <ExaminationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        examData={examData}
        selectedServices={selectedServices}
      />
      <ProfileBirdModal
        open={openModalProfile}
        onClose={() => setOpenModalProfile(false)}
      />
      <PrescriptionModal
        open={openModalPrescription}
        onClose={() => setOpenModalPrescription(false)}
        examMedicine={examMedicine}
        examMedicineFirst={examMedicineFirst}
      />
      <div className={styles.footerContent}>
        {tab !== 1 && (
          <button
            className={styles.btnBack}
            onClick={() => setTab((tab) => tab - 1)}
          >
            Quay lại
          </button>
        )}

        <button
          className={styles.btnCont}
          onClick={() => setTab((tab) => tab + 1)}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default Examing;
