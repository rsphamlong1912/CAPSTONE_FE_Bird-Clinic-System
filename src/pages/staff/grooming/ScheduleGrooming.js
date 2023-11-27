import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./ScheduleGrooming.module.scss";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";
import { api } from "../../../services/axios";
import { ImFilesEmpty } from "react-icons/im";

const ScheduleGrooming = () => {
    const today = new Date();
    const [customerList, setCustomerList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dates, setDates] = useState([]);
    const [visibleDates, setVisibleDates] = useState([]);
    
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatDateForDisplay = (date) => {
        const [yyyy, mm, dd] = date.split("-");
        return `${dd}/${mm}`;
    };
    const [selectedDate, setSelectedDate] = useState(formatDate(today));

    useEffect(() => {
        const dateList = [];
        const daysToShow = 30;

        for (let i = -daysToShow; i <= daysToShow; i++) {
            const currentDate = new Date();
            currentDate.setDate(today.getDate() + i);
            dateList.push(formatDate(currentDate));
        }

        setDates(dateList);
        const visibleIndex = dateList.indexOf(formatDate(today));
        setVisibleDates(dateList.slice(visibleIndex - 3, visibleIndex + 4));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/booking?arrival_date=${selectedDate}`);
                const filterBookings = response.data.data.filter(
                    (booking) =>
                        booking.service_type_id === "ST002" &&
                        booking.status !== "pending"
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
    }, [selectedDate]);

    const handlePrevDates = () => {
        const currentIndex = dates.indexOf(visibleDates[0]);
        const prevDates = dates.slice(currentIndex - 1, currentIndex + 6);
        setVisibleDates(prevDates);
        setSelectedDate(prevDates[3]);
    };

    const handleNextDates = () => {
        const currentIndex = dates.indexOf(visibleDates[0]);
        const nextDates = dates.slice(currentIndex + 1, currentIndex + 8);
        setVisibleDates(nextDates);
        setSelectedDate(nextDates[3]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContent}>
                <div className={styles.left}></div>
                <div className={styles.navigation}>
                    <button onClick={handlePrevDates}>&lt;</button>
                </div>
                <div className={styles.middle}>
                    {visibleDates.map((item, index) => (
                        <span
                            key={index}
                            className={item === selectedDate ? styles.active : ""}
                        >
                            {formatDateForDisplay(item)}
                        </span>
                    ))}
                </div>
                <div className={styles.navigation}>
                    <button onClick={handleNextDates}>&gt;</button>
                </div>
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
                        <th> Số điện thoại</th>
                        <th> Trạng thái</th>
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
                                <td>{item.checkin_time !== null && item.checkin_time !== "" ? item.checkin_time : "Chưa đến"}</td>
                                <td>
                                    <strong>{item.bird.customer.phone}</strong>
                                </td>
                                <td>
                                    <p
                                        className={`${styles.status} ${item.status === "checked_in"
                                            ? styles.checkin
                                            : item.status === "on_going"
                                                ? styles.being
                                                : item.status === "finish"
                                                    ? styles.finish
                                                    : ""
                                            } `}
                                    >
                                        {item.status === "checked_in"
                                            ? "Đã checkin"
                                            : item.status === "on_going"
                                                ? "Đang chăm sóc"
                                                : item.status === "finish"
                                                    ? "Hoàn thành"
                                                    : "Chưa checkin"}
                                    </p>
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

export default ScheduleGrooming;
