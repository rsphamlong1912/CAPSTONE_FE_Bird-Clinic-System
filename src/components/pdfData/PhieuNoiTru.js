import React, { useState, useEffect } from "react";
import styles from "./PhieuNoiTru.module.scss";
import useCurrentDate from "../../hooks/useCurrentDate";

export const PhieuNoiTru = React.forwardRef(({ bookingInfo, birdProfile, boardingData }, ref) => {
  const { currentDate } = useCurrentDate();

  // Tính tổng số tiền từ cột price
  //   const totalPrice = selectedServices.reduce((total, service) => {
  //     const price = parseFloat(service.price);
  //     return total + price;
  //   }, 0);

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
          {currentDate}<br></br>
          {bookingInfo?.booking_id}
        </div>
      </div>
      <h3 className={styles.title}>PHIẾU NỘI TRÚ</h3>
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
              <span>{bookingInfo?.bird?.customer?.phone}</span>
            </div>
          </div>
          <div className={styles.birdInfo}>
            <h4 className={styles.subTitle}>Thông tin chim</h4>
            <div className={styles.lineItem}>
              <span className={styles.label}>Tên chim:</span>
              <span>{bookingInfo?.bird?.name}</span>
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
        <span>{bookingInfo?.veterinarian?.name}</span>
      </div>
      <div className={styles.lineItem}>
        <span className={`${styles.label} ${styles.label2}`}>
          Thông tin nội trú:
        </span>
        <div className={styles.lineItem}>
          <span className={styles.label}>Mã số:</span>
          <span>{bookingInfo?.booking_id}</span>
        </div>
        <div className={styles.lineItem}>
          <span className={styles.label}>Dịch vụ:</span>
          <span>{boardingData?.service} - {formattedPrice(boardingData?.price)}</span>
        </div>
        <div className={styles.lineItem}>
          <span className={styles.label}>Ngày đến:</span>
          <span>{new Date(boardingData?.arrivalDate).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
        </div>
        <div className={styles.lineItem}>
          <span className={styles.label}>Ngày trả:</span>
          <span>{new Date(boardingData?.departureDate).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })} ({boardingData?.totalDays} ngày lưu trú)</span>
        </div>

      </div>
      <div className={styles.footer}>
        <div>{currentDate}</div>
        <div>BS PHỤ TRÁCH</div>
        <div className={styles.sign}>BS. {bookingInfo?.veterinarian?.name}</div>
      </div>
    </div>
  );
});
