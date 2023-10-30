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
import ConfirmServiceModal from "../../../components/modals/ConfirmServiceModal";

import { message } from 'antd';

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
  const { bookingId } = useParams();
  const [tab, setTab] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openModalProfile, setOpenModalProfile] = useState(false);

  const [bookingInfo, setBookingInfo] = useState();
  const [birdProfile, setBirdProfile] = useState();

  const [openModalPrescription, setOpenModalPrescription] = useState(false);
  const [openModalConfirmService, setOpenModalConfirmService] = useState(false);

  //
  const [showInfo, setShowInfo] = useState(false);
  const [showButton, setShowButton] = useState(true);

  //
  const [date, setDate] = useState(new Date());

  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Đặt lịch tái khám thành công',
    });
  };
  const successAddmedicine = () => {
    messageApi.open({
      type: 'success',
      content: 'Thêm thuốc thành công',
    });
  };

  const showError = () => {
    messageApi.open({
      type: 'error',
      content: 'Vui lòng chọn ngày tái khám',
    });
  };


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
        const response = await api.put(`/booking/${bookingId}`, examData);
        console.log("put duoc roi ne:", response);
      } catch (error) {
        console.log(error);
      }
    };
    sendDataToApi();
  }, [tab]);

  const [accountId, setAccountId] = useState([]);
  const [birdId, setBirdId] = useState([]);
  const [veterinarianId, setVeterinarianId] = useState([]);
  const [customerName, setCustomerName] = useState([]);
  const [serviceType, setServiceType] = useState([]);
  const [serviceTypeId, setServiceTypeId] = useState([]);

  const [bookingData, setBookingData] = useState({
    account_id: "",
    bird_id: "",
    veterinarian_id: "",
    status: "re_exam",
    customer_name: "",
    note: "",
    service_type: "",
    service_type_id: "",
    arrival_date: "",
  });

  const handleInputSave = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });
  };

  const addBookingRe = () => {
    if (!bookingData.arrival_date) {
      showError();
      return; // Ngăn việc thực hiện Re-exam nếu arrival_date trống
    }
    try {

      const requestData = {
        account_id: accountId,
        bird_id: birdId,
        veterinarian_id: veterinarianId,
        status: bookingData.status,
        customer_name: customerName,
        note: bookingData.note,
        service_type: serviceType,
        service_type_id: serviceTypeId,
        arrival_date: bookingData.arrival_date,
      };

      const response = api.post(`/booking/re_exam`, requestData);
      console.log("Re-exam thanh cong:", response);
      success();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getBooking = async () => {
      try {
        const response = await api.get(`/booking/${bookingId}`);
        setBookingInfo(response.data.data);
        console.log("thong tin booking ne:", response.data.data);

        //cong them
        setAccountId(response.data.data.account_id);
        setBirdId(response.data.data.bird_id);
        setVeterinarianId(response.data.data.veterinarian_id);
        setCustomerName(response.data.data.customer_name);
        setServiceType(response.data.data.service_type);
        setServiceTypeId(response.data.data.service_type_id);

        // Only call getBirdProfile if bookingInfo is available
        if (response.data.data && response.data.data.bird_id) {
          getBirdProfile(response.data.data.bird_id);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getBirdProfile = async (birdId) => {
      try {
        const response = await api.get(`/bird/${birdId}`);
        setBirdProfile(response.data.data);
        console.log("thong tin chim ne:", response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getBooking();
  }, [bookingId]); // Assuming bookingId is a dependency needed to fetch data

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

    setPrescriptionData({
      ...prescriptionData,
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
        // const names = medicineData.map((medicine) => medicine.name);
        setMedicineNames(medicineData);
        console.log("adata:", medicineData);
      } catch (error) {
        console.log(error);
      }
    };
    sendApiforData();
  }, [tab]);

  const [timeSlotDate, setTimeSlotDate] = useState([]);

  useEffect(() => {
    const sendApiforData = async () => {
      try {
        const response = await api.get(`/time_slot_clinic/`);
        const timeSlotData = response.data.data;
        setTimeSlotDate(timeSlotData);
        console.log("data:", timeSlotData);
      } catch (error) {
        console.log(error);
      }
    };
    sendApiforData();

  }, [tab]);

  const uniqueDates = Array.from(new Set(timeSlotDate.map((timeSlot) => timeSlot.date)));

  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedMedicineId, setSelectedMedicineId] = useState("");

  // Thêm sự kiện xử lý khi tên thuốc được chọn
  const handleMedicineSelect = (e) => {
    const selectedMedicineName = e.target.value;
    setSelectedMedicine(selectedMedicineName);

    const { name, value } = e.target;
    setExamMedicineFirst({
      ...examMedicineFirst,
      [name]: value,
    });

    // Tìm đơn vị và cập nhật selectedUnit
    const unit = medicineNames
      .filter((timeSlot) => timeSlot.name === selectedMedicineName)[0]?.unit;
    setSelectedUnit(unit);

    // Find the selected medicine and get its medicine_id
    const selectedMedicine = medicineNames.find(
      (medicine) => medicine.name === selectedMedicineName
    );

    if (selectedMedicine) {
      setSelectedMedicineId(selectedMedicine.medicine_id);
    } else {
      setSelectedMedicineId(""); // Reset to empty if no medicine is selected
    }
  };

  const [examMedicineAmount, setExamMedicineAmount] = useState(0);

  useEffect(() => {
    // Tính toán giá trị amount khi unit hoặc day thay đổi
    if (examMedicineFirst.unit && examMedicineFirst.day) {
      setExamMedicineAmount(examMedicineFirst.unit * examMedicineFirst.day);
    }
  }, [examMedicineFirst.unit, examMedicineFirst.day]);

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


  ///
  const [prescriptionData, setPrescriptionData] = useState({
    booking_id: "",
    note: "",
    usage: "",
    arr_medicine: [
      {
        medicine_id: "",
        usage: "",
        total_dose: 0,
        dose: 0,
        day: 0,
      },
    ],
  });

  const addPrescriptionData = () => {
    // if (!prescriptionData.arrival_date) {
    //   showError();
    //   return; // Ngăn việc thực hiện Re-exam nếu arrival_date trống
    // }
    try {

      const requestData = {
        booking_id: bookingId,
        note: prescriptionData.note,
        // usage: "",
        arr_medicine: [
          {
            medicine_id: selectedMedicineId,
            // usage: "",
            total_dose: examMedicineAmount,
            dose: prescriptionData.unit,
            day: prescriptionData.day,
          },
        ],
      };

      const response = api.post(`/prescription/`, requestData);
      console.log("Add medicine thanh cong:", response);
      successAddmedicine();
    } catch (error) {
      console.log(error);
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
            <div className={styles.nameCustomer}>
              KH: {bookingInfo?.customer_name}
            </div>
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
                <button
                  className={styles.printService}
                  onClick={() => setOpenModalConfirmService(true)}
                >
                  Xác nhận
                </button>
                {/* <button className={styles.printService} onClick={handlePrint}>
                  In phiếu dịch vụ
                </button> */}
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
                              <p>Loại</p>
                              {medicineNames
                                .filter((timeSlot) => timeSlot.name === selectedMedicine)
                                .map((filteredSlot, index) => (
                                  <p className={styles.TypeList} key={index}>{filteredSlot.unit}</p>
                                ))}
                            </div>
                          )}
                          {examMedicineFirst.unit && examMedicineFirst.day && (
                            <div className={styles.First}>
                              <p>Số liều dùng</p>
                              <p
                                className={styles.AmountList}
                                name="amount"
                                value={examMedicineFirst.amount}
                              >{examMedicineFirst.unit * examMedicineFirst.day}</p>
                            </div>
                          )}

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
                        <div>
                          <button className={styles.AddMedicine} onClick={addPrescriptionData}>Xác nhận</button>
                          {contextHolder}
                        </div>

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
                  <select
                    className={styles.ChooseDay}
                    name="arrival_date"
                    value={bookingData.arrival_date}
                    onChange={handleInputSave}
                  >
                    <option value="">Select a Date</option>
                    <option value="2023-11-01">2023-11-01</option>
                    <option value="2023-11-02">2023-11-02</option>
                    <option value="2023-11-03">2023-11-03</option>
                  </select>
                </div>
                <textarea
                  type="text"
                  rows={5}
                  name="note"
                  className={styles.Note}
                  value={bookingData.note}
                  onChange={handleInputSave}
                />
                <div>
                  <button className={styles.btnAdd} onClick={addBookingRe}>+ Tạo</button>
                  {contextHolder}
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
        birdProfile={birdProfile}
        onClose={() => setOpenModalProfile(false)}
      />
      <PrescriptionModal
        open={openModalPrescription}
        onClose={() => setOpenModalPrescription(false)}
        examMedicine={examMedicine}
        examMedicineFirst={examMedicineFirst}
        examMedicineAmount={examMedicineAmount}
        examMedicineType={selectedUnit}
      />
      <ConfirmServiceModal
        open={openModalConfirmService}
        onClose={() => setOpenModalConfirmService(false)}
        selectedServices={selectedServices}
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
