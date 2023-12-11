import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./HistoryBoarding.module.scss";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";
import { api } from "../../../services/axios";
import { ImFilesEmpty } from "react-icons/im";
import ProfileBirdBoardingModal from "../../../components/modals/ProfileBirdBoardingModal";

const HistoryBoarding = () => {
    const today = new Date();
    const [customerList, setCustomerList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModalProfile, setOpenModalProfile] = useState(false);
    const [birdProfile, setBirdProfile] = useState([]);
    const [birdProfileSize, setBirdProfileSize] = useState([]);
    const [birdProfileBreed, setBirdProfileBreed] = useState([]);
    const [bookingID, setBookingID] = useState("");
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
                        booking.service_type_id == "ST003" &&
                        booking.status == "on_going" ||
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

    const handleButtonClick = (item) => {
        handleViewButtonClick(item.bird_id);
        setBookingID(item.booking_id)
        setOpenModalProfile(true);
    };

    const handleViewButtonClick = (birdId) => {
        const getBirdProfile = async () => {
            try {
                const response = await api.get(`/bird/${birdId}`);
                setBirdProfile(response.data.data);
                setBirdProfileSize(response.data.data.bird_breed.bird_size.size);
                setBirdProfileBreed(response.data.data.bird_breed.breed)
                console.log(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getBirdProfile();
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
                        <th> Số điện thoại</th>
                        <th> Giờ đặt</th>
                        <th> Giờ checkin</th>
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
                    {!loading && customerList.length === 0 && (
                        <tr className={styles.NoGroomingDetial}>
                            <td colSpan="9">
                                <ImFilesEmpty className={styles.iconEmpty} />
                                <h3 className={styles.txtNoGrooming}>Không có lịch sử nội trú nào.</h3>
                            </td>
                        </tr>
                    )}
                    {!loading &&
                        customerList.map((item, index) => (
                            <tr key={index}>
                                <td> {index + 1} </td>
                                <td>{item.customer_name}</td>
                                <td>{item.bird.name}</td>
                                <td>{item.bird.customer.phone}</td>
                                <td>{item.estimate_time}</td>
                                <td>{item.checkin_time}</td>
                                <td>
                                    <p
                                        className={`${styles.status} ${item.status === "finish"
                                            ? styles.finish
                                            : styles.being
                                            } `}
                                    >
                                        {item.status === "finish"
                                            ? "Hoàn tất"
                                            : "Đang nội trú"}
                                    </p>
                                </td>
                                <td>
                                    <div className={styles.btnCheckin} onClick={() => handleButtonClick(item)}>Xem</div>
                                </td>

                            </tr>
                        ))}
                </tbody>
            </table>
            <div className={styles.footerContent}>
                <div className={styles.numberResult}>{!loading && customerList.length} kết quả</div>
            </div>
            <ProfileBirdBoardingModal
                open={openModalProfile}
                birdProfile={birdProfile}
                birdProfileBreed={birdProfileBreed}
                bookingID={bookingID}
                onClose={() => setOpenModalProfile(false)}
            />
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

export default HistoryBoarding;
