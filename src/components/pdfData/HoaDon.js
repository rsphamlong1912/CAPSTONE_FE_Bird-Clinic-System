import React, { useState, useEffect } from "react";
import styles from "./HoaDon.module.scss";
import useCurrentDate from "../../hooks/useCurrentDate";

export const HoaDon = React.forwardRef(
  ({ bookingInfo, billDetailList }, ref) => {
    const { currentDate } = useCurrentDate();

    // Tính tổng số tiền từ cột price
    // const totalPrice = billDetailList.reduce((total, service) => {
    //   const price = parseFloat(service.price);
    //   return total + price;
    // }, 0);

    // Định dạng tổng tiền theo tiền tệ Việt Nam
    const formattedPrice = (price) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    };
    return (
      <div ref={ref} className={styles.container}>
        <div className={styles.flex}>
          <div>
            PHÒNG KHÁM CHIM CẢNH<br></br>
            BIRD CLINIC SYSTEM
          </div>
          <div>
            Ngày 21/09/2023<br></br>
            Mã số: BCS_0FUBFEN
          </div>
        </div>
        <h3 className={styles.title}>HOÁ ĐƠN</h3>
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
            {billDetailList &&
              billDetailList.length > 0 &&
              billDetailList.map((item, index) => (
                <tr key={index}>
                  <td>{item.service_package.package_name}</td>
                  <td>{formattedPrice(item.price)}</td>
                </tr>
              ))}
          </table>
          <div className={styles.lineItem}>
            <span className={styles.total}>Tổng cộng:</span>
            {/* <span>{formattedPrice(totalPrice)}</span> */}
          </div>
        </div>
        <div className={styles.footer}>
          <div>{currentDate}</div>
          <div>BS CHỈ ĐỊNH DỊCH VỤ</div>
          <div className={styles.sign}>BS. Trịnh Ngọc Bảo</div>
        </div>
      </div>
    );
  }
);
