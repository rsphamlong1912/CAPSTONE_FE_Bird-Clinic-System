import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ReTesting.module.scss";
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

const ReTesting = () => {
  const { id } = useParams();
  const [tab, setTab] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openModalProfile, setOpenModalProfile] = useState(false);

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

  const [selectedMedicine, setSelectedMedicine] = useState(""); // State để lưu giá trị đã chọn
  const [selectedType, setSelectedType] = useState(""); // State để lưu giá trị đã chọn
  const [selectedAmount, setSelectedAmount] = useState(""); // State để lưu giá trị đã chọn
  const [selectedUnit, setSelectedUnit] = useState(""); // State để lưu giá trị đã chọn
  const [selectedDay, setSelectedDay] = useState(""); // State để lưu giá trị đã chọn

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
  const [tables, setTables] = useState([]);
  const [tableCount, setTableCount] = useState(1);

  // Hàm này được sử dụng để thêm một bảng mới vào danh sách
  const createTable = () => {
    const newIndex = tableCount;

    // Tạo một instance mới của MedicineTable và truyền vào các prop
    const newTable = <MedicineTable key={newIndex} index={newIndex} />;
    // Tăng giá trị biến đếm để cho lần tạo tiếp theo
    setTableCount(newIndex + 1);

    // Cập nhật danh sách các bảng
    setTables([...tables, newTable]);
  };

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
                Thông tin tiếp nhận
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span
                className={`${tab === 2 ? styles.active : ""}`}
                onClick={() => setTab(2)}
              >
                Trả kết quả
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span
                className={`${tab === 3 ? styles.active : ""}`}
                onClick={() => setTab(3)}
              >
                Hoàn tất
              </span>
            </div>
            {tab == 1 && (
              <div className={styles.retesting}>
                <h2 className={styles.title}>Xét nghiệm</h2>
                <div className={styles.lineItem}>
                  <span className={styles.label}>Mã số:</span>
                  <span>HCO012J6</span>
                </div>
                <div className={styles.lineItem}>
                  <span className={styles.label}>Tên khách hàng:</span>
                  <span>Nguyễn Trí Công</span>
                </div>
                <div className={styles.lineItem}>
                  <span className={styles.label}>Tên chim:</span>
                  <span>Vẹt xanh</span>
                </div>
                <div className={styles.lineItem}>
                  <span className={styles.label}>Chỉ định:</span>
                  <div className={styles.selectServices}>
                    <span>Nội soi</span>
                    <span>Xét nghiệm ADN</span>
                  </div>
                </div>
              </div>
            )}
            {tab == 2 && (
              <div className={styles.retesting}>
                <h2 className={styles.title}>Trả kết quả xét nghiệm</h2>
                <form>
                  <div className={styles.fileInput}>
                    <label for="file">Tải lên file xét nghiệm</label>
                    <input type="file" name="file" id="file" />
                    <p className={styles.fileInfo}>
                      *Dung lượng không vượt quá 5mb
                    </p>
                  </div>
                  <div className={styles.fileInput}>
                    <label for="description">Mô tả</label>
                    <input type="text" name="description" id="description" />
                  </div>
                  <div className={styles.fileInput}>
                    <label for="suggestion">Đề nghị</label>
                    <input type="text" name="suggestion" id="suggestion" />
                  </div>
                  <div className={styles.fileInput}>
                    <label for="diagnosis">Chẩn đoán</label>
                    <input type="text" name="diagnosis" id="diagnosis" />
                  </div>
                </form>
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

export default ReTesting;
