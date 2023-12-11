import React, { useState, useRef, useEffect } from "react";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles/Examing.module.scss";
import ExaminationModal from "../../../components/modals/ExaminationModal";
import "reactjs-popup/dist/index.css";
import { RiDeleteBinLine } from "react-icons/ri";
import "flatpickr/dist/flatpickr.css";
import ProfileBirdModal from "../../../components/modals/ProfileBirdModal";

import { useReactToPrint } from "react-to-print";
import { PhieuChiDinh } from "../../../components/pdfData/PhieuChiDinh";
import { api } from "../../../services/axios";

import PrescriptionModal from "../../../components/modals/PrescriptionModal";
import ConfirmServiceModal from "../../../components/modals/ConfirmServiceModal";
import { DonThuoc } from "../../../components/pdfData/DonThuoc";

import { message } from "antd";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import io from "socket.io-client";
import Popup from "reactjs-popup";
import { PhieuKetQua } from "../../../components/pdfData/PhieuKetQua";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
const socket = io("https://clinicsystem.io.vn/");

const Examing = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openModalProfile, setOpenModalProfile] = useState(false);

  const [bookingInfo, setBookingInfo] = useState();
  const [serviceFormDetail, setServiceFormDetail] = useState();
  const [serviceFormDetailSideArr, setServiceFormDetailSideArr] = useState();
  const [serviceFormDetailSideIdArr, setServiceFormDetailSideIdArr] =
    useState();
  const [medicalRecordData, setMedicalRecordData] = useState([]);
  const [imgUrl, setImgUrl] = useState();
  const [birdProfile, setBirdProfile] = useState();

  const [openModalPrescription, setOpenModalPrescription] = useState(false);
  const [openModalConfirmService, setOpenModalConfirmService] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [serviceFormList, setServiceFormList] = useState();

  const openPopup = async (id) => {
    const responseImgUrl = await api.get(
      `/media/?type=service_form_details&type_id=${id}`
    );
    if (responseImgUrl.data.data[0]?.link) {
      setImgUrl(responseImgUrl.data.data[0]?.link);
    } else {
      setImgUrl(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Flag_of_None.svg/1024px-Flag_of_None.svg.png"
      );
    }
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const [serviceList, setServiceList] = useState([]);
  //
  const [showInfo, setShowInfo] = useState(false);
  const [showButton, setShowButton] = useState(true);

  //cong
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState();

  const isPastDate = (checkDate) => {
    const today = new Date();
    return checkDate < today;
  };
  const onChange = (newDate) => {
    setDate(newDate);

    if (!isPastDate(newDate)) {
      // Lấy năm, tháng và ngày từ đối tượng Date và in ra console
      const year = newDate.getFullYear();
      const month = newDate.getMonth() + 1; // Lưu ý rằng tháng bắt đầu từ 0
      const day = newDate.getDate();
      // Tạo chuỗi định dạng
      const formatted = `${year}-${month}-${day}`;
      setFormattedDate(formatted);
      console.log(`Selected Date: ${formatted}`);
    }
  };

  const tileDisabled = ({ date }) => {
    return isPastDate(date);
  };

  useEffect(() => {
    setTimeout(() => {
      console.log("socket id detail: ", socket.id);
      socket.emit("login", { account_id: localStorage.getItem("account_id") });
      console.log("Login sucess");
    }, 500);
  }, []);

  //GET DỊCH VỤ TỪ API
  useEffect(() => {
    const fetchServiceList = async () => {
      try {
        const response = await api.get(`/service-package/?size_id=SZ005`);

        const filteredServiceList = response.data.data.filter(
          (servicePackage) =>
            !["SP1", "SP9", "SP10"].includes(servicePackage.service_package_id)
        );
        setServiceList(filteredServiceList);
      } catch (error) {
        console.log(error);
      }
    };
    fetchServiceList();
  }, []);

  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Đặt lịch tái khám thành công",
    });
  };
  const successAddmedicine = () => {
    messageApi.open({
      type: "success",
      content: "Thêm thuốc thành công",
    });
  };

  const showError = () => {
    messageApi.open({
      type: "error",
      content: "Vui lòng chọn ngày tái khám",
    });
  };

  //tab 1
  const [examData, setExamData] = useState({
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
    is_re_exam: "true",
  });

  const handleInputSave = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });
  };

  const addBookingRe = () => {
    if (!formattedDate) {
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
        arrival_date: formattedDate,
        is_re_exam: bookingData.is_re_exam,
      };

      const response = api.post(`/booking/re-exam`, requestData);
      console.log("Re-exam thanh cong:", response);
      success();
    } catch (error) {
      console.log(error);
    }
  };

  //LẤY THÔNG TIN BOOKING
  useEffect(() => {
    const getBooking = async () => {
      try {
        const response = await api.get(
          `/booking/${bookingId}?service_type_id=ST001`
        );
        setBookingInfo(response.data.data[0]);
        console.log("thong tin booking ne:", response.data.data[0]);

        //cong them
        setAccountId(response.data.data[0].account_id);
        setBirdId(response.data.data[0].bird_id);
        setVeterinarianId(response.data.data[0].veterinarian_id);
        setCustomerName(response.data.data[0].customer_name);
        setServiceType(response.data.data[0].service_type);
        setServiceTypeId(response.data.data[0].service_type_id);
        setExamData({
          symptoms: response.data.data[0].symptom,
          diagnosis: response.data.data[0].diagnosis,
          additionalNotes: response.data.data[0].recommendations,
        });

        // Only call getBirdProfile if bookingInfo is available
        if (response.data.data[0] && response.data.data[0].bird_id) {
          getBirdProfile(response.data.data[0].bird_id);
        }
        if (response.data.data[0] && response.data.data[0].process_at) {
          setTab(response.data.data[0].process_at);
          console.log("Set tab r nha", response.data.data[0].process_at);
        }

        //GET SERVICE FORM DETAIL
        const responseServiceFormDetail = await api.get(
          `/service-form-detail/?booking_id=${bookingId}&service_type_id=ST001`
        );
        console.log("form detail ne nha", responseServiceFormDetail.data.data);
        setServiceFormDetail(responseServiceFormDetail.data.data[0]);

        //GET SERVICE FORM
        const responseServiceForm = await api.get(
          `/service-form/?booking_id=${bookingId}`
        );

        const filterList = responseServiceForm.data.data.slice(0, -1);

        if (filterList.length > 0) {
          const tempArr = [];

          // Lặp qua dữ liệu response và thêm các phần tử vào mảng tạm thời
          filterList.forEach((item) => {
            item.service_form_details.forEach((item2) => {
              tempArr.push(item2);
            });
            console.log("temp arr", tempArr);
          });

          setServiceFormDetailSideArr(tempArr);

          try {
            const responsesMedicalMedia = await Promise.all(
              tempArr.map(async (item) => {
                if (item.status === "done") {
                  const responseDetail = await api.get(
                    `/medical-record/?service_form_detail_id=${item.service_form_detail_id}`
                  );
                  return responseDetail.data.data[0];
                } else {
                  return {
                    note: item.note,
                    service_form_detail_id: item.service_form_detail_id,
                  };
                }
              })
            );
            // Thêm dữ liệu vào medicalRecordData
            setMedicalRecordData(responsesMedicalMedia);
            console.log("upda", responsesMedicalMedia);
          } catch (error) {
            console.error("Lỗi khi gọi API:", error);
          }
        }

        setServiceFormList(filterList);
        console.log("service form list", filterList);
      } catch (error) {
        console.log(error);
      }
    };

    const getBirdProfile = async (birdId) => {
      try {
        const response = await api.get(`/bird/${birdId}`);
        setBirdProfile(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getBooking();
  }, [bookingId]);

  const toggleInfo = () => {
    setShowInfo(!showInfo);
    setShowButton(false); // Ẩn nút sau khi nhấp vào
  };

  const [medicineNames, setMedicineNames] = useState([]);

  useEffect(() => {
    const sendApiforData = async () => {
      try {
        const response = await api.get(`/medicine/`);
        const medicineData = response.data.data;
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
        const response = await api.get(`/time-slot-clinic/`);
        const timeSlotData = response.data.data;
        setTimeSlotDate(timeSlotData);
        console.log("data:", timeSlotData);
      } catch (error) {
        console.log(error);
      }
    };
    sendApiforData();
  }, [tab]);

  const [forms, setForms] = useState([
    {
      selectedMedicine: "",
      type: "",
      unit: 1,
      day: 1,
      amount: "",
      note: "",
    },
  ]);

  const handleMedicineSelect = (index, selectedMedicine) => {
    // Check if the selectedMedicine has already been selected
    const isAlreadySelected = forms.some(
      (form, i) => i !== index && form.selectedMedicine === selectedMedicine
    );

    if (!isAlreadySelected) {
      const updatedForms = [...forms];
      updatedForms[index].selectedMedicine = selectedMedicine;

      const selectedType = medicineNames.find(
        (medicine) => medicine.name === selectedMedicine
      )?.unit;

      updatedForms[index].type = selectedType || "";

      setForms(updatedForms);
    } else {
      // Display a warning or handle the situation where the medicine has already been selected
      message.error(
        "Thuốc đã được chọn trước đó. Vui lòng chọn một thuốc khác."
      );
    }
  };

  const findMedicineIdByName = (medicineName) => {
    const foundMedicine = medicineNames.find(
      (medicine) => medicine.name === medicineName
    );
    return foundMedicine ? foundMedicine.medicine_id : null;
  };

  const handleInputMedicineFirst = (index, e) => {
    const { name, value } = e.target;
    const updatedForms = [...forms];
    updatedForms[index][name] = value;
    setForms(updatedForms);
  };

  const addForm = () => {
    setForms([
      ...forms,
      {
        selectedMedicine: "",
        type: "",
        unit: 1,
        day: 1,
        amount: "",
        note: "",
      },
    ]);
  };

  const removeForm = (index) => {
    const updatedForms = [...forms];
    updatedForms.splice(index, 1);
    setForms(updatedForms);
  };

  const addPrescriptionData = () => {
    // if (!prescriptionData.arrival_date) {
    //   showError();
    //   return; // Ngăn việc thực hiện Re-exam nếu arrival_date trống
    // }
    try {
      const requestData = {
        booking_id: bookingId,
        // note: prescriptionData.note,
        // usage: "",
        arr_medicine: forms.map((medicineData) => ({
          medicine_id: findMedicineIdByName(medicineData.selectedMedicine),
          usage: medicineData.usage,
          total_dose: medicineData.unit * medicineData.day,
          dose: medicineData.unit,
          day: medicineData.day,
          note: medicineData.note,
        })),
      };

      const response = api.post(`/prescription/`, requestData);
      console.log("Add medicine thanh cong:", response);
      console.log("requestData:", requestData);
      successAddmedicine();
    } catch (error) {
      console.log(error);
    }
  };

  //Print
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const printRefMd = useRef();
  const handlePrintMd = useReactToPrint({
    content: () => printRefMd.current,
  });

  const handleChange = (event) => {
    const serviceName = event.target.value;
    const selectedService = serviceList.find(
      (item) => item.package_name === serviceName
    );

    if (event.target.checked) {
      // Nếu checkbox được chọn, thêm dịch vụ vào danh sách đã chọn
      setSelectedServices([...selectedServices, selectedService]);
    } else {
      // Nếu checkbox được bỏ chọn, loại bỏ dịch vụ khỏi danh sách đã chọn
      setSelectedServices(
        selectedServices.filter(
          (service) => service.package_name !== serviceName
        )
      );
    }
  };

  const handleBackTab = async () => {
    const newTabValue = tab - 1; // Lấy giá trị mới của tab
    console.log("hdvaciaydcyj", newTabValue);

    setTab(newTabValue); // Cập nhật giá trị tab

    try {
      const sendProcessToApi = await api.put(
        `/service-form-detail/${serviceFormDetail.service_form_detail_id}`,
        {
          status: "on_going",
          veterinarian_id: localStorage.getItem("account_id"),
          process_at: newTabValue, // Sử dụng giá trị mới của tab
        }
      );
      console.log("Change Tab Successful");
      console.log("Change Tab 1: ", sendProcessToApi);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error:", error);
      // Đảm bảo quay lại giá trị trước đó nếu có lỗi xảy ra
      setTab((tab) => tab + 1);
    }
  };

  const handleNextTab = async () => {
    const newTabValue = tab + 1; // Lấy giá trị mới của tab
    setTab(newTabValue); // Cập nhật giá trị tab

    try {
      const sendProcessToApi = await api.put(
        `/service-form-detail/${serviceFormDetail.service_form_detail_id}`,
        {
          status: "on_going",
          veterinarian_id: localStorage.getItem("account_id"),
          process_at: newTabValue, // Sử dụng giá trị mới của tab
        }
      );
      console.log("Change Tab Successfull");
      console.log("Change Tab 2: ", sendProcessToApi);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error:", error);
      // Đảm bảo quay lại giá trị trước đó nếu có lỗi xảy ra
      setTab((tab) => tab - 1);
    }
  };

  const handleOpenConfirm = () => {
    setOpenModalConfirmService(true);
    createNewServiceForm(bookingInfo);
  };

  const createNewServiceForm = async (bookingInfo) => {
    const newArray = selectedServices.map((obj) => {
      return {
        service_package_id: obj.service_package_id,
        note: obj.package_name,
      };
    });

    const totalPrice = selectedServices.reduce(
      (acc, service) => acc + parseFloat(service.price),
      0
    );

    //ĐỔI THÀNH TRẠNG THÁI TEST_REQUEST
    try {
      const response = await api.put(`/booking/${bookingInfo.booking_id}`, {
        status: "test_requested",
      });

      console.log("response doi status neeee", response.data);
    } catch (error) {
      console.log(error);
    }

    try {
      // Tạo service_Form
      const createdResponse = await api.post(`/service-form/`, {
        bird_id: bookingInfo.bird_id,
        booking_id: bookingInfo.booking_id,
        reason_referral: "any",
        status: "pending",
        date: bookingInfo.arrival_date,
        veterinarian_referral: bookingInfo.veterinarian_id,
        total_price: totalPrice,
        qr_code: "any",
        num_ser_must_do: newArray.length,
        num_ser_has_done: "0",
        arr_service_pack: newArray,
      });
      if (createdResponse) {
        console.log("do response r ne", createdResponse);
        socket.emit("create-service-form", {
          customer_id: bookingInfo.account_id,
          service_form_id: createdResponse.data.data.service_form_id,
        });
      }

      // const createdBill = await api.post(`/bill/`, {
      //   title: "Thanh toán",
      //   total_price: totalPrice,
      //   service_form_id: createdResponse.data.data.service_form_id,
      //   booking_id: bookingInfo.booking_id,
      //   payment_method: "cast",
      //   paypal_transaction_id: "any",
      //   status: "any",
      // });
    } catch (err) {
      console.log(err);
    }
  };

  const optionsCancel = {
    title: "Xác nhận",
    message: "Bạn có chắc huỷ cuộc hẹn?",
    buttons: [
      {
        label: "Xác nhận",
      },
      {
        label: "Huỷ",
      },
    ],
    closeOnEscape: true,
    closeOnClickOutside: true,
    keyCodeForClose: [8, 32],
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypress: () => {},
    onKeypressEscape: () => {},
    overlayClassName: "overlay-custom-class-name",
  };

  const handleConfirmCancel = (item) => {
    const updatedOptions = {
      ...optionsCancel,
      buttons: [
        {
          label: "Xác nhận",
          onClick: async () => {
            try {
              const responseCancel = await api.put(
                `/booking/${item.booking_id}`,
                {
                  status: "cancel",
                }
              );
              if (responseCancel) {
                console.log("đã huỷ cuộc hẹn");
                toast.success("Đã huỷ thành công!", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
                navigate("/examing");
              }
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          label: "Huỷ",
          onClick: () => {
            console.log("click no");
          },
        },
      ],
    };
    confirmAlert(updatedOptions);
  };

  const optionsFinish = {
    title: "Xác nhận",
    message: "Bạn có chắc hoàn tất khám?",
    buttons: [
      {
        label: "Xác nhận",
      },
      {
        label: "Huỷ",
      },
    ],
    closeOnEscape: true,
    closeOnClickOutside: true,
    keyCodeForClose: [8, 32],
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypress: () => {},
    onKeypressEscape: () => {},
    overlayClassName: "overlay-custom-class-name",
  };

  const handleConfirmFinish = (item) => {
    const updatedOptions = {
      ...optionsFinish,
      buttons: [
        {
          label: "Xác nhận",
          onClick: async () => {
            try {
              const responseSFD = await api.put(
                `/service-form-detail/${serviceFormDetail.service_form_detail_id}`,
                {
                  status: "done",
                }
              );
              const responseSF = await api.put(
                `/service-form/${serviceFormDetail.service_form_id}`,
                {
                  status: "done",
                }
              );
              const responseBooking = await api.put(
                `/booking/${item.booking_id}`,
                {
                  status: "finish",
                  diagnosis: examData.diagnosis,
                  recommendations: examData.additionalNotes,
                }
              );
              addPrescriptionData();
              if (responseSFD && responseSF && responseBooking) {
                console.log("đã hoàn thành cuộc hẹn");
                toast.success("Xác nhận thành công!", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
                navigate("/examing");
              }
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          label: "Huỷ",
          onClick: () => {
            console.log("click no");
          },
        },
      ],
    };
    confirmAlert(updatedOptions);
  };

  const [customerPhone, setCustomerPhone] = useState();
  useEffect(() => {
    const sendApiforData = async () => {
      console.log("bookingInfo.account_id:", accountId);
      try {
        const response = await api.get(`/customer/${accountId}`);
        setCustomerPhone(response.data.data.phone);
      } catch (error) {
        console.log(error);
      }
    };
    sendApiforData();
  }, [accountId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.left} onClick={() => navigate("/examing")}>
            <ion-icon name="chevron-back-outline"></ion-icon>
            <span>Trở về</span>
          </div>
          <div className={styles.right}>
            <div className={styles.nameCustomer}>KH: {customerName}</div>
          </div>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.content}>
            <div className={styles.procedureTab}>
              <span className={`${tab === 1 ? styles.active : ""}`}>
                Khám tổng thể
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span className={`${tab === 2 ? styles.active : ""}`}>
                Yêu cầu dịch vụ
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span className={`${tab === 3 ? styles.active : ""}`}>
                Kê thuốc
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span className={`${tab === 4 ? styles.active : ""}`}>
                Hẹn tái khám
              </span>
            </div>
            {tab == 1 && (
              <div className={styles.examing}>
                <div className={styles.inputItem}>
                  <label htmlFor="temperature">Triệu chứng</label>
                  <input
                    type="text"
                    name="symptoms"
                    value={examData.symptoms}
                    onChange={handleInputChange}
                    disabled
                  />
                  <span className={styles.inputLabelDesc}>
                    *Các triệu chứng mà chim đang gặp phải
                  </span>
                </div>
                <div className={styles.inputItem}>
                  <label htmlFor="temperature">Chẩn đoán</label>
                  <input
                    type="text"
                    name="diagnosis"
                    value={examData.diagnosis}
                    onChange={handleInputChange}
                  />
                  <span className={styles.inputLabelDesc}>
                    *Chẩn đoán của bác sĩ về tình trạng bệnh của chim
                  </span>
                </div>
                <div className={styles.inputItem}>
                  <label htmlFor="temperature">Lời khuyên</label>
                  <textarea
                    name="additionalNotes"
                    value={examData.additionalNotes}
                    onChange={handleInputChange}
                    rows={3}
                  />
                  <span className={styles.inputLabelDesc}>
                    *Lời khuyên của bác sĩ cho chim bệnh
                  </span>
                </div>
              </div>
            )}
            {tab == 2 && (
              <div className={styles.examingService}>
                {/* {serviceFormDetailSideArr?.length > 0 && (
                  <div>
                    <h3 className={styles.requireText}>
                      <ion-icon name="documents-outline"></ion-icon>Kết quả xét
                      nghiệm:
                    </h3>
                    {serviceFormDetailSideArr.map((item, index) => {
                      console.log("medical record data", medicalRecordData);
                      const matchingMedicalRecord = medicalRecordData.find(
                        (record) =>
                          record.service_form_detail_id ===
                          item.service_form_detail_id
                      );
                      console.log("record ne huu", matchingMedicalRecord);

                      if (matchingMedicalRecord) {
                        return (
                          <div key={index} className={styles.resultDetail}>
                            <div className={styles.titleService}>
                              <h4>
                                {item.note}
                                {matchingMedicalRecord.hasOwnProperty(
                                  "symptom"
                                ) ? (
                                  <span></span>
                                ) : (
                                  <span className={styles.cancelled}>
                                    Đã huỷ
                                  </span>
                                )}
                              </h4>

                              <span
                                onClick={() =>
                                  openPopup(item.service_form_detail_id)
                                }
                                className={styles.viewFile}
                              >
                                <ion-icon name="document-outline"></ion-icon>Xem
                                file
                              </span>
                              <Popup
                                open={isOpen}
                                closeOnDocumentClick
                                onClose={closePopup}
                              >
                                <div className={styles.popup}>
                                  <br></br>
                                  <img
                                    src={imgUrl}
                                    alt=""
                                    className={styles.imgPopup}
                                  />
                                </div>
                              </Popup>
                            </div>
                            <div className={styles.lineItem}>
                              <span className={styles.label}>Triệu chứng:</span>
                              <span>{matchingMedicalRecord.symptom}</span>
                            </div>
                            <div className={styles.lineItem}>
                              <span className={styles.label}>Chẩn đoán:</span>
                              <span>{matchingMedicalRecord.diagnose}</span>
                            </div>
                            <div className={styles.lineItem}>
                              <span className={styles.label}>Khuyến nghị:</span>
                              <span>
                                {matchingMedicalRecord.recommendations}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )} */}

                {serviceFormList &&
                  serviceFormList.length > 0 &&
                  serviceFormList.map((item, index) => (
                    <div>
                      <h3 className={styles.requireText}>
                        <ion-icon name="documents-outline"></ion-icon>Kết quả
                        xét nghiệm {index + 1}:
                      </h3>
                      {item.service_form_details.map((item, index) => {
                        const matchingMedicalRecord = medicalRecordData.find(
                          (record) =>
                            record.service_form_detail_id ===
                            item.service_form_detail_id
                        );
                        console.log("record ne huu", matchingMedicalRecord);

                        if (matchingMedicalRecord) {
                          return (
                            <div key={index} className={styles.resultDetail}>
                              <div className={styles.titleService}>
                                <h4>
                                  {item.note}
                                  {matchingMedicalRecord.hasOwnProperty(
                                    "symptom"
                                  ) ? (
                                    <span></span>
                                  ) : (
                                    <span className={styles.cancelled}>
                                      Đã huỷ
                                    </span>
                                  )}
                                </h4>

                                <span
                                  onClick={() =>
                                    openPopup(item.service_form_detail_id)
                                  }
                                  className={styles.viewFile}
                                >
                                  <ion-icon name="document-outline"></ion-icon>
                                  Xem file
                                </span>
                                <Popup
                                  open={isOpen}
                                  closeOnDocumentClick
                                  onClose={closePopup}
                                >
                                  <div className={styles.popup}>
                                    <br></br>
                                    <img
                                      src={imgUrl}
                                      alt=""
                                      className={styles.imgPopup}
                                    />
                                  </div>
                                </Popup>
                              </div>
                              <div className={styles.lineItem}>
                                <span className={styles.label}>
                                  Triệu chứng:
                                </span>
                                <span>{matchingMedicalRecord.symptom}</span>
                              </div>
                              <div className={styles.lineItem}>
                                <span className={styles.label}>Chẩn đoán:</span>
                                <span>{matchingMedicalRecord.diagnose}</span>
                              </div>
                              <div className={styles.lineItem}>
                                <span className={styles.label}>
                                  Khuyến nghị:
                                </span>
                                <span>
                                  {matchingMedicalRecord.recommendations}
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                      <div key={index}>{item.note}</div>
                    </div>
                  ))}

                <h3 className={styles.requireText}>
                  <ion-icon name="alert-circle-outline"></ion-icon>Yêu cầu các
                  dịch vụ dưới đây (nếu có):
                </h3>
                {serviceList.map((item, index) => (
                  <div className={styles.serviceItem} key={index}>
                    <input
                      type="checkbox"
                      name="temperature"
                      value={item.package_name}
                      checked={selectedServices.some(
                        (service) => service.package_name === item.package_name
                      )}
                      onChange={handleChange}
                    />
                    <label htmlFor="temperature">{item.package_name}</label>
                  </div>
                ))}
                {/* <div style={{ display: "none" }}>
                  <PhieuChiDinh
                    ref={printRef}
                    selectedServices={selectedServices}
                  ></PhieuChiDinh>
                </div> */}

                <button
                  className={styles.printService}
                  onClick={handleOpenConfirm}
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
                        <div>
                          {forms.map((form, index) => (
                            <div key={index} className={styles.contentAll}>
                              <div className={styles.headerDelete}>
                                <div className={styles.numberMedicine}>
                                  {index + 1}. {form.selectedMedicine}
                                </div>
                                <RiDeleteBinLine
                                  className={styles.deleteMedicine}
                                  onClick={() => removeForm(index)}
                                />
                              </div>
                              <div className={styles.hsdMedicine}>
                                {medicineNames
                                  .filter(
                                    (timeSlot) =>
                                      timeSlot.name === form.selectedMedicine
                                  )
                                  .map((filteredSlot, index) => (
                                    <div key={index}>
                                      HDSD: {filteredSlot.usage}
                                    </div>
                                  ))}
                              </div>
                              <div className={styles.createFirst}>
                                <div className={styles.First}>
                                  <p>Tên thuốc *</p>
                                  <select
                                    className={styles.DrugNameList}
                                    name="selectedMedicine"
                                    value={form.selectedMedicine}
                                    onChange={(e) =>
                                      handleMedicineSelect(
                                        index,
                                        e.target.value
                                      )
                                    }
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
                                <div className={styles.First}>
                                  <p>Đơn vị</p>
                                  <p className={styles.TypeList}>
                                    {medicineNames
                                      .filter(
                                        (timeSlot) =>
                                          timeSlot.name ===
                                          form.selectedMedicine
                                      )
                                      .map((filteredSlot, index) => (
                                        <p key={index}>{filteredSlot.unit}</p>
                                      ))}
                                  </p>
                                </div>
                              </div>
                              <div className={styles.createSecond}>
                                <div className={styles.Second}>
                                  <p>Liều</p>
                                  <select
                                    className={styles.UnitList}
                                    name="unit"
                                    value={form.unit}
                                    onChange={(e) =>
                                      handleInputMedicineFirst(index, e)
                                    }
                                  >
                                    {/* <option value="">--</option> */}
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
                                    value={form.day}
                                    onChange={(e) =>
                                      handleInputMedicineFirst(index, e)
                                    }
                                  >
                                    {/* <option value="">--</option> */}
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
                                  <p>Tổng số liều dùng</p>
                                  <p
                                    className={styles.AmountList}
                                    name="amount"
                                    value={form.unit * form.day}
                                  >
                                    {form.unit * form.day}
                                  </p>
                                  {}
                                </div>
                              </div>
                              <div className={styles.createThird}>
                                <p className={styles.txtThird}>
                                  Lời khuyên của bác sĩ
                                </p>
                                <textarea
                                  type="text"
                                  name="note"
                                  className={styles.Instruct}
                                  value={form.note}
                                  onChange={(e) =>
                                    handleInputMedicineFirst(index, e)
                                  }
                                  placeholder="Vd: Uống sau khi ăn no"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className={styles.boxMedicine}>
                        {/* <div>
                          <button
                            className={styles.AddMedicine}
                            onClick={addPrescriptionData}
                          >
                            Xác nhận
                          </button>
                          {contextHolder}
                        </div> */}
                        <button
                          onClick={addForm}
                          className={styles.AddMedicine}
                        >
                          + Thêm thuốc
                        </button>
                        <div
                          className={styles.PrintMedicine}
                          onClick={handlePrintMd}
                          // onClick={() => setOpenModalPrescription(true)}
                        >
                          <ion-icon name="thermometer-outline"></ion-icon>
                          <span>In đơn thuốc</span>
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
                  <div>
                    <div className={styles.expectedDate}>
                      Ngày dự kiến: {formattedDate}
                    </div>
                    <Calendar
                      className={styles.calendar}
                      onChange={onChange}
                      value={date}
                      tileDisabled={tileDisabled}
                    />
                  </div>
                </div>
                <div>
                  <div className={styles.txtNote}>Ghi chú thêm:</div>
                  <textarea
                    type="text"
                    rows={13}
                    name="note"
                    placeholder="Vd: Nhớ tới hẹn đúng giờ"
                    className={styles.Note}
                    value={bookingData.note}
                    onChange={handleInputSave}
                  />
                  <button className={styles.btnAdd} onClick={addBookingRe}>
                    + Tạo
                  </button>
                  {contextHolder}
                </div>
              </div>
            )}
            {tab == 5 && (
              <div className={styles.infConfirm}>
                <IoCheckmarkDoneCircleSharp className={styles.iconConfirm} />
                <div className={styles.txtConfirm}>
                  Bạn đã hoàn thành tất cả các bước.
                </div>
                <div className={styles.txtConfirmBack}>
                  Bạn có thể quay lại để chỉnh sửa
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
            <button
              className={styles.btnComplete}
              onClick={() => {
                handleConfirmFinish(bookingInfo);
              }}
            >
              Hoàn thành khám
            </button>
            <button
              className={styles.btnComplete}
              onClick={() => {
                handleConfirmCancel(bookingInfo);
              }}
            >
              Huỷ khám
            </button>
            <button className={styles.btnHospitalize} onClick={handlePrint}>
              In phiếu kết quả
            </button>
          </div>
        </div>
      </div>
      <div style={{ display: "none" }}>
        <PhieuKetQua
          ref={printRef}
          bookingInfo={bookingInfo}
          birdProfile={birdProfile}
          examData={examData}
          serviceFormDetailSideArr={serviceFormDetailSideArr}
        ></PhieuKetQua>
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
        forms={forms}
      />
      <ConfirmServiceModal
        open={openModalConfirmService}
        onClose={() => setOpenModalConfirmService(false)}
        selectedServices={selectedServices}
      />
      <div style={{ display: "none" }}>
        <DonThuoc
          ref={printRefMd}
          bookingInfo={bookingInfo}
          birdProfile={birdProfile}
          customerPhone={customerPhone}
          forms={forms}
        ></DonThuoc>
      </div>
      <div className={styles.footerContent}>
        {tab !== 1 && (
          <button className={styles.btnBack} onClick={handleBackTab}>
            Quay lại
          </button>
        )}
        {tab !== 5 && (
          <button className={styles.btnCont} onClick={handleNextTab}>
            Tiếp tục
          </button>
        )}
      </div>
    </div>
  );
};

export default Examing;
