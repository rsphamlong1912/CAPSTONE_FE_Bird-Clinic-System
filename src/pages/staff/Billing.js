import React, { useEffect, useRef, useState } from "react";
import styles from "./Billing.module.scss";
import useCurrentDate from "../../hooks/useCurrentDate";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { api } from "../../services/axios";
import { useReactToPrint } from "react-to-print";
import { HoaDon } from "../../components/pdfData/HoaDon";
import { toast } from "react-toastify";

const Billing = () => {
  const navigate = useNavigate();
  const [billList, setBillList] = useState([]);
  const [serviceFormDetailList, setServiceFormDetailList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  // const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const printRef = useRef();
  const handlePrintWithHook = useReactToPrint({
    content: () => printRef.current,
  });

  // const handlePrint = async (item) => {
  //   try {
  //     const response = await api.get(`/service_Form/${item.service_form_id}`);

  //     //   setServiceFormDetailList(response.data.data[0].service_form_details);
  //     const matchedServices = serviceList.filter((service) => {
  //       return response.data.data[0].service_form_details.find(
  //         (detail) => detail.service_package_id === service.service_package_id
  //       );
  //     });
  //     setSelectedServices(matchedServices);
  //     setTimeout(handlePrintWithHook, 1000);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  //GET DỮ LIỆU BILL
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/service_Form");
        // const filterBill = response.data.data.filter(
        //   (item) => item.status === "pending"
        // );
        setBillList(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    setTimeout(() => {
      setLoading(false);
    }, 850);
    fetchData();
  });

  //GET DỊCH VỤ TỪ API
  useEffect(() => {
    const fetchServiceList = async () => {
      try {
        const response = await api.get(`/servicePackage/`);

        // const filteredServiceList = response.data.data.filter(
        //   (servicePackage) =>
        //     !["SP1", "SP9", "SP10"].includes(servicePackage.service_package_id)
        // );
        setServiceList(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchServiceList();
  }, []);
  const { currentDate } = useCurrentDate();

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
                const response = await api.put(
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
                for (const item of response.data.data[0].service_form_details) {
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
              } catch (error) {
                console.log(error);
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
                const response = await api.put(
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
                for (const item of response.data.data[0].service_form_details) {
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
              } catch (error) {
                console.log(error);
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
    <div className={styles.container}>
      <div className={styles.headerContent}>
        <div className={styles.left}>DANH SÁCH HOÁ ĐƠN</div>
        <div className={styles.right}>{currentDate}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th> STT</th>
            <th> Khách hàng</th>
            <th> Số lượng dịch vụ</th>
            <th> Tổng tiền</th>
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
            billList.map((item, index) => (
              <tr key={index}>
                <td> {index + 1} </td>
                <td>{item.booking.customer_name}</td>
                <td>{item.num_ser_must_do}</td>
                <td>{item.total_price}</td>
                <td>
                  <p
                    className={`${styles.status} ${
                      item.status === "paid" ? styles.paid : styles.pending
                    } `}
                  >
                    {item.status === "paid"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </p>
                </td>

                <td className={styles.grAction}>
                  <div
                    className={styles.btnCheckin}
                    onClick={() => navigate(`/billing/${item.service_form_id}`)}
                  >
                    Xem
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
      {/* <div style={{ display: "none" }}>
        <HoaDon ref={printRef} selectedServices={selectedServices}></HoaDon>
      </div> */}
      <div className={styles.footerContent}>
        <div className={styles.numberResult}>
          {!loading && billList.length} kết quả
        </div>
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
        <strong>
          <LoadingSkeleton></LoadingSkeleton>
        </strong>
      </td>
      <td>
        <p className="status being">
          <LoadingSkeleton></LoadingSkeleton>
        </p>
      </td>
    </tr>
  );
};

export default Billing;
