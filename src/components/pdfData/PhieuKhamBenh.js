import React, { useState, useEffect } from "react";
import styles from "./PhieuKhamBenh.module.scss";
import useCurrentDate from "../../hooks/useCurrentDate";

export const PhieuKhamBenh = React.forwardRef(
    ({ bookingInfo, serviceFormDetailList, birdProfile }, ref) => {
        const { currentDate } = useCurrentDate();

        // Tính tổng số tiền từ cột price
        const totalPrice = serviceFormDetailList.reduce((total, service) => {
            const price = parseFloat(service.price);
            return total + price;
        }, 0);

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
                <h3 className={styles.title}>PHIẾU KHÁM BỆNH</h3>
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
                        Loại dịch vụ:
                    </span>
                    <table className={styles.table}>
                        <tr>
                            <th>Tên dịch vụ</th>
                            <th>Giá</th>
                        </tr>
                        {serviceFormDetailList &&
                            serviceFormDetailList.length > 0 &&
                            serviceFormDetailList.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.service_package.package_name}</td>
                                    <td>{formattedPrice(item.price)}</td>
                                </tr>
                            ))}
                    </table>
                    <div className={styles.lineItem}>
                        <span className={styles.total}>Tổng cộng:</span>
                        <span>{formattedPrice(totalPrice)}</span>
                    </div>
                </div>
                <div className={styles.footer}>
                    <div>{currentDate}</div>
                    <div>BS PHỤ TRÁCH</div>
                    <div className={styles.sign}>BS. {bookingInfo?.veterinarian.name}</div>
                </div>
            </div>
        );
    }
);
