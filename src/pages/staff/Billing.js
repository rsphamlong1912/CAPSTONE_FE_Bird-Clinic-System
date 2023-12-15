import React, { useEffect, useRef, useState } from "react";
import styles from "./Billing.module.scss";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import { api } from "../../services/axios";

import { Tabs, Input } from "antd";
const { Search } = Input;

const Billing = () => {
  const navigate = useNavigate();
  const [billList, setBillList] = useState([]);
  const [serviceFormBoardingList, setServiceFormBoardingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(1);

  const serviceArray = [
    {
      name: "Khám tổng quát & SPA",
      id: 1,
    },
    {
      name: "Nội trú",
      id: 2,
    },
  ];

  const onChange = (key) => {
    console.log("change me", key);
    setTab(key);
  };

  //GET DỮ LIỆU BILL
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/service-form");
        // const filterBill = response.data.data.filter(
        //   (item) => item.status === "pending"
        // );
        setBillList(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchDataBoarding = async () => {
      try {
        const responseBoarding = await api.get("/booking/");
        const filterList = responseBoarding.data.data.filter(
          (item) => item.service_type_id === "ST003"
        );
        setServiceFormBoardingList(filterList);
      } catch (error) {
        console.log(error);
      }
    };

    setTimeout(() => {
      setLoading(false);
    }, 850);
    fetchData();
    fetchDataBoarding();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.headerContent}>
           <div style={{ marginRight: 'auto' }}>
           <h1 className={styles.headerTitle}>DANH SÁCH HÓA ĐƠN</h1>
          </div>
          <div style={{width: "30%"}}>
          <Search size="large" placeholder="Tìm kiếm hóa đơn..." enterButton />
          </div>
      </div>
      <Tabs
        onChange={onChange}
        type="card"
        items={serviceArray.map((item, i) => {
          return {
            label: item.name,
            key: item.id,
          };
        })}
      />
      {tab === 1 && (
        <table>
          <thead>
            <tr>
              <th> STT</th>
              <th> Khách hàng</th>
              <th> Tên chim</th>
              <th> Số điện thoại</th>
              <th> Số lượng dịch vụ</th>
              <th> Tổng tiền</th>
              <th> Ngày tạo đơn</th>
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
                  <td>{item.booking.bird.name}</td>
                  <td>{item.booking.bird.customer.phone}</td>
                  <td>{item.num_ser_must_do}</td>
                  <td>{parseFloat(item.total_price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                  <td>{new Date(item.time_create).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
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

                  <td>
                    <div
                      className={styles.btnCheckin}
                      onClick={() =>
                        navigate(`/billing/${item.service_form_id}`)
                      }
                    >
                      Chi tiết
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
      )}
      {tab === 2 && (
        <table>
          <thead>
            <tr>
              <th> STT</th>
              <th> Khách hàng</th>
              <th> Chim </th>
              <th> Số điện thoại </th>
              <th> Ngày bắt đầu</th>
              {/* <th> Trạng thái</th> */}
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
              serviceFormBoardingList.map((item, index) => (
                <tr key={index}>
                  <td> {index + 1} </td>
                  <td>{item.customer_name}</td>
                  <td>{item.bird.name}</td>
                  <td>{item.bird.customer.phone}</td>
                  <td>{new Date(item.arrival_date).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                  {/* <td>
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
                  </td> */}

                  <td className={styles.grAction}>
                    <div
                      className={styles.btnCheckin}
                      onClick={() =>
                        navigate(`/billing-boarding/${item.booking_id}`)
                      }
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
      )}
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
