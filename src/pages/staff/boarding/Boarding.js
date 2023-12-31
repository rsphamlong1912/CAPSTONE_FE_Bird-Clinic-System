import React, { useEffect, useRef, useState } from "react";
import styles from "./Boarding.module.scss";
import "reactjs-popup/dist/index.css";
import "flatpickr/dist/flatpickr.css";
import ProfileBirdModal from "../../../components/modals/ProfileBirdModal";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../services/axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { useReactToPrint } from "react-to-print";
import { PhieuNoiTru } from "../../../components/pdfData/PhieuNoiTru";
import {
  Modal,
  message,
  Form, Upload
} from "antd";
import { EditOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { MaSo } from "../../../components/pdfData/MaSo";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const Boarding = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [tab, setTab] = useState(1);
  const [openModalProfile, setOpenModalProfile] = useState(false);

  const [bookingInfo, setBookingInfo] = useState();
  const [boardingInfo, setBoardingInfo] = useState();
  const [arrivalDate, setArrivalDate] = useState();
  const [departureDate, setDepartureDate] = useState();
  const [birdProfile, setBirdProfile] = useState();
  const [birdSizeList, setBirdSizeList] = useState();
  const [birdSizeSelected, setBirdSizeSelected] = useState();
  const [serviceList, setServiceList] = useState();
  const [cageList, setCageList] = useState();
  const [serviceSelected, setServiceSelected] = useState();
  const [cageSelected, setCageSelected] = useState();
  const [birdBreedSelected, setBirdBreedSelected] = useState();
  const [birdBreedList, setBirdBreedList] = useState();
  const [totalDays, setTotalDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [imageBirdBoarding, setImageBirdBoarding] = useState([]);
  const [customerName, setCustomerName] = useState([]);
  const [modalComplete, setModalComplete] = useState(false);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Tải lên
      </div>
    </div>
  );

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    if (isJpgOrPng && isLt2M) setImageBirdBoarding([file]);

    return isJpgOrPng && isLt2M;
  };


  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      message.success("Tải lên file ảnh thành công!");
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };




  // Định dạng tổng tiền theo tiền tệ Việt Nam
  const formattedPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    if (arrivalDate && departureDate) {
      const oneDay = 24 * 60 * 60 * 1000; // số mili giây trong một ngày
      const firstDate = new Date(arrivalDate);
      const secondDate = new Date(departureDate);
      const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
      setTotalDays(diffDays);
    }
  }, [arrivalDate, departureDate]);

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const printRef2 = useRef();
  const handlePrint2 = useReactToPrint({
    content: () => printRef2.current,
  });

  const handleBirdBreedSelection = async (event) => {
    setBirdBreedSelected(event.target.value);
    try {
      const responseChangeBreed = await api.put(
        `/bird/${birdProfile.bird_id}`,
        {
          customer_id: bookingInfo.account_id,
          breed_id: event.target.value,
        }
      );
      console.log("doi giong chim", responseChangeBreed.data.data);
      getBooking();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBirdBreed = async () => {
    try {
      const responseBirdBreed = await api.get(`/bird-breed`);
      setBirdBreedList(responseBirdBreed.data.data);
      console.log("fetch bird breed", responseBirdBreed.data.data);
    } catch (error) {
      console.error("Error fetching veterinarians:", error);
    }
  };
  const fetchBoardingInfo = async () => {
    try {
      const responseBoarding = await api.get(`/boarding/${bookingId}`);
      setBoardingInfo(responseBoarding.data.data);
      console.log("boarding i4 ne", responseBoarding.data.data)
      setArrivalDate(responseBoarding.data.data.arrival_date);
      setDepartureDate(responseBoarding.data.data.departure_date);
      console.log("fetch boading", responseBoarding.data.data.arrival_date);
    } catch (error) {
      console.error("Error fetching veterinarians:", error);
    }
  };

  useEffect(() => {
    fetchBirdBreed();
    fetchBoardingInfo();
  }, []);

  const handleServiceClick = (selectedService) => {
    console.log("service duoc chon", selectedService);
    setServiceSelected(selectedService);
  };
  const handleCageClick = (selectedCage) => {
    console.log("cage duoc chon", selectedCage);
    setCageSelected(selectedCage);
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateRange, setDateRange] = useState([]);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleArrivalDateChange = async (event) => {
    setArrivalDate(event.target.value);
    try {
      const responseBoarding = await api.put(`/boarding/${bookingId}`, {
        arrival_date: event.target.value,
      });
    } catch (error) {
      console.error("Error fetching veterinarians:", error);
    }
  };
  const handleDepartureDateChange = async (event) => {
    setDepartureDate(event.target.value);
    try {
      const responseBoarding = await api.put(`/boarding/${bookingId}`, {
        departure_date: event.target.value,
      });
    } catch (error) {
      console.error("Error fetching veterinarians:", error);
    }
  };

  useEffect(() => {
    let mang1 = [];
    let mang2 = [];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const range = [];

      for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        const formattedDate = date.toISOString().split("T")[0]; // Chuyển định dạng sang yyyy-mm-dd
        range.push(formattedDate);
      }

      setDateRange(range);

      api
        .get(`/cage/?size=${birdSizeSelected}`)
        .then((response) => {
          // Handle the API response data
          // console.log("response cvage moi", response.data.data);
          // setCageList(response.data.data);
          mang1 = response.data.data;
          api
            .get(
              `/cage/schedule-cage?start_date=${startDate}&end_date=${endDate}`
            )
            .then((response) => {
              // Handle the API response data
              // setCageList(
              //   response.data.data.filter((item) => item.size === birdSizeSelected)
              // );
              mang2 = response.data.data.filter(
                (item) => item.size === birdSizeSelected
              );
              console.log("m1:", mang1);
              console.log("m2", mang2);
              const filteredMang1 = mang1.filter(
                (item1) =>
                  !mang2.some(
                    (item2) => item1.boarding_id === item2.boarding_id
                  )
              );
              const unionArray = [...mang2, ...filteredMang1];
              console.log("union", unionArray);

              setCageList(unionArray);
            })
            .catch((error) => {
              // Handle errors
              console.error("API Error:", error);
            });
        })
        .catch((error) => {
          // Handle errors
          console.error("API Error:", error);
        });
    }
  }, [startDate, endDate]);

  //LẤY THÔNG TIN BIRD SIZE
  useEffect(() => {
    const getBirdSizeList = async () => {
      try {
        const responseBirdSize = await api.get(`/bird-size`);
        console.log("bird size", responseBirdSize.data.data);
        const filterList = responseBirdSize.data.data.filter(
          (item) => item.bird_size_id !== "SZ005"
        );
        setBirdSizeList(filterList);
      } catch (error) {
        console.log(error);
      }
    };
    getBirdSizeList();
  }, []);

  //LẤY THÔNG TIN SERVICE THEO SIZE BIRD
  useEffect(() => {
    const getServiceList = async () => {
      try {
        const responseService = await api.get(
          `/service-package/?size_id=${birdSizeSelected}&service_type_id=ST003`
        );
        console.log("responseService", responseService.data.data);
        setServiceList(responseService.data.data);
        setServiceSelected(responseService.data.data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    const getCage = async () => {
      try {
        const responseCage = await api.get(`/cage/?size=${birdSizeSelected}`);
        console.log("responseCage", responseCage.data.data);
        setCageList(responseCage.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    // Đặt lại startDate và endDate thành null khi birdSizeSelected thay đổi
    setStartDate(null);
    setEndDate(null);

    getServiceList();
    getCage();
  }, [birdSizeSelected]);
  const getBooking = async () => {
    try {
      const response = await api.get(`/booking/${bookingId}`);
      setBookingInfo(response.data.data);
      console.log("thong tin booking ne:", response.data.data);
      setCustomerName(response.data.data.customer_name)

      const responseBird = await api.get(`/bird/${response.data.data.bird_id}`);
      setBirdProfile(responseBird.data.data);
      setBirdSizeSelected(
        responseBird.data.data.bird_breed.bird_size.bird_size_id
      );
      console.log(
        "thong tin bird ne:",
        responseBird.data.data
      );

    } catch (error) {
      console.log(error);
    }
  };

  //LẤY THÔNG TIN BOOKING
  useEffect(() => {
    getBooking();
  }, [bookingId]);

  const options = {
    title: "Xác nhận",
    message: "Bạn có muốn thêm lịch nội trú?",
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

  // const handleConfirmAlert = async (item) => {
  //   const updatedOptions = {
  //     ...options,
  //     buttons: [
  //       {
  //         label: "Xác nhận",
  //         onClick: async () => {
  //           try {
  //             if (arrivalDate && departureDate && cageSelected) {
  //               //up hinh
  //               const fileInput = document.getElementById("file");
  //               const file = fileInput.files[0];
  //               if (file) {
  //                 // Tạo formData chứa dữ liệu cần gửi
  //                 const formData = new FormData();
  //                 formData.append("image", file);
  //                 formData.append("type", "boarding");
  //                 formData.append("type_id", boardingInfo.boarding_id);
  //                 formData.append("type_service", boardingInfo.boarding_id);
            
  //                 console.log("file ne: ", file);
            
  //                 // Thực hiện gọi API sử dụng axios
  //                 try {
  //                   const response = await api.post("/media", formData, {
  //                     headers: {
  //                       "Content-Type": "multipart/form-data",
  //                     },
  //                   });
  //                   console.log("Response:", response.data);
  //                 } catch (error) {
  //                   console.error("Error:", error);
  //                 }
  //               }
  //               const responseUpdateBoarding = await api.put(
  //                 `/boarding/${bookingId}`,
  //                 {
  //                   act_arrival_date: arrivalDate,
  //                   // act_departure_date: departureDate,
  //                   room_type: serviceSelected.package_name,
  //                   cage_id: cageSelected.cage_id,
  //                 }
  //               );
  //               // const responseUpdateBooking = await api.put(
  //               //   `/booking/${bookingId}`,
  //               //   {
  //               //     status: "finish",
  //               //   }
  //               // );

  //               const responseUpdateCage = await api.put(
  //                 `/cage/${cageSelected.cage_id}`,
  //                 {
  //                   boarding_id: bookingId,
  //                   bird_id: bookingInfo.bird_id,
  //                   status: "not_empty",
  //                 }
  //               );

  //               console.log("update cage", responseUpdateCage);

  //               const createdResponseServiceForm = await api.post(
  //                 `/service-form/`,
  //                 {
  //                   bird_id: birdProfile.bird_id,
  //                   booking_id: bookingId,
  //                   reason_referral: "any",
  //                   status: "pending",
  //                   date: arrivalDate,
  //                   veterinarian_referral: bookingInfo.veterinarian_id,
  //                   total_price: serviceSelected.price * totalDays,
  //                   qr_code: "any",
  //                   num_ser_must_do: 1,
  //                   num_ser_has_done: 1,
  //                   arr_service_pack: [
  //                     {
  //                       service_package_id: serviceSelected.service_package_id,
  //                       note: serviceSelected.package_name,
  //                     },
  //                   ],
  //                 }
  //               );
  //               if (createdResponseServiceForm) {
  //                 console.log(
  //                   "tao servicee form roi",
  //                   createdResponseServiceForm.data.data
  //                 );
  //                 toast.success("Xác nhận thành công!", {
  //                   position: "top-right",
  //                   autoClose: 5000,
  //                   hideProgressBar: false,
  //                   closeOnClick: true,
  //                   pauseOnHover: true,
  //                   draggable: true,
  //                   progress: undefined,
  //                   theme: "light",
  //                 });
  //                 navigate("/boarding")
  //               } else {
  //                 console.log("KHONG TAO DUOC SERVICE FORM");
  //               }
  //             } else {
  //               toast.error("Không thành công!", {
  //                 position: "top-right",
  //                 autoClose: 5000,
  //                 hideProgressBar: false,
  //                 closeOnClick: true,
  //                 pauseOnHover: true,
  //                 draggable: true,
  //                 progress: undefined,
  //                 theme: "light",
  //               });
  //             }
  //           } catch (error) {
  //             console.log(error);
  //           }
  //         },
  //       },
  //       {
  //         label: "Huỷ",
  //         onClick: () => {
  //           console.log("click no");
  //         },
  //       },
  //     ],
  //   };
  //   confirmAlert(updatedOptions);
  // };

  const handleConfirmAlert = async () => {
            try {
              if (arrivalDate && departureDate && cageSelected) {
                //up hinh
                // const fileInput = document.getElementById("file");
                // const file = fileInput.files[0];
                if (imageBirdBoarding.length>0) {
                  // Tạo formData chứa dữ liệu cần gửi
                  const formData = new FormData();
                  formData.append("image", imageBirdBoarding[0]);
                  formData.append("type", "boarding");
                  formData.append("type_id", boardingInfo.boarding_id);
                  formData.append("type_service", boardingInfo.boarding_id);
            
                  // console.log("file ne: ", file);
            
                  // Thực hiện gọi API sử dụng axios
                  try {
                    const response = await api.post("/media", formData, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    });
                    console.log("Response:", response.data);
                  } catch (error) {
                    console.error("Error:", error);
                  }
                }
                const responseUpdateBoarding = await api.put(
                  `/boarding/${bookingId}`,
                  {
                    act_arrival_date: arrivalDate,
                    // act_departure_date: departureDate,
                    room_type: serviceSelected.package_name,
                    cage_id: cageSelected.cage_id,
                  }
                );
                // const responseUpdateBooking = await api.put(
                //   `/booking/${bookingId}`,
                //   {
                //     status: "finish",
                //   }
                // );

                const responseUpdateCage = await api.put(
                  `/cage/${cageSelected.cage_id}`,
                  {
                    boarding_id: bookingId,
                    bird_id: bookingInfo.bird_id,
                    status: "not_empty",
                  }
                );

                console.log("update cage", responseUpdateCage);

                const createdResponseServiceForm = await api.post(
                  `/service-form/`,
                  {
                    bird_id: birdProfile.bird_id,
                    booking_id: bookingId,
                    reason_referral: "any",
                    status: "pending",
                    date: arrivalDate,
                    veterinarian_referral: bookingInfo.veterinarian_id,
                    total_price: serviceSelected.price * totalDays,
                    qr_code: "any",
                    num_ser_must_do: 1,
                    num_ser_has_done: 1,
                    arr_service_pack: [
                      {
                        service_package_id: serviceSelected.service_package_id,
                        note: serviceSelected.package_name,
                      },
                    ],
                  }
                );
                if (createdResponseServiceForm) {
                  console.log(
                    "tao servicee form roi",
                    createdResponseServiceForm.data.data
                  );
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
                  navigate("/boarding")
                } else {
                  console.log("KHONG TAO DUOC SERVICE FORM");
                }
              } else {
                toast.error("Không thành công!", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              }
            } catch (error) {
              console.log(error);
            }
  }

  const handleClickSize = () => {
    // Kiểm tra điều kiện trước khi xử lý sự kiện onClick
    toast.error("Size chim không phù hợp!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.left} onClick={() => navigate(`/boarding`)}>
            <ion-icon name="chevron-back-outline"></ion-icon>
            <h4>THOÁT</h4>
          </div>
          <div className={styles.right}>
            <div className={styles.nameCustomer}>KH: {customerName}</div>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.content}>
            <div className={styles.procedureTab}>
              <span className={`${tab === 1 ? styles.active : ""}`}>
                Thông tin tiếp nhận
              </span>
              {/* <ion-icon name="chevron-forward-outline"></ion-icon> */}
              <div className={styles.lineProgress}></div>
              <span className={`${tab === 2 ? styles.active : ""}`}>
                Chọn dịch vụ
              </span>
              {/* <ion-icon name="chevron-forward-outline"></ion-icon> */}
              <div className={styles.lineProgress}></div>
              <span className={`${tab === 3 ? styles.active : ""}`}>
                Chọn lồng
              </span>
              {/* <ion-icon name="chevron-forward-outline"></ion-icon> */}
              <div className={styles.lineProgress}></div>
              <span className={`${tab === 4 ? styles.active : ""}`}>
                Xác nhận
              </span>
            </div>
            {tab == 1 && (
              <div className={styles.boarding}>
                <div className={styles.customerInfo}>
                  <h4 className={styles.title}>Thông tin khách hàng</h4>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Tên khách hàng:</span>
                    <span>{bookingInfo?.customer_name}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Số điện thoại:</span>
                    <span>{bookingInfo?.bird?.customer?.phone}</span>
                  </div>
                </div>
                <div className={styles.birdInfo}>
                  <h4 className={styles.title}>Thông tin chim</h4>
                  {/* <div className={styles.lineItem}>
                    <span className={styles.label}>Mã số:</span>
                    <span>{bookingInfo?.booking_id}</span>
                  </div> */}
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Tên chim:</span>
                    <span>{birdProfile?.name}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Ngày nở:</span>
                    <span>{birdProfile?.hatching_date}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Giới tính:</span>
                    <span>{birdProfile?.gender}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Giống:</span>
                    <select
                      onChange={handleBirdBreedSelection}
                      className={styles.selectBreed}
                    >
                      {birdBreedList &&
                        birdBreedList.length > 0 &&
                        birdBreedList.map((item) => {
                          if (item.breed === birdProfile?.bird_breed.breed) {
                            return (
                              <option
                                key={item.breed_id}
                                value={item.breed_id}
                                selected={true}
                              >
                                {item.breed}
                              </option>
                            );
                          } else {
                            return (
                              <option key={item.breed_id} value={item.breed_id}>
                                {item.breed}
                              </option>
                            );
                          }
                        })}
                    </select>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Kích thước:</span>
                    <span>{birdProfile?.bird_breed.bird_size.size}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Microchip:</span>
                    <span>{birdProfile?.ISO_microchip}</span>
                  </div>
                </div>
              </div>
            )}
            {tab == 2 && (
              <div className={styles.boardingChosen}>
                <div className={styles.sizeBirdChosen}>
                  <h4 className={styles.title}>Size chim: </h4>
                  <div className={styles.sizeBirdWrapper}>
                    {birdSizeList.map((item, index) => {
                      if (birdSizeSelected === item.bird_size_id) {
                        return (
                          <div
                            key={item.size}
                            className={styles.sizeBirdItemActive}
                            onClick={() =>
                              setBirdSizeSelected(item.bird_size_id)
                            }
                          >
                            <p>{item.size}</p>
                            <span>{item.breeds}</span>
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={item.size}
                            className={styles.sizeBirdItem}
                            onClick={() => handleClickSize()}
                          >
                            <p>{item.size}</p>
                            <span>{item.breeds}</span>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
                <div className={styles.serviceChosen}>
                  <h4 className={styles.title}>Dịch vụ: </h4>
                  <div className={styles.serviceWrapper}>
                    {serviceList.map((item, index) => (
                      <div
                        className={
                          serviceSelected.service_id === item.service_id
                            ? styles.serviceItemActive
                            : styles.serviceItem
                        }
                        key={index}
                        onClick={() => handleServiceClick(item)}
                      >
                        <h5>{item.package_name}</h5>
                        <div className={styles.serviceDesc}>
                          {item.description}
                        </div>
                        <span className={styles.price}>
                          {formattedPrice(item.price)}
                          <sup className={styles.unitPrice}></sup>
                          <sub>/ngày</sub>
                        </span>
                        <br></br>
                        {/* <button>Thêm</button> */}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.timeManage}>
                  <h4 className={styles.title}>Thời gian đặt: </h4>
                  <div style={{marginBottom: 10}}>
                    <label className={styles.labelSelect}>Ngày tiếp nhận: </label>
                    <input
                      type="date"
                      value={arrivalDate || ""}
                      onChange={handleArrivalDateChange}
                    />
                  </div>
                  <div>
                    <label className={styles.labelSelect}>Ngày kết thúc: </label>
                    <input
                      type="date"
                      value={departureDate || ""}
                      onChange={handleDepartureDateChange}
                    />
                  </div>
                </div>
              </div>
            )}
            {tab == 3 && (
              <div className={styles.boardingChosen}>
                <div className={styles.timeManage}>
                  <h4 className={styles.title}>Tra lịch lồng: </h4>
                  <div style={{marginBottom: 10}}>
                    <label className={styles.labelSelect} style={{minWidth: 50}}>Từ: </label>
                    <input
                      type="date"
                      value={startDate || ""}
                      onChange={handleStartDateChange}
                    />
                  </div>
                  <div>
                    <label className={styles.labelSelect} style={{minWidth: 50}}>Đến: </label>
                    <input
                      type="date"
                      value={endDate || ""}
                      onChange={handleEndDateChange}
                    />
                  </div>
                  <table className={styles.tableTimeManage}>
                    <thead>
                      <tr>
                        <th>Lồng</th>
                        {dateRange.map((date) => (
                          <th key={date}>{formatDate(date)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {startDate &&
                        endDate &&
                        cageList.map((cage) => (
                          <tr key={cage.cage_id}>
                            <td>{cage.cage_id}</td>
                            {dateRange.map((date) => (
                              <TableCell
                                key={date}
                                date={date}
                                cage={cage}
                                markStart={formatDate(cage.mark_start)}
                                markEnd={formatDate(cage.mark_end)}
                                cageList={cageList}
                              />
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <span className={styles.tableTimeManageDesc}>
                    *Lịch nội trú theo khoảng thời gian được chọn
                  </span>
                </div>
                <h4 className={styles.title}>Chọn lồng </h4>
                <div className={styles.cageChosen}>
                  {cageList.length == 0 && (
                    <span className={styles.tableTimeManageDesc}>
                      *Không có lồng phù hợp
                    </span>
                  )}
                  {cageList.length > 0 &&
                    cageList.map((item, index) => (
                      item.status === "empty" ?
                      <div
                        key={index}
                        className={
                          item?.cage_id === cageSelected?.cage_id
                            ? styles.cageItemSelected
                            : styles.cageItem
                        }
                        onClick={() => handleCageClick(item)}
                      >
                        <p style={{fontWeight: 600}}>L.{item.cage_id}</p>
                        {item.status === "empty" ? 
                          <span>Trống</span> : <span>Đang sử dụng</span>
                      }
                      </div> : 
                      <div
                      key={index}
                      className={styles.cageItemActive}
                      onClick={() => {}}
                    >
                      <p style={{fontWeight: 600}}>L.{item.cage_id}</p>
                      {item.status === "empty" ? 
                        <span>Trống</span> : <span>Đang sử dụng</span>
                    }
                    </div>
                    ))}
                </div>
              </div>
            )}
            {tab == 4 && (
              <div className={styles.confirm}>
                <div className={styles.confirmLeft}>
                  <h3 className={styles.title}>Hình ảnh tiếp nhận</h3>
        <Form.Item
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            beforeUpload={beforeUpload}
            imageBirdBoarding
            onChange={handleChange}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
              />
            ) : (
              uploadButton
            )}
          </Upload>
          <span style={{fontSize: 12, marginTop: 5}}>
              *Dung lượng không vượt quá 5mb
          </span>
        </Form.Item>
              {/* <div className={styles.fileInput} style={{display: 'flex', flexDirection: 'column'}}>
                <input type="file" name="file" id="file" />
                <span style={{fontSize: 12, marginTop: 5}}>
                  *Dung lượng không vượt quá 5mb
                </span>
              </div> */}
                  
                </div>
                <div className={styles.confirmRight}>
                  <h3 className={styles.title}>Xác nhận thông tin</h3>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Mã số:</span>
                    <span>{bookingInfo?.booking_id}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Tên chim:</span>
                    <span>{birdProfile?.name}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Giống:</span>
                    <span>{birdProfile?.bird_breed.breed}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Kích thước:</span>
                    <span>{birdProfile?.bird_breed.bird_size.size}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Giới tính:</span>
                    <span>{birdProfile?.gender}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Dịch vụ:</span>
                    <span>{serviceSelected?.package_name}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Lồng:</span>
                    <span>L.{cageSelected?.cage_id}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Ngày đến:</span>
                    <span>{new Date(arrivalDate).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Ngày trả:</span>
                    <span>
                    {new Date(departureDate).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })} ({totalDays} ngày lưu trú)
                    </span>
                  </div>
                  <div style={{display: 'flex',marginTop: 20}}>
                    <button
                      className={styles.printService}
                      style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                      onClick={handlePrint}
                    >
                      <ion-icon name="print-outline"></ion-icon>
                      In phiếu dịch vụ
                    </button>
                    <button
                      className={styles.printService}
                      style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                      onClick={handlePrint2}
                    >
                      <ion-icon name="print-outline"></ion-icon>
                      In mã số
                    </button>
                  </div>
                  <div style={{ display: "none" }}>
                    <PhieuNoiTru birdProfile={birdProfile} bookingInfo={bookingInfo} boardingData={{ service: serviceSelected?.package_name, price: serviceSelected?.price, arrivalDate, departureDate, totalDays  }} ref={printRef}></PhieuNoiTru>
                  </div>
                  <div style={{ display: "none" }}>
                    <MaSo birdProfile={birdProfile} bookingInfo={bookingInfo} boardingData={{ service: serviceSelected?.package_name, arrivalDate, departureDate, totalDays  }} ref={printRef2}></MaSo>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.metaContent}>
            <div className={styles.boxData}>
              <div>
              <div
                className={styles.boxDataItem}
                onClick={() => setOpenModalProfile(true)}
              >
                <ion-icon name="calendar-clear-outline"></ion-icon>
                <span>Hồ sơ chim nội trú</span>
              </div>
              <div
                className={styles.boxDataItem}
                onClick={() => setOpenModalProfile(true)}
              >
                <ion-icon name="reader-outline"></ion-icon>
                <span>Nội dung tiếp nhận</span>
              </div>
              </div>
            </div>
            {tab === 4 && (
              <button
                className={styles.btnComplete}
                onClick={()=>setModalComplete(true)}
              >
                Hoàn tất tiếp nhận
              </button>
            )}
            <Modal
              title="Hoàn thành tiếp nhận"
              centered
              open={modalComplete}
              onOk={()=>handleConfirmAlert()}
              onCancel={() => setModalComplete(false)}
              cancelText="Đóng"
            >
              <span>Xác nhận hoàn tất tiếp nhận chim nội trú?</span>
            </Modal>
            <button className={styles.btnCancel}>Huỷ</button>
          </div>
        </div>
      </div>
      <ProfileBirdModal
        open={openModalProfile}
        onClose={() => setOpenModalProfile(false)}
      />
      <div className={styles.footerContent}>
        {tab !== 1  && (
          <button
            className={styles.btnBack}
            onClick={() => setTab((tab) => tab - 1)}
          >
            Quay lại
          </button>
        )}
        { tab !== 4 && (
          <button
            className={styles.btnCont}
            onClick={() => setTab((tab) => tab + 1)}
          >
            Tiếp tục
          </button>
        )}
      </div>
    </div>
  );
};

const TableCell = ({ cageId, date, cageList, cage }) => {
  const cellStyle = {
    backgroundColor: "#fff", // Màu mặc định nếu không trùng khớp
  };

  const startDate = formatDate(cage.mark_start); // Format mark_start sang dd/mm
  const endDate = formatDate(cage.mark_end); // Format mark_end sang dd/mm
  const currentDate = formatDate(date); // Format date sang dd/mm

  if (startDate <= currentDate && currentDate <= endDate) {
    cellStyle.backgroundColor = "red"; // Nếu trùng khớp, thay đổi màu thành đỏ
  }

  return <td style={cellStyle} />;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}`;
};

export default Boarding;
