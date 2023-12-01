import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./BillingBoardingDetail.module.scss";
import "reactjs-popup/dist/index.css";
import ProfileBirdModal from "../../components/modals/ProfileBirdModal";
import { api } from "../../services/axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import readNumber from "vietnamese-number";
import io from "socket.io-client";
import { Modal } from "antd";
const socket = io("https://clinicsystem.io.vn");

const BillingBoardingDetail = () => {
  // const location = useLocation();
  // const { socket } = location.state || {};
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [serviceFormList, setServiceFormList] = useState([]);
  const [boardingInfo, setBoardingInfo] = useState();
  const [serviceFormBoardingInfo, setServiceFormBoardingInfo] = useState();
  const [serviceSelected, setServiceSelected] = useState();
  const [serviceFormDetailList, setServiceFormDetailList] = useState([]);
  const [vetDetailArr, setVetDetailArr] = useState();
  const [customerId, setCustomerId] = useState();
  const [customerName, setCustomerName] = useState();
  const [customerPhone, setCustomerPhone] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const [totalDays, setTotalDays] = useState(0);
  const [open, setOpen] = useState(false);
  const [openBoardingInfo, setOpenBoardingInfo] = useState(false);
  const [serviceDetailModal, setServiceDetailModal] = useState();
  const navigate = useNavigate();

  // Định dạng tổng tiền theo tiền tệ Việt Nam
  const formattedPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleOpenDetail = (item) => {
    console.log("service chi tiet ne", item);
    setOpen(true);
    setServiceDetailModal(item.service_form_details);
  };
  const handleOpenBoardingInfo = (item) => {
    console.log("service chi tiet ne", item);
    setOpenBoardingInfo(true);
    setServiceDetailModal(item.service_form_details);
  };

  const fetchServiceForm = async () => {
    try {
      const responseBookingInfo = await api.get(`/booking/${id}`);
      if (responseBookingInfo) {
        console.log("booking", responseBookingInfo.data.data);
        setCustomerName(responseBookingInfo.data.data.customer_name);
        setCustomerPhone(responseBookingInfo.data.data.bird.customer.phone);
        setCustomerId(responseBookingInfo.data.data.bird.customer.customer_id);
      }
      const responseServiceForm = await api.get(
        `/service_Form/boarding?booking_id=${id}`
      );
      if (responseServiceForm) {
        const lastElement = responseServiceForm.data.data.slice(-1)[0];

        // Cập nhật state serviceFormBoardingInfo với phần tử cuối cùng
        setServiceFormBoardingInfo(lastElement);
        const dataWithoutLastElement = responseServiceForm.data.data.slice(
          0,
          -1
        );
        setServiceFormList(dataWithoutLastElement);
        setTotalPrice(
          responseServiceForm.data.data.reduce((total, item) => {
            const price = parseFloat(item.total_price);
            return total + price;
          }, 0)
        );
        // console.log(
        //   "detail",
        //   responseServiceForm.data.data[0].service_form_details
        // );
        // const vetDetailArr =
        //   responseServiceForm.data.data[0].service_form_details.map(
        //     (item, index) => item.veterinarian_id
        //   );
        // setVetDetailArr(vetDetailArr);
        // setServiceSelected(
        //   responseServiceForm.data.data[0].service_form_details
        // );
      }
    } catch (error) {
      console.log(error);
      setLoading(false); // Handle error and set loading to false
    }
  };

  const fetchBoardingInfo = async () => {
    try {
      const responseBoardingInfo = await api.get(`/boarding/?booking_id=${id}`);
      setBoardingInfo(responseBoardingInfo.data.data[0]);
      const oneDay = 24 * 60 * 60 * 1000; // số mili giây trong một ngày
      const firstDate = new Date(
        responseBoardingInfo.data.data[0].arrival_date
      );
      const secondDate = new Date(
        responseBoardingInfo.data.data[0].departure_date
      );
      const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
      setTotalDays(diffDays);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceForm();
    fetchBoardingInfo();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []); // Trigger useEffect when ID changes

  useEffect(() => {
    setTimeout(() => {
      console.log("socket id detail: ", socket.id);
      socket.emit("login", { account_id: localStorage.getItem("account_id") });
      console.log("Login sucess");
    }, 500);
  }, []);

  const options = {
    title: "Xác nhận thanh toán",
    message: "Chọn phương thức đã thanh toán:",
    buttons: [
      {
        label: "Tiền mặt",
      },
      {
        label: "Chuyển khoản",
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

  const handleConfirmAlert = (item) => {
    const updatedOptions = {
      ...options,
      buttons: [
        {
          label: "Tiền mặt",
          onClick: async () => {
            try {
              const createdBill = await api.post(`/bill/`, {
                title: "Thanh toán lần 1",
                total_price: item.total_price,
                service_form_id: item.service_form_id,
                booking_id: item.booking_id,
                payment_method: "cash",
                paypal_transaction_id: "any",
                status: "1",
              });

              if (createdBill) {
                //CHANGE STATUS SERVICE FORM
                try {
                  const responseChange = await api.put(
                    `/service_Form/${item.service_form_id}`,
                    {
                      status: "paid",
                    }
                  );
                } catch (error) {
                  console.log(error);
                }

                //CHANGE STATUS SERVICE FORM DETAIL
                try {
                  const response = await api.get(
                    `/service_Form/${item.service_form_id}`
                  );

                  setServiceFormDetailList(
                    response.data.data[0].service_form_details
                  );
                  for (const item of response.data.data[0]
                    .service_form_details) {
                    const detailResponse = await api.put(
                      `/service_Form_detail/${item.service_form_detail_id}`,
                      {
                        status: "done",
                        veterinarian_id: item.veterinarian_id,
                        process_at: item.process_at,
                      }
                    );

                    console.log(" doi ròi", detailResponse);
                  }
                  socket.emit("complete-payment", {
                    customer_id: customerId,
                    vet: vetDetailArr,
                  });
                  fetchServiceForm();
                  toast.success("Dịch vụ đã được thanh toán!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                } catch (error) {
                  console.log(error);
                }
              }
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          label: "Chuyển khoản",
          onClick: async () => {
            try {
              const createdBill = await api.post(`/bill/`, {
                title: "Thanh toán lần 1",
                total_price: item.total_price,
                service_form_id: item.service_form_id,
                booking_id: item.booking_id,
                payment_method: "banking",
                paypal_transaction_id: "any",
                status: "1",
              });

              if (createdBill) {
                toast.success("Dịch vụ đã được thanh toán!", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });

                //CHANGE STATUS SERVICE FORM
                try {
                  const responseChange = await api.put(
                    `/service_Form/${item.service_form_id}`,
                    {
                      status: "paid",
                    }
                  );
                } catch (error) {
                  console.log(error);
                }

                //CHANGE STATUS SERVICE FORM DETAIL
                try {
                  const response = await api.get(
                    `/service_Form/${item.service_form_id}`
                  );

                  setServiceFormDetailList(
                    response.data.data[0].service_form_details
                  );
                  for (const item of response.data.data[0]
                    .service_form_details) {
                    const detailResponse = await api.put(
                      `/service_Form_detail/${item.service_form_detail_id}`,
                      {
                        status: "checked_in",
                        veterinarian_id: item.veterinarian_id,
                        process_at: item.process_at,
                      }
                    );

                    console.log(" doi ròi", detailResponse);
                  }
                  socket.emit("complete-payment", {
                    customer_id: customerId,
                    vet: vetDetailArr,
                  });
                  navigate("/billing");
                } catch (error) {
                  console.log(error);
                }
              }
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
    };
    confirmAlert(updatedOptions);
  };

  function convertTime(originalTime) {
    const dateTime = new Date(originalTime);

    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    const formattedTime = `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    return formattedTime;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.left} onClick={() => navigate(`/billing`)}>
            <ion-icon name="chevron-back-outline"></ion-icon>
            <span>Trở về</span>
          </div>
          <div className={styles.right}>
            <div className={styles.nameCustomer}>KH: {customerName}</div>
          </div>
        </div>
        {/* {loading && <Loading></Loading>} */}

        <div className={styles.mainContent}>
          <div className={styles.content}>
            <div className={styles.customerInfo}>
              <div className={styles.infText}>Thông tin khách hàng</div>
              <div className={styles.lineItem}>
                <span className={styles.label}>Tên khách hàng:</span>
                <span>{customerName}</span>
              </div>
              <div className={styles.lineItem}>
                <span className={styles.label}>Số điện thoại:</span>
                <span>{customerPhone}</span>
              </div>
            </div>
            <div className={styles.billingInfo}>
              <div className={styles.infText}>Thông tin nội trú</div>
              <table>
                <thead>
                  <tr>
                    <th> STT</th>
                    <th>Ngày gửi</th>
                    <th>Ngày trả</th>
                    <th>Thành tiền</th>
                    <th> Trạng thái</th>
                    <th> Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <>
                      <Loading></Loading>
                    </>
                  )}

                  {!loading && (
                    <tr>
                      <td>0</td>
                      <td> {boardingInfo.arrival_date} </td>
                      <td>{boardingInfo.departure_date}</td>
                      <td>
                        {formattedPrice(serviceFormBoardingInfo.total_price)}
                      </td>
                      <td>
                        <p
                          className={`${styles.status} ${
                            serviceFormBoardingInfo.status === "paid" ||
                            serviceFormBoardingInfo.status === "done"
                              ? styles.paid
                              : styles.pending
                          } `}
                        >
                          {serviceFormBoardingInfo.status === "paid" ||
                          serviceFormBoardingInfo.status === "done"
                            ? "Đã thanh toán"
                            : "Chưa thanh toán"}
                        </p>
                      </td>

                      <td className={styles.grAction}>
                        <ion-icon
                          name="eye-outline"
                          onClick={() =>
                            handleOpenBoardingInfo(serviceFormBoardingInfo)
                          }
                        ></ion-icon>
                        <div
                          className={styles.btnCheckin}
                          onClick={() =>
                            handleConfirmAlert(serviceFormBoardingInfo)
                          }
                        >
                          Thanh toán
                        </div>
                        {/* <div
                    className={styles.btnCheckin}
                    onClick={() => handleConfirmAlert(item)}
                  >
                    Xác nhận
                  </div> */}
                        {/* {item.status === "paid" && (
                    <div
                      className={`${styles.btnCheckin} ${styles.viewDetail} `}
                      onClick={() => handlePrint(item)}
                    >
                      In hoá đơn
                    </div>      
                  )} */}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className={styles.infText}>Chi tiết dịch vụ</div>
              <table>
                <thead>
                  <tr>
                    <th> STT</th>
                    <th>Mã ID</th>
                    <th>Thời gian tạo</th>
                    <th>Số dịch vụ</th>
                    <th>Thành tiền</th>
                    <th> Trạng thái</th>
                    <th> Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <>
                      <Loading></Loading>
                      <Loading></Loading>
                      <Loading></Loading>
                      <Loading></Loading>
                      <Loading></Loading>
                    </>
                  )}

                  {!loading &&
                    serviceFormList.map((item, index) => (
                      <tr key={index}>
                        <td> {index + 1} </td>
                        <td> {item.service_form_id} </td>
                        <td> {convertTime(item.time_create)} </td>
                        <td>{item.num_ser_must_do}</td>
                        <td>{formattedPrice(item.total_price)}</td>
                        <td>
                          <p
                            className={`${styles.status} ${
                              item.status === "paid" || item.status === "done"
                                ? styles.paid
                                : styles.pending
                            } `}
                          >
                            {item.status === "paid" || item.status === "done"
                              ? "Đã thanh toán"
                              : "Chưa thanh toán"}
                          </p>
                        </td>

                        <td className={styles.grAction}>
                          <ion-icon
                            name="eye-outline"
                            onClick={() => handleOpenDetail(item)}
                          ></ion-icon>
                          <div
                            className={styles.btnCheckin}
                            onClick={() => handleConfirmAlert(item)}
                          >
                            Thanh toán
                          </div>
                          {/* <div
                    className={styles.btnCheckin}
                    onClick={() => handleConfirmAlert(item)}
                  >
                    Xác nhận
                  </div> */}
                          {/* {item.status === "paid" && (
                    <div
                      className={`${styles.btnCheckin} ${styles.viewDetail} `}
                      onClick={() => handlePrint(item)}
                    >
                      In hoá đơn
                    </div>      
                  )} */}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <Modal
                title="Chi tiết dịch vụ"
                centered
                open={openBoardingInfo}
                onOk={() => setOpenBoardingInfo(false)}
                onCancel={() => setOpenBoardingInfo(false)}
                width={900}
                footer={null}
              >
                <table>
                  <thead>
                    <tr>
                      <th> STT</th>
                      <th> Tên</th>
                      <th> Đơn giá</th>
                      <th> Số ngày</th>
                      <th> Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <>
                        <Loading></Loading>
                        <Loading></Loading>
                        <Loading></Loading>
                        <Loading></Loading>
                        <Loading></Loading>
                      </>
                    )}
                    {serviceDetailModal &&
                      serviceDetailModal.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.note}</td>
                          <td>{formattedPrice(item.service_package.price)}</td>
                          <td>{totalDays}</td>
                          <td>
                            {formattedPrice(
                              item.service_package.price * totalDays
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Modal>
              <Modal
                title="Chi tiết dịch vụ"
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={900}
                footer={null}
              >
                <table>
                  <thead>
                    <tr>
                      <th> STT</th>
                      <th> Tên</th>
                      <th> Đơn giá</th>
                      <th> Số lượng</th>
                      <th> Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <>
                        <Loading></Loading>
                        <Loading></Loading>
                        <Loading></Loading>
                        <Loading></Loading>
                        <Loading></Loading>
                      </>
                    )}
                    {serviceDetailModal &&
                      serviceDetailModal.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.note}</td>
                          <td>{formattedPrice(item.service_package.price)}</td>
                          <td>1</td>
                          <td>{formattedPrice(item.service_package.price)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Modal>
              {!loading && (
                <div className={styles.totalPrice}>
                  <span className={styles.totalLabel}>Tổng cộng:</span>
                  <span>{totalPrice && formattedPrice(totalPrice)}</span>
                  <div className={styles.vietnameseNumber}>
                    {totalPrice && readNumber(totalPrice)} đồng
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.metaContent}>
            <div className={styles.boxData}>
              <div
                className={styles.boxDataItem}
                // onClick={() => setOpenModalProfile(true)}
              >
                <ion-icon name="calendar-clear-outline"></ion-icon>
                <span>Hồ sơ chim khám</span>
              </div>
            </div>
            <button
              className={styles.btnComplete}
              //   onClick={() => handleConfirmAlert(serviceFormInfo)}
            >
              Thanh toán tất cả
            </button>
          </div>
        </div>
      </div>
      {/* <ProfileBirdModal
        open={openModalProfile}
        onClose={() => setOpenModalProfile(false)}
      /> */}
      <div className={styles.footerContent}>
        <button className={styles.btnBack} onClick={() => navigate(`/billing`)}>
          Quay lại
        </button>

        {/* <button
          className={styles.btnCont}
          onClick={() => setTab((tab) => tab + 1)}
        >
          Tiếp tục
        </button> */}
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <tr>
      <td>
        <LoadingSkeleton></LoadingSkeleton>
      </td>
      <td>
        <LoadingSkeleton></LoadingSkeleton>
      </td>
      <td>
        <LoadingSkeleton></LoadingSkeleton>
      </td>
      <td>
        <LoadingSkeleton></LoadingSkeleton>
      </td>
      <td>
        <LoadingSkeleton></LoadingSkeleton>
      </td>
      <td>
        <LoadingSkeleton></LoadingSkeleton>
      </td>
    </tr>
  );
};

export default BillingBoardingDetail;
