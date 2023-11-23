import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./HistoryGrooming.module.scss";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";
import { api } from "../../../services/axios";
import { ImFilesEmpty } from "react-icons/im";

const HistoryGrooming = () => {
    const [customerList, setCustomerList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/booking`);
                const filterBookings = response.data.data.filter(
                    (booking) =>
                        booking.service_type_id == "ST002" &&
                        booking.status == "finish"
                );
                setCustomerList(filterBookings);
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
                <div className={styles.left}></div>
                <div className={styles.right}>
                    <div className={styles.btnSearch}>
                        <SearchOutlined />
                    </div>
                    <input type="text" placeholder="Tìm kiếm khách hàng" name="search" />
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th> STT</th>
                        <th> Khách hàng</th>
                        <th> Chim</th>
                        <th> Dịch vụ</th>
                        <th> Giờ đặt</th>
                        <th> Giờ checkin</th>
                        <th> Bác sĩ phụ trách</th>
                        <th> Trạng thái</th>
                        <th> Ngày tiếp nhận</th>
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

                    {!loading && customerList.length === 0 && (
                        <tr className={styles.NoGroomingDetial}>
                            <td colSpan="9">
                                <ImFilesEmpty className={styles.iconEmpty} />
                                <h3 className={styles.txtNoGrooming}>Không có lịch sử tiếp nhận nào.</h3>
                            </td>
                        </tr>
                    )}

                    {!loading &&
                        customerList.map((item, index) => (
                            <tr key={index}>
                                <td> {index + 1} </td>
                                <td>{item.customer_name}</td>
                                <td>{item.bird.name}</td>
                                <td>{item.service_type}</td>
                                <td>{item.estimate_time}</td>
                                <td>{item.checkin_time}</td>
                                <td>
                                    <strong>{item.veterinarian.name}</strong>
                                </td>
                                <td>
                                    <p
                                        className={`${styles.status} ${item.status === "done"
                                                ? styles.being
                                                : ""
                                            } `}
                                    >
                                        {item.status === "done"
                                                ? "Hoàn tất"
                                                : ""}
                                    </p>
                                </td>
                                <td>
                                    {item.arrival_date}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <div className={styles.footerContent}>
                <div className={styles.numberResult}>{!loading && customerList.length} kết quả</div>
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

export default HistoryGrooming;
