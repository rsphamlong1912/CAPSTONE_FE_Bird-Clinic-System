import React, { useState, useEffect } from "react";
import styles from "./PhieuKetQua.module.scss";
import useCurrentDate from "../../hooks/useCurrentDate";

export const PhieuKetQua = React.forwardRef(
  ({ bookingInfo, birdProfile, examData, serviceFormDetailSideArr }, ref) => {
    const { currentDate } = useCurrentDate();

    //   // Tính tổng số tiền từ cột price
    //   const totalPrice = selectedServices.reduce((total, service) => {
    //     const price = parseFloat(service.price);
    //     return total + price;
    //   }, 0);

    //   // Định dạng tổng tiền theo tiền tệ Việt Nam
    //   const formattedPrice = (price) => {
    //     return new Intl.NumberFormat("vi-VN", {
    //       style: "currency",
    //       currency: "VND",
    //     }).format(price);
    //   };
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
        <h3 className={styles.title}>PHIẾU KẾT QUẢ</h3>
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
                <span></span>
              </div>
            </div>
            <div className={styles.birdInfo}>
              <h4 className={styles.subTitle}>Thông tin chim</h4>
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
                <span>{birdProfile?.gender}</span>
              </div>
              <div className={styles.lineItem}>
                <span className={styles.label}>Size:</span>
                <span>{birdProfile?.bird_breed?.bird_size?.size}</span>
              </div>
              <div className={styles.lineItem}>
                <span className={styles.label}>Giống:</span>
                <span>{birdProfile?.bird_breed?.breed}</span>
              </div>
            </div>
            <div className={styles.customerInfo}>
              <h4 className={styles.subTitle}>Kết quả</h4>
              <div className={styles.lineItem}>
                <span className={styles.label}>Triệu chứng:</span>
                <span>{examData?.symptoms}</span>
              </div>
              <div className={styles.lineItem}>
                <span className={styles.label}>Chẩn đoán:</span>
                <span>{examData?.diagnosis}</span>
              </div>
              <div className={styles.lineItem}>
                <span className={styles.label}>Lời khuyên:</span>
                <span>{examData?.additionalNotes}</span>
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
            Bác sĩ phụ trách:
          </span>
          <span>{localStorage.getItem("name")}</span>
        </div>
        <div className={styles.lineItem}>
          <span className={`${styles.label} ${styles.label2}`}>
            Chi tiết dịch vụ:
          </span>
          <div className={styles.detailService}>1. Khám tổng quát</div>
          {serviceFormDetailSideArr &&
            serviceFormDetailSideArr.map((item, index) => (
              <div key={index} className={styles.detailService}>
                {index + 2}. {item.note}
              </div>
            ))}
        </div>
        <div className={styles.footer}>
          <div>{currentDate}</div>
          <div>BS CHỈ ĐỊNH DỊCH VỤ</div>
          <div className={styles.sign}>BS. {localStorage.getItem("name")}</div>
        </div>
      </div>
    );
  }
);
