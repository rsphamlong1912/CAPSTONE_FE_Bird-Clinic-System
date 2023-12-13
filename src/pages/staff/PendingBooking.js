import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./PendingBooking.module.scss";
import { api } from "../../services/axios";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { BsCalendar2 } from "react-icons/bs";
import { Input, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const { Search } = Input;

const PendingBooking = () => {
  const navigate = useNavigate();
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDateForDisplay = (date) => {
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}/${mm}/${yyyy}`;
  };
  const fetchData = async () => {
    try {
      const response = await api.get("/booking");
      const pendingBookings = response.data.data.filter(
        (booking) => booking.status === "pending"
      );

      setCustomerList(pendingBookings);
      setLoading(false); // Move setLoading here to ensure it's called after setting the data
      console.log("pending list", pendingBookings);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to run the effect only once

  const options = {
    title: "Xác nhận!",
    message: "Bạn có muốn xác nhận cuộc hẹn?",
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

  // const handleConfirmAlert = (item) => {
  //   const updatedOptions = {
  //     ...options,
  //     buttons: [
  //       {
  //         label: "Xác nhận",
  //         onClick: async () => {
  //           try {
  //             const response = await api.put(`/booking/${item.booking_id}`, {
  //               status: "booked",
  //             });
  //             toast.success("Xác nhận lịch hẹn thành công!", {
  //               position: "top-right",
  //               autoClose: 5000,
  //               hideProgressBar: false,
  //               closeOnClick: true,
  //               pauseOnHover: true,
  //               draggable: true,
  //               progress: undefined,
  //               theme: "light",
  //             });
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

  const handleConfirmAlert = async (item) => {
    try {
      const response = await api.put(`/booking/${item.booking_id}`, {
        status: "booked",
      });
      fetchData()
      toast.success("Xác nhận lịch hẹn thành công!", {
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

  const handleConfirmCancel = async (item) => {
    try {
      const responseCancel = await api.put(`/booking/${item.booking_id}`, {
        status: "cancelled",
      });
      const responseChangeStatusSlot = await api.put(
        `/veterinarian-slot-detail/${item.time_id}`,
        {
          status: "available",
        }
      );
      if (responseCancel && responseChangeStatusSlot) {
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
        navigate("/track");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.btnSearch}>
        <div style={{ marginRight: "auto" }}>
          <h1 className={styles.headerTitle}>LỊCH HẸN CHỜ PHÊ DUYỆT</h1>
        </div>
        <div style={{ width: "30%" }}>
          <Search size="large" placeholder="Tìm kiếm lịch hẹn..." enterButton />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th> STT</th>
            <th> Khách hàng</th>
            <th> Số điện thoại</th>
            <th> Chim</th>
            <th> Dịch vụ</th>
            <th> Giờ đặt</th>
            <th> Ngày đặt</th>
            <th> Bác sĩ phụ trách</th>
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
              <Loading></Loading>
              <Loading></Loading>
            </>
          )}
          {!loading && customerList.length === 0 && (
            <tr className={styles.NoGroomingDetial}>
              <td colSpan="10">
                <div className={styles.emptyContentCenter}>
                  <BsCalendar2 size={50} className={styles.iconEmpty} />
                  <h3 className={styles.txtNoGrooming}>
                    Không có lịch hẹn chờ phê duyệt.
                  </h3>
                </div>
              </td>
            </tr>
          )}
          {!loading &&
            customerList &&
            customerList.length > 0 &&
            customerList.map((item, index) => (
              <tr key={index}>
                <td> {index + 1} </td>
                <td>{item.customer_name}</td>
                <td>{item.bird.customer.phone}</td>
                <td>{item.bird.name}</td>
                <td>{item.service_type}</td>
                <td>{item.estimate_time}</td>
                <td>{formatDateForDisplay(item.booking_date)}</td>
                <td>
                  <strong>{item.veterinarian.name}</strong>
                </td>
                <td>
                  <p
                    className={`${styles.status} ${
                      item.status === "pending"
                        ? styles.pending
                        : item.status === "booked"
                        ? styles.booked
                        : ""
                    } `}
                  >
                    {item.status === "pending" ? "Chờ duyệt" : ""}
                  </p>
                </td>
                <td className={styles.flexAction}>
                  <Popconfirm
                    placement="top"
                    cancelText="Hủy"
                    title="DUYỆT LỊCH HẸN"
                    description="Bạn có chắc duyệt lịch hẹn này?"
                    icon={
                      <QuestionCircleOutlined style={{ color: "#32B768" }} />
                    }
                    onConfirm={() => handleConfirmAlert(item)}
                  >
                    <div className={styles.btnCheckin}>Duyệt</div>
                  </Popconfirm>
                  <Popconfirm
                    placement="bottom"
                    cancelText="Hủy"
                    title="HỦY LỊCH HẸN"
                    description="Bạn có chắc hủy lịch hẹn này?"
                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                    onConfirm={() => handleConfirmCancel(item)}
                  >
                    <div
                      className={styles.btnCheckin}
                      style={{ backgroundColor: "red" }}
                    >
                      Huỷ
                    </div>
                  </Popconfirm>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className={styles.footerContent}>
        <div className={styles.numberResult}>
          {!loading && customerList.length} kết quả
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
        <div className="status being">
          <LoadingSkeleton></LoadingSkeleton>
        </div>
      </td>
    </tr>
  );
};

export default PendingBooking;
