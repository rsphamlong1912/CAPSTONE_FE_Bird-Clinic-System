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

const cageApi = Array(20).fill(null);
const Boarding = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [tab, setTab] = useState(1);
  const [openModalProfile, setOpenModalProfile] = useState(false);

  const [bookingInfo, setBookingInfo] = useState();
  const [birdProfile, setBirdProfile] = useState();
  const [birdSizeList, setBirdSizeList] = useState();
  const [birdSizeSelected, setBirdSizeSelected] = useState();
  const [serviceList, setServiceList] = useState();
  const [cageList, setCageList] = useState();
  const [serviceSelected, setServiceSelected] = useState();
  const [cageSelected, setCageSelected] = useState();

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

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

  useEffect(() => {
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
        .get(`/cage/schedule_cage?start_date=${startDate}&end_date=${endDate}`)
        .then((response) => {
          // Handle the API response data
          setCageList(
            response.data.data.filter((item) => item.size === birdSizeSelected)
          );
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
        const responseBirdSize = await api.get(`/bird_size`);
        console.log("bird size", responseBirdSize.data.data);
        const filterList = responseBirdSize.data.data.filter(
          (item) => item.bird_size_id !== "SZ005"
        );
        setBirdSizeList(filterList);
        setBirdSizeSelected(responseBirdSize.data.data[0].bird_size_id);
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
          `/servicePackage/?size_id=${birdSizeSelected}&service_type_id=ST003`
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

  //LẤY THÔNG TIN BOOKING
  useEffect(() => {
    const getBooking = async () => {
      try {
        const response = await api.get(`/booking/${bookingId}`);
        setBookingInfo(response.data.data);
        console.log("thong tin booking ne:", response.data.data);

        const responseBird = await api.get(
          `/bird/${response.data.data.bird_id}`
        );
        setBirdProfile(responseBird.data.data);
        console.log("thong tin bird ne:", responseBird.data.data);

        //     //cong them
        //     setAccountId(response.data.data[0].account_id);
        //     setBirdId(response.data.data[0].bird_id);
        //     setVeterinarianId(response.data.data[0].veterinarian_id);
        //     setCustomerName(response.data.data[0].customer_name);
        //     setServiceType(response.data.data[0].service_type);
        //     setServiceTypeId(response.data.data[0].service_type_id);

        //     // Only call getBirdProfile if bookingInfo is available
        //     if (response.data.data[0] && response.data.data[0].bird_id) {
        //       getBirdProfile(response.data.data[0].bird_id);
        //     }
        //     if (response.data.data[0] && response.data.data[0].process_at) {
        //       setTab(response.data.data[0].process_at);
        //       console.log("Set tab r nha", response.data.data[0].process_at);
        //     }

        //     //GET SERVICE FORM DETAIL
        //     const responseServiceFormDetail = await api.get(
        //       `/service_Form_detail/?booking_id=${bookingId}&service_type_id=ST001`
        //     );
        //     console.log("form detail ne", responseServiceFormDetail.data.data[0]);
        //     setServiceFormDetail(responseServiceFormDetail.data.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

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

  const handleConfirmAlert = async (item) => {
    const updatedOptions = {
      ...options,
      buttons: [
        {
          label: "Xác nhận",
          onClick: async () => {
            try {
              if (startDate && endDate && cageSelected) {
                const responsePostBoarding = await api.post(`/boarding`, {
                  booking_id: bookingId,
                  arrival_date: startDate,
                  departure_date: endDate,
                  room_type: "any",
                  bird_id: birdProfile.bird_id,
                });

                const createdResponseServiceForm = await api.post(
                  `/service_Form/`,
                  {
                    bird_id: birdProfile.bird_id,
                    booking_id: bookingId,
                    reason_referral: "any",
                    status: "pending",
                    date: bookingInfo.arrival_date,
                    veterinarian_referral: bookingInfo.veterinarian_id,
                    total_price: serviceSelected.price * dateRange.length,
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
                setTab((tab) => (tab += 1));
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
              <span className={`${tab === 1 ? styles.active : ""}`}>
                Thông tin
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span className={`${tab === 2 ? styles.active : ""}`}>
                Chọn dịch vụ
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span className={`${tab === 3 ? styles.active : ""}`}>
                Chọn lồng
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span className={`${tab === 4 ? styles.active : ""}`}>
                Hoàn tất
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
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Mã số:</span>
                    <span>BCS_5F2YNK</span>
                  </div>
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
                    <span>
                      {birdProfile?.gender === "male" ? "Đực" : "Cái"}
                    </span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Khối lượng:</span>
                    <span>{birdProfile?.weight} gam</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Giống:</span>
                    <span>{birdProfile?.breed}</span>
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
                  <h4 className={styles.title}>Chọn size chim: </h4>
                  <div className={styles.sizeBirdWrapper}>
                    {birdSizeList.map((item, index) => (
                      <div
                        key={item.size}
                        className={`${
                          birdSizeSelected === item.bird_size_id
                            ? styles.sizeBirdItemActive
                            : styles.sizeBirdItem
                        }`}
                        onClick={() => setBirdSizeSelected(item.bird_size_id)}
                      >
                        <p>{item.size}</p>
                        <span>{item.breeds}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.serviceChosen}>
                  <h4 className={styles.title}>Chọn dịch vụ: </h4>
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
                          Lorem Ipsum has been the industry's standard
                        </div>
                        <span className={styles.price}>
                          {item.price}
                          <sup className={styles.unitPrice}>vnđ</sup>
                          <sub>/ngày</sub>
                        </span>
                        <br></br>
                        {/* <button>Thêm</button> */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {tab == 3 && (
              <div className={styles.boardingChosen}>
                <div className={styles.timeManage}>
                  <h4 className={styles.title}>Chọn ngày nội trú: </h4>
                  <div>
                    <label className={styles.labelSelect}>Ngày đến: </label>
                    <input
                      type="date"
                      value={startDate || ""}
                      onChange={handleStartDateChange}
                    />
                  </div>
                  <div>
                    <label className={styles.labelSelect}>
                      Ngày kết thúc:{" "}
                    </label>
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
                      <div
                        key={index}
                        className={
                          item?.cage_id === cageSelected?.cage_id
                            ? styles.cageItemActive
                            : styles.cageItem
                        }
                        onClick={() => handleCageClick(item)}
                      >
                        <p>L.{item.cage_id}</p>
                        <span>BCS_2FEVGF</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {tab == 4 && (
              <div className={styles.confirm}>
                <div className={styles.confirmLeft}>
                  <h3 className={styles.title}>Hình ảnh tiếp nhận</h3>
                  <img
                    src="https://allbirdclinic.net/uploads/3/5/0/0/35002604/7700720.jpg"
                    alt=""
                    className={styles.image}
                  />
                  <button className={styles.btnUpload}>Tải ảnh lên</button>
                </div>
                <div className={styles.confirmRight}>
                  <h3 className={styles.title}>Xác nhận thông tin</h3>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Mã số:</span>
                    <span>BCS_5F2YNK</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Tên chim:</span>
                    <span>{birdProfile?.name}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Giới tính:</span>
                    <span>
                      {birdProfile?.gender === "male" ? "Đực" : "Cái"}
                    </span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Dịch vụ:</span>
                    <span>{serviceSelected?.package_name}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Ngày đến:</span>
                    <span>{startDate}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Ngày trả:</span>
                    <span>
                      {endDate} ({dateRange.length} ngày lưu trú)
                    </span>
                  </div>
                  <div>
                    <button
                      className={styles.printService}
                      onClick={handlePrint}
                    >
                      In phiếu dịch vụ
                    </button>
                  </div>
                  <div style={{ display: "none" }}>
                    <PhieuNoiTru ref={printRef}></PhieuNoiTru>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.metaContent}>
            <div className={styles.boxData}>
              <div
                className={styles.boxDataItem}
                onClick={() => setOpenModalProfile(true)}
              >
                <ion-icon name="calendar-clear-outline"></ion-icon>
                <span>Hồ sơ chim khám</span>
              </div>
            </div>
            {tab === 4 && (
              <button
                className={styles.btnComplete}
                onClick={() => navigate("/boarding")}
              >
                Hoàn thành
              </button>
            )}
          </div>
        </div>
      </div>
      <ProfileBirdModal
        open={openModalProfile}
        onClose={() => setOpenModalProfile(false)}
      />
      <div className={styles.footerContent}>
        {tab !== 1 && tab !== 4 && (
          <button
            className={styles.btnBack}
            onClick={() => setTab((tab) => tab - 1)}
          >
            Quay lại
          </button>
        )}
        {tab === 3 && (
          <button className={styles.btnCont} onClick={handleConfirmAlert}>
            Tiếp tục
          </button>
        )}
        {tab !== 3 && tab !== 4 && (
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
