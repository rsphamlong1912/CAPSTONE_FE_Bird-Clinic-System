import React, { useEffect, useState } from "react";
import styles from "./ResultToday.module.scss";
import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";
import useCurrentDate from "../../../hooks/useCurrentDate";
import { api } from "../../../services/axios";

const ResultToday = () => {
  const navigate = useNavigate();
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentDate } = useCurrentDate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(
          `/service-form-detail/?veterinarian_id=${localStorage.getItem(
            "account_id"
          )}&service_type_id=ST001`
        );

        const allRequested = response.data.data;
        const filterList = allRequested.filter(
          (item) => item.status === "wait_result"
        );
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

  return (
    <div className={styles.container}>
      <div className={styles.headerContent}>
        <div className={styles.left}>DANH SÁCH TRẢ KẾT QUẢ XÉT NGHIỆM</div>
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

          {!loading &&
            customerList.map((item, index) => (
              <tr key={index}>
                <td> {index + 1} </td>
                <td> {item.customer_name}</td>
                <td> {item.phone}</td>
                <td>{item.bird_name}</td>
                <td>{item.note}</td>
                <td>
                  <p
                    className={`${styles.status} ${
                      item.status === "pending"
                        ? styles.pending
                        : item.status === "on_going"
                        ? styles.being
                        : styles.hasResult
                    } `}
                  >
                    {item.status === "checked_in" || item.status === "pending"
                      ? "Chưa xét nghiệm"
                      : item.status === "on_going"
                      ? "Đang xét nghiệm"
                      : "Đã xét nghiệm"}
                  </p>
                </td>

                <td>
                  <div
                    className={styles.btnTesting}
                    onClick={() =>
                      navigate(`/result/${item.service_form_detail_id}`)
                    }
                  >
                    Trả kết quả
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

export default ResultToday;
