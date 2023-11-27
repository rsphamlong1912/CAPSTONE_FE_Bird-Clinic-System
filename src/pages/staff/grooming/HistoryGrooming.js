import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./HistoryGrooming.module.scss";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";
import { api } from "../../../services/axios";
import { ImFilesEmpty } from "react-icons/im";
import ProfileBirdModal from "../../../components/modals/ProfileBirdModal";

const HistoryGrooming = () => {
    const [customerList, setCustomerList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [openModalProfile, setOpenModalProfile] = useState(false);
    const [birdProfile, setBirdProfile] = useState([]);
    const [birdProfileSize, setBirdProfileSize] = useState([]);
    const [birdProfileBreed, setBirdProfileBreed] = useState([]);
    const [bookingID, setBookingID] = useState("");

    useEffect(() => {
        const today = new Date();
        const nextFourDays = [];

        for (let i = 0; i < 5; i++) {
            const nextDay = new Date();
            nextDay.setDate(today.getDate() + i);
            const year = nextDay.getFullYear();
            const month = String(nextDay.getMonth() + 1).padStart(2, "0");
            const day = String(nextDay.getDate()).padStart(2, "0");
            const formattedDate = `${year}-${month}-${day}`;
            nextFourDays.push(formattedDate);
        }
        // Set selectedDate to the first date in the array when component mounts
        if (nextFourDays.length > 0) {
            setSelectedDate(nextFourDays[0]);
        }
        setDates(nextFourDays);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/booking?arrival_date=${selectedDate}`);
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
    }, [selectedDate]);

    const handleButtonClick = (item) => {
        console.log("item ID:", item);
        handleViewButtonClick(item.bird_id);
        setBookingID(item.booking_id)
        setOpenModalProfile(true);
    };

    const handleViewButtonClick = (birdId) => {
        console.log("birdId ID:", birdId);
        // Add logic here to perform any additional actions with the booking ID
        // For example, you can open a modal or navigate to a detailed view.
        // If you have the booking ID in the state, you can pass it to the modal component.
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
                                    <strong>{item.bird.customer.phone}</strong>
                                </td>
                                <td>
                                    <p
                                        className={`${styles.status} ${item.status === "finish"
                                            ? styles.finish
                                            : ""
                                            } `}
                                    >
                                        {item.status === "finish"
                                            ? "Hoàn tất"
                                            : ""}
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
            <ProfileBirdModal
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

export default HistoryGrooming;
