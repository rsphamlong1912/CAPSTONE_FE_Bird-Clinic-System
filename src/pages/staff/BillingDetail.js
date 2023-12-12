import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./BillingDetail.module.scss";
import "reactjs-popup/dist/index.css";
import ProfileBirdModal from "../../components/modals/ProfileBirdModal";
import { api } from "../../services/axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import readNumber from "vietnamese-number";
import io from "socket.io-client";
import { useReactToPrint } from "react-to-print";
import { HoaDon } from "../../components/pdfData/HoaDon";

const socket = io("https://clinicsystem.io.vn");

const BillingDetail = () => {
  // const location = useLocation();
  // const { socket } = location.state || {};
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [bookingInfo, setBookingInfo] = useState();
  const [serviceFormInfo, setServiceFormInfo] = useState();
  const [serviceSelected, setServiceSelected] = useState();
  const [serviceFormDetailList, setServiceFormDetailList] = useState([]);
  const [vetDetailArr, setVetDetailArr] = useState();
  const [customerId, setCustomerId] = useState();
  const [customerName, setCustomerName] = useState();
  const [customerPhone, setCustomerPhone] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const navigate = useNavigate();

  // Định dạng tổng tiền theo tiền tệ Việt Nam
  const formattedPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const printRef = useRef();
  const handlePrintWithHook = useReactToPrint({
    content: () => printRef.current,
  });

  const handlePrint = async () => {
    try {
      const response = await api.get(
        `/service-form/${serviceFormInfo.service_form_id}`
      );
      console.log("print ne", response.data.data[0].service_form_details);

      setServiceFormDetailList(response.data.data[0].service_form_details);
      // const matchedServices = serviceList.filter((service) => {
      //   return response.data.data[0].service_form_details.find(
      //     (detail) => detail.service_package_id === service.service_package_id
      //   );
      // });
      // setSelectedServices(matchedServices);
      setTimeout(handlePrintWithHook, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchServiceForm = async () => {
    try {
      const responseServiceForm = await api.get(`/service-form/${id}`);
      if (responseServiceForm) {
        setServiceFormInfo(responseServiceForm.data.data[0]);
        // console.log(
        //   "detail",
        //   responseServiceForm.data.data[0].service_form_details
        // );
        const vetDetailArr =
          responseServiceForm.data.data[0].service_form_details.map(
            (item, index) => item.veterinarian_id
          );
        setVetDetailArr(vetDetailArr);
        setServiceSelected(
          responseServiceForm.data.data[0].service_form_details
        );
        setTotalPrice(
          responseServiceForm.data.data[0].service_form_details.reduce(
            (total, service) => {
              const price = parseFloat(service.price);
              return total + price;
            },
            0
          )
        );
        const responseBookingInfo = await api.get(
          `/booking/${responseServiceForm.data.data[0].booking_id}`
        );
        if (responseBookingInfo) {
          setBookingInfo(responseBookingInfo.data.data);
          setCustomerName(responseBookingInfo.data.data.customer_name);
          setCustomerPhone(responseBookingInfo.data.data.bird.customer.phone);
          console.log(
            "setBookingInfo",
            responseBookingInfo.data.data.bird.customer.phone
          );
          setCustomerId(
            responseBookingInfo.data.data.bird.customer.customer_id
          );
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false); // Handle error and set loading to false
    }
  };

  useEffect(() => {
    fetchServiceForm();
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
    willUnmount: () => { },
    afterClose: () => { },
    onClickOutside: () => { },
    onKeypress: () => { },
    onKeypressEscape: () => { },
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
                    `/service-form/${item.service_form_id}`,
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
                    `/service-form/${item.service_form_id}`
                  );

                  setServiceFormDetailList(
                    response.data.data[0].service_form_details
                  );
                  for (const item of response.data.data[0]
                    .service_form_details) {
                    const detailResponse = await api.put(
                      `/service-form-detail/${item.service_form_detail_id}`,
                      {
                        status: "checked_in",
                        veterinarian_id: item.veterinarian_id,
                        process_at: item.process_at,
                      }
                    );

                    console.log(" doi ròi", detailResponse);
                  }
                  // const responseGetBooking = await api.get(
                  //   `/booking/${item.booking_id}`
                  // );
                  // if (responseGetBooking) {
                  //   console.log(
                  //     "booking ne",
                  //     responseGetBooking.data.data.money_has_paid
                  //   );
                  //   const newMoney =
                  //     parseFloat(responseGetBooking.data.data.money_has_paid) +
                  //     parseFloat(item.total_price);
                  //   console.log("Tổng tiền mới:", newMoney);
                  //   const responseUpdateBooking = await api.put(
                  //     `/booking/${item.booking_id}`,
                  //     {
                  //       money_has_paid: newMoney,
                  //     }
                  //   );
                  //   console.log("update money", responseUpdateBooking);
                  // }
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
                    `/service-form/${item.service_form_id}`,
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
                    `/service-form/${item.service_form_id}`
                  );

                  setServiceFormDetailList(
                    response.data.data[0].service_form_details
                  );
                  for (const item of response.data.data[0]
                    .service_form_details) {
                    const detailResponse = await api.put(
                      `/service-form-detail/${item.service_form_detail_id}`,
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
              <div className={styles.infText}>Chi tiết hoá đơn</div>
              <table>
                <thead>
                  <tr>
                    <th> STT</th>
                    <th> Bác sĩ phụ trách</th>
                    <th> Tên dịch vụ</th>
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
                      <Loading></Loading>
                    </>
                  )}
                  {!loading &&
                    serviceSelected &&
                    serviceSelected.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.veterinarian.name}</td>
                        <td>{item.service_package.package_name}</td>
                        <td>{formattedPrice(item.price)}</td>
                        <td>1</td>
                        <td>{formattedPrice(item.price)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {!loading && (
                <div className={styles.totalPrice}>
                  <span className={styles.totalLabel}>Tổng cộng:</span>
                  <span>{totalPrice && formattedPrice(totalPrice)}</span>
                  {/* <div className={styles.vietnameseNumber}>
                    {readNumber(totalPrice)} đồng
                  </div> */}
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
              className={`${styles.btnComplete} ${serviceFormInfo && (serviceFormInfo.status === "paid" || serviceFormInfo.status === "done")
                  ? styles.btnCompleteDisabled
                  : ""
                }`}
              onClick={() =>
                serviceFormInfo &&
                  (serviceFormInfo.status !== "paid" && serviceFormInfo.status !== "done")
                  ? handleConfirmAlert(serviceFormInfo)
                  : null
              }
              disabled={serviceFormInfo && (serviceFormInfo.status === "paid" || serviceFormInfo.status === "done")}
            >
              Xác nhận thanh toán
            </button>
            <button
              className={styles.btnComplete}
              onClick={() => handlePrint()}
            >
              In hoá đơn
            </button>
          </div>
        </div>
      </div>
      <div style={{ display: "none" }}>
        <HoaDon
          serviceFormDetailList={serviceFormDetailList}
          bookingInfo={bookingInfo}
          ref={printRef}
        ></HoaDon>
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
    </tr>
  );
};

export default BillingDetail;
