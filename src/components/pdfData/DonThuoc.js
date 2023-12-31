import React, { useState, useEffect } from "react";
import styles from "./DonThuoc.module.scss";
import useCurrentDate from "../../hooks/useCurrentDate";
import { api } from "../../services/axios";

export const DonThuoc = React.forwardRef(
    ({ bookingInfo, birdProfile, forms, customerPhone }, ref) => {
        const { currentDate } = useCurrentDate();
        const today = new Date();
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${day}/${month}/${year}`;
        };
        const [dates, setDates] = useState(formatDate(today));
        return (
            <div ref={ref} className={styles.container}>
                <div className={styles.flex}>
                    <div>
                        PHÒNG KHÁM CHIM CẢNH<br></br>
                        BIRD CLINIC SYSTEM
                    </div>
                    <div>
                        Ngày {dates}<br></br>
                        Mã số: {bookingInfo?.booking_id}
                    </div>
                </div>
                <h3 className={styles.title}>ĐƠN THUỐC</h3>
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
                                <span>{customerPhone}</span>
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
                        Bác sĩ chỉ định:
                    </span>
                    <span>{localStorage.getItem("name")}</span>
                </div>
                <div className={styles.lineItem}>
                    <span className={`${styles.label} ${styles.label2}`}>
                        Thông tin đơn thuốc:
                    </span>
                    <table className={styles.table}>
                        <tr>
                            <th>Tên thuốc</th>
                            <th>Số liều dùng/ngày</th>
                            <th>Đơn vị</th>
                        </tr>
                        {forms.map((item, index) => (
                            <tr>
                                <td>{item.selectedMedicine}</td>
                                <td>{item.day * item.unit}/{item.day} ngày</td>
                                <td>{item.type}</td>
                            </tr>
                        ))}
                    </table>
                </div>
                <div className={styles.footer}>
                    <div>{currentDate}</div>
                    <div>BS KÊ THUỐC</div>
                    <div className={styles.sign}>BS. {localStorage.getItem("name")}</div>
                </div>
            </div>
        );
    }
);
