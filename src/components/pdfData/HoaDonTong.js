import React, { useState, useEffect } from "react";
import styles from "./HoaDonTong.module.scss";
import useCurrentDate from "../../hooks/useCurrentDate";
import { api } from "../../services/axios";

export const HoaDonTong = React.forwardRef(
  ({ bookingInfo, serviceFormDetailList }, ref) => {
    const { currentDate } = useCurrentDate();
    const [boardingInfo, setBoardingInfo] = useState();
    const [totalDays, setTotalDays] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // Định dạng tổng tiền theo tiền tệ Việt Nam
    const formattedPrice = (price) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    };
    const today = new Date();
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${day}/${month}/${year}`;
    };
    const [dates, setDates] = useState(formatDate(today));

    const fetchBoarding = async () => {
      try {
        const response = await api.get(`/boarding/${bookingInfo?.booking_id}`);
        console.log("boarding ne", response.data.data);
        setBoardingInfo(response.data.data);
        const oneDay = 24 * 60 * 60 * 1000; // số mili giây trong một ngày
        const firstDate = new Date(response.data.data.arrival_date);
        const secondDate = new Date(response.data.data.departure_date);
        const diffDays = Math.round(
          Math.abs((firstDate - secondDate) / oneDay)
        );
        setTotalDays(diffDays);
        console.log("total day", diffDays);
      } catch (error) {
        console.error("Error fetching veterinarians:", error);
      }
    };
    const fetchBill = async () => {
      try {
        const responseBill = await api.get(
          `/bill/?booking_id=${bookingInfo?.booking_id}`
        );
        console.log("bill ne", responseBill.data.data);

        setTotalPrice(
          responseBill.data.data.reduce((total, item) => {
            const price = parseFloat(item.total_price);
            return total + price;
          }, 0)
        );
      } catch (error) {
        console.error("Error fetching veterinarians:", error);
      }
    };

    useEffect(() => {
      fetchBoarding();
      fetchBill();
    }, []);

    return (
      <div ref={ref} className={styles.container}>
        <div className={styles.flex}>
          <div>
            PHÒNG KHÁM CHIM CẢNH<br></br>
            BIRD CLINIC SYSTEM
          </div>
          <div>
            Ngày {dates}
            <br></br>
            Mã số: {bookingInfo?.booking_id}
          </div>
        </div>
        <h3 className={styles.title}>HOÁ ĐƠN TỔNG</h3>
        <div className={styles.flex}>
          <div className={styles.left}>
            <div className={styles.customerInfo}>
              <h4 className={styles.subTitle}>Thông tin khách hàng</h4>
              <div className={styles.lineItem}>
                <span className={styles.label}>Tên khách hàng:</span>
                <span>{bookingInfo?.customer_name}</span>
              </div>
              <div className={styles.lineItem}>
                <span className={styles.label}>Số điện thoại:</span>
                <span>{bookingInfo?.bird.customer.phone}</span>
              </div>
            </div>
            <div className={styles.birdInfo}>
              <h4 className={styles.subTitle}>Thông tin chim</h4>
              <div className={styles.lineItem}>
                <span className={styles.label}>Tên chim:</span>
                <span>{bookingInfo?.bird.name}</span>
              </div>
            </div>
            <div className={styles.birdInfo}>
              <div className={styles.lineItem}>
                <span className={styles.label}>Bác sĩ phụ trách:</span>
                <span>{bookingInfo?.veterinarian.name}</span>
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <img
              src="https://vinacheck.vn/media/2019/05/ma-qr-code_vinacheck.vm_001.jpg"
              alt=""
              className={styles.qr}
            />
          </div>
        </div>

        <div className={styles.lineItem}>
          <span className={`${styles.label} ${styles.label2}`}>
            Loại dịch vụ:
          </span>
          <table className={styles.table}>
            <tr>
              <th>Tên dịch vụ</th>
              <th>Giá</th>
            </tr>
            {serviceFormDetailList &&
              serviceFormDetailList.length > 0 &&
              serviceFormDetailList.map((item, index) => {
                if (
                  [
                    "SP14",
                    "SP19",
                    "SP24",
                    "SP29",
                    "SP15",
                    "SP20",
                    "SP25",
                    "SP30",
                  ].includes(item.service_package_id)
                ) {
                  return (
                    <tr key={index}>
                      <td>
                        {item.service_package.package_name} ({totalDays} ngày)
                      </td>
                      <td>
                        {formattedPrice(
                          parseFloat(item.price) * parseFloat(totalDays)
                        )}
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={index}>
                      <td>{item.service_package.package_name}</td>
                      <td>{formattedPrice(item.price)}</td>
                    </tr>
                  );
                }
              })}
          </table>
          <div className={styles.lineItem}>
            <span className={styles.total}>Tổng cộng:</span>
            <span>{formattedPrice(totalPrice)}</span>
          </div>
        </div>
        <div className={styles.footer}>
          <div>{currentDate}</div>
          <div>BS PHỤ TRÁCH</div>
          <div className={styles.sign}>
            BS. {bookingInfo?.veterinarian.name}
          </div>
        </div>
      </div>
    );
  }
);
