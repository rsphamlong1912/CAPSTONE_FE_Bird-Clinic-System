import React, { useState, useRef, useEffect } from "react";
import styles from "./TrackDetail.module.scss";
import "reactjs-popup/dist/index.css";
import LoadingSkeleton from "../../components/loading/LoadingSkeleton";
import io from "socket.io-client";
const socket = io("https://clinicsystem.io.vn");

const CreateAppoinment = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.left}>
            <ion-icon name="chevron-back-outline"></ion-icon>
            <span>Trở về</span>
          </div>
          <div className={styles.right}>
            <div className={styles.nameCustomer}>Khách vãng lai</div>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.content}>
            <div className={styles.InfText}>Tạo cuộc hẹn mới</div>
            <div className={styles.element}>
              <h5>THÔNG TIN CHUNG</h5>
              <table>
                <tbody>
                  <tr>
                    <th>Tên dịch vụ</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Tên khách hàng</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Số điện thoại</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Tên chim</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Giờ checkin</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Bác sĩ phụ trách</th>
                    <select className={styles.selectVet}></select>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.history}>
              <img
                src="https://s3-media0.fl.yelpcdn.com/bphoto/hk8tThrdX-iEkolBrYLZBQ/348s.jpg"
                className={styles.image}
                alt=""
              />
              {/* <div className={styles.historyText}>Lịch sử</div>
      <div className={styles.infHS}>
        <p>1. Khám tổng quát</p>
        <p>15/08/2023</p>
        <button className={styles.button}>Xem kết quả</button>
      </div>
      <div className={styles.infHS}>
        <p>2. Chụp X-ray</p>
        <p>20/08/2023</p>
        <button className={styles.button}>Xem kết quả</button>
      </div> */}
            </div>
          </div>
          <div className={styles.metaContent}>
            <div className={styles.boxData}>
              <div className={styles.boxDataItem}>
                <ion-icon name="calendar-clear-outline"></ion-icon>
                <span>Hồ sơ chim khám</span>
              </div>
            </div>
            <button className={styles.btnComplete}>Check-in</button>

            <button className={styles.btnComplete}>Huỷ cuộc hẹn</button>
          </div>
        </div>
      </div>

      <div className={styles.footerContent}>
        <button className={styles.btnBack}>Quay lại</button>
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <div className={styles.mainContent}>
      <div className={styles.content}>
        <div className={styles.InfText}>Thông tin cuộc hẹn</div>
        <div className={styles.element}>
          <h5>
            <LoadingSkeleton></LoadingSkeleton>
          </h5>
          <table>
            <tbody>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <td>
                  <LoadingSkeleton></LoadingSkeleton>
                </td>
              </tr>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <td>
                  <LoadingSkeleton></LoadingSkeleton>
                </td>
              </tr>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <td>
                  <LoadingSkeleton></LoadingSkeleton>
                </td>
              </tr>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <td>
                  <LoadingSkeleton></LoadingSkeleton>
                </td>
              </tr>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <td>
                  <LoadingSkeleton></LoadingSkeleton>
                </td>
              </tr>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <select className={styles.selectVet}>
                  <LoadingSkeleton></LoadingSkeleton>
                </select>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.history}>
          <div className={styles.image}>
            <LoadingSkeleton height={"100%"}></LoadingSkeleton>
          </div>
        </div>
      </div>
      <div className={styles.metaContent}>
        <div className={styles.boxData}>
          <div className={styles.boxDataItem}>
            <ion-icon name="calendar-clear-outline"></ion-icon>
            <span>Hồ sơ chim khám</span>
          </div>
        </div>
        <button className={styles.btnComplete}>Check-in</button>
      </div>
    </div>
  );
};

export default CreateAppoinment;
