import React, { useEffect, useState } from "react";
import styles from "./ReTestingToday.module.scss";
import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";
import useCurrentDate from "../../../hooks/useCurrentDate";
import { api } from "../../../services/axios";

const ResultTesting = () => {
  const today = new Date();
  const navigate = useNavigate();
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentDate } = useCurrentDate();
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await api.get(
        //   `/service-form-detail/?veterinarian_id=${localStorage.getItem(
        //     "account_id"
        //   )}&service_type_id=ST001`
        // );
        // const response = await api.get(
        //   `/service-form-detail/?veterinarian_id=${localStorage.getItem(
        //     "account_id"
        //   )}&arrival_date=${formatDate(today)}`
        // );
        const response = await api.get(
          `/service-form-detail/?veterinarian_id=${localStorage.getItem(
            "account_id"
          )}`
        );
        const filterList = response.data.data.filter(
          (item) =>
            item.status === "done" 
        );
        console.log("fetch api", filterList);
        setCustomerList(filterList);
      } catch (error) {
        console.log(error);
      }
    };

    setTimeout(() => {
      setLoading(false);
    }, 850);
    fetchData();
  }, []);

  //CHANGE STATUS TO ON_GOING
  const handleChangeStatus = async (item) => {
    try {
      const response = await api.put(
        `/service-form-detail/${item.service_form_detail_id}`,
        {
          status: "on_going",
        }
      );
      navigate(`/retesting/${item.service_form_detail_id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.headerContent}>
        <div className={styles.left}>DANH SÁCH XÉT NGHIỆM HÔM NAY</div>
        <div className={styles.right}>{currentDate}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th> STT</th>
            <th> Khách hàng</th>
            <th> Số điện thoại</th>
            <th> Chim</th>
            <th> Dịch vụ</th>
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

          {!loading &&
            customerList.map((item, index) => (
              <tr key={index}>
                <td> {index + 1}</td>
                <td> {item.customer_name}</td>
                <td> {item.phone}</td>
                <td> {item.bird_name}</td>
                <td>{item.note}</td>

                <td>
                  <div
                    className={styles.btnTesting}
                    onClick={() => navigate(`/done-retesting/${item.service_form_detail_id}`)}
                  >
                    Xem
                  </div>
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

export default ResultTesting;

